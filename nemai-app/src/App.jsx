import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useRef } from "react";
import Login from "./components/Login/Login";
import AppChat from "./components/Appchat/AppChat";
import SetupProfile from "./components/SetupProfile/SetupProfile";
import logo from "./assets/images/LogogramFullColor.png";

function MainRoute() {
  const { authenticated, ready, getAccessToken, user } = usePrivy();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const hasSynced = useRef(false);

  // Reset ค่า hasSynced เมื่อผู้ใช้ Log out เพื่อให้สามารถ Sync ใหม่ได้เมื่อ Log in ครั้งถัดไป
  useEffect(() => {
    if (ready && !authenticated) {
      hasSynced.current = false;
    }
  }, [ready, authenticated]);

  useEffect(() => {
    const syncUser = async () => {
      // เพิ่มการเช็ค user เพื่อให้แน่ใจว่า Privy โหลดข้อมูลเสร็จสมบูรณ์แล้ว 100%
      if (ready && authenticated && user && !hasSynced.current) {
        hasSynced.current = true; // มาร์คไว้ว่ากำลัง/ได้ซิงค์แล้ว เพื่อป้องกันการยิงซ้ำ
        setIsSyncing(true);
        try {
          const token = await getAccessToken();
          const response = await fetch("https://customer-api.nemai.io/api/v1/auth/sync", {
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
          } else {
            console.error("Sync API failed with status:", response.status);
            hasSynced.current = false; // รีเซ็ตสถานะเผื่อให้ยิงใหม่ถ้ายิงไม่สำเร็จ
          }
        } catch (error) {
          console.error("Error syncing user:", error);
          hasSynced.current = false; // รีเซ็ตสถานะเผื่อให้ยิงใหม่ถ้ายิงไม่สำเร็จ
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncUser();
  }, [ready, authenticated, user, getAccessToken, navigate]);

  // รอ auth โหลดก่อน หรือกำลังรอการ sync ข้อมูล
  if (!ready || isSyncing) {
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
  return authenticated ? <AppChat /> : <Login />;
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