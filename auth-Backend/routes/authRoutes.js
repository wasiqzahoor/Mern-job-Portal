// routes/authRoutes.js
const express = require("express");
const {
    registerUser,
    registerCompany,
    registerAdmin, 
    login,
    requestPasswordReset,
    resetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register-user", registerUser);

router.post("/register-company", registerCompany);

router.post("/register-admin", registerAdmin);


router.post("/login", login);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

module.exports = router;