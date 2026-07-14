import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../../styles/dashboard/dashboard.css";

const DashboardLayout = () => {
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previousState) => !previousState);
  };

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("dashboard-menu-open");
    } else {
      document.body.classList.remove("dashboard-menu-open");
    }

    return () => {
      document.body.classList.remove("dashboard-menu-open");
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`dashboard-layout ${
        isSidebarCollapsed ? "dashboard-layout--collapsed" : ""
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebar}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      )}

      <div className="dashboard-main">
        <Topbar onOpenSidebar={openSidebar} />

        <main className="dashboard-content">
          <div className="dashboard-content__inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;