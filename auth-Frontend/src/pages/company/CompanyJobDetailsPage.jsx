// src/pages/company/CompanyJobDetailsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBriefcase,
  FaEdit,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import DashboardNavbar from "../../components/DashboardNavbar";
import Footer from "./Footer";

const CompanyJobDetailsPage = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:4002/api/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJob(response.data.job);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-DarkGray">
        <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600 font-semibold">{error}</div>
    );
  }

  if (!job) {
    return <p className="text-center mt-8 text-gray-700">Job not found.</p>;
  }

  const formattedSalary = `$${job.minPrice} - $${job.maxPrice} ${job.salaryType}`;
  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="bg-DarkGray min-h-screen">
        <DashboardNavbar />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {/* ... (Baaki sab JSX bilkul theek hai) ... */}
          <div className="bg-LightGray p-6 rounded-lg shadow-md mb-8 flex items-center gap-5">
            <img
              
              src={
                job.postedBy?.logo
                  ? `http://localhost:4002/${job.postedBy.logo}`
                  : "/images/company-logo-placeholder.png"
              }
              alt={`${job.postedBy?.companyName || "Company"} Logo`}
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {job.postedBy.companyName}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column (Main Details) --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* --- Job Description Card --- */}
              <div className="bg-LightGray p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900">
                  {job.jobTitle}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Posted on {formattedDate}
                </p>
                <div className="my-6 border-t border-gray-200"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job Description
                </h3>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* --- Required Skills Card --- */}
              <div className="bg-LightGray p-8 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  
                  {job.skills &&
                    job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* --- Right Column (Summary & Actions) --- */}
            <div className="space-y-8">
              <div className="bg-LightGray  p-6 rounded-lg shadow-md sticky top-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
                  Job Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FaMoneyBillWave className="text-gray-400 text-xl mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Salary
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formattedSalary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-gray-400 text-xl mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.jobLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaClock className="text-gray-400 text-xl mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Employment Type
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.employmentType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaBriefcase className="text-gray-400 text-xl mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Experience Level
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.experienceLevel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    <FaEdit /> Edit Job
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CompanyJobDetailsPage;
