import React, { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiTarget,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import toast from "react-hot-toast";

import useResumes from "../hooks/useResumes";
import {
  deleteResume,
  downloadResume,
  getResumeExtractedText,
  uploadResume,
} from "../services/resumeApi";
import {
  analyzeResume,
  deleteAnalysis,
  getAllAnalyses,
  matchResumeWithJd,
} from "../services/analysisApi";

import "../styles/dashboard/feature.css";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) return `${kb.toFixed(0)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TagGroup = ({ label, items = [], variant = "neutral" }) => (
  <div>
    <p className="insight-label">{label}</p>
    <div className="tag-list">
      {items.map((item) => (
        <span key={item} className={`tag-chip tag-chip--${variant}`}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

const Resumes = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading,
    error,
    refetch,
  } = useResumes();

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [busyResumeId, setBusyResumeId] = useState("");

  // Resume upload aur uska AI analysis — dono ab isi ek page par hote
  // hain, alag "Analysis" page par navigate karne ki zaroorat nahi.
  const [analyses, setAnalyses] = useState([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [jobDescription, setJobDescription] = useState("");
  const [jdResult, setJdResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  const loadAnalyses = async () => {
    try {
      setIsLoadingAnalyses(true);

      const data = await getAllAnalyses();

      setAnalyses(data.analyses || []);
    } catch {
      // Analysis history load na ho paaye to bhi resume upload/list
      // kaam karta rahe — is error ko silently ignore karte hain.
    } finally {
      setIsLoadingAnalyses(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  const selectedResume = resumes.find(
    (resume) => resume._id === selectedResumeId,
  );

  const latestAnalysisForSelected = analyses.find(
    (analysis) => analysis.resume?._id === selectedResumeId,
  );

  const runAnalysis = async (resumeId, { silent = false } = {}) => {
    if (!resumeId) return;

    try {
      setIsAnalyzing(true);

      await analyzeResume(resumeId);

      if (!silent) toast.success("Resume analyzed successfully");

      await loadAnalyses();
    } catch (analyzeError) {
      toast.error(
        analyzeError.response?.data?.message || "Resume analysis failed",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume.");
      return;
    }

    try {
      setIsUploading(true);

      const data = await uploadResume(file);

      toast.success("Resume uploaded successfully");

      await refetch();

      const uploadedResumeId = data?.resume?._id;

      if (!uploadedResumeId) return;

      setSelectedResumeId(uploadedResumeId);

      // Backend upload ke saath hi PDF text auto-extract kar deta hai,
      // isliye yahan seedha analysis chala sakte hain — user ko kuch
      // alag se click nahi karna padta.
      if (data.resume.extractedText) {
        toast.loading("Analyzing your resume...", { id: "auto-analyze" });
        await runAnalysis(uploadedResumeId, { silent: true });
        toast.dismiss("auto-analyze");
        toast.success("Analysis ready below");
      } else {
        toast.error(
          "Couldn't read text from this PDF automatically. Try the extract button below.",
        );
      }
    } catch (uploadError) {
      toast.error(
        uploadError.response?.data?.message || "Resume upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event) => {
    handleUpload(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleUpload(event.dataTransfer.files?.[0]);
  };

  const handleExtractText = async (resumeId) => {
    try {
      setBusyResumeId(resumeId);
      await getResumeExtractedText(resumeId);
      toast.success("Resume text extracted successfully");
      await refetch();
    } catch (extractError) {
      toast.error(
        extractError.response?.data?.message ||
          "Failed to extract resume text",
      );
    } finally {
      setBusyResumeId("");
    }
  };

  const handleDownload = async (resumeId, fileName) => {
    try {
      setBusyResumeId(resumeId);
      await downloadResume(resumeId, fileName);
    } catch (downloadError) {
      toast.error(
        downloadError.response?.data?.message || "Failed to download resume",
      );
    } finally {
      setBusyResumeId("");
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;

    try {
      setBusyResumeId(resumeId);
      await deleteResume(resumeId);
      toast.success("Resume deleted");
      await refetch();
      await loadAnalyses();
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message || "Failed to delete resume",
      );
    } finally {
      setBusyResumeId("");
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm("Delete this analysis?")) return;

    try {
      await deleteAnalysis(analysisId);
      toast.success("Analysis deleted");
      await loadAnalyses();
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message || "Failed to delete analysis",
      );
    }
  };

  const handleJdMatch = async (event) => {
    event.preventDefault();

    if (!selectedResumeId || !jobDescription.trim()) return;

    try {
      setIsMatching(true);
      setJdResult(null);

      const data = await matchResumeWithJd(selectedResumeId, jobDescription);

      setJdResult(data.result);
    } catch (matchError) {
      toast.error(
        matchError.response?.data?.message || "JD match analysis failed",
      );
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="feature-page">

      <div className="feature-panel">
        <div className="feature-panel__header">
          <div>
            <h3>Upload a new resume</h3>
            <p>
              PDF files only. Text extraction and AI analysis run
              automatically after upload.
            </p>
          </div>
        </div>

        <label
          className={`resume-upload ${
            isDragging ? "resume-upload--active" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />

          <span className="resume-upload__icon">
            <FiUploadCloud />
          </span>

          <strong>
            {isUploading ? "Uploading..." : "Click or drag a PDF here"}
          </strong>

          <span>Max recommended size: 5 MB</span>
        </label>
      </div>

      <div className="feature-panel">
        <div className="feature-panel__header">
          <div>
            <h3>Uploaded resumes</h3>
            <p>Select one as active — it will be used across the dashboard.</p>
          </div>
        </div>

        {isLoading && (
          <div className="feature-loading">
            <div className="feature-loading__block feature-loading__block--sm" />
            <div className="feature-loading__block feature-loading__block--sm" />
          </div>
        )}

        {!isLoading && error && <div className="feature-error">{error}</div>}

        {!isLoading && !error && resumes.length === 0 && (
          <div className="feature-empty-state">
            <span className="feature-empty-state__icon">
              <FiFileText />
            </span>
            <h3>No resumes yet</h3>
            <p>Upload your first resume above to get started.</p>
          </div>
        )}

        {!isLoading && resumes.length > 0 && (
          <div className="resume-list">
            {resumes.map((resume) => {
              const isActive = resume._id === selectedResumeId;
              const isBusy = busyResumeId === resume._id;

              return (
                <div
                  key={resume._id}
                  className={`resume-list-item ${
                    isActive ? "resume-list-item--active" : ""
                  }`}
                >
                  <span className="resume-list-item__icon">
                    <FiFileText />
                  </span>

                  <div className="resume-list-item__content">
                    <strong>{resume.originalName}</strong>
                    <span>
                      {formatFileSize(resume.fileSize)} ·{" "}
                      {formatDate(resume.createdAt)}
                      {resume.extractedText
                        ? " · Text extracted"
                        : " · Text not extracted"}
                    </span>
                  </div>

                  <div className="resume-list-item__actions">
                    {isActive ? (
                      <span
                        className="resume-list-item__icon-btn"
                        title="Active resume"
                      >
                        <FiCheckCircle color="#7857e6" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary btn-secondary--sm"
                        onClick={() => setSelectedResumeId(resume._id)}
                      >
                        Select
                      </button>
                    )}

                    {!resume.extractedText && (
                      <button
                        type="button"
                        className="resume-list-item__icon-btn"
                        title="Extract text"
                        disabled={isBusy}
                        onClick={() => handleExtractText(resume._id)}
                      >
                        <FiFileText />
                      </button>
                    )}

                    <button
                      type="button"
                      className="resume-list-item__icon-btn"
                      title="Download"
                      disabled={isBusy}
                      onClick={() =>
                        handleDownload(resume._id, resume.originalName)
                      }
                    >
                      <FiDownload />
                    </button>

                    <button
                      type="button"
                      className="resume-list-item__icon-btn resume-list-item__icon-btn--danger"
                      title="Delete"
                      disabled={isBusy}
                      onClick={() => handleDelete(resume._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedResumeId && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>
                AI analysis — {selectedResume?.originalName || "selected resume"}
              </h3>
              <p>Score, strengths, weaknesses and improvement tips for the active resume.</p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => runAnalysis(selectedResumeId)}
              disabled={isAnalyzing || !selectedResume?.extractedText}
              title={
                !selectedResume?.extractedText
                  ? "Extract the resume text first"
                  : undefined
              }
            >
              <FiBarChart2 />
              {isAnalyzing
                ? "Analyzing..."
                : latestAnalysisForSelected
                  ? "Re-analyze"
                  : "Analyze resume"}
            </button>
          </div>

          {isLoadingAnalyses && (
            <div className="feature-loading__block" />
          )}

          {!isLoadingAnalyses && !selectedResume?.extractedText && (
            <div className="feature-empty-state">
              <span className="feature-empty-state__icon">
                <FiFileText />
              </span>
              <h3>Resume text not extracted yet</h3>
              <p>
                Click the extract icon next to this resume above, then
                analysis will run automatically.
              </p>
            </div>
          )}

          {!isLoadingAnalyses &&
            selectedResume?.extractedText &&
            !latestAnalysisForSelected &&
            !isAnalyzing && (
              <div className="feature-empty-state">
                <span className="feature-empty-state__icon">
                  <FiBarChart2 />
                </span>
                <h3>No analysis yet</h3>
                <p>Click "Analyze resume" above to get your AI resume score and feedback.</p>
              </div>
            )}

          {!isLoadingAnalyses && latestAnalysisForSelected && (
            <>
              <div className="analysis-summary">
                <div
                  className="score-circle"
                  style={{
                    "--score-value": `${
                      (latestAnalysisForSelected.score / 100) * 360
                    }deg`,
                  }}
                >
                  <div className="score-circle__inner">
                    <strong>{latestAnalysisForSelected.score}</strong>
                  </div>
                </div>

                <p className="analysis-summary__text">
                  {latestAnalysisForSelected.summary}
                </p>
              </div>

              <div className="feature-form__row">
                <TagGroup
                  label={
                    <>
                      <FiCheckCircle /> Strengths
                    </>
                  }
                  items={latestAnalysisForSelected.strengths}
                  variant="success"
                />

                <TagGroup
                  label={
                    <>
                      <FiAlertTriangle /> Weaknesses
                    </>
                  }
                  items={latestAnalysisForSelected.weaknesses}
                  variant="warning"
                />
              </div>

              <div className="feature-form__row section-spaced">
                <TagGroup
                  label="Missing skills"
                  items={latestAnalysisForSelected.missingSkills}
                  variant="danger"
                />

                <TagGroup
                  label="Suggested roles"
                  items={latestAnalysisForSelected.suggestedRoles}
                  variant="primary"
                />
              </div>

              {latestAnalysisForSelected.improvementTips?.length > 0 && (
                <div className="section-spaced">
                  <p className="insight-label">Improvement tips</p>
                  <ul className="analysis-tips">
                    {latestAnalysisForSelected.improvementTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="analysis-panel-footer">
                <button
                  type="button"
                  className="resume-list-item__icon-btn resume-list-item__icon-btn--danger"
                  title="Delete this analysis"
                  onClick={() =>
                    handleDeleteAnalysis(latestAnalysisForSelected._id)
                  }
                >
                  <FiTrash2 />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {selectedResumeId && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>Match against a job description</h3>
              <p>Paste a JD to see how well this resume fits.</p>
            </div>
          </div>

          <form className="feature-form" onSubmit={handleJdMatch}>
            <div className="feature-form__group">
              <label htmlFor="jd-textarea">Job description</label>
              <textarea
                id="jd-textarea"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isMatching}
              >
                <FiTarget />
                {isMatching ? "Matching..." : "Match resume"}
              </button>
            </div>
          </form>

          {jdResult && (
            <div className="jd-result">
              <pre>
                {typeof jdResult === "string"
                  ? jdResult
                  : JSON.stringify(jdResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {analyses.length > 1 && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>Analysis history</h3>
              <p>All past analyses across your resumes.</p>
            </div>
          </div>

          <div className="resume-list">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="resume-list-item">
                <span className="resume-list-item__icon">
                  <FiBarChart2 />
                </span>

                <div className="resume-list-item__content">
                  <strong>{analysis.resume?.originalName || "Resume"}</strong>
                  <span>
                    Score {analysis.score}/100 · {formatDate(analysis.createdAt)}
                  </span>
                </div>

                <div className="resume-list-item__actions">
                  {analysis.resume?._id !== selectedResumeId && (
                    <button
                      type="button"
                      className="btn-secondary btn-secondary--sm"
                      onClick={() => setSelectedResumeId(analysis.resume._id)}
                    >
                      View
                    </button>
                  )}

                  <button
                    type="button"
                    className="resume-list-item__icon-btn"
                    title="Re-run analysis"
                    disabled={isAnalyzing}
                    onClick={() => {
                      setSelectedResumeId(analysis.resume._id);
                      runAnalysis(analysis.resume._id);
                    }}
                  >
                    <FiRefreshCw />
                  </button>

                  <button
                    type="button"
                    className="resume-list-item__icon-btn resume-list-item__icon-btn--danger"
                    title="Delete"
                    onClick={() => handleDeleteAnalysis(analysis._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resumes;
