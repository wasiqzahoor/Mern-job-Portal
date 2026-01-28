import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ✅ Import custom axios instance (Make sure path is correct)
import axios from "../api/axios"; 

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "user", 
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            alert("Please agree to the Terms of Service and Privacy Policy");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            // ✅ Fix: Localhost hata diya, sirf endpoint lagaya.
            // Base URL ab axios.js se aayega.
            let endpoint = "";
            if (formData.role === "user") {
                endpoint = "/auth/register-user";
            } else if (formData.role === "company") {
                endpoint = "/auth/register-company";
            } else if (formData.role === "admin") { 
                endpoint = "/auth/register-admin"; 
            } else {
                alert("Invalid role selected");
                return;
            }

            const requestBody = {
                email: formData.email,
                password: formData.password,
            };

            // Add role-specific data to the request body
            if (formData.role === "user") {
                requestBody.firstName = formData.firstName;
                requestBody.lastName = formData.lastName;
                requestBody.phone = formData.phone;
            } else if (formData.role === "company") {
                requestBody.companyName = formData.firstName + ' ' + formData.lastName;
            } else if (formData.role === "admin") { 
                requestBody.firstName = formData.firstName;
                requestBody.lastName = formData.lastName;
            }

            // ✅ Replace fetch with axios.post
            const res = await axios.post(endpoint, requestBody);

            // Axios automatically throws error for non-2xx status, so we don't need 'if (!res.ok)'
            alert("Signup successful! Please login.");
            
            if (formData.role === "company") {
                navigate("/pending-approval");
            } else {
                navigate("/login");
            }
        
        } catch (err) {
            console.error("Signup Error:", err);
            // ✅ Error handling for Axios
            const errorMessage = err.response?.data?.message || "Something went wrong";
            alert(errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-DarkGray">
            <div className="bg-LightGray p-6 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex items-center mb-4 justify-center">
                    <img src="/images/logo.png" alt="Jobshop Logo" className="w-8 h-8 mb-2 gap-3" />
                    <h1 className="text-xl font-bold text-gray-800">JOBSHOP</h1>
                </div>

                <h2 className="text-xl font-bold text-center mb-1">Create Account</h2>
                <p className="text-gray-500 text-center mb-4 text-sm">
                    Fill in your information to get started
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            className="flex-2 px-2 py-2 border rounded-lg w-1/2"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            className="flex-1 px-2 py-2 border rounded-lg w-1/2 "
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="user">User</option>
                        <option value="company">Company</option>
                    </select>

                    <label className="flex items-center space-x-2 text-xs">
                        <input
                            type="checkbox"
                            name="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                        />
                        <span>
                            I agree to the{" "}
                            <a href="#" className="text-blue-500">Terms of Service</a> and{" "}
                            <a href="#" className="text-blue-500">Privacy Policy</a>
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-3 text-center text-xs text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
