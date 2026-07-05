const Resume = require("../models/resumeModel");
const Analysis = require("../models/analysisModel");
const CareerRoadmap = require("../models/roadmapModel");
const JobRecommendation = require("../models/jobModel");
const CoverLetter = require("../models/coverLetterModel");

const generateCoverLetterAI = require("../utils/coverLetterUtils");

const generateCoverLetter = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { companyName, jobTitle, jobDescription } = req.body;

    if (!companyName || !jobTitle || !jobDescription) {
      return res.status(400).json({
        message: "Company name, job title and job description are required",
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

    if (!resume.extractedText) {
      return res.status(400).json({
        message: "Resume text not extracted yet",
      });
    }

    const latestAnalysis = await Analysis.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    const latestRoadmap = await CareerRoadmap.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    const latestJobRecommendation = await JobRecommendation.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    const aiResult = await generateCoverLetterAI({
      resumeText: resume.extractedText,
      analysis: latestAnalysis,
      roadmap: latestRoadmap,
      jobRecommendation: latestJobRecommendation,
      companyName,
      jobTitle,
      jobDescription,
    });

    const coverLetter = await CoverLetter.findOneAndUpdate(
      {
        user: req.user._id,
        resume: resumeId,
      },
      {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        coverLetter: aiResult.coverLetter,
        provider: aiResult.provider,
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Cover letter generated successfully",
      coverLetter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cover letter generation failed",
      error: error.message,
    });
  }
};

const getCoverLetterByResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const coverLetter = await CoverLetter.findOne({
      user: req.user._id,
      resume: resumeId,
    });

    if (!coverLetter) {
      return res.status(404).json({
        message: "Cover letter not found",
      });
    }

    res.status(200).json({
      coverLetter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cover letter",
      error: error.message,
    });
  }
};

const deleteCoverLetterByResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const coverLetter = await CoverLetter.findOneAndDelete({
      user: req.user._id,
      resume: resumeId,
    });

    if (!coverLetter) {
      return res.status(404).json({
        message: "Cover letter not found",
      });
    }

    res.status(200).json({
      message: "Cover letter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete cover letter",
      error: error.message,
    });
  }
};

module.exports = {
  generateCoverLetter,
  getCoverLetterByResume,
  deleteCoverLetterByResume,
};