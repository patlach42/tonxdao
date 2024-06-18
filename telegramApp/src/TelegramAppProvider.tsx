import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import "./index.css";
import TWAWebApp from "@twa-dev/sdk";
import { WebApp, Telegram, WebAppInitData, WebAppUser } from "@twa-dev/types";

const TelegramAppContext = createContext<{ app: WebApp | null }>({ app: null });

const TelegramAppProvider = ({ children }: PropsWithChildren) => {
  const [twa, setTwa] = useState<WebApp | null>(null);
  useEffect(() => {
    TWAWebApp.ready();
    TWAWebApp.expand();
    const _twa = (
      (window as unknown as { Telegram: Telegram })?.Telegram as Telegram
    )?.WebApp;
    if (_twa) {
      setTwa(_twa);
    }
  }, []);
  return (
    <TelegramAppContext.Provider value={{ app: twa }}>
      {children}
    </TelegramAppContext.Provider>
  );
};

const useWebApp = (): WebApp | null => {
  const context = useContext(TelegramAppContext);
  if (!context) {
    throw new Error("useWebApp must be used within a WebAppProvider");
  }
  return context?.app;
};

const useWebAppData = (): WebAppInitData | null => {
  // TODO: validate, do not use unsafe
  const webApp = useWebApp();
  if (!webApp) {
    return null;
  }
  return webApp.initDataUnsafe;
};

const useWebAppUser = (): WebAppUser | null => {
  // TODO: validate, do not use unsafe
  const webAppData = useWebAppData();
  if (!webAppData) {
    return null;
  }
  return webAppData?.user || null;
};

export { TelegramAppProvider, useWebApp, useWebAppUser };
