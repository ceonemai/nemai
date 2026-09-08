import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import "./index.css";
import "./styles/global.css";
import App from "./App.jsx";
import logo from "../src/assets/images/LogogramFullColor.png";

// เก็บ referral code จาก ?code= ไว้ตั้งแต่ครั้งแรกที่เข้าเว็บ ก่อน login/redirect ใดๆ
const referralCodeFromUrl = new URLSearchParams(window.location.search).get("code");
if (referralCodeFromUrl) {
  localStorage.setItem("nemai_referral_code", referralCodeFromUrl);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethodsAndOrder: { primary: ["google", "email"] },
        appearance: {
          theme: "light",
          accentColor: "#5ce1e6",
          logo: logo,
          showWalletLoginFirst: false
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);