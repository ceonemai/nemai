import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";
import { useEffect, useState } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <img src={logo} alt="Nemai Logo" />
      </div>

      <ul className="nav-links">
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("why").scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            About
          </a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

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

        <button className="nav-btn">Coming Soon</button>
      </div>
    </nav>
  );
}

export default Navbar;