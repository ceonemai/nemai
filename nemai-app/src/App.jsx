import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Login from "./components/Login/Login";
import AppChat from "./components/Appchat/AppChat";

function ProtectedRoute({ children }) {
  const { authenticated, ready } = usePrivy();

  // รอ auth โหลดก่อน
  if (!ready) return null;

  // ยังไม่ login → กลับหน้า Login
  if (!authenticated) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* Chatbot App (ต้อง Login ก่อน) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppChat />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}