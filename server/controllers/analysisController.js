const Resume = require("../models/resumeModel");
const Analysis = require("../models/analysisModel");
const Interview = require("../models/interviewModel");

const {
  analyzeResumeByAi,
  analyzeResumeForJd,
  interviewAI,
} = require("../utils/AiResumeAnalyzer");

// POST /api/analysis/resume/:id
const analyzeResume = async (req, res) => {
	try {
		const resume = await Resume.findById(req.params.id);

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		if (resume.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not authorized to analyze this resume",
			});
		}

		if (!resume.extractedText || resume.extractedText.trim() === "") {
			return res.status(400).json({
				message: "Resume text not found. Please extract text first.",
			});
		}

		const aiResult = await analyzeResumeByAi(resume.extractedText);

		const analysis = await Analysis.create({
			user: req.user._id,
			resume: resume._id,
			provider: aiResult.provider,
			score: aiResult.analysis.score,
			summary: aiResult.analysis.summary,
			strengths: aiResult.analysis.strengths,
			weaknesses: aiResult.analysis.weaknesses,
			missingSkills: aiResult.analysis.missingSkills,
			improvementTips: aiResult.analysis.improvementTips,
			suggestedRoles: aiResult.analysis.suggestedRoles,
			atsTips: aiResult.analysis.atsTips,
		});

		res.status(201).json({
			message: "Resume analyzed successfully",
			provider: aiResult.provider,
			analysis,
		});
	} catch (error) {
		res.status(500).json({
			message: "Resume analysis failed",
			error: error.message,
		});
	}
};

// GET /api/analysis
const getAllAnalyses = async (req, res) => {
	try {
		const analyses = await Analysis.find({ user: req.user._id })
			.select("resume provider score summary createdAt")
			.populate("resume", "originalName filename createdAt")
			.sort({ createdAt: -1 });

		res.status(200).json({
			count: analyses.length,
			analyses,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch analysis history",
			error: error.message,
		});
	}
};

// GET /api/analysis/tracker/score
const getScoreTracker = async (req, res) => {
	try {
		const analyses = await Analysis.find({ user: req.user._id })
			.select("score createdAt")
			.sort({ createdAt: 1 });

		if (!analyses || analyses.length === 0) {
			return res.status(404).json({
				message: "No analysis history found",
			});
		}

		const oldScore = analyses[0].score;
		const latestScore = analyses[analyses.length - 1].score;
		const improvement = latestScore - oldScore;

		let trend = "No Change";

		if (improvement > 0) {
			trend = "Improving";
		} else if (improvement < 0) {
			trend = "Declining";
		}

		res.status(200).json({
			oldScore,
			latestScore,
			improvement,
			trend,
			totalAnalyses: analyses.length,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch score tracker",
			error: error.message,
		});
	}
};

// GET /api/analysis/compare
const compareResumeVersions = async (req, res) => {
	try {
		const analyses = await Analysis.find({ user: req.user._id })
			.select("score summary createdAt")
			.sort({ createdAt: -1 })
			.limit(2);

		if (analyses.length < 2) {
			return res.status(400).json({
				message: "At least two analyses are required for comparison.",
			});
		}

		const latestAnalysis = analyses[0];
		const previousAnalysis = analyses[1];

		const difference = latestAnalysis.score - previousAnalysis.score;

		let trend = "No Change";

		if (difference > 0) {
			trend = "Improving";
		} else if (difference < 0) {
			trend = "Declining";
		}

		res.status(200).json({
			previousScore: previousAnalysis.score,
			latestScore: latestAnalysis.score,
			difference,
			trend,
			previousSummary: previousAnalysis.summary,
			latestSummary: latestAnalysis.summary,
			previousAnalysisDate: previousAnalysis.createdAt,
			latestAnalysisDate: latestAnalysis.createdAt,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to compare resume versions",
			error: error.message,
		});
	}
};

// GET /api/analysis/:id
const getSingleAnalysis = async (req, res) => {
	try {
		const analysis = await Analysis.findById(req.params.id).populate(
			"resume",
			"originalName filename fileSize fileType createdAt"
		);

		if (!analysis) {
			return res.status(404).json({
				message: "Analysis not found",
			});
		}

		if (analysis.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not authorized to view this analysis",
			});
		}

		res.status(200).json({
			analysis,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch analysis",
			error: error.message,
		});
	}
};

// DELETE /api/analysis/:id
const deleteAnalysis = async (req, res) => {
	try {
		const analysis = await Analysis.findById(req.params.id);

		if (!analysis) {
			return res.status(404).json({
				message: "Analysis not found",
			});
		}

		if (analysis.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not authorized to delete this analysis",
			});
		}

		await analysis.deleteOne();

		res.status(200).json({
			message: "Analysis deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete analysis",
			error: error.message,
		});
	}
};

const matchResumeWithJd = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Job description is required",
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

    if (!resume.extractedText || resume.extractedText.trim() === "") {
      return res.status(400).json({
        message: "Resume text not found. Please extract resume text first.",
      });
    }

    const result = await analyzeResumeForJd(
      resume.extractedText,
      jobDescription
    );

    res.status(200).json({
      message: "JD match analysis completed successfully",
      provider: result.provider,
      result: result.analysis,
    });
  } catch (error) {
    res.status(500).json({
      message: "JD match analysis failed",
      error: error.message,
    });
  }
};


const interview = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription = "" } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (!resume.extractedText || resume.extractedText.trim() === "") {
      return res.status(400).json({
        message: "Resume text not found. Please extract resume text first.",
      });
    }

    const latestAnalysis = await Analysis.findOne({
      user: req.user._id,
      resume: resume._id,
    })
      .sort({ createdAt: -1 })
      .select("_id");

    if (!latestAnalysis) {
      return res.status(400).json({
        message:
          "Please analyze this resume first before generating interview questions.",
      });
    }

    const result = await interviewAI(resume.extractedText, jobDescription);

    const interviewQuestions = await Interview.findOneAndUpdate(
      {
        user: req.user._id,
        resume: resume._id,
      },
      {
        user: req.user._id,
        resume: resume._id,
        analysis: latestAnalysis._id,
        provider: result.provider,
        technicalQuestions: result.analysis.technicalQuestions || [],
        projectQuestions: result.analysis.projectQuestions || [],
        behavioralQuestions: result.analysis.behavioralQuestions || [],
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    res.status(200).json({
      message: "Interview questions generated successfully",
      provider: result.provider,
      interviewQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Interview question generation failed",
      error: error.message,
    });
  }
};


module.exports = {
  analyzeResume,
  getAllAnalyses,
  getScoreTracker,
  compareResumeVersions,
  getSingleAnalysis,
  deleteAnalysis,
  matchResumeWithJd,
  interview,
};