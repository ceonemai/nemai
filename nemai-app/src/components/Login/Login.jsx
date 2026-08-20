/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import "./Login.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";

export default function Login() {
  const { login, logout, authenticated, ready, user } = usePrivy();

  return (
    <div className="login-page">
      {!ready && (
        <div className="login-loading-overlay">
          <div className="login-loading-card">
            <img src={logo} alt="NEM AI Logo" className="login-loading-logo" />
            <div className="login-loading-text">Loading...</div>
          </div>
        </div>
      )}

      <div className="login-bg" />

      <div className="login-center">
        <motion.img
          src={logo}
          alt="NEM AI Logo"
          className="login-logo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="login-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Welcome to NEM AI<br />
          <span>Alpha Testing</span>
        </motion.h1>

        <motion.p
          className="login-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          If you’re chosen to participate in the alpha test, join below.
        </motion.p>

        {!authenticated ? (
          <motion.button
            className="login-btn primary"
            onClick={login}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Log in / Sign up
          </motion.button>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              Logged in as:
              <br />
              <b>{user?.email?.address || user?.google?.email || user?.twitter?.username}</b>
            </div>

            <motion.button className="login-btn secondary" onClick={logout}>
              Log out
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
