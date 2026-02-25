import "./Hero.css";
import mascot from "../../assets/images/mascots/Mascott NEM-85.png";

function Hero() {
  return (
    <section className="hero">

    <div className="hero-content">
        <h1>
        First Personalized AI Emergency <br />
        Decision Support
        </h1>

        <p>Act Smart. Save Countless Lives</p>

        <div className="hero-buttons">
        <button className="primary">Get Early Access</button>
        </div>
    </div>

    {/* Nem Background Mascot */}
    <img src={mascot} alt="Nemai Mascot" className="hero-mascot" />
    </section>
  );
}

export default Hero;