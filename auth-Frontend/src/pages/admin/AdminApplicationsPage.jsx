// src/pages/admin/AdminApplicationsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
 import AdminNavbar from "./AdminNavbar"; 
import { FaTrash, FaInfoCircle,FaEye, FaSpinner, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom"; 
import AdminFooter from "./AdminFooter";

const AdminApplicationsPage = () => {
    const { token } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBaseUrl = "http://localhost:4002/api/admin";
    const serverUrl = "http://localhost:4002";

    useEffect(() => {
        const fetchApplications = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await axios.get(`${apiBaseUrl}/applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(response.data.applications || []);
            } catch (err) {
                setError(`Failed to fetch applications: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [token]);

    const handleDeleteApplication = async (applicationId) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await axios.delete(`${apiBaseUrl}/applications/${applicationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(prev => prev.filter(app => app._id !== applicationId));
        } catch (err) {
            alert(`Failed to delete application: ${err.response?.data?.message || err.message}`);
        }
    };
    
    const getStatusColor = (status) => {
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
        return <div className="text-center text-red-600 font-semibold p-8">{error}</div>;
    }

    return (
        <div className="bg-DarkGray min-h-screen">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* --- Top Banner --- */}
                <div className="bg-LightGray text-Purple p-8 rounded-xl shadow-lg mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Manage All Applications</h1>
                    <p className="mt-2 text-indigo-100">Oversee and manage every application across the platform.</p>
                    <p className="mt-4 text-lg font-semibold bg-white bg-opacity-20 inline-block px-4 py-2 rounded-full">
                        {applications.length} Total Applications
                    </p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
                        <FaUsers className="text-5xl mx-auto mb-4" />
                        <p className="text-lg font-semibold">No Applications Found</p>
                        <p>There are currently no job applications submitted on the platform.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-Beige rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                {/* --- Card Header --- */}
                                <div className="p-5 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 truncate" title={app.job?.jobTitle || 'N/A'}>
                                        {app.job?.jobTitle || 'Job Title Not Available'}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <img
                                            src={app.company?.logo ? `${serverUrl}/${app.company.logo}` : `https://ui-avatars.com/api/?name=${app.company?.companyName || 'C'}`}
                                            alt="Company Logo"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <p className="text-lg text-gray-500">
                                            {app.company?.companyName || 'Company Not Available'}
                                        </p>
                                    </div>
                                </div>

                                {/* --- Card Body --- */}
                                <div className="p-5 flex-grow">
                                    <p className="text-sm font-semibold text-gray-600 mb-2">Applicant:</p>
                                    <div className="text-sm text-gray-800">
                                        <p className="font-bold">{app.applicant?.firstName} {app.applicant?.lastName || ''}</p>
                                        <p className="text-gray-500">{app.applicant?.email || 'Email Not Available'}</p>
                                    </div>
                                </div>
                                
                                {/* --- Card Footer --- */}
                                <div className="p-5 bg-Beige rounded-b-lg flex items-center justify-between">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                        {app.status || 'N/A'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Link to={`/admin/applications/${app._id}`} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm" title="View Details">
                                            <FaEye className="mr-2" /> View
                                        </Link>
                                        <button onClick={() => handleDeleteApplication(app._id)} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm">
                                                                                            <FaTrash className="mr-2" /> Delete
                                                                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AdminFooter/>
        </div>

    );
};

export default AdminApplicationsPage;