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
                        Why We Built <span>NEM AI</span>?
                    </h2>

                    <p>
                        Our CEO & Co-founder, Nem, he saw people die, not because help isn't available,
                        but because they didn’t know what to do in an emergency.
                    </p>

                    <p>
                        Every day, millions of people face sudden medical situations without
                        clear guidance on whether their symptoms are dangerous
                        or when they should seek urgent care.
                    </p>

                    <div className="why-highlight">
                        Lack of timely action leads to life-threatening and preventable deaths.
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
                        {[
                            "Not knowing which symptoms are truly dangerous",
                            "Delaying medical response when every minute matters",
                            "Confusing and overwhelming medical information online — often causing unnecessary fear and misinformation"
                        ].map((text, index) => (
                            <motion.div
                                key={index}
                                className="why-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: false }}
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

export default WhyNEM;