const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
           
            recipientId: req.user.id,
            recipientModel: req.user.role // Yeh 'User', 'Admin', ya 'company' hoga
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            notifications: notifications 
        });

    } catch (err) {
        console.error("Error fetching notifications:", err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        if (notification.recipientId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;
    const recipientId = req.user.id;

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (notification.recipientId.toString() !== recipientId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        await notification.deleteOne();

        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteAllNotifications = async (req, res) => {
    const recipientId = req.user.id;

    try {
        await Notification.deleteMany({ recipientId: recipientId });
        res.status(200).json({ success: true, message: 'All notifications cleared successfully' });
    } catch (error) {
        console.error("Error clearing all notifications:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const createNotification = async (recipientId, recipientModel, message, link, io, onlineUsers) => {
    try {
        const newNotification = new Notification({ recipientId, recipientModel, message, link });
        await newNotification.save();
        
        if (io && onlineUsers) {
            const targetSocketId = onlineUsers.get(recipientId.toString());
            if (targetSocketId) {
                io.to(targetSocketId).emit('getNotification', newNotification);
                console.log(`Notification emitted to user ${recipientId}`);
            }
        }
        return newNotification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};
module.exports = {
    getNotifications,
    markAsRead,
    createNotification,
    deleteNotification,
    deleteAllNotifications
};