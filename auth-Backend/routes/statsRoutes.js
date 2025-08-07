// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized: Only administrators can access this resource.' });
    }
    next(); 
};

router.get('/', verifyToken, authorizeAdmin, getDashboardStats);

module.exports = router;