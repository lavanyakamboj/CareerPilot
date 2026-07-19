import api from "../api/api";

/**
 * Resume ke liye personalized career roadmap generate karta hai
 * (existing roadmap ho to update kar deta hai).
 */
export const generateRoadmap = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(`/roadmap/generate/${resumeId}`);

  return response.data;
};

/**
 * Logged-in user ke saare roadmaps (har resume ke liye ek).
 */
export const getRoadmaps = async () => {
  const response = await api.get("/roadmap");

  return response.data;
};

/**
 * Ek specific resume ka roadmap.
 */
export const getRoadmapByResume = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.get(`/roadmap/${resumeId}`);

  return response.data;
};
