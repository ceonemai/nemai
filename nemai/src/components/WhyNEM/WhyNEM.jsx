import "./WhyNEM.css";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function WhyNEM() {

    const sectionRef = useRef(null);

    // track scroll เฉพาะ section นี้
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const challenges = [
        {
            title: "Uncertainty about symptom severity",
            description:
                "Many people are unsure which symptoms are truly dangerous and require immediate medical attention."
        },
        {
            title: "Delayed action during critical moments",
            description:
                "In critical situations, hesitation and lack of clear guidance often delay life-saving action."
        },
        {
            title: "Overwhelming and unreliable medical information online",
            description:
                "Online medical information is frequently overwhelming, conflicting, and unreliable, leading to confusion and unnecessary fear."
        }
    ];

    // glow เลื่อนช้ากว่า content (parallax)
    const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

    return (
        <section className="why" id="why" ref={sectionRef}>

            {/* PARALLAX GLOW LAYER */}
            <motion.div
                className="why-glow"
                style={{ y }}
            />

            <div className="why-wrapper">

                {/* LEFT SIDE */}
                <motion.div
                    className="why-left"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >
                    <h2>
                        Why Do We Build <span className="brand">NEM&nbsp;AI</span>
                    </h2>
                    <p>
                        Every day, people face health concerns without knowing
                        whether their symptoms are harmless or life-threatening.
                    </p>

                    <p>
                        What begins as a simple question can quickly become an emergency when guidance is unclear or delayed. 
                        NEM AI was built as a personal health AI with emergency intelligence at its core
                    </p>

                    <p>
                        supporting everyday health decisions while delivering fast, 
                        reliable guidance when
                        <span className="emphasis"> clarity and speed can save lives.</span>
                    </p>

                    <div className="why-highlight">
                        This is where NEM AI comes in.
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    className="why-right"
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >

                    <div className="why-intro">
                        <h3>Today, people struggle with:</h3>
                    </div>

                    <div className="why-cards">
                        {challenges.map((item, index) => (
                            <motion.div
                                key={index}
                                className="why-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: false }}
                            >
                                <div className="why-card-title">{item.title}</div>
                                <div className="why-card-desc">{item.description}</div>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

export default WhyNEM;