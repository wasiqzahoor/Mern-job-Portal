// src/components/RecentJobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const RecentJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentJobs = async () => {
            try {
                const response = await fetch('http://localhost:4002/api/jobs/recent');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch jobs');
                }
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching recent jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentJobs();
    }, []);

    const handleView = () => {
        navigate('/admin/jobs');
    };

    return (

        <div className="bg-DarkGray p-6 sm:p-8  shadow-lg max-w-8xl mx-auto py-10">
            <div>
                <h2 className="text-4xl font-bold text-Purple " >Recent Jobs</h2>
                <p className="text-teal-100 mt-1 text-2xl">Latest 5 job postings from companies</p>
            </div>

            <div className="mt-6">
                {loading ? (
                    <p className="text-offwhite text-center py-4">Loading recent jobs...</p>
                ) : jobs.length > 0 ? (
                    <ul className="space-y-4 ">
                        {jobs.map((job) => (
                            <li key={job._id} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                                <div className="flex flex-col sm:flex-row justify-between rounded-xl sm:items-center bg-LightGray py-5 p-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">{job.title}</h3>
                                        <p className="text-lg text-gray-600 mt-1">
                                            <span>{job.companyName}</span> · <span>{job.location}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-3 sm:mt-0">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.type === 'Full-time' ? 'bg-blue-100 text-blue-800' : 'bg-green-300 text-green-800'}`}>
                                            {job.type}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-4 w-24 text-right">{formatTimeAgo(job.createdAt)}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent jobs found.</p>
                )}
            </div>

            <div className="mt-8 text-center">
                <button onClick={handleView} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-offwhite font-semibold hover:bg-blue-300 transition-colors bg-blue-800">
                    View All Jobs
                </button>
            </div>
        </div>
    );
};

export default RecentJobs;
