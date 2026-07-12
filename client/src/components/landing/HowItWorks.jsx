import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiCheck,
  FiFileText,
  FiMap,
  FiUploadCloud,
} from "react-icons/fi";

const steps = [
  {
    number: "01",
    icon: FiUploadCloud,
    title: "Upload your resume",
    description:
      "Add your latest resume so CareerPilot can check your education, projects and skills.",
  },
  {
    number: "02",
    icon: FiFileText,
    title: "See what needs work",
    description:
      "Get your resume score, missing keywords, matching roles and clear suggestions to improve.",
  },
  {
    number: "03",
    icon: FiMap,
    title: "Start improving",
    description:
      "Follow your roadmap, use the recommended resources and practise for interviews.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container how-container">
        <div className="how-content">
          <div className="section-heading">
            <span className="section-kicker">Easy to get started</span>

            <h2>
              Not sure what to do next?
              <span> Start with your resume.</span>
            </h2>

            <p>
              Upload your resume once and use the same profile for analysis,
              career planning and interview preparation.
            </p>
          </div>

          <div className="how-benefits">
            <span>
              <FiCheck />
              Quick and simple setup
            </span>

            <span>
              <FiCheck />
              Suggestions based on your resume
            </span>

            <span>
              <FiCheck />
              Update it whenever you improve
            </span>
          </div>

          <a href="#ai-tools" className="button button-dark button-large">
            Explore CareerPilot
            <FiArrowDown />
          </a>
        </div>

        <div className="steps-wrapper">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                className="step-row"
                initial={{
                  opacity: 0,
                  x: 25,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.35,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <div className="step-line-area">
                  <span className="step-number">{step.number}</span>

                  {index !== steps.length - 1 && <span className="step-line" />}
                </div>

                <article className="step-card">
                  <span className="step-icon">
                    <Icon />
                  </span>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;