// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  // ✅ IMPORTANT: This is your backend API base URL
  baseURL: 'http://localhost:4002/api',
  withCredentials: true, // Set to true if your backend handles cookies/sessions for credentials
});

// ✅ Add an interceptor to automatically include the JWT token
instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever you store it after login)
    const token = localStorage.getItem('token'); 

    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;