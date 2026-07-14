import React from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const RecommendedRoles = ({ roles = [] }) => {
  return (
    <article className="dashboard-panel recommended-roles">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">
            AI recommendations
          </span>

          <h3>Recommended roles</h3>
        </div>

        <Link
          to="/dashboard/jobs"
          className="dashboard-panel__link"
        >
          View all
          <FiArrowRight />
        </Link>
      </div>

      <div className="recommended-roles__list">
        {roles.slice(0, 3).map((role, index) => (
          <Link
            to="/dashboard/jobs"
            key={role.id}
            className="recommended-role"
          >
            <span
              className={`recommended-role__icon recommended-role__icon--${
                index + 1
              }`}
            >
              <FiBriefcase />
            </span>

            <div className="recommended-role__content">
              <div className="recommended-role__heading">
                <div>
                  <strong>{role.role}</strong>
                  <span>{role.priority}</span>
                </div>

                <span className="recommended-role__percentage">
                  {role.matchPercentage}%
                </span>
              </div>

              <div className="recommended-role__progress">
                <span
                  style={{
                    width: `${Math.min(
                      Math.max(role.matchPercentage, 0),
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="recommended-role__skills">
                {(role.skills || []).slice(0, 3).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <FiChevronRight className="recommended-role__arrow" />
          </Link>
        ))}
      </div>
    </article>
  );
};

export default RecommendedRoles;