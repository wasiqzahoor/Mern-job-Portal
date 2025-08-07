// routes/adminApplicationRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); 
const authorizeRoles = require('../middlewares/roleMiddleware'); 
const { getAllApplications, deleteApplication,getApplicationByIdForAdmin } = require('../controllers/adminApplicationController');

console.log('=== ADMIN APPLICATION ROUTES LOADED ===');

router.use((req, res, next) => {
    console.log(`=== ADMIN APPLICATION ROUTE REQUEST ===`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Full URL: ${req.originalUrl}`);
    console.log(`Headers:`, req.headers.authorization ? 'Token present' : 'No token');
    next();
});

router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/', getAllApplications);
router.delete('/:id', deleteApplication);
router.get('/:id', getApplicationByIdForAdmin);
module.exports = router;