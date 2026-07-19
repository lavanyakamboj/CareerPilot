const User = require("../models/User");
const Resume = require("../models/resumeModel");
const Analysis = require("../models/analysisModel");
const Roadmap = require("../models/roadmapModel");
const Resource = require("../models/resourceModel");
const Job = require("../models/jobModel");
const CoverLetter = require("../models/coverLetterModel");
const Interview = require("../models/interviewModel");

const getScoreTrend = (latestAnalysis, previousAnalysis) => {
  if (!latestAnalysis || !previousAnalysis) return null;

  const difference = latestAnalysis.score - previousAnalysis.score;

  let trend = "No Change";
  if (difference > 0) trend = "Improving";
  if (difference < 0) trend = "Declining";

  return {
    previousScore: previousAnalysis.score,
    latestScore: latestAnalysis.score,
    difference,
    trend,
  };
};

const calculateProfileCompletion = ({
  user,
  totalResumes,
  latestAnalysis,
  latestRoadmap,
  latestJobs,
  latestResources,
  latestInterview,
  latestCoverLetter,
}) => {
  let completion = 0;

  if (user?.name && user?.email) completion += 15;
  if (totalResumes > 0) completion += 20;
  if (latestAnalysis) completion += 20;
  if (latestRoadmap) completion += 15;
  if (latestJobs) completion += 10;
  if (latestResources) completion += 10;
  if (latestInterview) completion += 5;
  if (latestCoverLetter) completion += 5;

  return Math.min(completion, 100);
};

const buildRecentActivities = ({
  latestResume,
  latestAnalysis,
  latestRoadmap,
  latestJobs,
  latestResources,
  latestInterview,
  latestCoverLetter,
}) => {
  const activities = [];

  if (latestResume) {
    activities.push({
      title: "Resume uploaded",
      module: "Resume",
      createdAt: latestResume.createdAt,
    });
  }

  if (latestAnalysis) {
    activities.push({
      title: "Resume analysis completed",
      module: "AI Analysis",
      createdAt: latestAnalysis.createdAt,
    });
  }

  if (latestRoadmap) {
    activities.push({
      title: "Career roadmap generated",
      module: "Career Roadmap",
      createdAt: latestRoadmap.createdAt,
    });
  }

  if (latestJobs) {
    activities.push({
      title: "Job recommendations generated",
      module: "Job Recommendation",
      createdAt: latestJobs.createdAt,
    });
  }

  if (latestResources) {
    activities.push({
      title: "Learning resources generated",
      module: "Learning Resources",
      createdAt: latestResources.createdAt,
    });
  }

  if (latestInterview) {
    activities.push({
      title: "Interview questions generated",
      module: "Interview Questions",
      createdAt: latestInterview.createdAt,
    });
  }

  if (latestCoverLetter) {
    activities.push({
      title: "Cover letter generated",
      module: "Cover Letter",
      createdAt: latestCoverLetter.createdAt,
    });
  }

  return activities
    .filter((activity) => activity.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      user,
      totalResumes,
      latestResume,
      analyses,
      latestRoadmap,
      latestJobs,
      latestResources,
      latestInterview,
      latestCoverLetter,
    ] = await Promise.all([
      User.findById(userId).select("name email createdAt").lean(),

      Resume.countDocuments({ user: userId }),

      Resume.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("originalName filename fileSize fileType createdAt")
        .lean(),

      Analysis.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(2)
        .select("score summary strengths improvementTips createdAt")
        .lean(),

      Roadmap.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select(
          "currentLevel targetRole timeline phases skillsToLearn prioritySkills certifications interviewPreparation careerAdvice provider createdAt"
        )
        .lean(),

      Job.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("roles provider createdAt")
        .lean(),

      Resource.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("courses youtube docs books practice sites plan provider createdAt")
        .lean(),

      Interview.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select(
          "technicalQuestions projectQuestions behavioralQuestions provider createdAt"
        )
        .lean(),

      CoverLetter.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("companyName jobTitle createdAt")
        .lean(),
    ]);

    const latestAnalysis = analyses[0] || null;
    const previousAnalysis = analyses[1] || null;

    const scoreTrend = getScoreTrend(latestAnalysis, previousAnalysis);

    const profileCompletion = calculateProfileCompletion({
      user,
      totalResumes,
      latestAnalysis,
      latestRoadmap,
      latestJobs,
      latestResources,
      latestInterview,
      latestCoverLetter,
    });

    const recentActivities = buildRecentActivities({
      latestResume,
      latestAnalysis,
      latestRoadmap,
      latestJobs,
      latestResources,
      latestInterview,
      latestCoverLetter,
    });

    res.status(200).json({
      message: "Dashboard summary fetched successfully",

      user: {
        name: user?.name,
        email: user?.email,
        joinedAt: user?.createdAt,
      },

      resume: {
        totalResumes,
        latestResume,
        latestScore: latestAnalysis?.score || null,
        latestSummary: latestAnalysis?.summary || null,
        strengths: latestAnalysis?.strengths || [],
        improvementTips: latestAnalysis?.improvementTips || [],
        scoreTrend,
      },

      careerRoadmap: latestRoadmap,

      jobRecommendations: {
        provider: latestJobs?.provider || null,
        topRoles: latestJobs?.roles ? latestJobs.roles.slice(0, 5) : [],
        generatedAt: latestJobs?.createdAt || null,
      },

      learningResources: latestResources,

      interviewQuestions: latestInterview,

      coverLetter: {
        generated: !!latestCoverLetter,
        latest: latestCoverLetter || null,
      },

      profileCompletion,

      recentActivities,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};