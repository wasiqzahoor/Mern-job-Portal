import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaRegUserCircle, 
} from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import AdminNavbar from "./AdminNavbar";


const AdminProfile = () => {
  const { token } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null); 
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newProfilePicFile, setNewProfilePicFile] = useState(null); 
  const [loading, setLoading] = useState(true);

  
  const api = "http://localhost:4002/api/admin";
  const baseUrl = "http://localhost:4002";

 
  const getImageUrl = useCallback((profilePicPath) => {
    if (!profilePicPath) return null;
    const cleanPath = profilePicPath.replace(/^\/+/, '');
    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }
    return `${baseUrl}/${cleanPath}`;
  }, [baseUrl]);

  useEffect(() => {
    const fetchAdminProfile = async () => { 
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const adminRes = await axios.get(`${api}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const adminData = adminRes.data.user; 

        
        

        const initialData = {
          fullName: adminData.fullName || "", 
          username: adminData.username || "", 
          phone: adminData.phone || "",
          location: adminData.location || "",
          profilePicture: adminData.profilePicture || "", 
         
        };

        setAdmin(adminData);
        setFormData(initialData);

        
      } catch (err) {
        console.error("Error fetching admin profile:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [token, api]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setNewProfilePicFile(e.target.files[0]); 
  }, []);

  const saveProfile = useCallback(async () => {
    setLoading(true);
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "profilePicture" && formData[key] !== undefined && formData[key] !== null) { 
          form.append(key, formData[key]);
        }
      });

      if (newProfilePicFile) {
        form.append("profilePicture", newProfilePicFile); 
      }

      
      const res = await axios.patch(
        `http://localhost:4002/api/admin/profile`, 
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setAdmin(res.data.user); 
        setFormData(res.data.user);
        setEditMode(false);
        setNewProfilePicFile(null);
      } else {
        alert("Failed to update profile: " + res.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error saving admin profile:", errorMessage);
      alert(`An error occurred while saving the profile: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [formData, newProfilePicFile, token]);

  const handleEditCancel = useCallback(() => {
    setEditMode(false);
    setFormData(admin); 
    setNewProfilePicFile(null);
  }, [admin]);

 
  const profilePicUrl = useMemo(() => {
    return admin?.profilePicture ? getImageUrl(admin.profilePicture) : null;
  }, [admin?.profilePicture, getImageUrl]);

  if (loading)
    return (
      <p className="text-center mt-6 text-lg font-medium text-gray-700 bg-DarkGray">
        Loading admin profile...
      </p>
    );
  if (!admin)
    return (
      <p className="text-center mt-6 text-lg font-medium text-gray-700">
        No admin profile found or not logged in as an admin.
      </p>
    );

  return (
    <>
      <AdminNavbar/>
      <div className="max-w-8xl mx-auto p-10 py-10 px-30 text-gray-800 font-sans space-y-6 bg-DarkGray min-h-screen min-w-screen">
        {/* Admin Profile Header */}
        <div className="bg-LightGray rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-blue-200 shadow-sm flex-shrink-0">
            {newProfilePicFile ? (
              <img
                src={URL.createObjectURL(newProfilePicFile)}
                alt="New Admin Profile Picture Preview"
                className="w-full h-full object-cover"
              />
            ) : admin.profilePicture ? (
              <img
                src={profilePicUrl}
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <FaRegUserCircle className="text-5xl text-gray-500" /> {/* Changed icon */}
                <span className="text-xs text-gray-500 mt-1">No profile picture</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            {editMode ? (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {admin.profilePicture && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {admin.profilePicture}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="fullName" 
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-2 rounded mb-2 w-full text-lg font-bold"
                />
                <input
                  type="text"
                  name="username" 
                  value={formData.username || ""}
                  onChange={handleChange}
                  placeholder="Username"
                  className="border p-2 rounded mb-2 w-full"
                />
                {/* Removed company-specific fields like description, zipCode, website */}
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border p-2 rounded mb-2 w-full"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  placeholder="Location (e.g., City, Country)"
                  className="border p-2 rounded mb-2 w-full"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">
                  {admin.fullName || admin.username} 
                </h1>
                <p className="text-gray-600 mt-1">
                  {admin.username && `@${admin.username}`} 
                </p>
                {/* Removed "Posted Jobs" count and icon */}
              </>
            )}
            
            <div className="mt-4 text-sm text-gray-500 space-y-2">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-600" /> {admin.email}
              </p>
              {admin.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-600" /> {admin.phone}
                </p>
              )}
              {admin.location && (
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-600" /> {admin.location}
                </p>
              )}
              {/* Removed zipCode and website as they are less relevant for a general admin profile */}
            </div>

            <div className="mt-4 flex gap-2 items-center">
              <button
                className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                  editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => (editMode ? saveProfile() : setEditMode(true))}
                disabled={loading}
              >
                {editMode ? <FaSave /> : <FaEdit />}
                {editMode ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}
              </button>
              {editMode && (
                <button
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-2"
                  onClick={handleEditCancel}
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default AdminProfile;