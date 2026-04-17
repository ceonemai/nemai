import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useRef } from "react";
import Login from "./components/Login/Login";
import AppChat from "./components/Appchat/AppChat";
import SetupProfile from "./components/SetupProfile/SetupProfile";

function MainRoute() {
  const { authenticated, ready, getAccessToken } = usePrivy();
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
      if (ready && authenticated && !hasSynced.current) {
        hasSynced.current = true; // มาร์คไว้ว่ากำลัง/ได้ซิงค์แล้ว เพื่อป้องกันการยิงซ้ำ
        setIsSyncing(true);
        try {
          const token = await getAccessToken();
          const response = await fetch("https://customer-service-iphv.onrender.com/api/v1/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.is_new) {
              navigate("/setup-profile", { replace: true });
            }
          } else {
            console.error("Sync API failed with status:", response.status);
          }
        } catch (error) {
          console.error("Error syncing user:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncUser();
  }, [ready, authenticated, getAccessToken, navigate]);

  // รอ auth โหลดก่อน หรือกำลังรอการ sync ข้อมูล
  if (!ready || isSyncing) return null;

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