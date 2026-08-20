import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { getStripePaymentLinkForPlan, getStripePaymentLinkForUpgrade, updatePuffSubscription } from "./stripeCheckoutApi";
import { fetchPuffSummary, resolveMembershipFromPlanCode } from "../Dashboard/puffApi";
import "./CheckoutMembership.css";
import silverCardImg from "../../assets/images/puff priority pass silver img.png";
import goldCardImg from "../../assets/images/puff priority pass gold img.png";
import logoImg from "../../assets/images/LogogramFullColor.png";

const CHECKOUT_PLAN_STORAGE_KEY = "membership_checkout_plan_code";
const CHECKOUT_FINALIZED_REF_KEY = "membership_checkout_finalized_ref";
const CHECKOUT_CONTEXT_STORAGE_KEY = "membership_checkout_context";
const CHECKOUT_FINALIZATION_STATE_KEY = "membership_checkout_finalization_state";
const SUBSCRIPTION_NOTE = "User completed Stripe payment link";
const SUCCESS_STATUSES = new Set(["success", "paid", "succeeded", "complete", "completed"]);
const FAILED_STATUSES = new Set(["cancelled", "canceled", "failed", "fail", "requires_payment_method"]);
const ALLOWED_PLAN_CODES = new Set(["plus", "pro"]);
const CHECKOUT_CONTEXT_MAX_AGE_MS = 30 * 60 * 1000;
const UPGRADE_MODE = "upgrade";

const MEMBERSHIP_PLANS = [
  {
    code: "plus",
    name: "Silver Puff Priority Pass",
    price: "$14.99",
    period: "one-time",
    accent: "silver",
    cardImage: silverCardImg,
    tag: "Best for active users",
    summary: "Faster queue, stronger rewards,\nand premium features unlocked.",
    features: [
      "1.5x Puff Point multiplier",
      "Higher daily chat limit",
      "Early access to new features",
      "Exclusive Discord role",
      "Silver Puff Priority Pass badge"
    ]
  },
  {
    code: "pro",
    name: "Golden Puff Priority Pass",
    price: "$19.99",
    period: "one-time",
    accent: "gold",
    cardImage: goldCardImg,
    tag: "Highest multiplier",
    summary: "Everything in Silver with top-tier boost \nand max priority perks.",
    features: [
      "2x Puff Point multiplier",
      "Highest daily chat limit",
      "Early access to new features",
      "Exclusive Discord role and AMA sessions",
      "Priority beta testing",
      "Priority support",
      "Golden Puff Priority Pass badge"
    ]
  }
];

const GOLDEN_UPGRADE_PLAN = {
  ...MEMBERSHIP_PLANS[1],
  name: "Upgrade to Golden Puff Priority Pass",
  price: "$5.99",
  tag: "Silver member upgrade"
};

const MotionArticle = motion.article;

export default function CheckoutMembership() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessToken, user } = usePrivy();
  const shouldReduceMotion = useReducedMotion();
  const isUpgradeCheckout = new URLSearchParams(location.search).get("mode") === UPGRADE_MODE;
  const availablePlans = isUpgradeCheckout ? [GOLDEN_UPGRADE_PLAN] : MEMBERSHIP_PLANS;
  const finalizationInFlightRef = useRef(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState(() => (isUpgradeCheckout ? "pro" : MEMBERSHIP_PLANS[0].code));
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [submittingPlanCode, setSubmittingPlanCode] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isFinalizingSuccess, setIsFinalizingSuccess] = useState(false);
  const [isCheckingMembershipAccess, setIsCheckingMembershipAccess] = useState(true);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const statusFromQuery =
    searchParams.get("status") ||
    searchParams.get("redirect_status") ||
    searchParams.get("payment_status") ||
    "";
  const hasCheckoutReference = Boolean(
    searchParams.get("session_id") ||
    searchParams.get("checkout_session_id") ||
    searchParams.get("payment_intent")
  );
  const normalizedStatus = (statusFromQuery || (hasCheckoutReference ? "success" : "")).toLowerCase();
  const isStripeReturnFlow = Boolean(statusFromQuery || hasCheckoutReference);
  const statusMessage = isFinalizingSuccess ? "Payment received. Activating your membership..." : "";
  const selectedPlan = useMemo(
    () => availablePlans.find((plan) => plan.code === selectedPlanCode) || availablePlans[0],
    [availablePlans, selectedPlanCode]
  );
  const selectedPlanIndex = Math.max(availablePlans.findIndex((plan) => plan.code === selectedPlan.code), 0);

  const readCheckoutContext = () => {
    try {
      const rawContext = window.sessionStorage.getItem(CHECKOUT_CONTEXT_STORAGE_KEY);
      if (!rawContext) return null;
      return JSON.parse(rawContext);
    } catch {
      return null;
    }
  };

  const readFinalizationState = () => {
    try {
      const rawState = window.sessionStorage.getItem(CHECKOUT_FINALIZATION_STATE_KEY);
      if (!rawState) return null;
      return JSON.parse(rawState);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const persistedContext = readCheckoutContext();
    const persistedPlanCode = persistedContext?.planCode || window.sessionStorage.getItem(CHECKOUT_PLAN_STORAGE_KEY) || "";
    if (!selectedPlanCode && persistedPlanCode) {
      setSelectedPlanCode(persistedPlanCode);
    }
  }, [selectedPlanCode]);

  useEffect(() => {
    let isActive = true;

    const validateCheckoutAccess = async () => {
      if (isStripeReturnFlow) {
        if (isActive) setIsCheckingMembershipAccess(false);
        return;
      }

      try {
        const summary = await fetchPuffSummary(getAccessToken);
        const membershipState = resolveMembershipFromPlanCode(summary?.subscription?.plan_code);
        const isSilverMember = membershipState.planCode === "plus";
        const allowAccess = isUpgradeCheckout ? isSilverMember : !membershipState.isPremiumActive;

        if (!allowAccess) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Membership access validation error:", error);
      } finally {
        if (isActive) setIsCheckingMembershipAccess(false);
      }
    };

    validateCheckoutAccess();

    return () => {
      isActive = false;
    };
  }, [getAccessToken, isStripeReturnFlow, isUpgradeCheckout, navigate]);

  useEffect(() => {
    if (FAILED_STATUSES.has(normalizedStatus)) {
      navigate("/membership/checkout/failure", { replace: true });
    }
  }, [navigate, normalizedStatus]);

  useEffect(() => {
    const finalizeMembership = async () => {
      if (!SUCCESS_STATUSES.has(normalizedStatus) || isFinalizingSuccess || finalizationInFlightRef.current) return;

      const checkoutContext = readCheckoutContext();
      const persistedPlanCode = checkoutContext?.planCode || window.sessionStorage.getItem(CHECKOUT_PLAN_STORAGE_KEY) || "";
      const resolvedPlanCode = persistedPlanCode || selectedPlanCode;
      const checkoutMode = checkoutContext?.mode || "purchase";
      const isUpgrade = checkoutMode === UPGRADE_MODE;

      if (!resolvedPlanCode || !ALLOWED_PLAN_CODES.has(resolvedPlanCode)) {
        setCheckoutError("Invalid membership plan detected. Please select a plan and try again.");
        return;
      }

      if (!checkoutContext?.initiatedAt || !checkoutContext?.nonce) {
        setCheckoutError("Missing secure checkout context. Please try again from the checkout page.");
        return;
      }

      if (Date.now() - checkoutContext.initiatedAt > CHECKOUT_CONTEXT_MAX_AGE_MS) {
        setCheckoutError("Your checkout session has expired. Please start again.");
        return;
      }

      if (checkoutContext.planCode !== resolvedPlanCode) {
        setCheckoutError("Checkout plan mismatch detected. Please start your payment again.");
        return;
      }

      if (!user?.id) {
        setCheckoutError("We could not verify your user ID. Please sign in again and retry.");
        return;
      }

      if (isUpgrade && resolvedPlanCode !== "pro") {
        setCheckoutError("Invalid membership upgrade detected. Please try again from the dashboard.");
        return;
      }

      const checkoutReference =
        searchParams.get("session_id") ||
        searchParams.get("checkout_session_id") ||
        searchParams.get("payment_intent") ||
        `${user.id}:${checkoutContext.nonce}`;
      const finalizationReference = `${user.id}:${resolvedPlanCode}:${checkoutReference}`;
      const finalizedReference = window.sessionStorage.getItem(CHECKOUT_FINALIZED_REF_KEY) || "";
      const finalizationState = readFinalizationState();

      if (finalizedReference === finalizationReference || (finalizationState?.key === finalizationReference && finalizationState?.status === "done")) {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (finalizationState?.key === finalizationReference && finalizationState?.status === "pending") {
        return;
      }

      setCheckoutError("");
      finalizationInFlightRef.current = true;
      setIsFinalizingSuccess(true);
      setSubmittingPlanCode(resolvedPlanCode);
      window.sessionStorage.setItem(
        CHECKOUT_FINALIZATION_STATE_KEY,
        JSON.stringify({ key: finalizationReference, status: "pending", at: Date.now() })
      );

      try {
        if (isUpgrade) {
          const summary = await fetchPuffSummary(getAccessToken);
          const membershipState = resolveMembershipFromPlanCode(summary?.subscription?.plan_code);

          if (membershipState.planCode !== "plus") {
            window.sessionStorage.removeItem(CHECKOUT_FINALIZATION_STATE_KEY);
            setCheckoutError("This upgrade is no longer available for your membership.");
            return;
          }
        }

        const startsAtDate = new Date();
        const endsAtDate = new Date(startsAtDate);
        endsAtDate.setFullYear(endsAtDate.getFullYear() + 10);

        await updatePuffSubscription({
          getAccessToken,
          userId: user.id,
          planCode: resolvedPlanCode,
          startsAt: startsAtDate.toISOString(),
          endsAt: endsAtDate.toISOString(),
          note: SUBSCRIPTION_NOTE,
          idempotencyKey: finalizationReference,
          isUpgrade
        });

        window.sessionStorage.setItem(CHECKOUT_FINALIZED_REF_KEY, finalizationReference);
        window.sessionStorage.setItem(
          CHECKOUT_FINALIZATION_STATE_KEY,
          JSON.stringify({ key: finalizationReference, status: "done", at: Date.now() })
        );
        window.sessionStorage.removeItem(CHECKOUT_CONTEXT_STORAGE_KEY);
        window.sessionStorage.removeItem(CHECKOUT_PLAN_STORAGE_KEY);
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Subscription update error:", error);
        window.sessionStorage.removeItem(CHECKOUT_FINALIZATION_STATE_KEY);
        setCheckoutError("Payment was successful, but we could not update your membership yet. Please contact support.");
      } finally {
        finalizationInFlightRef.current = false;
        setSubmittingPlanCode("");
        setIsFinalizingSuccess(false);
      }
    };

    finalizeMembership();
  }, [getAccessToken, isFinalizingSuccess, navigate, normalizedStatus, searchParams, selectedPlanCode, user?.id]);

  const handlePayWithStripe = (planCode) => {
    if (!planCode) return;

    if (isCheckingMembershipAccess) {
      return;
    }

    if (!ALLOWED_PLAN_CODES.has(planCode)) {
      setCheckoutError("Invalid plan selected.");
      return;
    }

    if (isUpgradeCheckout && planCode !== "pro") {
      setCheckoutError("Only the Golden Pass is available for this upgrade.");
      return;
    }

    setCheckoutError("");
    setSubmittingPlanCode(planCode);

    const paymentLink = isUpgradeCheckout
      ? getStripePaymentLinkForUpgrade(planCode)
      : getStripePaymentLinkForPlan(planCode);
    if (!paymentLink) {
      setSubmittingPlanCode("");
      setCheckoutError("No payment link is configured for this membership plan.");
      return;
    }

    const checkoutContext = {
      planCode,
      mode: isUpgradeCheckout ? UPGRADE_MODE : "purchase",
      initiatedAt: Date.now(),
      nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    };

    window.sessionStorage.removeItem(CHECKOUT_FINALIZATION_STATE_KEY);
    window.sessionStorage.removeItem(CHECKOUT_FINALIZED_REF_KEY);
    window.sessionStorage.setItem(CHECKOUT_CONTEXT_STORAGE_KEY, JSON.stringify(checkoutContext));
    window.sessionStorage.setItem(CHECKOUT_PLAN_STORAGE_KEY, planCode);
    window.location.assign(paymentLink);
  };

  const selectPlanAtIndex = (nextIndex, direction) => {
    setCarouselDirection(direction);
    setSelectedPlanCode(MEMBERSHIP_PLANS[nextIndex].code);
  };

  const handlePlanNavigation = (direction) => {
    const nextIndex = (selectedPlanIndex + direction + availablePlans.length) % availablePlans.length;
    selectPlanAtIndex(nextIndex, direction);
  };

  return (
    <div className="membership-checkout-page">
      <img
        className="membership-side-bear membership-side-bear-left"
        src={silverCardImg}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
      <img
        className="membership-side-bear membership-side-bear-right"
        src={goldCardImg}
        alt=""
        aria-hidden="true"
        decoding="async"
      />

      <main className="membership-checkout-main">
        {isCheckingMembershipAccess ? (
          <section className="membership-access-loading" aria-live="polite" aria-label="Checking membership access">
            <div className="membership-access-loading-visual" aria-hidden="true">
              <div className="membership-access-spinner" />
              <img src={logoImg} alt="" className="membership-access-logo" />
            </div>
          </section>
        ) : null}

        {!isCheckingMembershipAccess ? (
          <>
        <div className="membership-checkout-topbar">
          <button type="button" className="membership-back-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>

        {statusMessage ? <div className="membership-status-note">{statusMessage}</div> : null}
        {checkoutError ? <div className="membership-error-note">{checkoutError}</div> : null}

        <section className={`membership-plan-carousel ${isUpgradeCheckout ? "membership-plan-carousel--upgrade" : ""}`} aria-label={isUpgradeCheckout ? "Upgrade to Golden Puff Priority Pass" : "Select a Puff Priority Pass package"}>
          {!isUpgradeCheckout ? (
            <button
              type="button"
              className="membership-carousel-arrow"
              onClick={() => handlePlanNavigation(-1)}
              aria-label="View previous package"
              title="Previous package"
            >
              &larr;
            </button>
          ) : null}

          <div className="membership-carousel-stage">
            {availablePlans.map((plan, index) => {
              const isActive = index === selectedPlanIndex;
              const stackDepth = Math.abs(index - selectedPlanIndex);
              return (
                <MotionArticle
                  key={plan.code}
                  className={`membership-plan-card ${isActive ? "selected" : "stacked"} ${plan.accent}`}
                  aria-label={`${plan.name}, ${isActive ? "selected package" : "package in deck"}`}
                  aria-hidden={!isActive}
                  inert={!isActive || undefined}
                  animate={{
                    scale: isActive ? 1.035 : 0.9 - (stackDepth - 1) * 0.04,
                    y: isActive ? 0 : 30 + (stackDepth - 1) * 12,
                    x: isActive ? 0 : carouselDirection * -22 * stackDepth,
                    rotate: isActive ? 0 : carouselDirection * -3 * stackDepth,
                    opacity: isActive ? 1 : 0.85,
                    zIndex: availablePlans.length - stackDepth
                  }}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 28, mass: 0.9 }}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  <span className="membership-plan-tag">{plan.tag}</span>
                  <h2>{plan.name}</h2>
                  <img className="membership-plan-visual" src={plan.cardImage} alt={`${plan.name} card`} />
                  <p className="membership-plan-summary">{plan.summary}</p>

                  <div className="membership-plan-purchase">
                    <p className="membership-plan-price"><strong>{plan.price}</strong><span> / {plan.period}</span></p>

                    <div className="membership-plan-features">
                      <h3>Package features</h3>
                      <ul>
                        {plan.features.map((feature) => (
                          <li key={feature}>
                            <span aria-hidden="true">&#10003;</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className="membership-primary-checkout-btn"
                      onClick={() => handlePayWithStripe(plan.code)}
                      disabled={Boolean(submittingPlanCode) || isCheckingMembershipAccess}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {submittingPlanCode ? "Preparing Stripe checkout..." : isUpgradeCheckout ? "Upgrade to Golden Pass" : "Continue to Checkout"}
                    </button>
                  </div>
                </MotionArticle>
              );
            })}
          </div>

          {!isUpgradeCheckout ? (
            <button
              type="button"
              className="membership-carousel-arrow"
              onClick={() => handlePlanNavigation(1)}
              aria-label="View next package"
              title="Next package"
            >
              &rarr;
            </button>
          ) : null}

          {!isUpgradeCheckout ? (
            <div className="membership-carousel-indicators" role="tablist" aria-label="Membership packages">
            {availablePlans.map((plan, index) => (
              <button
                key={plan.code}
                type="button"
                className={`membership-carousel-indicator ${index === selectedPlanIndex ? "active" : ""}`}
                role="tab"
                aria-selected={index === selectedPlanIndex}
                aria-label={`View ${plan.name}`}
                onClick={() => selectPlanAtIndex(index, index > selectedPlanIndex ? 1 : -1)}
              />
            ))}
            </div>
          ) : null}
        </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
