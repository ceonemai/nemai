import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MeetNEM.css";
import logo from "../../assets/images/LogogramFullColor.png";

// Add app screenshots to assets/images/screens/ and set `screenshot` (imported URL) per feature.
const features = [
    {
        id: "chat",
        icon: "💬",
        title: "Chat with your health data",
        description:
            "Ask anything in plain language. NEM AI answers using your own Apple Health and wearable data.",
        screenshot: null,
    },
    {
        id: "insights",
        icon: "📈",
        title: "Personalized insights & trends",
        description:
            "Sleep, heart rate, activity and more, explained clearly with what changed and why it matters.",
        screenshot: null,
    },
    {
        id: "emergency",
        icon: "🚑",
        title: "Emergency guidance",
        description:
            "Clear, step-by-step actions when it counts, tailored to your body and current vitals.",
        screenshot: null,
    },
    {
        id: "devices",
        icon: "⌚",
        title: "Connect your devices",
        description:
            "Sync Apple Health and popular wearables in one place so your AI always sees the full picture.",
        screenshot: null,
    },
];

const sources = ["Apple Health", "Wearables", "Your questions"];

function MeetNEM() {
    const [active, setActive] = useState(0);
    const current = features[active];

    return (
        <section className="meet" id="meet">
            <div className="meet-glow" />

            <div className="meet-inner">
                <motion.div
                    className="meet-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h2>
                        Meet <span className="brand">NEM&nbsp;AI</span>
                    </h2>
                    <p>
                        An AI health companion that turns your Apple Health and wearable
                        data into clear answers and personal guidance.
                    </p>
                    <ul className="meet-sources">
                        {sources.map((s) => (
                            <li key={s}>{s}</li>
                        ))}
                    </ul>
                </motion.div>

                <div className="meet-body">
                    <motion.div
                        className="meet-features"
                        role="tablist"
                        aria-label="NEM AI capabilities"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {features.map((f, i) => (
                            <button
                                key={f.id}
                                type="button"
                                role="tab"
                                aria-selected={i === active}
                                className={`meet-feature${i === active ? " active" : ""}`}
                                onClick={() => setActive(i)}
                                onMouseEnter={() => setActive(i)}
                            >
                                <span className="meet-feature-icon" aria-hidden="true">
                                    {f.icon}
                                </span>
                                <span className="meet-feature-text">
                                    <span className="meet-feature-title">{f.title}</span>
                                    <span className="meet-feature-desc">{f.description}</span>
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    <motion.div
                        className="meet-visual"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="meet-phone">
                            <div className="meet-phone-notch" />
                            <div className="meet-phone-screen">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={current.id}
                                        className="meet-screen-slot"
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {current.screenshot ? (
                                            <img src={current.screenshot} alt={current.title} />
                                        ) : (
                                            <div className="meet-placeholder">
                                                <img src={logo} alt="" />
                                                <span>{current.title}</span>
                                                <small>App screenshot</small>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default MeetNEM;
