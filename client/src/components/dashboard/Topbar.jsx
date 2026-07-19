import React, { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiChevronDown,
  FiLogOut,
  FiMap,
  FiMenu,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useDashboard from "../../hooks/useDashboard";
import { logoutUser } from "../../services/authApi";

import "../../styles/dashboard/topbar.css";

const pageInformation = {
  "/dashboard": {
    title: "Dashboard",
    description: "Track your career progress and next actions.",
  },

  "/dashboard/resumes": {
    title: "My Resumes",
    description: "Upload, extract and analyze your resume in one place.",
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

const activityIcons = {
  analysis: FiBarChart2,
  roadmap: FiMap,
  job: FiBriefcase,
  interview: FiMessageSquare,
};

const activityLinks = {
  analysis: "/dashboard/resumes",
  roadmap: "/dashboard/roadmap",
  job: "/dashboard/jobs",
  interview: "/dashboard/interview",
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
  const notificationRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Bell ke liye asli data — pehle yeh hardcoded/fake tha (koi onClick
  // nahi tha, dot hamesha dikhta tha). Ab dashboard summary se hi
  // "pending action" nudges (jo abhi tak complete nahi hui) aur recent
  // activity dikhate hain.
  const { data: dashboardData } = useDashboard();

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

  const pendingNudges = [];

  if (dashboardData) {
    const resumeScoreStat = dashboardData.stats?.find(
      (stat) => stat.id === "resume-score",
    );
    const interviewStat = dashboardData.stats?.find(
      (stat) => stat.id === "interview-questions",
    );

    if (resumeScoreStat?.value === "--") {
      pendingNudges.push({
        id: "nudge-resume",
        title: "Analyze your resume",
        description: "Upload and analyze your resume to get your AI score.",
        link: "/dashboard/resumes",
      });
    }

    if (!dashboardData.roadmap?.totalPhases) {
      pendingNudges.push({
        id: "nudge-roadmap",
        title: "Generate your career roadmap",
        description: "Get a personalized, phase-wise preparation plan.",
        link: "/dashboard/roadmap",
      });
    }

    if (interviewStat?.value === "0") {
      pendingNudges.push({
        id: "nudge-interview",
        title: "Practice interview questions",
        description: "Generate personalized technical and HR questions.",
        link: "/dashboard/interview",
      });
    }
  }

  const recentActivityNotifications = (dashboardData?.activities || [])
    .slice(0, 4)
    .map((activity) => ({
      id: `activity-${activity.id}`,
      title: activity.title,
      description: activity.time,
      link: activityLinks[activity.type] || "/dashboard",
      icon: activityIcons[activity.type] || FiBarChart2,
    }));

  const unreadCount = pendingNudges.length;

  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleNotificationNavigate = (link) => {
    setIsNotificationOpen(false);
    navigate(link);
  };

  const handleLogout = async () => {
    try {
      // Server-side token blacklist — taaki agar yeh token kahin leak
      // ho jaaye (browser history, logs), logout ke baad wo kaam na kare.
      await logoutUser();
    } catch {
      // Logout API fail bhi ho (e.g. network issue), phir bhi client-side
      // session clear karte hain — user ko stuck nahi rakhte.
    }

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
        <div
          className="dashboard-topbar__notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="dashboard-topbar__notification"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            onClick={() =>
              setIsNotificationOpen((previousState) => !previousState)
            }
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="dashboard-topbar__notification-dot" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="dashboard-topbar__notification-panel">
              <div className="dashboard-topbar__notification-panel-header">
                <strong>Notifications</strong>
                {unreadCount > 0 && (
                  <span>{unreadCount} need your attention</span>
                )}
              </div>

              {pendingNudges.length === 0 &&
                recentActivityNotifications.length === 0 && (
                  <div className="dashboard-topbar__notification-empty">
                    You're all caught up — nothing needs attention right now.
                  </div>
                )}

              {pendingNudges.map((nudge) => (
                <button
                  type="button"
                  key={nudge.id}
                  className="dashboard-topbar__notification-item dashboard-topbar__notification-item--action"
                  onClick={() => handleNotificationNavigate(nudge.link)}
                >
                  <span className="dashboard-topbar__notification-item-icon">
                    <FiAlertCircle />
                  </span>

                  <span className="dashboard-topbar__notification-item-content">
                    <strong>{nudge.title}</strong>
                    <small>{nudge.description}</small>
                  </span>
                </button>
              ))}

              {recentActivityNotifications.length > 0 && (
                <>
                  <div className="dashboard-topbar__dropdown-divider" />

                  {recentActivityNotifications.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <button
                        type="button"
                        key={activity.id}
                        className="dashboard-topbar__notification-item"
                        onClick={() =>
                          handleNotificationNavigate(activity.link)
                        }
                      >
                        <span className="dashboard-topbar__notification-item-icon">
                          <Icon />
                        </span>

                        <span className="dashboard-topbar__notification-item-content">
                          <strong>{activity.title}</strong>
                          <small>{activity.description}</small>
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

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