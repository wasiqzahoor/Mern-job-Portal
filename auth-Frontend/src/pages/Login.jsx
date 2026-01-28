import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // (Check path matches your folder structure)
// ✅ Import custom axios
import axios from "../api/axios"; 

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // ✅ Fix: Using axios instance instead of fetch with hardcoded localhost
            const res = await axios.post("/auth/login", { email, password });
            
            // Axios response data is in res.data
            const data = res.data;

            if (data.token) {
                const payload = JSON.parse(atob(data.token.split(".")[1]));
                const userRole = payload.user?.role; 

                if (!userRole) {
                    setError("Token is invalid or missing role. Please try again.");
                    setLoading(false);
                    return;
                }
               
                if (userRole === "company") {
                    if (data.user.status === 'pending') {
                        setError('Your account is still pending approval by an administrator.');
                        setLoading(false);
                        return; 
                    }
                    if (data.user.status === 'rejected') {
                        setError('Your account has been rejected. Please contact support.');
                        setLoading(false);
                        return; 
                    }
                }
                
                login(data.token, userRole, data.user);

                if (userRole === "admin") {
                    navigate("/admin");
                } else if (userRole === "company") {
                    navigate("/company");
                } else {
                    navigate("/user");
                }
                
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            // ✅ Handle Axios errors
            const msg = err.response?.data?.message || "Something went wrong with the login process.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-DarkGray">
            <div className="bg-LightGray p-8 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="/images/logo.png"
                        alt="Jobshop Logo"
                        className="w-10 h-10 mb-2"
                    />
                    <h1 className="text-xl font-bold text-gray-800">JOBSHOP</h1>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-center mb-6">
                    Enter your credentials to access your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <a
                        href="/forgot-password"
                        className="text-blue-500 hover:underline"
                    >
                        Forgot your password?
                    </a>
                </div>
                <p className="mt-3 text-center text-medium text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/Signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
