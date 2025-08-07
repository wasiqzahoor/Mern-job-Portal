
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {
  FaSpinner, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaMoneyBillWave, FaClock, FaCalendarAlt, FaFilePdf,
  FaExternalLinkAlt, FaBuilding, FaUserTie, FaArrowLeft
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar"; 


const AdminApplicationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBase = "http://localhost:4002/api/admin"; 
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
            } catch (err) {
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicationDetails();
    }, [id, token]);

    const getStatusColorClass = (status) => {
        const lowerCaseStatus = status ? status.toLowerCase() : '';
        switch (lowerCaseStatus) {
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
        return <div className="text-center text-red-600 text-lg mt-10 p-4">{error}</div>;
    }
    if (!application) {
        return <div className="text-center text-gray-600 text-lg mt-10">Application not found.</div>;
    }

    const { applicant, job, company, status, appliedDate, resumeLink, coverLetterText, interviewDate } = application;

    return (
        <div className="bg-DarkGray min-h-screen">
            <AdminNavbar />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
                

                {/* --- Main Header Card --- */}
                <div className="bg-LightGray p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <p className="text-sm text-gray-500">Application for</p>
                            <h1 className="text-3xl font-bold text-gray-800">{job?.jobTitle || 'N/A'}</h1>
                        </div>
                        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColorClass(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* --- Applicant Information Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                            <div className="flex items-center gap-5 mb-6 border-b pb-4">
                                <img
                                    src={applicant?.profilePic ? `${serverUrl}/${applicant.profilePic}` : `https://ui-avatars.com/api/?name=${applicant?.firstName}+${applicant?.lastName}`}
                                    alt="Applicant"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{applicant?.firstName} {applicant?.lastName}</h2>
                                    <p className="text-sm text-gray-500">Applicant Details</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                                <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {applicant?.email}</p>
                                {applicant?.phone && <p className="flex items-center gap-2"><FaPhone className="text-gray-400" /> {applicant.phone}</p>}
                                {applicant?.location && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {applicant.location}</p>}
                            </div>
                        </div>

                        {/* --- Application Materials Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Application Materials</h2>
                            <p className="text-sm text-gray-500 mb-4">Applied on {new Date(appliedDate).toLocaleDateString()}</p>
                             {resumeLink && (
                                <div className="mb-6">
                                    <a href={`${serverUrl}/${resumeLink}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                        <FaFilePdf /> View Resume
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

                    {/* --- Right Column --- */}
                    <div className="space-y-8">
                        {/* --- Company Details Card --- */}
                        <div className="bg-LightGray p-6 rounded-lg shadow-md">
                             <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={company?.logo ? `${serverUrl}/${company.logo}` : `https://ui-avatars.com/api/?name=${company?.companyName}`}
                                    alt="Company"
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{company?.companyName || 'N/A'}</h2>
                                    <p className="text-sm text-gray-500">Hiring Company</p>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-3 text-sm text-gray-700">
                                <p><strong>Job Title:</strong> {job?.jobTitle || 'N/A'}</p>
                                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {job?.jobLocation || 'N/A'}</p>
                                <p className="flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" /> ${job?.minPrice} - ${job?.maxPrice}</p>
                                <p className="flex items-center gap-2"><FaClock className="text-gray-400" /> {job?.employmentType || 'N/A'}</p>
                            </div>
                        </div>

                        {/* --- Interview Details Card --- */}
                        {interviewDate && (
                            <div className="bg-LightGray p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaCalendarAlt /> Interview Details
                                </h3>
                                <div className="bg-purple-50 p-3 rounded-md text-sm">
                                    <p className="font-semibold text-purple-800">Scheduled On:</p>
                                    <p className="text-purple-700">{new Date(interviewDate).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
        </div>
    );
};

export default AdminApplicationDetailsPage;