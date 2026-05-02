import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useRef } from "react";
import Login from "./components/Login/Login";
import AppChat from "./components/Appchat/AppChat";
import SetupProfile from "./components/SetupProfile/SetupProfile";
import logo from "./assets/images/LogogramFullColor.png";

const apiUrl = import.meta.env.VITE_CHAT_AI_SERVICE_URL ?? "https://customer-api.nemai.io";

// Add CSS for the error popup (assuming App.css is the correct place)
// You might need to add these styles to your App.css file manually.

function MainRoute() {
  const { authenticated, ready, getAccessToken, user, logout } = usePrivy();
  const navigate = useNavigate();
  const hasSynced = useRef(false);

  // Reset ค่า hasSynced เมื่อผู้ใช้ Log out เพื่อให้สามารถ Sync ใหม่ได้เมื่อ Log in ครั้งถัดไป
  useEffect(() => {
    if (ready && !authenticated) {
      hasSynced.current = false;
    }
  }, [ready, authenticated]);

  // New state for the error popup
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [isErrorPopupClosing, setIsErrorPopupClosing] = useState(false);
  const [isErrorPopupDismissing, setIsErrorPopupDismissing] = useState(false);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const syncUser = async () => {
      // เพิ่มการเช็ค user เพื่อให้แน่ใจว่า Privy โหลดข้อมูลเสร็จสมบูรณ์แล้ว 100%
      if (ready && authenticated && user && !hasSynced.current && !showErrorPopup) { // Prevent sync if popup is already shown
        hasSynced.current = true; // มาร์คไว้ว่ากำลัง/ได้ซิงค์แล้ว เพื่อป้องกันการยิงซ้ำ
        try {
          const token = await getAccessToken();
          const response = await fetch(`https://customer-api.nemai.io/api/v1/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({}) // 🔹 ใส่ body ว่างไปเพื่อป้องกัน API Server/Browser ตีตก Request
          });

          if (response.ok) {
            const data = await response.json();
            if (data.is_new) {
              navigate("/setup-profile", { replace: true });
            }
          } else if (response.status === 403) {
            // 🔹 เช็คจาก Status Code 403 (Forbidden) โดยตรง
            setErrorPopupMessage("You are not eligible to participate in Alpha Testing Session 1.\n\nStay tuned for updates on Sessions 2 and 3.");
            setIsErrorPopupClosing(false);
            setIsErrorPopupDismissing(false);
            setShowErrorPopup(true);
            // Do not navigate or logout immediately, wait for user to close popup
          } else {
            // สำหรับ Error อื่นๆ ที่ไม่ใช่ 403
            const errorBody = await response.text(); // อ่าน response body เป็น text
            console.error("Sync API failed with status:", response.status, errorBody);
            hasSynced.current = false; // รีเซ็ตสถานะเผื่อให้ยิงใหม่ถ้ายิงไม่สำเร็จ
          }
        } catch (error) {
          console.error("Error syncing user:", error);
          hasSynced.current = false; // รีเซ็ตสถานะเผื่อให้ยิงใหม่ถ้ายิงไม่สำเร็จ
        }
      }
    };

    syncUser();
  }, [ready, authenticated, user, getAccessToken, navigate, logout, showErrorPopup]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleCloseErrorPopup = () => {
    // Smooth close animation first, then logout+redirect
    if (isErrorPopupClosing || isErrorPopupDismissing) return;

    setIsErrorPopupClosing(true);
    setIsErrorPopupDismissing(true);

    closeTimeoutRef.current = window.setTimeout(async () => {
      setShowErrorPopup(false);
      try {
        await logout();
      } finally {
        window.location.replace("/");
      }
    }, 320);
  };

  // If the error popup is shown, we should not render the main content behind it.
  // The loading screen is also a full-screen overlay, so it takes precedence.
  if (showErrorPopup || isErrorPopupDismissing) {
    return (
      <div
        className="error-popup-overlay"
        style={{
          opacity: isErrorPopupClosing ? 0 : 1,
          transition: "opacity 260ms ease",
          pointerEvents: isErrorPopupClosing ? "none" : "auto",
        }}
      >
        <div
          className="error-popup-content"
          style={{
            transform: isErrorPopupClosing ? "translateY(10px) scale(0.985)" : "translateY(0) scale(1)",
            transition: "transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1)",
          }}
        >
          <div className="error-popup-badge">Access restricted</div>
          <h2>Alpha access required</h2>
          <p className="error-popup-message">{errorPopupMessage}</p>
          <button onClick={handleCloseErrorPopup} disabled={isErrorPopupClosing}>
            OK
          </button>
        </div>
      </div>
    );
  }

  // รอ auth โหลดก่อน เฉพาะตอนที่ยังไม่รู้สถานะ session จริงๆ
  if (!ready && !authenticated && !showErrorPopup && !isErrorPopupDismissing) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner-ring"></div>
          <img src={logo} alt="Loading" className="loading-logo" />
        </div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // เลือกว่าจะแสดงหน้าไหนตามสถานะการ Login
  return authenticated ? <AppChat /> : <Login />; // Render Login if not authenticated
}

export default function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          {/* หน้าหลัก: จัดการ Login และ Chat ใน Path เดียวกัน */}
          <Route path="/" element={<MainRoute />} />

          {/* หน้า Setup Profile สำหรับ User ใหม่ */}
          <Route path="/setup-profile" element={<SetupProfile />} />

          {/* Fallback (ป้องกันแอปพังหากหลุดไป Path อื่น) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
