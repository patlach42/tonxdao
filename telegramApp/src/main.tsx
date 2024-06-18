import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TelegramAppProvider } from "./TelegramAppProvider.tsx";
import { CentrifugoProvider } from "./Centrifugo.tsx";
import { OpenAPI } from "./client";

OpenAPI.BASE = import.meta.env.VITE_API_URL;
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || "";
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TelegramAppProvider>
      <CentrifugoProvider>
        <App />
      </CentrifugoProvider>
    </TelegramAppProvider>
  </React.StrictMode>,
);
