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
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import logo from "../assets/images/logo.png";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/login.css";
import "../styles/auth/common/auth-responsive.css";

const loginBenefits = [
  {
    icon: FiTarget,
    title: "Personalized career guidance",
    description:
      "Get recommendations based on your resume, skills and career goals.",
  },
  {
    icon: FiBarChart2,
    title: "Track your improvement",
    description:
      "Monitor resume scores, skill gaps and overall career progress.",
  },
  {
    icon: FiTrendingUp,
    title: "Move forward with clarity",
    description:
      "Know exactly what to improve and which opportunity to target next.",
  },
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
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

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Login form data:", formData);

    // Backend login API will be connected later.
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");

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
              Your career workspace
            </div>

            <h1>
              Build a career path that feels
              <span> clear and achievable.</span>
            </h1>

            <p className="auth-showcase-description">
              Sign in to continue improving your resume, preparing for
              interviews and discovering the right opportunities.
            </p>

            <div className="auth-benefits">
              {loginBenefits.map((benefit) => {
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
                  <span>Career readiness</span>
                  <strong>Keep growing</strong>
                </div>

                <span className="auth-progress-score">82%</span>
              </div>

              <div className="auth-progress-track">
                <span />
              </div>

              <div className="auth-progress-footer">
                <span>Resume</span>
                <span>Skills</span>
                <span>Interview</span>
              </div>
            </div>
          </div>

          <p className="auth-showcase-footer">
            CareerPilot AI helps you make better career decisions while keeping
            you in control.
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

          <div className="auth-form-container">
            <div className="auth-form-heading">
              <span className="auth-form-label">Welcome back</span>

              <h2>Sign in to your account</h2>

              <p>
                Continue from where you left off and take your next career
                step.
              </p>
            </div>

            <button
              type="button"
              className="auth-google-button"
              onClick={handleGoogleLogin}
            >
              <FcGoogle />
              Continue with Google
            </button>

            <div className="auth-divider">
              <span />
              <p>or continue with email</p>
              <span />
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                <div className="auth-label-row">
                  <label htmlFor="password">Password</label>

                  <Link to="/forgot-password" className="login-forgot-link">
                    Forgot password?
                  </Link>
                </div>

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

                {errors.password && (
                  <span className="auth-error-message">{errors.password}</span>
                )}
              </div>

              <label className="auth-checkbox-option">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />

                <span className="auth-custom-checkbox">
                  <FiCheckCircle />
                </span>

                <span>Keep me signed in on this device</span>
              </label>

              <button type="submit" className="auth-submit-button">
                Sign in
                <FiArrowRight />
              </button>
            </form>

            <p className="auth-switch-text">
              New to CareerPilot?
              <Link to="/register">Create your free account</Link>
            </p>

            <p className="auth-terms-text">
              By continuing, you agree to our
              <Link to="/terms"> Terms of Service </Link>
              and
              <Link to="/privacy"> Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;