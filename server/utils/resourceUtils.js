const buildPrompt = (analysis, roadmap) => {
	return `
You are a career mentor.

Suggest personalized learning resources using resume analysis and career roadmap.

Return ONLY valid JSON.

Rules:
- Max 3 items per category.
- Keep reasons short.
- Prefer free or affordable resources.
- Match user's current level.
- No markdown.
- No extra text.
- Recommend only free resources.
- Every resource must include a direct working public URL.
- Prefer official docs, official YouTube channels, freeCodeCamp, MDN, roadmap.sh, The Odin Project, GitHub docs, MongoDB University, Microsoft Learn, Google Developers.
- Avoid paid Udemy/Coursera links.
- Do not invent URLs.
- If exact URL is not known, use the official homepage of that resource.
- Link must start with https://

Analysis:
${JSON.stringify({
	score: analysis.score,
	summary: analysis.summary,
	strengths: analysis.strengths,
	weaknesses: analysis.weaknesses,
	missingSkills: analysis.missingSkills,
	suggestedRoles: analysis.suggestedRoles,
})}

Roadmap:
${JSON.stringify({
	level: roadmap.currentLevel,
	advice: roadmap.careerAdvice,
	phases: roadmap.phases,
	certifications: roadmap.certifications,
	interview: roadmap.interviewPreparation,
})}

Return JSON:
{
  "courses": [
    {
      "title": "",
      "platform": "",
      "link": "",
      "type": "Course",
      "reason": "",
      "priority": "High"
    }
  ],
  "youtube": [
    {
      "title": "",
      "platform": "YouTube",
      "link": "",
      "type": "YouTube",
      "reason": "",
      "priority": "Medium"
    }
  ],
  "docs": [
    {
      "title": "",
      "platform": "",
      "link": "",
      "type": "Docs",
      "reason": "",
      "priority": "High"
    }
  ],
  "books": [
    {
      "title": "",
      "platform": "",
      "link": "",
      "type": "Book",
      "reason": "",
      "priority": "Low"
    }
  ],
  "practice": [
    {
      "title": "",
      "platform": "",
      "link": "",
      "type": "Practice",
      "reason": "",
      "priority": "High"
    }
  ],
  "sites": [
    {
      "title": "",
      "platform": "",
      "link": "",
      "type": "Website",
      "reason": "",
      "priority": "Medium"
    }
  ],
  "plan": [
  {
    "title": "",
    "duration": "",
    "priority": "High"
  }
]
}
`;
};

const parseJson = (text) => {
	try {
		const clean = text
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		return JSON.parse(clean);
	} catch (error) {
		throw new Error("AI response is not valid JSON");
	}
};

const isUrl = (url) => {
	return typeof url === "string" && url.startsWith("https://");
};

const validateData = (data) => {
	const keys = ["courses", "youtube", "docs", "books", "practice", "sites"];

	for (const key of keys) {
		if (!Array.isArray(data[key]) || data[key].length > 3) {
			throw new Error(`${key} is invalid`);
		}

		for (const item of data[key]) {
			if (!item.title || !item.type || !item.reason || !item.priority) {
				throw new Error(`${key} item fields missing`);
			}

			if (!isUrl(item.link)) {
				throw new Error(`${key} has invalid link`);
			}
		}
	}

	if (!Array.isArray(data.plan) || data.plan.length > 5) {
		throw new Error("plan is invalid");
	}

	return true;
};

module.exports = {
	buildPrompt,
	parseJson,
	validateData,
};
