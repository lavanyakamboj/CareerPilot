const express = require("express");
const router = express.Router();

const Analysis = require("../models/analysisModel");

const { protect } = require("../middleware/authMiddleware");

const {
  analyzeResume,
  getAllAnalyses,
  getSingleAnalysis,
  deleteAnalysis,
} = require("../controllers/analysisController");


// @desc    Get resume score improvement tracker
// @route   GET /api/analysis/tracker/score
// @access  Private
router.get("/tracker/score", protect, async (req, res) => {
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
});

router.post("/resume/:id", protect, analyzeResume);

router.get("/", protect, getAllAnalyses);
router.get("/:id", protect, getSingleAnalysis);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;