const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Resume routes working",
  });
});

module.exports = router;