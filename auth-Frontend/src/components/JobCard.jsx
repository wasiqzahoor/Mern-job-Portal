import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaHeart, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const JobCard = ({ job, onSaveToggle, isSavedInitial = false, showApplyButton = true, onApplySuccess }) => {
  const { user, token } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isApplied, setIsApplied] = useState(false); 

  useEffect(() => {
    setIsSaved(isSavedInitial);
  }, [isSavedInitial]);

  
  const handleSaveToggle = async () => {
    if (!user || user.role !== "user" || !token) return;

    try {
      if (isSaved) {
        await axios.delete(`http://localhost:4002/api/users/unsave-job/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSaved(false);
      } else {
        await axios.post(
          `http://localhost:4002/api/users/save-job`,
          { jobId: job._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle(job._id, !isSaved);
    } catch (error) {
      console.error("Error toggling saved job status:", error.response?.data?.message || error.message);
    }
  };

    const handleApply = async () => {
    if (!user || user.role !== "user" || !token) return;

    try {
      const response = await axios.post(
        "http://localhost:4002/api/applications/apply",
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setIsApplied(true); 
        if (onApplySuccess) onApplySuccess();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 409) {
        window.alert("You have already applied for this job.");
      } else {
        console.error("Error applying for job:", error.response?.data || error.message);
      }
    }
  };



  return (
    <div className="bg-Beige p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full border border-gray-200">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 break-words pr-8">{job.jobTitle}</h3>
          {user && user.role === "user" && (
            <button
              onClick={handleSaveToggle}
              className="text-red-500 hover:text-red-600 transition-colors text-2xl flex-shrink-0"
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
        <p className="text-blue-600 font-medium mb-3">{job.companyName}</p>

        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" /> {job.jobLocation}
          </p>
          <p className="flex items-center gap-2">
            <FaMoneyBillWave className="text-gray-500" /> {job.salaryType}: ${job.minPrice} - ${job.maxPrice}
          </p>
          <p className="flex items-center gap-2">
            <FaClock className="text-gray-500" /> {job.employmentType}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills &&
            job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          {job.skills && job.skills.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Posted: {new Date(job.postingDate).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <Link to={`/job/${job._id}`} className="text-blue-600 hover:underline text-sm font-semibold">
          View Details
        </Link>
        {showApplyButton && user && user.role === "user" && (
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              isApplied ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
