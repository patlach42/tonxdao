import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Centrifuge } from "centrifuge";
import { LoginService } from "./client";

const CentrifugoContext = createContext<Centrifuge | null>(null);

export function useCentrifugo() {
  return useContext(CentrifugoContext);
}

export function CentrifugoProvider({ children }: PropsWithChildren) {
  const centrifugoRef = useRef<Centrifuge>(
    new Centrifuge("wss://white.tailc4a5e.ts.net/ws", {
      getToken: () => LoginService.loginCentrifugoToken().then((r) => r.token),
    }),
  );
  useEffect(() => {
    centrifugoRef.current.connect();
  }, []);
  return (
    <CentrifugoContext.Provider value={centrifugoRef.current}>
      {children}
    </CentrifugoContext.Provider>
  );
}
