import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png"; // เปลี่ยน path ให้ตรงโปรเจกต์

export default function Login() {
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div className="login-page">
            {/* Ambient Background Glow */}
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
                    You are among the first users helping us shape the future of AI-powered health guidance. During this alpha phase, you may experience limited features or occasional issues as we continue improving the system.
                    Your feedback will help us build a safer and smarter platform for everyone.
                </motion.p>

                {!loggedIn ? (
                    <motion.button
                        className="login-btn primary"
                        onClick={() => setOpen(true)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Log in / Sign up
                    </motion.button>
                ) : (
                    <motion.button
                        className="login-btn secondary"
                        onClick={() => setLoggedIn(false)}
                    >
                        Log out
                    </motion.button>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            className="modal-wrap"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal">
                                <h2>Sign in to NEM AI</h2>

                                <input placeholder="Email" />
                                <input placeholder="Password" type="password" />

                                <button
                                    className="login-btn primary full"
                                    onClick={() => {
                                        setLoggedIn(true);
                                        setOpen(false);
                                    }}
                                >
                                    Continue
                                </button>

                                <button
                                    className="modal-cancel"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}