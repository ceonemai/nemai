import { motion } from "framer-motion";
import "./HowItWorks.css";

// Set `screenshot` (imported image URL) per step once approved app images are ready.
const steps = [
    {
        number: "01",
        kind: "profile",
        title: "Build your health profile",
        description:
            "Tell NEM AI about you once, so every answer starts from your own context.",
        chips: [
            "Age & sex",
            "Weight",
            "Date of birth",
            "Drug allergies",
            "Food allergies",
            "Chronic conditions",
        ],
        screenshot: null,
    },
    {
        number: "02",
        kind: "connect",
        title: "Connect your health data",
        description:
            "Bring your devices together in one place. More integrations are on the way.",
        chips: ["Apple Health", "Oura"],
        soon: ["Google Fitbit", "And more"],
        screenshot: null,
    },
    {
        number: "03",
        kind: "insight",
        title: "Get insights made for you",
        description:
            "See what your sleep, heart rate and steps mean, with personal guidance that explains how your data was used.",
        chips: ["Sleep", "Heart rate", "Steps", "AI guidance"],
        screenshot: null,
    },
];

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
    profile: (
        <svg {...svgProps}>
            <circle cx="12" cy="8" r="3.6" />
            <path d="M4.5 20c.6-3.8 3.7-6 7.5-6s6.9 2.2 7.5 6" />
            <path d="M18.5 3.5v3M17 5h3" />
        </svg>
    ),
    connect: (
        <svg {...svgProps}>
            <rect x="3" y="4" width="7" height="7" rx="2" />
            <rect x="14" y="13" width="7" height="7" rx="2" />
            <path d="M10 7.5h2.5a2 2 0 0 1 2 2V13M14 16.5h-2.5a2 2 0 0 1-2-2V11" />
        </svg>
    ),
    insight: (
        <svg {...svgProps}>
            <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
            <path d="M18.5 15v4M16.5 17h4" />
        </svg>
    ),
    sleep: (
        <svg {...svgProps}>
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
    ),
    heart: (
        <svg {...svgProps}>
            <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
            <path d="M7 12.5h2.5l1.2-2 2 4 1.3-2H17" />
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
    lock: (
        <svg {...svgProps}>
            <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
            <circle cx="12" cy="15.2" r="1.1" />
        </svg>
    ),
};

const chipIcons = {
    Sleep: Icons.sleep,
    "Heart rate": Icons.heart,
    Steps: Icons.steps,
    "AI guidance": Icons.insight,
};

function HowItWorks() {
    const handleMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <section className="how" id="how-it-works">
            <div className="how-glow" />
            <span className="how-orb o1" aria-hidden="true" />
            <span className="how-orb o2" aria-hidden="true" />

            <div className="how-inner">
                <motion.div
                    className="how-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h2>
                        From your data to <span className="brand">your clarity</span>
                    </h2>
                    <p>
                        Three simple steps turn scattered health numbers into answers that
                        feel personal.
                    </p>
                </motion.div>

                <ol className="how-steps">
                    <motion.span
                        className="how-line"
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <i />
                    </motion.span>
                    {steps.map((step, i) => (
                        <motion.li
                            key={step.number}
                            className="how-step"
                            onMouseMove={handleMove}
                            initial={{ opacity: 0, y: 70, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 16,
                                delay: i * 0.18,
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <div className="how-step-top">
                                <span className="how-step-number">{step.number}</span>
                                <span className="how-step-icon" aria-hidden="true">
                                    {Icons[step.kind]}
                                </span>
                            </div>

                            <div className="how-shot">
                                {step.screenshot ? (
                                    <img src={step.screenshot} alt={step.title} />
                                ) : (
                                    <div className="how-shot-placeholder">
                                        <span>App screenshot</span>
                                    </div>
                                )}
                            </div>

                            <h3>{step.title}</h3>
                            <p>{step.description}</p>

                            <ul className={`how-chips ${step.kind}`}>
                                {[...step.chips, ...(step.soon || [])].map((c, ci) => {
                                    const soon = step.soon?.includes(c);
                                    return (
                                        <motion.li
                                            key={c}
                                            className={soon ? "soon" : undefined}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 15,
                                                delay: 0.5 + i * 0.18 + ci * 0.07,
                                            }}
                                            viewport={{ once: true }}
                                        >
                                            <span className="chip-ico" aria-hidden="true">
                                                {step.kind === "insight" ? chipIcons[c] : null}
                                            </span>
                                            {c}
                                            {soon && <small>Coming soon</small>}
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.li>
                    ))}
                </ol>

                <motion.div
                    className="how-privacy"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 }}
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <span className="how-lock" aria-hidden="true">{Icons.lock}</span>
                    You choose what you share. Your health, your control.
                </motion.div>
            </div>
        </section>
    );
}

export default HowItWorks;
