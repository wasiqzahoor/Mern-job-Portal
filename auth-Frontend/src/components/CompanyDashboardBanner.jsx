// src/components/CompanyDashboardBanner.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext"; 
import { Link } from "react-router-dom"; 
import {
  FaBriefcase,     
  FaUsers,         
  FaCalendarCheck, 
  FaSpinner,       
} from "react-icons/fa";

const CompanyDashboardBanner = () => {
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalJobsPosted, setTotalJobsPosted] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [interviewsScheduled, setInterviewsScheduled] = useState(0);

  const API_BASE_URL = "http://localhost:4002/api"; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        setError("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);
      setError(null); 

      try {
       
        const [
          jobsRes,
          applicationsCountRes,
          activeJobsRes,
          interviewsRes,
        ] = await Promise.all([
          // 1. Fetch Total Jobs Posted
          axios.get(`${API_BASE_URL}/jobs/my-jobs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // 2. Fetch Total Applications for company's jobs
          axios.get(`${API_BASE_URL}/applications/company-applications-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // 3. Fetch Active Jobs
          axios.get(`${API_BASE_URL}/jobs/active-jobs-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // 4. Fetch Interviews Scheduled
          axios.get(`${API_BASE_URL}/applications/interviews-scheduled-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Update states with fetched data
        setTotalJobsPosted(jobsRes.data.jobs ? jobsRes.data.jobs.length : 0);
        setTotalApplications(applicationsCountRes.data.count || 0);
        setActiveJobs(activeJobsRes.data.count || 0);
        setInterviewsScheduled(interviewsRes.data.count || 0);

      } catch (err) {
        console.error("Error fetching company dashboard data:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Failed to load dashboard data. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, API_BASE_URL]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-lg text-gray-700">
        <FaSpinner className="animate-spin mr-3 text-blue-500" /> Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 font-semibold">{error}</div>;
  }

  
  const companyName = user?.companyName || "Company";

  
  const StatCard = ({ title, value, icon: IconComponent, bgColor, linkTo }) => (
    <div className="flex-1"> 
      {linkTo ? (
        <Link to={linkTo} className="block">
          <div className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg text-white ${bgColor} transform transition-transform duration-300 hover:scale-105 cursor-pointer`}>
            <IconComponent className="text-4xl mb-3" />
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </Link>
      ) : (
        <div className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg text-Navy ${bgColor}`}>
          <IconComponent className="text-4xl mb-3" />
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-LightGray rounded-lg shadow-xl text-Purple mb-8 mt-8">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">
        Welcome, {companyName}!
      </h1>
      <p className="text-lg text-center opacity-90 mb-8">
        Here's a quick overview of your job posting activity and applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs Posted"
          value={totalJobsPosted}
          icon={FaBriefcase}
          bgColor="bg-indigo-500 hover:bg-indigo-600"
          linkTo="/company-jobs" // Link to manage all posted jobs
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={FaUsers}
          bgColor="bg-green-500 hover:bg-green-600"
          linkTo="/company/applications" // Link to the all applications page
        />
        <StatCard
          title="Active Jobs"
          value={activeJobs}
          icon={FaBriefcase} // Using FaBriefcase for active jobs as well
          bgColor="bg-yellow-500 hover:bg-yellow-600"
          linkTo="/company/jobs/active" // Link to a page showing only active jobs
        />
        <StatCard
          title="Interviews Scheduled"
          value={interviewsScheduled}
          icon={FaCalendarCheck} 
          bgColor="bg-red-500 hover:bg-red-600"
          linkTo="/company/interviews" // Link to the interviews page
        />
      </div>
    </div>
  );
};

export default CompanyDashboardBanner;