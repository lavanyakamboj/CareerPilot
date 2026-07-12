import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

const footerGroups = [
  {
    title: "Product",
    links: [
      {
        label: "Resume Analysis",
        href: "#ai-tools",
      },
      {
        label: "Career Roadmap",
        href: "#ai-tools",
      },
      {
        label: "Interview Prep",
        href: "#ai-tools",
      },
      {
        label: "Job Match",
        href: "#ai-tools",
      },
    ],
  },
  {
    title: "Explore",
    links: [
      {
        label: "Features",
        href: "#features",
      },
      {
        label: "How it works",
        href: "#how-it-works",
      },
      {
        label: "About",
        href: "#about",
      },
    ],
  },
  {
    title: "Account",
    links: [
      {
        label: "Log in",
        href: "/login",
        isRoute: true,
      },
      {
        label: "Create account",
        href: "/register",
        isRoute: true,
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Link to="/" className="brand footer-brand">
              <span className="brand-icon">
                <LuSparkles />
              </span>

              <span className="brand-name">
                CareerPilot
                <span>AI</span>
              </span>
            </Link>

            <p>
              A connected AI career workspace created to help students and
              freshers move forward with clarity.
            </p>

            <a href="#features" className="footer-product-link">
              Explore the platform
              <FiArrowUpRight />
            </a>
          </div>

          <div className="footer-links-grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="footer-link-group">
                <h3>{group.title}</h3>

                {group.links.map((link) =>
                  link.isRoute ? (
                    <Link key={link.label} to={link.href}>
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareerPilot AI. Built for better career decisions.</p>

          <div className="footer-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;