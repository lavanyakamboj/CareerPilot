const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/test", protect, (req, res) => {
  res.json({
    message: "Resume route is protected",
    user: req.user,
  });
});

router.post("/upload", protect, upload.single("resume"), (req, res) => {
  res.status(201).json({
    message: "Resume uploaded successfully",
    file: req.file,
    user: req.user._id,
  });
});

module.exports = router;