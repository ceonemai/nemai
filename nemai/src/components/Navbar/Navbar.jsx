import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

  return (

    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

      {/* LOGO */}

      <div
        className="logo"
        onClick={() => {
          if (location.pathname !== "/") {
            navigate("/");
            window.scrollTo(0, 0); // กลับหน้า Home แล้วขึ้นบนสุด
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" }); // ถ้าอยู่ Home เลื่อนขึ้นบนสุดนุ่มๆ
          }
        }}
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
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
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
              navigate("/blog");
            }}
          >
            Blog
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

      <button
        type="button"
        className={`mobile-menu-toggle ${isMobileMenuOpen ? "open" : ""}`}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-nav-menu"
        onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* RIGHT SIDE */}

      <div
        className={`nav-right ${isMobileMenuOpen ? "open" : ""}`}
        id="mobile-nav-menu"
      >

        <div className="mobile-social-row">
          <a
            href="https://x.com/nemai_io"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            onClick={closeMobileMenu}
          >
            <img src={xIcon} alt="X" />
          </a>

          <a
            href="https://discord.gg/xdeUYtwnnb"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            onClick={closeMobileMenu}
          >
            <img src={discordIcon} alt="Discord" />
          </a>
        </div>

        {/* MOBILE MENU LINKS */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeMobileMenu();
          }}
          className="mobile-about"
        >
          About
        </a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/blog");
            closeMobileMenu();
          }}
          className="mobile-blog"
        >
          Blog
        </a>

        <a
          href="https://nem-ai.gitbook.io/doc#"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-docs"
          onClick={closeMobileMenu}
        >
          Docs
        </a>

        <div className="mobile-menu-divider" aria-hidden="true"></div>

        <button
          className="nav-btn"
          // disabled={import.meta.env.PROD}
          onClick={() => {
            // ใช้ VITE_APP_URL จาก env (ตอน Deploy) หรือ fallback ไปที่ localhost (สำหรับ Local)
            const redirectUrl = import.meta.env.VITE_APP_URL || "http://localhost:5174";
            closeMobileMenu();
            window.open(redirectUrl, "_blank");
          }}
        >
          Go to App
        </button>

      </div>

    </nav>

  );

}

export default Navbar;