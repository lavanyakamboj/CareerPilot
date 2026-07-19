import React from "react";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMap,
  FiMessageSquare,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const activityIcons = {
  analysis: FiBarChart2,
  roadmap: FiMap,
  job: FiBriefcase,
  interview: FiMessageSquare,
};

// Activity type ke hisaab se sahi feature page par le jaate hain.
const activityLinks = {
  analysis: "/dashboard/resumes",
  roadmap: "/dashboard/roadmap",
  job: "/dashboard/jobs",
  interview: "/dashboard/interview",
};

const RecentActivities = ({ activities = [] }) => {
  return (
    <article className="dashboard-panel recent-activities">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">
            Latest updates
          </span>

          <h3>Recent activity</h3>
        </div>

        <span className="recent-activities__status">
          <FiCheckCircle />
          Up to date
        </span>
      </div>

      <div className="recent-activities__list">
        {activities.slice(0, 5).map((activity) => {
          const Icon = activityIcons[activity.type] || FiCheckCircle;
          const linkTo = activityLinks[activity.type] || "/dashboard";

          return (
            <Link
              to={linkTo}
              key={activity.id}
              className="recent-activity"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span
                className={`recent-activity__icon recent-activity__icon--${activity.type}`}
              >
                <Icon />
              </span>

              <div className="recent-activity__content">
                <strong>{activity.title}</strong>
                <p>{activity.description}</p>
              </div>

              <span className="recent-activity__time">
                <FiClock />
                {activity.time}
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
};

export default RecentActivities;