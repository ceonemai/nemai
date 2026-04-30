// =========================================
// File: src/components/Appchat/AppChat.jsx
// =========================================

import { useState, useEffect, useRef, useMemo, memo, useCallback } from "react";
import { usePrivy, getAccessToken } from "@privy-io/react-auth";
import ReactMarkdown from "react-markdown";
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./AppChat.css";
import logo from "../../../../nemai/src/assets/images/LogogramFullColor.png";

const apiUrl = import.meta.env.VITE_DIFY_API_URL || "https://api.dify.ai/v1";
const apiKey = import.meta.env.VITE_DIFY_API_KEY;

const QUOTA_ERROR_MSG = "⚠️ **System is busy (Quota Exceeded)**\n\nThe system is currently handling many requests. Please wait a moment.";

export default function AppChat() {
  const { ready, logout, user } = usePrivy();

  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm NEM AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Profile Popup State
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Profile Menu & PHD State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPhdPopupOpen, setIsPhdPopupOpen] = useState(false);
  const [phdFormData, setPhdFormData] = useState({
    weight: "",
    height: "",
    medicalConditionIds: [],
    drugIds: [],
    allergyCategoryIds: [],
    allergyDetails: {}
  });
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [allergyCategories, setAllergyCategories] = useState([]);
  const [isSavingPhd, setIsSavingPhd] = useState(false);
  const [masterDataLoading, setMasterDataLoading] = useState(false);

  // Fetch conversations history
  const fetchConversations = useCallback(async () => {
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
  }, [user?.id]);

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
  }, [user?.id, fetchConversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch("https://customer-api.nemai.io/api/v1/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        cache: "no-store" // บังคับไม่ให้จำข้อมูลเก่า ขอข้อมูลใหม่สุดจาก Server เสมอ
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setProfileData(data.data || data);
        } else {
          console.error("Expected JSON but received:", contentType);
          setProfileData({ id: "-", email: "API returned HTML (Check URL or Proxy)" });
        }
      } else {
        console.error("Failed to fetch user profile", response.status);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch Master Data for PHD
  const fetchMasterData = async () => {
    setMasterDataLoading(true);
    try {
      const token = await getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [medRes, drugsRes, allergyCatsRes] = await Promise.all([
        fetch("https://customer-api.nemai.io/api/v1/master/medical-conditions", { headers }),
        fetch("https://customer-api.nemai.io/api/v1/master/drugs", { headers }),
        fetch("https://customer-api.nemai.io/api/v1/master/allergy-categories", { headers })
      ]);

      if (medRes.ok) { const d = await medRes.json(); setMedicalConditions(d.data || d || []); }
      if (drugsRes.ok) { const d = await drugsRes.json(); setDrugs(d.data || d || []); }
      if (allergyCatsRes.ok) { const d = await allergyCatsRes.json(); setAllergyCategories(d.data || d || []); }
    } catch (error) {
      console.error("Error fetching master data:", error);
    } finally {
      setMasterDataLoading(false);
    }
  };

  useEffect(() => {
    if (profileData && isPhdPopupOpen) {
      const mc = profileData.medical_conditions || profileData.profile?.medical_conditions || [];
      const dr = profileData.drugs || profileData.profile?.drugs || [];
      const al = profileData.user_allergies || profileData.allergies || profileData.profile?.allergies || [];
      const w = profileData.weight || profileData.profile?.weight || "";
      const h = profileData.height || profileData.profile?.height || "";

      setPhdFormData({
        weight: w ? String(w) : "",
        height: h ? String(h) : "",
        medicalConditionIds: mc.map(mc => String(mc.id)),
        drugIds: dr.map(d => String(d.id)),
        allergyCategoryIds: al.map(a => String(a.allergy_category_id || a.category_id)),
        allergyDetails: al.reduce((acc, a) => ({ ...acc, [a.allergy_category_id || a.category_id]: a.allergy }), {})
      });
    }
  }, [profileData, isPhdPopupOpen]);

  const openPhdPopup = () => {
    setIsPhdPopupOpen(true);
    fetchUserProfile(); // เรียก API GET /api/v1/users ใหม่ทุกครั้งที่เปิดเพื่อให้ได้ข้อมูลล่าสุด
    if (medicalConditions.length === 0) fetchMasterData();
  };

  const handlePhdChange = (e) => {
    const { name, value } = e.target;
    setPhdFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergyDetailChange = (categoryId, value) => {
    setPhdFormData(prev => ({ ...prev, allergyDetails: { ...prev.allergyDetails, [categoryId]: value } }));
  };

  const weightNum = Number(phdFormData.weight);
  const heightNum = Number(phdFormData.height);
  const isWeightOutOfBounds = phdFormData.weight !== "" && (weightNum < 2 || weightNum > 300);
  const isHeightOutOfBounds = phdFormData.height !== "" && (heightNum < 30 || heightNum > 300);

  const isPhdValid =
    phdFormData.weight !== "" && !isWeightOutOfBounds &&
    phdFormData.height !== "" && !isHeightOutOfBounds &&
    phdFormData.allergyCategoryIds.every(
      id => phdFormData.allergyDetails[id] && phdFormData.allergyDetails[id].trim() !== ""
    );

  const handleSavePhd = async () => {
    setIsSavingPhd(true);
    try {
      // แปลงรูปแบบวันที่เหมือนใน SetupProfile (เผื่อกรณี API ส่งกลับมามี / หรือ T)
      let formattedBirthDate = profileData?.birth_date || profileData?.profile?.birth_date || "";
      if (formattedBirthDate.includes("/")) {
        const [day, month, year] = formattedBirthDate.split("/");
        formattedBirthDate = `${year}-${month}-${day}`;
      } else if (formattedBirthDate.includes("T")) {
        formattedBirthDate = formattedBirthDate.split("T")[0]; // ตัดเอาเฉพาะ YYYY-MM-DD
      }

      const token = await getAccessToken();
      
      const payload = {
        allergies: phdFormData.allergyCategoryIds.map(id => ({
          allergy: phdFormData.allergyDetails[id] || "",
          category_id: Number(id)
        })),
        drug_ids: phdFormData.drugIds.map(Number),
        medical_condition_ids: phdFormData.medicalConditionIds.map(Number),
        profile: {
          birth_date: formattedBirthDate,
          country_id: Number(profileData?.country_id || profileData?.profile?.country_id || 0),
          gender: profileData?.gender || profileData?.profile?.gender || "",
          height: Number(phdFormData.height),
          name: profileData?.name || profileData?.profile?.name || "-",
          weight: Number(phdFormData.weight)
        }
      };

      console.log("Submit Payload:", payload);

      const response = await fetch("https://customer-api.nemai.io/api/v1/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) { setIsPhdPopupOpen(false); fetchUserProfile(); }
      else { alert("Failed to save PHD."); }
    } catch (error) {
      console.error(error);
      alert("Error saving PHD.");
    } finally { setIsSavingPhd(false); }
  };

  const toggleProfilePopup = () => {
    const willOpen = !isProfilePopupOpen;
    setIsProfilePopupOpen(willOpen);
    if (willOpen) {
      fetchUserProfile(); // ดึงข้อมูล Profile ใหม่ทุกครั้งเช่นกัน
    }
  };

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

  const combinedMcOptions = useMemo(() => {
    const map = new Map();
    const mcData = profileData?.medical_conditions || profileData?.profile?.medical_conditions || [];
    mcData.forEach(c => {
      if (c?.id) map.set(String(c.id), c.name);
    });
    medicalConditions.forEach(c => {
      if (c?.id) map.set(String(c.id), c.name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [profileData, medicalConditions]);

  const combinedDrugOptions = useMemo(() => {
    const map = new Map();
    const drugData = profileData?.drugs || profileData?.profile?.drugs || [];
    drugData.forEach(c => {
      if (c?.id) map.set(String(c.id), c.name);
    });
    drugs.forEach(c => {
      if (c?.id) map.set(String(c.id), c.name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [profileData, drugs]);

  const combinedAllergyOptions = useMemo(() => {
    const map = new Map();
    const allergyData = profileData?.user_allergies || profileData?.allergies || profileData?.profile?.allergies || [];
    allergyData.forEach(a => {
      const catId = a?.allergy_category_id || a?.category_id;
      if (catId) {
        map.set(String(catId), a.category?.name || a.category_name || `Category ${catId}`);
      }
    });
    allergyCategories.forEach(c => {
      if (c?.id) map.set(String(c.id), c.name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [profileData, allergyCategories]);

  // ป้องกันการ Re-render รัวๆ โดยโชว์ Loading จนกว่า Privy จะเตรียมสถานะ User เสร็จ
  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8fafc" }}>
        <svg className="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2187AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="appchat-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 🔹 Profile Modal (Centered) */}
      {isProfilePopupOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsProfilePopupOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close-btn" onClick={() => setIsProfilePopupOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="profile-modal-body">
              {profileLoading ? (
                <div className="profile-modal-loading">Loading profile...</div>
              ) : profileData ? (
                <div className="profile-modal-content">
                  <div className="profile-modal-avatar">
                    {profileData?.email?.charAt(0).toUpperCase() || displayName.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="profile-input-box">
                    <span className="inner-label">Name</span>
                    <input type="text" value={profileData?.profile?.name || profileData?.name || "-"} disabled readOnly />
                  </div>
                  <div className="profile-input-box">
                    <span className="inner-label">Email</span>
                    <input type="text" value={profileData?.email || "-"} disabled readOnly />
                  </div>
                </div>
              ) : (
                <div className="profile-modal-error">Could not load profile.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 PHD Modal (Centered) */}
      {isPhdPopupOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsPhdPopupOpen(false)}>
          <div className="profile-modal phd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Personal Health Data (PHD)</h3>
              <button className="modal-close-btn" onClick={() => setIsPhdPopupOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="profile-modal-body phd-modal-body">
              {profileLoading || masterDataLoading ? (
                <div className="profile-modal-loading">Loading data...</div>
              ) : (
                <div className="phd-form">
                  <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="phd-form-label">Weight (kg) <span style={{ color: "#e11d48" }}>*</span></label>
                      <input type="number" name="weight" className="allergy-text-input" placeholder="e.g. 65" value={phdFormData.weight} onChange={handlePhdChange} min="2" max="300" required 
                        style={isWeightOutOfBounds ? { borderColor: "#e11d48", backgroundColor: "#fff1f2", color: "#e11d48" } : {}}
                      />
                      {isWeightOutOfBounds && <span style={{ color: "#e11d48", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>Valid range: 2 - 300 kg</span>}
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="phd-form-label">Height (cm) <span style={{ color: "#e11d48" }}>*</span></label>
                      <input type="number" name="height" className="allergy-text-input" placeholder="e.g. 170" value={phdFormData.height} onChange={handlePhdChange} min="30" max="300" required 
                        style={isHeightOutOfBounds ? { borderColor: "#e11d48", backgroundColor: "#fff1f2", color: "#e11d48" } : {}}
                      />
                      {isHeightOutOfBounds && <span style={{ color: "#e11d48", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>Valid range: 30 - 300 cm</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="phd-form-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      Medical Conditions
                    </label>
                    <MultiSelectDropdown
                      name="medicalConditionIds"
                      value={phdFormData.medicalConditionIds}
                      selectedValues={phdFormData.medicalConditionIds}
                      onChange={handlePhdChange}
                      options={combinedMcOptions}
                      placeholder="Select conditions (Optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="phd-form-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"></path></svg>
                      Current Medications (Drugs)
                    </label>
                    <MultiSelectDropdown
                      name="drugIds"
                      value={phdFormData.drugIds}
                      selectedValues={phdFormData.drugIds}
                      onChange={handlePhdChange}
                      options={combinedDrugOptions}
                      placeholder="Select drugs (Optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="phd-form-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
                      Allergies
                    </label>
                    <MultiSelectDropdown
                      name="allergyCategoryIds"
                      value={phdFormData.allergyCategoryIds}
                      selectedValues={phdFormData.allergyCategoryIds}
                      onChange={handlePhdChange}
                      options={combinedAllergyOptions}
                      placeholder="Select allergies (Optional)"
                    />

                    <AnimatePresence>
                      {phdFormData.allergyCategoryIds.length > 0 && (
                        <motion.div className="allergy-details-container" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                          {phdFormData.allergyCategoryIds.map(id => {
                            const category = combinedAllergyOptions.find(c => String(c.value) === String(id));
                            return (
                              <div key={id} className="allergy-detail-input">
                                <label className="allergy-detail-label">Specify {category?.label} <span className="required-asterisk">*</span></label>
                                <input type="text" className="allergy-text-input" placeholder={getAllergyPlaceholder(category?.label)} value={phdFormData.allergyDetails[id] || ""} onChange={(e) => handleAllergyDetailChange(id, e.target.value)} required />
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-modal-footer phd-modal-footer">
              <button className="phd-cancel-btn" onClick={() => setIsPhdPopupOpen(false)}>Cancel</button>
              <button className="phd-save-btn" onClick={handleSavePhd} disabled={isSavingPhd || !isPhdValid}>{isSavingPhd ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Sidebar (Gemini Style) */}
      <aside className={`appchat-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info">
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
              <span className="history-icon">
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
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    clipPath: "inset(0% 0% 0% 0% round 8px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.5,
                      delayChildren: 0.2,
                      staggerChildren: 0.05
                    }
                  },
                  closed: {
                    clipPath: "inset(90% 50% 10% 50% round 8px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3
                    }
                  }
                }}
                className="profile-menu-popup"
              >
                <motion.div
                  variants={{ open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, closed: { opacity: 0, y: 20, transition: { duration: 0.2 } } }}
                  onClick={() => { setIsProfileMenuOpen(false); toggleProfilePopup(); }} className="profile-menu-item">
                  Profile
                </motion.div>
                <motion.div
                  variants={{ open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, closed: { opacity: 0, y: 20, transition: { duration: 0.2 } } }}
                  onClick={() => { setIsProfileMenuOpen(false); openPhdPopup(); }} className="profile-menu-item">
                  Personal Health Data (PHD)
                </motion.div>
                <motion.div
                  variants={{ open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, closed: { opacity: 0, y: 20, transition: { duration: 0.2 } } }}
                  onClick={() => { setIsProfileMenuOpen(false); logout(); }} className="profile-menu-item logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Log out
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="user-profile" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
            <span className="user-name">{displayName}</span>
          </div>
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

        <div className="chat-messages">
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

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rawFilteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOptions = rawFilteredOptions.slice(0, 100);

  const toggleSelection = (val) => {
    const newValues = selectedValues.includes(String(val)) ? selectedValues.filter(v => v !== String(val)) : [...selectedValues, String(val)];
    onChange({ target: { name, value: newValues } });
  };

  const removeValue = (e, val) => {
    e.stopPropagation();
    onChange({ target: { name, value: selectedValues.filter(v => v !== String(val)) } });
  };

  return (
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className={`dropdown-header multi-select-header ${isOpen ? "open" : ""}`} onClick={() => { setIsOpen(!isOpen); setSearchTerm(""); }}>
          <div className="chips-container">
            {selectedValues.length > 0 ? (
              selectedValues.map(val => {
                const opt = options.find(o => o.value === String(val));
                return opt ? (
                  <div key={val} className="chip">
                    {opt.label}
                    <span className="chip-remove" onClick={(e) => removeValue(e, val)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                  </div>
                ) : null;
              })
            ) : (<span className="placeholder-text">{placeholder}</span>)}
          </div>
          <motion.svg animate={{ rotate: isOpen ? 180 : 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="dropdown-chevron"><polyline points="6 9 12 15 18 9"></polyline></motion.svg>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div className="dropdown-list-container" initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              <div className="dropdown-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus />
              </div>
              <div className="dropdown-list">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedValues.includes(String(opt.value));
                    return (
                      <div key={opt.value} className={`dropdown-item ${isSelected ? "selected" : ""}`} onClick={() => toggleSelection(opt.value)}>
                        {opt.label}
                        {isSelected && (<motion.svg className="dropdown-check" initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2187AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></motion.svg>)}
                      </div>
                    );
                  })
                ) : (<div className="dropdown-no-results">No results found</div>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

const getAllergyPlaceholder = (categoryName) => {
  if (!categoryName) return "e.g. Please specify details...";
  const name = categoryName.toLowerCase();
  if (name.includes("food")) return "e.g. Peanuts, Shellfish, Dairy...";
  if (name.includes("respiratory") || name.includes("environmental")) return "e.g. Pollen, Dust mites, Pet dander...";
  if (name.includes("skin") || name.includes("contact")) return "e.g. Latex, Nickel, Poison ivy...";
  if (name.includes("drug")) return "e.g. Penicillin, Aspirin, Ibuprofen...";
  if (name.includes("insect") || name.includes("venom")) return "e.g. Bee stings, Wasp venom...";
  return "e.g. Please specify details...";
};

const Message = memo(function Message({ role, content, displayName }) {
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
});
