import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiTarget,
  FiMessageSquare,
  FiMap,
  FiBook,
  FiBriefcase,
  FiEdit3,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import logo from "../../assets/images/logo.png";

import "../../styles/dashboard/sidebar.css";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FiGrid />,
    path: "/dashboard",
  },
  {
    title: "My Resume",
    icon: <FiFileText />,
    path: "/dashboard/resume",
  },
  {
    title: "Resume Analysis",
    icon: <FiBarChart2 />,
    path: "/dashboard/analysis",
  },
  {
    title: "JD Match",
    icon: <FiTarget />,
    path: "/dashboard/jd-match",
  },
  {
    title: "Interview",
    icon: <FiMessageSquare />,
    path: "/dashboard/interview",
  },
  {
    title: "Roadmap",
    icon: <FiMap />,
    path: "/dashboard/roadmap",
  },
  {
    title: "Resources",
    icon: <FiBook />,
    path: "/dashboard/resources",
  },
  {
    title: "Jobs",
    icon: <FiBriefcase />,
    path: "/dashboard/jobs",
  },
  {
    title: "Cover Letter",
    icon: <FiEdit3 />,
    path: "/dashboard/cover-letter",
  },
  {
    title: "Settings",
    icon: <FiSettings />,
    path: "/dashboard/settings",
  },
];

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <aside
      className={`dashboard-sidebar ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      {/* Logo */}

      <div className="sidebar-header">

        <NavLink
          to="/dashboard"
          className="sidebar-brand"
        >
          <img
            src={logo}
            alt="CareerPilot"
            className="sidebar-logo"
          />

          <div className="sidebar-brand-text">
            <h2>CareerPilot</h2>
            <span>AI Career Assistant</span>
          </div>
        </NavLink>

        <button
          className="sidebar-close-btn"
          onClick={closeSidebar}
        >
          <FiX />
        </button>
      </div>

      {/* Navigation */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.title}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom */}

      <div className="sidebar-footer">

        <button
          className="sidebar-logout-btn"
        >
          <FiLogOut />

          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;