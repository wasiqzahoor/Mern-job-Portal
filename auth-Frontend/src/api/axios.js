// src/api/axios.js
import axios from 'axios';

// Yahan hum check kar rahe hain ke environment variable mojood hai ya nahi.
// Agar Vercel pe hoga to 'process.env.REACT_APP_BACKEND_URL' use karega.
// Agar local chala rahe ho to 'http://localhost:4002' use karega.
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4002';

const instance = axios.create({
  // Hum Base URL ke agay '/api' khud laga rahe hain.
  // Iska faida ye hai ke Environment variable mein sirf domain dena parega.
  baseURL: `${BASE_URL}/api`, 
  withCredentials: true, 
});

// Interceptor to automatically include the JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
