import React, { useEffect, useState } from "react";
import { FiCalendar, FiLogOut, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCurrentUser } from "../services/authApi";
import { getDashboardSummary } from "../services/dashboardApi";

import "../styles/dashboard/feature.css";

const formatDate = (dateString) => {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        const [userResult, summaryResult] = await Promise.allSettled([
          getCurrentUser(),
          getDashboardSummary(),
        ]);

        if (userResult.status === "fulfilled") {
          setUser(userResult.value.user);
        }

        if (summaryResult.status === "fulfilled") {
          setSummary(summaryResult.value);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  return (
    <div className="feature-page">

      <div className="feature-panel">
        {isLoading ? (
          <div
            className="feature-loading__block"
            style={{ minHeight: 140 }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8f70ea, #6748d1)",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(user?.name || "S").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong style={{ fontSize: 17, color: "var(--color-text)" }}>
                {user?.name || "Student"}
              </strong>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FiMail /> {user?.email}
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "var(--color-text-muted)",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FiCalendar /> Joined {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {!isLoading && summary && (
        <div className="feature-panel">
          <div className="feature-panel__header">
            <div>
              <h3>Activity summary</h3>
              <p>A quick overview of your dashboard usage.</p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 14,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                Resumes uploaded
              </p>
              <strong style={{ fontSize: 22, color: "var(--color-text)" }}>
                {summary.resume?.totalResumes ?? 0}
              </strong>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                Latest resume score
              </p>
              <strong style={{ fontSize: 22, color: "var(--color-text)" }}>
                {summary.resume?.latestScore ?? "—"}
              </strong>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                Profile completion
              </p>
              <strong style={{ fontSize: 22, color: "var(--color-text)" }}>
                {summary.profileCompletion ?? 0}%
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className="feature-panel">
        <div className="feature-panel__header">
          <div>
            <h3>Account</h3>
            <p>Sign out of CareerPilot AI on this device.</p>
          </div>
        </div>

        <button type="button" className="btn-danger" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
