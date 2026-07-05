const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  generateResources,
  getResources,
} = require("../controllers/resourceController");

router.post("/generate/:resumeId", protect, generateResources);
router.get("/:resumeId", protect, getResources);

module.exports = router;