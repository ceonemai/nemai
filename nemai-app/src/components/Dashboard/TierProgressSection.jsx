import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import nubieBadge from "../../assets/images/Nubie.png";
import guardianBadge from "../../assets/images/Guardian.png";
import analystBadge from "../../assets/images/Analyst.png";
import specialistBadge from "../../assets/images/Specialist.png";

const TIERS = [
  { key: "nubie", name: "Nubie", min: 0, max: 100, badge: nubieBadge },
  { key: "guardian", name: "Guardian", min: 101, max: 200, badge: guardianBadge },
  { key: "analyst", name: "Analyst", min: 201, max: 500, badge: analystBadge },
  { key: "specialist", name: "Specialist", min: 501, max: Infinity, badge: specialistBadge }
];

// Whole track scales from 0 to Specialist's threshold so badge spacing reflects real point distance.
const SCALE_MAX = TIERS[TIERS.length - 1].min;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function TierProgressSection({ points = 0 }) {
  const safePoints = Number.isFinite(points) ? Math.max(0, points) : 0;
  const currentBadgeRef = useRef(null);

  const currentTierIndex = useMemo(() => {
    const index = TIERS.findIndex((tier) => safePoints >= tier.min && safePoints <= tier.max);
    return index >= 0 ? index : TIERS.length - 1;
  }, [safePoints]);

  const currentTier = TIERS[currentTierIndex];
  const nextTier = TIERS[currentTierIndex + 1] || null;
  const isMaxTier = !nextTier;
  const pointsToNext = isMaxTier ? 0 : Math.max(0, nextTier.min - safePoints);

  // Real-distance progress: dot/fill position is the actual point value against the 0 -> Specialist scale.
  const trackFillPct = useMemo(() => clamp((safePoints / SCALE_MAX) * 100, 0, 100), [safePoints]);

  // Keep the current tier in view when the track scrolls horizontally on small screens.
  useEffect(() => {
    currentBadgeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentTierIndex]);

  return (
    <section className="tier-progress-card" aria-label="NEM AI Tier Progress">
      <div className="tier-progress-summary">
        <div className="tier-progress-summary-row">
          <h2 className="tier-progress-summary-eyebrow">Your Puff Progress</h2>
          {isMaxTier ? <span className="tier-max-pill">Max Tier</span> : null}
        </div>
      </div>

      <div className="tier-track-scroll">
        <div className="tier-track" role="list">
          <div className="tier-progress-line" aria-hidden="true">
            <motion.div
              className="tier-progress-line-fill"
              initial={{ width: 0 }}
              animate={{ width: `${trackFillPct}%` }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="tier-progress-glow-dot"
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: `${trackFillPct}%`, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {TIERS.map((tier, index) => {
            const state = index < currentTierIndex ? "completed" : index === currentTierIndex ? "current" : "future";
            return (
              <motion.div
                key={tier.key}
                ref={state === "current" ? currentBadgeRef : undefined}
                className={`tier-badge-item ${state}`}
                role="listitem"
                aria-current={state === "current" ? "true" : undefined}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
              >
                {state === "current" ? <span className="tier-current-label">Current Tier</span> : null}
                <div className="tier-badge-media">
                  <img src={tier.badge} alt={`${tier.name} tier badge`} className="tier-badge-img" />
                  {state === "completed" ? <span className="tier-badge-check" aria-hidden="true">✓</span> : null}
                </div>
                <span className="tier-badge-name">{tier.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="tier-progress-readout">
        {isMaxTier ? (
          <span className="tier-progress-readout-max">Max Tier Reached</span>
        ) : (
          <>
            <span className="tier-progress-readout-fraction">{safePoints} / {currentTier.max}</span>
            <span className="tier-progress-readout-hint">{pointsToNext} points to {nextTier.name}</span>
          </>
        )}
      </div>
    </section>
  );
}


