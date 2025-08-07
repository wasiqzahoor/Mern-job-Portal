// src/components/Bottom.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

const Bottom = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* --- Branding Section --- */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-3">
                            <img 
                                src="/images/logo.png" 
                                alt="JobShop Logo" 
                                className="h-10 w-10 bg-white p-1 rounded-lg"
                            />
                            <h2 className="text-2xl font-bold text-white">JobShop</h2>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            Connecting talent with opportunity. Find your dream job with us.
                        </p>
                    </div>

                    {/* --- For Candidates Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">For Candidates</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/all-jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                            <li><Link to="/my-applications" className="hover:text-white transition-colors">My Applications</Link></li>
                            <li><Link to="/saved-jobs" className="hover:text-white transition-colors">Saved Jobs</Link></li>
                            <li><Link to="/view-profile" className="hover:text-white transition-colors">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* --- Company Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/userabout" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                    
                    {/* --- Stay Connected Section --- */}
                    <div>
                         <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Stay Connected</h4>
                         <p className="mt-4 text-sm text-gray-400">
                             Get the latest job updates and news.
                         </p>
                        
                    </div>

                </div>

                {/* --- Bottom Bar with Copyright & Socials --- */}
                <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400 text-center sm:text-left">
                        © {currentYear} JobShop. All Rights Reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaTwitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaInstagram /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Bottom;