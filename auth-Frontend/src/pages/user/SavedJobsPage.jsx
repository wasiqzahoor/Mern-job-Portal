import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import JobCard from "../../components/JobCard";
import { FaSpinner, FaHeart } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Bottom from "./Bottom";

const SavedJobsPage = () => {
  const { user, token, updateUserContext } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = "http://localhost:4002/api";

  const fetchSavedJobs = async () => {
    if (!user || user.role !== "user" || !token) {
      setLoading(false);
      setError("Please log in as an applicant to view saved jobs.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiBase}/users/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(res.data.savedJobs || []);

     
      if (updateUserContext && res.data.savedJobs) {
        updateUserContext({
          ...user,
          savedJobs: res.data.savedJobs.map((job) => job._id),
        });
      }
    } catch (err) {
      console.error(
        "Error fetching saved jobs:",
        err.response?.data?.message || err.message
      );
      setError("Failed to load saved jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user, token]);

  const handleSaveToggle = (jobId, isNowSaved) => {
    if (!isNowSaved) {
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    }
    if (user && updateUserContext) {
      const updatedSavedJobsIds = isNowSaved
        ? [...(user.savedJobs || []), jobId]
        : (user.savedJobs || []).filter((id) => id !== jobId);
      updateUserContext({ ...user, savedJobs: updatedSavedJobsIds });
    }
  };

  return (
    <div className="bg-DarkGray">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 lg:p-8 min-h-screen bg-LightGray shadow-lg rounded-xl my-8">
        <div className="bg-Teal text-Purple rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Saved Jobs</h1>
                            <p className="text-md md:text-lg text-Purple">Manage your savedJobs Jobs and Apply for it.</p>
                        </div>
                        
                    </div>
                </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <p className="ml-3 text-lg text-gray-600">Loading saved jobs...</p>
          </div>
        )}
        {error && <p className="text-center text-red-600 py-8">{error}</p>}
        {!loading && !error && savedJobs.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            You haven't saved any jobs yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSaveToggle={handleSaveToggle}
              isSavedInitial={true}
            />
          ))}
        </div>
      </div>
      <Bottom/>
    </div>
  );
};

export default SavedJobsPage;
