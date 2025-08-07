// routes/applicationsRoute.js
const express = require("express");
const {
  applyForJob,
  getApplicationsForJob,
  getCompanyApplicationsCount,
  getInterviewsScheduledCount,
  updateApplicationStatus,
  getMyApplications,
  getApplicationById,
  scheduleInterview, 
  getCompanyApplications, 
} = require("../controllers/applicationsController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/apply", verifyToken, authorizeRoles("user"), applyForJob);

router.get("/my-applications", verifyToken, authorizeRoles("user"), getMyApplications);

router.get("/job/:jobId", verifyToken, authorizeRoles("company"), getApplicationsForJob);

router.get("/company-applications", verifyToken, authorizeRoles("company"), getCompanyApplications); // ✅ NEW ROUTE

router.get("/company-applications-count", verifyToken, authorizeRoles("company"), getCompanyApplicationsCount);

router.get("/interviews-scheduled-count", verifyToken, authorizeRoles("company"), getInterviewsScheduledCount);

router.patch("/:id/status", verifyToken, authorizeRoles("company"), updateApplicationStatus);

router.patch("/:id/schedule-interview", verifyToken, authorizeRoles("company"), scheduleInterview); // ✅ NEW ROUTE

router.get("/:id", verifyToken, getApplicationById);


module.exports = router;