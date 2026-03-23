import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import "./index.css";
import "./styles/global.css";
import App from "./App.jsx";
import logo from "../src/assets/images/LogogramFullColor.png";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "twitter"], // twitter = X
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