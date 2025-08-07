// routes/adminUserRoute.js
const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    deleteUser,
    getApplicationsByUser,
} = require('../controllers/adminUserController'); 

const verifyToken = require('../middlewares/authMiddleware'); 
const authorizeRoles = require('../middlewares/roleMiddleware'); 

router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);

router.get('/:id', verifyToken, authorizeRoles('admin'), getUserById);

router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

router.get('/:id/applications', getApplicationsByUser);

module.exports = router;