// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./AppChat.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";

const apiUrl = import.meta.env.VITE_DIFY_API_URL || "https://api.dify.ai/v1";
const apiKey = import.meta.env.VITE_DIFY_API_KEY;

const QUOTA_ERROR_MSG = "⚠️ **System is busy (Quota Exceeded)**\n\nThe system is currently handling many requests. Please wait a moment.";

export default function AppChat() {
  const { logout, user } = usePrivy();

  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch conversations history
  const fetchConversations = async () => {
    if (!user?.id) return;
    setHistoryLoading(true);
    try {
      const response = await fetch(`${apiUrl}/conversations?user=${user.id}&limit=20`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      const data = await response.json();
      setConversations(data.data || []);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load a specific conversation
  const loadConversation = async (id) => {
    if (loading) return;
    setLoading(true);
    setConversationId(id);
    try {
      const response = await fetch(`${apiUrl}/messages?conversation_id=${id}&user=${user.id}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      const data = await response.json();

      // Transform Dify messages to our format
      const formattedMessages = data.data.map(m => ([
        { id: m.id + "_u", role: "user", content: m.query },
        { id: m.id + "_a", role: "assistant", content: m.answer || QUOTA_ERROR_MSG }
      ])).reverse().flat();

      setMessages(formattedMessages.length > 0 ? formattedMessages : [
        { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
      ]);
    } catch (error) {
      console.error("Load conversation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history on user load
  useEffect(() => {
    if (user?.id) fetchConversations();
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);
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
          user: user?.id || "anonymous-user",
          response_mode: "blocking",
          conversation_id: conversationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // ส่ง error object ออกไปเพื่อให้ handleSend จัดการต่อ
        throw {
          status: response.status,
          message: data.message || "Unknown error",
          code: data.code
        };
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      return { answer: data.answer, conversation_id: data.conversation_id };
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
      const isNewConversation = !conversationId;
      const { answer, conversation_id } = await sendMessageToBackend(userMsg.content);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", content: answer }]);

      if (isNewConversation && conversation_id) {
        // อัปเดตประวัติใน UI ทันที (Optimistic Update)
        const newConv = {
          id: conversation_id,
          name: userMsg.content.substring(0, 30) + (userMsg.content.length > 30 ? "..." : "")
        };
        setConversations(prev => [newConv, ...prev]);

        // รอ Dify ประมวลผลชื่อจริงๆ สักครู่แล้วค่อยดึงประวัติมาทับ
        setTimeout(fetchConversations, 2000);
      }
    } catch (err) {
      let errorMsg = "Sorry, something went wrong. Please try again later.";

      // Check for Dify or Gemini quota errors
      const errorString = typeof err === 'string' ? err : JSON.stringify(err);

      if (err.status === 429 || errorString.includes("RESOURCE_EXHAUSTED") || errorString.includes("quota")) {
        errorMsg = QUOTA_ERROR_MSG;
      } else if (err.message && (err.message.includes("Run failed") || err.message.includes("PluginInvokeError"))) {
        if (err.message.includes("429")) {
          errorMsg = QUOTA_ERROR_MSG;
        }
      }

      setMessages((m) => [...m, { id: Date.now() + 2, role: "assistant", content: errorMsg }]);
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
    setIsSidebarOpen(false);
  };

  const handleConversationClick = (id) => {
    if (id === conversationId) return;
    loadConversation(id);
    setIsSidebarOpen(false);
  };

  const displayName =
    user?.email?.address ||
    user?.twitter?.username ||
    "User";

  // เช็คว่าเริ่มแชทหรือยัง (ถ้ามีข้อความมากกว่า 1 หรือกำลังโหลด)
  const isChatStarted = messages.length > 1 || loading;

  return (
    <div className="appchat-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 🔹 Sidebar (Gemini Style) */}
      <aside className={`appchat-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logo} alt="NEM AI Logo" className="sidebar-logo" />
            <div className="brand-title">NEM AI</div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <span className="plus-icon">+</span> New Chat
        </button>

        <div className="sidebar-history">
          <div className="history-label">Recent Chats</div>
          {historyLoading && conversations.length === 0 && <div className="history-status">Loading...</div>}
          {!historyLoading && conversations.length === 0 && <div className="history-status">No history yet</div>}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`history-item ${conv.id === conversationId ? "active" : ""}`}
              onClick={() => handleConversationClick(conv.id)}
            >
              <span className="history-icon" style={{ display: "flex", alignItems: "center" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5ce1e6" />
                      <stop offset="100%" stopColor="#3092d6" />
                    </linearGradient>
                  </defs>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6C12 8.2091 13.7909 10 16 10C13.7909 10 12 11.7909 12 14C12 11.7909 10.2091 10 8 10C10.2091 10 12 8.2091 12 6Z" fill="url(#aiGradient)" />
                </svg>
              </span>
              <span className="history-name">{conv.name || "Untitled Chat"}</span>
            </div>
          ))}
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
        {/* Mobile Header (Hamburger Menu) */}
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="mobile-title">NEM AI</span>
        </div>

        <div className="chat-messages" style={{ display: isChatStarted ? "flex" : "none" }}>
          {messages.map((msg) => (
            <Message key={msg.id} role={msg.role} content={msg.content} displayName={displayName} />
          ))}

          {loading && (
            <div className="message-row assistant">
              <img src={logo} alt="NEM AI Logo" className="avatar bot-img" />
              <div className="bubble assistant">
                <div className="typing"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
      {!isUser && <img src={logo} alt="NEM AI Logo" className="avatar bot-img" />}
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        >
          {content?.replace(/\n{3,}/g, '\n\n')}
        </ReactMarkdown>
      </div>
      {isUser && <div className="avatar user">{displayName?.charAt(0).toUpperCase() || "U"}</div>}
    </div>
  );
}
