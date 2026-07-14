// Backend ka /api/dashboard/summary response alag shape me aata hai.
// Ye function usse dashboard components (StatsGrid, ResumeScoreCard, etc.)
// ke expected shape me convert karta hai — bina kisi component/design ko
// touch kiye.

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Recently";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const moduleToActivityType = {
  "AI Analysis": "analysis",
  "Career Roadmap": "roadmap",
  "Job Recommendation": "job",
  "Interview Questions": "interview",
};

export const mapDashboardData = (summary, storedUser) => {
  const resume = summary?.resume || {};
  const careerRoadmap = summary?.careerRoadmap || null;
  const jobRecommendations = summary?.jobRecommendations || {};
  const interviewQuestions = summary?.interviewQuestions || null;
  const profileCompletion = summary?.profileCompletion ?? 0;

  const totalInterviewQuestions = interviewQuestions
    ? (interviewQuestions.technicalQuestions?.length || 0) +
      (interviewQuestions.projectQuestions?.length || 0) +
      (interviewQuestions.behavioralQuestions?.length || 0)
    : 0;

  const hasResumeAnalysis = typeof resume.latestScore === "number";

  const user = {
    name: summary?.user?.name || storedUser?.name || "Student",
    firstName:
      summary?.user?.name?.split(" ")[0] ||
      storedUser?.name?.split(" ")[0] ||
      "there",
    email: summary?.user?.email || storedUser?.email || "",
  };

  const overview = {
    greeting: getGreeting(),
    title: hasResumeAnalysis
      ? "Your career journey is moving forward."
      : "Let's get your career journey started.",
    description: hasResumeAnalysis
      ? "Review your latest resume score, complete your roadmap tasks and prepare for your next opportunity."
      : "Upload your resume to unlock your AI resume score, career roadmap and job matches.",
  };

  const stats = [
    {
      id: "resume-score",
      title: "Resume Score",
      value: hasResumeAnalysis ? String(resume.latestScore) : "--",
      suffix: hasResumeAnalysis ? "/100" : "",
      change: resume.scoreTrend
        ? `${resume.scoreTrend.difference >= 0 ? "+" : ""}${resume.scoreTrend.difference} points`
        : "Not analyzed",
      changeType: resume.scoreTrend
        ? resume.scoreTrend.difference > 0
          ? "positive"
          : resume.scoreTrend.difference < 0
            ? "negative"
            : "neutral"
        : "neutral",
      description: "Since your last analysis",
      icon: "score",
    },
    {
      id: "job-matches",
      title: "Job Matches",
      value: String(jobRecommendations.topRoles?.length || 0),
      suffix: "",
      change: jobRecommendations.topRoles?.length ? "AI matched" : "Pending",
      changeType: "positive",
      description: "Roles aligned with your profile",
      icon: "jobs",
    },
    {
      id: "profile-completion",
      title: "Profile Completion",
      value: String(profileCompletion),
      suffix: "%",
      change: careerRoadmap ? "Roadmap ready" : "In progress",
      changeType: "neutral",
      description: "Overall dashboard readiness",
      icon: "roadmap",
    },
    {
      id: "interview-questions",
      title: "Interview Questions",
      value: String(totalInterviewQuestions),
      suffix: "",
      change: totalInterviewQuestions ? "Ready" : "Not generated",
      changeType: "neutral",
      description: "Personalized questions generated",
      icon: "interview",
    },
  ];

  const resumeScore = {
    score: resume.latestScore ?? 0,
    previousScore: resume.scoreTrend?.previousScore ?? null,
    change: resume.scoreTrend?.difference ?? 0,
    status: hasResumeAnalysis
      ? resume.scoreTrend?.trend || "Good foundation"
      : "Resume not analyzed yet",
    summary:
      resume.latestSummary ||
      "Analyze your resume to receive personalized improvement suggestions.",
    lastUpdated: formatRelativeTime(
      resume.scoreHistory?.at(-1)?.createdAt || resume.latestResume?.createdAt,
    ),
    strengths: resume.strengths || [],
    improvements: resume.improvementTips || [],
  };

  const progress = (resume.scoreHistory || []).map((entry) => ({
    name: entry.label,
    score: entry.score,
  }));

  const recommendedRoles = (jobRecommendations.topRoles || []).map(
    (role, index) => ({
      id: index + 1,
      role: role.role,
      matchPercentage: role.matchPercentage,
      priority: role.priority,
      skills: role.requiredSkills || [],
      missingSkills: role.missingSkills || [],
    }),
  );

  const roadmap = careerRoadmap
    ? {
        currentPhase: 1,
        totalPhases: careerRoadmap.phases?.length || 0,
        progress: profileCompletion,
        title: careerRoadmap.targetRole || "Your personalized career roadmap",
        duration: careerRoadmap.timeline || "Duration not available",
        tasks: (careerRoadmap.phases || []).slice(0, 4).map((phase, index) => ({
          id: index + 1,
          title: `${phase.phase}: ${phase.focus}`,
          completed: false,
        })),
      }
    : {
        currentPhase: 0,
        totalPhases: 0,
        progress: 0,
        title: "Generate your career roadmap",
        duration: "Not started yet",
        tasks: [],
      };

  const activities = (summary?.recentActivities || []).map(
    (activity, index) => ({
      id: index + 1,
      type: moduleToActivityType[activity.module] || "analysis",
      title: activity.title,
      description: `Updated via ${activity.module}`,
      time: formatRelativeTime(activity.createdAt),
    }),
  );

  return {
    user,
    overview,
    stats,
    resumeScore,
    progress,
    recommendedRoles,
    roadmap,
    activities,
  };
};
