import { useEffect, useState } from "react";

import { getResumes } from "../services/resumeApi";

const SELECTED_RESUME_KEY = "selectedResumeId";

/**
 * Dashboard ke feature pages (Analysis, Roadmap, Jobs, Resources,
 * Interview, Cover Letter) sab ko "kis resume par kaam karna hai" pata
 * hona chahiye. Ye hook resumes list load karta hai aur selected resume
 * ko localStorage me persist karta hai taaki page refresh/switch par
 * selection na bhoole.
 */
const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeIdState] = useState(
    () => localStorage.getItem(SELECTED_RESUME_KEY) || "",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const setSelectedResumeId = (resumeId) => {
    setSelectedResumeIdState(resumeId);

    if (resumeId) {
      localStorage.setItem(SELECTED_RESUME_KEY, resumeId);
    } else {
      localStorage.removeItem(SELECTED_RESUME_KEY);
    }
  };

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getResumes();
      const fetchedResumes = data?.resumes || [];

      setResumes(fetchedResumes);

      // Agar pehle se koi valid selection nahi hai, to sabse latest
      // resume ko default select kar dete hain.
      const stillValid = fetchedResumes.some(
        (resume) => resume._id === selectedResumeId,
      );

      if (!stillValid && fetchedResumes.length > 0) {
        setSelectedResumeId(fetchedResumes[0]._id);
      } else if (fetchedResumes.length === 0) {
        setSelectedResumeId("");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load your resumes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedResume =
    resumes.find((resume) => resume._id === selectedResumeId) || null;

  return {
    resumes,
    selectedResumeId,
    selectedResume,
    setSelectedResumeId,
    isLoading,
    error,
    refetch: loadResumes,
  };
};

export default useResumes;
