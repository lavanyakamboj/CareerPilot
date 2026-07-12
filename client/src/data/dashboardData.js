// src/data/dashboardData.js

export const dashboardData = {
  success: true,

  user: {
    id: "user-demo-001",
    name: "Lavanya Kamboj",
    email: "lavanya@example.com",
  },

  resume: {
    total: 1,

    latest: {
      id: "resume-demo-001",
      originalName: "Lavanya_Kamboj_Resume.pdf",
      filename: "resume-demo.pdf",
      fileSize: 245760,
      fileType: "application/pdf",
      uploadedAt: "2026-07-10T10:30:00.000Z",
    },

    latestScore: 70,

    latestSummary:
      "Your resume has a good technical foundation. Improve project descriptions, measurable achievements, and ATS keywords for stronger job applications.",

    scoreTrend: {
      oldScore: 64,
      latestScore: 70,
      improvement: 6,
      trend: "Improved",
      totalAnalyses: 2,
    },
  },

  roadmap: {
    id: "roadmap-demo-001",
    currentLevel: "Intermediate",
    targetRole: "Full Stack Developer",
    timeline: "12 weeks",

    phases: [
      {
        phase: "Strengthen Core Skills",
        duration: "3 weeks",
        focus: "JavaScript, React and backend fundamentals",
        topics: [
          "Advanced JavaScript",
          "React component patterns",
          "REST API development",
        ],
        projects: ["Improve CareerPilot authentication flow"],
      },
      {
        phase: "Build Production Features",
        duration: "4 weeks",
        focus: "Full-stack project development",
        topics: [
          "API integration",
          "Authentication",
          "Error handling",
        ],
        projects: ["Complete CareerPilot dashboard"],
      },
      {
        phase: "Interview Preparation",
        duration: "5 weeks",
        focus: "DSA, projects and interview confidence",
        topics: [
          "Problem-solving patterns",
          "Project explanation",
          "Mock interviews",
        ],
        projects: ["Prepare project presentation"],
      },
    ],

    skillsToLearn: [
      "Advanced React",
      "API Integration",
      "System Design Basics",
    ],

    progress: {
      completedPhases: 1,
      totalPhases: 3,
      percentage: 33,
    },

    updatedAt: "2026-07-11T09:15:00.000Z",
  },

  jobs: {
    topRoles: [
      {
        role: "Full Stack Developer",
        requiredSkills: [
          "React",
          "Node.js",
          "Express",
          "MongoDB",
        ],
        missingSkills: ["Testing", "Deployment"],
        preparationTips: [
          "Build one complete deployed MERN project",
          "Practice explaining backend architecture",
        ],
        matchPercentage: 82,
        priority: "High",
      },
      {
        role: "Frontend Developer",
        requiredSkills: [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
        ],
        missingSkills: ["Frontend testing"],
        preparationTips: [
          "Improve component architecture",
          "Practice responsive UI implementation",
        ],
        matchPercentage: 78,
        priority: "High",
      },
      {
        role: "Backend Developer",
        requiredSkills: [
          "Node.js",
          "Express",
          "MongoDB",
          "REST APIs",
        ],
        missingSkills: ["Redis", "Docker"],
        preparationTips: [
          "Improve database design knowledge",
          "Learn caching and deployment basics",
        ],
        matchPercentage: 68,
        priority: "Medium",
      },
    ],

    generatedAt: "2026-07-11T09:30:00.000Z",
  },

  resources: {
    books: [
      {
        title: "Eloquent JavaScript",
        provider: "Official Website",
        url: "https://eloquentjavascript.net/",
      },
    ],

    courses: [
      {
        title: "Full Stack Open",
        provider: "University of Helsinki",
        url: "https://fullstackopen.com/en/",
      },
    ],

    websites: [
      {
        title: "MDN Web Docs",
        provider: "Mozilla",
        url: "https://developer.mozilla.org/",
      },
    ],

    youtube: [
      {
        title: "JavaScript Learning Playlist",
        provider: "YouTube",
        url: "https://www.youtube.com/",
      },
    ],

    plan: [
      {
        week: "Week 1",
        focus: "Advanced JavaScript and React revision",
      },
      {
        week: "Week 2",
        focus: "Backend API integration",
      },
    ],
  },

  interview: {
    technical: [
      "What is the difference between authentication and authorization?",
      "How does React manage component state?",
    ],

    project: [
      "Explain the architecture of your CareerPilot project.",
      "How did you implement resume analysis in CareerPilot?",
    ],

    hr: [
      "Tell me about yourself.",
      "Why should we hire you for this role?",
    ],

    coding: [
      "Find two numbers in an array whose sum equals a target.",
      "Check whether a string is a valid palindrome.",
    ],

    tips: [
      "Answer technical questions using examples from your projects.",
      "Explain your approach before writing code.",
    ],
  },

  coverLetter: {
    exists: true,
    companyName: "Demo Company",
    jobTitle: "Full Stack Developer Intern",
    updatedAt: "2026-07-11T10:00:00.000Z",
  },

  recentActivities: [
    {
      id: "activity-001",
      type: "resume-analysis",
      title: "Resume analysis completed",
      description: "Your resume received a score of 70.",
      createdAt: "2026-07-11T10:10:00.000Z",
    },
    {
      id: "activity-002",
      type: "roadmap",
      title: "Career roadmap generated",
      description:
        "A 12-week roadmap was created for Full Stack Developer.",
      createdAt: "2026-07-11T09:15:00.000Z",
    },
    {
      id: "activity-003",
      type: "jobs",
      title: "Job recommendations updated",
      description:
        "Full Stack Developer is currently your highest matched role.",
      createdAt: "2026-07-11T09:30:00.000Z",
    },
  ],
};