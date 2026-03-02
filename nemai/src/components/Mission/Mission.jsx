import "./Mission.css";
import { motion } from "framer-motion";
import mascot from "../../assets/images/mascots/Mascott NEM-86.png";

function Mission() {
    return (
        <section className="mission" id="mission">

            <motion.img
                src={mascot}
                alt="NEM Mascot"
                className="mission-mascot"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="mission-wrapper">

                {/* LEFT — PILLARS */}
                <motion.div
                    className="mission-left"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >
                    <div className="mission-pillars">

                        <div className="mission-card">
                            <div className="mission-card-title">
                                Clear, reliable, and real-time guidance
                            </div>
                        </div>

                        <div className="mission-card">
                            <div className="mission-card-title">
                                Make informed decisions & act faster
                            </div>
                        </div>

                        <div className="mission-card">
                            <div className="mission-card-title">
                                Ultimately save lives
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* RIGHT — TEXT */}
                <motion.div
                    className="mission-right"
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >
                    <h2>
                        Our <span>Missions</span>
                    </h2>

                    <p>
                        <strong>
                            NEM AI exists to redefine how the world responds to medical emergencies.
                        </strong>
                    </p>

                    <p>
                        It begins with real-time, AI-powered emergency guidance, delivering immediate, clear, and personalized decision support when seconds matter most. By transforming uncertainty into informed action, NEM AI helps individuals respond faster and more effectively in critical moments.
                    </p>

                    <p>
                        But this is only the foundation. NEM AI is building the core infrastructure for emergency medical intelligence, a scalable, always-accessible AI network designed to support urgent health decision-making anytime, anywhere.
                    </p>

                    <div className="mission-highlight">
                        The mission is simple yet urgent:
                        <span>
                            {" "}
                            Eliminate preventable deaths caused by delay, confusion, and lack of immediate guidance, and set a new global standard for emergency response in the age of AI.
                        </span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default Mission;