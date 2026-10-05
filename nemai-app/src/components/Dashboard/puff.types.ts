export interface PuffTier {
  name: string;
  min_points: number;
  max_points: number;
}

export interface Subscription {
  plan_code: string;
  plan_name: string;
  multiplier: number;
}

export interface DailySeries {
  date: string;
  net_amount?: number;
  earned_points?: number;
}

export interface PuffSummary {
  puff_point_total: number;
  puff_tier: PuffTier;
  leaderboard_rank: number;
  daily_series: DailySeries[];
  subscription: Subscription;
}

export interface PuffSummaryResponse {
  data: PuffSummary;
}

export interface PuffLeaderboardItem {
  rank: number;
  user_id: string;
  display_name: string;
  email?: string;
  puff_point_total: number;
}

export interface PuffLeaderboard {
  items: PuffLeaderboardItem[];
  current_user: PuffLeaderboardItem | null;
}

export interface PuffLeaderboardResponse {
  data: PuffLeaderboard;
}

export interface PuffCheckInItem {
  date: string;
  checked_in: boolean;
}

export interface PuffCheckInHistory {
  days: number;
  from_date: string;
  to_date: string;
  items: PuffCheckInItem[];
}

export interface PuffCheckInHistoryResponse {
  data: PuffCheckInHistory;
}

export interface PuffReferralItem {
  id: string;
  invitee: string;
  date: string;
  status: string;
  amount: string;
}

export interface PuffReferralStatus {
  locked: boolean;
  unlock_at_points: number;
  code?: string;
  referrals_used: number;
  items: PuffReferralItem[];
}

export interface PuffReferralStatusResponse {
  data: PuffReferralStatus;
}

export interface PuffMission {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  frequency: string;
  base_points: number;
  link_url: string;
  trigger: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  claimed: boolean;
  claimable: boolean;
  available_base_points: number;
  current_multiplier: number;
  reward_points: number;
}

export interface PuffMissions {
  reporting_day: string;
  missions: PuffMission[];
}

export interface PuffMissionsResponse {
  data: PuffMissions;
}

export type PriorityTier = "normal" | "silver" | "gold";

export interface MembershipState {
  planCode: string;
  priorityTier: PriorityTier;
  isPremiumActive: boolean;
  badgeText: string;
  passLabel: string;
}
