import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logomark from "../../assets/images/LogogramFullColor.png";
import DownloadCTA from "./DownloadCTA";
import PhoneCarousel from "./PhoneCarousel";
import MeetNEM from "../MeetNEM/MeetNEM";
import { capabilities, steps } from "./content";
import "./HomePage.css";

function ScreenshotPlaceholder({ label, variant = "" }) {
  return (
    <div className={`screen-placeholder ${variant}`} aria-label={`${label} screenshot placeholder`}>
      <div className="screen-placeholder-inner">
        <span className="screen-placeholder-icon" aria-hidden="true">✳</span>
        <span className="screen-placeholder-label">PRODUCT SCREENSHOT</span>
        <strong>{label}</strong>
        <span>Approved app image to be added</span>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <span className="home-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function MetricCard({ className, label, value, unit = "", decimals = 0 }) {
  const cardRef = useRef(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let isVisible = false;
    let observer;
    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
      setProgress(null);
    };
    const start = () => {
      if (timer !== undefined || !isVisible || document.hidden || motionPreference.matches) return;
      const startedAt = performance.now();
      const tick = () => {
        const elapsed = performance.now() - startedAt;
        const initial = Math.min(elapsed / 2200, 1);
        const oscillation = (elapsed - 2200) / 4000 * Math.PI * 2;
        setProgress(elapsed < 2200
          ? 1 - (1 - initial) ** 3
          : 0.95 + 0.05 * Math.cos(oscillation));
        timer = window.setTimeout(tick, 80);
      };
      tick();
    };
    const updateMotion = () => {
      if (motionPreference.matches || document.hidden || !isVisible) {
        stop();
      } else {
        start();
      }
    };
    motionPreference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.3);
        updateMotion();
      }, { threshold: 0.3 });
      observer.observe(cardRef.current);
    } else {
      isVisible = true;
      start();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      motionPreference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);

  const animatedValue = progress === null ? "" : (value * progress).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={cardRef} className={`hero-float-card ${className}`} role="img" aria-label={label}>
      {progress !== null && (
        <svg className="hero-card-number" viewBox="0 0 260 175" aria-hidden="true">
          <rect x="17" y="67" width="226" height="48" fill="#1e1e1e" />
          <text x="23" y="105">{animatedValue}{unit}</text>
        </svg>
      )}
    </div>
  );
}

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <main className="home">
      <section className="home-hero" id="hero">
        <div className="home-container hero-content">
          <div className="hero-copy">
            <h1>Your Personal AI<br /><em>for Health &amp; Emergencies</em></h1>
            <p>Meet NEM AI, Intelligence for Your Health. Personalized insights. Clearer perspectives. Smarter health decisions.</p>
            <div className="hero-actions">
              <DownloadCTA placement="hero" />
              <a className="text-link" href="#product">Explore NEM AI <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-motion-ring hero-motion-ring-one" aria-hidden="true" />
            <div className="hero-motion-ring hero-motion-ring-two" aria-hidden="true" />
            <div className="hero-card-position hero-card-left">
              <MetricCard className="hero-card-steps" label="Example app data: 7,584 daily steps." value={7584} />
            </div>
            <div className="hero-card-position hero-card-right">
              <MetricCard className="hero-card-activity" label="Example app data: 239 kilocalories of active energy." value={239} unit=" kcal" />
            </div>
            <div className="hero-card-position hero-card-upper">
              <MetricCard className="hero-card-distance" label="Example app data: 5.3 kilometers walking and running." value={5.3} unit=" km" decimals={1} />
            </div>
            <div className="hero-card-position hero-card-lower">
              <MetricCard className="hero-card-exercise" label="Example app data: 32 minutes of exercise." value={32} unit=" min" />
            </div>
            <div className="hero-phone-entrance">
              <PhoneCarousel />
            </div>
          </div>
        </div>
      </section>

      <MeetNEM />

      <section className="home-section product-section" id="product">
        <div className="home-container">
          <div className="section-intro">
            <SectionHeading eyebrow="01 / MEET NEM AI" title={<>A better understanding<br />starts with <em>you.</em></>}>
              Health is more than a single number. NEM AI is being built to bring your health context together, so the bigger picture can feel a little clearer.
            </SectionHeading>
            <span className="intro-mark" aria-hidden="true">✳</span>
          </div>
          <div className="product-feature">
            <div className="product-feature-copy">
              <span className="home-eyebrow">PERSONAL HEALTH, IN PERSPECTIVE</span>
              <h3>One place for a more personal picture.</h3>
              <p>From your health profile to the information you choose to connect, the experience is designed around the things that make your health yours.</p>
              <span className="review-label">Product details pending confirmation</span>
            </div>
            <div className="product-feature-visual">
              <ScreenshotPlaceholder label="Personal health dashboard" variant="wide-placeholder" />
            </div>
          </div>
          <div className="capability-heading">
            <div><span className="home-eyebrow">THE EXPERIENCE</span><h3>Designed around your health.</h3></div>
            <p>Illustrative capabilities. Availability in the public app is pending confirmation.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map((item) => (
              <article className="capability-card" key={item.number}>
                <span className="capability-number">{item.number} <span aria-hidden="true">↗</span></span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section works-section" id="how-it-works">
        <div className="home-container">
          <div className="section-intro">
            <SectionHeading eyebrow="02 / HOW IT WORKS" title={<>A little context.<br /><em>A lot more clarity.</em></>}>
              A simple idea: bring your health information into context and make it easier to understand.
            </SectionHeading>
            <p className="section-aside">ILLUSTRATIVE JOURNEY<br />AVAILABILITY TO BE CONFIRMED</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section intelligence-section" id="intelligence">
        <div className="home-container intelligence-grid">
          <div className="intelligence-visual">
            <span className="visual-overline">YOUR HEALTH IS A STORY, NOT A STATISTIC</span>
            <ScreenshotPlaceholder label="Personal health insights" variant="insight-placeholder" />
            <span className="visual-footnote">MADE WITH YOUR CONTEXT IN MIND <span>✳</span></span>
          </div>
          <div className="intelligence-copy">
            <SectionHeading eyebrow="03 / PERSONAL HEALTH INTELLIGENCE" title={<>More context.<br /><em>More you.</em></>}>
              Your health is individual. NEM AI's vision is to turn personal health information into insights and guidance that feel relevant to you.
            </SectionHeading>
            <div className="intelligence-note"><span aria-hidden="true">✦</span><p>Thoughtful intelligence, grounded in your health context—not just generic answers.</p></div>
            <span className="review-label">Insights and functionality pending confirmation</span>
          </div>
        </div>
      </section>

      <section className="home-section trust-section" id="trust">
        <div className="home-container trust-grid">
          <SectionHeading eyebrow="04 / PRIVACY & TRUST" title={<>Your health is personal.<br /><em>That matters.</em></>}>
            Health information deserves thoughtful care. We're preparing clear details about how NEM AI approaches data and responsible AI.
          </SectionHeading>
          <div className="trust-details">
            <div><span>01</span><p>Permissions &amp; connected data</p><small>Details to be provided</small></div>
            <div><span>02</span><p>Synchronization &amp; security</p><small>Details to be provided</small></div>
            <div><span>03</span><p>Responsible AI &amp; safety</p><small>Details to be provided</small></div>
            <Link className="text-link" to="/privacy-policies">Read our privacy policy <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-section emergency-section" id="emergency">
        <div className="home-container emergency-panel">
          <div><span className="home-eyebrow">05 / WHEN TIMING MATTERS</span><h2>Because timing<br /><em>saves lives.</em></h2></div>
          <div className="emergency-copy">
            <p>Emergency medicine is an important part of NEM AI's expertise. Our broader mission is to help people find clarity in everyday health and in moments when decisions matter.</p>
            <span className="review-label">Emergency guidance details and availability pending confirmation</span>
            <p className="safety-note">NEM AI is not a replacement for a healthcare professional or emergency services. In an emergency, contact your local emergency services.</p>
          </div>
        </div>
      </section>

      <section className="home-section about-section" id="about">
        <div className="home-container about-grid">
          <div className="about-mark"><img src={logomark} alt="" /><span>HEALTH, WITH A HUMAN PERSPECTIVE.</span></div>
          <div>
            <SectionHeading eyebrow="06 / ABOUT NEM AI" title={<>A healthier future<br /><em>feels personal.</em></>}>
              We're building NEM AI to help people better understand their health and make more informed decisions, wherever they are in their health journey.
            </SectionHeading>
            <p className="about-placeholder">Company background and long-term vision to be added.</p>
          </div>
        </div>
      </section>

      <section className="home-section final-section" id="download">
        <div className="home-container final-panel">
          <span className="home-eyebrow">YOUR HEALTH JOURNEY, WITH NEM AI</span>
          <h2>A little more understanding<br /><em>starts here.</em></h2>
          <p>Meet your Personal Health AI.</p>
          <DownloadCTA placement="final" />
          <span className="final-star" aria-hidden="true">✳</span>
        </div>
      </section>
    </main>
  );
}
