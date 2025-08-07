
// routes/userRoutes.js
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { 
    getMe, 
    saveJob, 
    unSaveJob, 
    getSavedJobs,
    updateUserProfile // Naya function controller se
} = require("../controllers/userController");

const router = express.Router();


router.get("/me", verifyToken, getMe);


router.put(
  "/update",
  verifyToken,
  authorizeRoles('user'),
  upload.fields([ 
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateUserProfile 
);


router.post("/save-job", verifyToken, authorizeRoles('user'), saveJob);
router.delete("/unsave-job/:jobId", verifyToken, authorizeRoles('user'), unSaveJob);
router.get("/saved-jobs", verifyToken, authorizeRoles('user'), getSavedJobs);

module.exports = router;