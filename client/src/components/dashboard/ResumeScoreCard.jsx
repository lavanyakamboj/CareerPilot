import React from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const ResumeScoreCard = ({ resumeScore }) => {
  const score = resumeScore?.score ?? 0;
  const safeScore = Math.min(Math.max(score, 0), 100);

  return (
    <article className="dashboard-panel resume-score-card">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">
            Resume performance
          </span>

          <h3>Latest resume score</h3>
        </div>

        <Link
          to="/dashboard/analysis"
          className="dashboard-panel__link"
        >
          Full analysis
          <FiArrowRight />
        </Link>
      </div>

      <div className="resume-score-card__body">
        <div className="resume-score-card__score-wrapper">
          <div
            className="resume-score-card__score-ring"
            style={{
              "--resume-score": `${safeScore * 3.6}deg`,
            }}
          >
            <div className="resume-score-card__score-inner">
              <strong>{safeScore}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="resume-score-card__score-status">
            <span>
              <FiTrendingUp />
              +{resumeScore?.change ?? 0} points
            </span>

            <strong>
              {resumeScore?.status || "Resume analysis ready"}
            </strong>

            <small>
              {resumeScore?.lastUpdated || "Recently updated"}
            </small>
          </div>
        </div>

        <p className="resume-score-card__summary">
          {resumeScore?.summary ||
            "Analyze your resume to receive personalized improvement suggestions."}
        </p>

        <div className="resume-score-card__insights">
          <div className="resume-score-card__insight">
            <div className="resume-score-card__insight-heading">
              <span className="resume-score-card__insight-icon resume-score-card__insight-icon--success">
                <FiCheckCircle />
              </span>

              <strong>Top strengths</strong>
            </div>

            <ul>
              {(resumeScore?.strengths || []).slice(0, 3).map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="resume-score-card__insight">
            <div className="resume-score-card__insight-heading">
              <span className="resume-score-card__insight-icon resume-score-card__insight-icon--warning">
                <FiRefreshCw />
              </span>

              <strong>Improve next</strong>
            </div>

            <ul>
              {(resumeScore?.improvements || [])
                .slice(0, 3)
                .map((improvement) => (
                  <li key={improvement}>{improvement}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResumeScoreCard;