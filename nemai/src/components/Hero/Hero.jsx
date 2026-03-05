import { useState } from "react";
import "./Hero.css";
import mascot from "../../assets/images/mascots/Mascott NEM-85.png";
import glassLogo from "../../assets/images/LogogramFullColor.png";
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
          First Personalized Health AI Support
        </h1>

        <p className="hero-tagline">
          <span className="act">Act Smart. Save Countless Lives </span>
        </p>

        <div className="hero-buttons">
          <button className="primary" onClick={() => setShowPopup(true)}>
            Get Early Access
          </button>
        </div>
      </div>

      {/* Nem Background Mascot */}
      <img src={mascot} alt="Nemai Mascot" className="hero-mascot" />

      {showPopup && <EarlyAccessPopup onClose={() => setShowPopup(false)} />}
    </section>
  );
}

export default Hero;