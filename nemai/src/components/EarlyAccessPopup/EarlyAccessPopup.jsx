import { useState } from "react";
import "./EarlyAccessPopup.css";
import xIcon from "../../assets/images/icons/x.png";
import discordIcon from "../../assets/images/icons/discord.svg";

function EarlyAccessPopup({ onClose }) {
    const [followedX, setFollowedX] = useState(false);
    const [joinedDiscord, setJoinedDiscord] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [message, setMessage] = useState("");

    const allSocialDone = followedX && joinedDiscord;

    const handleFollowX = () => {
        window.open("https://x.com/nemai_io", "_blank", "noopener,noreferrer");
        setFollowedX(true);
    };

    const handleJoinDiscord = () => {
        window.open("https://discord.gg/xdeUYtwnnb", "_blank", "noopener,noreferrer");
        setJoinedDiscord(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !allSocialDone) return;

        setStatus("submitting");
        setMessage("");

        try {
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbzDUECP_tHkxF3jN0vlo1uWB_s_aduZQIfM1Qvuo0vZgvEKljoEbWAfP7Jj2hQQZzFfgQ/exec",
                {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (data.responseCode === 409 || data.status === "duplicate") {
                setStatus("error");
                setMessage(data.message || "Email already subscribed");
            } else if (data.responseCode === 400) {
                setStatus("error");
                setMessage(data.message || "Invalid request");
            } else if (data.responseCode === 500) {
                setStatus("error");
                setMessage(data.message || "Internal server error. Please try again later.");
            } else if (data.responseCode === 200 || data.status === "success" || response.ok) {
                setStatus("success");
                setMessage("");
            } else {
                setStatus("error");
                setMessage(data.message || "Something went wrong.");
            }

        } catch (error) {
            console.error("Subscription error:", error);
            setStatus("error");
            setMessage("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>
                    ✕
                </button>

                {status === "success" ? (
                    <div className="popup-success">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h2>You're In!</h2>
                        <p>We'll notify you when Nemai launches.</p>
                        <button className="popup-done-btn" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="popup-title">Get Early Access</h2>
                        <p className="popup-subtitle">
                            Follow us on social media to unlock early access.
                        </p>

                        {/* ── Section 1: Social Links ── */}
                        <div className="popup-section">
                            <div className="popup-section-label">
                                <span className="section-number">1</span>
                                Follow &amp; Join Us
                            </div>

                            <button
                                className={`social-row ${followedX ? "completed" : ""}`}
                                onClick={handleFollowX}
                            >
                                <div className="social-row-left">
                                    <div className="social-icon">
                                        <img src={xIcon} alt="X" />
                                    </div>
                                    <span>Follow us on X</span>
                                </div>
                                <div className={`check-circle ${followedX ? "checked" : ""}`}>
                                    {followedX && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            <button
                                className={`social-row ${joinedDiscord ? "completed" : ""}`}
                                onClick={handleJoinDiscord}
                            >
                                <div className="social-row-left">
                                    <div className="social-icon">
                                        <img src={discordIcon} alt="Discord" />
                                    </div>
                                    <span>Join our Discord</span>
                                </div>
                                <div className={`check-circle ${joinedDiscord ? "checked" : ""}`}>
                                    {joinedDiscord && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* ── Section 2: Email ── */}
                        <div className={`popup-section ${!allSocialDone ? "locked" : ""}`}>
                            <div className="popup-section-label">
                                <span className="section-number">2</span>
                                Enter Your Email
                                {!allSocialDone && (
                                    <span className="lock-badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        Complete Step 1 first
                                    </span>
                                )}
                            </div>

                            <form className="email-form" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="yourname@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!allSocialDone}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={!allSocialDone || status === "submitting"}
                                >
                                    {status === "submitting" ? (
                                        <span className="spinner" />
                                    ) : (
                                        "Get Access"
                                    )}
                                </button>
                            </form>

                            {status === "error" && message && (
                                <div className="popup-error-msg">
                                    {message}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default EarlyAccessPopup;
