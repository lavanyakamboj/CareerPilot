const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createJobs,
  getJobs,
  getJob,
  deleteJob,
} = require("../controllers/jobcontrollers");

router.post("/", protect, createJobs);

router.get("/one/:id", protect, getJob);

router.get("/:resumeId", protect, getJobs);

router.delete("/:id", protect, deleteJob);

module.exports = router;