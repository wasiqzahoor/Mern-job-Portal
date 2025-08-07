import React, { useEffect, useState } from 'react';
import axios from '../../api/axios'; 
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserTie, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaSpinner } from 'react-icons/fa'; 
import moment from 'moment'; 
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from './Footer';

const CompanyInterviewsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                setError(''); 

                // Fetch applications filtered by 'interviewed' status
                const response = await axios.get('/applications/company-applications', {
                    params: { status: 'interviewed' }
                });

                
                if (response.data && Array.isArray(response.data.applications)) {
                    setApplications(response.data.applications);
                } else {
                   
                    console.warn("API returned non-array or unexpected data for applications:", response.data);
                    setApplications([]); 
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching interviews:", err.response?.data?.message || err.message);
                setError('Failed to load interview list. Please try again. ' + (err.response?.data?.message || ''));
                setApplications([]); 
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []); 

     if (loading) {
        return <div className="flex justify-center items-center h-screen bg-DarkGray"><FaSpinner className="animate-spin text-indigo-500 text-4xl" /></div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <>
        <DashboardNavbar/>
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Scheduled Interviews</h1>

            
            {applications.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">No interviews currently scheduled.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                            <div className="p-6">
                                {/* Link to individual application details page */}
                                <Link to={`/company/applications/${app._id}`} className="block">
                                    <h2 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 truncate mb-2" title={app.job?.jobTitle}>
                                        {app.job?.jobTitle || 'N/A Job Title'}
                                    </h2>
                                </Link>
                                <p className="text-gray-700 text-lg font-medium mb-3">
                                    <FaUserTie className="inline-block mr-2 text-gray-500" />
                                    {/* Display applicant name, with defensive checks for nested properties */}
                                    {app.applicant ? `${app.applicant.firstName || ''} ${app.applicant.lastName || ''}`.trim() || 'N/A Applicant' : 'N/A Applicant'}
                                </p>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>
                                        <FaBuilding className="inline-block mr-2 text-gray-500" />
                                        {app.job?.companyName || 'N/A Company'}
                                    </p>
                                    <p>
                                        <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />
                                        {app.job?.jobLocation || 'N/A Location'}
                                    </p>
                                    <p>
                                        <FaBriefcase className="inline-block mr-2 text-gray-500" />
                                        {app.job?.employmentType || 'N/A Employment Type'}
                                    </p>
                                    {/* Defensive check for job prices before rendering */}
                                    {app.job?.minPrice && app.job?.maxPrice && (
                                        <p>
                                            <FaMoneyBillWave className="inline-block mr-2 text-gray-500" />
                                            {app.job.minPrice} - {app.job.maxPrice} {app.job.salaryType || 'Yearly'}
                                        </p>
                                    )}
                                    {/* Display interview date if available */}
                                    {app.interviewDate && (
                                        <p className="text-indigo-700 font-semibold flex items-center">
                                            <FaCalendarAlt className="inline-block mr-2 text-indigo-600" />
                                            Interview: {moment(app.interviewDate).format('MMMM Do, YYYY [at] h:mm A')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                <span>Applied: {moment(app.appliedDate).format('MMM D, YYYY')}</span>
                                {/* Link to individual application details page */}
                                <Link to={`/applications/${app._id}`} className="text-indigo-600 hover:underline font-medium">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default CompanyInterviewsPage;