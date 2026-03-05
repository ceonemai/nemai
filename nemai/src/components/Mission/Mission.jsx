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

                {/* LEFT COLUMN */}
                <motion.div
                    className="mission-left"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >

                    <h2 className="mission-title">
                        Our <span>Mission</span>
                    </h2>

                    <div className="mission-highlight">
                        The mission is simple yet urgent.

                        <span>
                            Reduce preventable deaths caused by delay and uncertainty,
                            and build a new global standard for trusted health intelligence
                            in the age of AI.
                        </span>
                    </div>

                </motion.div>


                {/* RIGHT COLUMN */}
                <motion.div
                    className="mission-right"
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ amount: 0.4 }}
                >

                    <p className="mission-lead">
                        <strong>
                            NEM AI aims to become a personal health AI for everyone.
                        </strong>
                    </p>

                    <p>
                        Delivering real-time intelligent guidance for daily health decisions
                        and critical moments alike.
                    </p>

                    <p>
                        By transforming uncertainty into action, NEM AI builds a global
                        emergency intelligence network that provides trusted,
                        personalized medical support anytime, anywhere.
                    </p>

                </motion.div>

            </div>
        </section>
    );
}

export default Mission;