const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  generateCoverLetter,
  getCoverLetterByResume,
  deleteCoverLetterByResume,
} = require("../controllers/coverLetterController");

router.post("/:resumeId/generate", protect, generateCoverLetter);

router.get("/:resumeId", protect, getCoverLetterByResume);

router.delete("/:resumeId", protect, deleteCoverLetterByResume);

module.exports = router;