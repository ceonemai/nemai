import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
/* eslint-disable-next-line no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/images/LogogramFullColor.png";
import { navigationItems } from "./navigationItems";

const SIDEBAR_SMOOTH_STORAGE_KEY = "nemai-sidebar-smooth-until";
const SIDEBAR_SMOOTH_DURATION_MS = 360;
const PROFILE_MENU_VARIANTS = {
  open: { clipPath: "inset(0% 0% 0% 0% round 8px)", transition: { type: "spring", bounce: 0, duration: 0.5, delayChildren: 0.2, staggerChildren: 0.05 } },
  closed: { clipPath: "inset(90% 50% 10% 50% round 8px)", transition: { type: "spring", bounce: 0, duration: 0.3 } }
};
const PROFILE_MENU_ITEM_VARIANT = {
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

export function PrimaryNavigation({ hiddenItemIds = [], onNavigate, trailingActions }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    onNavigate?.();
    navigate(path);
  };

  return <div className="sidebar-primary-actions">{navigationItems.filter(({ id }) => !hiddenItemIds.includes(id)).map(({ id, label, path, ariaLabel, Icon }) => <button type="button" className={`new-chat-btn sidebar-nav-btn ${location.pathname === path ? "active" : ""}`} onClick={() => navigateTo(path)} aria-label={ariaLabel} key={id}><span className="puff-icon">{Icon()}</span><span className="sidebar-text">{label}</span></button>)}{trailingActions}</div>;
}

export function MobileNavigationHeader({ onOpen }) {
  return <div className="mobile-header dashboard"><button type="button" className="menu-btn" onClick={onOpen} aria-label="Open sidebar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button><span className="mobile-title">NEM AI</span></div>;
}

export default function AppShell({ layoutClassName = "", mainClassName = "", sidebarContent, accountMenuContent, children }) {
  const { user, logout } = usePrivy();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [keepSidebarExpanded, setKeepSidebarExpanded] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const userName = user?.name || user?.email?.address || user?.google?.email || "User";

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined;
    const closeMenu = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) setIsAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const now = Date.now();
    const until = Number(window.sessionStorage.getItem(SIDEBAR_SMOOTH_STORAGE_KEY) || 0);
    if (!Number.isFinite(until) || until <= now) {
      window.sessionStorage.removeItem(SIDEBAR_SMOOTH_STORAGE_KEY);
      return undefined;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeepSidebarExpanded(true);
    const timerId = window.setTimeout(() => {
      setKeepSidebarExpanded(false);
      window.sessionStorage.removeItem(SIDEBAR_SMOOTH_STORAGE_KEY);
    }, until - now);
    return () => window.clearTimeout(timerId);
  }, []);

  const prepareNavigation = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(max-width: 768px)").matches) {
      const navigationUntil = Date.now() + SIDEBAR_SMOOTH_DURATION_MS;
      window.sessionStorage.setItem(SIDEBAR_SMOOTH_STORAGE_KEY, String(navigationUntil));
      setKeepSidebarExpanded(true);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className={`appchat-layout ${layoutClassName}`}>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`appchat-sidebar ${isSidebarOpen ? "open" : ""} ${keepSidebarExpanded || isAccountMenuOpen ? "keep-expanded" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info"><img src={logo} alt="NEM AI Logo" className="sidebar-logo" /><div className="brand-title">NEM AI</div></div>
          <button type="button" className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">x</button>
        </div>
        <PrimaryNavigation onNavigate={prepareNavigation} />
        {sidebarContent}
        <div className="sidebar-footer" ref={accountMenuRef}>
          <AnimatePresence>{isAccountMenuOpen && <motion.div initial="closed" animate="open" exit="closed" variants={PROFILE_MENU_VARIANTS} className="profile-menu-popup profile-menu-popup-logout-only">{accountMenuContent?.({ closeMenu: () => setIsAccountMenuOpen(false), itemVariant: PROFILE_MENU_ITEM_VARIANT })}<motion.button type="button" className="profile-menu-item logout profile-menu-logout-button" variants={PROFILE_MENU_ITEM_VARIANT} onClick={() => { setIsAccountMenuOpen(false); logout(); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>Log out</motion.button></motion.div>}</AnimatePresence>
          <button type="button" className="user-profile" onClick={() => setIsAccountMenuOpen((open) => !open)} aria-label="Account menu"><div className="user-avatar">{userName.charAt(0).toUpperCase()}</div><span className="user-name">{userName}</span></button>
        </div>
      </aside>
      <main className={`appchat-main ${mainClassName}`}>
        <MobileNavigationHeader onOpen={() => setIsSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}