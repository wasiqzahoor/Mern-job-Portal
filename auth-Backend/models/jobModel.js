// models/jobModel.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    salaryType: { type: String, required: true },
    jobLocation: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    employmentType: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company", 
        required: true 
    },
    
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);