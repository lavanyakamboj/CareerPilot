const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
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

    provider: {
      type: String,
      default: "Groq",
    },

    currentLevel: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    timeline: {
      type: String,
      required: true,
    },

    phases: [
      {
        phase: String,
        duration: String,
        focus: String,
        topics: [String],
        projects: [String],
      },
    ],

    skillsToLearn: [String],

    prioritySkills: [String],

    certifications: [String],

    interviewPreparation: [String],

    careerAdvice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);