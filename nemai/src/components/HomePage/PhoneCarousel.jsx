import { useEffect, useRef, useState } from "react";

const slides = [
  {
    image: `${import.meta.env.BASE_URL}app%20screenshot/app%20home.jpg`,
    alt: "NEM AI app home screen with example wearable data",
    label: "App screenshot",
  },
  {
    video: `${import.meta.env.BASE_URL}app%20screenshot/app%20record.mp4`,
    label: "App video",
  },
];

export default function PhoneCarousel() {
  const carouselRef = useRef(null);
  const touchStart = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [videoError, setVideoError] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const playing = !reducedMotion && !keyboardFocused;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePreference = (event) => setReducedMotion(event.matches);
    preference.addEventListener("change", handlePreference);
    return () => preference.removeEventListener("change", handlePreference);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || !pageVisible || hovered || activeSlide !== 0 || !videoDuration) return;
    const timer = window.setTimeout(() => {
      setActiveSlide(1);
    }, videoDuration * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, visible, pageVisible, hovered, activeSlide, videoDuration]);

  const selectSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) >= 40) selectSlide(activeSlide + (distance < 0 ? 1 : -1));
  };

  return (
    <div
      className="phone-carousel"
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="NEM AI app preview"
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) setKeyboardFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocused(false);
      }}
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="phone-frame"
        id="phone-slides"
        onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <div className="phone-slide-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div
              className="phone-slide"
              key={slide.image || slide.video}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index !== activeSlide}
            >
              {slide.image ? (
                <img src={slide.image} alt={slide.alt} />
              ) : videoError ? (
                <div className="phone-slide-error" role="alert">
                  <p>Unable to play the app video.</p>
                  <a href={slide.video} target="_blank" rel="noopener noreferrer" tabIndex={index === activeSlide ? 0 : -1}>Open the video</a>
                </div>
              ) : visible && pageVisible ? (
                <video
                  key={`${index === activeSlide}-${reducedMotion}`}
                  src={slide.video}
                  aria-label="NEM AI app demonstration video"
                  autoPlay={index === activeSlide && !reducedMotion}
                  muted
                  playsInline
                  loop={!playing || hovered}
                  preload="metadata"
                  onLoadedMetadata={(event) => {
                    const duration = event.currentTarget.duration;
                    if (Number.isFinite(duration) && duration > 0) setVideoDuration(duration);
                    else setVideoError(true);
                  }}
                  onEnded={() => {
                    if (playing && !hovered && !document.hidden) setActiveSlide(0);
                  }}
                  onError={() => setVideoError(true)}
                >
                  Your browser does not support embedded video.
                </video>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="phone-controls" aria-label="App preview controls">
        <div className="phone-dots">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.image || slide.video}
              className={`phone-dot ${activeSlide === index ? "is-active" : ""}`}
              aria-label={`Show ${slide.label.toLowerCase()}, ${index + 1} of ${slides.length}`}
              aria-current={activeSlide === index ? "true" : undefined}
              aria-controls="phone-slides"
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </div>
      <span className="phone-slide-status" aria-live={playing ? "off" : "polite"}>
        {slides[activeSlide].label}, {activeSlide + 1} of {slides.length}
      </span>
    </div>
  );
}
