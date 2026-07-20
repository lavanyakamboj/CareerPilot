const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,  // extra spaces ko remove krega from front and end
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: 8,
      select: false, // default query me password kabhi nahi aayega
    },

    // --- Email verification ---
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationTokenHash: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // --- Forgot / reset password (OTP + link dono support karta hai) ---
    resetPasswordOtpHash: {
      type: String,
      select: false,
    },
    resetPasswordTokenHash: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    // --- Brute-force / bot protection: login lockout ---
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },

    // Password kab last change hui — purane JWT (issue-time se pehle ke)
    // ko automatically invalid karne ke liye use hota hai.
    passwordChangedAt: {
      type: Date,
      select: false,
    },

    // --- Google OAuth ---
    googleId: {
      type: String,
      unique: true,
      sparse: true, // taaki normal users ke liye null-null duplicate error na aaye
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true } // stores 2 fields createdAt and updatedAt
);

userSchema.methods.isLocked = function () {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

const User = mongoose.model("User", userSchema);

module.exports = User;