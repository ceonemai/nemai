import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => window.scrollTo(0, 0)}>
        <img src={logo} alt="Nemai Logo" />
      </div>

      <ul className="nav-links">
        <li>Product</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <button className="nav-btn">Get Started</button>
    </nav>
  );
}

export default Navbar;