// controllers/adminApplicationController.js
const Application = require('../models/applicationModel');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Job = require('../models/jobModel');
const { createNotification } = require('./notificationController');

exports.getAllApplications = async (req, res) => {
    try {
        console.log('Fetching all applications for admin...');
        
        
        const applications = await Application.find({})
            .populate({
                path: 'applicant', 
                select: 'firstName lastName email' 
            })
            .populate({
                path: 'job', 
                select: 'jobTitle' 
            })
            .populate({
                path: 'company', 
                select: 'companyName logo' 
            })
            .sort({ createdAt: -1 }); 

        console.log(`Found ${applications.length} applications.`);
        
       
        res.status(200).json({
            success: true,
            applications: applications
        });
        
    } catch (error) {
        console.error("=== ERROR FETCHING ADMIN APPLICATIONS ===");
        console.error("Error details:", error);
        
        res.status(500).json({ 
            success: false,
            message: 'Server Error: Could not retrieve applications.'
        });
    }
};

exports.getApplicationByIdForAdmin = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate({
                path: 'applicant',
                select: 'firstName lastName email phone location profilePic'
            })
            .populate({
                path: 'job',
                select: 'jobTitle jobLocation minPrice maxPrice salaryType employmentType'
            })
            .populate({
                path: 'company',
                select: 'companyName logo'
            });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        res.status(200).json({ success: true, application });

    } catch (error) {
        console.error("Error fetching single application for admin:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You are not authorized to perform this action.' });
        }

        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate('applicant', 'firstName')
            .populate('job', 'jobTitle')
            .populate('company', 'companyName');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        await Application.findByIdAndDelete(applicationId);

        res.status(200).json({ success: true, message: 'Application deleted successfully.' });

        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                const adminWhoDeleted = req.user.id;

                if (application.applicant) {
                    await createNotification(
                        application.applicant._id, 'user',
                        `Your application for "${application.job?.jobTitle || 'a job'}" was removed by an administrator.`,
                        '/my-applications',
                        io, onlineUsers
                    );
                }

                if (application.company) {
                    await createNotification(
                        application.company._id, 'company',
                        `An application for your job "${application.job?.jobTitle || 'a job'}" was removed by an administrator.`,
                        '/applications',
                        io, onlineUsers
                    );
                }

                await createNotification(
                    adminWhoDeleted, 'admin',
                    `You successfully deleted an application for "${application.job?.jobTitle || 'a job'}".`,
                    '/admin/applications',
                    io, onlineUsers
                );

                console.log(`Notifications processed for deleted application: ${applicationId}`);

            } catch (notificationError) {
                console.error("Failed to send 'Application Deleted' notifications:", notificationError);
            }
        })();

    } catch (error) {
        console.error(`Error deleting application by admin:`, error);
        res.status(500).json({ success: false, message: 'Server Error: Could not delete application.' });
    }
};