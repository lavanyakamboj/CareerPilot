const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.get("/test", protect, (req, res) => {
  res.json({
    message: "Resume route is protected",
    user: req.user,
  });
});

module.exports = router;