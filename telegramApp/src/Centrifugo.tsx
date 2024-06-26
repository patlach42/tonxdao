import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Centrifuge } from "centrifuge";
import { LoginService, OpenAPI } from "./client";

const CentrifugoContext = createContext<Centrifuge | null>(null);

export function useCentrifugo() {
  return useContext(CentrifugoContext);
}

export function CentrifugoProvider({ children }: PropsWithChildren) {
  const centrifugoRef = useRef<Centrifuge>(
    new Centrifuge(`wss://${OpenAPI.BASE.split("://")[1]}/ws`, {
      getToken: () => LoginService.loginCentrifugoToken().then((r) => r.token),
    }),
  );
  useEffect(() => {
    (async () => {
      try {
        centrifugoRef.current.on("connected", () => {
          // centrifugoRef.current.rpc("on_connected", {});
          centrifugoRef.current.newSubscription(`game`);
        });
        await LoginService.loginCentrifugoToken().then((r) => {
          centrifugoRef.current.setToken(r.token);
          centrifugoRef.current.connect();
        });
        centrifugoRef.current.on("message", (data) => {
          alert(data);
        });
      } catch (e) {
        centrifugoRef.current.connect();
      }
    })();
  }, []);
  return (
    <CentrifugoContext.Provider value={centrifugoRef.current}>
      {children}
    </CentrifugoContext.Provider>
  );
}
