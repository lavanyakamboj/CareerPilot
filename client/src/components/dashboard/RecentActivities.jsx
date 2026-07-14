import React from "react";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMap,
  FiMessageSquare,
} from "react-icons/fi";

const activityIcons = {
  analysis: FiBarChart2,
  roadmap: FiMap,
  job: FiBriefcase,
  interview: FiMessageSquare,
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

          return (
            <div
              key={activity.id}
              className="recent-activity"
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
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default RecentActivities;