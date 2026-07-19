import api from "../api/api";

/**
 * Resume ki analysis + roadmap ke basis par personalized learning
 * resources (courses, YouTube, docs, books, practice, sites, plan)
 * generate karta hai. Analysis aur roadmap pehle se bane hone chahiye.
 */
export const generateResources = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(`/resources/generate/${resumeId}`);

  return response.data;
};

/**
 * Ek resume ke saved learning resources fetch karta hai.
 */
export const getResources = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.get(`/resources/${resumeId}`);

  return response.data;
};
