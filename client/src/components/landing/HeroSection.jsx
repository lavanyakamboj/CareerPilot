import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiFileText,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { LuSparkles, LuWandSparkles } from "react-icons/lu";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />

      <div className="container hero-container">
        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <div className="eyebrow">
            <LuSparkles />
            Your AI guide for placements
          </div>

          <h1>
            Make your resume work
            <span> harder for you.</span>
          </h1>

          <p className="hero-description">
            Upload your resume and see what is good, what is missing and what
            you should improve before applying for jobs.
          </p>

          <div className="hero-actions">
            <a href="#ai-tools" className="button button-primary button-large">
              Check my resume
              <FiArrowRight />
            </a>

            <a
              href="#how-it-works"
              className="button button-secondary button-large"
            >
              See how it works
            </a>
          </div>

          <div className="hero-highlights">
            <span>
              <FiCheck />
              Made for students
            </span>

            <span>
              <FiCheck />
              Tips based on your resume
            </span>

            <span>
              <FiCheck />
              Everything in one place
            </span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.15,
            ease: "easeOut",
          }}
        >
          <div className="preview-decoration preview-decoration-one" />
          <div className="preview-decoration preview-decoration-two" />

          <div className="product-preview">
            <div className="preview-header">
              <div className="preview-user">
                <div className="preview-avatar">LK</div>

                <div>
                  <p>Your resume</p>
                  <span>Frontend Developer</span>
                </div>
              </div>

              <span className="preview-live">
                <LuSparkles />
                Analysis ready
              </span>
            </div>

            <div className="preview-score-card">
              <div className="score-ring">
                <div>
                  <strong>82</strong>
                  <span>/100</span>
                </div>
              </div>

              <div className="score-details">
                <span className="mini-label">Resume score</span>
                <h3>Your resume is already in a good place.</h3>
                <p>
                  Add the missing keywords and show clearer results in your
                  projects to improve it further.
                </p>

                <div className="score-progress">
                  <span style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            <div className="preview-grid">
              <div className="preview-stat-card">
                <span className="stat-icon purple">
                  <FiTarget />
                </span>

                <div>
                  <p>Best role match</p>
                  <strong>Frontend Developer</strong>
                </div>
              </div>

              <div className="preview-stat-card">
                <span className="stat-icon blue">
                  <FiTrendingUp />
                </span>

                <div>
                  <p>Skill to work on</p>
                  <strong>System Design</strong>
                </div>
              </div>
            </div>

            <div className="preview-suggestion">
              <span className="suggestion-icon">
                <LuWandSparkles />
              </span>

              <div>
                <p>Next suggestion</p>
                <strong>
                  Add numbers and results to your project descriptions.
                </strong>
              </div>

              <FiArrowRight />
            </div>
          </div>

          <motion.div
            className="floating-card floating-card-left"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span>
              <FiFileText />
            </span>

            <div>
              <p>ATS keywords</p>
              <strong>12 found</strong>
            </div>
          </motion.div>

          <motion.div
            className="floating-card floating-card-right"
            animate={{
              y: [0, 9, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span>
              <FiTrendingUp />
            </span>

            <div>
              <p>Score improved by</p>
              <strong>18 points</strong>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;