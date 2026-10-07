import "../Appchat/AppChat.css";
import "./Quests.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import AppShell from "../Navigation/AppShell";
import TierProgressSection from "../Dashboard/TierProgressSection";
import { claimPuffMission, fetchPuffMissions, fetchPuffSummary } from "../Dashboard/puffApi";

const FREQUENCY_LABELS = { one_time: "One-time", daily: "Daily" };
const getFrequencyLabel = (frequency) => FREQUENCY_LABELS[frequency] || "Unlimited";

// claimable=false && !claimed means the backend tracks progress elsewhere (not a hard lock).
const PRIORITY_PASS_PLAN_BY_CODE = { priority_plus: "silver", priority_pro: "gold" };

const getMissionStatus = (mission) => {
  if (mission.claimed) return "completed";
  if (mission.claimable) return "available";
  return "in_progress";
};

const getMissionAction = (status) => {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In Progress";
  return "Do task";
};

const TABS = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "completed", label: "Completed" },
  { id: "in_progress", label: "In Progress" }
];

const GROUPS = [
  { status: "available", heading: "Ready to complete" },
  { status: "completed", heading: "Completed" },
  { status: "in_progress", heading: "In Progress" }
];

const TrophyIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6" /></svg>;
const QuestIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v5c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7" /></svg>;
const RepeatIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2 21 6l-4 4" /><path d="M3 12v-1a5 5 0 0 1 5-5h13" /><path d="M7 22 3 18l4-4" /><path d="M21 12v1a5 5 0 0 1-5 5H3" /></svg>;

const getMissionIcon = (status) => {
  if (status === "completed") return <CheckIcon />;
  if (status === "in_progress") return <RepeatIcon />;
  return <QuestIcon />;
};

const QUEST_SKELETON_KEYS = ["s1", "s2", "s3", "s4"];
const CLAIM_ANIMATION_MS = 900;
const CLAIM_BURST_ANGLES = [0, 60, 120, 180, 240, 300];

const QuestCardSkeleton = () => <article className="quest-card quest-card-skeleton">
  <div className="quest-card-top">
    <span className="skeleton skeleton-tile" />
    <span className="skeleton skeleton-chip" />
    <span className="skeleton skeleton-badge" />
  </div>
  <div className="quest-card-body">
    <span className="skeleton skeleton-title" />
    <span className="skeleton skeleton-line" />
    <span className="skeleton skeleton-line short" />
  </div>
  <div className="quest-card-footer">
    <span className="skeleton skeleton-limit" />
    <span className="skeleton skeleton-btn" />
  </div>
</article>;

function Quests() {
  const navigate = useNavigate();
  const { getAccessToken } = usePrivy();
  const [puffPointTotal, setPuffPointTotal] = useState(null);
  const [puffPointsLoading, setPuffPointsLoading] = useState(true);
  const [puffPointsError, setPuffPointsError] = useState("");
  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [missionsError, setMissionsError] = useState("");
  const [claimingCode, setClaimingCode] = useState(null);
  const [claimErrors, setClaimErrors] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [justClaimedCode, setJustClaimedCode] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    const loadPuffSummary = async () => {
      setPuffPointsLoading(true);
      setPuffPointsError("");

      try {
        const result = await fetchPuffSummary(getAccessToken, 7);
        const points = Number(result?.puff_point_total);
        if (!Number.isFinite(points)) throw new Error("Puff summary is missing a valid point total.");
        if (isCurrent) setPuffPointTotal(Math.max(0, points));
      } catch (error) {
        console.error("Failed to load Puff summary for quests:", error);
        if (isCurrent) {
          setPuffPointTotal(null);
          setPuffPointsError("Puff progress is temporarily unavailable.");
        }
      } finally {
        if (isCurrent) setPuffPointsLoading(false);
      }
    };

    loadPuffSummary();
    return () => { isCurrent = false; };
  }, [getAccessToken]);

  const loadMissions = useCallback(async () => {
    setMissionsLoading(true);
    setMissionsError("");

    try {
      const result = await fetchPuffMissions(getAccessToken);
      setMissions(result.missions);
    } catch (error) {
      console.error("Failed to load puff missions:", error);
      setMissionsError("Unable to load quests right now.");
    } finally {
      setMissionsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handleQuestAction = async (mission) => {
    const priorityPassPlan = PRIORITY_PASS_PLAN_BY_CODE[mission.code];
    if (priorityPassPlan) {
      if (mission.claimed) return;
      navigate(`/membership/checkout?plan=${priorityPassPlan}`);
      return;
    }

    // Claiming is only wired up for one_time quests for now.
    if (mission.frequency !== "one_time") return;
    if (getMissionStatus(mission) !== "available" || claimingCode) return;

    setClaimErrors((prev) => ({ ...prev, [mission.code]: "" }));
    setClaimingCode(mission.code);

    if (mission.link_url) {
      window.open(mission.link_url, "_blank", "noopener,noreferrer");
    }

    try {
      await claimPuffMission(getAccessToken, mission.code);
      await loadMissions();
      setJustClaimedCode(mission.code);
      window.setTimeout(() => setJustClaimedCode((current) => (current === mission.code ? null : current)), CLAIM_ANIMATION_MS);
    } catch (error) {
      console.error("Failed to claim mission:", error);
      setClaimErrors((prev) => ({ ...prev, [mission.code]: "Unable to claim this quest right now." }));
    } finally {
      setClaimingCode(null);
    }
  };

  // Purely derived, render-time only — does not affect fetched data or handlers.
  const missionsWithStatus = useMemo(
    () => missions.map((mission) => ({ mission, status: getMissionStatus(mission) })),
    [missions]
  );

  const tabCounts = useMemo(() => {
    const counts = { all: missionsWithStatus.length, available: 0, completed: 0, in_progress: 0 };
    missionsWithStatus.forEach(({ status }) => { counts[status] += 1; });
    return counts;
  }, [missionsWithStatus]);

  const completedCount = tabCounts.completed;
  const totalCount = tabCounts.all;
  const pointsAvailable = useMemo(
    () => missionsWithStatus
      .filter(({ status }) => status === "available")
      .reduce((sum, { mission }) => sum + (mission.reward_points || mission.available_base_points || mission.base_points || 0), 0),
    [missionsWithStatus]
  );

  const filteredEntries = activeTab === "all"
    ? missionsWithStatus
    : missionsWithStatus.filter(({ status }) => status === activeTab);

  const groupedEntries = activeTab === "all"
    ? GROUPS.map((group) => ({ ...group, entries: filteredEntries.filter(({ status }) => status === group.status) })).filter((group) => group.entries.length)
    : [{ status: activeTab, heading: null, entries: filteredEntries }];

  const renderQuestCard = ({ mission, status }) => {
    const points = mission.reward_points || mission.available_base_points || mission.base_points;
    const isClaiming = claimingCode === mission.code;
    const priorityPassPlan = PRIORITY_PASS_PLAN_BY_CODE[mission.code];
    const isClaimable = priorityPassPlan ? !mission.claimed : status === "available" && mission.frequency === "one_time";
    const claimError = claimErrors[mission.code];
    const isJustClaimed = justClaimedCode === mission.code;
    const actionLabel = priorityPassPlan && !mission.claimed ? "Get Pass" : getMissionAction(status);

    return <article className={`quest-card ${status} ${isJustClaimed ? "just-claimed" : ""}`} key={mission.id}>
      {isJustClaimed && <span className="claim-burst" aria-hidden="true">{CLAIM_BURST_ANGLES.map((angle) => <span key={angle} style={{ "--angle": `${angle}deg` }} />)}</span>}
      <div className="quest-card-top">
        <span className={`quest-icon-tile ${status}`}>{getMissionIcon(status)}</span>
        <span className="quest-type-chip">{getFrequencyLabel(mission.frequency)}</span>
        <span className={`quest-reward-badge ${status}`}>{status === "completed" ? `+${points} earned` : `+${points} pts`}</span>
      </div>
      <div className="quest-card-body">
        <h3>{mission.name}</h3>
        <p>{mission.description}</p>
      </div>
      <div className="quest-card-footer">
        <span className="quest-limit"><RepeatIcon />Limit: {getFrequencyLabel(mission.frequency)}</span>
        {status === "completed"
          ? <span className="quest-completed-pill" role="status"><CheckIcon /> Completed</span>
          : <button type="button" className="quest-action-btn" disabled={!isClaimable || isClaiming} aria-disabled={!isClaimable || isClaiming} onClick={() => handleQuestAction(mission)}>{isClaiming ? "Claiming..." : actionLabel}</button>}
      </div>
      {claimError && <p className="quest-card-error">{claimError}</p>}
    </article>;
  };

  return <AppShell layoutClassName="quests-layout" mainClassName="quests-main">
      <div className="quests-content">
        <header className="quests-header">
          <div className="quests-header-copy">
            <h1>Quest Hub</h1>
            <p>Complete quests, collect Puff Points, and climb the community leaderboard.</p>
          </div>
        </header>

        <section className="quests-summary" aria-label="Quest summary">
          <article className="quests-summary-points">
            <button
              type="button"
              className="summary-icon points"
              aria-label="Go to the Puff leaderboard"
              title="Go to the Puff leaderboard"
              onClick={() => navigate("/dashboard?scroll=leaderboard")}
            ><TrophyIcon /></button>
            <small>Total Puff Points</small>
            <strong aria-live="polite">
              {puffPointsLoading
                ? <span className="skeleton quest-points-skeleton" aria-label="Loading Puff Points" />
                : puffPointsError ? "Unavailable" : puffPointTotal.toLocaleString()}
            </strong>
          </article>
          <article className="quests-summary-progress">
            <small>Progress</small>
            {missionsLoading
              ? <div className="skeleton skeleton-text" aria-hidden="true" />
              : <strong>{completedCount} / {totalCount} completed</strong>}
            <div className="quests-progress-bar" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount || 1}>
              {Array.from({ length: totalCount || 1 }).map((_, index) => <span key={index} className={index < completedCount ? "filled" : ""} />)}
            </div>
            {pointsAvailable > 0 && <p className="quests-progress-note">{pointsAvailable} pts still available</p>}
          </article>
        </section>

        {puffPointsLoading ? (
          <section className="tier-progress-card tier-progress-loading" aria-busy="true" aria-label="Loading Puff progress">
            <h2 className="tier-progress-summary-eyebrow">Your Puff Progress</h2>
            <div className="tier-progress-loading-track" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => <span className="skeleton" key={index} />)}
            </div>
            <span className="skeleton tier-progress-loading-readout" aria-hidden="true" />
          </section>
        ) : puffPointsError ? (
          <section className="tier-progress-card tier-progress-unavailable" role="status">
            <h2 className="tier-progress-summary-eyebrow">Your Puff Progress</h2>
            <p>{puffPointsError}</p>
          </section>
        ) : (
          <TierProgressSection points={puffPointTotal} />
        )}

        <div className="quests-tabs" role="tablist" aria-label="Filter quests">
          {TABS.map((tab) => <button
            type="button"
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`quests-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >{tab.label} <span>{tabCounts[tab.id]}</span></button>)}
        </div>

        <section className="quests-panel">
          {missionsLoading ? <div className="quest-grid" aria-hidden="true">{QUEST_SKELETON_KEYS.map((key) => <QuestCardSkeleton key={key} />)}</div>
            : missionsError ? <p className="quests-note">{missionsError}</p>
              : !missions.length ? <p className="quests-note">No quests available right now.</p>
                : !filteredEntries.length ? <p className="quests-note">No quests in this filter.</p>
                  : groupedEntries.map((group) => <div className="quest-group" key={group.status}>
                    {group.heading && <h2 className="quest-group-heading">{group.heading} <span>{group.entries.length}</span></h2>}
                    <div className="quest-grid">{group.entries.map(renderQuestCard)}</div>
                  </div>)}
        </section>
      </div>
  </AppShell>;
}

export default Quests;