// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./AppChat.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";

const apiUrl = import.meta.env.VITE_DIFY_API_URL || "https://api.dify.ai/v1";
const apiKey = import.meta.env.VITE_DIFY_API_KEY;

const QUOTA_ERROR_MSG = "⚠️ **System is busy (Quota Exceeded)**\nThe system is currently handling many requests. Please wait a moment.";

export default function AppChat() {
  const { logout, user } = usePrivy();

  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversationId, setConversationId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
  };

  const handleConversationClick = (id) => {
    if (id === conversationId) return;
    loadConversation(id);
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
          <div className="history-label">Recent Chats</div>
          {historyLoading && conversations.length === 0 && <div className="history-status">Loading...</div>}
          {!historyLoading && conversations.length === 0 && <div className="history-status">No history yet</div>}
          
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`history-item ${conv.id === conversationId ? "active" : ""}`}
              onClick={() => handleConversationClick(conv.id)}
            >
              <span className="history-icon">💬</span>
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
