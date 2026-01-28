import axios from 'axios';

// ✅ Vite mein hum 'import.meta.env' use karte hain.
// Localhost fallback bhi laga diya hai taake local development mein error na aye.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4002';

const instance = axios.create({
  // Base URL ke agay '/api' hum code mein hi laga rahe hain
  baseURL: `${BASE_URL}/api`, 
  withCredentials: true, 
});

// ✅ Token Interceptor (Same as before)
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
