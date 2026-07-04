const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Resume",
    },
    provider: {
      type: String,
      required: true,
      enum: ["Gemini", "Groq"],
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    summary: {
      type: String,
      required: true,
    },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    improvementTips: [String],
    suggestedRoles: [String],
    atsTips: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);