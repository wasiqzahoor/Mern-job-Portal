// src/pages/Admin/AdminJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaBriefcase, FaPlusCircle, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

const API_URL = 'http://localhost:4002';

const AdminJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalJobs, setTotalJobs] = useState(0);
    const navigate = useNavigate();

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/admin/jobs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch jobs');
            }

            const data = await response.json();
            
            setJobs(data.jobs || []);
            setTotalJobs(data.jobs ? data.jobs.length : 0);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError(err.message || "Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete job.');
            
            setJobs(jobs.filter(job => job._id !== jobId));
            setTotalJobs(prev => prev - 1);
            alert("Job deleted successfully!");
        } catch (err) {
            alert(`Failed to delete job: ${err.message}`);
        }
    };

    const handleViewJob = (jobId) => {
        navigate(`/admin/jobs/${jobId}`);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className="bg-DarkGray min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="bg-LightGray text-Purple p-8 rounded-lg shadow-md mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Manage All Jobs</h1>
                            <p className="text-lg opacity-90">Overview and management of all job listings on JobShop.</p>
                            <div className="mt-4 flex items-center space-x-4">
                                <span className="text-2xl font-semibold">
                                    <FaBriefcase className="inline-block mr-2" /> {totalJobs} Total Jobs
                                </span>
                            </div>
                        </div>
                        
                    </div>
                    
                    {loading ? (
                        <div className="text-center">Loading jobs...</div>
                    ) : error ? (
                        <div className="text-center text-red-600">Error: {error}</div>
                    ) : (
                        <main>
                            {jobs.length === 0 ? (
                                <div className="text-center">No jobs found.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {jobs.map(job => (
                                        <div key={job._id} className="bg-Beige rounded-lg shadow-lg overflow-hidden flex flex-col justify-between">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                   
                                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-purple-200 flex-shrink-0 mr-4">
                                                        {job.postedBy?.logo ? (
                                                            <img src={`${API_URL}/${job.postedBy.logo}`} alt={`${job.postedBy.companyName} logo`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FaBriefcase size="2rem" className="text-purple-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        
                                                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{job.jobTitle}</h2>
                                                        
                                                        <p className="text-sm text-gray-600">{job.postedBy?.companyName || 'Unknown Company'}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 text-sm text-gray-700">
                                                   
                                                    <p className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-gray-500" />
                                                        <span>{job.jobLocation}</span>
                                                    </p>
                                                    
                                                    <p className="flex items-center gap-2">
                                                        <FaEnvelope className="text-gray-500" />
                                                        <span>{job.postedBy?.email || 'No email provided'}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <FaBriefcase className="text-gray-500" />
                                                        <span>{job.employmentType}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons bilkul theek hain */}
                                            <div className="flex justify-end space-x-3 mt-4 pt-2 pb-3 pr-3 border-t border-gray-100">
                                                <button onClick={() => handleViewJob(job._id)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm">
                                                    <FaEye className="mr-2" /> View
                                                </button>
                                                <button onClick={() => handleDeleteJob(job._id)} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm">
                                                    <FaTrash className="mr-2" /> Delete
                                                </button>
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            )}
                        </main>
                    )}
                </div>
            </div>
            <AdminFooter/>
        </>
    );
};

export default AdminJobsPage;