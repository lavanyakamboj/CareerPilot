import React from "react";
import {
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMap,
  FiMessageSquare,
  FiTarget,
  FiUser,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../../assets/images/logo.png";

import "../../styles/dashboard/sidebar.css";

const workspaceLinks = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: FiHome,
    end: true,
  },
  {
    label: "My Resumes",
    path: "/dashboard/resumes",
    icon: FiFileText,
  },
  {
    label: "AI Analysis",
    path: "/dashboard/analysis",
    icon: FiBarChart2,
  },
  {
    label: "Career Roadmap",
    path: "/dashboard/roadmap",
    icon: FiMap,
  },
  {
    label: "Job Matches",
    path: "/dashboard/jobs",
    icon: FiBriefcase,
  },
  {
    label: "Learning Resources",
    path: "/dashboard/resources",
    icon: FiBookOpen,
  },
  {
    label: "Interview Prep",
    path: "/dashboard/interview",
    icon: FiMessageSquare,
  },
  {
    label: "Cover Letter",
    path: "/dashboard/cover-letter",
    icon: FiTarget,
  },
];

const accountLinks = [
  {
    label: "Profile",
    path: "/dashboard/profile",
    icon: FiUser,
  },
];

const Sidebar = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login", {
      replace: true,
    });
  };

  const getLinkClassName = ({ isActive }) =>
    `dashboard-sidebar__link ${
      isActive ? "dashboard-sidebar__link--active" : ""
    }`;

  return (
    <aside
      className={`dashboard-sidebar ${
        isOpen ? "dashboard-sidebar--open" : ""
      } ${isCollapsed ? "dashboard-sidebar--collapsed" : ""}`}
    >
      <div className="dashboard-sidebar__header">
        <NavLink
          to="/dashboard"
          className="dashboard-sidebar__brand"
          aria-label="CareerPilot dashboard"
        >
          <span className="dashboard-sidebar__logo-box">
            <img
              src={logo}
              alt="CareerPilot logo"
              className="dashboard-sidebar__logo"
            />
          </span>

          <span className="dashboard-sidebar__brand-content">
            <span className="dashboard-sidebar__brand-name">
              CareerPilot
              <span>AI</span>
            </span>

            <span className="dashboard-sidebar__brand-tagline">
              Career workspace
            </span>
          </span>
        </NavLink>

        <button
          type="button"
          className="dashboard-sidebar__close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>

      <div className="dashboard-sidebar__body">
        <div className="dashboard-sidebar__group">
          <p className="dashboard-sidebar__group-title">Workspace</p>

          <nav className="dashboard-sidebar__nav">
            {workspaceLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={getLinkClassName}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="dashboard-sidebar__link-icon">
                    <Icon />
                  </span>

                  <span className="dashboard-sidebar__link-text">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="dashboard-sidebar__group dashboard-sidebar__group--account">
          <p className="dashboard-sidebar__group-title">Account</p>

          <nav className="dashboard-sidebar__nav">
            {accountLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getLinkClassName}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="dashboard-sidebar__link-icon">
                    <Icon />
                  </span>

                  <span className="dashboard-sidebar__link-text">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="dashboard-sidebar__resume-card">
          <span className="dashboard-sidebar__resume-icon">
            <FiTarget />
          </span>

          <div className="dashboard-sidebar__resume-content">
            <strong>Improve your profile</strong>

            <p>
              Upload your latest resume to receive better AI recommendations.
            </p>

            <NavLink to="/dashboard/resumes">
              Upload resume
              <FiChevronRight />
            </NavLink>
          </div>
        </div>
      </div>

      <div className="dashboard-sidebar__footer">
        <button
          type="button"
          className="dashboard-sidebar__logout"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <FiLogOut />

          <span>Logout</span>
        </button>

        <button
          type="button"
          className="dashboard-sidebar__collapse"
          aria-label={
            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;