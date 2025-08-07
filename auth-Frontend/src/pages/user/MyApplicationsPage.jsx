// src/pages/user/MyApplicationsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaSpinner, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Bottom from "./Bottom";

const MyApplicationsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = "http://localhost:4002/api";

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user || user.role !== 'user' || !token) {
        setLoading(false);
        setError("Please log in as an applicant to view your applications.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiBase}/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (err) {
        console.error("Error fetching my applications:", err.response?.data?.message || err.message);
        setError("Failed to load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [user, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-DarkGray">
    <Navbar/>
    <div className="max-w-6xl mx-auto p-6 lg:p-8 min-h-screen bg-LightGray shadow-lg rounded-xl my-8">
      <div className="bg-Teal text-Purple rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Application Page</h1>
                            <p className="text-md md:text-lg text-Purple">Manage your Applications here.</p>
                        </div>
                        
                    </div>
                </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <p className="ml-3 text-lg text-gray-600">Loading your applications...</p>
        </div>
      )}
      {error && <p className="text-center text-red-600 py-8">{error}</p>}
      {!loading && !error && applications.length === 0 && (
        <p className="text-center text-gray-600 py-8">You haven't applied for any jobs yet.</p>
      )}

      <div className="space-y-6">
        {applications.map((app) => (
          <div key={app._id} className="bg-Teal p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link to={`/job/${app.job._id}`} className="text-xl font-semibold text-blue-700 hover:underline">
                  {app.job.jobTitle}
                </Link>
                <p className="text-md text-gray-700 mt-1">{app.job.companyName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Applied on: {new Date(app.appliedDate).toLocaleDateString()}
            </p>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p className="flex items-center gap-2">
                    <span className="font-medium">Location:</span> {app.job.jobLocation}
                </p>
                <p className="flex items-center gap-2">
                    <span className="font-medium">Employment Type:</span> {app.job.employmentType}
                </p>
                <p className="flex items-center gap-2">
                    <span className="font-medium">Salary:</span> {app.job.salaryType}: ${app.job.minPrice} - ${app.job.maxPrice}
                </p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
    <Bottom/>
    </div>
  );
};

export default MyApplicationsPage;