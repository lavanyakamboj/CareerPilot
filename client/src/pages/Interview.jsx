import React, { useState } from "react";
import { FiMessageSquare, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";

import ResumeSelector from "../components/dashboard/ResumeSelector";
import useResumes from "../hooks/useResumes";
import { generateInterviewQuestions } from "../services/interviewApi";

import "../styles/dashboard/feature.css";

const difficultyClass = {
  Easy: "tag-chip--success",
  Medium: "tag-chip--warning",
  Hard: "tag-chip--danger",
};

const questionSections = [
  { key: "technicalQuestions", label: "Technical" },
  { key: "projectQuestions", label: "Project-based" },
  { key: "behavioralQuestions", label: "Behavioral" },
];

const Interview = () => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isLoading: isLoadingResumes,
  } = useResumes();

  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedResumeId) return;

    try {
      setIsGenerating(true);

      const data = await generateInterviewQuestions(
        selectedResumeId,
        jobDescription,
      );

      setQuestions(data.interviewQuestions);

      toast.success("Interview questions generated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate interview questions. Analyze the resume first.",
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
              <h3>Generate interview questions</h3>
              <p>
                Optionally paste a job description for more targeted
                questions. Requires resume analysis to be done first.
              </p>
            </div>
          </div>

          <div className="feature-form">
            <div className="feature-form__group">
              <label htmlFor="interview-jd">
                Job description (optional)
              </label>
              <textarea
                id="interview-jd"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste a job description for more relevant questions..."
              />
            </div>

            <div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <FiZap />
                {isGenerating ? "Generating..." : "Generate questions"}
              </button>
            </div>
          </div>

          {!questions && (
            <div className="feature-empty-state" style={{ marginTop: 20 }}>
              <span className="feature-empty-state__icon">
                <FiMessageSquare />
              </span>
              <h3>No questions yet</h3>
              <p>
                Generate a fresh set of interview questions based on your
                resume.
              </p>
            </div>
          )}

          {questions && (
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 22 }}>
              {questionSections.map((section) => {
                const items = questions[section.key] || [];

                if (items.length === 0) return null;

                return (
                  <div key={section.key}>
                    <p
                      style={{
                        fontSize: 11.5,
                        fontWeight: 650,
                        color: "var(--color-text-secondary)",
                        marginBottom: 10,
                      }}
                    >
                      {section.label} questions
                    </p>

                    <div className="question-group">
                      {items.map((item, index) => (
                        <div
                          key={`${section.key}-${index}`}
                          className="question-item"
                        >
                          <p>{item.question}</p>
                          <span
                            className={`tag-chip ${
                              difficultyClass[item.difficulty] ||
                              "tag-chip--neutral"
                            }`}
                            style={{ flexShrink: 0 }}
                          >
                            {item.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Interview;
