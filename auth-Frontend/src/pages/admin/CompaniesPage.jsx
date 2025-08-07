// src/components/CompaniesPage.jsx
import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEye } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { FiUserPlus, FiUsers, FiTrash2 } from 'react-icons/fi';
import AdminFooter from './AdminFooter';

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [totalcompany, setTotalcompany] = useState(0);

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:4002/api/admin/companies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch companies');
            }
            
            const data = await response.json();

            
            setCompanies(data.companies || []);
            setTotalcompany(data.companies ? data.companies.length : 0);

        } catch (err) {
            console.error("Error fetching companies:", err);
            setError(err.message || "Failed to load companies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (companyId) => {
        if (!window.confirm("Are you sure you want to delete this company?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authentication token not found.");
                return;
            }

            const response = await fetch(`http://localhost:4002/api/admin/companies/${companyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete company');
            }

            setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== companyId));
            setTotalcompany(prevTotal => prevTotal - 1);
            alert("Company deleted successfully!");
            
        } catch (err) {
            console.error("Error deleting company:", err);
            alert(`Failed to delete company: ${err.message}`);
        }
    };

    const handleViewCompany = (companyId) => {
        navigate(`/admin/companies/${companyId}`);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    
    return (
        <>
            <AdminNavbar />
            <div className="bg-DarkGray min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-LightGray text-Purple p-8 rounded-lg shadow-md mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Manage Companies</h1>
                            <p className="text-lg opacity-90">Overview of all registered companies.</p>
                            <div className="mt-4 flex items-center space-x-4">
                                <span className="text-2xl font-semibold"><FiUsers className="inline-block mr-2" /> {totalcompany} Total Companies</span>
                            </div>
                        </div>
                        <div>
                            <Link
                                to="/Signup" 
                                className="bg-white text-purple-700 px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 flex items-center space-x-2"
                            >
                                <FiUserPlus className="w-5 h-5" />
                                <span className="font-semibold">Add New Company</span>
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center text-lg font-medium text-gray-700">Loading companies...</div>
                    ) : error ? (
                        <div className="text-center text-lg font-medium text-red-600 p-4 bg-red-100 rounded-lg">
                            Error: {error}
                        </div>
                    ) : (
                        <main>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Companies</h2>
                            {companies.length === 0 ? (
                                <div className="text-center text-gray-600 text-lg p-4 bg-white rounded-lg shadow-md">
                                    No companies found.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {companies.map(company => (
                                        <div key={company._id} className="bg-Beige rounded-lg shadow-lg overflow-hidden flex flex-col">
                                            <div className="p-6 flex-grow">
                                                <div className="flex items-center mb-4">
                                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                                        <FaBuilding size="1.5rem" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900">{company.companyName}</h3>
                                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                            {company.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-4 space-y-2">
                                                    <p><strong>ID:</strong> <span className="font-mono text-xs">{company._id}</span></p>
                                                    <p><strong>Email:</strong> {company.email}</p>
                                                    <p><strong>Location:</strong> {company.location || 'Not specified'}</p>
                                                    {company.createdAt && (
                                                        <p><strong>Registered On:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3 p-4 bg-Beige border-t">
                                                <button
                                                    onClick={() => handleViewCompany(company._id)}
                                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                                >
                                                    <FaEye className="mr-2" /> View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(company._id)}
                                                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                >
                                                    <FiTrash2 className="mr-2" /> Delete
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

export default CompaniesPage;