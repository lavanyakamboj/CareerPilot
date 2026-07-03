const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Resume = require("../models/resumeModel");

// Test route to check protected resume route
router.get("/test", protect, (req, res) => {
	res.json({
		message: "Resume route is protected",
		user: req.user,
	});
});

// Upload a new resume
router.post("/upload", protect, upload.single("resume"), async (req, res) => {
	try {
		const resume = await Resume.create({
			user: req.user._id,
			originalName: req.file.originalname,
			filename: req.file.filename,
			filePath: req.file.path,
			fileSize: req.file.size,
			fileType: req.file.mimetype,
		});

		res.status(201).json({
			message: "Resume uploaded and saved successfully",
			resume,
		});
	} catch (error) {
		res.status(500).json({
			message: "Resume upload failed",
			error: error.message,
		});
	}
});

// Get all resumes uploaded by the logged-in user
router.get("/", protect, async (req, res) => {
	try {
		const resumes = await Resume.find({ user: req.user._id }).sort({
			createdAt: -1,
		});

		res.status(200).json({
			count: resumes.length,
			resumes,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch resumes",
			error: error.message,
		});
	}
});

// Extract text from resume PDF
router.get("/:id/extract-text", protect, async (req, res) => {
	try {
		const resume = await Resume.findById(req.params.id);

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		if (resume.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not allowed to access this resume",
			});
		}

		const filePath = path.join(__dirname, "..", resume.filePath);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				message: "Resume file not found",
			});
		}

		const fileBuffer = fs.readFileSync(filePath);
		const pdfData = await pdfParse(fileBuffer);

		// Save extracted text in MongoDB
		resume.extractedText = pdfData.text;
		await resume.save();

		res.status(200).json({
			message: "Text extracted and saved successfully",
			text: resume.extractedText,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to extract resume text",
			error: error.message,
		});
	}
});

// Download or view resume file
router.get("/:id/download", protect, async (req, res) => {
	try {
		const resume = await Resume.findById(req.params.id);

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		if (resume.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not allowed to access this resume",
			});
		}

		const filePath = path.join(__dirname, "..", resume.filePath);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				message: "Resume file not found",
			});
		}

		res.download(filePath, resume.originalName);
	} catch (error) {
		res.status(500).json({
			message: "Failed to download resume",
			error: error.message,
		});
	}
});

// Get single resume details by resume ID
router.get("/:id", protect, async (req, res) => {
	try {
		const resume = await Resume.findById(req.params.id);

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		// Check if this resume belongs to the logged-in user
		if (resume.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not allowed to access this resume",
			});
		}

		res.status(200).json({
			resume,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch resume details",
			error: error.message,
		});
	}
});

// Delete a resume by ID
router.delete("/:id", protect, async (req, res) => {
	try {
		const resume = await Resume.findById(req.params.id);

		if (!resume) {
			return res.status(404).json({
				message: "Resume not found",
			});
		}

		if (resume.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not allowed to delete this resume",
			});
		}

		// Create correct file path from server folder
		const filePath = path.join(__dirname, "..", resume.filePath);

		// Delete file from uploads folder if it exists
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		await resume.deleteOne();

		res.status(200).json({
			message: "Resume deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete resume",
			error: error.message,
		});
	}
});

module.exports = router;
