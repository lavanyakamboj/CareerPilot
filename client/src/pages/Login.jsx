import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMail,
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";

import { loginUser, resendVerificationEmail } from "../services/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

import useAuthForm from "../hooks/useAuthForm";

import {
  loginInitialValues,
  loginShowcaseData,
} from "../data/authData";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/login.css";
import "../styles/auth/common/auth-responsive.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registeredEmail =
    location.state?.registeredEmail || "";
  const justRegistered = Boolean(location.state?.justRegistered);

  const [needsVerification, setNeedsVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    formData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
  } = useAuthForm({
    ...loginInitialValues,
    email: registeredEmail,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    return newErrors;
  };
const handleSubmit = async (event) => {
  event.preventDefault();

  const validationErrors = validateForm();

  if (
    Object.keys(validationErrors).length > 0
  ) {
    setErrors(validationErrors);
    return;
  }

  try {
    setIsSubmitting(true);
    setErrors({});
    setNeedsVerification(false);

    const data = await loginUser({
      email: formData.email
        .trim()
        .toLowerCase(),
      password: formData.password,
    });

    const token =
      data?.token ||
      data?.data?.token;

    const user =
      data?.user ||
      data?.data?.user;

    if (!token) {
      throw new Error(
        "Login succeeded, but authentication token was not received.",
      );
    }

    localStorage.setItem("token", token);

    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user),
      );
    }

    toast.success("Login successful!");

    const redirectPath =
      location.state?.from ||
      "/dashboard";

    navigate(redirectPath, {
      replace: true,
    });
  } catch (error) {
    const code = error.response?.data?.code;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unable to login. Please try again.";

    if (code === "EMAIL_NOT_VERIFIED") {
      setNeedsVerification(true);
    }

    setErrors({
      submit: message,
    });

    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }

    try {
      setIsResending(true);

      const data = await resendVerificationEmail(
        formData.email.trim().toLowerCase(),
      );

      toast.success(
        data?.message || "Verification email sent — please check your inbox.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Couldn't resend verification email. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleLogin = () => {
    toast(
      "Google login will be available soon.",
    );
  };

  return (
    <AuthLayout showcase={loginShowcaseData}>
      <div className="auth-form-heading">
        <span className="auth-form-label">
          Welcome back
        </span>

        <h2>Sign in to your account</h2>

        <p>
          Continue from where you left off and
          take your next career step.
        </p>
      </div>

      <button
        type="button"
        className="auth-google-button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
      >
        <FcGoogle />
        Continue with Google
      </button>

      {justRegistered && (
        <p className="auth-info-banner">
          Account created! Please check <strong>{registeredEmail}</strong> for
          a verification link before signing in.
        </p>
      )}

      <div className="auth-divider">
        <span />
        <p>or continue with email</p>
        <span />
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthInput
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={FiMail}
          error={errors.email}
          disabled={isSubmitting}
          onChange={handleChange}
        />

        <AuthInput
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={FiLock}
          error={errors.password}
          disabled={isSubmitting}
          onChange={handleChange}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword(
              (previousValue) =>
                !previousValue,
            )
          }
          labelAction={
            <Link
              to="/forgot-password"
              className="login-forgot-link"
            >
              Forgot password?
            </Link>
          }
        />

        <label className="auth-checkbox-option">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <span className="auth-custom-checkbox">
            <FiCheckCircle />
          </span>

          <span>
            Keep me signed in on this device
          </span>
        </label>

        {errors.submit && (
          <span className="auth-error-message">
            {errors.submit}
          </span>
        )}

        {needsVerification && (
          <button
            type="button"
            className="auth-resend-link"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        )}

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Signing in..."
            : "Sign in"}

          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="auth-switch-text">
        New to CareerPilot?{" "}
        <Link to="/register">
          Create your free account
        </Link>
      </p>

      <p className="auth-terms-text">
        By continuing, you agree to our
        <Link to="/terms">
          {" "}
          Terms of Service{" "}
        </Link>
        and
        <Link to="/privacy">
          {" "}
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
};

export default Login;