import type {
  MembershipState,
  PuffCheckInHistory,
  PuffCheckInHistoryResponse,
  PuffCheckInItem,
  PuffLeaderboard,
  PuffLeaderboardItem,
  PuffLeaderboardResponse,
  PuffReferralItem,
  PuffReferralStatus,
  PuffReferralStatusResponse,
  PuffSummary,
  PuffSummaryResponse
} from "./puff.types";

const customerApiUrl = "https://customer-api.nemai.io";
const ALLOWED_DAYS = [7, 15, 30] as const;

export type PuffDays = (typeof ALLOWED_DAYS)[number];

const PLAN_CODE_MEMBERSHIP_MAP: Record<string, Omit<MembershipState, "planCode">> = {
  free: {
    priorityTier: "normal",
    isPremiumActive: false,
    badgeText: "Not Active",
    passLabel: "Normal User"
  },
  plus: {
    priorityTier: "silver",
    isPremiumActive: true,
    badgeText: "Premium Active",
    passLabel: "Silver Puff Priority Pass"
  },
  pro: {
    priorityTier: "gold",
    isPremiumActive: true,
    badgeText: "Premium Active",
    passLabel: "Golden Puff Priority Pass"
  }
};

export const resolveMembershipFromPlanCode = (planCode: string | null | undefined): MembershipState => {
  const normalizedPlanCode = String(planCode || "free").toLowerCase();
  const mapped = PLAN_CODE_MEMBERSHIP_MAP[normalizedPlanCode] || PLAN_CODE_MEMBERSHIP_MAP.free;

  return {
    planCode: normalizedPlanCode,
    ...mapped
  };
};

export const fetchPuffSummary = async (
  getAccessToken: () => Promise<string>,
  days?: PuffDays
): Promise<PuffSummary> => {
  const token = await getAccessToken();

  const queryDays = days && ALLOWED_DAYS.includes(days) ? days : undefined;
  const endpoint = queryDays ? `${customerApiUrl}/api/v1/puff?days=${queryDays}` : `${customerApiUrl}/api/v1/puff`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load puff dashboard data (status ${response.status})`);
  }

  const payload = (await response.json()) as PuffSummaryResponse;

  if (!payload?.data) {
    throw new Error("Puff dashboard response is missing data.");
  }

  return payload.data;
};

const normalizeCheckInItems = (items: unknown): PuffCheckInItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      date: String(item?.date || ""),
      checked_in: Boolean(item?.checked_in)
    }))
    .filter((item) => item.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const fetchPuffCheckIns = async (
  getAccessToken: () => Promise<string>
): Promise<PuffCheckInHistory> => {
  const token = await getAccessToken();

  const response = await fetch(`${customerApiUrl}/api/v1/puff/check-ins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load check-in history (status ${response.status})`);
  }

  const payload = (await response.json()) as PuffCheckInHistoryResponse;

  if (!payload?.data) {
    throw new Error("Check-in history response is missing data.");
  }

  return {
    days: Number(payload.data.days ?? 0),
    from_date: String(payload.data.from_date || ""),
    to_date: String(payload.data.to_date || ""),
    items: normalizeCheckInItems(payload.data.items)
  };
};

export const postPuffCheckIn = async (
  getAccessToken: () => Promise<string>
): Promise<void> => {
  const token = await getAccessToken();

  const response = await fetch(`${customerApiUrl}/api/v1/puff/check-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to check in (status ${response.status})`);
  }
};

const normalizeLeaderboardItems = (items: unknown): PuffLeaderboardItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      rank: Number(item?.rank ?? 0),
      user_id: String(item?.user_id ?? ""),
      display_name: String(item?.display_name ?? "Anonymous"),
      email: String(item?.email ?? item?.user_email ?? item?.display_name ?? ""),
      puff_point_total: Number(item?.puff_point_total ?? 0)
    }))
    .filter((item) => item.rank > 0 && item.user_id)
    .sort((a, b) => a.rank - b.rank);
};

export const fetchPuffLeaderboard = async (
  getAccessToken: () => Promise<string>
): Promise<PuffLeaderboard> => {
  const token = await getAccessToken();

  const response = await fetch(`${customerApiUrl}/api/v1/puff/leaderboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load puff leaderboard data (status ${response.status})`);
  }

  const payload = (await response.json()) as PuffLeaderboardResponse & PuffLeaderboard;
  const source = payload?.data || payload;

  return {
    items: normalizeLeaderboardItems(source?.items),
    current_user: source?.current_user
      ? {
          rank: Number(source.current_user.rank ?? 0),
          user_id: String(source.current_user.user_id ?? ""),
          display_name: String(source.current_user.display_name ?? "Anonymous"),
          email: String(source.current_user.email ?? source.current_user.user_email ?? source.current_user.display_name ?? ""),
          puff_point_total: Number(source.current_user.puff_point_total ?? 0)
        }
      : null
  };
};

const toReferralRecord = (item: unknown): Record<string, unknown> => {
  return item && typeof item === "object" ? item as Record<string, unknown> : {};
};

const firstString = (record: Record<string, unknown>, keys: string[], fallback = "-"): string => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }

  return fallback;
};

const normalizeReferralItems = (items: unknown): PuffReferralItem[] => {
  if (!Array.isArray(items)) return [];

  return items.map((rawItem, index) => {
    const item = toReferralRecord(rawItem);
    const rewardValue = firstString(item, ["amount", "points", "reward_amount", "reward", "puff_points"], "-");

    return {
      id: firstString(item, ["id", "referral_id", "user_id", "invitee_id"], `referral-${index}`),
      invitee: firstString(item, ["invitee", "display_name", "email", "user_email", "referred_email", "friend_email", "wallet_address"]),
      date: firstString(item, ["date", "created_at", "completed_at", "updated_at", "used_at"]),
      status: firstString(item, ["status", "state", "referral_status"], "Pending"),
      amount: rewardValue === "-" ? rewardValue : `${rewardValue} pts`
    };
  });
};

export const fetchPuffReferralStatus = async (
  getAccessToken: () => Promise<string>
): Promise<PuffReferralStatus> => {
  const token = await getAccessToken();

  const response = await fetch(`${customerApiUrl}/api/v1/puff/referral`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load puff referral status (status ${response.status})`);
  }

  const payload = (await response.json()) as PuffReferralStatusResponse;

  if (!payload?.data) {
    throw new Error("Puff referral response is missing data.");
  }

  return {
    locked: Boolean(payload.data.locked),
    unlock_at_points: Number(payload.data.unlock_at_points ?? 0),
    code: payload.data.code ? String(payload.data.code) : undefined,
    referrals_used: Number(payload.data.referrals_used ?? 0),
    items: normalizeReferralItems(payload.data.items)
  };
};
