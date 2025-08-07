// routes/adminCompanyRoutes.js
const express = require('express');
const router = express.Router();

const {
    getAllCompanies,
    getCompanyById,
    deleteCompany,
    getPendingCompanies,
        updateCompanyStatus
} = require('../controllers/adminCompanyController');

const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('admin'), getAllCompanies);
router.patch('/:id/status', updateCompanyStatus);
router.get('/pending', getPendingCompanies);
router.get('/:id', verifyToken, authorizeRoles('admin'), getCompanyById);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCompany);

module.exports = router;