// src/pages/Admin/AdminJobDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    FaBriefcase, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaClock, FaCalendarAlt,
    FaHourglassHalf, FaChartBar, FaUserTie, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaExclamationTriangle
} from 'react-icons/fa'; 
import AdminNavbar from './AdminNavbar';
 // Adjust path if needed

const API_URL = 'http://localhost:4002'; 

const AdminJobDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token'); 

                if (!token) {
                    setError("Authentication token not found. Please log in as an admin.");
                    setLoading(false);
                    return;
                }

                
                const response = await fetch(`${API_URL}/api/admin/jobs/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to fetch job details: ${response.statusText}`);
                }

                const data = await response.json();
                setJob(data);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError(err.message || "Failed to load job details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]); 

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-DarkGray">
                <div className="text-center text-xl font-semibold text-gray-700">Loading job details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="text-center text-xl font-semibold text-red-600 p-8 bg-red-100 rounded-lg shadow-md flex flex-col items-center">
                    <FaExclamationTriangle className="text-5xl mb-4" />
                    <p>Error: {error}</p>
                    <button
                        onClick={() => navigate('/admin/jobs')}
                        className="mt-6 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="text-center text-xl font-semibold text-gray-700 p-8 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <FaBriefcase className="text-5xl mb-4 text-gray-500" />
                    <p>Job not found.</p>
                    <button
                        onClick={() => navigate('/admin/jobs')}
                        className="mt-6 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminNavbar />
            <div className="min-h-screen bg-DarkGray p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto bg-LightGray rounded-lg shadow-xl p-6 md:p-8">
                    {/* Header with Back and Edit buttons */}
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                            <FaBriefcase className="mr-3 text-teal-600" />
                            {job.jobTitle || job.title || 'Job Title Not Available'}
                        </h1>
                        <div className="flex space-x-3">
                            
                            {/* Optional: Add an Edit button if you create an edit job page */}
                            {/* <Link
                                to={`/admin/jobs/edit/${job._id}`}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                <FaEdit className="mr-2" /> Edit Job
                            </Link> */}
                        </div>
                    </div>

                    {/* Company Logo and Info */}
                    <div className="flex items-center mb-6">
                        {job.companyLogo && (
                            <img src={job.companyLogo} alt={`${job.companyName || 'Company'} Logo`} className="w-20 h-20 rounded-full object-cover mr-4 shadow" />
                        )}
                        <div>
                            
                            {job.postedBy && (
                                <p className="text-lg text-gray-500">
                                    Posted by:
                                   
                                    {job.postedBy.companyName? (
                                        <> {job.postedBy.companyName} </>
                                    ) : (
                                        <> {job.postedBy.email || 'N/A'}</> 
                                    )}
                                    
                                    {job.postedBy.email && (
                                        <span className="ml-1">({job.postedBy.email})</span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Key Job Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8 border-t pt-6">
                        {/* Location */}
                        <div className="flex items-center text-gray-700">
                            <FaMapMarkerAlt className="text-xl text-red-500 mr-3" />
                            <div>
                                <p className="font-semibold">Location:</p>
                                <p className="text-lg">{job.jobLocation || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div className="flex items-center text-gray-700">
                            <FaDollarSign className="text-xl text-green-500 mr-3" />
                            <div>
                                <p className="font-semibold">Salary:</p>
                                {job.minPrice && job.maxPrice ? (
                                    <p className="text-lg">
                                        {`$${job.minPrice} - $${job.maxPrice} `}
                                        {job.salaryType && <span className="text-sm text-gray-500">({job.salaryType})</span>}
                                    </p>
                                ) : (
                                    <p className="text-lg">{job.salaryType || 'Negotiable'}</p>
                                )}
                            </div>
                        </div>

                        {/* Job Type */}
                        <div className="flex items-center text-gray-700">
                            <FaClock className="text-xl text-purple-500 mr-3" />
                            <div>
                                <p className="font-semibold">Job Type:</p>
                                <p className="text-lg">{job.employmentType|| 'N/A'}</p>
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div className="flex items-center text-gray-700">
                            <FaChartBar className="text-xl text-orange-500 mr-3" />
                            <div>
                                <p className="font-semibold">Experience Level:</p>
                                <p className="text-lg">{job.experienceLevel || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Posting Date */}
                        <div className="flex items-center text-gray-700">
                            <FaCalendarAlt className="text-xl text-blue-500 mr-3" />
                            <div>
                                <p className="font-semibold">Posted On:</p>
                               <p className="text-lg">
  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center text-gray-700">
                            {job.status === 'active' ? (
                                <FaCheckCircle className="text-xl text-green-500 mr-3" />
                            ) : (
                                <FaTimesCircle className="text-xl text-red-500 mr-3" />
                            )}
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p className="text-lg capitalize">{job.status || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-8 border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {job.description || 'No description provided for this job.'}
                        </p>
                    </div>

                    {/* Skills Section */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-8 border-t pt-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timestamps and ID */}
                    <div className="text-sm text-gray-500 border-t pt-4 mt-6">
                        <p><strong>Created At:</strong> {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'}</p>
                        <p><strong>Last Updated:</strong> {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : 'N/A'}</p>
                        <p><strong>Job ID:</strong> <span className="font-mono text-xs break-all">{job._id}</span></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminJobDetails;