// src/pages/user/AllJobsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import JobCard from "../../components/JobCard";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
  FaSpinner,
  FaAngleDown, 
  FaAngleUp,   
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Bottom from "./Bottom";

const AllJobsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterSectionOpen, setIsFilterSectionOpen] = useState(false);

  // Search & Filter States
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterSalaryType, setFilterSalaryType] = useState("");
  const [filterEmploymentType, setFilterEmploymentType] = useState("");
  const [filterExperienceLevel, setFilterExperienceLevel] = useState("");
  const [filterSkills, setFilterSkills] = useState("");
  const [filterPostedWithin, setFilterPostedWithin] = useState("");
  const [sortBy, setSortBy] = useState("newest"); 

  const apiBase = "http://localhost:4002/api";

  const fetchAllJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiBase}/jobs`, {
        params: {
          title: searchTitle,
          location: searchLocation,
          salaryType: filterSalaryType,
          employmentType: filterEmploymentType,
          experienceLevel: filterExperienceLevel,
          skills: filterSkills,
          postedWithin: filterPostedWithin,
          sort: sortBy,
        },
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching all jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleSearchAndFilter = (e) => {
    e.preventDefault();
    fetchAllJobs(); 
  };

  // Check if a job is saved by the current user
  const savedJobIds = user && user.savedJobs ? user.savedJobs : [];
  const getIsJobSaved = (jobId) => savedJobIds.includes(jobId);

  return (
    <div className="bg-DarkGray">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 lg:p-8 min-h-screen bg-LightGray shadow-lg rounded-xl my-8">
        <div className="bg-Teal text-Purple rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Jobs Dashboard</h1>
                            <p className="text-md md:text-lg text-Purple">Manage your  Jobs and Apply for it.</p>
                        </div>
                        
                    </div>
                </div>

        {/* Search Bar for AllJobsPage */}
        <form
          onSubmit={handleSearchAndFilter}
          className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl shadow-sm mb-8"
        >
          <div className="flex-grow flex items-center bg-white rounded-lg px-4 py-2 border border-gray-200">
            <FaSearch className="text-gray-500 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Job title, skills, or company"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <div className="flex-grow flex items-center bg-white rounded-lg px-4 py-2 border border-gray-200">
            <FaMapMarkerAlt className="text-gray-500 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md"
          >
            Search
          </button>
        </form>

        {/* Additional Filters & Sorting */}
        <div className="mb-6">
          <button
            onClick={() => setIsFilterSectionOpen(!isFilterSectionOpen)}
            className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <FaFilter /> Advanced Filters
            </span>
            {isFilterSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
              isFilterSectionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Filter elements with modern styling */}
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-xl p-3 w-full text-gray-700 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={filterSalaryType}
                onChange={(e) => setFilterSalaryType(e.target.value)}
              >
                <option value="">Salary Type</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaAngleDown />
              </div>
            </div>
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-xl p-3 w-full text-gray-700 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={filterEmploymentType}
                onChange={(e) => setFilterEmploymentType(e.target.value)}
              >
                <option value="">Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaAngleDown />
              </div>
            </div>
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-xl p-3 w-full text-gray-700 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={filterExperienceLevel}
                onChange={(e) => setFilterExperienceLevel(e.target.value)}
              >
                <option value="">Experience Level</option>
                <option value="internship">Internship</option>
                <option value="entry-level">Entry-Level</option>
                <option value="1-3 years">1-3 Years</option>
                <option value="3-5 years">3-5 Years</option>
                <option value="5+ years">5+ Years</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaAngleDown />
              </div>
            </div>
            <input
              type="text"
              placeholder="Skills (e.g., React, Node.js)"
              className="border border-gray-300 rounded-xl p-3 w-full text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filterSkills}
              onChange={(e) => setFilterSkills(e.target.value)}
            />
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-xl p-3 w-full text-gray-700 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={filterPostedWithin}
                onChange={(e) => setFilterPostedWithin(e.target.value)}
              >
                <option value="">Date Posted</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaAngleDown />
              </div>
            </div>
            <div className="relative">
              <select
                className="appearance-none border border-gray-300 rounded-xl p-3 w-full text-gray-700 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="salary-asc">Salary: Low to High</option>
                <option value="salary-desc">Salary: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaAngleDown />
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <p className="ml-3 text-lg text-gray-600">Loading jobs...</p>
          </div>
        )}
        {error && <p className="text-center text-red-600 py-8">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No jobs found matching your criteria.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isSavedInitial={getIsJobSaved(job._id)} />
          ))}
        </div>
      </div>
      <Bottom/>
    </div>
  );
};

export default AllJobsPage;
