import React from "react";
import "./Footer.css";
import nemLogo from "../../assets/images/NEM_LOGO_ALT.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";


export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault(); // กัน refresh เฉยๆ ยังไม่ต่อ backend
  };

  return (
    <footer className="footer">
      <div className="footer-top">

        {/* LEFT SIDE */}
        <div className="footer-left">
          <h2>
            Empower emergency response<br />
            with intelligent real-time AI.
          </h2>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          <p className="subscribe-label">Subscribe to stay updated</p>
          <form onSubmit={handleSubmit} className="subscribe-form">
            <input
              type="email"
              placeholder="Email *"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">

        {/* LOGO */}
        <div className="footer-brand">
          <img src={nemLogo} alt="NEM AI logo" />
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <a href="#">Docs</a>
          <a href="#">Product</a>
          <a href="#">Contact</a>
        </div>
        {/* SOCIAL */}
        <div className="footer-socials">

          <a href="https://x.com/nemai_io" className="social-icon" aria-label="X">
            <img src={xIcon} alt="X" />
          </a>

          <a href="https://discord.gg/xdeUYtwnnb" className="social-icon discord-white" aria-label="Discord">
            <img src={discordIcon} alt="Discord" />
          </a>

        </div>

      </div>

      <div className="footer-copyright">
        © 2026 NEM AI
      </div>
    </footer>
  );
}