import React from "react";

export const loadMain = async () => {
  const { OpenAPI } = await import("./client");
  OpenAPI.BASE = import.meta.env.VITE_API_URL;
  OpenAPI.TOKEN = async () => {
    return localStorage.getItem("access_token") || "";
  };
  const getImports = async () => {
    const [CentrifugoProvider, App] = await Promise.all([
      import("./Centrifugo.tsx").then(
        ({ CentrifugoProvider }) => CentrifugoProvider,
      ),
      import("./App.tsx").then(({ App }) => App),
    ]);
    return { CentrifugoProvider, App };
  };
  const { CentrifugoProvider, App } = await getImports();
  return (
    <CentrifugoProvider>
      <App />
    </CentrifugoProvider>
  );
};
