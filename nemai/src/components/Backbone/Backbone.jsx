import { useEffect, useRef } from "react";
import "./Backbone.css";

export default function Backbone() {
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
                        // scroll ผ่านลงล่าง
                        el.classList.remove("visible");
                        el.classList.add("leaving");
                    } else {
                        // scroll กลับขึ้นบน
                        el.classList.remove("visible");
                        el.classList.remove("leaving");
                    }
                }
            },
            {
                threshold: 0.4,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="backbone-section" ref={sectionRef}>
            <div className="background-glow"></div>

            <div className="backbone-grid">
                <div className="backbone-left">
                    <h2 className="backbone-title">
                        The Backbone of the Emergency Medical Ecosystem
                    </h2>

                    <p className="backbone-sub">
                        NEM AI stands for Network of Emergency Medical AI.
                    </p>

                    <p className="backbone-description">
                        We are building NEM AI to become the backbone of the emergency medical ecosystem—providing intelligent, fast, and reliable decision support when every second matters.
                    </p>
                </div>

                <div className="backbone-right">
                    <div className="backbone-core">
                        <div className="core-pulse"></div>
                        <div className="core-pulse delay"></div>

                        {/* Light Beam */}
                        <div className="light-beam"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}