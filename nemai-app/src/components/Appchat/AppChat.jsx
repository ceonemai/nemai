// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./AppChat.css";

const apiUrl = import.meta.env.VITE_DIFY_API_URL || "https://api.dify.ai/v1";
const apiKey = import.meta.env.VITE_DIFY_API_KEY;

export default function AppChat() {
  const { logout, user } = usePrivy();

  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversationId, setConversationId] = useState("");
  const sendMessageToBackend = async (text) => {
    try {
      const response = await fetch(`${apiUrl}/chat-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: {},
          query: text,
          user: user?.id || "anonymous-user", // ใช้ id จาก Privy หรือระบุเอง
          response_mode: "blocking", // ใช้แบบ blocking เพื่อความง่ายในเบื้องต้น
          conversation_id: conversationId // ส่ง id เดิมกลับไปเพื่อคุยต่อ
        })
      });
      const data = await response.json();

      // เก็บ conversation_id ไว้ใช้ในครั้งถัดไป
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      return data.answer;
    } catch (error) {
      console.error("Dify Error:", error);
      throw error;
    }
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
                <div className="typing"><span /><span /><span /></div>
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
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]} 
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
      {isUser && <div className="avatar user" />}
    </div>
  );
}