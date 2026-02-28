import "./Mission.css";
import { motion } from "framer-motion";
import mascot from "../../assets/images/mascots/Mascott NEM-86.png"; // เปลี่ยน path ตามของคุณ

function Mission() {

    return (
        <section className="mission-alt" id="mission">

            {/* FLOATING MASCOT */}
            <motion.img
                src={mascot}
                alt="NEM Mascot"
                className="mission-mascot"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="mission-center">

                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Our Missions
                </motion.h2>

                <motion.p
                    className="mission-main"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    At NEM AI, we aim to empower people with clear, reliable, and real-time guidance during medical emergencies, so they can make informed decisions, act faster, and ultimately save lives.
                </motion.p>

                <motion.div
                    className="mission-highlight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Because no one should lose their life simply due to uncertainty or lack of knowledge in a critical moment.
                </motion.div>

                <div className="mission-pillars">
                    <div>Clear, reliable, and real-time guidance</div>
                    <div>Make informed decisions & act faster</div>
                    <div>Ultimately save lives</div>
                </div>

            </div>
        </section>
    );
}

export default Mission;