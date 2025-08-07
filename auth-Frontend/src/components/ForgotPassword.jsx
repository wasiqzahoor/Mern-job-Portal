// ForgotPassword.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
function ForgotPassword() {
  const [email, setEmail] = useState('');
 
  const [role, setRole] = useState('user'); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      
      const response = await fetch("http://localhost:4002/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Reset link sent successfully!");
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-DarkGray px-4">
      <div className="w-full max-w-md bg-LightGray p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-6">
                    <img
                        src="/images/logo.png"
                        alt="Jobshop Logo"
                        className="w-10 h-10 mb-2"
                    />
                    <h1 className="text-xl font-bold text-gray-800">JOBSHOP</h1>
                </div>
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Select your role and enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-1">
              I am a...
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="user">User</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
          >
            Send Reset Link
          </button>
          {/* Back to Login Link */}
        <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-purple-600 hover:underline">
                Back to Login
            </Link>
        </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;