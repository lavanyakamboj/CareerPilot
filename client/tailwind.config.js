/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1D4ED8",
        accent: "#7C3AED",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        sidebar: "#0F172A",
        borderColor: "#E2E8F0",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",

        career: {
          background: "#F7F5FC",
          surface: "#FFFEFF",
          surfaceSoft: "#F3EFFF",
          sidebar: "#15102D",
          sidebarLight: "#231A45",
          purple: "#6E4BD8",
          purpleDark: "#4E32B0",
          purpleLight: "#E9E2FF",
          lavender: "#D8CCFA",
          border: "#DDD7EB",
          text: "#18122C",
          muted: "#706A80",
        },
      },

      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
        body: ["Work Sans", "system-ui", "sans-serif"],
        heading: ["Instrument Serif", "Georgia", "serif"],
      },

      borderRadius: {
        card: "24px",
        button: "999px",
        input: "16px",
        modal: "28px",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(33, 23, 66, 0.06)",
        card: "0 24px 60px rgba(59, 41, 112, 0.09)",
        glass: "0 18px 50px rgba(79, 55, 145, 0.08)",
        sidebar: "10px 0 40px rgba(18, 12, 43, 0.12)",
      },

      backgroundImage: {
        "career-page":
          "radial-gradient(circle at 88% 4%, rgba(217, 205, 255, 0.65), transparent 30%)",

        "career-card":
          "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(245,241,255,0.82))",

        "career-sidebar":
          "radial-gradient(circle at 0% 75%, rgba(112,75,216,0.25), transparent 30%)",
      },

      backdropBlur: {
        glass: "18px",
      },
    },
  },

  plugins: [],
};