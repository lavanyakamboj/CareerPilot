const analyzeWithGemini = require("./aiProviders/geminiProvider");
const analyzeWithGroq = require("./aiProviders/groqProvider");

const buildPrompt = ({ analysis, roadmap }) => {
  return `
You are an expert career advisor for MERN stack and software engineering students.

Recommend suitable job roles using the given resume analysis and career roadmap.

Return ONLY valid JSON.

Rules:
- Recommend maximum 5 job roles.
- Match percentage must be 0 to 100.
- Priority must be High, Medium, or Low.
- Keep all arrays short, max 4 points.
- Do not return markdown.
- Do not add explanation outside JSON.

Resume Analysis:
${JSON.stringify({
  score: analysis.score,
  summary: analysis.summary,
  strengths: analysis.strengths,
  weaknesses: analysis.weaknesses,
  missingSkills: analysis.missingSkills,
  suggestedRoles: analysis.suggestedRoles,
})}

Career Roadmap:
${JSON.stringify({
  currentLevel: roadmap.currentLevel,
  careerAdvice: roadmap.careerAdvice,
  phases: roadmap.phases,
  certifications: roadmap.certifications,
  interviewPreparation: roadmap.interviewPreparation,
})}

Return JSON:
{
  "roles": [
    {
      "role": "MERN Stack Developer",
      "requiredSkills": ["React.js", "Node.js", "Express.js", "MongoDB"],
      "missingSkills": ["Docker", "System Design"],
      "preparationTips": ["Build MERN projects", "Practice REST APIs"],
      "matchPercentage": 85,
      "priority": "High"
    }
  ]
}
`;
};

const parseJson = (text) => {
  try {
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch {
    return null;
  }
};

const validateResult = (data) => {
  if (!data || !Array.isArray(data.roles) || data.roles.length === 0) {
    return false;
  }

  return data.roles.every((item) => {
    return (
      item.role &&
      Array.isArray(item.requiredSkills) &&
      Array.isArray(item.missingSkills) &&
      Array.isArray(item.preparationTips) &&
      typeof item.matchPercentage === "number" &&
      item.matchPercentage >= 0 &&
      item.matchPercentage <= 100 &&
      ["High", "Medium", "Low"].includes(item.priority)
    );
  });
};

const generateJobs = async ({ analysis, roadmap }) => {
  const prompt = buildPrompt({ analysis, roadmap });

  let provider = "Groq";
  let aiText;

  try {
    aiText = await analyzeWithGroq(prompt);
  } catch (error) {
    provider = "Gemini";
    aiText = await analyzeWithGemini(prompt);
  }

  const result = parseJson(aiText);

  if (!validateResult(result)) {
    throw new Error("Invalid AI job recommendation response");
  }

  return {
    provider,
    roles: result.roles,
  };
};

module.exports = {
  generateJobs,
};