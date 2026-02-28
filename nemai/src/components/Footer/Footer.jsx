import React, { useState } from "react";
import "./Footer.css";
import nemLogo from "../../assets/images/NEM_LOGO_ALT.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";


export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [isHiding, setIsHiding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");
    setIsHiding(false);

    try {
      // NOTE: Using text/plain to avoid CORS preflight (OPTIONS request) with Google Apps Script
      const response = await fetch("https://script.google.com/macros/s/AKfycbzmyQ91Gu4v-HEt-g6rAz9eVVDKeY9cmOedfkF28vswfZOUG-6Kap068bgMP3qHe8PHSw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.responseCode === 409 || data.status === "duplicate") {
        setStatus("error");
        setMessage(data.message || "Email already subscribed");
      } else if (data.responseCode === 400) {
        setStatus("error");
        setMessage(data.message || "Invalid request");
      } else if (data.responseCode === 500) {
        setStatus("error");
        setMessage(data.message || "Internal server error. Please try again later.");
      } else if (data.responseCode === 200 || data.status === "success" || response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }

      // Hide message after 5 seconds
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setMessage("");
          setStatus("idle");
          setIsHiding(false);
        }, 300);
      }, 5000);

    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");

      // Hide message after 5 seconds
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setMessage("");
          setStatus("idle");
          setIsHiding(false);
        }, 300);
      }, 5000);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              required
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <div className={`subscribe-message ${status} ${isHiding ? "hiding" : ""}`}>
              {message}
            </div>
          )}
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