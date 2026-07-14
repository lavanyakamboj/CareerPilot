import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

import ProgressChart from "../components/dashboard/ProgressChart";
import RecentActivities from "../components/dashboard/RecentActivities";
import RecommendedRoles from "../components/dashboard/RecommendedRoles";
import ResumeScoreCard from "../components/dashboard/ResumeScoreCard";
import RoadmapPreview from "../components/dashboard/RoadmapPreview";
import StatsGrid from "../components/dashboard/StatsGrid";
import WelcomeSection from "../components/dashboard/WelcomeSection";

import useDashboard from "../hooks/useDashboard";

import "../styles/dashboard/dashboard.css";
import "../styles/dashboard/cards.css";

const DashboardLoading = () => {
  return (
    <div className="dashboard-loading" aria-label="Loading dashboard">
      <div className="dashboard-loading__welcome" />

      <div className="dashboard-loading__stats">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="dashboard-loading__stat" />
        ))}
      </div>

      <div className="dashboard-loading__grid">
        <div className="dashboard-loading__panel" />
        <div className="dashboard-loading__panel" />
        <div className="dashboard-loading__panel" />
        <div className="dashboard-loading__panel" />
      </div>
    </div>
  );
};

const DashboardError = ({ message, onRetry }) => {
  return (
    <div className="dashboard-error">
      <span className="dashboard-error__icon">
        <FiAlertCircle />
      </span>

      <h2>Dashboard could not be loaded</h2>

      <p>
        {message ||
          "Something went wrong while loading your dashboard information."}
      </p>

      <button type="button" onClick={onRetry}>
        <FiRefreshCw />
        Try again
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return <DashboardError message={error} onRetry={refetch} />;
  }

  return (
    <div className="dashboard-page">
      <WelcomeSection
        user={data.user}
        overview={data.overview}
      />

      <StatsGrid stats={data.stats} />

      <section className="dashboard-page__primary-grid">
        <ResumeScoreCard resumeScore={data.resumeScore} />

        <ProgressChart progress={data.progress} />
      </section>

      <section className="dashboard-page__secondary-grid">
        <RecommendedRoles roles={data.recommendedRoles} />

        <RoadmapPreview roadmap={data.roadmap} />
      </section>

      <section className="dashboard-page__activity-grid">
        <RecentActivities activities={data.activities} />
      </section>
    </div>
  );
};

export default Dashboard;