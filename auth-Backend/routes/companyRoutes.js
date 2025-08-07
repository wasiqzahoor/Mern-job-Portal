const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getCompanyJobs ,getMe } = require('../controllers/companyController');
const companyController = require('../controllers/companyController');

const verifyToken = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

router.get("/me", verifyToken, getMe);

router.route('/profile')
   
    .get(verifyToken, getProfile)
    .patch(verifyToken, upload.single('logo'), updateProfile);

router.route('/:id/jobs').get(getCompanyJobs);

router.post('/fix-logo-paths', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'company') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only companies can run this cleanup' 
            });
        }

        
        const Company = require('../models/companyModel');
        const path = require('path');

        const companies = await Company.find({
            logo: { $regex: /^[A-Za-z]:\\/ } 
        });

        console.log(`Found ${companies.length} companies with absolute logo paths`);
        
        const results = [];

        for (const company of companies) {
            const oldPath = company.logo;
            
            const pathParts = oldPath.split(/[\\\/]/); // Split on both \ and /
            
            const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
            
            if (uploadsIndex !== -1 && uploadsIndex + 2 < pathParts.length) {
                const userId = pathParts[uploadsIndex + 1];
                const filename = pathParts[uploadsIndex + 2];
                
                const newPath = `uploads/${userId}/${filename}`;
                
                await Company.findByIdAndUpdate(company._id, { logo: newPath });
                
                results.push({
                    companyId: company._id,
                    companyName: company.companyName,
                    oldPath: oldPath,
                    newPath: newPath,
                    status: 'updated'
                });
                
                console.log(`✅ Updated ${company.companyName}: ${newPath}`);
            } else {
                results.push({
                    companyId: company._id,
                    companyName: company.companyName,
                    oldPath: oldPath,
                    newPath: null,
                    status: 'failed - could not parse path'
                });
                
                console.log(`❌ Could not parse path for ${company.companyName}: ${oldPath}`);
            }
        }

        res.json({
            success: true,
            message: `Fixed ${results.filter(r => r.status === 'updated').length} logo paths out of ${companies.length} found`,
            totalFound: companies.length,
            totalFixed: results.filter(r => r.status === 'updated').length,
            results: results
        });

    } catch (error) {
        console.error('Error fixing logo paths:', error);
        res.status(500).json({
            success: false,
            message: 'Error fixing logo paths',
            error: error.message
        });
    }
});

module.exports = router;