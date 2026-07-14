import api from "../api/api";

// GET /api/dashboard/summary — protected route, JWT se user ka poora
// dashboard summary (resume, roadmap, jobs, activities, etc.) fetch karta hai.
// Shared `api` instance use karte hain taaki token attach/401 handling
// duplicate na ho.
export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");

  return response.data;
};
