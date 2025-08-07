// src/pages/company/CompanyJobs.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext"; 
import { Link, useNavigate } from "react-router-dom"; 
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,   
  FaMoneyBillWave,  
} from "react-icons/fa";

import DashboardNavbar from "../../components/DashboardNavbar";
import Footer from "./Footer";

const CompanyJobs = () => {
  const { token, user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); 

  const jobsApi = "http://localhost:4002/api/jobs";

  const fetchCompanyJobs = async () => {
    if (!token) {
      setLoading(false);
      setError("Authentication required.");
      return;
    }
    try {
      setLoading(true); 
      const res = await axios.get(`${jobsApi}/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching company jobs:", err);
      setError("Failed to load your jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [token]); 

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        await axios.delete(`${jobsApi}/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Job deleted successfully!");
        fetchCompanyJobs(); 
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const handleEditJob = (jobId) => {
    
    navigate(`/edit-job/${jobId}`);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await axios.put(`${jobsApi}/${jobId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Job status updated to ${newStatus}!`);
      fetchCompanyJobs(); // Re-fetch jobs to update the list and counts
    } catch (err) {
      console.error("Error updating job status:", err);
      alert("Failed to update job status. Please try again.");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus === "all") return true;
    return job.status === filterStatus;
  });

  if (loading) {
    return <p className="text-center mt-8 text-lg text-gray-700">Loading your jobs...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-600 font-semibold">{error}</p>;
  }

  const companyName = user?.companyName || "Your Company"; // Get company name from AuthContext

  return (
    <>
    <DashboardNavbar/>
    <div className="max-w-7xl mx-auto p-6 text-gray-800 font-sans space-y-8 bg-DarkGray sm:p-6 lg:p-8">
      {/* Banner Section */}
      <div className="bg-LightGray text-Purple rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Jobs Dashboard</h1>
                            <p className="text-md md:text-lg text-Purple">Manage your posted jobs and hiring pipeline.</p>
                        </div>
                        <Link
                            to="/post-job"
                            className="mt-6 md:mt-0 bg-white text-indigo-600 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
                        >
                            <FaPlus /> Post New Job
                        </Link>
                    </div>
                </div>


      {/* Job Filters and List */}
      <div className="bg-LightGray rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Your Job Listings</h2>
          <div className="flex space-x-3  md:mb-0">
            <button onClick={() => setFilterStatus("all")} className={`px-4 py-2 rounded-full text-xs font-medium ${filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                                All Jobs({jobs.length})
                            </button>
                            <button onClick={() => setFilterStatus("active")} className={`px-4 py-2 rounded-full text-xs font-medium ${filterStatus === "active" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                                Active ({jobs.filter(job => job.status === 'active').length})
                            </button>
            <button onClick={() => setFilterStatus("inactive")} className={`px-4 py-2 rounded-full text-xs font-medium ${filterStatus === "inactive" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                                Inactive ({jobs.filter(job => job.status === 'inactive').length})
                            </button>
            <button onClick={() => setFilterStatus("closed")} className={`px-4 py-2 rounded-full text-xs font-medium ${filterStatus === "closed" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                                Closed ({jobs.filter(job => job.status === 'closed').length})
                            </button>
        
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600 py-40">No jobs found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-Beige border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">{job.jobTitle}</h3>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" /> {job.jobLocation}
                  </p>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaBriefcase className="text-gray-500" /> {job.employmentType}
                  </p>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <FaMoneyBillWave className="text-gray-500" /> {job.salaryType}: {job.minPrice}-{job.maxPrice}
                  </p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' :
                      job.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                      {job.status === 'active' && <FaCheckCircle className="mr-1" />}
                      {job.status === 'inactive' && <FaTimesCircle className="mr-1" />}
                      {job.status === 'closed' && <FaTimesCircle className="mr-1" />}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  <Link
                    to={`/company/job/${job._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleEditJob(job._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                  {/* Dropdown for status change (optional, could be separate buttons too) */}
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CompanyJobs;