// src/pages/admin/AdminApprovalPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import AdminNavbar from './AdminNavbar';
import { FaSpinner, FaCheck, FaTimes, FaBuilding, FaSearch } from 'react-icons/fa';
import AdminFooter from "./AdminFooter";
const AdminApprovalPage = () => {
    const { token } = useContext(AuthContext);
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const apiBase = "http://localhost:4002/api/admin/companies";

    useEffect(() => {
        const fetchPendingCompanies = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await axios.get(`${apiBase}/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingCompanies(res.data.companies || []);
            } catch (err) {
                setError("Failed to load pending companies.");
            } finally {
                setLoading(false);
            }
        };
        fetchPendingCompanies();
    }, [token]);

    const handleUpdateStatus = async (companyId, status) => {
        try {
            await axios.patch(`${apiBase}/${companyId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPendingCompanies(prev => prev.filter(c => c._id !== companyId));
        } catch (err) {
            alert(`Failed to ${status} company. Please try again.`);
        }
    };
    
    const filteredCompanies = pendingCompanies.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-DarkGray min-h-screen">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="bg-LightGray text-Purple p-8 rounded-xl shadow-lg mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold">Company Approval Requests</h1>
                    <p className="mt-2 text-purple-600">Review and manage new company registrations.</p>
                    <p className="mt-4 text-lg font-semibold bg-white bg-opacity-20 inline-block px-4 py-2 rounded-full">
                        {pendingCompanies.length} Total Requests
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {loading ? (
                        <div className="text-center py-12"><FaSpinner className="animate-spin text-indigo-500 text-4xl mx-auto" /></div>
                    ) : error ? (
                        <p className="text-center text-red-600 font-semibold py-12">{error}</p>
                    ) : filteredCompanies.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <FaCheck className="text-5xl mx-auto mb-4 text-green-500" />
                            <p className="font-semibold">All caught up!</p>
                            <p>There are no pending company approvals.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCompanies.map(company => (
                                <div key={company._id} className="bg-gray-50 p-4 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                                            <FaBuilding />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{company.companyName}</p>
                                            <p className="text-xs text-gray-500">{company.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 self-end sm:self-center">
                                        <button 
                                            onClick={() => handleUpdateStatus(company._id, 'approved')}
                                            className="px-4 py-2 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-2 transition"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(company._id, 'rejected')}
                                            className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center gap-2 transition"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <AdminFooter />
        </div>
    );
};

export default AdminApprovalPage;