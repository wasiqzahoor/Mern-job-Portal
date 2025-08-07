// src/pages/admin/AdminAboutUsPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';
import { FaUsers, FaBuilding, FaBriefcase, FaFileAlt, FaCheckCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';

const AdminAboutUsPage = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:4002/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data.stats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const platformVersion = "1.0.0"; 
    const lastUpdate = "August 5, 2025";

    const statsCards = [
        { title: "Total Users", value: stats?.totalUsers, icon: FaUsers, color: "text-blue-500" },
        { title: "Total Companies", value: stats?.totalCompanies, icon: FaBuilding, color: "text-indigo-500" },
        { title: "Total Jobs", value: stats?.totalJobs, icon: FaBriefcase, color: "text-green-500" },
        { title: "Total Applications", value: stats?.totalApplications, icon: FaFileAlt, color: "text-purple-500" },
    ];

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <AdminNavbar />

            <main className="flex-grow">
                {/* --- Header Section --- */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-800">About the Platform</h1>
                        <p className="mt-1 text-gray-500">
                            System information, key metrics, and platform details.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    {/* --- Statistics Section --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {loading ? (
                            <div className="col-span-full text-center p-8">
                                <FaSpinner className="animate-spin text-indigo-500 text-3xl mx-auto" />
                            </div>
                        ) : (
                            statsCards.map((stat, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-5">
                                    <div className={`text-3xl p-3 rounded-full bg-gray-100 ${stat.color}`}>
                                        {React.createElement(stat.icon)}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value ?? 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- Platform Info Card --- */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                JobShop was built to revolutionize the hiring process. Our mission is to create a seamless and efficient ecosystem where top-tier companies can connect with exceptional talent effortlessly. As administrators, we ensure the integrity, performance, and reliability of this platform, empowering both businesses and professionals to achieve their goals.
                            </p>
                        </div>

                        {/* --- System Status Card --- */}
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">System Information</h2>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex justify-between">
                                    <span className="font-semibold">Version:</span>
                                    <span>{platformVersion}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-semibold">Last Update:</span>
                                    <span>{lastUpdate}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="font-semibold">Status:</span>
                                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                                        <FaCheckCircle /> Operational
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <AdminFooter />
        </div>
    );
};

export default AdminAboutUsPage;