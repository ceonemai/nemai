import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import "../Appchat/AppChat.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";
import PriorityPassSection from "./PriorityPassSection";
import TierProgressSection from "./TierProgressSection";
import { fetchPuffCheckIns, fetchPuffLeaderboard, fetchPuffSummary, postPuffCheckIn, resolveMembershipFromPlanCode } from "./puffApi";

const RANGE_TO_DAYS = {
  "7D": 7,
  "15D": 15,
  "1M": 30
};

const RANGE_OPTIONS = ["7D", "15D", "1M"];
const ALLOWED_RANGE_DAYS = [7, 15, 30];
const SIDEBAR_SMOOTH_STORAGE_KEY = "nemai-sidebar-smooth-until";
const SIDEBAR_SMOOTH_DURATION_MS = 360;

const redactEmail = (rawEmail) => {
  const value = String(rawEmail || "").trim();
  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex === value.length - 1) return "hidden@user";

  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  const localVisible = local.slice(0, Math.min(5, local.length));
  const localMasked = "*".repeat(Math.max(0, local.length - localVisible.length));

  return `${localVisible}${localMasked}@${domain}`;
};

const normalizePuffPointSeries = (series = []) => {
  return series
    .map((item) => ({
      date: String(item?.date || ""),
      earnedPoints: Number(item?.net_amount ?? item?.earned_points ?? item?.earnedPoints ?? 0)
    }))
    .filter((item) => item.date && Number.isFinite(item.earnedPoints))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const getCheckInWeekdayLabel = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getCheckInDateLabel = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getPointDayLabel = (isoDate, rangeKey = "7D") => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  if (rangeKey === "7D") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PuffLineChart = ({ data, selectedRange }) => {
  const chartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const [chartWidth, setChartWidth] = useState(640);

  useEffect(() => {
    setActiveIndex(data.length - 1);
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    const updateWidth = () => {
      const nextWidth = chartRef.current?.clientWidth || 640;
      setChartWidth(nextWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, []);

  const chartHeight = 260;
  const padding = { top: 18, right: 16, bottom: 36, left: 14 };
  const innerWidth = Math.max(120, chartWidth - padding.left - padding.right);
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const maxY = Math.max(10, ...data.map((d) => d.earnedPoints));
  const minY = 0;

  const points = data.map((item, index) => {
    const x = padding.left + (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);
    const yRatio = (item.earnedPoints - minY) / (maxY - minY || 1);
    const y = padding.top + (1 - yRatio) * innerHeight;
    return { ...item, x, y };
  });

  const createSmoothPath = (coords) => {
    if (!coords.length) return "";
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i += 1) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cpx1 = (prev.x + curr.x) / 2;
      const cpy1 = prev.y;
      const cpx2 = (prev.x + curr.x) / 2;
      const cpy2 = curr.y;
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || padding.left} ${chartHeight - padding.bottom} L ${points[0]?.x || padding.left} ${chartHeight - padding.bottom} Z`;

  const tickCount = chartWidth <= 520 ? 4 : chartWidth <= 900 ? 6 : 8;
  const tickIndexes = new Set([0, data.length - 1]);
  if (data.length > 2) {
    const step = Math.max(1, Math.ceil((data.length - 1) / (tickCount - 1)));
    for (let i = step; i < data.length - 1; i += step) tickIndexes.add(i);
  }

  const activePoint = points[activeIndex] || points[points.length - 1];

  return (
    <div className="puff-line-chart-wrap" ref={chartRef}>
      {activePoint && (
        <div
          className="puff-chart-tooltip"
          style={{
            left: `${(activePoint.x / chartWidth) * 100}%`,
            top: `${(activePoint.y / chartHeight) * 100}%`
          }}
        >
          <strong>{activePoint.earnedPoints} pts</strong>
          <span>{getPointDayLabel(activePoint.date, selectedRange)}</span>
        </div>
      )}

      <svg className="puff-line-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Puff points earned trend line">
        <defs>
          <linearGradient id="puffLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34B6D4" />
            <stop offset="100%" stopColor="#1FA97A" />
          </linearGradient>
          <linearGradient id="puffAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(33, 135, 170, 0.28)" />
            <stop offset="100%" stopColor="rgba(33, 135, 170, 0.02)" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + innerHeight * ratio;
          return <line key={ratio} x1={padding.left} y1={y} x2={padding.left + innerWidth} y2={y} className="puff-grid-line" />;
        })}

        <path d={areaPath} fill="url(#puffAreaGradient)" />
        <path d={linePath} fill="none" stroke="url(#puffLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {activePoint && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={chartHeight - padding.bottom}
            className="puff-active-line"
          />
        )}

        {points.map((point, index) => (
          <g
            key={point.date}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            className="puff-point-dot-group"
          >
            <circle cx={point.x} cy={point.y} r={activeIndex === index ? 5 : 3.2} className={`puff-point-dot ${activeIndex === index ? "active" : ""}`} />
          </g>
        ))}

        {points.map((point, index) => (
          tickIndexes.has(index) ? (
            <text key={`${point.date}-label`} x={point.x} y={chartHeight - 12} textAnchor="middle" className="puff-axis-label">
              {getPointDayLabel(point.date, selectedRange)}
            </text>
          ) : null
        ))}
      </svg>
    </div>
  );
};

function DashboardPageSkeleton() {
  return (
    <section className="puff-dashboard-page dashboard-page-skeleton" aria-busy="true" aria-live="polite" aria-label="Loading Puff Dashboard">
      <div className="dash-skel-card dash-skel-hero" />

      <section className="daily-checkin-section">
        <div className="dash-skel-line dash-skel-line-title" />
        <div className="daily-checkin-grid">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="dash-skel-card dash-skel-checkin-day" key={index} />
          ))}
        </div>
        <div className="dash-skel-line dash-skel-btn" />
      </section>

      <div className="puff-metrics-grid">
        <div className="dash-skel-card dash-skel-metric" />
        <div className="dash-skel-card dash-skel-metric" />
        <div className="dash-skel-card dash-skel-metric" />
      </div>

      <section className="puff-point-graph-card">
        <div className="dash-skel-line dash-skel-line-title" />
        <div className="dash-skel-card dash-skel-graph" />
      </section>

      <section className="leaderboard-section">
        <div className="dash-skel-line dash-skel-line-title" />
        <div className="leaderboard-layout">
          <div className="dash-skel-card dash-skel-top-users" />
          <div className="dash-skel-card dash-skel-table" />
        </div>
      </section>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessToken, user, logout } = usePrivy();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [keepSidebarExpanded, setKeepSidebarExpanded] = useState(false);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const logoutMenuRef = useRef(null);

  useEffect(() => {
    if (!isLogoutMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
        setIsLogoutMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLogoutMenuOpen]);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
  const hasLoadedSummaryRef = useRef(false);
  const summaryCacheRef = useRef({});
  const [selectedPointRange, setSelectedPointRange] = useState("7D");
  const [puffPointSeries, setPuffPointSeries] = useState([]);
  const [graphLoading, setGraphLoading] = useState(true);
  const [puffSummary, setPuffSummary] = useState(null);
  const [priorityPassLoading, setPriorityPassLoading] = useState(true);
  const [priorityPassError, setPriorityPassError] = useState("");
  const [leaderboardItems, setLeaderboardItems] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserEntry, setCurrentUserEntry] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [membershipState, setMembershipState] = useState(() => resolveMembershipFromPlanCode("free"));
  const [checkInItems, setCheckInItems] = useState([]);
  const [checkInLoading, setCheckInLoading] = useState(true);
  const [checkInError, setCheckInError] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInActionError, setCheckInActionError] = useState("");
  const selectedRangeDays = RANGE_TO_DAYS[selectedPointRange] || 7;

  const handleRangeChange = (rangeKey, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (rangeKey === selectedPointRange) return;
    setSelectedPointRange(rangeKey);
  };

  useEffect(() => {
    let isMounted = true;

    const loadPuffDashboard = async () => {
      const cachedSummary = summaryCacheRef.current[selectedRangeDays];

      if (cachedSummary) {
        hasLoadedSummaryRef.current = true;
        setPriorityPassLoading(false);
        setGraphLoading(false);
        setPriorityPassError("");
        setPuffSummary(cachedSummary);
        setMembershipState(resolveMembershipFromPlanCode(cachedSummary?.subscription?.plan_code));
        setPuffPointSeries(cachedSummary?.daily_series || []);
        return;
      }

      const isInitialLoad = !hasLoadedSummaryRef.current;
      if (isInitialLoad) {
        setPriorityPassLoading(true);
      }
      setGraphLoading(true);
      setPriorityPassError("");

      try {
        const summary = await fetchPuffSummary(getAccessToken, selectedRangeDays);
        if (!isMounted) return;

        summaryCacheRef.current[selectedRangeDays] = summary;
        hasLoadedSummaryRef.current = true;
        setPuffSummary(summary);
        setMembershipState(resolveMembershipFromPlanCode(summary?.subscription?.plan_code));
        setPuffPointSeries(summary?.daily_series || []);

        const preloadDays = ALLOWED_RANGE_DAYS.filter((days) => days !== selectedRangeDays && !summaryCacheRef.current[days]);
        preloadDays.forEach(async (days) => {
          try {
            const preloadSummary = await fetchPuffSummary(getAccessToken, days);
            summaryCacheRef.current[days] = preloadSummary;
          } catch (preloadError) {
            console.warn(`Failed to preload puff dashboard for ${days} days:`, preloadError);
          }
        });
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load puff dashboard:", error);
        setPriorityPassError("Unable to load Puff Dashboard data right now.");

        // Preserve already-loaded dashboard state when range refetch fails.
        if (!hasLoadedSummaryRef.current) {
          setMembershipState(resolveMembershipFromPlanCode("free"));
          setPuffPointSeries([]);
        }
      } finally {
        if (isMounted) {
          setGraphLoading(false);
        }
        if (isMounted && isInitialLoad) {
          setPriorityPassLoading(false);
        }
      }
    };

    loadPuffDashboard();

    return () => {
      isMounted = false;
    };
  }, [getAccessToken, selectedRangeDays]);

  const refreshPuffSummary = useCallback(async () => {
    try {
      const summary = await fetchPuffSummary(getAccessToken, selectedRangeDays);
      summaryCacheRef.current[selectedRangeDays] = summary;
      setPuffSummary(summary);
      setMembershipState(resolveMembershipFromPlanCode(summary?.subscription?.plan_code));
      setPuffPointSeries(summary?.daily_series || []);
    } catch (error) {
      console.error("Failed to refresh puff summary after check-in:", error);
    }
  }, [getAccessToken, selectedRangeDays]);

  useEffect(() => {
    let isMounted = true;

    const loadLeaderboard = async () => {
      setLeaderboardLoading(true);
      setLeaderboardError("");

      try {
        const leaderboard = await fetchPuffLeaderboard(getAccessToken);
        if (!isMounted) return;

        setLeaderboardItems(leaderboard?.items || []);
        setCurrentUserRank(Number.isFinite(leaderboard?.current_user?.rank) ? leaderboard.current_user.rank : null);
        setCurrentUserId(String(leaderboard?.current_user?.user_id || ""));
        setCurrentUserEntry(leaderboard?.current_user || null);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load puff leaderboard:", error);
        setLeaderboardError("Unable to load leaderboard right now.");
      } finally {
        if (isMounted) {
          setLeaderboardLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [getAccessToken]);

  const loadCheckInHistory = useCallback(async () => {
    setCheckInError("");

    try {
      const history = await fetchPuffCheckIns(getAccessToken);
      setCheckInItems(history?.items || []);
    } catch (error) {
      console.error("Failed to load check-in history:", error);
      setCheckInError("Unable to load check-in history right now.");
    } finally {
      setCheckInLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadCheckInHistory();
  }, [loadCheckInHistory]);

  useEffect(() => {
    if (hasBootstrapped) return;
    if (!priorityPassLoading && !graphLoading && !leaderboardLoading && !checkInLoading) {
      setHasBootstrapped(true);
    }
  }, [hasBootstrapped, priorityPassLoading, graphLoading, leaderboardLoading, checkInLoading]);

  const chartPointSeries = useMemo(() => {
    const normalizedSeries = normalizePuffPointSeries(puffPointSeries);
    const maxDays = RANGE_TO_DAYS[selectedPointRange] || 7;
    return normalizedSeries.slice(-maxDays);
  }, [puffPointSeries, selectedPointRange]);

  const totalPuffPoints = useMemo(
    () => puffSummary?.puff_point_total ?? chartPointSeries.reduce((sum, row) => sum + row.earnedPoints, 0),
    [puffSummary, chartPointSeries]
  );

  const leaderboardRows = useMemo(() => {
    const rows = [...leaderboardItems]
      .map((item) => ({
        rank: Number(item?.rank ?? 0),
        userId: String(item?.user_id ?? ""),
        email: redactEmail(item?.email ?? item?.user_email ?? item?.display_name ?? ""),
        points: Number(item?.puff_point_total ?? 0)
      }))
      .filter((item) => item.rank > 0 && item.userId);

    // The API only returns the top-N items, so splice in the current user's row
    // (from current_user) when their rank falls outside that window.
    const currentUserId = String(currentUserEntry?.user_id ?? "");
    if (currentUserId && !rows.some((row) => row.userId === currentUserId)) {
      const rank = Number(currentUserEntry?.rank ?? 0);
      if (rank > 0) {
        rows.push({
          rank,
          userId: currentUserId,
          email: redactEmail(currentUserEntry?.email ?? currentUserEntry?.user_email ?? currentUserEntry?.display_name ?? ""),
          points: Number(currentUserEntry?.puff_point_total ?? 0)
        });
      }
    }

    return rows.sort((a, b) => a.rank - b.rank);
  }, [leaderboardItems, currentUserEntry]);

  const topFiveRows = useMemo(() => leaderboardRows.slice(0, 5), [leaderboardRows]);

  const loginUserId = user?.id || "";
  const activeUserId = loginUserId || currentUserId;

  const visibleLeaderboardRows = useMemo(() => {
    const WINDOW_SIZE = 5;
    if (leaderboardRows.length <= WINDOW_SIZE) return leaderboardRows;

    let currentUserIndex = activeUserId
      ? leaderboardRows.findIndex((row) => row.userId === activeUserId)
      : -1;
    if (currentUserIndex < 0 && Number.isFinite(currentUserRank)) {
      currentUserIndex = leaderboardRows.findIndex((row) => row.rank === currentUserRank);
    }
    if (currentUserIndex < 0) return leaderboardRows.slice(0, WINDOW_SIZE);

    // Shift the window inward at the list edges so five rows always render.
    const start = Math.min(
      Math.max(0, currentUserIndex - 2),
      leaderboardRows.length - WINDOW_SIZE
    );
    return leaderboardRows.slice(start, start + WINDOW_SIZE);
  }, [leaderboardRows, currentUserRank, activeUserId]);

  const earnedBadges = useMemo(
    () => [
      { icon: "🏅", name: "First Steps", desc: "Completed your first chat" },
      { icon: "🔥", name: "7-Day Streak", desc: "Active for 7 days in a row" },
      { icon: "⚡", name: "Fast Learner", desc: "Earned 100+ points in one week" },
      { icon: "👑", name: "Top 10", desc: "Reached top 10 in leaderboard" }
    ],
    []
  );

  const dailyCheckInDays = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return [...checkInItems]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        day: item.date,
        weekday: getCheckInWeekdayLabel(item.date),
        dateLabel: getCheckInDateLabel(item.date),
        checkedIn: item.checked_in,
        isPending: item.date === todayIso && !item.checked_in,
        state: item.checked_in ? "done" : item.date === todayIso ? "today" : "locked"
      }));
  }, [checkInItems]);

  const todayCheckInItem = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    return checkInItems.find((item) => item.date === todayIso) || checkInItems[checkInItems.length - 1] || null;
  }, [checkInItems]);

  const isTodayCheckedIn = Boolean(todayCheckInItem?.checked_in);

  const handleCheckIn = async () => {
    if (isCheckingIn || isTodayCheckedIn) return;

    setIsCheckingIn(true);
    setCheckInActionError("");

    try {
      await postPuffCheckIn(getAccessToken);
      await Promise.all([loadCheckInHistory(), refreshPuffSummary()]);
    } catch (error) {
      console.error("Failed to check in:", error);
      setCheckInActionError("Unable to check in right now. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const rawUntil = window.sessionStorage.getItem(SIDEBAR_SMOOTH_STORAGE_KEY);
    const until = Number(rawUntil || 0);
    if (!Number.isFinite(until) || until <= Date.now()) {
      window.sessionStorage.removeItem(SIDEBAR_SMOOTH_STORAGE_KEY);
      return undefined;
    }

    setKeepSidebarExpanded(true);
    const remainingMs = Math.max(0, until - Date.now());
    const timerId = window.setTimeout(() => {
      setKeepSidebarExpanded(false);
      window.sessionStorage.removeItem(SIDEBAR_SMOOTH_STORAGE_KEY);
    }, remainingMs);

    return () => window.clearTimeout(timerId);
  }, []);

  const smoothSidebarDuringNavigation = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const until = Date.now() + SIDEBAR_SMOOTH_DURATION_MS;
    window.sessionStorage.setItem(SIDEBAR_SMOOTH_STORAGE_KEY, String(until));
    setKeepSidebarExpanded(true);
  };

  const handleOpenChatView = () => {
    smoothSidebarDuringNavigation();
    setIsSidebarOpen(false);
    navigate("/");
  };

  const handleOpenDashboardView = () => {
    smoothSidebarDuringNavigation();
    setIsSidebarOpen(false);
    navigate("/dashboard");
  };

  const handleOpenReferrals = () => {
    smoothSidebarDuringNavigation();
    setIsSidebarOpen(false);
    navigate("/referrals");
  };

  return (
    <div className="appchat-layout">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`appchat-sidebar ${isSidebarOpen ? "open" : ""} ${keepSidebarExpanded ? "keep-expanded" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info">
            <img src={logo} alt="NEM AI Logo" className="sidebar-logo" />
            <div className="brand-title">NEM AI</div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="sidebar-primary-actions">
          <button className="new-chat-btn sidebar-nav-btn sidebar-dashboard-btn active" onClick={handleOpenDashboardView} aria-label="Open Puff Dashboard">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="4" rx="1.5"></rect>
                <rect x="14" y="10" width="7" height="11" rx="1.5"></rect>
                <rect x="3" y="13" width="7" height="8" rx="1.5"></rect>
              </svg>
            </span>
            <span className="sidebar-text">Puff Dashboard</span>
          </button>

          <button className={`new-chat-btn sidebar-nav-btn ${location.pathname === "/referrals" ? "active" : ""}`} onClick={handleOpenReferrals} aria-label="Open Referrals">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="sidebar-text">Referrals</span>
          </button>
          <button className="new-chat-btn sidebar-nav-btn" onClick={handleOpenChatView} aria-label="Open Chat">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span className="sidebar-text">Chat</span>
          </button>
        </div>
        <div className="sidebar-footer" ref={logoutMenuRef}>
          <AnimatePresence>
            {isLogoutMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { clipPath: "inset(0% 0% 0% 0% round 8px)", transition: { type: "spring", bounce: 0, duration: 0.5, delayChildren: 0.2, staggerChildren: 0.05 } },
                  closed: { clipPath: "inset(90% 50% 10% 50% round 8px)", transition: { type: "spring", bounce: 0, duration: 0.3 } }
                }}
                className="profile-menu-popup"
              >
                <motion.div
                  variants={{ open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, closed: { opacity: 0, y: 20, transition: { duration: 0.2 } } }}
                  onClick={() => { setIsLogoutMenuOpen(false); logout(); }} className="profile-menu-item logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Log out
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <button type="button" className="user-profile" onClick={() => setIsLogoutMenuOpen((open) => !open)} aria-label="Account menu">
            <div className="user-avatar">{(user?.name || user?.email?.address || user?.google?.email || "User").charAt(0).toUpperCase()}</div>
            <span className="user-name">{user?.name || user?.email?.address || user?.google?.email || "User"}</span>
          </button>
        </div>
      </aside>

      <main className="appchat-main dashboard">
        <div className="mobile-header dashboard">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="mobile-title">NEM AI</span>
        </div>

        {!hasBootstrapped ? (
          <DashboardPageSkeleton />
        ) : (
        <section className="puff-dashboard-page">
          <PriorityPassSection
            membershipState={membershipState}
            loading={priorityPassLoading}
            errorMessage={priorityPassError}
          />

          <TierProgressSection points={totalPuffPoints} />

          <section className="daily-checkin-section" aria-label="Daily Check-in">
            <h2 className="daily-checkin-title">Daily Check-in</h2>

            <div className="daily-checkin-grid" role="list" aria-label="Daily check-in days">
              {checkInLoading && dailyCheckInDays.length === 0 ? (
                <p className="daily-checkin-note">Loading check-in history...</p>
              ) : (
                dailyCheckInDays.map((item) => (
                  <article
                    key={item.day}
                    className={`daily-checkin-day ${item.state}`}
                    role="listitem"
                    aria-label={`${item.weekday} ${item.dateLabel}: ${item.checkedIn ? "checked in" : item.isPending ? "pending" : "not checked in"}`}
                  >
                    <span className="daily-checkin-day-label">{item.weekday}</span>
                    <span className="daily-checkin-day-date">{item.dateLabel}</span>
                    <span className="daily-checkin-day-status">
                      {item.isPending ? (
                        <span className="daily-checkin-day-spinner" aria-hidden="true" />
                      ) : item.checkedIn ? (
                        "\u2713"
                      ) : (
                        "\u2715"
                      )}
                    </span>
                  </article>
                ))
              )}
            </div>

            <div className="daily-checkin-actions">
              <button
                type="button"
                className="daily-checkin-claim-btn"
                onClick={handleCheckIn}
                disabled={isCheckingIn || isTodayCheckedIn}
              >
                {isCheckingIn ? "Checking in..." : isTodayCheckedIn ? "Checked In" : "Check-in"}
              </button>
            </div>

            {(checkInError || checkInActionError) && (
              <p className="daily-checkin-note">{checkInActionError || checkInError}</p>
            )}
          </section>

          <section className="puff-point-graph-card">
            <div className="puff-point-graph-header">
              <div>
                <h2>Daily Point Earn Graph</h2>
              </div>
            </div>

            <div className="puff-point-graph-layout">
              {graphLoading ? (
                <div className="puff-line-chart-loading" role="status" aria-live="polite" aria-label="Loading graph data">
                  <span className="puff-line-chart-loading-spinner" aria-hidden="true" />
                  <strong>Loading graph data...</strong>
                </div>
              ) : (
                <PuffLineChart data={chartPointSeries} selectedRange={selectedPointRange} />
              )}

              <div className="puff-range-selector" aria-label="Select chart time range">
                {RANGE_OPTIONS.map((rangeOption) => (
                  <button
                    key={rangeOption}
                    type="button"
                    className={`puff-range-btn ${selectedPointRange === rangeOption ? "active" : ""}`}
                    onClick={(event) => handleRangeChange(rangeOption, event)}
                  >
                    {rangeOption}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="leaderboard-section">
            <div className="leaderboard-section-top">
              <div className="leaderboard-section-head">
                <h2>Leaderboard</h2>
              </div>

              <article className="leaderboard-rank-highlight" aria-label="Your leaderboard rank">
                <span className="leaderboard-rank-highlight-label">Your Rank</span>
                <strong className="leaderboard-rank-highlight-value">
                  {Number.isFinite(currentUserRank)
                    ? `#${currentUserRank}`
                    : Number.isFinite(puffSummary?.leaderboard_rank)
                      ? `#${puffSummary.leaderboard_rank}`
                      : "-"}
                </strong>
                {leaderboardLoading ? <span className="leaderboard-rank-highlight-hint">Loading your rank...</span> : null}
              </article>
            </div>

            <div className="leaderboard-layout">
              <article className="leaderboard-top-users-card">
                <div className="leaderboard-top-users-head">
                  <span>Top 5 User</span>
                </div>
                <div className="leaderboard-top-users-list">
                  {topFiveRows.map((row) => (
                    <div
                      className={`leaderboard-top-user-item rank-${row.rank} ${activeUserId && activeUserId === row.userId ? "current-user" : ""}`}
                      key={row.userId}
                    >
                      <span className="leaderboard-top-user-rank">#{row.rank}</span>
                      <strong className="leaderboard-top-user-name">{row.email}</strong>
                    </div>
                  ))}
                  {!topFiveRows.length && !leaderboardLoading && (
                    <div className="leaderboard-top-user-empty">No leaderboard users yet.</div>
                  )}
                  {!topFiveRows.length && leaderboardLoading && (
                    <div className="leaderboard-top-user-empty">Loading top users...</div>
                  )}
                </div>
              </article>

              <div className="leaderboard-table-card">
                <div className="leaderboard-table-head">
                  <span>Rank</span>
                  <span>Email</span>
                  <span>Points</span>
                </div>
                {visibleLeaderboardRows.map((row) => (
                  <div
                    className={`leaderboard-row rank-${row.rank} ${activeUserId && activeUserId === row.userId ? "current-user" : ""}`}
                    key={row.userId}
                  >
                    <span className="leaderboard-rank">#{row.rank}</span>
                    <span className="leaderboard-user">{row.email}</span>
                    <span className="leaderboard-points">{row.points}</span>
                  </div>
                ))}
                {!leaderboardRows.length && !leaderboardLoading && (
                  <div className="leaderboard-row leaderboard-row-empty">
                    <span className="leaderboard-rank">-</span>
                    <span className="leaderboard-user">{leaderboardError || "No leaderboard data yet."}</span>
                    <span className="leaderboard-points">-</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="leaderboard-badges-card badges-disabled" aria-label="Badges feature coming soon">
            <div className="leaderboard-badges-head">
              <h2>Your Earned Badges</h2>
              <p>Coming soon.</p>
            </div>

            <div className="leaderboard-badges-grid">
              {earnedBadges.map((badge) => (
                <article className="leaderboard-badge-item" key={badge.name}>
                  <div className="leaderboard-badge-icon" aria-hidden="true">{badge.icon}</div>
                  <div className="leaderboard-badge-content">
                    <strong>{badge.name}</strong>
                    <span>{badge.desc}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
        )}
      </main>

      <nav className={`appchat-footer-tabbar ${location.pathname === "/referrals" ? "is-referrals" : "is-dashboard"}`} aria-label="Primary actions">
        <span className="footer-tab-indicator" aria-hidden="true"></span>
        <button
          type="button"
          className="footer-tab-btn"
          onClick={handleOpenChatView}
          aria-label="Open Chat"
        >
          <span className="puff-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <span className="footer-tab-label">Chat</span>
        </button>

        <button
          type="button"
          className="footer-tab-btn active"
          onClick={handleOpenDashboardView}
          aria-label="Open Puff Dashboard"
        >
          <span className="puff-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="3" width="7" height="4" rx="1.5"></rect>
              <rect x="14" y="10" width="7" height="11" rx="1.5"></rect>
              <rect x="3" y="13" width="7" height="8" rx="1.5"></rect>
            </svg>
          </span>
          <span className="footer-tab-label">Puff Dashboard</span>
        </button>
        <button type="button" className="footer-tab-btn" onClick={handleOpenReferrals} aria-label="Open Referrals">
          <span className="puff-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <span className="footer-tab-label">Referrals</span>
        </button>
      </nav>
    </div>
  );
}