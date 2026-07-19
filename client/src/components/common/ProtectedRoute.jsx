import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { getCurrentUser } from "../../services/authApi";

const ProtectedRoute = () => {
  const location = useLocation();

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        const user =
          data?.user ||
          data?.data?.user ||
          data?.data ||
          data;

        localStorage.setItem(
          "user",
          JSON.stringify(user),
        );

        setIsAuthenticated(true);
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error,
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="auth-route-loader">
        <div className="auth-route-spinner" />

        <p>Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;