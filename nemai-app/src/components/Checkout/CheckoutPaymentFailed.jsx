import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutMembership.css";

const REDIRECT_SECONDS = 7;

export default function CheckoutPaymentFailed() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          navigate("/membership/checkout", { replace: true });
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [navigate]);

  return (
    <div className="membership-checkout-page">
      <main className="membership-checkout-main">
        <section className="membership-failed-card" aria-label="Payment failed">
          <div className="membership-failed-spinner" aria-hidden="true" />
          <h1>Payment was not completed</h1>
          <p>
            We could not confirm your payment. You will be redirected back to checkout in {secondsLeft} second
            {secondsLeft === 1 ? "" : "s"}.
          </p>
          <button
            type="button"
            className="membership-primary-checkout-btn"
            onClick={() => navigate("/membership/checkout", { replace: true })}
          >
            Return to Checkout Now
          </button>
        </section>
      </main>
    </div>
  );
}
