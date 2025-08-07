// src/components/CompanyDashboardWidget.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import { FaSpinner, FaBriefcase, FaUsers, FaPlus, FaEye, FaFileAlt, FaClock, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

const CompanyDashboardWidget = () => {
    const { token } = useContext(AuthContext);

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBase = "http://localhost:4002/api";

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError("Authentication required.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const [jobsRes, appsRes] = await Promise.all([
                    axios.get(`${apiBase}/jobs/my-jobs`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${apiBase}/applications/company-applications`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setJobs(jobsRes.data.jobs || []);
                setApplications(appsRes.data.applications || []);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

     if (loading) {
        return <div className="flex justify-center items-center h-screen bg-DarkGray"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }
    
    if (error) {
        return <div className="bg-red-100 text-red-800 p-6 rounded-xl shadow-lg">{error}</div>;
    }

    return (
        <div className="space-y-8">
            {/* --- Recent Applications Card --- */}
            <div className="bg-LightGray p-6 rounded-xl shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <FaUsers className="text-indigo-500" /> Recent Applications
                    </h3>
                    <Link to="/applications" className="text-sm font-semibold text-indigo-600 hover:underline">
                        View All ({applications.length})
                    </Link>
                </div>
                <div className="space-y-4 flex-grow">
                    {applications.length > 0 ? applications.slice(0, 5).map(app => (
                        <Link to={`/applications/${app._id}`} key={app._id} className="block p-4 rounded-lg border bg-Teal hover:border-indigo-500 hover:bg-white transition-all group">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                                        {getInitials(`${app.applicant?.firstName} ${app.applicant?.lastName}`)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600">
                                            {app.applicant?.firstName} {app.applicant?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Applied for: {app.job?.jobTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><FaClock /> {new Date(app.appliedDate).toLocaleDateString()}</p>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                            <FaUsers className="text-5xl mb-2" />
                            <p>No new applications received.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- My Posted Jobs Card --- */}
            <div className="bg-LightGray p-6 rounded-xl shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <FaBriefcase className="text-indigo-500" /> My Posted Jobs
                    </h3>
                    <Link to="/company-jobs" className="text-sm font-semibold text-indigo-600 hover:underline">
                        View All ({jobs.length})
                    </Link>
                </div>
                <div className="space-y-4 flex-grow">
                    {jobs.length > 0 ? jobs.slice(0, 5).map(job => (
                        <Link to={`/company/job/${job._id}`} key={job._id} className="block p-4 rounded-lg border bg-Teal hover:border-indigo-500 hover:bg-white transition-all group">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">{job.jobTitle}</h4>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                    {job.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                                <p className="flex items-center gap-1.5"><FaMapMarkerAlt /> {job.jobLocation}</p>
                                <p className="flex items-center gap-1.5"><FaDollarSign /> ${job.minPrice} - ${job.maxPrice}</p>
                                <p className="flex items-center gap-1.5"><FaClock /> {job.employmentType}</p>
                            </div>
                        </Link>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                            <FaFileAlt className="text-5xl mb-2" />
                            <p>No jobs posted yet.</p>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default CompanyDashboardWidget;