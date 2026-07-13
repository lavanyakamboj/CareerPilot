import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";

import api from "../api/api";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

import useAuthForm from "../hooks/useAuthForm";

import {
  registerInitialValues,
  registerShowcaseData,
} from "../data/authData";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/register.css";
import "../styles/auth/common/auth-responsive.css";

const Register = () => {
  const navigate = useNavigate();

  const {
    formData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
  } = useAuthForm(registerInitialValues);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Full name is required.";
    } else if (
      formData.name.trim().length < 2
    ) {
      newErrors.name =
        "Please enter a valid name.";
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "Please accept the Terms and Privacy Policy.";
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

      const firstError =
        Object.values(validationErrors)[0];

      toast.error(firstError);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const registerData = {
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        password: formData.password,
      };

      const response = await api.post(
        "/auth/register",
        registerData,
      );

      toast.success(
        response.data?.message ||
          "Account created successfully. Please sign in.",
      );

      navigate("/login", {
        replace: true,
        state: {
          registeredEmail:
            registerData.email,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error,
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to create your account. Please try again.";

      setErrors((previousErrors) => ({
        ...previousErrors,
        submit: message,
      }));

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    toast(
      "Google registration will be available soon.",
    );
  };

  return (
    <AuthLayout
      showcase={registerShowcaseData}
      formContainerClassName="auth-form-container-wide"
    >
      <div className="auth-form-heading">
        <span className="auth-form-label">
          Create account
        </span>

        <h2>Start your journey today</h2>

        <p>
          Create your free account and build a
          clearer path towards your career goals.
        </p>
      </div>

      <button
        type="button"
        className="auth-google-button"
        onClick={handleGoogleRegister}
        disabled={isSubmitting}
      >
        <FcGoogle />
        Continue with Google
      </button>

      <div className="auth-divider">
        <span />
        <p>or register with email</p>
        <span />
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthInput
          name="name"
          label="Full name"
          type="text"
          value={formData.name}
          placeholder="Enter your full name"
          autoComplete="name"
          icon={FiUser}
          error={errors.name}
          disabled={isSubmitting}
          onChange={handleChange}
        />

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
          placeholder="Create a password"
          autoComplete="new-password"
          icon={FiLock}
          error={errors.password}
          hint="Use at least 6 characters."
          disabled={isSubmitting}
          onChange={handleChange}
          showPassword={showPassword}
          onTogglePassword={() =>
            setShowPassword(
              (previousValue) =>
                !previousValue,
            )
          }
        />

        <AuthInput
          name="confirmPassword"
          label="Confirm password"
          type="password"
          value={formData.confirmPassword}
          placeholder="Enter your password again"
          autoComplete="new-password"
          icon={FiLock}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          onChange={handleChange}
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword(
              (previousValue) =>
                !previousValue,
            )
          }
        />

        <div className="auth-form-group">
          <label className="auth-checkbox-option register-terms-option">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <span className="auth-custom-checkbox">
              <FiCheckCircle />
            </span>

            <span>
              I agree to the
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
            </span>
          </label>

          {errors.acceptTerms && (
            <span className="auth-error-message">
              {errors.acceptTerms}
            </span>
          )}
        </div>

        {errors.submit && (
          <span className="auth-error-message">
            {errors.submit}
          </span>
        )}

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}

          {!isSubmitting && <FiArrowRight />}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;