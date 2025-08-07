// src/pages/company/CompanyApplicationsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaSpinner, FaUsers, FaSearch, FaFilter, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import Footer from "./Footer";

const CompanyApplicationsPage = () => {
    const { token, user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const apiBase = "http://localhost:4002/api";

    useEffect(() => {
        const fetchCompanyApplications = async () => {
            if (!token || user?.role !== 'company') {
                setError("You are not authorized to view this page.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`${apiBase}/applications/company-applications`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { searchTerm, status: filterStatus }
                });
                setApplications(res.data.applications || []);
            } catch (err) {
                setError("Failed to load applications. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        
        const handler = setTimeout(() => {
            fetchCompanyApplications();
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [token, user, searchTerm, filterStatus]);

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
    
    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <>
        <div className="bg-DarkGray min-h-screen">
            <DashboardNavbar />
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* --- Header --- */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-Purple flex items-center gap-3">
                        <FaUsers className="text-Purple" /> Manage Job Applications
                    </h1>
                    <p className="text-Purple mt-3 ml-12">    Review and manage all applications for your posted jobs.</p>
                </div>

                {/* --- Filter and Search Card --- */}
                <div className="bg-LightGray p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by applicant name or job title..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                             <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Filter by Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="interviewed">Interviewed</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* --- Applications List --- */}
                <div className="bg-LightGray rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-600 font-semibold py-20">{error}</p>
                    ) : applications.length === 0 ? (
                        <p className="text-center text-gray-600 py-40">No applications found matching your criteria.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-Teal divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-Teal text-blue-700 font-bold flex items-center justify-center text-sm">
                                                    {getInitials(`${app.applicant.firstName} ${app.applicant.lastName}`)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{app.applicant.firstName} {app.applicant.lastName}</div>
                                                    <div className="text-xs text-gray-500">{app.applicant.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.job.jobTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.appliedDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link to={`/applications/${app._id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center justify-end gap-1">
                                                <FaEye /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default CompanyApplicationsPage;