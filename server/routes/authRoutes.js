const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  loginLimiter,
  registerLimiter,
  resendVerificationLimiter,
  forgotPasswordLimiter,
  otpLimiter,
} = require("../middleware/rateLimiters");
const {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  resendVerificationValidators,
  handleValidationErrors,
} = require("../validators/authValidators");

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  registerValidators,
  handleValidationErrors,
  registerUser,
);

router.post(
  "/login",
  loginLimiter,
  loginValidators,
  handleValidationErrors,
  loginUser,
);

router.post("/logout", protect, logoutUser);

router.get("/verify-email/:token", verifyEmail);

router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerificationValidators,
  handleValidationErrors,
  resendVerificationEmail,
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidators,
  handleValidationErrors,
  forgotPassword,
);

router.post(
  "/reset-password",
  otpLimiter,
  resetPasswordValidators,
  handleValidationErrors,
  resetPassword,
);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isEmailVerified: req.user.isEmailVerified,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
