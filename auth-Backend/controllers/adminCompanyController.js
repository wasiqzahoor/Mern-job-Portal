const Company = require('../models/companyModel');
const { createNotification } = require('./notificationController'); 
const Job = require('../models/jobModel');
const mongoose = require('mongoose');
const Application = require('../models/applicationModel');
const Notification = require('../models/notificationModel');
const { sendEmail } = require('../utils/emailService');

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({}); 
        res.status(200).json({
            success: true,
            companies: companies 
        });

    } catch (error) {
        console.error("Error fetching all companies for admin:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).select('-password'); 

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        res.status(200).json({
            success: true,
            company: company 
        });

    } catch (error) {
        console.error(`Error fetching company with ID ${req.params.id} for admin:`, error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid company ID format" });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const deleteCompany = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const companyId = req.params.id;
        const company = await Company.findById(companyId).session(session);

        if (!company) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        const companyName = company.companyName;

        const jobsPostedByCompany = await Job.find({ postedBy: companyId }).select('_id').session(session);
        const jobIds = jobsPostedByCompany.map(job => job._id);

        console.log(`Found ${jobIds.length} jobs to delete for company ${companyName}.`);

        if (jobIds.length > 0) {
            const appDeleteResult = await Application.deleteMany({ job: { $in: jobIds } }, { session });
            console.log(`Deleted ${appDeleteResult.deletedCount} applications related to the company's jobs.`);
        }

        await Job.deleteMany({ postedBy: companyId }, { session });

        const notificationDeleteResult = await Notification.deleteMany(
            { recipientId: companyId, recipientModel: 'Company' },
            { session }
        );
        console.log(`Deleted ${notificationDeleteResult.deletedCount} notifications for company ${companyName}.`);

        await Company.findByIdAndDelete(companyId, { session });

        await session.commitTransaction();

        try {
            const io = req.app.get('io');
            const onlineUsers = req.app.get('onlineUsers');
            await createNotification(
                req.user.id, 'Admin',
                `Company "${companyName}" and all its related data (jobs, applications, notifications) have been successfully deleted.`,
                '/admin/companies',
                io, onlineUsers
            );
        } catch (notificationError) {
            console.error("Failed to send final delete notification to admin:", notificationError);
        }
        
        res.status(200).json({ success: true, message: "Company and all associated data deleted successfully" });

    } catch (error) {
        await session.abortTransaction();
        console.error(`Transaction aborted. Error deleting company and its data:`, error);
        res.status(500).json({ success: false, message: "Could not complete the delete operation. All changes were reverted." });

    } finally {
        session.endSession();
    }
};
const updateCompanyStatus = async (req, res) => {
    try {
        const { id: companyId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        const company = await Company.findByIdAndUpdate(companyId, { status }, { new: true });
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }
        
        res.status(200).json({ success: true, message: `Company has been ${status}.`, company });
        
        (async () => {
            try {
                const io = req.app.get('io');
                const onlineUsers = req.app.get('onlineUsers');
                
                let message;
                let subject;
                let htmlContent; 

                const loginUrl = 'http://localhost:5173/login';

                if (status === 'approved') {
                    subject = "Congratulations! Your JobShop Account is Approved!";
                    message = `Congratulations! Your account for "${company.companyName}" has been approved.`;
                    htmlContent = `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2>Account Approved!</h2>
                            <p>Hello ${company.companyName},</p>
                            <p>We are pleased to inform you that your company profile on JobShop has been approved.</p>
                            <p>You can now log in to your dashboard to post jobs and manage applications.</p>
                            <a href="${loginUrl}" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
                                Log In to Your Dashboard
                            </a>
                            <p>Welcome aboard!</p>
                            <p>Best regards,<br/>The JobShop Team</p>
                        </div>
                    `;
                } else { // 'rejected'
                    subject = "Update on Your JobShop Account Registration";
                    message = `We regret to inform you that your account for "${company.companyName}" has been rejected.`;
                    htmlContent = `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2>Registration Update</h2>
                            <p>Hello ${company.companyName},</p>
                            <p>After reviewing your application, we regret to inform you that your company registration could not be approved at this time.</p>
                            <p>If you believe this is a mistake, please contact our support team.</p>
                            <p>Best regards,<br/>The JobShop Team</p>
                        </div>
                    `;
                }
                
                await sendEmail(
                    company.email, 
                    subject,       
                    htmlContent    
                );

                await createNotification(
                    company._id, 'company', message, '/login', io, onlineUsers
                );

            } catch (error) {
                console.error(`Failed to send notification/email for company ${company._id}:`, error);
            }
        })();
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getPendingCompanies = async (req, res) => {
    try {
        const pendingCompanies = await Company.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, companies: pendingCompanies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    deleteCompany,
    getPendingCompanies,
    updateCompanyStatus
};