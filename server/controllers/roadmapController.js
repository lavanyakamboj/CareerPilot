const Resume = require("../models/resumeModel");
const Roadmap = require("../models/roadmapModel");
const { generateRoadmap } = require("../utils/roadmapUtils");

const generateCareerRoadmap = async (req, res) => {
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

		if (!resume.extractedText || resume.extractedText.trim().length === 0) {
			return res.status(400).json({
				message: "Resume text not extracted yet",
			});
		}

		const { provider, roadmap } = await generateRoadmap(resume.extractedText);

		// find and update the previous one and doesn't create new
		const savedRoadmap = await Roadmap.findOneAndUpdate(
			{
				user: req.user._id,
				resume: resume._id,
			},
			{
				provider,
				currentLevel: roadmap.currentLevel,
				targetRole: roadmap.targetRole,
				timeline: roadmap.timeline,
				skillsToLearn: roadmap.skillsToLearn || [],
				prioritySkills: roadmap.prioritySkills || [],
				phases: roadmap.phases || [],
				certifications: roadmap.certifications || [],
				interviewPreparation: roadmap.interviewPreparation || [],
				careerAdvice: roadmap.careerAdvice,
			},
			{
				returnDocument: "after",
				upsert: true,
				runValidators: true,
			},
		);

		res.status(201).json({
			message: "Career roadmap generated successfully",
			provider,
			roadmap: savedRoadmap,
		});
	} catch (error) {
		res.status(500).json({
			message: "Career roadmap generation failed",
			error: error.message,
		});
	}
};

const getRoadmaps = async (req, res) => {
	try {
		const roadmaps = await Roadmap.find({
			user: req.user._id,
		})
			.populate("resume", "originalName")
			.sort({ createdAt: -1 });

		res.status(200).json({
			count: roadmaps.length,
			roadmaps,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch roadmaps",
			error: error.message,
		});
	}
};

const getRoadmapByResume = async (req, res) => {
	try {
		const { resumeId } = req.params;

		const roadmap = await Roadmap.findOne({
			user: req.user._id,
			resume: resumeId,
		}).populate("resume", "originalName");

		if (!roadmap) {
			return res.status(404).json({
				message: "Roadmap not found for this resume",
			});
		}

		res.status(200).json({
			roadmap,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch roadmap",
			error: error.message,
		});
	}
};

module.exports = {
	generateCareerRoadmap,
	getRoadmaps,
	getRoadmapByResume,
};
