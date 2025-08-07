// src/pages/user/AboutPage.jsx

import React from 'react';
import Navbar from '../../components/Navbar';

import { FaBullseye, FaPaperPlane, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Bottom from './Bottom';

const AboutPage = () => {
    
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-20 px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Connecting Ambition with Opportunity</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-100">
                        Learn more about our mission, how to reach us, and the policies that govern our platform.
                    </p>
                </div>
                
                {/* --- Sticky Navigation for Sections --- */}
                <div className="sticky top-0 z-30 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto flex justify-center space-x-4 sm:space-x-8 py-3 px-4 overflow-x-auto">
                        <button onClick={() => scrollToSection('about-us')} className="text-sm sm:text-base font-semibold text-gray-600 hover:text-indigo-600 whitespace-nowrap">About Us</button>
                        <button onClick={() => scrollToSection('contact-us')} className="text-sm sm:text-base font-semibold text-gray-600 hover:text-indigo-600 whitespace-nowrap">Contact Us</button>
                        <button onClick={() => scrollToSection('terms-of-service')} className="text-sm sm:text-base font-semibold text-gray-600 hover:text-indigo-600 whitespace-nowrap">Terms of Service</button>
                        <button onClick={() => scrollToSection('privacy-policy')} className="text-sm sm:text-base font-semibold text-gray-600 hover:text-indigo-600 whitespace-nowrap">Privacy Policy</button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-20">
                    
                    {/* --- About Us Section --- */}
                    <section id="about-us">
                        <div className="text-center">
                            <FaBullseye className="text-5xl text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                        </div>
                        <div className="prose lg:prose-lg max-w-none mx-auto mt-6 text-gray-600">
                            <p>
                                JobShop was founded with a clear vision: to create a more transparent, efficient, and human-centric job market. We believe that finding the right job or the right candidate shouldn't be a chore. It should be an exciting journey of discovery. Our platform leverages cutting-edge technology to connect talented professionals with innovative companies, fostering growth and success for both. We are committed to empowering careers and building the future of work, one successful match at a time.
                            </p>
                        </div>
                    </section>
                    
                    {/* --- Contact Us Section --- */}
                    <section id="contact-us">
                        <div className="text-center">
                            <FaPaperPlane className="text-5xl text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
                            <p className="mt-2 text-gray-500">Have questions or feedback? We'd love to hear from you.</p>
                        </div>
                        <form className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea id="message" rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            <div className="sm:col-span-2 text-right">
                                <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </section>
                    
                    {/* --- Terms of Service Section --- */}
                    <section id="terms-of-service">
                         <div className="text-center">
                            <FaInfoCircle className="text-5xl text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800">Terms of Service</h2>
                        </div>
                        <div className="prose lg:prose-lg max-w-none mx-auto mt-6 text-gray-600">
                           <h4>1. Acceptance of Terms</h4>
                           <p>By accessing and using JobShop, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                           <h4>2. User Conduct</h4>
                           <p>You agree not to use the platform for any unlawful purpose or to post any false, misleading, or defamatory content. We reserve the right to suspend or terminate accounts that violate these terms.</p>
                           
                        </div>
                    </section>
                    
                    {/* --- Privacy Policy Section --- */}
                    <section id="privacy-policy">
                         <div className="text-center">
                            <FaShieldAlt className="text-5xl text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800">Privacy Policy</h2>
                        </div>
                        <div className="prose lg:prose-lg max-w-none mx-auto mt-6 text-gray-600">
                            <h4>1. Information We Collect</h4>
                            <p>We collect information you provide directly to us, such as your name, email, resume, and job application history, to provide and improve our services.</p>
                            <h4>2. How We Use Your Information</h4>
                            <p>Your data is used to match you with job opportunities, communicate with you, and personalize your experience. We do not sell your personal data to third parties.</p>
                             
                        </div>
                    </section>

                </div>
            </main>

            <Bottom/>
        </div>
    );
};

export default AboutPage;