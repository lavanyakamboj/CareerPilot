const Resume = require("../models/resumeModel");
const analyzeResumeByAi = require("../utils/AiResumeAnalyzer");

const analyzeResume = async (req, res) => {
	try {
		const resume = await Resume.findOne({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		if (!resume.extractedText || resume.extractedText.trim() === "") {
			return res.status(400).json({
				message: "Resume text not extracted yet",
			});
		}

		const result = await analyzeResumeByAi(resume.extractedText);

		resume.aiAnalysis = result.analysis;
		resume.analysisProvider = result.provider;
		resume.analysisCreatedAt = new Date();

		await resume.save();

		res.status(200).json({
			message: "Resume analyzed successfully",
			provider: result.provider,
			analysis: resume.aiAnalysis,
		});
	} catch (error) {
		console.error("Gemini Analysis Error:", error);

		res.status(500).json({
			message: "Resume analysis failed",
			error: error.message,
		});
	}
};

module.exports = {
	analyzeResume,
};
