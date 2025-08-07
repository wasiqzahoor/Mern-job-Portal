const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    role: {
      type: String,
      default: "user",
      enum: ["user"], 
    },

    profilePic: {
      type: String, 
      default: null,
    },
    resume: {
      type: String, 
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        title: { type: String, trim: true, default: "" },
        company: { type: String, trim: true, default: "" },
        startDate: { type: String, trim: true, default: "" },
        endDate: { type: String, trim: true, default: "" },
        description: { type: String, trim: true, default: "" },
      },
    ],

    education: [
      {
        degree: { type: String, trim: true, default: "" },
        institution: { type: String, trim: true, default: "" },
        startYear: { type: String, trim: true, default: "" },
        endYear: { type: String, trim: true, default: "" },
        grade: { type: String, trim: true, default: "" },
      },
    ],

    languages: [
      {
        name: { type: String, trim: true, default: "" },
        proficiency: { type: String, trim: true, default: "" },
      },
    ],

    socialLinks: [
      {
        platform: { type: String, trim: true, default: "" },
        url: { type: String, trim: true, default: "" },
      },
    ],

    certifications: [
      {
        name: { type: String, trim: true, default: "" },
      },
    ],

    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);