const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  analyzeResume,
  getAllAnalyses,
  getScoreTracker,
  compareResumeVersions,
  getSingleAnalysis,
  deleteAnalysis,
  matchResumeWithJd,
  interview,
} = require("../controllers/analysisController");

router.post("/resume/:id", protect, analyzeResume);
router.post("/jd-match/:resumeId", protect, matchResumeWithJd);
router.post("/interview/:resumeId", protect, interview);

router.get("/tracker/score", protect, getScoreTracker);
router.get("/compare", protect, compareResumeVersions);
router.get("/", protect, getAllAnalyses);
router.get("/:id", protect, getSingleAnalysis);

router.delete("/:id", protect, deleteAnalysis);

module.exports = router;