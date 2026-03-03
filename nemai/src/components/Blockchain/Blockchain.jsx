import { useEffect, useRef } from "react";
import "./Blockchain.css";

export default function Blockchain() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          el.classList.remove("leaving");
        } else {
          if (entry.boundingClientRect.top < 0) {
            el.classList.remove("visible");
            el.classList.add("leaving");
          } else {
            el.classList.remove("visible");
            el.classList.remove("leaving");
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="blockchain-section" ref={sectionRef}>
      <div className="blockchain-grid">
        
        {/* ===== LEFT VISUAL ===== */}
        <div className="blockchain-visual">
          <div className="network">
            <div className="node main"></div>
            <div className="node small node-1"></div>
            <div className="node small node-2"></div>
            <div className="node small node-3"></div>
            <div className="connection-line line-1"></div>
            <div className="connection-line line-2"></div>
          </div>
        </div>

        {/* ===== RIGHT CONTENT ===== */}
        <div className="blockchain-content">
          <h2 className="blockchain-title">
            How NEM AI Leverages{" "}
            <span className="highlight">Blockchain & Web3</span>
          </h2>

          <p className="blockchain-sub">
            Blockchain serves as a trust and incentive layer.
          </p>

          <ul className="blockchain-points">
            <li>Records proof of submission and immutable timestamps</li>
            <li>Ensures transparency and prevents manipulation</li>
            <li>Enables full auditability across the ecosystem</li>
          </ul>

          <p className="blockchain-note">
            Medical data remains off-chain and encrypted. Blockchain anchors
            verifiable proof not patient records.
          </p>
        </div>

      </div>
    </section>
  );
}