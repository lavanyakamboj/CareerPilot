import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import logo from "../../assets/images/logo.png";

const navLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "AI Tools",
    href: "#ai-tools",
  },
  {
    label: "About",
    href: "#about",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`navbar-wrapper ${isScrolled ? "navbar-scrolled" : ""}`}
    >
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">
            <img
              src={logo}
              alt="CareerPilot"
              className="logo-image"
            />
          </span>

          <span className="brand-name">
            CareerPilot
            <span>AI</span>
          </span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login">
            Log in
          </Link>

          <Link to="/register" className="button button-primary navbar-cta">
            Get started
            <FiArrowUpRight />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen((previousValue) => !previousValue)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-content container">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}

          <div className="mobile-menu-actions">
            <Link
              to="/login"
              className="button button-secondary"
              onClick={closeMenu}
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="button button-primary"
              onClick={closeMenu}
            >
              Get started
              <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;