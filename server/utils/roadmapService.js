const analyzeWithGroq = require("./aiProviders/groqProvider");

const buildRoadmapPrompt = (resumeText) => {
  const limitedText = resumeText.slice(0, 8000);

  return `
You are a senior software career mentor.

Create a personalized hiring-focused roadmap from the resume.
Return only valid JSON. No markdown.

Rules:
- Max 4 phases and max 5 items per array.
- Do not invent experience or overestimate level.
- If no industry experience is present, prefer "Beginner" or "Entry-Level".
- Target role must match the resume.
- Timeline and duration must include units (e.g. "6 Months", "1 Year").
- Suggest only missing/weak skills, not existing strong skills.
- prioritySkills must contain the top 3 skills to learn first.
- Do not recommend projects already present in the resume.
- Avoid Todo, Calculator, Weather, Notes, Portfolio, and basic CRUD/blog projects.
- Recommend modern, real-world, portfolio-worthy projects.
- Recommend only real technical certifications relevant to the target role.
- Do not recommend Agile, Scrum, PMP, ITIL, management certifications, or fake certification names. If none fit, return [].
- Interview prep must contain specific role-based tasks, not generic advice.
- careerAdvice must be under 80 words and mention a resume strength/project.
- If unsure about any field, return "" or [] instead of guessing.

Resume:
${limitedText}

JSON:
{
  "currentLevel":"",
  "targetRole":"",
  "timeline":"",
  "skillsToLearn":[],
  "prioritySkills":[],
  "phases":[
    {
      "phase":"",
      "duration":"",
      "focus":"",
      "topics":[],
      "projects":[]
    }
  ],
  "certifications":[],
  "interviewPreparation":[],
  "careerAdvice":""
}
`;
};

const cleanJsonResponse = (response) => {
  if (typeof response !== "string") {
    return response;
  }

  return response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const generateRoadmap = async (resumeText) => {
  const prompt = buildRoadmapPrompt(resumeText);

  const aiResponse = await analyzeWithGroq(prompt);

  const cleanedResponse = cleanJsonResponse(aiResponse);

  let roadmap;

  try {
    roadmap =
      typeof cleanedResponse === "string"
        ? JSON.parse(cleanedResponse)
        : cleanedResponse;
  } catch (error) {
    throw new Error("AI returned invalid roadmap JSON");
  }

  if (!Array.isArray(roadmap.prioritySkills)) {
    roadmap.prioritySkills = [];
  }

  if (
    !roadmap.currentLevel ||
    !roadmap.targetRole ||
    !roadmap.timeline ||
    !roadmap.careerAdvice
  ) {
    throw new Error("AI roadmap response is missing required fields");
  }

  return {
    provider: "Groq",
    roadmap,
  };
};

module.exports = {
  generateRoadmap,
};