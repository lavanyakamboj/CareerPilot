import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

const FinalCTA = () => {
  return (
    <section className="section final-cta-section">
      <div className="container">
        <motion.div
          className="final-cta-card"
          initial={{
            opacity: 0,
            y: 28,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="cta-orb cta-orb-one" />
          <div className="cta-orb cta-orb-two" />

          <div className="final-cta-content">
            <span className="cta-icon">
              <LuSparkles />
            </span>

            <span className="section-kicker section-kicker-light">
              Start with your current resume
            </span>

            <h2>
              Know where you stand.
              <span> Improve what matters.</span>
            </h2>

            <p>
              Upload your resume to see what is working, what is missing and
              what you should focus on next.
            </p>

            <div className="final-cta-actions">
              <a href="/" className="button button-white button-large">
                Get started free
                <FiArrowRight />
              </a>

              <span className="cta-note">
                <FiCheck />
                Quick and easy to start
              </span>
            </div>
          </div>

          <div className="cta-mini-dashboard">
            <div className="cta-dashboard-top">
              <span>
                <LuSparkles />
                Your progress
              </span>

              <strong>Looking good</strong>
            </div>

            <div className="cta-dashboard-score">
              <div>
                <strong>82</strong>
                <span>/100</span>
              </div>

              <p>
                Your resume is already in a good place. Work on the next two
                suggestions to make it even stronger.
              </p>
            </div>

            <div className="cta-dashboard-tasks">
              <div>
                <span>
                  <FiCheck />
                </span>

                <p>Resume checked</p>
              </div>

              <div>
                <span>2</span>
                <p>Skills to work on</p>
              </div>

              <div>
                <span>3</span>
                <p>Roles that match</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;