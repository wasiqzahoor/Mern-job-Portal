const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!req.user || !req.user.id) {
            return cb(new Error('User not authenticated or user ID not found'), null);
        }
        
        const userDir = path.join(uploadsDir, req.user.id);
        
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        if (!req.user || !req.user.id) {
            return cb(new Error('User not authenticated or user ID not found'), null);
        }
        
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueName + extension;
        
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (!req.user || !req.user.id) {
        return cb(new Error('User not authenticated'), false);
    }
    
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and documents are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024  
    },
    fileFilter: fileFilter
});

module.exports = upload;