import React, { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../../styles/dashboard/topbar.css";

const pageInformation = {
  "/dashboard": {
    title: "Dashboard",
    description: "Track your career progress and next actions.",
  },

  "/dashboard/resumes": {
    title: "My Resumes",
    description: "Upload and manage your resume versions.",
  },

  "/dashboard/analysis": {
    title: "AI Analysis",
    description: "Review your resume insights and improvement areas.",
  },

  "/dashboard/roadmap": {
    title: "Career Roadmap",
    description: "Follow your personalized career preparation plan.",
  },

  "/dashboard/jobs": {
    title: "Job Matches",
    description: "Explore roles aligned with your current skills.",
  },

  "/dashboard/resources": {
    title: "Learning Resources",
    description: "Learn using personalized courses and resources.",
  },

  "/dashboard/interview": {
    title: "Interview Preparation",
    description: "Practice technical, HR and project questions.",
  },

  "/dashboard/cover-letter": {
    title: "Cover Letter",
    description: "Create targeted cover letters for job applications.",
  },

  "/dashboard/profile": {
    title: "Profile",
    description: "Manage your account and career preferences.",
  },
};

const getUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Unable to read user from localStorage:", error);
    return null;
  }
};

const Topbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = getUserFromStorage();

  const userName = user?.name || "Career Explorer";
  const userEmail = user?.email || "student@careerpilot.ai";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const currentPage =
    pageInformation[location.pathname] || pageInformation["/dashboard"];

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      return;
    }

    toast(`Searching for "${query}"`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar__left">
        <button
          type="button"
          className="dashboard-topbar__menu"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <FiMenu />
        </button>

        <div className="dashboard-topbar__heading">
          <h1>{currentPage.title}</h1>
          <p>{currentPage.description}</p>
        </div>
      </div>

      <div className="dashboard-topbar__right">
        <form
          className="dashboard-topbar__search"
          onSubmit={handleSearch}
        >
          <FiSearch />

          <input
            type="search"
            value={searchValue}
            placeholder="Search your workspace"
            aria-label="Search dashboard"
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <span>⌘ K</span>
        </form>

        <button
          type="button"
          className="dashboard-topbar__notification"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="dashboard-topbar__notification-dot" />
        </button>

        <div
          className="dashboard-topbar__profile-wrapper"
          ref={profileRef}
        >
          <button
            type="button"
            className={`dashboard-topbar__profile ${
              isProfileOpen ? "dashboard-topbar__profile--active" : ""
            }`}
            aria-expanded={isProfileOpen}
            onClick={() =>
              setIsProfileOpen((previousState) => !previousState)
            }
          >
            <span className="dashboard-topbar__avatar">
              {userInitials || "CP"}
            </span>

            <span className="dashboard-topbar__profile-info">
              <strong>{userName}</strong>
              <small>Student account</small>
            </span>

            <FiChevronDown className="dashboard-topbar__profile-arrow" />
          </button>

          {isProfileOpen && (
            <div className="dashboard-topbar__dropdown">
              <div className="dashboard-topbar__dropdown-user">
                <span className="dashboard-topbar__dropdown-avatar">
                  {userInitials || "CP"}
                </span>

                <div>
                  <strong>{userName}</strong>
                  <span>{userEmail}</span>
                </div>
              </div>

              <div className="dashboard-topbar__dropdown-divider" />

              <button
                type="button"
                onClick={() => navigate("/dashboard/profile")}
              >
                <FiUser />
                View profile
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard/profile")}
              >
                <FiSettings />
                Account settings
              </button>

              <div className="dashboard-topbar__dropdown-divider" />

              <button
                type="button"
                className="dashboard-topbar__logout-button"
                onClick={handleLogout}
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;