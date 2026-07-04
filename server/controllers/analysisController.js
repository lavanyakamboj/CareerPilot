const Resume = require("../models/resumeModel");
const Analysis = require("../models/analysisModel");
const analyzeResumeByAi = require("../utils/AiResumeAnalyzer");

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

// GET /api/analysis/:id
const getSingleAnalysis = async (req, res) => {
	try {
		const analysis = await Analysis.findById(req.params.id).populate(
			"resume",
			"originalName filename fileSize fileType createdAt",
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

module.exports = {
	analyzeResume,
	getAllAnalyses,
	getSingleAnalysis,
	deleteAnalysis,
};
