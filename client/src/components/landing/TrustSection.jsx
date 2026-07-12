import React from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiShield,
} from "react-icons/fi";

const trustItems = [
  {
    icon: FiCheckCircle,
    title: "Clear suggestions",
    description: "See what to improve without confusing or generic advice.",
  },
  {
    icon: FiCompass,
    title: "Made for students",
    description: "Helpful for freshers, internships and placement preparation.",
  },
  {
    icon: FiLayers,
    title: "Everything works together",
    description:
      "Your resume, roadmap, interview and role suggestions stay connected.",
  },
  {
    icon: FiShield,
    title: "You make the final choice",
    description: "AI gives suggestions, but your career decisions stay yours.",
  },
];

const TrustSection = () => {
  return (
    <section className="trust-section" id="about">
      <div className="container">
        <div className="trust-intro">
          <p>
            CareerPilot does not just show you more information. It helps you
            understand what to do next.
          </p>
        </div>

        <div className="trust-grid">
          {trustItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className="trust-item"
                initial={{
                  opacity: 0,
                  y: 18,
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
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <span className="trust-icon">
                  <Icon />
                </span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;