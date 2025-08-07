// models/applicationModel.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Reference to the Job model
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "interviewed", "hired", "rejected"], 
      default: "pending",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    resumeLink: { 
      type: String,
      required: false, 
    },
    coverLetterText: { 
      type: String,
      required: false,
    },
    interviewDate: { 
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true } 
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);