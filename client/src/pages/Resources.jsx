import React, { useEffect, useState } from "react";
import { FiBookOpen, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

import ResumeSelector from "../components/dashboard/ResumeSelector";
import useResumes from "../hooks/useResumes";
import { generateResources, getResources } from "../services/resourcesApi";

import "../styles/dashboard/feature.css";

const sections = [
  { key: "courses", label: "Courses" },
  { key: "youtube", label: "YouTube" },
  { key: "docs", label: "Docs" },
  { key: "books", label: "Books" },
  { key: "practice", label: "Practice" },
  { key: "sites", label: "Websites" },
];

const priorityClass = {
  High: "priority-badge--high",
  Medium: "priority-badge--medium",
  Low: "priority-badge--low",
};

const Resources = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading: isLoadingResumes,
  } = useResumes();

  const [resources, setResources] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadResources = async (resumeId) => {
    if (!resumeId) {
      setResources(null);
      return;
    }

    try {
      setIsLoading(true);

      const data = await getResources(resumeId);

      setResources(data.resources);
    } catch (error) {
      setResources(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources(selectedResumeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId) return;

    try {
      setIsGenerating(true);

      await generateResources(selectedResumeId);

      toast.success("Learning resources generated");

      await loadResources(selectedResumeId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate resources. Make sure resume analysis and roadmap are ready first.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const activeItems = resources?.[activeTab] || [];

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
              <h3>Personalized resources</h3>
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
              {isGenerating ? "Generating..." : "Generate resources"}
            </button>
          </div>

          {isLoading && (
            <div
              className="feature-loading__block"
              style={{ minHeight: 220 }}
            />
          )}

          {!isLoading && !resources && (
            <div className="feature-empty-state">
              <span className="feature-empty-state__icon">
                <FiBookOpen />
              </span>
              <h3>No resources yet</h3>
              <p>
                Click "Generate resources" to get a personalized learning
                list.
              </p>
            </div>
          )}

          {!isLoading && resources && (
            <>
              <div className="feature-tabs" style={{ marginBottom: 18 }}>
                {sections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    className={`feature-tab ${
                      activeTab === section.key ? "feature-tab--active" : ""
                    }`}
                    onClick={() => setActiveTab(section.key)}
                  >
                    {section.label} ({resources[section.key]?.length || 0})
                  </button>
                ))}
              </div>

              {activeItems.length === 0 ? (
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: 12,
                  }}
                >
                  No items in this category.
                </p>
              ) : (
                <div className="resource-grid">
                  {activeItems.map((item, index) => (
                    <a
                      key={`${item.title}-${index}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-card"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <strong>{item.title}</strong>
                        <FiExternalLink
                          style={{ color: "var(--color-text-muted)" }}
                        />
                      </div>

                      {item.platform && <span>{item.platform}</span>}

                      <p>{item.reason}</p>

                      <span
                        className={`priority-badge ${
                          priorityClass[item.priority] ||
                          "priority-badge--medium"
                        }`}
                        style={{ width: "fit-content", marginTop: 4 }}
                      >
                        {item.priority}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {resources.plan?.length > 0 && (
                <div style={{ marginTop: 22 }}>
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 650,
                      color: "var(--color-text-secondary)",
                      marginBottom: 10,
                    }}
                  >
                    Suggested study plan
                  </p>

                  <div className="resume-list">
                    {resources.plan.map((step, index) => (
                      <div
                        key={`${step.title}-${index}`}
                        className="resume-list-item"
                      >
                        <span className="resume-list-item__icon">
                          {index + 1}
                        </span>
                        <div className="resume-list-item__content">
                          <strong>{step.title}</strong>
                          <span>{step.duration}</span>
                        </div>
                        <span
                          className={`priority-badge ${
                            priorityClass[step.priority] ||
                            "priority-badge--medium"
                          }`}
                        >
                          {step.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;
