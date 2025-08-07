// controllers/jobController.js
const Job = require("../models/jobModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Company = require("../models/companyModel");
const { createNotification } = require("./notificationController");

const postJob = async (req, res) => {
    try {
        const { id: companyId, role } = req.user;

        if (role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can post jobs." });
        }
        
        const { jobTitle, minPrice, maxPrice, salaryType, jobLocation, experienceLevel, employmentType, description, skills } = req.body;
        
        if (!jobTitle || !jobLocation || !description) {
            return res.status(400).json({ success: false, message: "Title, location, and description are required." });
        }

        const newJob = new Job({
            jobTitle,
            minPrice: Number(minPrice) || 0,
            maxPrice: Number(maxPrice) || 0,
            salaryType,
            jobLocation,
            experienceLevel,
            employmentType,
            description,
            skills,
            postedBy: companyId,
        });

        const savedJob = await newJob.save();

        res.status(201).json({ 
            success: true, 
            message: 'Job posted successfully!', 
            job: savedJob 
        });

        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                const postingCompany = await Company.findById(companyId).select('companyName');
                if (!postingCompany) return; 

                const companyName = postingCompany.companyName;

                const admins = await Admin.find({}).select('_id');
                for (const admin of admins) {
                    await createNotification(
                        admin._id, 'admin',
                        `New job '${savedJob.jobTitle}' posted by ${companyName}.`,
                        `/admin/jobs/${savedJob._id}`,
                        io, onlineUsers
                    );
                }

                const users = await User.find({}).select('_id');
                for (const user of users) {
                    await createNotification(
                        user._id, 'user',
                        `New job posted: ${savedJob.jobTitle}`,
                        `/job/${savedJob._id}`, 
                        io, onlineUsers
                    );
                }

                await createNotification(
                    companyId, 'company',
                    `Your job "${savedJob.jobTitle}" has been posted successfully.`,
                    `/company/jobs/${savedJob._id}`, 
                    io, onlineUsers
                );

                console.log(`Notifications processed for new job: ${savedJob._id}`);
            } catch (notificationError) {
                console.error("Error sending 'New Job Posted' notifications:", notificationError);
            }
        })();

    } catch (err) {
        console.error("Post Job Error:", err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ message: "Only companies can view their jobs." });
        }

        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        const jobCount = jobs.length;

        res.status(200).json({ success: true, jobs, jobCount });
    } catch (err) {
        console.error("Get My Jobs Error:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

const getActiveJobsCount = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({ message: "Only companies can view their active job count." });
        }
        const count = await Job.countDocuments({ postedBy: req.user.id, status: "active" });
        res.status(200).json({ success: true, count });
    } catch (err) {
        console.error("Get Active Jobs Count Error:", err);
        res.status(500).json({ message: "Server error while fetching active jobs count.", error: err.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate('postedBy', 'companyName logo'); 

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        res.status(200).json({ success: true, job: job });

    } catch (err) {
        console.error("Get Job By ID Error:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid job ID format." });
        }
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const { id: companyId, role } = req.user;

        if (role !== "company") {
            return res.status(403).json({ success: false, message: "Only companies can update jobs." });
        }

        const { id: jobId } = req.params;
        const updateData = { ...req.body };
        if (updateData.skills && Array.isArray(updateData.skills)) {
            updateData.skills = updateData.skills.map(skill => skill.value || skill);
        }

        const job = await Job.findOneAndUpdate(
            { _id: jobId, postedBy: companyId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or you don't have permission to update it." });
        }
        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                await createNotification(
                    companyId, 'company',
                    `Your job posting "${job.jobTitle}" has been updated successfully.`,
                    `/company/jobs/${job._id}`, 
                    io, onlineUsers
                );
                
                console.log(`Notification sent for updated job: ${job.jobTitle}`);

            } catch (notificationError) {
                console.error("Failed to send 'Job Updated' notification:", notificationError);
            }
        })();
        res.status(200).json({ success: true, message: "Job updated successfully", job });
        
    } catch (err) {
        console.error("Update Job Error:", err);
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: "Validation Error", errors });
        }
        res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id: companyId, role } = req.user;

        if (role !== "company") {
            return res.status(403).json({ message: "Only companies can delete jobs." });
        }

        const { id: jobId } = req.params;
        
        const job = await Job.findOneAndDelete({ _id: jobId, postedBy: companyId });

        if (!job) {
            return res.status(404).json({ message: "Job not found or you don't have permission to delete it." });
        }
        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                const company = await Company.findById(companyId).select('companyName');
                const companyName = company ? company.companyName : 'A company';

                await createNotification(
                    companyId, 'company',
                    `You have successfully deleted the job posting: "${job.jobTitle}".`,
                    '/company-jobs', 
                    io, onlineUsers
                );

                const admins = await Admin.find({}).select('_id');
                for (const admin of admins) {
                    await createNotification(
                        admin._id, 'admin',
                        `Company "${companyName}" deleted the job: "${job.jobTitle}".`,
                        '/admin/jobs', 
                        io, onlineUsers
                    );
                }
                
                console.log(`Notifications processed for deleted job: ${job.jobTitle}`);

            } catch (notificationError) {
                console.error("Failed to send 'Job Deleted' notifications:", notificationError);
            }
        })();
        res.status(200).json({ success: true, message: "Job deleted successfully" });
        
    } catch (err) {
        console.error("Delete Job Error:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const getRecentJobs = async (req, res) => {
    try {
        
        const recentJobs = await Job.find({})
            .sort({ createdAt: -1 }) 
            .limit(5) // Limit to 5 jobs
            .populate('postedBy', 'companyName'); 

        const formattedJobs = recentJobs.map(job => ({
            _id: job._id,
            title: job.jobTitle, 
            location: job.jobLocation, 
            type: job.employmentType, 
            createdAt: job.createdAt,
            companyName: job.postedBy ? job.postedBy.companyName : 'N/A', 
        
        }));

        res.json(formattedJobs);
    } catch (error) {
        console.error('Error fetching recent jobs:', error);
        res.status(500).json({ message: 'Server error while fetching recent jobs', error: error.message });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const {
            title,
            location,
            salaryRange,
            salaryType,
            employmentType,
            experienceLevel,
            skills,
            postedWithin,
            sort,
            limit = 0,
        } = req.query;

        let query = { status: "active" };

        if (title) {
            query.$or = [
                { jobTitle: { $regex: title, $options: "i" } },
                { companyName: { $regex: title, $options: "i" } }, 
            ];
        }

        if (location) {
            query.jobLocation = { $regex: location, $options: "i" };
        }

        if (salaryRange) {
            const [min, max] = salaryRange.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                
                query.$and = [
                    { minPrice: { $lte: max } },
                    { maxPrice: { $gte: min } },
                ];
            }
        }

        if (employmentType) {
            query.employmentType = { $regex: employmentType, $options: "i" };
        }

        if (experienceLevel) {
            query.experienceLevel = { $regex: experienceLevel, $options: "i" };
        }

        if (skills) {
            const skillsArray = skills.split(",").map(s => s.trim());
            query.skills = { $in: skillsArray.map(s => new RegExp(s, "i")) };
        }
        
        if (salaryType) {
            query.salaryType = salaryType;
        }

        if (postedWithin) {
            const now = new Date();
            let dateFilter;
            if (postedWithin === "24h") {
                dateFilter = new Date(now.setHours(now.getHours() - 24));
            } else if (postedWithin === "7d") {
                dateFilter = new Date(now.setDate(now.getDate() - 7));
            } else if (postedWithin === "30d") {
                dateFilter = new Date(now.setDate(now.getDate() - 30));
            }
            if (dateFilter) {
                
                query.createdAt = { $gte: dateFilter };
            }
        }

        let sortOptions = { createdAt: -1 }; 
        if (sort === "oldest") sortOptions = { createdAt: 1 };
        else if (sort === "salary-asc") sortOptions = { minPrice: 1 };
        else if (sort === "salary-desc") sortOptions = { minPrice: -1 };

        let jobsQuery = Job.find(query).sort(sortOptions).populate('postedBy', 'companyName');
        if (parseInt(limit) > 0) jobsQuery = jobsQuery.limit(parseInt(limit));

        const jobs = await jobsQuery;

        const formattedJobs = jobs.map(job => ({
            ...job.toObject(), 
            companyName: job.postedBy ? job.postedBy.companyName : 'N/A',
            postedBy: undefined 
        }));

        res.status(200).json({ success: true, jobs: formattedJobs });
    } catch (err) {
        console.error("Get All Jobs Error:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


module.exports = {
    postJob,
    getMyJobs,
    getActiveJobsCount,
    getJobById,
    updateJob,
    deleteJob,
    getRecentJobs,
    getAllJobs,
};