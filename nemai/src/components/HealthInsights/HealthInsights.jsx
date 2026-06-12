import { useEffect, useRef, useState } from "react";
import "./HealthInsights.css";

export default function HealthInsights() {
  const sectionRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const benefits = [
    {
      title: "Spot Patterns Before They Become Problems",
      scenario: "You log a mild headache and poor sleep over a few days.",
      help: "The AI connects the dots, warning you about a potential migraine trigger and suggesting simple lifestyle tweaks to help you get ahead of it."
    },
    {
      title: "Your Daily Vitals, Simplified",
      scenario: "You check your heart rate and blood pressure, but aren't sure what the numbers mean for you.",
      help: "We translate your raw numbers into simple, personalized insights so you always know exactly where your baseline health stands today."
    },
    {
      title: "Smarter Medication Management",
      scenario: "You are managing a new prescription and juggling daily vitamins.",
      help: "We track your intake and monitor for any side effects based on your personal profile, ensuring your daily routine is working safely for you."
    },
    {
      title: "Connect the Dots on Your Energy Levels",
      scenario: "You feel unusually fatigued by the afternoon but don't know why.",
      help: "By looking at your recent activity and logged symptoms, the AI helps identify daily habits that might be draining your energy."
    },
    {
      title: "Prep Your Body for Seasonal Changes",
      scenario: "Allergy season is approaching, or flu cases are rising in your area.",
      help: "Based on your past health history, the AI gives you a heads-up and recommends preventative steps to keep your immune system strong."
    }
  ];

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  return (
    <section className="health-insights-section" ref={sectionRef}>
      <div className="health-insights-grid">
        {/* ===== LEFT VISUAL ===== */}
        <div className="health-insights-visual">
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
        <div className="health-insights-content">
          <div className="health-insights-header">
            <span className="health-insights-pill">AI Health Intelligence</span>
            <h2 className="health-insights-title">How NEM AI Helps You</h2>
            <p className="health-insights-sub">
              Personalized insights that turn everyday health signals into smarter,
              actionable guidance.
            </p>
          </div>

          <div className="benefit-carousel">
            <button
              className="carousel-btn carousel-prev"
              onClick={prevSlide}
              aria-label="Previous benefit"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="benefit-slider">
              <div className="benefit-slides" style={{
                transform: `translateX(calc(-${currentSlide} * 100%))`
              }}>
                {benefits.map((benefit, idx) => (
                  <article key={idx} className="benefit-card">
                    <div className="benefit-tag">{benefit.title}</div>
                    <p className="benefit-scenario">
                      <strong>The Scenario:</strong> {benefit.scenario}
                    </p>
                    <p className="benefit-help">
                      <strong>How NEM AI Helps:</strong> {benefit.help}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <button
              className="carousel-btn carousel-next"
              onClick={nextSlide}
              aria-label="Next benefit"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="carousel-indicators">
            {benefits.map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
