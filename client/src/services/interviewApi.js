import api from "../api/api";

// Note: backend par koi alag "interview" route file nahi hai — ye endpoint
// analysisRoutes ke andar "/api/analysis/interview/:resumeId" par mila hai.
// Resume analyze ho chuka hona chahiye, tabhi interview questions ban sakte hain.
// Backend me sirf POST (generate/update) endpoint hai, saved questions fetch
// karne ke liye alag GET route maujood nahi — isliye latest generated
// response hi state me store karke dikhaya jata hai.

/**
 * Resume (aur optional job description) ke basis par AI interview
 * questions generate karta hai — technical, project aur behavioral.
 */
export const generateInterviewQuestions = async (
  resumeId,
  jobDescription = "",
) => {
  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.post(`/analysis/interview/${resumeId}`, {
    jobDescription,
  });

  return response.data;
};
