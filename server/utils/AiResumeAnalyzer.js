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

// if ai doesnot return json 
const parseResponse = (text) => {
  try {
    // Remove markdown code fences if present
    text = text.replace(/```json|```/gi, "").trim();

    // Extract only JSON object
    const start = text.indexOf("{");  // where we found '{' -- json starts from here  
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("JSON object not found");
    }

    const jsonText = text.slice(start, end + 1);

    return JSON.parse(jsonText);   // return object 
  } catch (error) {
    console.error("Invalid AI Response:", text);
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
