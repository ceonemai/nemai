import assert from "node:assert/strict";
import test from "node:test";
import {
  BADGE_RING_CIRCUMFERENCE,
  clampBadgeProgress,
  getBadgeProgress,
  getBadgeRingDashOffset,
  getConsecutiveCheckInDays,
  getPointsEarnedThisWeek,
  isBadgeEarned
} from "./badgeProgress.js";

test("clamps progress to the 0..1 range", () => {
  assert.equal(clampBadgeProgress(-5, 100), 0);
  assert.equal(clampBadgeProgress(35, 100), 0.35);
  assert.equal(clampBadgeProgress(150, 100), 1);
  assert.equal(clampBadgeProgress(5, 0), 0);
});

test("detects earned badges from earnedAt or a completed target", () => {
  assert.equal(isBadgeEarned({ current: 0, target: 100, earnedAt: "2026-10-12" }), true);
  assert.equal(isBadgeEarned({ current: 100, target: 100 }), true);
  assert.equal(isBadgeEarned({ current: 99, target: 100 }), false);
  const earnedBadge = getBadgeProgress({ current: 1, target: 10, earnedAt: "2026-10-12" });
  assert.equal(earnedBadge.progress, 1);
  assert.equal(earnedBadge.state, "earned");
});

test("uses a clamped progress value for the SVG dash offset", () => {
  assert.equal(getBadgeRingDashOffset(0), BADGE_RING_CIRCUMFERENCE);
  assert.equal(getBadgeRingDashOffset(1), 0);
  assert.equal(getBadgeRingDashOffset(0.35), BADGE_RING_CIRCUMFERENCE * 0.65);
  assert.equal(getBadgeRingDashOffset(2), 0);
});

test("returns an unavailable state instead of reporting a false zero", () => {
  assert.equal(getBadgeProgress({ current: null, target: 100 }).state, "unavailable");
  assert.equal(getBadgeProgress({ current: 0, target: 100 }).state, "not-started");
});

test("counts consecutive check-ins ending today or yesterday when today is pending", () => {
  const items = [
    { date: "2026-10-09", checked_in: true },
    { date: "2026-10-10", checked_in: true },
    { date: "2026-10-11", checked_in: true },
    { date: "2026-10-12", checked_in: false }
  ];

  assert.equal(getConsecutiveCheckInDays(items, "2026-10-12"), 3);
  assert.equal(getConsecutiveCheckInDays(items.slice(0, 3), "2026-10-11"), 3);
});

test("sums points earned in the last seven days only", () => {
  const series = [
    { date: "2026-10-05", earned_points: 10 },
    { date: "2026-10-06", earned_points: 20 },
    { date: "2026-10-12", net_amount: 35 }
  ];

  assert.equal(getPointsEarnedThisWeek(series, "2026-10-12"), 55);
});
