// ResetPassword.jsx
import React, { useState } from 'react'; 
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const role = queryParams.get('role');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true); 

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false); 
      return;
    }
    
    if (!token || !role) {
      setError("Invalid reset link. Token or role is missing.");
      setLoading(false); 
      return;
    }

    try {
      const res = await fetch(`http://localhost:4002/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password updated successfully!");
        setTimeout(() => {
            navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-DarkGray px-4">
      <div className="w-full max-w-md bg-LightGray p-8 rounded-xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
                    <img
                        src="/images/logo.png"
                        alt="Jobshop Logo"
                        className="w-10 h-10 mb-2"
                    />
                    <h1 className="text-xl font-bold text-gray-800">JOBSHOP</h1>
                </div>
            <h2 className="text-2xl font-bold text-gray-800">Set a New Password</h2>
            <p className="text-gray-500 mt-2">Your new password must be different from previous passwords.</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            </div>
          </div>
          
          {/* Confirm New Password Field */}
          <div>
            <label htmlFor="confirmPassword"  className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
             <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
            </div>
          </div>

          {/* Success and Error Messages */}
          {message && (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-lg">
                <FiCheckCircle />
                <span>{message}</span>
            </div>
          )}
          {error && (
             <div className="flex items-center gap-2 text-red-700 bg-red-100 p-3 rounded-lg">
                <FiAlertTriangle />
                <span>{error}</span>
            </div>
          )}

          {/* Submit Button with Loading State */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center disabled:bg-purple-400"
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                </>
            ) : (
                'Update Password'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-purple-600 hover:underline">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;