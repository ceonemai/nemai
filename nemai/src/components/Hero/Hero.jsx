import "./Hero.css";
import logo from "../../assets/images/NEM_LOGO.png";

function Hero() {
  return (
    <section className="hero">
    <img src={logo} alt="Nemai Logo" className="hero-bg-logo" />

    <div className="hero-content">
        <h1>
        AI-Powered <br />
        Health Support
        </h1>

        <p>Nemai JUST NEM IT</p>

        <div className="hero-buttons">
        <button className="primary">Start Now</button>
        <button className="secondary">Learn More</button>
        </div>
    </div>
    </section>
  );
}

export default Hero;