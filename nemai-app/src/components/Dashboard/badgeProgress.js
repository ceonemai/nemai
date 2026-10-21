export const BADGE_RING_RADIUS = 34;
export const BADGE_RING_CIRCUMFERENCE = 2 * Math.PI * BADGE_RING_RADIUS;

/**
 * @typedef {"earned" | "ongoing" | "not-started" | "unavailable"} BadgeState
 * @typedef {{
 *   id: string;
 *   name: string;
 *   description: string;
 *   icon: string;
 *   current: number | null;
 *   target: number;
 *   unit: string;
 *   earnedAt?: string | null;
 *   available?: boolean;
 *   statusText?: string;
 * }} Badge
 */

export const clampBadgeProgress = (current, target) => {
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) return 0;
  return Math.min(1, Math.max(0, current / target));
};

export const isBadgeEarned = (badge) => {
  if (badge.earnedAt) return true;
  if (!Number.isFinite(badge.current) || !Number.isFinite(badge.target) || badge.target <= 0) return false;
  return clampBadgeProgress(badge.current, badge.target) >= 1;
};

/** @param {Badge} badge */
export const getBadgeProgress = (badge) => {
  const isAvailable = badge.available !== false && Number.isFinite(badge.current);
  const progress = isAvailable
    ? badge.earnedAt ? 1 : clampBadgeProgress(badge.current, badge.target)
    : 0;
  const earned = isAvailable && isBadgeEarned(badge);

  return {
    progress,
    percent: Math.round(progress * 100),
    earned,
    state: !isAvailable ? "unavailable" : earned ? "earned" : progress > 0 ? "ongoing" : "not-started"
  };
};

export const getBadgeRingDashOffset = (progress, circumference = BADGE_RING_CIRCUMFERENCE) => (
  circumference * (1 - Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)))
);

const toIsoDate = (date) => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};

const addUtcDays = (isoDate, days) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
};

export const getConsecutiveCheckInDays = (items, today = new Date()) => {
  const todayIso = toIsoDate(today);
  if (!todayIso || !Array.isArray(items)) return 0;

  const checkedInByDate = new Map(items.map((item) => [toIsoDate(item.date), Boolean(item.checked_in)]));
  let date = checkedInByDate.get(todayIso) ? todayIso : addUtcDays(todayIso, -1);
  let streak = 0;

  while (checkedInByDate.get(date) === true) {
    streak += 1;
    date = addUtcDays(date, -1);
  }

  return streak;
};

export const getPointsEarnedThisWeek = (series, today = new Date()) => {
  const todayIso = toIsoDate(today);
  if (!todayIso || !Array.isArray(series)) return 0;

  const weekStart = addUtcDays(todayIso, -6);
  return series.reduce((total, item) => {
    const date = toIsoDate(item.date);
    const points = Number(item.net_amount ?? item.earned_points ?? item.earnedPoints ?? 0);
    if (!date || date < weekStart || date > todayIso || !Number.isFinite(points)) return total;
    return total + Math.max(0, points);
  }, 0);
};
