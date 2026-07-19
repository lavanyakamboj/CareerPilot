import React from "react";
import { FiFileText } from "react-icons/fi";

import "../../styles/dashboard/feature.css";

/**
 * Analysis, Roadmap, Jobs, Resources, Interview aur Cover Letter — in
 * sabhi pages ko pata hona chahiye ki kis resume ke liye kaam karna hai.
 * Ye component wahi "active resume" chunne ka UI deta hai.
 */
const ResumeSelector = ({
  resumes,
  selectedResumeId,
  onChange,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="feature-loading__block" style={{ minHeight: 76 }} />;
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="feature-empty-state">
        <span className="feature-empty-state__icon">
          <FiFileText />
        </span>

        <h3>No resume uploaded yet</h3>

        <p>
          Upload a resume from the "My Resumes" section first — every
          feature here works on top of your uploaded resume.
        </p>
      </div>
    );
  }

  const selectedResume = resumes.find(
    (resume) => resume._id === selectedResumeId,
  );

  return (
    <div className="resume-selector">
      <div className="resume-selector__label">
        <span>Working on resume</span>

        <select
          value={selectedResumeId || ""}
          onChange={(event) => onChange(event.target.value)}
        >
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>
              {resume.originalName}
            </option>
          ))}
        </select>
      </div>

      {selectedResume?.extractedText === "" && (
        <span className="resume-selector__meta">
          ⚠ Text not extracted from this resume yet — some features may
          need that first.
        </span>
      )}
    </div>
  );
};

export default ResumeSelector;
