const analyzeWithGemini = require("./aiProviders/geminiProvider");
const analyzeWithGroq = require("./aiProviders/groqProvider");

const buildPrompt = (resumeText) => {
  const limitedResumeText = resumeText.slice(0, 12000);

  return `
You are an ATS Resume Expert, Technical Recruiter, and Career Coach.

Analyze only the resume. Detect the candidate's target domain and give feedback only for that domain.

Rules:
- Return only valid raw JSON. No markdown or explanation.
- Score must be an integer from 1 to 100. Use 0 only for empty resume.
- Be strict and realistic. Give 90+ only for strong projects, links, deployment, measurable impact, clean formatting, and relevant skills.
- Deduct for weak projects, missing links, no deployment, no metrics, repeated info, grammar issues, and missing domain skills.
- Do not suggest unrelated fields unless clearly shown in the resume.
- Do not invent skills, projects, certificates, achievements, or experience.
- Keep summary under 80 words.
- Max 4 short, specific, non-duplicate items in every array.

For MERN/full-stack resumes, missing skills can include Git, GitHub, JWT, REST APIs, Redux, testing, deployment, Docker, CI/CD, WebSockets, or API docs.

Resume:
${limitedResumeText}

Return exactly:
{
  "score": 75,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "improvementTips": [],
  "suggestedRoles": [],
  "atsTips": []
}
`;
};

//resume aur Job description compare karne ke liye prompt
const buildJdMatchPrompt = (resumeText, jobDescription) => {
  const limitedResumeText = resumeText.slice(0, 10000);
  const limitedJdText = jobDescription.slice(0, 6000);

  return `
You are an ATS Resume Matching Expert and Technical Recruiter.

Compare the resume with the job description and return only valid raw JSON.

Rules:
- Return only JSON. No markdown or explanation.
- Match score must be an integer from 1 to 100.
- Be strict and realistic.
- Do not invent skills or experience.
- Use only resume and job description content.
- Max 5 short items in every array.
- Focus on role fit, required skills, missing skills, ATS keywords, and practical improvements.

Resume:
${limitedResumeText}

Job Description:
${limitedJdText}

Return exactly:
{
  "matchScore": 75,
  "summary": "",
  "matchedSkills": [],
  "missingSkills": [],
  "atsKeywords": [],
  "improvementTips": []
}
`;
};

const parseResponse = (text) => {
  try {
    text = text.replace(/```json|```/gi, "").trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("JSON object not found");
    }

    const jsonText = text.slice(start, end + 1);

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Invalid AI Response:", text);
    throw new Error("Invalid JSON returned by AI");
  }
};

//fallback logic
const runAiProviders = async (prompt) => {
  const providers = [
    {
      name: "Gemini",
      fn: analyzeWithGemini,
    },
    {
      name: "Groq",
      fn: analyzeWithGroq,
    },
  ];

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);

      const raw = await provider.fn(prompt);

      console.log(`${provider.name} succeeded`);

      return {
        provider: provider.name,
        analysis: parseResponse(raw),
      };
    } catch (error) {
      console.log(`${provider.name} failed: ${error.message}`);
    }
  }

  throw new Error("All AI providers failed.");
};

// new function to match job Description
const analyzeResumeByAi = async (resumeText) => {
  const prompt = buildPrompt(resumeText);
  return await runAiProviders(prompt);
};

const analyzeResumeForJd = async (resumeText, jobDescription) => {
  const prompt = buildJdMatchPrompt(resumeText, jobDescription);
  return await runAiProviders(prompt);
};

module.exports = analyzeResumeByAi;
module.exports.analyzeResumeForJd = analyzeResumeForJd;