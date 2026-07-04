const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const resumeRoutes = require("./routes/resumeRoutes");
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resumes", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/roadmap", roadmapRoutes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});