// src/pages/admin/CompanyDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaEye, FaSpinner } from 'react-icons/fa';
import AdminNavbar from './AdminNavbar'; 

const CompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required.");
                setLoading(false);
                return;
            }
            try {
                const [companyRes, jobsRes] = await Promise.all([
                    fetch(`http://localhost:4002/api/admin/companies/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:4002/api/admin/companies/${id}/jobs`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!companyRes.ok) throw new Error('Failed to fetch company details');
                if (!jobsRes.ok) throw new Error('Failed to fetch company jobs');

                const companyData = await companyRes.json();
                const jobsData = await jobsRes.json();

               
                setCompany(companyData.company || null);
                setCompanyJobs(jobsData.jobs || []);

            } catch (err) {
                setError(err.message || "Failed to load company data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

     if (loading) {
        return <div className="flex justify-center items-center h-screen bg-DarkGray"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }

    
    if (error) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
                <div className="text-center text-lg font-medium text-red-600 p-4 bg-red-100 rounded-lg shadow-sm">
                    Error: {error}
                    <button
                        onClick={() => navigate(-1)} // Go back to previous page
                        className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
                <div className="text-center text-lg font-medium text-gray-600 p-4 bg-white rounded-lg shadow-md">
                    Company not found or details could not be loaded.
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-DarkGray min-h-screen">
            <AdminNavbar />
            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                

                {/* --- Company Details Card --- */}
                <div className="bg-LightGray shadow-lg rounded-lg p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <img
                            src={company.logo ? `http://localhost:4002/${company.logo}` : `https://ui-avatars.com/api/?name=${company.companyName}`}
                            alt={`${company.companyName} Logo`}
                            className="w-20 h-20 object-cover rounded-full border-2 border-blue-200"
                        />
                        <div className="ml-5">
                            <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
                            
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div>
                        <p className="text-gray-500 font-semibold text-sm mb-1">Email:</p>
                        <p className="text-base">{company.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold text-sm mb-1">Location:</p>
                        <p className="text-base">{company.location}</p>
                    </div>
                    {company.phone && (
                        <div>
                            <p className="text-gray-500 font-semibold text-sm mb-1">Phone:</p>
                            <p className="text-base">{company.phone}</p>
                        </div>
                    )}
                    {company.website && (
                        <div>
                            <p className="text-gray-500 font-semibold text-sm mb-1">Website:</p>
                            <p className="text-blue-600 hover:underline">
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                    {company.website}
                                </a>
                            </p>
                        </div>
                    )}
                    {company.createdAt && (
                        <div>
                            <p className="text-gray-500 font-semibold text-sm mb-1">Registered On:</p>
                            <p className="text-base">{new Date(company.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}
                    {company.updatedAt && (
                        <div>
                            <p className="text-gray-500 font-semibold text-sm mb-1">Last Updated:</p>
                            <p className="text-base">{new Date(company.updatedAt).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {company.description || 'No description available for this company.'}
                    </p>
                </div>
                </div>

                
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Jobs Posted by {company.companyName}</h2>
                    {companyJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {companyJobs.map((job) => (
                                <div key={job._id} className="bg-Beige border rounded-lg shadow-sm p-5 flex flex-col justify-between transition-transform hover:-translate-y-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-blue-700 mb-2 pr-2 ">{job.jobTitle}</h3>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-2 mt-2">
                                            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {job.jobLocation}</p>
                                            <p className="flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" /> ${job.minPrice} - ${job.maxPrice} ({job.salaryType})</p>
                                            <p className="flex items-center gap-2"><FaBriefcase className="text-gray-400" /> {job.employmentType}</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t flex justify-end">
                                        <Link to={`/admin/jobs/${job._id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1">
                                            <FaEye /> View Job
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-lg shadow-md text-gray-500">
                            This company has not posted any jobs yet.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyDetailsPage;