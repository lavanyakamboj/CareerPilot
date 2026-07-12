import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Login aur Register routes next authentication feature me add honge */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;