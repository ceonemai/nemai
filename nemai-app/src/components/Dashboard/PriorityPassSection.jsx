import silverPassPng from "../../assets/images/puff priority pass silver img.png";
import silverPassGif from "../../assets/images/puff priority pass silver gif.gif";
import goldPassGif from "../../assets/images/puff priority pass gold gif.gif";
import { useNavigate } from "react-router-dom";

const silverPriorityPassPlan = {
  label: "Priority Pass",
  description: "Permanent access to priority perks across the NEM AI ecosystem."
};

// Mirrors the package features shown on the membership checkout page.
const premiumBenefitItemsByTier = {
  silver: [
    "1.5x Puff Point multiplier",
    "Higher daily chat limit",
    "Early access to new features",
    "Exclusive Discord role",
    "Silver Puff Priority Pass badge"
  ],
  gold: [
    "2x Puff Point multiplier",
    "Highest daily chat limit",
    "Early access to new features",
    "Exclusive Discord role and AMA sessions",
    "Priority beta testing",
    "Priority support",
    "Golden Puff Priority Pass badge"
  ]
};

function MembershipStatusBadge({ isActive, text }) {
  return <span className={`priority-pass-status ${isActive ? "active" : "inactive"}`}>{text}</span>;
}

function NonPremiumMembershipOffer({ onBuyNow }) {
  return (
    <>
      <div className="priority-pass-hero">
        <div className="priority-pass-hero-copy">
          <h2>Puff Priority Pass</h2>
          <p>Unlock premium AI Health features with faster responses, advanced reports, and exclusive member benefits.</p>
        </div>
        <MembershipStatusBadge isActive={false} text="Not Active" />
      </div>

      <article className="priority-pass-offer-shell" aria-label="Priority pass purchase offer">
        <div className="priority-pass-offer-left" aria-label="Priority Pass plan">
          <div className="priority-pass-offer-media" aria-hidden="true">
            <img
              className="priority-pass-offer-media-image priority-pass-offer-media-image--inactive"
              src={silverPassPng}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="priority-pass-offer-media-reflection" />
          </div>
        </div>

        <aside className="priority-pass-offer-right" aria-label="Priority pass benefits and purchase action">
          <div className="priority-pass-offer-plan-head">
            <h3 className="priority-pass-offer-plan-title">{silverPriorityPassPlan.label}</h3>
            <p className="priority-plan-desc">{silverPriorityPassPlan.description}</p>
          </div>

          <div className="priority-pass-offer-enhance">
            <h3>Enhance Benefits</h3>
          <p>
            Puff Priority Pass gives you enhanced benefits within the NEM AI ecosystem permanently, including: Earn more Puff Points from 1.5-2x from every Puff Point you earned, higher daily chat limit compared to free-tier users.
          </p>

          <ul className="priority-pass-offer-highlights" aria-label="Key features and rewards">
            <li>1.5x - 2x Puff Point rewards</li>
            <li>Higher daily chat limit</li>
            <li>Permanent Priority Pass perks</li>
            <li>Exclusive Discord community channel</li>
          </ul>
          </div>

          <div className="priority-pass-offer-cta-wrap">
            <button type="button" className="priority-plan-cta gold priority-pass-offer-cta" onClick={onBuyNow}>Buy Now</button>
          </div>
        </aside>
      </article>
    </>
  );
}

function MembershipBenefits({ items, title, className = "" }) {
  return (
    <section className={`priority-active-benefits ${className}`.trim()} aria-label="Your premium benefits">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span className="priority-active-benefit-check" aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ActiveMembershipCard({ membershipState, onUpgrade }) {
  const isGoldMember = membershipState.priorityTier === "gold";
  const activePassMedia = isGoldMember ? goldPassGif : silverPassGif;
  const isSilverMember = membershipState.planCode === "plus";
  const benefitItems = isGoldMember ? premiumBenefitItemsByTier.gold : premiumBenefitItemsByTier.silver;

  return (
    <div className="priority-active-shell" aria-label="Premium member dashboard">
      <span className="priority-active-badge">
        <span className="priority-active-badge-check" aria-hidden="true">✓</span>
        Premium Active
      </span>

      <article className="priority-pass-offer-shell priority-pass-offer-shell--active">
        <div className="priority-pass-offer-left priority-pass-offer-left--active" aria-hidden="true">
          <div className="priority-active-media-wrap">
            <img
              className="priority-active-media"
              src={activePassMedia}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="priority-active-reflection" />
          </div>
        </div>

        <aside className="priority-pass-offer-right priority-pass-offer-right--active" aria-label="Active membership details">
          <div className="priority-pass-offer-plan-head">
            <h3 className="priority-pass-offer-plan-title">{membershipState.passLabel}</h3>
            <p className="priority-active-state-text">Activated</p>
          </div>

          <MembershipBenefits
            items={benefitItems}
            title="Your Premium Benefits"
            className="priority-active-benefits--compact"
          />

          {isSilverMember ? (
            <div className="priority-pass-offer-cta-wrap priority-pass-offer-cta-wrap--active">
              <button type="button" className="priority-plan-cta gold priority-pass-offer-cta" onClick={onUpgrade}>
                Upgrade to Golden Pass
              </button>
            </div>
          ) : null}
        </aside>
      </article>
    </div>
  );
}

function PriorityPassSkeleton() {
  return (
    <div className="priority-pass-skeleton" aria-hidden="true">
      <div className="priority-skeleton-line priority-skeleton-line-lg" />
      <div className="priority-skeleton-line" />
      <div className="priority-skeleton-grid">
        <div className="priority-skeleton-card" />
        <div className="priority-skeleton-card" />
      </div>
    </div>
  );
}

export default function PriorityPassSection({ membershipState, loading, errorMessage }) {
  const navigate = useNavigate();

  return (
    <section className="puff-priority-pass-section" aria-label="Puff Priority Pass Membership">
      {loading ? <PriorityPassSkeleton /> : null}

      {!loading && (
        <>
          {errorMessage ? (
            <div className="priority-pass-inline-error" role="status" aria-live="polite">
              Unable to refresh subscription status right now. Showing your latest available membership view.
            </div>
          ) : null}

          {!membershipState.isPremiumActive ? (
            <NonPremiumMembershipOffer onBuyNow={() => navigate("/membership/checkout")} />
          ) : (
            <ActiveMembershipCard membershipState={membershipState} onUpgrade={() => navigate("/membership/checkout?mode=upgrade")} />
          )}
        </>
      )}
    </section>
  );
}
