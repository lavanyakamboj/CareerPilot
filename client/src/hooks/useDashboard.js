import { useEffect, useState } from "react";

import { getDashboardSummary } from "../services/dashboardApi";
import { mapDashboardData } from "../utils/mapDashboardData";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read stored user:", error);
    return null;
  }
};

const useDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError("");

      const summary = await getDashboardSummary();
      const storedUser = getStoredUser();

      setData(mapDashboardData(summary, storedUser));
    } catch (requestError) {
      console.error("Dashboard loading failed:", requestError);

      const message =
        requestError.response?.data?.message ||
        "Unable to load your dashboard. Please refresh and try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadDashboard,
  };
};

export default useDashboard;
