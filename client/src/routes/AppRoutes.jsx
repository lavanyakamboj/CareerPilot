import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

const DashboardPlaceholder = ({ title }) => {
  return (
    <section className="dashboard-placeholder">
      <span>CareerPilot AI</span>

      <h2>{title}</h2>

      <p>
        This dashboard feature will be connected in the next development
        phase.
      </p>
    </section>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="resumes"
            element={<DashboardPlaceholder title="My Resumes" />}
          />

          <Route
            path="analysis"
            element={<DashboardPlaceholder title="AI Resume Analysis" />}
          />

          <Route
            path="roadmap"
            element={<DashboardPlaceholder title="Career Roadmap" />}
          />

          <Route
            path="jobs"
            element={<DashboardPlaceholder title="Job Matches" />}
          />

          <Route
            path="resources"
            element={<DashboardPlaceholder title="Learning Resources" />}
          />

          <Route
            path="interview"
            element={<DashboardPlaceholder title="Interview Preparation" />}
          />

          <Route
            path="cover-letter"
            element={<DashboardPlaceholder title="Cover Letter Generator" />}
          />

          <Route
            path="profile"
            element={<DashboardPlaceholder title="Profile Settings" />}
          />
        </Route>
      </Route>

      {/* Invalid routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;