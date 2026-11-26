import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/LogogramFullColor.png";
import "./Intelligence.css";

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
    sleep: (
        <svg {...svgProps}>
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
    ),
    pulse: (
        <svg {...svgProps}>
            <path d="M3 12h4l2-5 4 10 2-5h6" />
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
    spark: (
        <svg {...svgProps}>
            <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
            <path d="M18.5 15v4M16.5 17h4" />
        </svg>
    ),
    db: (
        <svg {...svgProps}>
            <ellipse cx="12" cy="6" rx="7" ry="2.8" />
            <path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" />
            <path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
        </svg>
    ),
    shield: (
        <svg {...svgProps}>
            <path d="M12 3l7.5 3v5.5c0 4.5-3.1 8-7.5 9.5-4.4-1.5-7.5-5-7.5-9.5V6z" />
            <path d="M9 12l2.2 2.2L15.5 10" />
        </svg>
    ),
    check: (
        <svg {...svgProps}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    ),
    bulb: (
        <svg {...svgProps}>
            <path d="M9 18h6M10 21h4" />
            <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
        </svg>
    ),
};

const DAYS = ["M", "T", "W", "T", "F", "S", "Today"];

const scenarios = [
    {
        id: "sleep",
        icon: Icons.sleep,
        label: "How did I sleep?",
        question: "How did I sleep last night?",
        answer:
            "You slept 5h 42m, about 1h 11m less than your 7-day average of 6h 53m. Most of the shortfall came from lighter, more interrupted sleep after 3 AM.",
        chart: {
            type: "bars",
            title: "Sleep, last 7 nights",
            value: "5h 42m",
            data: [7.2, 6.8, 7.5, 7.1, 7.0, 6.9, 5.7],
            baseline: 6.9,
            max: 9,
        },
        used: ["Apple Health · Sleep", "Oura · Sleep stages"],
        why: "Compared last night with your own 7-day average, not a generic 8-hour rule.",
        next: [
            "Aim for lights-out 30 minutes earlier tonight",
            "Keep caffeine before 2 PM",
        ],
    },
    {
        id: "hrv",
        icon: Icons.pulse,
        label: "Why is my HRV low?",
        question: "Why does my heart rate variability look low?",
        answer:
            "Your HRV is 46 ms, about 18% below your 7-day baseline of 56 ms, and resting heart rate is up 4 bpm. Together with short sleep, that often points to extra strain on recovery.",
        chart: {
            type: "line",
            title: "HRV, last 7 days",
            value: "46 ms",
            data: [58, 60, 57, 61, 59, 52, 46],
            baseline: 56,
            min: 40,
            max: 66,
        },
        used: ["Oura · HRV", "Apple Health · Resting heart rate", "Apple Health · Sleep"],
        why: "A single low reading means little. The trend against your baseline is what matters.",
        next: [
            "Choose light movement over intense training today",
            "Re-check tomorrow morning before changing your routine",
        ],
    },
    {
        id: "steps",
        icon: Icons.steps,
        label: "Am I active enough?",
        question: "Am I active enough this week?",
        answer:
            "You have 8,420 steps today, 420 above your 8,000 goal and about 13% above your weekly average. Friday was the only day that fell well short.",
        chart: {
            type: "bars",
            title: "Steps, last 7 days",
            value: "8,420",
            data: [6400, 8200, 7100, 9000, 5200, 7800, 8420],
            baseline: 8000,
            max: 10000,
            goal: true,
        },
        used: ["Apple Health · Steps", "Apple Health · Active energy"],
        why: "Your goal and weekly average come from your own history.",
        next: [
            "Plan a 10-minute walk on low-step days",
            "Keep today's pace, you are already past your goal",
        ],
    },
    {
        id: "today",
        icon: Icons.spark,
        label: "What should I do today?",
        question: "Given all my data, what should I do today?",
        answer:
            "Today looks like a recovery day. Sleep was short and HRV is below baseline, but your activity is on track. Keep it gentle and protect tonight's sleep.",
        chart: {
            type: "ring",
            title: "Recovery readiness",
            value: "64",
            unit: "/100",
            score: 64,
        },
        used: ["Apple Health · Sleep", "Oura · HRV", "Apple Health · Steps", "Your health profile"],
        why: "Combined your sleep, HRV and activity, then considered your profile.",
        next: [
            "Take a walk or stretch instead of a hard workout",
            "Wind down early and keep screens off before bed",
        ],
    },
];

const W = 300;
const H = 120;
const PAD = 14;

function BarsChart({ chart }) {
    const n = chart.data.length;
    const slot = (W - PAD * 2) / n;
    const bw = slot * 0.56;
    const yOf = (v) => H - 22 - (v / chart.max) * (H - 34);
    const baseY = yOf(chart.baseline);
    return (
        <svg className="intel-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.title}>
            <defs>
                <linearGradient id="intel-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#59e0f4" />
                    <stop offset="100%" stopColor="#2187aa" />
                </linearGradient>
                <linearGradient id="intel-bar-dim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bfeee0" />
                    <stop offset="100%" stopColor="#8fd9c4" />
                </linearGradient>
            </defs>
            {chart.data.map((v, i) => {
                const last = i === n - 1;
                const y = yOf(v);
                return (
                    <g key={i}>
                        <rect
                            className="intel-bar"
                            style={{ animationDelay: `${i * 70}ms` }}
                            x={PAD + slot * i + (slot - bw) / 2}
                            y={y}
                            width={bw}
                            height={H - 22 - y}
                            rx="5"
                            fill={last ? "url(#intel-bar)" : "url(#intel-bar-dim)"}
                        />
                        <text
                            x={PAD + slot * i + slot / 2}
                            y={H - 6}
                            textAnchor="middle"
                            className={last ? "intel-day on" : "intel-day"}
                        >
                            {DAYS[i]}
                        </text>
                    </g>
                );
            })}
            <line className="intel-base" x1={PAD} x2={W - PAD} y1={baseY} y2={baseY} />
            <text x={W - PAD} y={baseY - 5} textAnchor="end" className="intel-base-label">
                {chart.goal ? "goal" : "avg"}
            </text>
        </svg>
    );
}

function LineChart({ chart }) {
    const n = chart.data.length;
    const step = (W - PAD * 2) / (n - 1);
    const yOf = (v) =>
        H - 22 - ((v - chart.min) / (chart.max - chart.min)) * (H - 40);
    const pts = chart.data.map((v, i) => [PAD + step * i, yOf(v)]);
    const d = pts.reduce((acc, [x, y], i) => {
        if (i === 0) return `M${x},${y}`;
        const [px, py] = pts[i - 1];
        const cx = (px + x) / 2;
        return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`;
    }, "");
    const area = `${d} L${pts[n - 1][0]},${H - 22} L${pts[0][0]},${H - 22} Z`;
    const baseY = yOf(chart.baseline);
    const [lx, ly] = pts[n - 1];
    return (
        <svg className="intel-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.title}>
            <defs>
                <linearGradient id="intel-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#59e0f4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#59e0f4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="intel-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2187aa" />
                    <stop offset="100%" stopColor="#00c2a8" />
                </linearGradient>
            </defs>
            <line className="intel-base" x1={PAD} x2={W - PAD} y1={baseY} y2={baseY} />
            <text x={W - PAD} y={baseY - 5} textAnchor="end" className="intel-base-label">
                baseline
            </text>
            <path className="intel-area" d={area} fill="url(#intel-area)" />
            <path
                className="intel-line"
                d={d}
                pathLength="1"
                fill="none"
                stroke="url(#intel-line)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <circle className="intel-dot-pulse" cx={lx} cy={ly} r="5" />
            <circle className="intel-dot" cx={lx} cy={ly} r="5" />
            {DAYS.map((day, i) => (
                <text
                    key={i}
                    x={PAD + step * i}
                    y={H - 6}
                    textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                    className={i === n - 1 ? "intel-day on" : "intel-day"}
                >
                    {day}
                </text>
            ))}
        </svg>
    );
}

const ringRows = [
    ["Sleep", "Low", "#f2b84b"],
    ["HRV", "Below baseline", "#e0475b"],
    ["Activity", "On track", "#00c2a8"],
];

function RingChart({ chart }) {
    const r = 44;
    const c = 2 * Math.PI * r;
    return (
        <svg className="intel-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.title}>
            <defs>
                <linearGradient id="intel-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#59e0f4" />
                    <stop offset="100%" stopColor="#00c2a8" />
                </linearGradient>
            </defs>
            <g transform="translate(150 60)">
                <circle r={r} fill="none" stroke="rgba(33,135,170,0.12)" strokeWidth="10" />
                <circle
                    className="intel-ring"
                    r={r}
                    fill="none"
                    stroke="url(#intel-ring)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - chart.score / 100)}
                    style={{ "--c": c }}
                    transform="rotate(-90)"
                />
                <text className="intel-ring-num" textAnchor="middle" y="8">
                    {chart.score}
                </text>
            </g>
            {ringRows.map(([name, state, color], i) => (
                <g
                    key={name}
                    className="intel-ring-tag"
                    style={{ animationDelay: `${300 + i * 150}ms` }}
                >
                    <circle cx={PAD + 4} cy={34 + i * 26 - 4} r="4" fill={color} />
                    <text x={PAD + 14} y={34 + i * 26} className="intel-day">
                        {name}
                    </text>
                    <text x={W - PAD} y={34 + i * 26} textAnchor="end" className="intel-day on">
                        {state}
                    </text>
                </g>
            ))}
        </svg>
    );
}

const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Intelligence() {
    const [active, setActive] = useState(0);
    const [phase, setPhase] = useState("thinking");
    const [typed, setTyped] = useState(0);
    const [paused, setPaused] = useState(false);
    const [started, setStarted] = useState(false);

    const bodyRef = useRef(null);

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = 0;
    }, [active]);

    const s = scenarios[active];
    const total = s.answer.length;

    useEffect(() => {
        if (!started) return undefined;
        setTyped(reduced ? total : 0);
        setPhase("thinking");
        const t = setTimeout(() => setPhase("typing"), reduced ? 0 : 900);
        return () => clearTimeout(t);
    }, [active, started, total]);

    useEffect(() => {
        if (phase !== "typing") return undefined;
        if (typed >= total) {
            setPhase("done");
            return undefined;
        }
        const t = setTimeout(() => setTyped((n) => Math.min(total, n + 2)), 16);
        return () => clearTimeout(t);
    }, [phase, typed, total]);

    useEffect(() => {
        if (phase !== "done" || paused) return undefined;
        const t = setTimeout(
            () => setActive((a) => (a + 1) % scenarios.length),
            6000
        );
        return () => clearTimeout(t);
    }, [phase, paused, active]);

    const chart = useMemo(() => {
        if (s.chart.type === "bars") return <BarsChart chart={s.chart} />;
        if (s.chart.type === "line") return <LineChart chart={s.chart} />;
        return <RingChart chart={s.chart} />;
    }, [s]);

    const showChart = phase === "typing" || phase === "done";
    const done = phase === "done";

    return (
        <section className="intel" id="intelligence">
            <div className="intel-glow" />
            <span className="intel-orb o1" aria-hidden="true" />
            <span className="intel-orb o2" aria-hidden="true" />

            <div className="intel-inner">
                <motion.div
                    className="intel-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h2>
                        Not just numbers. <span className="brand">Answers about you.</span>
                    </h2>
                    <p>
                        Ask a question and watch NEM AI turn your own health data into
                        insights you can understand and act on.
                    </p>
                </motion.div>

                <motion.div
                    className="intel-body"
                    onViewportEnter={() => setStarted(true)}
                    viewport={{ once: true, amount: 0.3 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="intel-aside">
                        <span className="intel-demo-pill">
                            <i /> Interactive demo
                        </span>
                        <h3>Try it like the real app</h3>
                        <ol className="intel-steps">
                            <li>
                                <b>1</b>
                                <span>Tap a suggested question at the bottom of the phone.</span>
                            </li>
                            <li>
                                <b>2</b>
                                <span>Watch NEM AI answer using sample health data.</span>
                            </li>
                            <li>
                                <b>3</b>
                                <span>See which data it used, why, and what to do next.</span>
                            </li>
                        </ol>
                        <p className="intel-sample-note">
                            This is a showcase with example data, not a real person&apos;s
                            health record.
                        </p>
                        <p className="intel-disclaimer">
                            <span aria-hidden="true">{Icons.shield}</span>
                            NEM AI provides general health information and is not a substitute
                            for professional medical advice.
                        </p>
                    </div>

                    <div className="intel-phone" aria-label="NEM AI app demo with sample data">
                        <span className="intel-demo-tag">Demo</span>
                        <div className="intel-screen">
                        <div className="intel-notch" aria-hidden="true" />
                        <div className="intel-status" aria-hidden="true">
                            <span>9:41</span>
                            <span className="intel-status-icons">
                                <i /><i /><i />
                            </span>
                        </div>
                        <div className="intel-chat-bar">
                            <img src={logo} alt="" />
                            <strong>NEM AI</strong>
                            <span className="intel-live">
                                <i /> Sample data
                            </span>
                        </div>

                        <div className="intel-chat-body" ref={bodyRef} aria-live="polite">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="intel-user">{s.question}</div>

                                    <div className="intel-ai">
                                        {phase === "thinking" ? (
                                            <span className="intel-dots" aria-label="NEM AI is thinking">
                                                <i />
                                                <i />
                                                <i />
                                            </span>
                                        ) : (
                                            <p>
                                                {s.answer.slice(0, typed)}
                                                {!done && <span className="intel-caret" />}
                                            </p>
                                        )}
                                    </div>

                                    {showChart && (
                                        <div className="intel-card">
                                            <div className="intel-card-head">
                                                <span>{s.chart.title}</span>
                                                <strong>
                                                    {s.chart.value}
                                                    {s.chart.unit && <small>{s.chart.unit}</small>}
                                                </strong>
                                            </div>
                                            {chart}
                                        </div>
                                    )}

                                    {done && (
                                        <motion.div
                                            className="intel-extra"
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="intel-used">
                                                <span className="intel-tag">{Icons.db} Data used</span>
                                                {s.used.map((u, i) => (
                                                    <motion.span
                                                        key={u}
                                                        className="intel-chip"
                                                        initial={{ opacity: 0, scale: 0.6 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 16,
                                                            delay: 0.15 + i * 0.1,
                                                        }}
                                                    >
                                                        {u}
                                                    </motion.span>
                                                ))}
                                            </div>

                                            <div className="intel-why">
                                                <span className="intel-tag">
                                                    {Icons.spark} Why this answer
                                                </span>
                                                <p>{s.why}</p>
                                            </div>

                                            <div className="intel-next">
                                                <span className="intel-tag">
                                                    {Icons.bulb} Suggested next steps
                                                </span>
                                                <ul>
                                                    {s.next.map((n) => (
                                                        <li key={n}>
                                                            <span aria-hidden="true">{Icons.check}</span>
                                                            {n}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="intel-composer">
                            <div className="intel-chips" role="tablist" aria-label="Sample questions">
                                {scenarios.map((sc, i) => (
                                    <button
                                        key={sc.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === active}
                                        className={`intel-q${i === active ? " active" : ""}`}
                                        onClick={() => setActive(i)}
                                    >
                                        <span className="intel-q-icon">{sc.icon}</span>
                                        <span className="intel-q-label">{sc.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="intel-input" aria-hidden="true">
                                <span>Ask NEM AI about your health…</span>
                                <i>
                                    <svg {...svgProps}>
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </i>
                            </div>
                        </div>
                        <div className="intel-home" aria-hidden="true" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Intelligence;
