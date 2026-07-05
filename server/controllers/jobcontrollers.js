const Resume = require("../models/resumeModel");
const Analysis = require("../models/analysisModel");
const CareerRoadmap = require("../models/roadmapModel");
const Job = require("../models/jobModel");

const { generateJobs } = require("../utils/jobUtils");

const createJobs = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        message: "Resume ID is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const analysis = await Analysis.findOne({
      resume: resumeId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        message: "Resume analysis not found. Please analyze resume first.",
      });
    }

    const roadmap = await CareerRoadmap.findOne({
      resume: resumeId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({
        message: "Career roadmap not found. Please generate roadmap first.",
      });
    }

    const existing = await Job.findOne({
      user: req.user._id,
      resume: resumeId,
      analysis: analysis._id,
      roadmap: roadmap._id,
    });

    if (existing) {
      return res.status(200).json({
        message: "Job recommendation already exists",
        provider: existing.provider,
        job: existing,
      });
    }

    const aiResult = await generateJobs({ analysis, roadmap });

    const job = await Job.create({
      user: req.user._id,
      resume: resumeId,
      analysis: analysis._id,
      roadmap: roadmap._id,
      provider: aiResult.provider,
      roles: aiResult.roles,
    });

    res.status(201).json({
      message: "Job recommendation generated successfully",
      provider: aiResult.provider,
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate job recommendation",
      error: error.message,
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const jobs = await Job.find({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job recommendations",
      error: error.message,
    });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job recommendation not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job recommendation",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job recommendation not found",
      });
    }

    res.status(200).json({
      message: "Job recommendation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job recommendation",
      error: error.message,
    });
  }
};

module.exports = {
  createJobs,
  getJobs,
  getJob,
  deleteJob,
};