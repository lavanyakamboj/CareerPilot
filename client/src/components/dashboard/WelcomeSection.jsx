import React from "react";
import {
  FiArrowRight,
  FiFileText,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const WelcomeSection = ({ user, overview }) => {
  const firstName =
    user?.firstName || user?.name?.split(" ")[0] || "there";

  return (
    <section className="dashboard-welcome">
      <div className="dashboard-welcome__content">
        <div className="dashboard-welcome__eyebrow">
          <FiStar />
          <span>{overview?.greeting || "Welcome back"}</span>
        </div>

        <h2>
          Hi {firstName},{" "}
          <span>
            {overview?.title || "let's continue your progress."}
          </span>
        </h2>

        <p>
          {overview?.description ||
            "Review your career progress and complete your next recommended action."}
        </p>

        <div className="dashboard-welcome__actions">
          <Link
            to="/dashboard/resumes"
            className="dashboard-welcome__primary-action"
          >
            <FiFileText />
            Analyze resume
            <FiArrowRight />
          </Link>

          <Link
            to="/dashboard/roadmap"
            className="dashboard-welcome__secondary-action"
          >
            View roadmap
          </Link>
        </div>
      </div>

      <div
        className="dashboard-welcome__visual"
        aria-hidden="true"
      >
        <div className="dashboard-welcome__visual-orbit">
          <span className="dashboard-welcome__visual-dot dashboard-welcome__visual-dot--one" />
          <span className="dashboard-welcome__visual-dot dashboard-welcome__visual-dot--two" />
          <span className="dashboard-welcome__visual-dot dashboard-welcome__visual-dot--three" />
        </div>

        <div className="dashboard-welcome__visual-card">
          <div className="dashboard-welcome__visual-icon">
            <FiStar />
          </div>

          <strong>AI Career Assistant</strong>

          <span>Your next step is ready</span>

          <div className="dashboard-welcome__visual-progress">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;