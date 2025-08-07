// CompanyProfile.jsx
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import DashboardNavbar from "../../components/DashboardNavbar";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCodeBranch,
  FaSpinner,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaBriefcase,
  FaRegBuilding,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineLocationOn } from "react-icons/md";
const CompanyProfile = () => {
  const { token } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const companyApi = "http://localhost:4002/api/companies";
  const jobsApi = "http://localhost:4002/api/jobs";
  const baseUrl = "http://localhost:4002";

  const getImageUrl = useCallback(
    (logoPath) => {
      if (!logoPath) return null;
      const cleanPath = logoPath.replace(/^\/+/, "");
      return cleanPath.startsWith("http")
        ? cleanPath
        : `${baseUrl}/${cleanPath}`;
    },
    [baseUrl]
  );

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const companyRes = await axios.get(`${companyApi}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companyData = companyRes.data.user;

        const initialData = {
          companyName: companyData.companyName || "",
          zipCode: companyData.zipCode || "",
          website: companyData.website || "",
          description: companyData.description || "",
          phone: companyData.phone || "",
          location: companyData.location || "",
          logo: companyData.logo || "",
        };

        setCompany(companyData);
        setFormData(initialData);

        const jobsRes = await axios.get(`${jobsApi}/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostedJobs(jobsRes.data.jobs);
        setJobCount(jobsRes.data.jobs.length);
      } catch (err) {
        console.error("Error fetching company profile or jobs:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyAndJobs();
  }, [token, companyApi, jobsApi]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setNewLogoFile(e.target.files[0]);
  }, []);

  const saveProfile = useCallback(async () => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "logo" && formData[key] !== undefined)
          form.append(key, formData[key]);
      });
      if (newLogoFile) form.append("logo", newLogoFile);

      const res = await axios.patch(`${companyApi}/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setCompany(res.data.user);
        setFormData(res.data.user);
        setEditMode(false);
        setNewLogoFile(null);
      } else {
        alert("Failed to update profile: " + res.data.message);
      }
    } catch (err) {
      console.error(
        "Error saving company profile:",
        err.response?.data?.message || err.message
      );
      alert(
        `An error occurred: ${err.response?.data?.message || err.message}.`
      );
    } finally {
      setLoading(false);
    }
  }, [formData, newLogoFile, token, companyApi]);

  const handleEditCancel = useCallback(() => {
    setEditMode(false);
    setFormData(company);
    setNewLogoFile(null);
  }, [company]);

  const logoUrl = useMemo(() => {
    return company?.logo ? getImageUrl(company.logo) : null;
  }, [company?.logo, getImageUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-DarkGray">
        <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
      </div>
    );
  }
  if (!company)
    return <p className="text-center mt-6">No company profile found.</p>;

  return (
    <div className="bg-DarkGray min-h-screen">
      <DashboardNavbar />
      <div className="max-w-4xl mx-auto p-6 text-gray-800 font-sans space-y-6 bg-DarkGray">
        {/* Company Profile Header */}
        <div className="bg-LightGray  rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-blue-200 shadow-sm flex-shrink-0">
            {newLogoFile ? (
              <img
                src={URL.createObjectURL(newLogoFile)}
                alt="New Company Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : company.logo ? (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <FaRegBuilding className="text-5xl text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">
                  No logo uploaded
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            {editMode ? (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {company.logo && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {company.logo}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="border p-2 rounded mb-2 w-full text-lg font-bold"
                />
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Company Description / About Us"
                  className="border p-2 rounded mb-2 w-full h-24 resize-y"
                />
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
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className="border p-2 rounded mb-2 w-full"
                />
                <input
                  type="url"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  placeholder="Company Website URL (https://example.com)"
                  className="border p-2 rounded mb-2 w-full"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{company.companyName}</h1>
                <p className="text-gray-600 mt-3">{company.description}</p>
                <div className="flex items-center mt-2 text-md text-gray-700">
                  <FaBriefcase className="text-xl mr-2 text-blue-600" />
                  <span className="font-semibold">{jobCount}</span> Posted Jobs
                </div>
              </>
            )}

            <div className="mt-4 text-sm text-gray-500 space-y-2">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-600" /> {company.email}
              </p>
              {company.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-600" /> {company.phone}
                </p>
              )}
              {company.location && (
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-600" />{" "}
                  {company.location}
                </p>
              )}
              {company.zipCode && (
                <p className="flex items-center gap-2">
                  <MdOutlineLocationOn className="text-gray-600" /> Zip Code:{" "}
                  {company.zipCode}
                </p>
              )}
              {company.website && (
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-gray-600" />
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2 items-center">
              <button
                className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                  editMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => (editMode ? saveProfile() : setEditMode(true))}
                disabled={loading}
              >
                {editMode ? <FaSave /> : <FaEdit />}
                {editMode
                  ? loading
                    ? "Saving..."
                    : "Save Changes"
                  : "Edit Profile"}
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

        {/* Posted Jobs Section */}
        <div className="bg-LightGray rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCodeBranch className="text-xl" /> Posted Jobs ({jobCount})
          </h2>
          {postedJobs.length === 0 ? (
            <p className="text-gray-600">
              This company hasn't posted any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postedJobs.map((job) => (
                <div
                  key={job._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-md font-semibold text-blue-700">
                    {job.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.employmentType} | {job.jobLocation} | {job.salaryType}:{" "}
                    {job.minPrice}-{job.maxPrice}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on: {new Date(job.postingDate).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/job/${job._id}`}
                    className="mt-3 inline-block text-blue-500 hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
