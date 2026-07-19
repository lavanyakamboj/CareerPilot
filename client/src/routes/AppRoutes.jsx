import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import CoverLetter from "../pages/CoverLetter";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";
import Interview from "../pages/Interview";
import Jobs from "../pages/Jobs";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Resources from "../pages/Resources";
import Resumes from "../pages/Resumes";
import ResetPassword from "../pages/ResetPassword";
import Roadmap from "../pages/Roadmap";
import VerifyEmail from "../pages/VerifyEmail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="resumes" element={<Resumes />} />

          <Route path="roadmap" element={<Roadmap />} />

          <Route path="jobs" element={<Jobs />} />

          <Route path="resources" element={<Resources />} />

          <Route path="interview" element={<Interview />} />

          <Route path="cover-letter" element={<CoverLetter />} />

          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Invalid routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
