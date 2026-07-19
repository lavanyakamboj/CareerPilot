import api from "../api/api";

/**
 * Resume + company/job details ke basis par personalized cover letter
 * generate karta hai (agar pehle se bana hua hai to update ho jata hai).
 */
export const generateCoverLetter = async (resumeId, details) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(
    `/cover-letters/${resumeId}/generate`,
    details,
  );

  return response.data;
};

/**
 * Ek resume ka saved cover letter fetch karta hai.
 */
export const getCoverLetter = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.get(`/cover-letters/${resumeId}`);

  return response.data;
};

/**
 * Ek resume ka cover letter delete karta hai.
 */
export const deleteCoverLetter = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.delete(`/cover-letters/${resumeId}`);

  return response.data;
};
