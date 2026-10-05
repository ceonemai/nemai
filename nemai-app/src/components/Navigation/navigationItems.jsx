/* eslint-disable react-refresh/only-export-components */

const DashboardIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="14" y="10" width="7" height="11" rx="1.5" /><rect x="3" y="13" width="7" height="8" rx="1.5" /></svg>;
const ReferralIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const QuestIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v5c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>;
const ChatIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;

export const navigationItems = [
  { id: "dashboard", label: "Puff Dashboard", path: "/dashboard", ariaLabel: "Open Puff Dashboard", Icon: DashboardIcon },
  { id: "referrals", label: "Referrals", path: "/referrals", ariaLabel: "Open Referrals", Icon: ReferralIcon },
  { id: "quests", label: "Quest", path: "/quests", ariaLabel: "Open Quest Hub", Icon: QuestIcon },
  { id: "chat", label: "Chat", path: "/", ariaLabel: "Open Chat", Icon: ChatIcon }
];