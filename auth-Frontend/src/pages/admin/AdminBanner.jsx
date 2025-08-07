// src/components/AdminBanner.js
import React, { useState, useEffect, useContext } from 'react';
import { FaUsers, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { AuthContext } from "../../AuthContext"; 

const AdminBanner = () => {
    
    const [stats, setStats] = useState({
        users: { total: 0, change: '' },
        companies: { total: 0, change: '' },
        jobs: { total: 0, change: '' },
    });
    const [loading, setLoading] = useState(true); 
    const { token } = useContext(AuthContext); 

    
    const fetchData = async () => {
        if (!token) {
            console.log("No token available. Cannot fetch admin stats.");
            setLoading(false);
            return;
        }

        try {
           
            const response = await fetch('http://localhost:4002/api/stats', { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send the token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch dashboard data');
            }

            const data = await response.json();
            setStats(data); 
        } catch (error) {
            console.error("Backend se data fetch karne mein error:", error);
            setStats({
                users: { total: 'N/A', change: 'Failed to load data' }, 
                companies: { total: 'N/A', change: 'Failed to load data' },
                jobs: { total: 'N/A', change: 'Failed to load data' },
            });
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchData(); 
        const intervalId = setInterval(fetchData, 10000); 

        return () => clearInterval(intervalId);
    }, [token]);

    
    if (loading) {
        return <div className="text-center p-10 text-xl text-blue-600 bg-DarkGray">Loading Dashboard Data...</div>;
    }

    return (
        
        <div className="bg-DarkGray p-4 sm:p-6 lg:p-5"> 
            <div className="max-w-5xl mx-auto"> 
                {/* Header Section */}
                <header className="bg-LightGray text-Purple p-6 sm:p-8 rounded-xl shadow-lg mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold">Welcome back, Admin!</h1>
                    <p className="mt-2 text-lg opacity-90">Here's what's happening with your job portal today.</p>
                </header>

                {/* Stats Cards Section */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Total Users */}
                    <div className="bg-green-300 p-6 rounded-xl shadow-md flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold">Total Users</p>
                            <p className="text-4xl font-bold mt-2 text-gray-800">{stats.users.total.toLocaleString()}</p>
                            <p className="text-gray-600 mt-2">{stats.users.change}</p>
                        </div>
                        <div className="text-gray-400">
                            <FaUsers size="2rem" />
                        </div>
                    </div>

                    {/* Card 2: Total Companies */}
                    <div className="bg-blue-300 p-6 rounded-xl shadow-md flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold">Total Companies</p>
                            <p className="text-4xl font-bold mt-2 text-gray-800">{stats.companies.total.toLocaleString()}</p>
                            <p className="text-gray-600 mt-2">{stats.companies.change}</p>
                        </div>
                        <div className="text-gray-400">
                            <FaBuilding size="2rem" />
                        </div>
                    </div>

                    {/* Card 3: Total Jobs */}
                    <div className="bg-red-300 p-6 rounded-xl shadow-md flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold">Total Jobs</p>
                            <p className="text-4xl font-bold mt-2 text-gray-800">{stats.jobs.total.toLocaleString()}</p>
                            <p className="text-gray-600 mt-2">{stats.jobs.change}</p>
                        </div>
                        <div className="text-gray-400">
                            <FaBriefcase size="2rem" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminBanner;