const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
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
    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },
    provider: {
      type: String,
      enum: ["Gemini", "Groq"],
      required: true,
    },
    technicalQuestions: {
      type: [questionSchema],
      default: [],
    },
    projectQuestions: {
      type: [questionSchema],
      default: [],
    },
    behavioralQuestions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);