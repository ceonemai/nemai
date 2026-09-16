import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import "./Referral.css";
import logo from "../../assets/images/LogogramFullColor.png";
import { fetchPuffReferralStatus, fetchPuffSummary } from "../Dashboard/puffApi";

const REFERRAL_BASE_URL = "https://app.nemai.io/ref";

const buildReferralLink = (code) => {
  if (!code) return "";
  return `${REFERRAL_BASE_URL}?code=${encodeURIComponent(code)}`;
};

const formatReferralDate = (rawDate) => {
  if (!rawDate || rawDate === "-") return "-";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getStatusClassName = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();
  if (["completed", "complete", "success", "successful", "used", "approved"].includes(normalizedStatus)) return "success";
  if (["failed", "rejected", "expired", "cancelled", "canceled"].includes(normalizedStatus)) return "failed";
  return "pending";
};

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 20v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2.5-2.5C10 7.5 12 8 12 8ZM12 8h4.5a2.5 2.5 0 1 0-2.5-2.5C14 7.5 12 8 12 8Z" />
  </svg>
);

function ReferralPage() {
  const navigate = useNavigate();
  const { getAccessToken, user, logout } = usePrivy();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [referralStatus, setReferralStatus] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [isLoadingReferral, setIsLoadingReferral] = useState(true);
  const [referralError, setReferralError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
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

  const displayName = user?.email?.address || user?.google?.email || "your friends";
  const sidebarUserName = user?.name || user?.email?.address || user?.google?.email || "User";
  const referralCode = referralStatus?.code || "";
  const referralLink = buildReferralLink(referralCode);
  const referralItems = referralStatus?.items || [];
  const isLocked = referralStatus?.locked === true;
  const unlockAtPoints = referralStatus?.unlock_at_points || 50;
  // ใช้แสดงหลอด progress ตอนยังไม่ปลดล็อค ไม่ให้เกิน 100% แม้แต้มปัจจุบันจะเกินเกณฑ์ปลดล็อคชั่วคราว
  const unlockProgressPercent = Math.max(0, Math.min(100, Math.round((currentPoints / (unlockAtPoints || 1)) * 100)));
  // เริ่มจาก 0 แล้วค่อย animate ไปยังค่าจริง เพื่อให้หลอด progress ไหลลื่นตอนโชว์ครั้งแรก
  const [animatedProgressPercent, setAnimatedProgressPercent] = useState(0);
  // นับเฉพาะรายการที่ status เป็น success จริง ไม่นับ pending/failed แม้ backend จะส่ง referrals_used มา
  const referralsUsed = referralItems.filter((item) => getStatusClassName(item.status) === "success").length;

  const loadReferralStatus = useCallback(async () => {
    setIsLoadingReferral(true);
    setReferralError("");
    setShareMessage("");

    try {
      const [status, summary] = await Promise.all([
        fetchPuffReferralStatus(getAccessToken),
        fetchPuffSummary(getAccessToken).catch(() => null)
      ]);
      setReferralStatus(status);
      if (summary) setCurrentPoints(Number(summary.puff_point_total) || 0);
    } catch (error) {
      console.error("Failed to load puff referral status:", error);
      setReferralError("Unable to load your referral status. Please try again.");
    } finally {
      setIsLoadingReferral(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoadingReferral(true);
      setReferralError("");
      setShareMessage("");

      try {
        const [status, summary] = await Promise.all([
          fetchPuffReferralStatus(getAccessToken),
          fetchPuffSummary(getAccessToken).catch(() => null)
        ]);
        if (!isMounted) return;
        setReferralStatus(status);
        if (summary) setCurrentPoints(Number(summary.puff_point_total) || 0);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load puff referral status:", error);
        setReferralError("Unable to load your referral status. Please try again.");
      } finally {
        if (isMounted) setIsLoadingReferral(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [getAccessToken]);

  useEffect(() => {
    if (isLoadingReferral || !isLocked) {
      setAnimatedProgressPercent(0);
      return undefined;
    }

    setAnimatedProgressPercent(0);
    const frame = requestAnimationFrame(() => setAnimatedProgressPercent(unlockProgressPercent));
    return () => cancelAnimationFrame(frame);
  }, [isLoadingReferral, isLocked, unlockProgressPercent]);

  const copyReferralLink = async () => {
    if (!referralLink) {
      setShareMessage("Referral code is not available yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setShareMessage("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setShareMessage("Copy is unavailable in this browser.");
    }
  };

  const shareReferralLink = async () => {
    if (!referralLink) {
      setShareMessage("Referral code is not available yet.");
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Join NEM AI",
        text: "Join me on NEM AI and earn rewards together.",
        url: referralLink
      });
      return;
    }

    await copyReferralLink();
    setShareMessage("Link copied. Share it with your friends.");
  };

  return (
    <div className="appchat-layout referral-layout">
      {isSidebarOpen && <div className="sidebar-overlay referral-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`appchat-sidebar referral-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info">
            <img src={logo} alt="NEM AI Logo" className="sidebar-logo" />
            <div className="brand-title">NEM AI</div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">×</button>
        </div>
        <div className="sidebar-primary-actions">
          <button className="new-chat-btn sidebar-nav-btn sidebar-dashboard-btn" onClick={() => { setIsSidebarOpen(false); navigate("/dashboard"); }} aria-label="Open Puff Dashboard">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="14" y="10" width="7" height="11" rx="1.5" /><rect x="3" y="13" width="7" height="8" rx="1.5" /></svg>
            </span>
            <span className="sidebar-text">Puff Dashboard</span>
          </button>
          <button className="new-chat-btn sidebar-nav-btn active" onClick={() => { setIsSidebarOpen(false); navigate("/referrals"); }} aria-label="Open Referrals">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </span>
            <span className="sidebar-text">Referrals</span>
          </button>
          <button className="new-chat-btn sidebar-nav-btn" onClick={() => { setIsSidebarOpen(false); navigate("/"); }} aria-label="Open Chat">
            <span className="puff-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
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
            <div className="user-avatar">{sidebarUserName.charAt(0).toUpperCase()}</div>
            <span className="user-name">{sidebarUserName}</span>
          </button>
        </div>
      </aside>

      <main className="appchat-main dashboard referral-main">
        <div className="mobile-header dashboard">
          <button type="button" className="menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <span className="mobile-title">NEM AI</span>
        </div>

        <section className={`referral-panel ${isLocked ? "referral-panel-locked" : ""}`} aria-labelledby="referral-title">
          <div className="referral-heading-row">
            <div>
              <p className="referral-eyebrow">NEM AI Referral Program</p>
              <h1 id="referral-title">Your Referrals</h1>
              <p className="referral-subtitle">Invite friends, grow the community, and earn rewards together.</p>
            </div>
            {!isLoadingReferral && !referralError && (
              <span className={`referral-status ${isLocked ? "locked" : ""}`}><span /> {isLocked ? "Locked" : "Active invite"}</span>
            )}
          </div>

          {isLoadingReferral ? (
            <div className="referral-loading-state" aria-live="polite" aria-busy="true">
              <div className="referral-loading-line wide" />
              <div className="referral-loading-line" />
              <div className="referral-loading-card" />
            </div>
          ) : referralError ? (
            <div className="referral-error-state" role="alert">
              <h2>Referral status unavailable</h2>
              <p>{referralError}</p>
              <button type="button" onClick={loadReferralStatus}>Retry</button>
            </div>
          ) : isLocked ? (
            <div className="referral-locked-state">
              <div className="referral-locked-visual" aria-hidden="true">
                <div className="referral-progress-ring" style={{ "--referral-progress": `${animatedProgressPercent}%` }}>
                  <div className="referral-progress-ring-inner">
                    <strong>{currentPoints}</strong>
                    <small>/ {unlockAtPoints} PTS</small>
                  </div>
                </div>
                <div className="referral-signal-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="referral-locked-content">
                <h2>Unlock referrals at {unlockAtPoints} Puff Points</h2>
                <p>Your referral access is currently locked. Earn {unlockAtPoints} Puff Points to unlock your personal referral code and start inviting friends to NEM AI.</p>
                <div className="referral-how-it-works">
                  <p className="referral-how-it-works-title">How it works:</p>
                  <ol>
                    <li><strong>Earn Puff Points</strong><span>Keep checking in and participating in NEM AI activities to grow your Puff Points.</span></li>
                    <li><strong>Reach {unlockAtPoints} Puff Points</strong><span>Once you reach the referral threshold, your referral access will be unlocked automatically.</span></li>
                    <li><strong>Invite &amp; earn</strong><span>Your personal referral code will be generated automatically, allowing you to invite friends and earn community rewards.</span></li>
                  </ol>
                </div>
                <button type="button" onClick={() => navigate("/dashboard")}>View Puff Dashboard</button>
              </div>
            </div>
          ) : (
            <>
              <div className="referral-invite-grid">
                <div className="referral-link-column">
                  <label htmlFor="referral-link">Your invite link</label>
                  <div className="referral-link-box">
                    <input id="referral-link" value={referralLink} readOnly aria-label="Referral link" />
                    <button type="button" onClick={copyReferralLink} className={copied ? "is-copied" : ""} aria-label="Copy referral link" title="Copy referral link" disabled={!referralLink}>
                      <CopyIcon />
                    </button>
                  </div>
                  <button type="button" className="referral-share-btn" onClick={shareReferralLink} disabled={!referralLink}>Share invite <span>↗</span></button>
                  <p className="referral-feedback" aria-live="polite">{copied ? "Referral link copied." : shareMessage}</p>
                </div>
                <div className="referral-code-block">
                  <span className="referral-label">Referral code</span>
                  <strong>{referralCode}</strong>
                  <small>Ready to share with {displayName}.</small>
                </div>
              </div>

              <div className="referral-divider" />
              <div className="referral-stats-grid">
                <article className="referral-stat-card"><UsersIcon /><span>Successful referrals</span><strong>{referralsUsed}</strong></article>
                <article className="referral-stat-card"><GiftIcon /><span>Invite records</span><strong>{referralItems.length}</strong></article>
              </div>

              <div className="referral-history">
                <div className="referral-history-header"><h2>Referral history</h2><span>{referralItems.length} invites</span></div>
                <div className="referral-history-table" role="table" aria-label="Referral history">
                  <div className="referral-history-row referral-history-head" role="row"><span>Invitee</span><span>Date</span><span>Status</span><span>Reward</span></div>
                  {referralItems.length === 0 ? <div className="referral-empty-state">No referral history yet. Your successful invites will appear here.</div> : referralItems.map((item) => <div className="referral-history-row" key={item.id}><span>{item.invitee}</span><span>{formatReferralDate(item.date)}</span><span><mark className={`referral-history-status ${getStatusClassName(item.status)}`}>{item.status}</mark></span><span>{item.amount}</span></div>)}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default ReferralPage;
