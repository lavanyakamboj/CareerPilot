import React, { useEffect, useState } from "react";
import { FiBriefcase, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

import ResumeSelector from "../components/dashboard/ResumeSelector";
import useResumes from "../hooks/useResumes";
import {
  generateJobRecommendations,
  getJobRecommendations,
} from "../services/jobsApi";

import "../styles/dashboard/feature.css";

const priorityClass = {
  High: "priority-badge--high",
  Medium: "priority-badge--medium",
  Low: "priority-badge--low",
};

const Jobs = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading: isLoadingResumes,
  } = useResumes();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadJobs = async (resumeId) => {
    if (!resumeId) {
      setJobs([]);
      return;
    }

    try {
      setIsLoading(true);

      const data = await getJobRecommendations(resumeId);

      setJobs(data.jobs || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(selectedResumeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId) return;

    try {
      setIsGenerating(true);

      await generateJobRecommendations(selectedResumeId);

      toast.success("Job recommendations generated");

      await loadJobs(selectedResumeId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Job recommendation generation failed. Make sure resume analysis and roadmap are ready first.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const latestJob = jobs[0];

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
              <h3>Recommended roles</h3>
              <p>
                Requires resume analysis and career roadmap to be generated
                first.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <FiRefreshCw />
              {isGenerating ? "Generating..." : "Generate matches"}
            </button>
          </div>

          {isLoading && (
            <div
              className="feature-loading__block"
              style={{ minHeight: 220 }}
            />
          )}

          {!isLoading && !latestJob && (
            <div className="feature-empty-state">
              <span className="feature-empty-state__icon">
                <FiBriefcase />
              </span>
              <h3>No job matches yet</h3>
              <p>
                Click "Generate matches" to see roles that fit your profile.
              </p>
            </div>
          )}

          {!isLoading && latestJob && (
            <div className="resume-list">
              {(latestJob.roles || []).map((role, index) => (
                <div
                  key={`${role.role}-${index}`}
                  className="feature-panel"
                  style={{
                    boxShadow: "none",
                    background: "var(--color-surface-soft)",
                  }}
                >
                  <div className="feature-panel__header">
                    <div>
                      <h3>{role.role}</h3>
                      <p>{role.matchPercentage}% match</p>
                    </div>

                    <span
                      className={`priority-badge ${
                        priorityClass[role.priority] ||
                        "priority-badge--medium"
                      }`}
                    >
                      {role.priority} priority
                    </span>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: "#ece8f3",
                        overflow: "hidden",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${role.matchPercentage}%`,
                          background:
                            "linear-gradient(90deg, #987cef, #6950d5)",
                          borderRadius: "inherit",
                        }}
                      />
                    </div>

                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 650,
                        color: "var(--color-text-secondary)",
                        marginBottom: 6,
                      }}
                    >
                      Required skills
                    </p>
                    <div className="tag-list" style={{ marginBottom: 10 }}>
                      {(role.requiredSkills || []).map((skill) => (
                        <span
                          key={skill}
                          className="tag-chip tag-chip--neutral"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {role.missingSkills?.length > 0 && (
                      <>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 650,
                            color: "var(--color-text-secondary)",
                            marginBottom: 6,
                          }}
                        >
                          Missing skills
                        </p>
                        <div className="tag-list" style={{ marginBottom: 10 }}>
                          {role.missingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="tag-chip tag-chip--danger"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {role.preparationTips?.length > 0 && (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 18,
                          color: "var(--color-text-secondary)",
                          fontSize: 11.5,
                          lineHeight: 1.8,
                        }}
                      >
                        {role.preparationTips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
