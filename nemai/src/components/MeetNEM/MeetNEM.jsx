import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MeetNEM.css";
import logo from "../../assets/images/LogogramFullColor.png";

const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

const Icons = {
    chat: (
        <svg {...svgProps}>
            <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-3.6A8 8 0 1 1 20 12z" />
            <path d="M9 10.5h6M9 13.5h3.5" />
        </svg>
    ),
    trend: (
        <svg {...svgProps}>
            <path d="M3.5 4v16.5H20" />
            <path d="M7 15l3.5-4 3 2.5 5-6" />
            <path d="M15.5 7.5h3v3" />
        </svg>
    ),
    emergency: (
        <svg {...svgProps}>
            <path d="M12 3l7.5 3v5.5c0 4.5-3.1 8-7.5 9.5-4.4-1.5-7.5-5-7.5-9.5V6z" />
            <path d="M12 8.5v6M9 11.5h6" />
        </svg>
    ),
    device: (
        <svg {...svgProps}>
            <rect x="7" y="7" width="10" height="10" rx="3" />
            <path d="M9.5 7l.6-3.5h3.8l.6 3.5M9.5 17l.6 3.5h3.8l.6-3.5" />
            <path d="M12 10v2.2l1.4.9" />
        </svg>
    ),
    heart: (
        <svg {...svgProps}>
            <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
            <path d="M7 12.5h2.5l1.2-2 2 4 1.3-2H17" />
        </svg>
    ),
    sleep: (
        <svg {...svgProps}>
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
    ),
    steps: (
        <svg {...svgProps}>
            <path d="M8 3.5c1.8 0 2.8 1.6 2.8 3.6 0 2-1 3.4-2.8 3.4S5.2 9.1 5.2 7.1 6.2 3.5 8 3.5z" />
            <path d="M6.2 13.5h3.6" />
            <path d="M16 12.5c1.8 0 2.8 1.6 2.8 3.6 0 2-1 3.4-2.8 3.4s-2.8-1.4-2.8-3.4 1-3.6 2.8-3.6z" />
            <path d="M14.2 22h3.6" />
        </svg>
    ),
};
// Add app screenshots to assets/images/screens/ and set `screenshot` (imported URL) per feature.
const features = [
    {
        id: "chat",
        icon: Icons.chat,
        title: "Chat with your health data",
        description:
            "Ask anything in plain language. NEM AI answers using your own Apple Health and wearable data.",
        screenshot: null,
    },
    {
        id: "insights",
        icon: Icons.trend,
        title: "Personalized insights & trends",
        description:
            "Sleep, heart rate, activity and more, explained clearly with what changed and why it matters.",
        screenshot: null,
    },
    {
        id: "emergency",
        icon: Icons.emergency,
        title: "Emergency guidance",
        description:
            "Clear, step-by-step actions when it counts, tailored to your body and current vitals.",
        screenshot: null,
    },
    {
        id: "devices",
        icon: Icons.device,
        title: "Connect your devices",
        description:
            "Sync Apple Health and popular wearables in one place so your AI always sees the full picture.",
        screenshot: null,
    },
];

const sources = ["Apple Health", "Wearables", "Your questions"];

const badges = [
    { icon: Icons.heart, label: "72 bpm", className: "b1" },
    { icon: Icons.sleep, label: "7h 45m", className: "b2" },
    { icon: Icons.steps, label: "8,420", className: "b3" },
];

const AUTO_MS = 4500;

function MeetNEM() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const current = features[active];

    useEffect(() => {
        if (paused) return undefined;
        const id = setTimeout(
            () => setActive((a) => (a + 1) % features.length),
            AUTO_MS
        );
        return () => clearTimeout(id);
    }, [active, paused]);

    return (
        <section className="meet" id="meet">
            <div className="meet-glow" />
            <span className="meet-orb o1" aria-hidden="true" />
            <span className="meet-orb o2" aria-hidden="true" />

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
                        {sources.map((s, i) => (
                            <motion.li
                                key={s}
                                initial={{ opacity: 0, y: 14, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 16,
                                    delay: 0.3 + i * 0.12,
                                }}
                                viewport={{ once: true }}
                            >
                                {s}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <div
                    className="meet-body"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
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
                                {i === active && !paused && (
                                    <span
                                        key={`p-${active}`}
                                        className="meet-feature-progress"
                                        style={{ animationDuration: `${AUTO_MS}ms` }}
                                    />
                                )}
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
                        <span className="meet-ring r1" aria-hidden="true" />
                        <span className="meet-ring r2" aria-hidden="true" />
                        {badges.map((b, i) => (
                            <motion.span
                                key={b.label}
                                className={`meet-badge ${b.className}`}
                                initial={{ opacity: 0, scale: 0.4 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 220,
                                    damping: 14,
                                    delay: 0.7 + i * 0.2,
                                }}
                                viewport={{ once: true }}
                            >
                                <span aria-hidden="true">{b.icon}</span>
                                {b.label}
                            </motion.span>
                        ))}
                        <div className="meet-phone">
                            <span className="meet-scan" aria-hidden="true" />
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
