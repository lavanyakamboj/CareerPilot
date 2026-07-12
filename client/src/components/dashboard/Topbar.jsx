import React from "react";

import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
} from "react-icons/fi";

import "../../styles/dashboard/topbar.css";

const Topbar = ({ openSidebar }) => {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={openSidebar}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>

        <div className="topbar-heading">
          <p className="topbar-date">{currentDate}</p>

          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="topbar-search">
          <FiSearch className="topbar-search-icon" />

          <input
            type="search"
            placeholder="Search tools..."
            aria-label="Search dashboard tools"
          />
        </label>

        <button
          type="button"
          className="topbar-icon-btn"
          aria-label="View notifications"
        >
          <FiBell />

          <span className="topbar-notification-dot" />
        </button>

        <button
          type="button"
          className="topbar-profile"
          aria-label="Open user profile"
        >
          <span className="topbar-avatar">LK</span>

          <span className="topbar-user-info">
            <strong>Lavanya Kamboj</strong>
            <small>Student</small>
          </span>

          <FiChevronDown className="topbar-profile-arrow" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;