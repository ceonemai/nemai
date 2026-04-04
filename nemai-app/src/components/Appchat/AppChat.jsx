// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./AppChat.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";
import mascot from "../../../../nemai/src/assets/images/mascots/Mascott NEM-86.png";

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

  const handleNewChat = () => {
    setMessages([{ id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }]);
    setConversationId("");
  };

  const displayName =
    user?.email?.address ||
    user?.twitter?.username ||
    "User";

  // เช็คว่าเริ่มแชทหรือยัง (ถ้ามีข้อความมากกว่า 1 หรือกำลังโหลด)
  const isChatStarted = messages.length > 1 || loading;

  return (
    <div className="appchat-layout">
      {/* 🔹 Sidebar (Gemini Style) */}
      <aside className="appchat-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="NEM AI Logo" className="sidebar-logo" />
          <div className="brand-title">NEM AI</div>
        </div>
        
        <button className="new-chat-btn" onClick={handleNewChat}>
          <span className="plus-icon">+</span> New Chat
        </button>

        <div className="sidebar-history">
          {/* พื้นที่สำหรับประวัติการแชทในอนาคต */}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
            <span className="user-name">{displayName}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* 🔹 Main Chat Area */}
      <main className={`appchat-main ${isChatStarted ? "started" : "empty"}`}>
        <div className="chat-messages" style={{ display: isChatStarted ? "flex" : "none" }}>
          {messages.map((msg) => (
            <Message key={msg.id} role={msg.role} content={msg.content} displayName={displayName} />
          ))}

          {loading && (
            <div className="message-row assistant">
              <img src={mascot} alt="NEM AI Mascot" className="avatar bot-img" />
              <div className="bubble assistant">
                <div className="typing"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>

        {!isChatStarted && (
          <div className="welcome-text">
            <h1>Hello, {displayName.split('@')[0]}</h1>
            <p>How can I help you today?</p>
          </div>
        )}

        <div className="chat-input-container">
          <div className="input-box">
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
          <div className="disclaimer">NEM AI can make mistakes. Consider verifying critical information.</div>
        </div>
      </main>
    </div>
  );
}

function Message({ role, content, displayName }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      {!isUser && <img src={mascot} alt="NEM AI Mascot" className="avatar bot-img" />}
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]} 
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
      {isUser && <div className="avatar user">{displayName?.charAt(0).toUpperCase() || "U"}</div>}
    </div>
  );
}
