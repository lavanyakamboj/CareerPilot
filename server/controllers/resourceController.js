const Resource = require("../models/resourceModel");
const Analysis = require("../models/analysisModel");
const CareerRoadmap = require("../models/roadmapModel");

const analyzeWithGroq = require("../utils/aiProviders/groqProvider");
const analyzeWithGemini = require("../utils/aiProviders/geminiProvider");

const {
  buildPrompt,
  parseJson,
  validateData,
} = require("../utils/resourceUtils");

const generateResources = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const analysis = await Analysis.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found. Analyze resume first.",
      });
    }

    const roadmap = await CareerRoadmap.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({
        message: "Roadmap not found. Generate roadmap first.",
      });
    }

    const prompt = buildPrompt(analysis, roadmap);

    let aiText;
    let provider = "Groq";

    try {
      aiText = await analyzeWithGroq(prompt);
    } catch (error) {
      provider = "Gemini";
      aiText = await analyzeWithGemini(prompt);
    }

    const data = parseJson(aiText);
    validateData(data);

    const resources = await Resource.findOneAndUpdate(
      {
        user: req.user._id,
        resume: resumeId,
      },
      {
        user: req.user._id,
        resume: resumeId,
        analysis: analysis._id,
        roadmap: roadmap._id,

        courses: data.courses,
        youtube: data.youtube,
        docs: data.docs,
        books: data.books,
        practice: data.practice,
        sites: data.sites,
        plan: data.plan,

        provider,
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Resources generated successfully",
      provider,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate resources",
      error: error.message,
    });
  }
};

const getResources = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resources = await Resource.findOne({
      user: req.user._id,
      resume: resumeId,
    }).sort({ updatedAt: -1 });

    if (!resources) {
      return res.status(404).json({
        message: "Resources not found",
      });
    }

    res.status(200).json({
      message: "Resources fetched successfully",
      resources,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resources",
      error: error.message,
    });
  }
};

module.exports = {
  generateResources,
  getResources,
};