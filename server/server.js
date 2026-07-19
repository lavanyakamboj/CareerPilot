const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const validateEnv = require("./config/validateEnv");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiters");
const {
  mongoSanitizeMiddleware,
} = require("./middleware/sanitize");

const resumeRoutes = require("./routes/resumeRoutes");
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const jobRoutes = require("./routes/jobRoutes");
const coverLetterRoutes = require("./routes/coverLetterRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Critical env vars missing/weak hone par yahin process exit ho jaayega.
validateEnv();

connectDB();

const app = express();

// Server ke peeche agar reverse proxy hai (Render/Railway/Nginx), to
// yeh zaroori hai taaki rate-limiter aur req.ip proxy ke IP ki jagah
// asli client IP sahi se dekhein.
app.set("trust proxy", 1);

// --- Security headers (Helmet) ---
// Content-Security-Policy, X-Frame-Options, HSTS, X-Content-Type-Options,
// Referrer-Policy, aur X-Powered-By hataana — sab ek saath.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// --- CORS: sirf trusted origins allow karo, "*" nahi ---
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin / server-to-server requests (no Origin header, e.g.
      // curl/Postman) ko allow karte hain — browser requests hamesha
      // Origin header bhejte hain, isliye yeh un par restrictive rehta hai.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --- Request logging (sensitive data redact karke) ---
morgan.token("safe-url", (req) => req.originalUrl.split("?")[0]);
app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? ":method :safe-url :status :response-time ms"
      : "dev",
  ),
);

// --- Body parsing (size-limited, taaki bade payloads se DoS na ho) ---
app.use(express.json({ limit: "1mb" }));

// --- NoSQL injection sanitization ---
// (XSS: React auto-escapes everything it renders — verified no
// `dangerouslySetInnerHTML` anywhere in the client — so we don't mangle
// stored data with server-side HTML-escaping. That approach also broke
// legitimate input like "Johnson & Johnson" or "O'Brien" by literally
// storing the escaped entities. Instead, the one real HTML-injection
// risk — a user's name being interpolated into HTML emails — is escaped
// at that specific point in server/utils/email.js, not globally here.)
app.use(mongoSanitizeMiddleware);

// --- Rate limiting (global baseline; auth routes ke apne stricter limits hain) ---
app.use("/api", apiLimiter);

app.use("/api/resumes", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai/jobs", jobRoutes);
app.use("/api/cover-letters", coverLetterRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ........");
});

// 404 handler for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Central error handler — multer (file type / file size) aur baaki saare
// route errors ko JSON response me convert karta hai, taaki frontend ko
// hamesha `error.response.data.message` milta rahe instead of an HTML
// error page ya generic "Network Error".
app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "This origin is not allowed to access the API." });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.message?.includes("Only PDF, DOC, and DOCX")) {
    return res.status(400).json({ message: err.message });
  }

  // Production mein stack trace / internal error details kabhi client
  // ko nahi bhejte — sirf generic message.
  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    message: isProduction
      ? "Something went wrong on the server"
      : err.message || "Something went wrong on the server",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});