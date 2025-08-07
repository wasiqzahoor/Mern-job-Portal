// src/pages/user/UserHomePage.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaHeart, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const UserHomePage = () => {
  const { user, token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [popularSearches, setPopularSearches] = useState([]);
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

  const fetchApplicationCount = useCallback(async () => {
    if (user && token) {
      try {
        const appRes = await axios.get(`${apiBase}/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicationsCount(appRes.data.applications.length);
      } catch (err) {
        console.error("Error fetching application count:", err.response?.data?.message || err.message);
      }
    }
  }, [user, token]);

  const fetchSavedJobsCount = useCallback(async () => {
    if (user && token) {
      try {
        const savedRes = await axios.get(`${apiBase}/users/saved-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobsCount(savedRes.data.savedJobs.length);
      } catch (err) {
        console.error("Error fetching saved jobs count:", err.response?.data?.message || err.message);
      }
    }
  }, [user, token]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobsRes = await axios.get(`${apiBase}/jobs`, {
        params: {
          sort: sortBy,
          title: searchTitle,
          location: searchLocation,
          salaryType: filterSalaryType,
          employmentType: filterEmploymentType,
          experienceLevel: filterExperienceLevel,
          skills: filterSkills,
          postedWithin: filterPostedWithin,
        },
      });
      setJobs(jobsRes.data.jobs);

      if (user && token) {
        await fetchApplicationCount();
        await fetchSavedJobsCount();
      }

      setPopularSearches(["React Developer", "Product Manager", "UI/UX Designer", "Data Scientist"]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data?.message || err.message);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, token, sortBy, searchTitle, searchLocation, filterSalaryType, filterEmploymentType, filterExperienceLevel, filterSkills, filterPostedWithin, fetchApplicationCount, fetchSavedJobsCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSearchAndFilter = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleSaveToggle = (jobId, isNowSaved) => {
    setSavedJobsCount(prevCount => isNowSaved ? prevCount + 1 : prevCount - 1);
  };

  const handleJobApplicationSuccess = () => {
    fetchApplicationCount();
  };

  const savedJobIds = user?.savedJobs || [];
  const getIsJobSaved = (jobId) => savedJobIds.includes(jobId);

  const currentUserFirstName = user?.firstName || "User";

  return (
    <div className="min-h-screen bg-DarkGray font-sans text-gray-800">
      {/* Header/Banner Section */}
     <div className="bg-Footer text-white py-12 md:py-20 px-4 md:px-6 lg:px-12 relative overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 z-10 opacity-20 h-full">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M-10 0 L110 0 L110 10 L-10 10 Z" fill="rgba(255,255,255,0.1)" transform="rotate(3, 50, 50)" />
      <path d="M-10 20 L110 20 L110 30 L-10 30 Z" fill="rgba(255,255,255,0.05)" transform="rotate(-5, 50, 50)" />
      <path d="M-10 50 L110 50 L110 60 L-10 60 Z" fill="rgba(255,255,255,0.08)" transform="rotate(2, 50, 50)" />
    </svg>
  </div>

  {/* Content */}
  <div className="max-w-6xl mx-auto relative z-10">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 leading-snug animate-fade-in-down">
      Hello, <span className="text-indigo-200">{currentUserFirstName}!</span><br />
      Find Your <span className="text-yellow-300">Dream Job</span>
    </h1>

    <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 max-w-2xl animate-fade-in-down delay-200">
      Explore thousands of opportunities from leading companies and take the next step in your career.
    </p>

    {/* Search Bar */}
    <form
      onSubmit={handleSearchAndFilter}
      className="flex flex-col md:flex-row gap-4 bg-offwhite p-4 rounded-xl shadow-lg animate-fade-in-up delay-300"
    >
      {/* Job Input */}
      <div className="relative flex-grow">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Job title, skills, or company"
          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:ring-indigo-500 outline-none text-gray-800 placeholder-gray-500"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      {/* Location Input */}
      <div className="relative flex-grow">
        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Location"
          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:ring-indigo-500 outline-none text-gray-800 placeholder-gray-500"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
      >
        Search
      </button>
    </form>

    {/* Popular Searches */}
    <div className="mt-5 text-gray-200 text-sm animate-fade-in-up delay-400">
      <span className="font-semibold mr-2">Popular searches:</span>
      {popularSearches.map((term, index) => (
        <button
          key={index}
          onClick={() => setSearchTitle(term)}
          className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full cursor-pointer mr-2 mb-2 transition"
        >
          {term}
        </button>
      ))}
    </div>
  </div>
</div>


      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Dashboard Cards - Refined Responsive */}
<div className="overflow-x-auto sm:overflow-visible">
  <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-[600px] sm:min-w-0 px-2 sm:px-0">
    
    {/* Jobs Found Card */}
    <div className="bg-Navbar min-w-[180px] sm:min-w-0 rounded-xl shadow-md p-3 flex-shrink-0 sm:flex-shrink flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
      <div className="flex gap-2 sm:gap-4 items-center pt-1">
        <div className="bg-indigo-100 text-indigo-600 p-2 sm:p-4 rounded-full mb-2">
          <FaSearch className="text-md sm:text-xl" />
        </div>
        <h3 className="text-sm sm:text-lg font-bold text-gray-800 mt-1">Jobs Found</h3>
      </div>
      <span className="text-2xl sm:text-4xl font-extrabold text-indigo-600 my-1 sm:my-2">{jobs.length}+</span>
      <span className="text-xs sm:text-sm text-gray-500">opportunities available</span>
    </div>

    {/* My Applications Card */}
    <Link to="/my-applications" className="block min-w-[180px] sm:min-w-0">
      <div className="bg-Navbar rounded-xl shadow-md p-3 flex-shrink-0 sm:flex-shrink flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
        <div className="flex gap-2 sm:gap-4 items-center pt-1">
          <div className="bg-green-100 text-green-600 p-2 sm:p-4 rounded-full mb-2">
            <FaPaperPlane className="text-md sm:text-xl" />
          </div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 mt-1">My Applications</h3>
        </div>
        <span className="text-2xl sm:text-4xl font-extrabold text-green-600 my-1 sm:my-2">{applicationsCount}</span>
        <span className="text-xs sm:text-sm text-gray-500">applied this month</span>
      </div>
    </Link>

    {/* Saved Jobs Card */}
    <Link to="/saved-jobs" className="block min-w-[180px] sm:min-w-0">
      <div className="bg-Navbar rounded-xl shadow-md p-3 flex-shrink-0 sm:flex-shrink flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
        <div className="flex gap-2 sm:gap-4 items-center pt-1">
          <div className="bg-orange-100 text-orange-600 p-2 sm:p-4 rounded-full mb-2">
            <FaHeart className="text-md sm:text-xl" />
          </div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 mt-1">Saved Jobs</h3>
        </div>
        <span className="text-2xl sm:text-4xl font-extrabold text-orange-600 my-1 sm:my-2">{savedJobsCount}</span>
        <span className="text-xs sm:text-sm text-gray-500">added this week</span>
      </div>
    </Link>

  </div>
</div>


        {/* Job Listings Section */}
        <div className="bg-LightGray rounded-2xl shadow-md p-6 mt-8 animate-fade-in delay-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Job Postings</h2>
            <Link to="/all-jobs" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              View All &rarr;
            </Link>
          </div>

          {/* Advanced Filters (Collapsible) */}
          <div className="mb-6">
            <button
              onClick={() => setIsFilterSectionOpen(!isFilterSectionOpen)}
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 p-4 bg-gray-50 rounded-xl transition-all hover:bg-gray-100"
            >
              <span className="flex items-center gap-2"><FaFilter /> Advanced Filters</span>
              {isFilterSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
            </button>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
                isFilterSectionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
              <p className="ml-4 text-lg text-gray-600">Loading jobs...</p>
            </div>
          )}
          {error && <p className="text-center text-red-600 py-12">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="text-center text-gray-600 py-12">No jobs found matching your criteria.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onSaveToggle={handleSaveToggle}
                isSavedInitial={getIsJobSaved(job._id)}
                onApplySuccess={handleJobApplicationSuccess}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;