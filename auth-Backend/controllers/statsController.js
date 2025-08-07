// controllers/statsController.js
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Job = require('../models/jobModel'); 

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newCompaniesLast30Days = await Company.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newJobsLast30Days = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        res.json({
            users: {
                total: totalUsers,
                change: `${newUsersLast30Days} new this month` 
            },
            companies: {
                total: totalCompanies,
                change: `${newCompaniesLast30Days} new this month` 
            },
            jobs: {
                total: totalJobs,
                change: `${newJobsLast30Days} posted this month`
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ message: 'Server error while fetching stats', error: error.message });
    }
};

module.exports = {
    getDashboardStats
};