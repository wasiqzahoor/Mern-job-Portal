// controllers/applicationsController.js
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Admin = require("../models/adminModel");
const Notification = require('../models/notificationModel');
const { createNotification } = require("./notificationController");
// Helper to check if company owns a job/application
const checkCompanyOwnership = async (req, res, targetId, model) => {
    try {
        const item = await model.findById(targetId);
        if (!item) {
            res.status(404).json({ success: false, message: `${model.modelName} not found.` });
            return null;
        }
        const companyId = req.user.id;

        let ownsItem = false;
        if (model.modelName === 'Job') {
            ownsItem = item.postedBy.toString() === companyId;
        } else if (model.modelName === 'Application') {
            const job = await Job.findById(item.job);
            if (job && job.postedBy.toString() === companyId) {
                ownsItem = true;
            }
        }

        if (!ownsItem) {
            res.status(403).json({ success: false, message: `You are not authorized to access this ${model.modelName}.` });
            return null;
        }
        return item;
    } catch (error) {
        console.error(`Error checking ${model.modelName} ownership:`, error);
        res.status(500).json({ success: false, message: "Server error during ownership check." });
        return null;
    }
};


const applyForJob = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ success: false, message: "Only applicants can apply for jobs." });
        }

        const { jobId, coverLetterText } = req.body;
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Job ID is required." });
        }

        const job = await Job.findById(jobId);
        if (!job || !job.postedBy) {
            return res.status(404).json({ success: false, message: "Job not found or is invalid." });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id,
        });
        if (existingApplication) {
            return res.status(409).json({ success: false, message: "You have already applied for this job." });
        }

        const applicantUser = await User.findById(req.user.id).select('firstName lastName resume');

        const application = new Application({
            job: jobId,
            applicant: req.user.id,
            company: job.postedBy, 
            status: "pending",
            appliedDate: Date.now(),
            resumeLink: applicantUser?.resume || null,
            coverLetterText: coverLetterText,
        });
        await application.save();

        res.status(201).json({ 
            success: true, 
            message: "Application submitted successfully!", 
            application 
        });

        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                const applicantName = `${applicantUser.firstName} ${applicantUser.lastName}`;

                await createNotification(
                    job.postedBy, 'company',
                    `New application for '${job.jobTitle}' from ${applicantName}.`,
                    `/applications/${application._id}`, 
                    io, onlineUsers
                );

                const admins = await Admin.find({}).select('_id');
                for (const admin of admins) {
                    await createNotification(
                        admin._id, 'admin',
                        `New application for '${job.jobTitle}' by ${applicantName}.`,
                        `/admin/applications/${application._id}`, // Admin ke liye application details ka link
                        io, onlineUsers
                    );
                }

                await createNotification(
                    req.user.id, 'user',
                    `You have successfully applied for the job: "${job.jobTitle}".`,
                    '/my-applications', // User ke liye uski applications page ka link
                    io, onlineUsers
                );
                
                console.log(`Notifications processed for new application: ${application._id}`);
            } catch (notificationError) {
                console.error("Error sending 'New Application' notifications:", notificationError);
            }
        })();
        
    } catch (err) {
        console.error("Apply For Job Error:", err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ success: false, message: 'Only applicants can view their applications.' });
        }

        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'jobTitle companyName jobLocation employmentType salaryType minPrice maxPrice')
            .sort({ appliedDate: -1 });

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error('Error fetching user applications:', error);
        res.status(500).json({ success: false, message: 'Server error fetching applications.', error: error.message });
    }
};

const getApplicationsForJob = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can view applications for their jobs." });
        }

        const jobId = req.params.jobId;

        const job = await Job.findOne({ _id: jobId, postedBy: req.user.id });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or you don't have permission to view its applications." });
        }

        const applications = await Application.find({ job: jobId })
            .populate("applicant", "firstName lastName email phone profilePic resume")
            .sort({ appliedDate: -1 });

        res.status(200).json({ success: true, applications });
    } catch (err) {
        console.error("Get Applications For Job Error:", err);
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
    }
};

const getCompanyApplications = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can view their applications." });
        }

        const companyId = req.user.id;
        const { searchTerm, status } = req.query;

        const companyJobs = await Job.find({ postedBy: companyId }).select('_id');
        const companyJobIds = companyJobs.map(job => job._id);

        if (companyJobIds.length === 0) {
            return res.status(200).json({ success: true, applications: [] });
        }

        const query = { job: { $in: companyJobIds } };
        if (status) {
            query.status = status;
        }

        let applications = await Application.find(query)
            .populate("job", "jobTitle companyName jobLocation employmentType")
            .populate("applicant", "firstName lastName email phone currentTitle location profilePic");

        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i');
            applications = applications.filter(app => {
                const applicantName = app.applicant ? `${app.applicant.firstName} ${app.applicant.lastName}` : '';
                const jobTitle = app.job ? app.job.jobTitle : '';
                return (
                    applicantName.match(searchRegex) ||
                    jobTitle.match(searchRegex)
                );
            });
        }

        applications.sort((a, b) => b.appliedDate - a.appliedDate);

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error("Error fetching company applications:", error);
        res.status(500).json({ success: false, message: "Server error fetching company applications.", error: error.message });
    }
};

const getCompanyApplicationsCount = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can view their total application count." });
        }

        const companyJobIds = await Job.find({ postedBy: req.user.id }).select('_id');
        const jobIds = companyJobIds.map(job => job._id);

        const count = await Application.countDocuments({ job: { $in: jobIds } });
        res.status(200).json({ success: true, count });
    } catch (err) {
        console.error("Get Company Applications Count Error:", err);
        res.status(500).json({ success: false, message: "Server error while fetching application count.", error: err.message });
    }
};

const getInterviewsScheduledCount = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can view their interview scheduled count." });
        }

        const companyJobIds = await Job.find({ postedBy: req.user.id }).select('_id');
        const jobIds = companyJobIds.map(job => job._id);

        const count = await Application.countDocuments({
            job: { $in: jobIds },
            status: 'interviewed',
            interviewDate: { $ne: null }
        });
        res.status(200).json({ success: true, count });
    } catch (err) {
        console.error("Get Interviews Scheduled Count Error:", err);
        res.status(500).json({ success: false, message: "Server error while fetching interviews count.", error: err.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can update application status." });
        }

        const { id } = req.params; 
        const { status } = req.body;

        const validStatuses = ['pending', 'reviewed', 'interviewed', 'hired', 'rejected'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status provided.` });
        }

        const application = await Application.findById(id).populate('applicant', 'firstName lastName');
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        const job = await Job.findById(application.job);
        if (!job || job.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this application." });
        }

        application.status = status;
        await application.save();

        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');

        if (application.applicant) {
            await createNotification(
                application.applicant._id, 'user',
                `Your application for '${job.jobTitle}' has been updated to '${status}'.`,
                `/my-applications`, 
                io, onlineUsers
            );
        }

        await createNotification(
            req.user.id, 'company', 
            `You updated the status for ${application.applicant.firstName}'s application to '${status}'.`,
            `/company/applications/${application._id}`, 
            io, onlineUsers
        );

        res.status(200).json({ success: true, message: "Application status updated successfully", application });
    } catch (err) {
        console.error("Update Application Status Error:", err);
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const currentUser = req.user;

        const application = await Application.findById(applicationId)
            .populate({
                path: 'applicant', 
                select: 'firstName lastName email phone location profilePic' 
            })
            .populate({
                path: 'job', 
                populate: {
                    path: 'postedBy', 
                    select: 'companyName' 
                }
            });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        const isOwnerCompany = currentUser.role === 'company' && application.company.toString() === currentUser.id.toString();
        
        if (isOwnerCompany) {
            res.status(200).json({ success: true, application });
        } else {
            return res.status(403).json({ success: false, message: "You do not have permission to view this application." });
        }

    } catch (error) {
        console.error("Error fetching single application:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const scheduleInterview = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can schedule interviews." });
        }

        const { id } = req.params; 
        const { interviewDate } = req.body;

        if (!interviewDate) {
            return res.status(400).json({ success: false, message: "Interview date is required." });
        }

        const application = await Application.findById(id).populate('applicant', 'firstName lastName');
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        const job = await Job.findById(application.job);
       
        if (!job || job.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized for this application." });
        }

        application.interviewDate = new Date(interviewDate);
        application.status = "interviewed";
        await application.save();

        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        
        const company = await Company.findById(req.user.id).select('companyName');
        const companyName = company ? company.companyName : 'A company';

        if (application.applicant) {
            const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            await createNotification(
                application.applicant._id, 'user',
                `${companyName} has scheduled an interview for the job '${job.jobTitle}' on ${formattedDate}.`,
                `/my-applications`,
                io, onlineUsers
            );
        }

        await createNotification(
            req.user.id, 'company',
            `You scheduled an interview with ${application.applicant.firstName} for the job '${job.jobTitle}'.`,
            `/company/applications/${application._id}`,
            io, onlineUsers
        );

        res.status(200).json({ success: true, message: "Interview scheduled successfully!", application });
    } catch (err) {
        console.error("Schedule Interview Error:", err);
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
    }
};




module.exports = {
    applyForJob,
    getApplicationsForJob,
    getCompanyApplicationsCount,
    getInterviewsScheduledCount,
    updateApplicationStatus,
    getMyApplications,
    getApplicationById,
    getCompanyApplications,
    scheduleInterview,
};