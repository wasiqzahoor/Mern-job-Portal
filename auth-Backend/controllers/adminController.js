
// controllers/adminController.js
console.log('=== LOADING ADMIN CONTROLLER ===');


let Admin, User, Company, Job, Application, upload;

try {
    Admin = require('../models/adminModel');
    console.log('✓ Admin model loaded');
} catch (error) {
    console.error('✗ Error loading Admin model:', error.message);
}

try {
    User = require('../models/userModel');
    console.log('✓ User model loaded');
} catch (error) {
    console.error('✗ Error loading User model:', error.message);
}

try {
    Company = require('../models/companyModel');
    console.log('✓ Company model loaded');
} catch (error) {
    console.error('✗ Error loading Company model:', error.message);
}

try {
    Job = require('../models/jobModel');
    console.log('✓ Job model loaded');
} catch (error) {
    console.error('✗ Error loading Job model:', error.message);
}

try {
    Application = require('../models/applicationModel');
    console.log('✓ Application model loaded');
} catch (error) {
    console.error('✗ Error loading Application model:', error.message);
}

try {
    upload = require('../middlewares/uploadMiddleware');
    console.log('✓ Upload middleware loaded');
} catch (error) {
    console.error('✗ Error loading upload middleware:', error.message);
}

const path = require('path');
const fs = require('fs');


const getMe = async (req, res) => {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    res.json({ success: true, user: admin });
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCompanies,
                totalJobs,
                totalApplications
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }

        const admin = await Admin.findById(req.user.id).select('-password');

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin profile not found.' });
        }

        res.status(200).json({ success: true, user: admin });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }

        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        admin.fullName = req.body.fullName || admin.fullName;
        admin.username = req.body.username || admin.username;
        admin.phone = req.body.phone || admin.phone;
        admin.location = req.body.location || admin.location;

        if (req.file) {
            if (admin.profilePicture && admin.profilePicture.startsWith('uploads/')) {
                const oldPath = path.join(__dirname, '../', admin.profilePicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            admin.profilePicture = path.relative(path.join(__dirname, '../'), req.file.path).replace(/\\/g, '/');
        }

        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            message: 'Admin profile updated successfully',
            user: {
                id: updatedAdmin._id,
                email: updatedAdmin.email,
                fullName: updatedAdmin.fullName,
                username: updatedAdmin.username,
                phone: updatedAdmin.phone,
                location: updatedAdmin.location,
                profilePicture: updatedAdmin.profilePicture,
                role: updatedAdmin.role,
                createdAt: updatedAdmin.createdAt,
                updatedAt: updatedAdmin.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `The ${field} '${error.keyValue[field]}' is already taken.` });
        }
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};


const getAllUsers = async (req, res) => {
    
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};

const getAllCompanies = async (req, res) => {
    
    try {
        const companies = await Company.find().select('-password');
        res.status(200).json({ success: true, companies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};

const getAllJobs = async (req, res) => {
    
    try {
        const jobs = await Job.find().populate('postedBy', 'companyName email');
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};


const getAllApplications = async (req, res) => {
    
    try {
        const applications = await Application.find()
            .populate('applicant', 'firstName lastName email')
            .populate('job', 'jobTitle');
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error });
    }
};


const getJobsByCompany = async (req, res) => {
    try {
        const { id: companyId } = req.params;
        
        const companyExists = await Company.findById(companyId);
        if (!companyExists) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }
        
        const jobs = await Job.find({ postedBy: companyId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, jobs });

    } catch (error) {
        console.error("Error fetching jobs by company for admin:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    getAllUsers,
    getAllCompanies,
    getAllJobs,
    getJobsByCompany,
    getDashboardStats,
    getAllApplications,
    getMe, 
    getAdminProfile,
    updateAdminProfile, 
};