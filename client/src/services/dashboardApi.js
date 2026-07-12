import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const dashboardClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

dashboardClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getDashboardSummary = async (resumeId) => {
  if (!resumeId) {
    return null;
  }

  const response = await dashboardClient.post("/api/dashboard", {
    resumeId,
  });

  return response.data;
};