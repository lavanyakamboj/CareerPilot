const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "..", "uploads", "resumes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(24).toString("hex");
    cb(null, `${Date.now()}-${randomName}.pdf`);
  },
});

const fileFilter = function (req, file, cb) {
  const hasValidExtension = /\.pdf$/i.test(file.originalname);
  const hasValidMimeType = file.mimetype === "application/pdf";

  if (hasValidExtension && hasValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

module.exports = { upload, uploadDir };
