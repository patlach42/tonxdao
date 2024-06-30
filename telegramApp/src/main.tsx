import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "./Loader.tsx";
import { TelegramAppProvider } from "./TelegramAppProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TelegramAppProvider>
      <Loader />
    </TelegramAppProvider>
  </React.StrictMode>,
);
