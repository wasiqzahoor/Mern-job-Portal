import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaPlus, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaGithub, FaAward, FaStar, FaDownload, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { MdWork, MdSchool } from "react-icons/md"; 
import Navbar from "../../components/Navbar";
const ViewProfile = () => {
    const { token } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [skillsInput, setSkillsInput] = useState("");

    const api = "http://localhost:4002/api/users";
    const serverUrl = "http://localhost:4002"; 

const getImageUrl = useCallback((profilePicPath) => {
        if (!profilePicPath) return null;
        const cleanPath = profilePicPath.replace(/^\/+/, '');
        if (cleanPath.startsWith('http')) {
            return cleanPath;
        }
        return `${serverUrl}/${cleanPath}`;
    }, [serverUrl]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${api}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = res.data.user;

                // Initialize all fields to prevent errors
                userData.socialLinks = Array.isArray(userData.socialLinks) ? userData.socialLinks : [];
                userData.experience = Array.isArray(userData.experience) ? userData.experience : [];
                userData.education = Array.isArray(userData.education) ? userData.education : [];
                 userData.skills = Array.isArray(userData.skills) ? userData.skills : [];
                userData.languages = Array.isArray(userData.languages) ? userData.languages : [];
                userData.certifications = Array.isArray(userData.certifications) ? userData.certifications : [];
                userData.headline = userData.headline || "";
                userData.rating = userData.rating || 0;
                userData.reviewCount = userData.reviewCount || 0;

                setUser(userData);
                setFormData(userData);
                setSkillsInput(userData.skills.join(", "));
            } catch (err) {
                console.error("Error fetching profile:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, index, key, value) => {
        const updated = [...(formData[field] || [])];
        if (updated[index]) {
            updated[index][key] = value;
        }
        setFormData((prev) => ({ ...prev, [field]: updated }));
    };

    const addArrayItem = (field, template) => {
        setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), template] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

     const handleSkillsChange = (e) => {
        setSkillsInput(e.target.value);
    };


    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    };

    const saveProfile = async () => {
    
    const finalFormData = {
        ...formData, 
        skills: skillsInput
            .split(",") 
            .map(s => s.trim()) 
            .filter(s => s) 
    };

    try {
        const form = new FormData();

        Object.keys(finalFormData).forEach((key) => {
            if (key === "profilePic" || key === "resume" || key === "rating" || key === "reviewCount") {
                return;
            }
            if (
                Array.isArray(finalFormData[key]) ||
                (typeof finalFormData[key] === "object" && finalFormData[key] !== null && !(finalFormData[key] instanceof File))
            ) {
                form.append(key, JSON.stringify(finalFormData[key]));
            } else if (finalFormData[key] !== undefined && finalFormData[key] !== null) {
                form.append(key, finalFormData[key]);
            }
        });

        if (formData.profilePic instanceof File) {
            form.append("profilePic", formData.profilePic);
        }
        if (formData.resume instanceof File) {
            form.append("resume", formData.resume);
        }

        const res = await axios.put(`${api}/update`, form, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        
        const updatedUserData = res.data.user;
        setUser(updatedUserData);
        setFormData(updatedUserData);
        
       
        setSkillsInput(updatedUserData.skills.join(", ")); 

        setEditMode(false);
        alert("Profile data has been saved successfully!");
        
    } catch (err) {
        console.error("Error saving profile:", err.response ? err.response.data : err.message);
        alert(`An error occurred while saving the profile: ${err.response?.data?.message || err.message}. Please try again.`);
    }
};
    
   


    if (loading) return <p className="text-center mt-6">Loading...</p>;
    if (!user) return <p className="text-center mt-6">No profile found.</p>;

    return (
      <div className="bg-DarkGray ">
      <Navbar />
        <div className="max-w-5xl mx-auto p-6 text-gray-800 font-sans space-y-6 bg-LightGray">
            {/* Profile Header */}
            <div className="bg-Teal rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                
                 <img
                    src={
                        formData.profilePic instanceof File
                            ? URL.createObjectURL(formData.profilePic)
                            : getImageUrl(user.profilePic)
                                ? `${getImageUrl(user.profilePic)}?t=${new Date().getTime()}` 
                                : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover shadow"
                />
                <div className="flex-1">
                    {editMode ? (
                        <>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                className="block mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName || ""}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="border p-2 rounded mb-2 w-full text-lg font-bold"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName || ""}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="border p-2 rounded mb-2 w-full text-lg font-bold"
                            />
                            <input // NEW: Headline input
                                type="text"
                                name="headline"
                                value={formData.headline || ""}
                                onChange={handleChange}
                                placeholder="Your Professional Headline (e.g., Senior Full Stack Developer)"
                                className="border p-2 rounded mb-2 w-full text-blue-600"
                            />
                            <textarea
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleChange}
                                placeholder="Short Bio/Summary"
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
                                type="file"
                                name="resume"
                                onChange={handleFileChange}
                                className="block mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-blue-600 text-lg mt-1">{user.headline}</p>
                            
                            <p className="text-gray-600 mt-3">{user.bio}</p>
                        </>
                    )}
                    <div className="mt-4 text-sm text-gray-500 space-y-2">
                        <p className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-600" /> {user.email}
                        </p>
                        <p className="flex items-center gap-2">
                            <FaPhone className="text-gray-600" /> {user.phone}
                        </p>
                        <p className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-600" /> {user.location}
                        </p>
                    </div>
                    <div className="mt-4 flex gap-2 items-center">
                        {user.resume && (
                            <a
                                href={`${serverUrl}/${user.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="border px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                                <FaDownload /> Download CV
                            </a>
                        )}
                        <button
                            className={`px-4 py-2 rounded text-white flex items-center gap-2 ${editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                            onClick={() => (editMode ? saveProfile() : setEditMode(true))}
                        >
                            {editMode ? <FaSave /> : <FaEdit />} {editMode ? "Save Changes" : "Edit Profile"}
                        </button>
                        {editMode && (
                            <button
                                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-2"
                                onClick={() => {
                                    setEditMode(false);
                                    setFormData(user); // Revert changes on cancel
                                }}
                            >
                                <FaTimes /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Social Links</h2>
                {editMode ? (
                    <>
                        {formData.socialLinks?.map((link, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Platform (e.g., LinkedIn, Portfolio)"
                                    value={link.platform || ""}
                                    onChange={(e) =>
                                        handleArrayChange("socialLinks", idx, "platform", e.target.value)
                                    }
                                    className="border p-2 rounded w-1/3"
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={link.url || ""}
                                    onChange={(e) =>
                                        handleArrayChange("socialLinks", idx, "url", e.target.value)
                                    }
                                    className="border p-2 rounded w-2/3"
                                />
                                <button
                                    className="bg-red-500 text-white p-2 rounded"
                                    onClick={() => removeArrayItem("socialLinks", idx)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
                            onClick={() =>
                                addArrayItem("socialLinks", { platform: "", url: "" })
                            }
                        >
                            <FaPlus /> Add Link
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4 flex-wrap">
                        {Array.isArray(user.socialLinks) && user.socialLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                            >
                                {link.platform.toLowerCase().includes("linkedin") && <FaLinkedin />}
                                {link.platform.toLowerCase().includes("github") && <FaGithub />}
                                {(!link.platform.toLowerCase().includes("linkedin") && !link.platform.toLowerCase().includes("github")) && <FaGlobe />}
                                {link.platform}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Work Experience */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdWork className="text-xl" /> Work Experience
                </h2>
                {editMode ? (
                    <>
                        {formData.experience?.map((exp, idx) => (
                            <div key={idx} className="mb-4 border p-3 rounded space-y-2">
                                <input
                                    type="text"
                                    placeholder="Job Title"
                                    value={exp.title || ""}
                                    onChange={(e) =>
                                        handleArrayChange("experience", idx, "title", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={exp.company || ""}
                                    onChange={(e) =>
                                        handleArrayChange("experience", idx, "company", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Start Date (e.g., Jan 2022)"
                                        value={exp.startDate || ""}
                                        onChange={(e) =>
                                            handleArrayChange("experience", idx, "startDate", e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="End Date (e.g., Dec 2023 or Present)"
                                        value={exp.endDate || ""}
                                        onChange={(e) =>
                                            handleArrayChange("experience", idx, "endDate", e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                    />
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={exp.description || ""}
                                    onChange={(e) =>
                                        handleArrayChange("experience", idx, "description", e.target.value)
                                    }
                                    className="border p-2 rounded w-full h-20 resize-y"
                                />
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"
                                    onClick={() => removeArrayItem("experience", idx)}
                                >
                                    <FaTrash /> Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
                            onClick={() =>
                                addArrayItem("experience", { title: "", company: "", startDate: "", endDate: "", description: "" })
                            }
                        >
                            <FaPlus /> Add Experience
                        </button>
                    </>
                ) : (
                    <div className="space-y-4">
                        {user.experience?.map((exp, idx) => (
                            <div key={idx} className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-lg">{exp.title}</p>
                                        <p className="text-blue-600 text-sm">{exp.company}</p>
                                    </div>
                                    <div className="text-sm text-gray-500 text-right">
                                        <p>{exp.startDate} - {exp.endDate}</p>
                                        {exp.endDate?.toLowerCase() === "present" && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Current</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Education */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdSchool className="text-xl" /> Education
                </h2>
                {editMode ? (
                    <>
                        {formData.education?.map((edu, idx) => (
                            <div key={idx} className="mb-4 border p-3 rounded space-y-2">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    value={edu.degree || ""}
                                    onChange={(e) =>
                                        handleArrayChange("education", idx, "degree", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution || ""}
                                    onChange={(e) =>
                                        handleArrayChange("education", idx, "institution", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Start Year (e.g., 2015)"
                                        value={edu.startYear || ""}
                                        onChange={(e) =>
                                            handleArrayChange("education", idx, "startYear", e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="End Year (e.g., 2019)"
                                        value={edu.endYear || ""}
                                        onChange={(e) =>
                                            handleArrayChange("education", idx, "endYear", e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Grade (e.g., 3.8 GPA)"
                                    value={edu.grade || ""}
                                    onChange={(e) =>
                                        handleArrayChange("education", idx, "grade", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"
                                    onClick={() => removeArrayItem("education", idx)}
                                >
                                    <FaTrash /> Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
                            onClick={() =>
                                addArrayItem("education", { degree: "", institution: "", startYear: "", endYear: "", grade: "" })
                            }
                        >
                            <FaPlus /> Add Education
                        </button>
                    </>
                ) : (
                    <div className="space-y-4">
                        {user.education?.map((edu, idx) => (
                            <div key={idx} className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-lg">{edu.degree}</p>
                                        <p className="text-blue-600 text-sm">{edu.institution}</p>
                                    </div>
                                    <div className="text-sm text-gray-500 text-right">
                                        <p>{edu.startYear} - {edu.endYear}</p>
                                        {edu.grade && <p className="text-xs">Grade: {edu.grade}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                {editMode ? (
                     <input
                        type="text"
                        value={skillsInput}
                        onChange={handleSkillsChange}
                        placeholder="Comma-separated skills (e.g., React, Node.js, JavaScript)"
                        className="border p-2 rounded w-full"
                    />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {user.skills?.map((skill, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-300 px-3 py-1 rounded-full text-sm font-medium text-gray-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Languages */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Languages</h2>
                {editMode ? (
                    <>
                        {formData.languages?.map((lang, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Language Name"
                                    value={lang.name || ""}
                                    onChange={(e) =>
                                        handleArrayChange("languages", idx, "name", e.target.value)
                                    }
                                    className="border p-2 rounded w-1/2"
                                />
                                <input
                                    type="text"
                                    placeholder="Proficiency (e.g., Fluent, Conversational)"
                                    value={lang.proficiency || ""}
                                    onChange={(e) =>
                                        handleArrayChange("languages", idx, "proficiency", e.target.value)
                                    }
                                    className="border p-2 rounded w-1/2"
                                />
                                <button
                                    className="bg-red-500 text-white p-2 rounded"
                                    onClick={() => removeArrayItem("languages", idx)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
                            onClick={() =>
                                addArrayItem("languages", { name: "", proficiency: "" })
                            }
                        >
                            <FaPlus /> Add Language
                        </button>
                    </>
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {user.languages?.map((lang, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                                <span>{lang.name}</span>
                                {lang.proficiency && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-700">
                                        {lang.proficiency}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Certifications (NEW SECTION) */}
            <div className="bg-Teal rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaAward className="text-xl" /> Certifications
                </h2>
                {editMode ? (
                    <>
                        {formData.certifications?.map((cert, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Certification Name"
                                    value={cert.name || ""}
                                    onChange={(e) =>
                                        handleArrayChange("certifications", idx, "name", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                />
                                <button
                                    className="bg-red-500 text-white p-2 rounded"
                                    onClick={() => removeArrayItem("certifications", idx)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2"
                            onClick={() =>
                                addArrayItem("certifications", { name: "" })
                            }
                        >
                            <FaPlus /> Add Certification
                        </button>
                    </>
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {user.certifications?.map((cert, idx) => (
                            <li key={idx}>{cert.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        </div>
    );
};

export default ViewProfile;