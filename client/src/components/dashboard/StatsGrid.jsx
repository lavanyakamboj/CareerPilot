import React from "react";
import {
  FiBarChart2,
  FiBriefcase,
  FiMap,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const statIcons = {
  score: FiBarChart2,
  jobs: FiBriefcase,
  roadmap: FiMap,
  interview: FiMessageSquare,
};

// Stat card ke icon type ke hisaab se sahi feature page par le jaate hain.
const statLinks = {
  score: "/dashboard/resumes",
  jobs: "/dashboard/jobs",
  roadmap: "/dashboard/roadmap",
  interview: "/dashboard/interview",
};

const StatsGrid = ({ stats = [] }) => {
  return (
    <section className="dashboard-stats">
      {stats.map((stat) => {
        const Icon = statIcons[stat.icon] || FiBarChart2;
        const linkTo = statLinks[stat.icon] || "/dashboard";

        return (
          <Link
            to={linkTo}
            key={stat.id}
            className="dashboard-stat-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="dashboard-stat-card__header">
              <span
                className={`dashboard-stat-card__icon dashboard-stat-card__icon--${stat.icon}`}
              >
                <Icon />
              </span>

              <span
                className={`dashboard-stat-card__change dashboard-stat-card__change--${stat.changeType}`}
              >
                {stat.changeType === "positive" && <FiTrendingUp />}
                {stat.change}
              </span>
            </div>

            <div className="dashboard-stat-card__content">
              <p>{stat.title}</p>

              <h3>
                {stat.value}
                {stat.suffix && <span>{stat.suffix}</span>}
              </h3>

              <small>{stat.description}</small>
            </div>

            <div className="dashboard-stat-card__decoration">
              <span />
              <span />
              <span />
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default StatsGrid;