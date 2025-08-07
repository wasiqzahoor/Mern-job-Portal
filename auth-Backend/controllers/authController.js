// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Admin = require('../models/adminModel'); 
const { sendEmail } = require('../utils/emailService'); 

const generateToken = (id, role) => {
    return jwt.sign(
        { user: { id, role } },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword, 
            role: 'user' 
        });

        await user.save();


        res.status(201).json({ message: 'User registered successfully. Please log in.' });
    } catch (error) {
        console.error('Registration Error (User):', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const registerCompany = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        if ( !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ success: false, message: 'Company with this email already exists.' });
        }
const hashedPassword = await bcrypt.hash(password, 10);
        const newCompany = new Company({
            companyName,
            email,
            password: hashedPassword, 
            role: 'company',
        });

        const savedCompany = await newCompany.save();

        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                const admins = await Admin.find({}).select('_id');
                
                for (const admin of admins) {
                    await createNotification(
                        admin._id, 'admin',
                        `New company "${savedCompany.companyName}" requires approval.`,
                        `/admin/approvals`, 
                        io, onlineUsers
                    );
                }
            } catch (notificationError) {
                console.error("Failed to send new company notification to admins:", notificationError);
            }
        })();
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! Your account is pending admin approval.' 
        });

    } catch (error) {
        console.error('Registration Error (Company):', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const registerAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'admin' 
        });

        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully. Please log in.' });
    } catch (error) {
        console.error('Registration Error (Admin):', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt received for email:', email);

    try {
        let foundUser = null;
        let role = '';

        foundUser = await User.findOne({ email }).select('+password');
        if (foundUser) {
            role = 'user';
        } else {
            foundUser = await Company.findOne({ email }).select('+password');
            if (foundUser) {
                role = 'company';
            } else {
                foundUser = await Admin.findOne({ email }).select('+password');
                if (foundUser) role = 'admin';
            }
        }

        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log(`Found ${role} with email: ${email}`);

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (role === 'company') {
            if (foundUser.status === 'pending') {
                return res.status(403).json({ success: false, message: 'Your account is still pending approval.' });
            }
            if (foundUser.status === 'rejected') {
                return res.status(403).json({ success: false, message: 'Your account has been rejected. Please contact support.' });
            }
        }

        console.log('User authenticated successfully. Generating token...');
        
        const token = generateToken(foundUser._id, role);

        const userResponse = foundUser.toObject();
        delete userResponse.password; 
        userResponse.role = role;

        res.status(200).json({ 
            success: true, 
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error('Server-side Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const requestPasswordReset = async (req, res) => {
    const { email, role } = req.body;
    try {
        let Model;
        if (role === 'user') Model = User;
        else if (role === 'company') Model = Company;
        else if (role === 'admin') Model = Admin;
        else return res.status(400).json({ message: 'Invalid role provided' });

        const user = await Model.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found with that email' });
        }

        const resetToken = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&role=${role}`;
        console.log(`Password reset link for ${email}: ${resetLink}`);

        await sendEmail(email, 'Password Reset Request for Your Jobshop Account', `
            You requested a password reset for your Jobshop account.
            Click on the link below to reset your password:
            ${resetLink}

            This link is valid for 15 minutes. If you did not request this, please ignore this email.
        `);

        res.status(200).json({ message: 'Password reset link sent to your email. Please check your inbox.' });
    } catch (error) {
        console.error('Password Reset Request Error:', error);
        res.status(500).json({ message: 'Server error during password reset request', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword, role } = req.body;
    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role: tokenRole } = decoded; // Extract ID and role directly from the token payload

        if (role !== tokenRole) {
            return res.status(400).json({ message: 'Invalid token for this specified role' });
        }

        let Model;
        if (role === 'user') Model = User;
        else if (role === 'company') Model = Company;
        else if (role === 'admin') Model = Admin;
        else return res.status(400).json({ message: 'Invalid role provided' });

        // Find the user by ID and select password to update it
        const user = await Model.findById(id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User associated with token not found' });
        }

        // Manually hash the new password before updating
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save(); // Save the user with the new hashed password

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Password Reset Error:', error);
        // Provide more specific error messages for JWT issues
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Password reset token has expired. Please request a new one.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid password reset token. Please ensure you clicked the latest link.' });
        }
        res.status(400).json({ message: 'An error occurred during password reset', error: error.message });
    }
};

module.exports = {
    registerUser,
    registerCompany,
    registerAdmin, 
    login,
    requestPasswordReset,
    resetPassword,
};