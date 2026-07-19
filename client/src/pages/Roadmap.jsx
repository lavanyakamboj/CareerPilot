import React, { useEffect, useState } from "react";
import {
  FiAward,
  FiClock,
  FiMap,
  FiRefreshCw,
  FiTarget,
} from "react-icons/fi";
import toast from "react-hot-toast";

import ResumeSelector from "../components/dashboard/ResumeSelector";
import useResumes from "../hooks/useResumes";
import { generateRoadmap, getRoadmapByResume } from "../services/roadmapApi";

import "../styles/dashboard/feature.css";

const Roadmap = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading: isLoadingResumes,
  } = useResumes();

  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadRoadmap = async (resumeId) => {
    if (!resumeId) {
      setRoadmap(null);
      return;
    }

    try {
      setIsLoading(true);

      const data = await getRoadmapByResume(resumeId);

      setRoadmap(data.roadmap);
    } catch (error) {
      // 404 simply means no roadmap generated yet — not a real error.
      setRoadmap(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap(selectedResumeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId) return;

    try {
      setIsGenerating(true);

      const data = await generateRoadmap(selectedResumeId);

      setRoadmap(data.roadmap);

      toast.success("Career roadmap generated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Roadmap generation failed",
      );
    } finally {
      setIsGenerating(false);
    }
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
              <h3>{roadmap ? "Your roadmap" : "Generate your roadmap"}</h3>
              <p>
                Based on your resume's extracted text and latest analysis.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <FiRefreshCw />
              {isGenerating
                ? "Generating..."
                : roadmap
                  ? "Regenerate"
                  : "Generate roadmap"}
            </button>
          </div>

          {isLoading && (
            <div
              className="feature-loading__block"
              style={{ minHeight: 220 }}
            />
          )}

          {!isLoading && !roadmap && (
            <div className="feature-empty-state">
              <span className="feature-empty-state__icon">
                <FiMap />
              </span>
              <h3>No roadmap yet</h3>
              <p>
                Generate a personalized roadmap — make sure the resume text
                has been extracted first.
              </p>
            </div>
          )}

          {!isLoading && roadmap && (
            <>
              <div
                className="feature-form__row"
                style={{ marginBottom: 20 }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    Current level
                  </p>
                  <strong style={{ fontSize: 14, color: "var(--color-text)" }}>
                    {roadmap.currentLevel}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    <FiTarget
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />
                    Target role
                  </p>
                  <strong style={{ fontSize: 14, color: "var(--color-text)" }}>
                    {roadmap.targetRole}
                  </strong>
                </div>
              </div>

              <span
                className="tag-chip tag-chip--primary"
                style={{
                  marginBottom: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <FiClock /> {roadmap.timeline}
              </span>

              <div className="question-group" style={{ marginTop: 10 }}>
                {(roadmap.phases || []).map((phase, index) => (
                  <div
                    key={`${phase.phase}-${index}`}
                    className="feature-panel"
                    style={{
                      boxShadow: "none",
                      background: "var(--color-surface-soft)",
                    }}
                  >
                    <div className="feature-panel__header">
                      <div>
                        <span className="tag-chip tag-chip--neutral">
                          Phase {index + 1}
                        </span>
                        <h3 style={{ marginTop: 8 }}>{phase.phase}</h3>
                        <p>
                          {phase.focus} · {phase.duration}
                        </p>
                      </div>
                    </div>

                    {phase.topics?.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 650,
                            color: "var(--color-text-secondary)",
                            marginBottom: 6,
                          }}
                        >
                          Topics
                        </p>
                        <div className="tag-list">
                          {phase.topics.map((topic) => (
                            <span
                              key={topic}
                              className="tag-chip tag-chip--neutral"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {phase.projects?.length > 0 && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 650,
                            color: "var(--color-text-secondary)",
                            marginBottom: 6,
                          }}
                        >
                          Projects
                        </p>
                        <div className="tag-list">
                          {phase.projects.map((project) => (
                            <span
                              key={project}
                              className="tag-chip tag-chip--primary"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="feature-form__row" style={{ marginTop: 20 }}>
                <div>
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 650,
                      color: "var(--color-text-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    Priority skills
                  </p>
                  <div className="tag-list">
                    {(roadmap.prioritySkills || []).map((skill) => (
                      <span key={skill} className="tag-chip tag-chip--danger">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 650,
                      color: "var(--color-text-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    <FiAward
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />
                    Certifications
                  </p>
                  <div className="tag-list">
                    {(roadmap.certifications || []).map((cert) => (
                      <span
                        key={cert}
                        className="tag-chip tag-chip--success"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {roadmap.interviewPreparation?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 650,
                      color: "var(--color-text-secondary)",
                      marginBottom: 8,
                    }}
                  >
                    Interview preparation focus
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: "var(--color-text-secondary)",
                      fontSize: 12,
                      lineHeight: 1.8,
                    }}
                  >
                    {roadmap.interviewPreparation.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roadmap.careerAdvice && (
                <div className="cover-letter-output" style={{ marginTop: 16 }}>
                  {roadmap.careerAdvice}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Roadmap;




