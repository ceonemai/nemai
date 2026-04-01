// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import "./AppChat.css";

export default function AppChat() {
  const { logout, user } = usePrivy();

  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessageToBackend = async (text) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve("Nem AI is not available at the moment. We're sorry for the inconvenience."), 800);
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToBackend(userMsg.content);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { id: Date.now() + 2, role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayName =
    user?.email?.address ||
    user?.twitter?.username ||
    "User";

  return (
    <div className="appchat">
      {/* 🔹 Top Utility Bar */}
      <div className="topbar">
        <div className="topbar-right">
          <div className="user-info">
            <div className="user-dot" />
            <span>{displayName}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="appchat-header">
        <div className="brand">
          <div className="brand-dot" />
          <div>
            <div className="brand-title">NEM AI Assistant</div>
            <div className="brand-sub">Emergency Decision Support</div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="appchat-body">
        <div className="chat-container">
          {messages.map((msg) => (
            <Message key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar bot" />
              <div className="bubble assistant">
                <div className="typing"><span/><span/><span/></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="appchat-input">
        <div className="input-wrap">
          <textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}>
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      {!isUser && <div className="avatar bot" />}
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>{content}</div>
      {isUser && <div className="avatar user" />}
    </div>
  );
}