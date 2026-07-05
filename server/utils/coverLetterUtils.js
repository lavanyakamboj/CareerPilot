const generateWithGemini = require("./aiProviders/geminiProvider");
const generateWithGroq = require("./aiProviders/groqProvider");

const cleanJson = (text) => {
  if (!text) return null;

  if (typeof text === "object") return text;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const buildCoverLetterPrompt = ({
  resumeText,
  analysis,
  roadmap,
  jobRecommendation,
  companyName,
  jobTitle,
  jobDescription,
}) => {
  return `
You are an expert ATS-friendly cover letter writer.

Create a personalized professional cover letter.

Rules:
- Return ONLY valid JSON.
- No markdown.
- No extra text.
- Cover letter should be 250-350 words.
- Tone: professional, confident, fresher-friendly.
- Do not add fake experience.
- Use resume, analysis, roadmap and job fit data.
- Mention company and job title naturally.
- Keep it ATS-friendly.

Candidate Resume:
${resumeText?.slice(0, 6000)}

Latest Resume Analysis:
${JSON.stringify(analysis || {}).slice(0, 1500)}

Latest Career Roadmap:
${JSON.stringify(roadmap || {}).slice(0, 1500)}

Latest Job Recommendation:
${JSON.stringify(jobRecommendation || {}).slice(0, 1500)}

Target Company:
${companyName}

Target Job Title:
${jobTitle}

Job Description:
${jobDescription.slice(0, 3000)}

Return JSON only:
{
  "coverLetter": ""
}
`;
};

const validateCoverLetter = (data) => {
  if (!data || typeof data !== "object") return false;
  if (!data.coverLetter || typeof data.coverLetter !== "string") return false;
  if (data.coverLetter.length < 300) return false;
  return true;
};

const generateCoverLetter = async (payload) => {
  const prompt = buildCoverLetterPrompt(payload);

  try {
    const geminiResponse = await generateWithGemini(prompt);
    const parsed = cleanJson(geminiResponse);

    if (validateCoverLetter(parsed)) {
      return {
        provider: "Gemini",
        coverLetter: parsed.coverLetter,
      };
    }
  } catch (error) {
    console.log("Gemini cover letter failed:", error.message);
  }

  try {
    const groqResponse = await generateWithGroq(prompt);
    const parsed = cleanJson(groqResponse);

    if (validateCoverLetter(parsed)) {
      return {
        provider: "Groq",
        coverLetter: parsed.coverLetter,
      };
    }
  } catch (error) {
    console.log("Groq cover letter failed:", error.message);
  }

  throw new Error("AI failed to generate valid cover letter");
};

module.exports = generateCoverLetter;