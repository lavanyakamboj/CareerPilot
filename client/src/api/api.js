import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Har protected API request ke saath JWT token automatically attach hoga.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careerPilotToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Invalid ya expired token handle karne ke liye.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("careerPilotToken");
      localStorage.removeItem("careerPilotUser");
    }

    return Promise.reject(error);
  }
);

export default api;