const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const createLimiter = (max, message, options = {}) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
    ...options,
  });

const loginLimiter = createLimiter(
  8,
  "Too many login attempts. Please wait 15 minutes and try again.",
  // Login ke liye successful attempts count nahi karte — sirf failed
  // attempts hi budget consume karein (account lockout alag se already
  // failed logins handle karta hai).
  { skipSuccessfulRequests: true },
);

const registerLimiter = createLimiter(
  8,
  "Too many registration attempts. Please wait 15 minutes and try again.",
);

const resendVerificationLimiter = createLimiter(
  5,
  "Too many verification email requests. Please wait 15 minutes and try again.",
);

const forgotPasswordLimiter = createLimiter(
  5,
  "Too many password reset requests. Please wait 15 minutes and try again.",
);

// OTP/reset-password verify jaise endpoints ke liye thoda tight limit
// (guessing attacks — 6-digit OTP brute force — se bachne ke liye).
const otpLimiter = createLimiter(
  10,
  "Too many attempts. Please wait and try again.",
);

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  resendVerificationLimiter,
  forgotPasswordLimiter,
  otpLimiter,
};
