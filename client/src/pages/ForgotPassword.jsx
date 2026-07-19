import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiMail } from "react-icons/fi";

import { forgotPassword } from "../services/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

import { loginShowcaseData } from "../data/authData";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/login.css";
import "../styles/auth/common/auth-responsive.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const data = await forgotPassword(email.trim().toLowerCase());

      toast.success(
        data?.message || "If that email exists, a reset link has been sent.",
      );

      setIsSubmitted(true);
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showcase={loginShowcaseData}>
      <div className="auth-form-heading">
        <span className="auth-form-label">Reset password</span>

        <h2>Forgot your password?</h2>

        <p>
          Enter your email and we'll send you a reset link and a one-time
          code.
        </p>
      </div>

      {isSubmitted ? (
        <p className="auth-info-banner">
          If an account exists for <strong>{email}</strong>, you'll receive a
          reset link and OTP shortly. Check your inbox (and spam folder).
        </p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <AuthInput
            name="email"
            label="Email address"
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            icon={FiMail}
            error={error}
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />

          <button
            type="submit"
            className="auth-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
            {!isSubmitting && <FiArrowRight />}
          </button>
        </form>
      )}

      <p className="auth-switch-text">
        Remembered your password? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
