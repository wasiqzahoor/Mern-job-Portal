// routes/adminJobRoute.js
const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    getJobById,
    deleteJob,
    getJobsByCompany,
} = require('../controllers/adminJobController');
const authorizeRoles = require('../middlewares/roleMiddleware'); 
const verifyToken = require('../middlewares/authMiddleware');
router.get('/', verifyToken, authorizeRoles('admin'), getAllJobs);

router.get('/:id', verifyToken, authorizeRoles('admin'), getJobById);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteJob);

module.exports = router;