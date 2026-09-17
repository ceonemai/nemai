import { useState } from "react";
import "./Hero.css";
import mascot from "../../assets/images/mascots/Mascott NEM-85.png";
import glassLogo from "../../assets/images/LogogramFullColor.png";
import lineImage from "../../assets/images/line2.png";
import EarlyAccessPopup from "../EarlyAccessPopup/EarlyAccessPopup";

function Hero() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section
      className="hero"
      style={{ "--glass-bg": `url(${glassLogo})` }}
    >

      <div className="hero-content">
        <h1>
          Your Personal AI<br />
          <span className="hero-subtitle">for Health & Emergencies</span>
        </h1>

        <p className="hero-tagline">
          <span className="act"> We give you clear steps in emergencies and everyday health answers tailored exactly to your body. </span>
        </p>
      
        {/*
        <div className="hero-buttons">
          <button className="primary" onClick={() => setShowPopup(true)}>
            Get Early Access
          </button>
        </div>
        */}
      </div>

      {/* Decorative Line */}
      <div className="hero-line-wrap">
        <img src={lineImage} alt="NEM AI Health Journey" className="hero-line" />
      </div>

      {/* Nem Background Mascot */}
      <img src={mascot} alt="Nemai Mascot" className="hero-mascot" />

      {showPopup && <EarlyAccessPopup onClose={() => setShowPopup(false)} />}
    </section>
  );
}

export default Hero;