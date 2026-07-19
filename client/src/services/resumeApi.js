import api from "../api/api";

/**
 * Upload a new resume.
 * File ko FormData ke through backend par bhejta hai.
 */
export const uploadResume = async (resumeFile) => {
  if (!resumeFile) {
    throw new Error(
      "Please select a resume file.",
    );
  }

  const formData = new FormData();

  // Backend Multer field name "resume" hona chahiye.
  formData.append("resume", resumeFile);

  const response = await api.post(
    "/resumes/upload",
    formData,
  );

  return response.data;
};

/**
 * Logged-in user ke saare uploaded resumes.
 */
export const getResumes = async () => {
  const response = await api.get("/resumes");

  return response.data;
};

/**
 * Ek specific resume ki details.
 */
export const getResumeById = async (
  resumeId,
) => {
  if (!resumeId) {
    throw new Error(
      "Resume ID is required.",
    );
  }

  const response = await api.get(
    `/resumes/${resumeId}`,
  );

  return response.data;
};

/**
 * Uploaded resume delete karta hai.
 */
export const deleteResume = async (
  resumeId,
) => {
  if (!resumeId) {
    throw new Error(
      "Resume ID is required.",
    );
  }

  const response = await api.delete(
    `/resumes/${resumeId}`,
  );

  return response.data;
};

/**
 * Resume ka extracted text fetch karta hai.
 */
export const getResumeExtractedText = async (
  resumeId,
) => {
  if (!resumeId) {
    throw new Error(
      "Resume ID is required.",
    );
  }

  const response = await api.get(
    `/resumes/${resumeId}/extract-text`,
  );

  return response.data;
};

/**
 * Resume download karta hai.
 */
export const downloadResume = async (
  resumeId,
  fallbackFileName = "resume.pdf",
) => {
  if (!resumeId) {
    throw new Error(
      "Resume ID is required.",
    );
  }

  const response = await api.get(
    `/resumes/${resumeId}/download`,
    {
      responseType: "blob",
    },
  );

  const fileUrl = window.URL.createObjectURL(
    new Blob([response.data]),
  );

  const downloadLink =
    document.createElement("a");

  downloadLink.href = fileUrl;

  const contentDisposition =
    response.headers["content-disposition"];

  const fileNameMatch =
    contentDisposition?.match(
      /filename="?([^"]+)"?/,
    );

  downloadLink.download =
    fileNameMatch?.[1] ||
    fallbackFileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  window.URL.revokeObjectURL(fileUrl);
};