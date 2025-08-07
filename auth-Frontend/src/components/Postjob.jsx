// Postjob.jsx

import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import DashboardNavbar from "./DashboardNavbar";
import { AuthContext } from "../AuthContext";
import { useParams, useNavigate } from "react-router-dom"; 
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import Footer from "../pages/company/Footer";


const Postjob = ({ isEditMode }) => {
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const { token } = useContext(AuthContext);
    
    const { id } = useParams(); 
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    
    useEffect(() => {
        if (isEditMode && id) {
            setSubmissionStatus('submitting'); 
            fetch(`http://localhost:4002/api/jobs/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        reset(data.job);
                        const skillsToSet = data.job.skills.map(skill => ({ value: skill, label: skill }));
                        setSelectedOptions(skillsToSet);
                        setSubmissionStatus('idle'); 
                    } else {
                        throw new Error(data.message);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch job data for editing:", err);
                    setSubmissionStatus('error');
                });
        }
    }, [id, isEditMode, reset]);

    const onSubmit = (data) => {
        setSubmissionStatus('submitting');
        data.skills = selectedOptions?.map(option => option.value) || [];
        
        const url = isEditMode 
            ? `http://localhost:4002/api/jobs/update-job/${id}` 
            : "http://localhost:4002/api/jobs/post-job";
        
        const method = isEditMode ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
                setSubmissionStatus('success');
                
                setTimeout(() => {
                    navigate('/company-jobs'); 
                }, 2000); 
                if (!isEditMode) {
                    reset();
                    setSelectedOptions(null);
                }
            } else {
                console.error(`Failed to ${isEditMode ? 'update' : 'post'} job:`, result.message);
                setSubmissionStatus('error');
                // Nakami par 3 seconds ke baad button ko reset karein
                setTimeout(() => setSubmissionStatus('idle'), 3000);
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            setSubmissionStatus('error');
        })
        .finally(() => {
            setTimeout(() => {
                setSubmissionStatus('idle');
                if (isEditMode && submissionStatus === 'success') {
                    navigate(`/company/jobs/${id}`); 
                }
            }, 2000);
        });
    };
    
    const options = [
        { value: "C", label: "C" }, { value: "C++", label: "C++" }, { value: "Java", label: "Java" },
        { value: "Python", label: "Python" }, { value: "JavaScript", label: "JavaScript" },
        { value: "React", label: "React" }, { value: "Node.js", label: "Node.js" },
        { value: "MongoDB", label: "MongoDB" }, { value: "SQL", label: "SQL" },
        { value: "CSS", label: "CSS" }, { value: "HTML", label: "HTML" },
    ];

    
    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#f9fafb', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem', 
            padding: '0.25rem',
            boxShadow: 'none',
            '&:hover': { borderColor: '#a5b4fc' }, 
        }),
        input: (provided) => ({
            ...provided,
            color: '#111827', // text-gray-900
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0e7ff', // bg-indigo-100
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#3730a3', // text-indigo-800
        }),
    };

    const renderSubmitButton = () => {
        const buttonText = isEditMode ? "Update" : "Post";
        switch (submissionStatus) {
            case 'submitting':
                return (
                    <button type="submit" disabled className="flex items-center gap-2 bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg cursor-wait">
                        <FaSpinner className="animate-spin" /> {isEditMode ? 'Updating...' : 'Posting...'}
                    </button>
                );
            case 'success':
                return (
                    <button type="submit" disabled className="flex items-center gap-2 bg-green-500 text-white font-semibold px-8 py-3 rounded-lg">
                        <FaCheck /> {isEditMode ? 'Updated!' : 'Posted!'}
                    </button>
                );
            case 'error':
                return (
                    <button type="submit" className="flex items-center gap-2 bg-red-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-600">
                        <FaTimes /> Failed! Try Again
                    </button>
                );
            default:
                return (
                    <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg">
                        <FaCheck /> {buttonText} Job
                    </button>
                );
        }
    };

    return (
         <>
        <div className="bg-DarkGray min-h-screen">
            <DashboardNavbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <div className="bg-LightGray p-8 rounded-xl shadow-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? "Edit Your Job" : "Post a New Job"}</h1>
                        <p className="text-gray-500 mt-1">{isEditMode ? "Update the details below." : "Fill out the details to find your next hire."}</p>
                    </div>      

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* --- Core Details Card --- */}
                        <div className="p-6 bg-Teal rounded-lg border">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Core Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Job Title */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Job Title</label>
                                    <div className="relative">
                                        <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="e.g., Software Engineer" {...register("jobTitle")} className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                                {/* Job Location */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Job Location</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="e.g., New York" {...register("jobLocation")} className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Salary & Type Card --- */}
                        <div className="p-6 bg-Teal rounded-lg border">
                             <h2 className="text-lg font-semibold text-gray-700 mb-4">Salary & Job Type</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Min & Max Salary */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Salary Range</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-1/2">
                                            <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" placeholder="Min: 20k" {...register("minPrice" )} className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div className="relative w-1/2">
                                            <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" placeholder="Max: 100k" {...register("maxPrice" )} className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                                {/* Salary Type */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Salary Type</label>
                                    <select {...register("salaryType" )} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Choose...</option>
                                        <option value="Hourly">Hourly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                                {/* Employment Type */}
                                 <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Employment Type</label>
                                    <select {...register("employmentType")} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Choose...</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Temporary">Temporary</option>
                                    </select>
                                </div>
                                {/* Experience Level */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Experience Level</label>
                                    <select {...register("experienceLevel")} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Choose...</option>
                                        <option value="Any experience">Any</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Work remotely">Remote</option>
                                         <option value="1-3 years">1-3 Years</option>
                                        <option value="3-5 years">3-5 Years</option>
                                         <option value="5+ years">5+ Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- Skills & Description Card --- */}
                        <div className="p-6 bg-Teal rounded-lg border">
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">Required Skills</label>
                                    <CreatableSelect value={selectedOptions} onChange={setSelectedOptions} options={options} isMulti styles={customSelectStyles} />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">Job Description</label>
                                    <textarea {...register("description")} rows={6} placeholder="Provide a detailed job description..." className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            {renderSubmitButton()}
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
       </>
    );
};

export default Postjob;