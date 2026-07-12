import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Login aur Register routes next authentication feature me add honge */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;