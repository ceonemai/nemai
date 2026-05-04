import "./Navbar.css";
import logo from "../../assets/images/NEM_LOGO.png";
import discordIcon from "../../assets/images/icons/discord.svg";
import xIcon from "../../assets/images/icons/x.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
     HANDLE CROSS-PAGE SCROLL
  ========================= */

  useEffect(() => {
    // ตรวจสอบว่าถ้ากลับมาหน้า Home และมี hash (เช่น /#why) ให้เลื่อนไปที่ section นั้น
    if (location.pathname === "/" && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // ดีเลย์เล็กน้อยเพื่อให้ Component ของหน้า Home เรนเดอร์เสร็จก่อน
    }
  }, [location]);

  /* =========================
     SMOOTH SCROLL
  ========================= */

  const scrollToSection = (id) => {

    // ถ้าไม่ได้อยู่หน้า Home ให้เปลี่ยนหน้าไป Home ก่อน
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

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

        <button
          className="nav-btn"
          // disabled={import.meta.env.PROD}
          onClick={() => {
            // ใช้ VITE_APP_URL จาก env (ตอน Deploy) หรือ fallback ไปที่ localhost (สำหรับ Local)
            const redirectUrl = import.meta.env.VITE_APP_URL || "http://localhost:5174";
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