import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiBriefcase,
  FiEdit3,
  FiFileText,
  FiMessageSquare,
  FiTarget,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

const ToolsBento = () => {
  return (
    <section className="section tools-section" id="ai-tools">
      <div className="container">
        <div className="section-heading tools-heading">
          <div>
            <span className="section-kicker">Everything in one place</span>

            <h2>
              One resume.
              <span> All the tools you need.</span>
            </h2>
          </div>

          <p>
            Upload your resume once and use it for analysis, interview practice,
            career planning and more.
          </p>
        </div>

        <div className="bento-grid">
          <motion.article
            className="bento-card bento-analysis"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div className="bento-card-content">
              <span className="bento-icon">
                <FiFileText />
              </span>

              <span className="bento-tag">Resume analysis</span>

              <h3>See what recruiters may notice in your resume.</h3>

              <p>
                Check your ATS score, strong points, weak areas, missing skills
                and roles that match your profile.
              </p>

              <a href="/" className="bento-link">
                Check resume
                <FiArrowUpRight />
              </a>
            </div>

            <div className="analysis-widget">
              <div className="analysis-widget-header">
                <span>Resume strength</span>
                <strong>82%</strong>
              </div>

              <div className="analysis-bars">
                <div>
                  <span>Skills</span>
                  <i>
                    <b style={{ width: "88%" }} />
                  </i>
                </div>

                <div>
                  <span>Projects</span>
                  <i>
                    <b style={{ width: "76%" }} />
                  </i>
                </div>

                <div>
                  <span>Keywords</span>
                  <i>
                    <b style={{ width: "68%" }} />
                  </i>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-job-match"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
            }}
          >
            <div className="bento-small-header">
              <span className="bento-icon">
                <FiTarget />
              </span>

              <FiArrowUpRight />
            </div>

            <span className="bento-tag">Job match</span>

            <h3>See how well your resume matches a job.</h3>

            <div className="match-widget">
              <div className="match-score">
                <strong>74%</strong>
                <span>match</span>
              </div>

              <div>
                <span>React.js</span>
                <span>REST APIs</span>
                <span>Git</span>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-roadmap"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: 0.16,
            }}
          >
            <div className="roadmap-content">
              <span className="bento-icon">
                <FiBookOpen />
              </span>

              <span className="bento-tag">Career roadmap</span>

              <h3>Know what to learn and what to do next.</h3>

              <p>
                Get a step-by-step plan with the skills, projects and interview
                preparation needed for your target role.
              </p>
            </div>

            <div className="roadmap-preview">
              <div className="roadmap-stage roadmap-stage-active">
                <span>01</span>
                <div>
                  <p>Learn now</p>
                  <strong>Advanced React</strong>
                </div>
              </div>

              <div className="roadmap-connector" />

              <div className="roadmap-stage">
                <span>02</span>
                <div>
                  <p>Learn next</p>
                  <strong>Backend integration</strong>
                </div>
              </div>

              <div className="roadmap-connector" />

              <div className="roadmap-stage">
                <span>03</span>
                <div>
                  <p>Your goal</p>
                  <strong>Full Stack role</strong>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-interview"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
            }}
          >
            <div className="bento-small-header">
              <span className="bento-icon">
                <FiMessageSquare />
              </span>

              <FiArrowUpRight />
            </div>

            <span className="bento-tag">Interview practice</span>

            <h3>Practice questions based on your own resume.</h3>

            <div className="question-preview">
              <LuSparkles />
              Explain how you handled API integration in your project.
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-cover-letter"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <div className="bento-small-header">
              <span className="bento-icon">
                <FiEdit3 />
              </span>

              <FiArrowUpRight />
            </div>

            <span className="bento-tag">Cover letter</span>

            <h3>Create a cover letter for the job you want.</h3>

            <div className="letter-lines">
              <span />
              <span />
              <span />
              <span />
            </div>
          </motion.article>

          <motion.article
            className="bento-card bento-roles"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: 0.24,
            }}
          >
            <div className="bento-small-header">
              <span className="bento-icon">
                <FiBriefcase />
              </span>

              <FiArrowUpRight />
            </div>

            <span className="bento-tag">Role suggestions</span>

            <h3>Find roles that match your current skills.</h3>

            <div className="role-chips">
              <span>Frontend</span>
              <span>Full Stack</span>
              <span>UI Developer</span>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default ToolsBento;