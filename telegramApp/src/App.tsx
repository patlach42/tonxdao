import "./App.css";
import "./index.css";
import { ClickerApp } from "./Clicker.tsx";
import { useWebApp } from "./TelegramAppProvider.tsx";
import React, { useEffect, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout.tsx";
import { ShaderTest } from "./ShaderTest.tsx";
import { LoginService } from "./client";
import { state } from "./state.tsx";
import { observer } from "mobx-react-lite";
import { Profile } from "./Profile.tsx";
import { Referrals } from "./Referrals.tsx";
import { Boosts } from "./Boosts.tsx";
import { Stats } from "./Stats.tsx";
import { Tasks } from "./Tasks.tsx";
import { LoadingScreen } from "./LoadingScreen.tsx";

export const App = observer(() => {
  const twa = useWebApp();
  const accessToken = useRef(localStorage.getItem("access_token"));
  useEffect(() => {
    if (!twa) {
      return;
    }
    LoginService.loginLoginTelegramWebApp({
      requestBody: {
        initData: twa?.initData,
      },
    }).then((response) => {
      response.access_token &&
        localStorage.setItem("access_token", response.access_token);
      accessToken.current = response.access_token;

      LoginService.loginProfile().then((response) => {
        state.setProfile(response);
      });
    });
    // alert(JSON.stringify(twa?.initData));
  }, [twa]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <ClickerApp />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/referrals",
          element: <Referrals />,
        },
        {
          path: "/boosts",
          element: <Boosts />,
        },
        {
          path: "/stats",
          element: <Stats />,
        },
        {
          path: "/tasks",
          element: <Tasks />,
        },
      ],
    },
  ]);
  const noTelegramRouter = createBrowserRouter([
    {
      path: "/shaderTest/",
      element: <ShaderTest />,
      children: [],
    },
  ]);
  return state.profile ? (
    <RouterProvider router={router} />
  ) : !twa?.initData ? (
    <RouterProvider router={noTelegramRouter} />
  ) : null;
  // <RouterProvider router={testRouter} />
});
