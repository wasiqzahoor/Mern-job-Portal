// controllers/adminJobController.js
const Company = require('../models/companyModel');
const Job = require('../models/jobModel'); 
const Notification = require('../models/notificationModel'); 
const { createNotification } = require('./notificationController'); 

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .populate({
                path: 'postedBy',
                select: 'companyName email logo' 
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            jobs: jobs 
        });

    } catch (error) {
        console.error("Error fetching all jobs for admin:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'companyName email location logo') 
            .select('-__v'); 

        if (!job) {
            return next({ status: 404, message: 'Job not found' });
        }

        res.status(200).json(job);

    } catch (error) {
       
        if (error.name === 'CastError') {
            return next({ status: 400, message: 'Invalid job ID format' });
        }
        // Catch any other server errors
        console.error(`Error fetching job with ID ${req.params.id}:`, error);
        next({ status: 500, message: `Server error fetching job with ID: ${req.params.id}`, error: error });
    }
};


const deleteJob = async (req, res, next) => {
    try {
        const jobToDelete = await Job.findById(req.params.id);

        if (!jobToDelete) {
            return next({ status: 404, message: 'Job not found' });
        }

        const jobTitle = jobToDelete.title;
        const deletedJobId = jobToDelete._id;


        await Job.deleteOne({ _id: deletedJobId }); 

        try {
            const io = req.app.get('io'); 
            const onlineUsers = req.app.get('onlineUsers'); 
            const adminUserId = req.user.id; 

            const notificationMessage = `Job "${jobTitle}" (ID: ${deletedJobId}) has been successfully deleted.`;
            const notificationLink = `/admin/jobs`; 

            await createNotification(
                adminUserId,
                'Admin', 
                notificationMessage,
                notificationLink,
                io,
                onlineUsers
            );
            console.log(`Notification initiated for admin ${adminUserId} regarding job deletion.`);

        } catch (notificationError) {
            console.error("Error creating or sending notification after job deletion:", notificationError);
            
        }

        res.status(200).json({ message: 'Job deleted successfully' });

    } catch (error) {
        if (error.name === 'CastError') {
            return next({ status: 400, message: 'Invalid job ID format' });
        }
        console.error(`Server error deleting job with ID ${req.params.id}:`, error);
        next({ status: 500, message: `Server error deleting job with ID: ${req.params.id}`, error: error });
    }
};


module.exports = {
    getAllJobs,
    getJobById,
    deleteJob,
    
};