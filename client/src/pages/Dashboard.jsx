import { useState } from "react";

import DashboardLoader from "../components/dashboard/DashboardLoader";
import EmptyDashboard from "../components/dashboard/EmptyDashboard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import RecommendedRoles from "../components/dashboard/RecommendedRoles";
import ResumeScoreCard from "../components/dashboard/ResumeScoreCard";
import RoadmapCard from "../components/dashboard/RoadmapCard";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import Topbar from "../components/dashboard/Topbar";
import WelcomeSection from "../components/dashboard/WelcomeSection";

import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    dashboard,
    loading,
    error,
    refetchDashboard,
  } = useDashboard();

  if (loading) {
    return <DashboardLoader />;
  }

  const userName =
    dashboard?.user?.name || "Student";

  const resume = dashboard?.resume;
  const roadmap = dashboard?.careerRoadmap;
  const roles = dashboard?.jobs?.topRoles || [];
  const activities = dashboard?.recentActivities || [];

  const totalResumes =
    resume?.totalResumes || 0;

  const latestScore =
    resume?.latestScore || 0;

  const totalRoles =
    roles.length || 0;

  const completedTools = [
    roadmap,
    dashboard?.resources,
    dashboard?.interviewQuestions,
    dashboard?.coverLetter,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-career-background bg-career-page text-career-text">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
      />

      <main className="min-h-screen lg:ml-[272px]">
        <Topbar
          userName={userName}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pt-12">
          {error && (
            <div className="mb-7 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E8C8D5] bg-[#FFF8FB] p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold text-career-text">
                  Something interrupted the workspace.
                </h3>

                <p className="mb-0 mt-1 text-xs text-[#765967]">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={refetchDashboard}
                className="rounded-button bg-career-sidebar px-4 py-2 text-xs font-semibold text-white"
              >
                Try again
              </button>
            </div>
          )}

          <WelcomeSection userName={userName} />

          {!dashboard ? (
            <EmptyDashboard />
          ) : (
            <>
              <section className="grid gap-5 xl:grid-cols-[1.35fr_0.78fr]">
                <ResumeScoreCard resume={resume} />

                <RoadmapCard roadmap={roadmap} />
              </section>

              <section className="mt-5 grid border-y border-career-border lg:grid-cols-4">
                <StatCard
                  value={totalResumes}
                  label="Resumes uploaded"
                />

                <StatCard
                  value={`${latestScore}%`}
                  label="Latest ATS score"
                />

                <StatCard
                  value={totalRoles}
                  label="Suggested roles"
                />

                <StatCard
                  value={completedTools}
                  label="Tools completed"
                />
              </section>

              <QuickActions />

              <section className="grid gap-5 pt-5 xl:grid-cols-2">
                <RecommendedRoles roles={roles} />

                <RecentActivity activities={activities} />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;