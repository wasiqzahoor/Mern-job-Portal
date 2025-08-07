// src/pages/company/ApplicationDetailsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {
  FaSpinner, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaMoneyBillWave, FaClock, FaCalendarAlt, FaFilePdf,
  FaExternalLinkAlt, FaBuilding, FaUserTie
} from "react-icons/fa";
import DashboardNavbar from "../../components/DashboardNavbar";
import Footer from "./Footer";

const ApplicationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    
     const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

    const apiBase = "http://localhost:4002/api";
    const serverUrl = "http://localhost:4002"; 
    useEffect(() => {
        const fetchApplicationDetails = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await axios.get(`${apiBase}/applications/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplication(res.data.application);
                setNewStatus(res.data.application.status);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to load application details. Please try again.";
                console.error("Error fetching application details:", errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicationDetails();
    }, [id, token]);
    
   const handleStatusChange = async () => {
    if (!token) return;

    if (!newStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      const res = await axios.patch(`${apiBase}/applications/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplication(res.data.application);
      alert(`Application status updated to ${newStatus.toUpperCase()}`);
      setNotificationMessage(`Your application for "${application.job.jobTitle}" has been ${newStatus}.`);
       

    } catch (err) {
      console.error("Error updating status:", err.response?.data?.message || err.message);
      alert("Failed to update status.");
    }
  };

  const handleScheduleInterview = async () => {
    if (!token) return;

    if (!interviewDate || !interviewTime) {
      alert("Please select both date and time for the interview.");
      return;
    }

    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}:00`);
    if (isNaN(interviewDateTime)) {
      alert("Invalid date or time format.");
      return;
    }

    try {
      const res = await axios.patch(`${apiBase}/applications/${id}/schedule-interview`, {
        interviewDate: interviewDateTime.toISOString(), // Send as ISO string
        status: 'interviewed' // Automatically set status to interviewed
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplication(res.data.application);
      setNewStatus('interviewed'); 
      alert("Interview scheduled successfully!");
      setShowInterviewForm(false); 
      setNotificationMessage(`You have an interview scheduled for "${application.job.jobTitle}" on ${new Date(interviewDateTime).toLocaleString()}.`);
      
    } catch (err) {
      console.error("Error scheduling interview:", err.response?.data?.message || err.message);
      alert("Failed to schedule interview.");
    }
  };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'interviewed': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'hired': return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

     if (loading) {
        return <div className="flex justify-center items-center h-screen bg-DarkGray"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 text-lg mt-10 p-4 bg-red-50 rounded-md">{error}</div>;
    }
    if (!application) {
        return <div className="text-center text-gray-600 text-lg mt-10">Application not found.</div>;
    }

     const { applicant, job, status, appliedDate, resumeLink, coverLetterText, interviewDate: currentInterviewDate } = application;

    return (
        <>
        <div className="bg-DarkGray min-h-screen">
            <DashboardNavbar />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
                

                {/* --- Main Header Card --- */}
                <div className="bg-LightGray p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <p className="text-sm text-gray-500">Application for</p>
                        <h1 className="text-3xl font-bold text-gray-800">{job.jobTitle}</h1>
                        <p className="text-md text-gray-600 mt-1">Submitted by <span className="font-semibold">{applicant.firstName} {applicant.lastName}</span></p>
                    </div>
                    <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColorClass(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column (Applicant & Application Info) --- */}
                    <div className="lg:col-span-2 space-y-8">
                       
                        {/* --- Applicant Information Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                           
                            <div className="flex items-center gap-5 mb-6 border-b pb-4">
                                <img
                                    src={applicant.profilePic ? `${serverUrl}/${applicant.profilePic}` : `https://ui-avatars.com/api/?name=${applicant.firstName}+${applicant.lastName}&background=random`}
                                    alt={`${applicant.firstName} ${applicant.lastName}`}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{applicant.firstName} {applicant.lastName}</h2>
                                    <p className="text-sm text-gray-500">Applicant Information</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                                <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {applicant.email}</p>
                                {applicant.phone && <p className="flex items-center gap-2"><FaPhone className="text-gray-400" /> {applicant.phone}</p>}
                                {applicant.location && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {applicant.location}</p>}
                            </div>
                        </div>

                        {/* --- Application Materials Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Application Materials</h2>
                            <p className="text-sm text-gray-500 mb-4">Applied on {new Date(appliedDate).toLocaleDateString()}</p>
                            {resumeLink && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Resume</h3>
                                    <a href={`http://localhost:4002/${resumeLink}`} target="_blank" rel="noopener noreferrer"
                                       className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                        <FaFilePdf /> View Resume <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                </div>
                            )}
                            {coverLetterText && (
                                <div>
                                    <h3 className="font-semibold mb-2">Cover Letter</h3>
                                    <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap text-gray-800 text-sm">
                                        {coverLetterText}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Right Column (Job & Actions) --- */}
                    <div className="space-y-8">
                        {/* --- Job Details Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FaBuilding /> Job Details</h2>
                            <div className="space-y-3 text-sm text-gray-700">
                                <p><strong>Job Title:</strong> {job.jobTitle}</p>
                                <p><strong>Company:</strong> {job.postedBy.companyName}</p>
                                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {job.jobLocation}</p>
                                <p className="flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" /> ${job.minPrice} - ${job.maxPrice} ({job.salaryType})</p>
                                <p className="flex items-center gap-2"><FaClock className="text-gray-400" /> {job.employmentType}</p>
                            </div>
                        </div>

                        
                       {/* --- Manage Application Card --- */}
<div className="bg-LightGray p-6 rounded-lg shadow-md sticky top-8">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Application</h2>

    {/* Update Status */}
    <div className="space-y-2">
        <label htmlFor="status" className="font-medium text-gray-700 text-sm">Update Status:</label>
        <div className="flex gap-2">
            <select
                id="status"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
            >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
            </select>
            <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
                Save
            </button>
        </div>
    </div>

    <div className="my-6 border-t border-gray-200"></div>

    {/* Schedule Interview */}
    <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaCalendarAlt /> Interview
        </h3>
        
        {/* Interview Details Display (if scheduled) */}
        {currentInterviewDate && (
            <div className="bg-purple-50 p-3 rounded-md mb-4 text-sm">
                <p className="font-semibold text-purple-800">Interview Scheduled On:</p>
                <p className="text-purple-700">{new Date(application.interviewDate).toLocaleString()}</p>
            </div>
        )}

        {/* Interview Scheduling Form */}
        <div className="space-y-3">
            <div>
                <label htmlFor="interviewDate" className="block text-gray-700 text-sm font-bold mb-1">Date:</label>
                <input
                    type="date"
                    id="interviewDate"
                    className="w-full px-3 py-2 border rounded-md"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="interviewTime" className="block text-gray-700 text-sm font-bold mb-1">Time:</label>
                <input
                    type="time"
                    id="interviewTime"
                    className="w-full px-3 py-2 border rounded-md"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                />
            </div>
            <button
                onClick={handleScheduleInterview}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
                {currentInterviewDate ? 'Reschedule Interview' : 'Schedule Interview'}
            </button>
        </div>
    </div>
</div>
                    </div>
                </div>
            </main>
        </div>
        
        </>
    );
};

export default ApplicationDetailsPage;