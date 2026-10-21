import { useEffect, useRef, useState } from "react";
import {
  BADGE_RING_CIRCUMFERENCE,
  BADGE_RING_RADIUS,
  getBadgeProgress,
  getBadgeRingDashOffset,
  getConsecutiveCheckInDays,
  getPointsEarnedThisWeek
} from "./badgeProgress";
import "./DashboardBadges.css";

const BADGE_TARGETS = {
  streak: 7,
  weeklyPoints: 100,
  topRank: 10
};

const BADGE_ICONS = {
  chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-8a7.5 7.5 0 1 1 17 0Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
  streak: <><path d="M12 22c4.4 0 7-2.7 7-6.5 0-2.4-1.3-4.4-3.7-6.5.2 2.2-.5 3.3-1.6 3.9C13 8.5 11.2 5.3 8.2 3 8.7 7.2 5 9.8 5 15.1 5 19.2 7.8 22 12 22Z" /><path d="M12 22c-1.7-.8-2.5-2.1-2.5-3.8 0-1.3.8-2.5 2.5-3.8 1.7 1.3 2.5 2.5 2.5 3.8 0 1.7-.8 3-2.5 3.8Z" /></>,
  spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6" /></>
};

/** @typedef {import("./badgeProgress").Badge} Badge */

// TODO: Replace the mock earned signal when Dashboard can read chat history.
/** @type {Badge} */
const MOCK_FIRST_STEPS = {
  id: "first-steps",
  name: "First Steps",
  description: "Completed your first chat",
  icon: "chat",
  current: 1,
  target: 1,
  unit: "chat",
  earnedAt: "mock-earned"
};

const TABS = [
  { id: "all", label: "All" },
  { id: "ongoing", label: "Ongoing" },
  { id: "earned", label: "Earned" }
];

const formatCount = (value) => Number.isInteger(value) ? String(value) : value.toFixed(1);

function createDashboardBadges({ checkInItems, dailyPointSeries, currentUserRank, sources }) {
  const streak = sources.checkInsAvailable
    ? getConsecutiveCheckInDays(checkInItems)
    : null;
  const weeklyPoints = sources.pointsAvailable
    ? getPointsEarnedThisWeek(dailyPointSeries)
    : null;
  const rank = sources.rankAvailable && Number.isFinite(currentUserRank) && currentUserRank > 0
    ? currentUserRank
    : null;
  const top10Current = rank === null ? null : Math.min(BADGE_TARGETS.topRank, rank);
  const top10Target = rank === null ? BADGE_TARGETS.topRank : Math.max(BADGE_TARGETS.topRank, rank);

  return [
    {
      ...MOCK_FIRST_STEPS,
    },
    {
      id: "7-day-streak",
      name: "7-Day Streak",
      description: "Active for 7 days in a row",
      icon: "streak",
      current: streak,
      target: BADGE_TARGETS.streak,
      unit: "days",
      available: streak !== null
    },
    {
      id: "fast-learner",
      name: "Fast Learner",
      description: "Earn 100+ points in one week",
      icon: "spark",
      current: weeklyPoints,
      target: BADGE_TARGETS.weeklyPoints,
      unit: "pts",
      available: weeklyPoints !== null
    },
    {
      id: "top-10",
      name: "Top 10",
      description: "Reach top 10 on the leaderboard",
      icon: "trophy",
      current: top10Current,
      target: top10Target,
      unit: "rank",
      available: rank !== null,
      earnedAt: rank !== null && rank <= BADGE_TARGETS.topRank ? "rank-achieved" : null,
      statusText: rank === null ? "Rank unavailable" : rank <= BADGE_TARGETS.topRank ? `Earned · Rank #${rank}` : `Rank #${rank} → #${BADGE_TARGETS.topRank}`,
      pillText: rank === null ? "—" : rank <= BADGE_TARGETS.topRank ? "Done" : "Top 10"
    }
  ];
}

function BadgeIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {BADGE_ICONS[icon]}
    </svg>
  );
}

function BadgeRing({ badge, state, progress, percent, pillText }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const frameRef = useRef(null);
  const dashOffset = getBadgeRingDashOffset(progress);
  const effectiveState = state === "unavailable" ? "not-started" : state;

  useEffect(() => {
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setShouldAnimate(true);
    });

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className={`dashboard-badge-ring ${effectiveState}`}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={percent}
      aria-valuetext={state === "unavailable" ? "Progress unavailable" : badge.statusText || `${percent}%`}
      aria-label={`${badge.name} progress`}
    >
      <svg className="dashboard-badge-ring-svg" viewBox="0 0 84 84" aria-hidden="true">
        <circle className="dashboard-badge-ring-track" cx="42" cy="42" r={BADGE_RING_RADIUS} />
        <circle
          className="dashboard-badge-ring-progress"
          cx="42"
          cy="42"
          r={BADGE_RING_RADIUS}
          strokeDasharray={BADGE_RING_CIRCUMFERENCE}
          strokeDashoffset={shouldAnimate ? dashOffset : BADGE_RING_CIRCUMFERENCE}
        />
      </svg>
      <span className="dashboard-badge-medallion"><BadgeIcon icon={badge.icon} /></span>
      <span className="dashboard-badge-ring-pill">{pillText}</span>
    </div>
  );
}

function BadgeCard({ badge }) {
  const progressInfo = getBadgeProgress(badge);
  const statusText = progressInfo.state === "unavailable"
    ? "Progress unavailable"
    : badge.statusText || (progressInfo.earned
      ? "Earned"
      : `${formatCount(badge.current)} / ${formatCount(badge.target)} ${badge.unit}`);
  const pillText = badge.pillText || (progressInfo.earned ? "Done" : `${progressInfo.percent}%`);

  return (
    <article className={`dashboard-badge-card ${progressInfo.state}`}>
      <BadgeRing
        badge={{ ...badge, statusText }}
        state={progressInfo.state}
        progress={progressInfo.progress}
        percent={progressInfo.percent}
        pillText={progressInfo.state === "unavailable" ? "—" : pillText}
      />
      <div className="dashboard-badge-copy">
        <h3>{badge.name}</h3>
        <p>{badge.description}</p>
        <span className={`dashboard-badge-status ${progressInfo.state}`}>{statusText}</span>
      </div>
    </article>
  );
}

export default function DashboardBadges({
  checkInItems,
  dailyPointSeries,
  currentUserRank,
  checkInLoading,
  checkInError,
  pointsLoading,
  pointsUnavailable,
  rankLoading,
  rankUnavailable
}) {
  const [activeTab, setActiveTab] = useState("all");
  const tabRefs = useRef([]);
  const badges = createDashboardBadges({
    checkInItems,
    dailyPointSeries,
    currentUserRank,
    sources: {
      checkInsAvailable: !checkInLoading && !checkInError,
      pointsAvailable: !pointsLoading && !pointsUnavailable,
      rankAvailable: !rankLoading && !rankUnavailable
    }
  });
  const earnedCount = badges.filter((badge) => getBadgeProgress(badge).earned).length;
  const filteredBadges = badges.filter((badge) => {
    const { earned } = getBadgeProgress(badge);
    return activeTab === "all" || (activeTab === "earned" ? earned : !earned);
  });

  const handleTabKeyDown = (event, index) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;

    event.preventDefault();
    const nextTab = TABS[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="dashboard-badges" aria-label="Your badges">
      <div className="dashboard-badges-head">
        <h2>Your Badges</h2>
        <span className="dashboard-badges-earned-count">
          <strong>{earnedCount}</strong> / {badges.length} earned
        </span>
      </div>

      <div className="dashboard-badges-tabs" role="tablist" aria-label="Filter badges">
        {TABS.map((tab, index) => (
          <button
            type="button"
            id={`dashboard-badge-tab-${tab.id}`}
            className={`dashboard-badges-tab ${activeTab === tab.id ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="dashboard-badges-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            key={tab.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="dashboard-badges-grid"
        id="dashboard-badges-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-badge-tab-${activeTab}`}
        tabIndex="0"
      >
        {filteredBadges.map((badge) => <BadgeCard badge={badge} key={badge.id} />)}
      </div>
    </section>
  );
}
