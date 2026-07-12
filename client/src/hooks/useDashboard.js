import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardApi";

const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const resumeId = localStorage.getItem("selectedResumeId");

      if (!resumeId) {
        setDashboard(null);
        return;
      }

      const data = await getDashboardSummary(resumeId);

      setDashboard(data);
    } catch (requestError) {
      console.error("Dashboard fetch error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "We could not load your career workspace."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetchDashboard: fetchDashboard,
  };
};

export default useDashboard;