// src/pages/dashboard/DashboardHome.jsx

import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMap,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";

import { dashboardData } from "../data/dashboardData";

import "../styles/dashboard/cards.css";

const quickActions = [
  {
    title: "Upload Resume",
    description: "Upload or update your latest resume.",
    icon: FiUploadCloud,
    path: "/dashboard/resume",
  },
  {
    title: "Analyze Resume",
    description: "Get your ATS score and improvement tips.",
    icon: FiBarChart2,
    path: "/dashboard/analysis",
  },
  {
    title: "Match Job Description",
    description: "Compare your resume with a target role.",
    icon: FiTarget,
    path: "/dashboard/jd-match",
  },
  {
    title: "Practice Interview",
    description: "Prepare role-specific interview questions.",
    icon: FiCheckCircle,
    path: "/dashboard/interview",
  },
];

const activityIcons = {
  "resume-analysis": FiBarChart2,
  roadmap: FiMap,
  jobs: FiBriefcase,
};

const formatActivityDate = (dateValue) => {
  if (!dateValue) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const getFirstName = (fullName = "") => {
  return fullName.trim().split(" ")[0] || "Student";
};

const Dashboard = () => {
  const data = dashboardData;

  const firstName = getFirstName(data?.user?.name);

  const resumeScore = data?.resume?.latestScore ?? 0;
  const totalResumes = data?.resume?.total ?? 0;

  const roadmapProgress =
    data?.roadmap?.progress?.percentage ?? 0;

  const targetRole =
    data?.roadmap?.targetRole ?? "Not selected";

  const topRoles = data?.jobs?.topRoles ?? [];
  const recentActivities = data?.recentActivities ?? [];

  return (
    <div className="dashboard-page dashboard-home">
      {/* Welcome Section */}

      <section className="dashboard-welcome-card">
        <div className="dashboard-welcome-content">
          <p className="dashboard-page-eyebrow">
            Career workspace
          </p>

          <h2>
            Welcome back, {firstName}
            <span>.</span>
          </h2>

          <p>
            Track your resume, prepare for interviews and follow your
            personalised career roadmap from one place.
          </p>

          <div className="dashboard-welcome-actions">
            <Link
              to="/dashboard/resume"
              className="dashboard-primary-btn"
            >
              <FiUploadCloud />
              Upload resume
            </Link>

            <Link
              to="/dashboard/analysis"
              className="dashboard-welcome-link"
            >
              View latest analysis
              <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="dashboard-welcome-score">
          <div
            className="dashboard-score-ring"
            style={{
              "--score-progress": `${resumeScore * 3.6}deg`,
            }}
          >
            <div className="dashboard-score-ring-inner">
              <strong>{resumeScore}</strong>
              <span>ATS score</span>
            </div>
          </div>

          <div className="dashboard-score-status">
            <FiTrendingUp />

            <div>
              <strong>
                {data?.resume?.scoreTrend?.trend ?? "No trend"}
              </strong>

              <span>
                {data?.resume?.scoreTrend?.improvement > 0
                  ? `+${data.resume.scoreTrend.improvement} points`
                  : "Complete another analysis"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}

      <section className="dashboard-stats-grid">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <FiFileText />
          </div>

          <div className="dashboard-stat-content">
            <span>Total resumes</span>
            <strong>{totalResumes}</strong>
            <small>Uploaded documents</small>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <FiTarget />
          </div>

          <div className="dashboard-stat-content">
            <span>Target role</span>
            <strong className="dashboard-stat-text-value">
              {targetRole}
            </strong>
            <small>Current career goal</small>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <FiMap />
          </div>

          <div className="dashboard-stat-content">
            <span>Roadmap progress</span>
            <strong>{roadmapProgress}%</strong>
            <small>
              {data?.roadmap?.progress?.completedPhases ?? 0} of{" "}
              {data?.roadmap?.progress?.totalPhases ?? 0} phases
            </small>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <FiBriefcase />
          </div>

          <div className="dashboard-stat-content">
            <span>Recommended roles</span>
            <strong>{topRoles.length}</strong>
            <small>Based on your resume</small>
          </div>
        </article>
      </section>

      {/* Quick Actions */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">
              Quick actions
            </h2>

            <p className="dashboard-section-description">
              Continue with the most useful next steps.
            </p>
          </div>
        </div>

        <div className="dashboard-quick-actions-grid">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;

            return (
              <Link
                key={action.path}
                to={action.path}
                className="dashboard-action-card"
              >
                <span className="dashboard-action-icon">
                  <ActionIcon />
                </span>

                <div className="dashboard-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>

                <FiArrowRight className="dashboard-action-arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid */}

      <section className="dashboard-section dashboard-main-grid">
        {/* Roadmap */}

        <article className="dashboard-card dashboard-roadmap-card">
          <div className="dashboard-card-heading">
            <div>
              <span className="dashboard-card-label">
                Career roadmap
              </span>

              <h2>{targetRole}</h2>
            </div>

            <Link to="/dashboard/roadmap">
              View roadmap
              <FiArrowRight />
            </Link>
          </div>

          <div className="dashboard-roadmap-summary">
            <div>
              <FiClock />
              <span>
                {data?.roadmap?.timeline ?? "Timeline not created"}
              </span>
            </div>

            <div>
              <FiCheckCircle />
              <span>
                {data?.roadmap?.progress?.completedPhases ?? 0} phases
                completed
              </span>
            </div>
          </div>

          <div className="dashboard-progress-header">
            <span>Overall progress</span>
            <strong>{roadmapProgress}%</strong>
          </div>

          <div
            className="dashboard-progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={roadmapProgress}
          >
            <span
              style={{
                width: `${Math.min(roadmapProgress, 100)}%`,
              }}
            />
          </div>

          <div className="dashboard-roadmap-phases">
            {(data?.roadmap?.phases ?? []).slice(0, 3).map(
              (phase, index) => {
                const isCompleted =
                  index <
                  (data?.roadmap?.progress?.completedPhases ?? 0);

                return (
                  <div
                    key={`${phase.phase}-${index}`}
                    className={`dashboard-roadmap-phase ${
                      isCompleted ? "completed" : ""
                    }`}
                  >
                    <span className="dashboard-phase-number">
                      {isCompleted ? <FiCheckCircle /> : index + 1}
                    </span>

                    <div>
                      <strong>{phase.phase}</strong>
                      <small>{phase.duration}</small>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </article>

        {/* Recommended Roles */}

        <article className="dashboard-card dashboard-jobs-card">
          <div className="dashboard-card-heading">
            <div>
              <span className="dashboard-card-label">
                Best matches
              </span>

              <h2>Recommended roles</h2>
            </div>

            <Link to="/dashboard/jobs">
              View all
              <FiArrowRight />
            </Link>
          </div>

          <div className="dashboard-role-list">
            {topRoles.slice(0, 3).map((role) => (
              <div
                key={role.role}
                className="dashboard-role-item"
              >
                <div className="dashboard-role-icon">
                  <FiBriefcase />
                </div>

                <div className="dashboard-role-details">
                  <div className="dashboard-role-title">
                    <strong>{role.role}</strong>

                    <span>{role.matchPercentage}% match</span>
                  </div>

                  <div className="dashboard-role-progress">
                    <span
                      style={{
                        width: `${Math.min(
                          role.matchPercentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <small>
                    {role.priority} priority
                    {role.missingSkills?.length
                      ? ` • ${role.missingSkills.length} skills to improve`
                      : ""}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Recent Activity */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">
              Recent activity
            </h2>

            <p className="dashboard-section-description">
              Your latest progress across CareerPilot.
            </p>
          </div>
        </div>

        <article className="dashboard-card dashboard-activity-card">
          {recentActivities.length > 0 ? (
            <div className="dashboard-activity-list">
              {recentActivities.map((activity) => {
                const ActivityIcon =
                  activityIcons[activity.type] ?? FiCheckCircle;

                return (
                  <div
                    key={activity.id}
                    className="dashboard-activity-item"
                  >
                    <span className="dashboard-activity-icon">
                      <ActivityIcon />
                    </span>

                    <div className="dashboard-activity-content">
                      <strong>{activity.title}</strong>
                      <p>{activity.description}</p>
                    </div>

                    <time>
                      {formatActivityDate(activity.createdAt)}
                    </time>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                <FiClock />
              </div>

              <h3>No recent activity</h3>

              <p>
                Upload your resume or complete an analysis to start
                tracking your career progress.
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default Dashboard;