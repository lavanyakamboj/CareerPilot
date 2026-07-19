import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiHash, FiLock } from "react-icons/fi";

import { resetPassword } from "../services/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import PasswordChecklist from "../components/auth/PasswordChecklist";

import { loginShowcaseData } from "../data/authData";
import { isPasswordValid, PASSWORD_HINT } from "../utils/passwordRules";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/login.css";
import "../styles/auth/common/auth-responsive.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!token && !otp.trim()) {
      newErrors.otp = "Enter the OTP sent to your email.";
    }

    if (!isPasswordValid(password)) {
      newErrors.password = PASSWORD_HINT;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const data = await resetPassword({
        token: token || undefined,
        otp: token ? undefined : otp.trim(),
        password,
      });

      toast.success(
        data?.message || "Password reset successfully. Please sign in.",
      );

      navigate("/login", { replace: true });
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        "This link/OTP is invalid or has expired.";

      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showcase={loginShowcaseData}>
      <div className="auth-form-heading">
        <span className="auth-form-label">Reset password</span>

        <h2>Set a new password</h2>

        <p>
          {token
            ? "Choose a strong new password for your account."
            : "Enter the OTP sent to your email, along with your new password."}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {!token && (
          <AuthInput
            name="otp"
            label="One-time code (OTP)"
            type="text"
            value={otp}
            placeholder="6-digit code"
            icon={FiHash}
            error={errors.otp}
            disabled={isSubmitting}
            onChange={(event) => {
              setOtp(event.target.value);
              setErrors((previous) => ({ ...previous, otp: "" }));
            }}
          />
        )}

        <AuthInput
          name="password"
          label="New password"
          type="password"
          value={password}
          placeholder="Create a new password"
          autoComplete="new-password"
          icon={FiLock}
          error={errors.password}
          hint={PASSWORD_HINT}
          disabled={isSubmitting}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((previous) => ({ ...previous, password: "" }));
          }}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((previous) => !previous)}
        />

        <PasswordChecklist password={password} />

        <AuthInput
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          placeholder="Enter your new password again"
          autoComplete="new-password"
          icon={FiLock}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setErrors((previous) => ({ ...previous, confirmPassword: "" }));
          }}
        />

        {errors.submit && (
          <span className="auth-error-message">{errors.submit}</span>
        )}

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="auth-switch-text">
        Remembered your password? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
