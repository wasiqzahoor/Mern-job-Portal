// src/pages/company/PendingApprovalPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaHome } from 'react-icons/fa';

const PendingApprovalPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-DarkGray">
            <div className="max-w-md w-full text-center bg-LightGray p-10 rounded-xl shadow-lg">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-6">
                    <FaClock className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Registration Submitted!</h1>
                <p className="mt-4 text-gray-600">
                    Thank you for registering. Your company profile has been submitted for review.
                    An administrator will approve your account shortly.
                </p>
                <p className="mt-2 text-gray-600">
                    You will receive an email notification once your account is approved.
                </p>
                <div className="mt-8">
                    <Link
                        to="/" // Home page ka link
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        <FaHome /> Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalPage;