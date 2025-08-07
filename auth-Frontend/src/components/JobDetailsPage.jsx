// src/pages/JobDetailsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaCalendarAlt, FaClock, FaSpinner, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons add karein
import Navbar from "./Navbar";


const JobDetailsPage = () => {
    const { id: jobId } = useParams(); // 'id' ko 'jobId' rename karein for clarity
    const { user, token } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [applyStatus, setApplyStatus] = useState('idle'); // 'idle', 'applying', 'success', 'error'

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4002/api/jobs/${jobId}`);
                setJob(response.data.job);
                // Future improvement: Yahan check karein ke user ne pehle se apply kiya hai ya nahi
            } catch (err) {
                setError("Failed to load job details.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);
    
    // ✅ FIX: handleApplyNow function ko a-one karein
    const handleApplyNow = async () => {
        if (!token) return alert("Please log in to apply.");
        if (!window.confirm("Are you sure you want to apply for this job?")) return;

        setApplyStatus('applying'); // Loading state shuru karein

        try {
            const response = await axios.post(
                `http://localhost:4002/api/applications/apply`, // Sahi API endpoint
                { jobId: job._id }, // Request body mein jobId bhejein
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setApplyStatus('success');
                setIsApplied(true); // User apply kar chuka hai
            } else {
                throw new Error(response.data.message || 'Application failed.');
            }
        } catch (err) {
            setApplyStatus('error');
            alert(err.response?.data?.message || err.message || "An error occurred.");
            setTimeout(() => setApplyStatus('idle'), 3000); // 3 sec baad button reset karein
        }
    };

     if (loading) {
        return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }
    if (error) {
        return <p className="text-center mt-8 text-red-600 font-semibold">{error}</p>;
    }
    if (!job) {
        return <p className="text-center mt-8 text-gray-700">Job not found.</p>;
    }

    // Apply Now button ka content dynamically render karein
    const renderApplyButton = () => {
        if (isApplied || applyStatus === 'success') {
            return <button disabled className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 rounded-lg text-lg cursor-not-allowed"><FaCheckCircle /> Applied</button>;
        }
        if (applyStatus === 'applying') {
            return <button disabled className="w-full flex justify-center items-center gap-2 bg-gray-400 text-white font-bold py-3 rounded-lg text-lg cursor-wait"><FaSpinner className="animate-spin" /> Applying...</button>;
        }
        if (applyStatus === 'error') {
            return <button onClick={handleApplyNow} className="w-full flex justify-center items-center gap-2 bg-red-500 text-white font-bold py-3 rounded-lg text-lg hover:shadow-xl"><FaTimesCircle /> Try Again</button>;
        }
        // idle state
        return <button onClick={handleApplyNow} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-lg text-lg hover:shadow-xl">Apply Now</button>;
    };

    return (
        <div className="bg-DarkGray min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-2 bg-LightGray p-8 rounded-xl shadow-lg">
                         <div className="flex items-center gap-5 mb-6 pb-6 border-b">
                            <img
                                src={job.postedBy?.logo ? `http://localhost:4002/${job.postedBy.logo}` : `https://ui-avatars.com/api/?name=${job.postedBy?.companyName || 'C'}`}
                                alt={`${job.postedBy?.companyName} Logo`}
                                className="w-20 h-20 rounded-xl object-cover border"
                            />
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-800">{job.jobTitle}</h1>
                                <Link to={`/company-profile/${job.postedBy?._id}`} className="text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                                    {job.postedBy?.companyName || 'Company Details Not Available'} <FaExternalLinkAlt size={12} />
                                </Link>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Job Description</h3>
                            <div className="prose prose-indigo max-w-none text-gray-600 whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>

                        {/* Required Skills */}
                        {job.skills && job.skills.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-3">
                                    {job.skills.map((skill, index) => (
                                        <span key={index} className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Right Column --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-LightGray p-6 rounded-xl shadow-lg sticky top-8">
                            {/* ✅ FIX: Yahan dynamic button render karein */}
                            <div className="mb-6">
                                {user && user.role === 'user' ? (
                                    renderApplyButton()
                                ) : !user ? (
                                    <p className="text-center text-gray-600">Please <Link to="/login" className="text-indigo-600 font-bold">log in</Link> to apply.</p>
                                ) : (
                                    <p className="text-center text-gray-500 italic">Only users can apply for jobs.</p>
                                )}
                            </div>
                            
                            {/* Job Overview */}
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-t pt-6">Job Overview</h3>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex items-start gap-3"><FaCalendarAlt className="text-gray-400 mt-1" /><p><span className="font-semibold">Posted On:</span> {new Date(job.createdAt).toLocaleDateString()}</p></div>
                                <div className="flex items-start gap-3"><FaMapMarkerAlt className="text-gray-400 mt-1" /><p><span className="font-semibold">Location:</span> {job.jobLocation}</p></div>
                                <div className="flex items-start gap-3"><FaMoneyBillWave className="text-gray-400 mt-1" /><p><span className="font-semibold">Salary:</span> ${job.minPrice} - ${job.maxPrice} ({job.salaryType})</p></div>
                                <div className="flex items-start gap-3"><FaClock className="text-gray-400 mt-1" /><p><span className="font-semibold">Job Type:</span> {job.employmentType}</p></div>
                                <div className="flex items-start gap-3"><FaBriefcase className="text-gray-400 mt-1" /><p><span className="font-semibold">Experience:</span> {job.experienceLevel}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
        </div>
    );
};

export default JobDetailsPage;