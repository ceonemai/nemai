import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Login from "./components/Login/Login";
import AppChat from "./components/Appchat/AppChat";

function MainRoute() {
  const { authenticated, ready } = usePrivy();

  // รอ auth โหลดก่อน
  if (!ready) return null;

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

          {/* Fallback (ป้องกันแอปพังหากหลุดไป Path อื่น) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}