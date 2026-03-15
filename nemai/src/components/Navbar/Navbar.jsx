import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";
import { useEffect, useState } from "react";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  /* =========================
     SMOOTH SCROLL
  ========================= */

  const scrollToSection = (id) => {

    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  };

  return (

    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

      {/* LOGO */}

      <div
        className="logo"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
      >
        <img src={logo} alt="NEM AI Logo" />
      </div>

      {/* NAV LINKS (DESKTOP) */}

      <ul className="nav-links">

        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("why");
            }}
          >
            About
          </a>
        </li>

        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("mission");
            }}
          >
            Mission
          </a>
        </li>

        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("backbone");
            }}
          >
            Goal
          </a>
        </li>

        <li>
          <a
            href="https://nem-ai.gitbook.io/doc#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </li>

      </ul>

      {/* RIGHT SIDE */}

      <div className="nav-right">

        <a
          href="https://x.com/nemai_io"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img src={xIcon} alt="X" />
        </a>

        <a
          href="https://discord.gg/xdeUYtwnnb"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img src={discordIcon} alt="Discord" />
        </a>

        {/* MOBILE DOCS */}
        <a
          href="https://nem-ai.gitbook.io/doc#"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-docs"
        >
          Docs
        </a>

        <button className="nav-btn">
          Coming Soon
        </button>

      </div>

    </nav>

  );

}

export default Navbar;