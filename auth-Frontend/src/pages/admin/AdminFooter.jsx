// src/components/AdminFooter.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-Footer text-gray-400">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* --- Branding Section --- */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3">
                            <img 
                                src="/images/logo.png" 
                                alt="JobShop Logo" 
                                className="h-10 w-10 bg-white p-1 rounded-lg"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-white">JobShop</h2>
                                <p className="text-sm text-indigo-300">Admin Portal</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm">
                            Centralized management for users, companies, jobs, and applications.
                        </p>
                    </div>

                    {/* --- Main Navigation Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Quick Links</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link></li>
                            <li><Link to="/admin/users" className="hover:text-white transition-colors">Manage Users</Link></li>
                            <li><Link to="/admin/companies" className="hover:text-white transition-colors">Manage Companies</Link></li>
                            <li><Link to="/admin/jobs" className="hover:text-white transition-colors">Manage Jobs</Link></li>
                            <li><Link to="/admin/applications" className="hover:text-white transition-colors">Manage Applications</Link></li>
                        </ul>
                    </div>

                    {/* --- System Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">System</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/admin/profile" className="hover:text-white transition-colors">Profile Settings</Link></li>
                            <li><Link to="/admin/about" className="hover:text-white transition-colors">Analytics</Link></li>
                            
                        </ul>
                    </div>

                </div>

                {/* --- Bottom Bar with Copyright --- */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-center sm:text-left">
                        © {currentYear} JobShop Admin Portal. All Rights Reserved.
                    </p>
                    <p className="text-sm text-gray-500 mt-4 sm:mt-0">
                        Version 1.0.0
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;