import React, { useEffect, useState } from "react";
import { FiCopy, FiTarget, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import ResumeSelector from "../components/dashboard/ResumeSelector";
import useResumes from "../hooks/useResumes";
import {
  deleteCoverLetter,
  generateCoverLetter,
  getCoverLetter,
} from "../services/coverLetterApi";

import "../styles/dashboard/feature.css";

const CoverLetter = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading: isLoadingResumes,
  } = useResumes();

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
  });
  const [coverLetter, setCoverLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadCoverLetter = async (resumeId) => {
    if (!resumeId) {
      setCoverLetter(null);
      return;
    }

    try {
      setIsLoading(true);

      const data = await getCoverLetter(resumeId);

      setCoverLetter(data.coverLetter);

      setForm({
        companyName: data.coverLetter.companyName,
        jobTitle: data.coverLetter.jobTitle,
        jobDescription: data.coverLetter.jobDescription,
      });
    } catch (error) {
      setCoverLetter(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoverLetter(selectedResumeId);
    setForm({ companyName: "", jobTitle: "", jobDescription: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResumeId]);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!selectedResumeId) return;

    try {
      setIsGenerating(true);

      const data = await generateCoverLetter(selectedResumeId, form);

      setCoverLetter(data.coverLetter);

      toast.success("Cover letter generated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Cover letter generation failed",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedResumeId || !window.confirm("Delete this cover letter?")) {
      return;
    }

    try {
      await deleteCoverLetter(selectedResumeId);

      setCoverLetter(null);

      toast.success("Cover letter deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete cover letter",
      );
    }
  };

  const handleCopy = () => {
    if (!coverLetter?.coverLetter) return;

    navigator.clipboard.writeText(coverLetter.coverLetter);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="feature-page">

      <ResumeSelector
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        onChange={setSelectedResumeId}
        isLoading={isLoadingResumes}
      />

      {selectedResumeId && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>Job details</h3>
              <p>These details personalize your cover letter.</p>
            </div>
          </div>

          <form className="feature-form" onSubmit={handleGenerate}>
            <div className="feature-form__row">
              <div className="feature-form__group">
                <label htmlFor="cl-company">Company name</label>
                <input
                  id="cl-company"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange("companyName")}
                  required
                />
              </div>

              <div className="feature-form__group">
                <label htmlFor="cl-title">Job title</label>
                <input
                  id="cl-title"
                  type="text"
                  value={form.jobTitle}
                  onChange={handleChange("jobTitle")}
                  required
                />
              </div>
            </div>

            <div className="feature-form__group">
              <label htmlFor="cl-jd">Job description</label>
              <textarea
                id="cl-jd"
                value={form.jobDescription}
                onChange={handleChange("jobDescription")}
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isGenerating}
              >
                <FiTarget />
                {isGenerating
                  ? "Generating..."
                  : coverLetter
                    ? "Regenerate cover letter"
                    : "Generate cover letter"}
              </button>

              {coverLetter && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  <FiTrash2 />
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {selectedResumeId && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>Generated cover letter</h3>
            </div>

            {coverLetter && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCopy}
              >
                <FiCopy />
                Copy
              </button>
            )}
          </div>

          {isLoading && (
            <div
              className="feature-loading__block"
              style={{ minHeight: 180 }}
            />
          )}

          {!isLoading && !coverLetter && (
            <div className="feature-empty-state">
              <span className="feature-empty-state__icon">
                <FiTarget />
              </span>
              <h3>No cover letter yet</h3>
              <p>Fill in the job details above and generate one.</p>
            </div>
          )}

          {!isLoading && coverLetter && (
            <div className="cover-letter-output">
              {coverLetter.coverLetter}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverLetter;
