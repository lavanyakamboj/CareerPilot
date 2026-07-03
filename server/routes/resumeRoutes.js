const express = require("express");
const router = express.Router();

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

module.exports = router;