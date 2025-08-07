// routes/jobRoutes.js
const express = require("express");
const {
    postJob,
    getMyJobs,
    getActiveJobsCount,
    getJobById,
    updateJob,
    deleteJob,
    getAllJobs,
    getRecentJobs,
} = require("../controllers/jobController");

const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/recent", getRecentJobs);

router.get("/my-jobs", verifyToken, authorizeRoles("company"), getMyJobs);

router.get("/active-jobs-count", verifyToken, authorizeRoles("company"), getActiveJobsCount);

router.post("/post-job", verifyToken, authorizeRoles("company"), postJob);

router.put('/update-job/:id', verifyToken, updateJob);

router.get("/", getAllJobs); 

router.get("/:id", getJobById); 

router.put("/:id", verifyToken, authorizeRoles("company"), updateJob);

router.delete("/:id", verifyToken, authorizeRoles("company"), deleteJob);


module.exports = router;