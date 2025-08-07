// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'; 

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-Footer text-gray-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    
                    {/* --- Branding Section --- */}
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-3">
                            <img 
                                src="/images/logo.png" 
                                alt="JobShop Logo" 
                                className="h-10 w-10 bg-white p-1 rounded-lg" 
                            />
                            <h2 className="text-2xl font-bold text-white">JobShop</h2>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            The ultimate hiring portal for modern companies. Find the best talent, faster.
                        </p>
                    </div>

                    {/* --- Quick Links Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Quick Links</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/company" className="hover:text-white transition-colors">Dashboard</Link></li>
                            <li><Link to="/company-jobs" className="hover:text-white transition-colors">My Jobs</Link></li>
                            <li><Link to="/post-job" className="hover:text-white transition-colors">Post a New Job</Link></li>
                            <li><Link to="/applications" className="hover:text-white transition-colors">Applications</Link></li>
                        </ul>
                    </div>

                    {/* --- Support Section --- */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    
                    {/* --- Company Profile Section --- */}
                    <div className="col-span-2 md:col-span-1">
                         <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h4>
                        <ul className="mt-4 space-y-3">
                            <li><Link to="/company-profile" className="hover:text-white transition-colors">My Profile</Link></li>
                             <li><Link to="/about" className="hover:text-white transition-colors">About JobShop</Link></li>
                        </ul>
                    </div>

                </div>

                {/* --- Bottom Bar with Copyright & Socials --- */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400 text-center sm:text-left">
                        © {currentYear} JobShop, Inc. All Rights Reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaGithub /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
