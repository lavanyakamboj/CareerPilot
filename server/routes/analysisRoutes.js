const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  analyzeResume,
  getAllAnalyses,
  getSingleAnalysis,
  deleteAnalysis,
} = require("../controllers/analysisController");

router.post("/resume/:id", protect, analyzeResume);

router.get("/", protect, getAllAnalyses);
router.get("/:id", protect, getSingleAnalysis);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;