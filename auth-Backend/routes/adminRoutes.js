// routes/adminRoutes.js
const express = require('express');
const {
  getAllUsers,
  getAllCompanies,
  getAllJobs,
  getMe,       
  getJobsByCompany,   
  getAllApplications,
  getDashboardStats,
  getAdminProfile,     
  updateAdminProfile,
} = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/me', getMe);
router.get('/stats', getDashboardStats);
router.get('/profile', getAdminProfile);
router.patch('/profile', upload.single('profilePicture'), updateAdminProfile);
router.get('/users', getAllUsers);
router.get('/companies', getAllCompanies);
router.get('/jobs', getAllJobs);
router.get('/applications', getAllApplications);
router.get('/companies/:id/jobs', getJobsByCompany);
module.exports = router;