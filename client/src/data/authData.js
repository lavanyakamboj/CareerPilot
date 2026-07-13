import {
  FiBarChart2,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

export const loginShowcaseData = {
  eyebrow: "Your career workspace",

  title: "Build a career path that feels",

  highlightedTitle: "clear and achievable.",

  description:
    "Sign in to continue improving your resume, preparing for interviews and discovering the right opportunities.",

  benefits: [
    {
      icon: FiTarget,
      title: "Personalized career guidance",
      description:
        "Get recommendations based on your resume, skills and career goals.",
    },
    {
      icon: FiBarChart2,
      title: "Track your improvement",
      description:
        "Monitor resume scores, skill gaps and overall career progress.",
    },
    {
      icon: FiTrendingUp,
      title: "Move forward with clarity",
      description:
        "Know exactly what to improve and which opportunity to target next.",
    },
  ],

  progress: {
    label: "Career readiness",
    title: "Keep growing",
    score: "82%",
    steps: ["Resume", "Skills", "Interview"],
  },

  footer:
    "CareerPilot AI helps you make better career decisions while keeping you in control.",
};

export const registerShowcaseData = {
  eyebrow: "Start your career journey",

  title: "Turn your career goals into",

  highlightedTitle: "a clear action plan.",

  description:
    "Create your account to improve your resume, identify skill gaps and prepare confidently for the right opportunities.",

  benefits: [
    {
      icon: FiTarget,
      title: "Create your career profile",
      description:
        "Add your skills, resume and goals to receive personalized guidance.",
    },
    {
      icon: FiBarChart2,
      title: "Understand your progress",
      description:
        "Track resume scores, missing skills and preparation improvements.",
    },
    {
      icon: FiTrendingUp,
      title: "Prepare for better opportunities",
      description:
        "Build a clear roadmap for jobs, interviews and career growth.",
    },
  ],

  progress: {
    label: "Your journey",
    title: "Starts here",
    score: "01",
    steps: ["Profile", "Resume", "Roadmap"],
  },

  footer:
    "CareerPilot AI supports your decisions with practical guidance, while your career choices always remain yours.",
};

export const loginInitialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export const registerInitialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};