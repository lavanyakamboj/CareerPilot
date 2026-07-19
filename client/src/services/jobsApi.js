import api from "../api/api";

// Note: backend par job routes "/api/ai/jobs" par mount hain (dashboardRoutes
// jaisa "/api/jobs" nahi), isliye path yahan alag hai.

/**
 * Resume, analysis aur roadmap ke basis par AI job recommendations
 * generate karta hai. Agar pehle se maujood hain to wahi return ho jayenge.
 */
export const generateJobRecommendations = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post("/ai/jobs", { resumeId });

  return response.data;
};

/**
 * Ek resume ke saare job recommendations.
 */
export const getJobRecommendations = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.get(`/ai/jobs/${resumeId}`);

  return response.data;
};

/**
 * Ek specific job recommendation record.
 */
export const getJobRecommendationById = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }

  const response = await api.get(`/ai/jobs/one/${jobId}`);

  return response.data;
};

/**
 * Ek job recommendation record delete karta hai.
 */
export const deleteJobRecommendation = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }

  const response = await api.delete(`/ai/jobs/${jobId}`);

  return response.data;
};
