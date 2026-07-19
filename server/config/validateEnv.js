const validateEnv = () => {
  const errors = [];

  if (!process.env.MONGO_URI) {
    errors.push("MONGO_URI is missing.");
  }

  if (!process.env.JWT_SECRET) {
    errors.push("JWT_SECRET is missing.");
  } else if (process.env.JWT_SECRET.length < 32) {
    errors.push(
      "JWT_SECRET is too short (must be at least 32 characters — use `openssl rand -hex 32` to generate one).",
    );
  }

  if (!process.env.CLIENT_URL) {
    errors.push(
      "CLIENT_URL is missing (needed for CORS whitelist and email links).",
    );
  }

  if (errors.length > 0) {
    console.error("\n❌ Server startup blocked — invalid environment configuration:\n");
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error("\nCheck your .env file against .env.example and try again.\n");
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    !(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    )
  ) {
    console.warn(
      "⚠️  SMTP is not configured — verification/reset emails will only be logged to the console, not actually sent. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in production.",
    );
  }
};

module.exports = validateEnv;
