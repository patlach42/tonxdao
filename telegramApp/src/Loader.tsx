import React from "react";
import { LoadingScreen } from "./LoadingScreen.tsx";
import { loadMain } from "./loadMain.tsx";

export const Loader: React.FC = () => {
  const [asyncComponent, setAsyncComponent] = React.useState<React.ReactNode>();
  React.useEffect(() => {
    loadMain().then(setAsyncComponent);
  }, []);
  if (asyncComponent) {
    return asyncComponent;
  }
  return <LoadingScreen />;
};
