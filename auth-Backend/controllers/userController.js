// controllers/userController.js
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const { createNotification } = require("./notificationController");

const getMe = async (req, res) => {
    try {
       
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const responseData = { ...user.toObject(), role: 'user' };

        res.status(200).json({
            success: true,
            user: responseData,
        });

    } catch (error) {
        console.error('Error in User getMe controller:', error);
        res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        const updateData = { ...req.body };

        delete updateData._id;
        delete updateData.role;
        delete updateData.email;
        delete updateData.savedJobs;
        
        const fieldsToParse = ['skills', 'experience', 'education', 'languages', 'socialLinks', 'certifications'];
        fieldsToParse.forEach(field => {
            if (updateData[field] && typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch (e) {
                    updateData[field] = undefined; 
                }
            }
        });

        if (req.files) {
            if (req.files.profilePic) {
                updateData.profilePic = req.files.profilePic[0].path.replace(/\\/g, "/");
            }
            if (req.files.resume) {
                updateData.resume = req.files.resume[0].path.replace(/\\/g, "/");
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true, context: 'query' }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        try {
            const io = req.app.get('io');
            const onlineUsers = req.app.get('onlineUsers');

            await createNotification(
                req.user.id,      
                'user',            
                "Your profile has been updated successfully.", 
                "/view-profile",   
                io,                
                onlineUsers        
            );

        } catch (notificationError) {
            
            console.error("Failed to send 'Profile Updated' notification:", notificationError);
        }
        
        
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully!",
            user: updatedUser 
        });

    } catch (err) {
        console.error("Profile Update Server Error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Failed to update profile." });
    }
};

const saveJob = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only applicants can save jobs.' });
        }

        const { jobId } = req.body;
        if (!jobId) return res.status(400).json({ message: 'Job ID is required.' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        
        const jobExists = await Job.findById(jobId);
        if (!jobExists) return res.status(404).json({ message: 'Job does not exist.' });

        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({ message: 'Job already saved.' });
        }

        user.savedJobs.push(jobId);
        await user.save();

        try {
            const io = req.app.get('io');
            const onlineUsers = req.app.get('onlineUsers');

            const message = `You saved the job: "${jobExists.jobTitle}"`;
            
            const link = '/saved-jobs';

            await createNotification(
                user._id,          
                'user',            
                message,           
                link,              
                io,                
                onlineUsers       
            );

        } catch (notificationError) {
            console.error("Failed to send 'Job Saved' notification:", notificationError);
        }

        res.status(200).json({ success: true, message: 'Job saved successfully!', savedJobsCount: user.savedJobs.length });

    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: 'Server error saving job.' });
    }
};
const unSaveJob = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only applicants can unsave jobs.' });
        }
        const { jobId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();
        res.status(200).json({ success: true, message: 'Job unsaved successfully!', savedJobsCount: user.savedJobs.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error unsaving job.' });
    }
};

const getSavedJobs = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only applicants can view saved jobs.' });
        }
        const user = await User.findById(req.user.id).populate({
            path: 'savedJobs',
            populate: {
                path: 'postedBy',
                select: 'companyName'
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching saved jobs.' });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select('companyName profilePic _id location');
        res.status(200).json({ success: true, companies });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching companies.' });
    }
};

module.exports = {
    getMe,
    updateUserProfile,
    saveJob,
    unSaveJob,
    getSavedJobs,
    getAllCompanies,
};