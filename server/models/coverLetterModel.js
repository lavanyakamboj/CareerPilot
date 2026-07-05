const mongoose = require("mongoose");

const coverLetterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["Gemini", "Groq"],
      required: true,
    },
  },
  { timestamps: true }
);

// one resume = one cover letter
coverLetterSchema.index(
  { user: 1, resume: 1 },
  { unique: true }
);

module.exports = mongoose.model("CoverLetter", coverLetterSchema);