const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  generateCareerRoadmap,
  getRoadmaps,
  getRoadmapByResume ,
} = require("../controllers/roadmapController");

router.post("/generate/:resumeId", protect, generateCareerRoadmap);

router.get("/", protect, getRoadmaps);

router.get("/:resumeId", protect, getRoadmapByResume);

module.exports = router;