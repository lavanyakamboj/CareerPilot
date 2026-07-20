const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../models/User");
const { signToken, verifyToken } = require("../utils/jwtUtils");
const { generateRawToken, hashToken, generateOtp } = require("../utils/tokenUtils");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/email");
const { blacklistToken } = require("../utils/tokenBlacklist");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
});

// ------------------------------------------------------------------
// Register
// ------------------------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Generic message hi rakhte hain (na ki "email already exists")
      // taaki account-enumeration na ho paaye (attacker yeh pata na
      // laga sake ki kaunsa email already registered hai).
      return res.status(400).json({
        message:
          "Could not register with these details. If you already have an account, try logging in or resetting your password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const rawVerificationToken = generateRawToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationTokenHash: hashToken(rawVerificationToken),
      emailVerificationExpires: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

    try {
      await sendVerificationEmail(user, verifyUrl);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError.message);
      // Account phir bhi ban chuka hai — user "resend verification" se
      // dobara try kar sakta hai, isliye yahan registration fail nahi
      // karte.
    }

    res.status(201).json({
      message:
        "Account created. Please check your email to verify your account before logging in.",
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// Verify email
// ------------------------------------------------------------------
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    const tokenHash = hashToken(token);

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationTokenHash +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({
        message: "This verification link is invalid or has expired.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// Resend verification email
// ------------------------------------------------------------------
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Generic response chahe user exist kare ya na kare — email
    // enumeration se bachne ke liye.
    const genericResponse = {
      message:
        "If an account with that email exists and isn't verified yet, a new verification link has been sent.",
    };

    if (!user || user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    const rawVerificationToken = generateRawToken();

    user.emailVerificationTokenHash = hashToken(rawVerificationToken);
    user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

    await sendVerificationEmail(user, verifyUrl);

    res.status(200).json(genericResponse);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// Login
// ------------------------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +failedLoginAttempts +lockUntil",
    );

    // Timing-safe-ish generic error — email exist na karne aur password
    // galat hone, dono cases mein exact same message + similar response
    // time (bcrypt hamesha chalta hai neeche) taaki attacker email
    // enumerate na kar sake.
    const invalidCredentialsResponse = () =>
      res.status(400).json({ message: "Invalid email or password." });

    if (!user) {
      // Dummy hash ke against compare karte hain taaki response time
      // "user not found" aur "wrong password" cases mein same rahe.
      await bcrypt.compare(password || "", "$2a$12$invalidsaltinvalidsaltinvalidsa");
      return invalidCredentialsResponse();
    }

    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Too many failed attempts. Please try again in ${minutesLeft} minute(s).`,
      });
    }

    if (!user.password) {
      // Google account — normal password se login nahi ho sakta.
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        user.failedLoginAttempts = 0;
      }

      await user.save();

      return invalidCredentialsResponse();
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Successful login — reset lockout counters.
    if (user.failedLoginAttempts || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    const token = signToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ------------------------------------------------------------------
// Logout — token ko blacklist kar deta hai (session invalidation)
// ------------------------------------------------------------------
const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer") ? authHeader.split(" ")[1] : null;

    if (token) {
      try {
        const decoded = verifyToken(token);
        blacklistToken(token, decoded.exp);
      } catch {
        // Token already invalid/expired — blacklist karne ki zaroorat nahi.
      }
    }

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// Forgot password — email + OTP + link dono bhejta hai
// ------------------------------------------------------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const genericResponse = {
      message:
        "If an account with that email exists, a password reset link and OTP have been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const rawResetToken = generateRawToken();
    const otp = generateOtp();

    user.resetPasswordTokenHash = hashToken(rawResetToken);
    user.resetPasswordOtpHash = hashToken(otp);
    user.resetPasswordExpires = new Date(Date.now() + RESET_EXPIRY_MS);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawResetToken}`;

    await sendPasswordResetEmail(user, resetUrl, otp);

    res.status(200).json(genericResponse);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// Reset password — token (link se) ya OTP, dono se accept karta hai
// ------------------------------------------------------------------
const resetPassword = async (req, res) => {
  try {
    const { token, otp, password } = req.body;

    if (!token && !otp) {
      return res.status(400).json({
        message: "Reset token or OTP is required.",
      });
    }

    const query = token
      ? { resetPasswordTokenHash: hashToken(token) }
      : { resetPasswordOtpHash: hashToken(otp) };

    const user = await User.findOne({
      ...query,
      resetPasswordExpires: { $gt: Date.now() },
    }).select(
      "+resetPasswordTokenHash +resetPasswordOtpHash +resetPasswordExpires",
    );

    if (!user) {
      return res.status(400).json({
        message: "This reset link/OTP is invalid or has expired.",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordOtpHash = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------------------------------------------------
// Google login/signup — frontend se ID token aata hai, hum usko
// Google ke saath verify karte hain (yeh step spoofing rokta hai —
// koi bhi random token bhej ke login nahi kar sakta).
// ------------------------------------------------------------------
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Could not read email from Google account." });
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email }],
    });

    if (user) {
      // Existing local account jo same email se hai — usko Google se link kar dete hain.
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = "google";
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
        authProvider: "google",
        isEmailVerified: true,
      });
    }

    const token = signToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    res.status(400).json({ message: "Google sign-in failed. Please try again." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
};