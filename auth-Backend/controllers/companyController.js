// controllers/companyController.js
const Company = require('../models/companyModel');
const Job = require('../models/jobModel');
const { createNotification } = require('./notificationController');
const path = require('path');


const getMe = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id).select('-password');
        
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }

        const responseData = { ...company.toObject(), role: 'company' };

        res.status(200).json({
            success: true,
            user: responseData, 
        });

    } catch (error) {
        console.error('Error in Company getMe controller:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};


const getProfile = async (req, res) => {
    if (req.user.role !== 'company') {
        return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    try {
        const company = await Company.findById(req.user.id).select('-password logo'); 
        
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }
        res.status(200).json({ success: true, company });
    } catch (error) {
        console.error('Get Profile Error:', error); 
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};

const updateProfile = async (req, res) => {
    if (req.user.role !== 'company') {
        return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    try {
        const updateData = { ...req.body };

        if (req.file) {
            const webPath = `uploads/${req.user.id}/${req.file.filename}`;
            updateData.logo = webPath;
            
            console.log('File uploaded:');
            console.log('- Full system path:', req.file.path);
            console.log('- Filename:', req.file.filename);
            console.log('- User ID:', req.user.id);
            console.log('- Web path saved to DB:', updateData.logo);
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password'); 

        if (!updatedCompany) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }
        
        try {
            const io = req.app.get('io');
            const onlineUsers = req.app.get('onlineUsers');
            
            await createNotification(
                req.user.id,
                req.user.role,
                'Your company profile has been updated successfully!',
                '/company-profile',
                io,
                onlineUsers
            );
            console.log('Profile update notification created successfully');
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError.message);
        }
        
        res.status(200).json({ 
            success: true, 
            user: updatedCompany, 
            message: 'Profile updated successfully.' 
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Failed to update profile.', 
            error: error.message 
        });
    }
};

const getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.params.id });
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getMe,
    getCompanyJobs,
};