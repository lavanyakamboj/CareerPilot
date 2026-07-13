import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";

import logo from "../../assets/images/logo.png";

const AuthBrand = () => {
  return (
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
  );
};

const AuthLayout = ({
  showcase,
  children,
  formContainerClassName = "",
}) => {
  const {
    eyebrow,
    title,
    highlightedTitle,
    description,
    benefits,
    progress,
    footer,
  } = showcase;

  return (
    <main className="auth-page">
      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />
      <div className="auth-background-grid" />

      <section className="auth-shell">
        <div className="auth-showcase">
          <div className="auth-showcase-header">
            <AuthBrand />

            <Link to="/" className="auth-back-link">
              <FiArrowLeft />
              Back to home
            </Link>
          </div>

          <div className="auth-showcase-content">
            <div className="auth-eyebrow">
              <FiCheckCircle />
              {eyebrow}
            </div>

            <h1>
              {title}
              <span> {highlightedTitle}</span>
            </h1>

            <p className="auth-showcase-description">
              {description}
            </p>

            <div className="auth-benefits">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    className="auth-benefit-card"
                    key={benefit.title}
                  >
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
                  <span>{progress.label}</span>
                  <strong>{progress.title}</strong>
                </div>

                <span className="auth-progress-score">
                  {progress.score}
                </span>
              </div>

              <div className="auth-progress-track">
                <span />
              </div>

              <div className="auth-progress-footer">
                {progress.steps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="auth-showcase-footer">
            {footer}
          </p>
        </div>

        <div className="auth-form-section">
          <div className="auth-mobile-header">
            <AuthBrand />

            <Link
              to="/"
              className="auth-mobile-back"
              aria-label="Back to home"
            >
              <FiArrowLeft />
            </Link>
          </div>

          <div
            className={[
              "auth-form-container",
              formContainerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;