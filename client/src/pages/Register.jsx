import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiTarget,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import logo from "../assets/images/logo.png";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/register.css";
import "../styles/auth/common/auth-responsive.css";

const registerBenefits = [
  {
    icon: FiTarget,
    title: "Create your career profile",
    description:
      "Add your skills, resume and goals to receive personalized guidance.",
  },
  {
    icon: FiBarChart2,
    title: "Understand your progress",
    description:
      "Track resume scores, missing skills and preparation improvements.",
  },
  {
    icon: FiTrendingUp,
    title: "Prepare for better opportunities",
    description:
      "Build a clear roadmap for jobs, interviews and career growth.",
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Please accept the Terms and Privacy Policy.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const registerData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    console.log("Register form data:", registerData);

    // Backend register API will be connected later.
  };

  const handleGoogleRegister = () => {
    console.log("Google registration clicked");

    // Google authentication will be connected later.
  };

  return (
    <main className="auth-page">
      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />
      <div className="auth-background-grid" />

      <section className="auth-shell">
        <div className="auth-showcase">
          <div className="auth-showcase-header">
            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                <img
                  src={logo}
                  alt="CareerPilot"
                  className="auth-logo-image"
                />
              </span>

              <span className="auth-brand-name">
                CareerPilot
                <span>AI</span>
              </span>
            </Link>

            <Link to="/" className="auth-back-link">
              <FiArrowLeft />
              Back to home
            </Link>
          </div>

          <div className="auth-showcase-content">
            <div className="auth-eyebrow">
              <FiCheckCircle />
              Start your career journey
            </div>

            <h1>
              Turn your career goals into
              <span> a clear action plan.</span>
            </h1>

            <p className="auth-showcase-description">
              Create your account to improve your resume, identify skill gaps
              and prepare confidently for the right opportunities.
            </p>

            <div className="auth-benefits">
              {registerBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article className="auth-benefit-card" key={benefit.title}>
                    <span className="auth-benefit-icon">
                      <Icon />
                    </span>

                    <div>
                      <h2>{benefit.title}</h2>
                      <p>{benefit.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="auth-progress-card">
              <div className="auth-progress-header">
                <div>
                  <span>Your journey</span>
                  <strong>Starts here</strong>
                </div>

                <span className="auth-progress-score">01</span>
              </div>

              <div className="auth-progress-track">
                <span />
              </div>

              <div className="auth-progress-footer">
                <span>Profile</span>
                <span>Resume</span>
                <span>Roadmap</span>
              </div>
            </div>
          </div>

          <p className="auth-showcase-footer">
            CareerPilot AI supports your decisions with practical guidance,
            while your career choices always remain yours.
          </p>
        </div>

        <div className="auth-form-section">
          <div className="auth-mobile-header">
            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                <img
                  src={logo}
                  alt="CareerPilot"
                  className="auth-logo-image"
                />
              </span>

              <span className="auth-brand-name">
                CareerPilot
                <span>AI</span>
              </span>
            </Link>

            <Link
              to="/"
              className="auth-mobile-back"
              aria-label="Back to home"
            >
              <FiArrowLeft />
            </Link>
          </div>

          <div className="auth-form-container auth-form-container-wide">
            <div className="auth-form-heading">
              <span className="auth-form-label">Create account</span>

              <h2>Start your journey today</h2>

              <p>
                Create your free account and build a clearer path towards your
                career goals.
              </p>
            </div>

            <button
              type="button"
              className="auth-google-button"
              onClick={handleGoogleRegister}
            >
              <FcGoogle />
              Continue with Google
            </button>

            <div className="auth-divider">
              <span />
              <p>or register with email</p>
              <span />
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form-group">
                <label htmlFor="name">Full name</label>

                <div
                  className={`auth-input-wrapper ${
                    errors.name ? "auth-input-error" : ""
                  }`}
                >
                  <FiUser className="auth-input-icon" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>

                {errors.name && (
                  <span className="auth-error-message">{errors.name}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="email">Email address</label>

                <div
                  className={`auth-input-wrapper ${
                    errors.email ? "auth-input-error" : ""
                  }`}
                >
                  <FiMail className="auth-input-icon" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <span className="auth-error-message">{errors.email}</span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">Password</label>

                <div
                  className={`auth-input-wrapper ${
                    errors.password ? "auth-input-error" : ""
                  }`}
                >
                  <FiLock className="auth-input-icon" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((previousValue) => !previousValue)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.password ? (
                  <span className="auth-error-message">{errors.password}</span>
                ) : (
                  <span className="register-password-hint">
                    Use at least 6 characters.
                  </span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="confirmPassword">Confirm password</label>

                <div
                  className={`auth-input-wrapper ${
                    errors.confirmPassword ? "auth-input-error" : ""
                  }`}
                >
                  <FiLock className="auth-input-icon" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previousValue) => !previousValue,
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="auth-error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="auth-form-group">
                <label className="auth-checkbox-option register-terms-option">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />

                  <span className="auth-custom-checkbox">
                    <FiCheckCircle />
                  </span>

                  <span>
                    I agree to the
                    <Link to="/terms"> Terms of Service </Link>
                    and
                    <Link to="/privacy"> Privacy Policy</Link>.
                  </span>
                </label>

                {errors.acceptTerms && (
                  <span className="auth-error-message">
                    {errors.acceptTerms}
                  </span>
                )}
              </div>

              <button type="submit" className="auth-submit-button">
                Create account
                <FiArrowRight />
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;

