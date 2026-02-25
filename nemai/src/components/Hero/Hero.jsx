import { useState } from "react";
import "./Hero.css";
import mascot from "../../assets/images/mascots/Mascott NEM-85.png";
import EarlyAccessPopup from "../EarlyAccessPopup/EarlyAccessPopup";

function Hero() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section className="hero">

      <div className="hero-content">
        <h1>
          First Personalized AI Emergency <br />
          Decision Support
        </h1>

        <p>Act Smart. Save Countless Lives</p>

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