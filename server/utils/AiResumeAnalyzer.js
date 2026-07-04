const analyzeWithGemini = require("./aiProviders/geminiProvider");
const analyzeWithGroq = require("./aiProviders/groqProvider");

const buildPrompt = (resumeText) => {
  const limitedResumeText = resumeText.slice(0, 12000);

  return `
You are an ATS resume reviewer and technical hiring manager.

Analyze ONLY the resume content. First identify the candidate's target domain from the resume, then give feedback only for that domain.

Rules:
- Do not suggest unrelated fields like AI, ML, Cybersecurity, Blockchain, Data Science, or Cloud unless the resume clearly targets them.
- Be strict and realistic with score.
- Score 90+ only if resume has strong projects, GitHub/LinkedIn links, deployed links, measurable impact, clean formatting, and domain-specific skills.
- Deduct marks for weak project descriptions, missing links, no deployment, no metrics, repeated info, grammar issues, and missing skills expected for the detected domain.
- Weaknesses must be specific, not generic.
- Keep summary under 60 words.
- Maximum 4 short points in every array.
- Return ONLY valid JSON. No markdown. No explanation.

For MERN/full-stack candidates, relevant missing skills may include Git, GitHub, JWT Auth, REST API design, Redux, testing, deployment, Docker, CI/CD, WebSockets, or API documentation.

Resume:
${limitedResumeText}

Return JSON exactly in this format:
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

const parseResponse = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid AI JSON:", text);
    throw new Error("Invalid JSON returned by AI");
  }
};

const analyzeResumeByAi = async (resumeText) => {
  const prompt = buildPrompt(resumeText);

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

module.exports = analyzeResumeByAi;