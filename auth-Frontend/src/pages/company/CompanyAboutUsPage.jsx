// src/pages/company/AboutUsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar'; 
 
import { FaBullseye, FaStream, FaHandshake } from 'react-icons/fa';
import Footer from './Footer';

const CompanyAboutUsPage = () => {
    return (
        <div className="bg-DarkGray flex flex-col min-h-screen">
            <DashboardNavbar />

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20 px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About JobShop</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-100">
                        We are dedicated to bridging the gap between talented professionals and visionary companies. Our mission is to make hiring simple, efficient, and successful for everyone.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    
                    {/* --- Why Choose Us Section --- */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800">Why Companies Trust Us</h2>
                        <p className="mt-2 text-gray-500">We provide the tools and insights you need to build a winning team.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature Card 1 */}
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                                <FaBullseye className="h-8 w-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-gray-900">Access Top Talent</h3>
                            <p className="mt-2 text-gray-500">
                                Reach thousands of qualified candidates actively looking for their next opportunity. Our smart filters help you find the perfect match.
                            </p>
                        </div>
                        {/* Feature Card 2 */}
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
                                <FaStream className="h-8 w-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-gray-900">Streamlined Hiring</h3>
                            <p className="mt-2 text-gray-500">
                                From posting a job to managing applications and scheduling interviews, our platform simplifies every step of your hiring process.
                            </p>
                        </div>
                        {/* Feature Card 3 */}
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600">
                                <FaHandshake className="h-8 w-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-gray-900">Dedicated Support</h3>
                            <p className="mt-2 text-gray-500">
                                Our support team is always here to help you get the most out of our platform and answer any questions you may have.
                            </p>
                        </div>
                    </div>

                    {/* --- Statistics Section --- */}
                    <div className="mt-20 bg-gray-800 rounded-lg shadow-xl">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-12 px-4">
                            <div>
                                <p className="text-4xl font-bold text-white">5,000+</p>
                                <p className="mt-1 text-indigo-200">Companies Trust Us</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white">10,000+</p>
                                <p className="mt-1 text-indigo-200">Active Job Postings</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white">98%</p>
                                <p className="mt-1 text-indigo-200">Client Satisfaction</p>
                            </div>
                        </div>
                    </div>

                    {/* --- Our Story Section --- */}
                    <div className="mt-20 bg-white p-12 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 text-center">Our Story</h2>
                        <div className="prose lg:prose-lg max-w-3xl mx-auto mt-6 text-gray-600 text-center">
                            <p>
                                Founded in 2024, JobShop was born from a simple idea: to create a hiring platform that truly understands the needs of both employers and job seekers. We saw the challenges companies faced in finding the right talent and the hurdles candidates had to overcome. So, we built a bridge. Today, we're proud to be a leading destination for talent acquisition, driven by technology and a passion for helping people and businesses grow together.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Call to Action Section --- */}
                <div className="bg-white">
                    <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Ready to Find Your Next Great Hire?
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Join thousands of other companies and start building your dream team today.
                        </p>
                        <Link
                            to="/post-job"
                            className="mt-8 inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Post a Job for Free
                        </Link>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default CompanyAboutUsPage;