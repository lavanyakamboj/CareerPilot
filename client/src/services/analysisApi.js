import api from "../api/api";

/**
 * Resume ko AI se analyze karta hai (score, strengths, weaknesses, etc.)
 * Resume ka text pehle se extract hona chahiye.
 */
export const analyzeResume = async (resumeId) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(`/analysis/resume/${resumeId}`);

  return response.data;
};

/**
 * Logged-in user ke saare past analyses (history).
 */
export const getAllAnalyses = async () => {
  const response = await api.get("/analysis");

  return response.data;
};

/**
 * Ek specific analysis ki poori detail.
 */
export const getSingleAnalysis = async (analysisId) => {
  if (!analysisId) {
    throw new Error("Analysis ID is required.");
  }

  const response = await api.get(`/analysis/${analysisId}`);

  return response.data;
};

/**
 * Score tracker — pehle analysis se latest tak improvement/decline.
 */
export const getScoreTracker = async () => {
  const response = await api.get("/analysis/tracker/score");

  return response.data;
};

/**
 * Latest do analyses ka comparison.
 */
export const compareResumeVersions = async () => {
  const response = await api.get("/analysis/compare");

  return response.data;
};

/**
 * Ek analysis delete karta hai.
 */
export const deleteAnalysis = async (analysisId) => {
  if (!analysisId) {
    throw new Error("Analysis ID is required.");
  }

  const response = await api.delete(`/analysis/${analysisId}`);

  return response.data;
};

/**
 * Resume ko ek job description ke against match karta hai.
 */
export const matchResumeWithJd = async (resumeId, jobDescription) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(`/analysis/jd-match/${resumeId}`, {
    jobDescription,
  });

  return response.data;
};
