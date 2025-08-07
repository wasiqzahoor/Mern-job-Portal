// controllers/adminUserController.js
const User = require('../models/userModel'); 
const Notification = require('../models/notificationModel'); 
const { createNotification } = require('./notificationController'); 
const Application = require('../models/applicationModel');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password -__v');
        res.status(200).json(users);
    } catch (error) {
        next({ status: 500, message: 'Server error fetching all users', error: error });
    }
};

const getUserById = async (req, res, next) => {
     try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ 
            success: true, 
            user: user 
        });

    } catch (error) {
        console.error("Error fetching user for admin:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return next({ status: 404, message: 'User not found' });
        }

        const userName = `${userToDelete.firstName} ${userToDelete.lastName}`;
        const deletedUserId = userToDelete._id;

       

        await User.deleteOne({ _id: deletedUserId }); 

        try {
            const io = req.app.get('io'); 
            const onlineUsers = req.app.get('onlineUsers'); 
            const adminUserId = req.user.id; 

            const notificationMessage = `User "${userName}" (ID: ${deletedUserId}) has been successfully deleted.`;
            const notificationLink = `/admin/users`;

            await createNotification(
                adminUserId,
                'Admin', 
                notificationMessage,
                notificationLink,
                io,
                onlineUsers
            );
            console.log(`Notification initiated for admin ${adminUserId} regarding user deletion.`);

        } catch (notificationError) {
            console.error("Error creating or sending notification after user deletion:", notificationError);
          
        }
       

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        if (error.name === 'CastError') {
            return next({ status: 400, message: 'Invalid user ID format' });
        }
        next({ status: 500, message: `Server error deleting user with ID: ${req.params.id}`, error: error });
    }
};

const getApplicationsByUser = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const applications = await Application.find({ applicant: userId })
            .populate({
                path: 'job',
                select: 'jobTitle employmentType'
            })
            .populate({
                path: 'company',
                select: 'companyName logo'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, applications });

    } catch (error) {
        console.error("Error fetching applications by user for admin:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getApplicationsByUser,
};