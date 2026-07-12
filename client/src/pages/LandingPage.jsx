import React from "react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/landing/HeroSection";
import TrustSection from "../components/landing/TrustSection";
import HowItWorks from "../components/landing/HowItWorks";
import ToolsBento from "../components/landing/ToolsBento";
import FinalCTA from "../components/landing/FinalCTA";

import "../styles/landing/navbar.css";
import "../styles/landing/hero.css";
import "../styles/landing/trust.css";
import "../styles/landing/howItWorks.css";
import "../styles/landing/toolsBento.css";
import "../styles/landing/finalCTA.css";
import "../styles/landing/footer.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <main>
        <HeroSection />
        <TrustSection />
        <HowItWorks />
        <ToolsBento />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;