import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <img src={logo} alt="Nemai Logo" />
      </div>

      <ul className="nav-links">
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="nav-right">
                <a
          href="https://x.com/yourlink"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img src={xIcon} alt="X" />
        </a>

        <a
          href="https://discord.gg/yourlink"
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