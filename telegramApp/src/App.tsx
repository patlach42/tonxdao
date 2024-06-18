import "./App.css";
import { ClickerApp, ClickerTestApp } from "./Clicker.tsx";
import { useWebApp } from "./TelegramAppProvider.tsx";
import { useEffect, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout.tsx";
import { LoginService } from "./client";
import { state } from "./state.tsx";
import { observer } from "mobx-react-lite";
import { Profile } from "./Profile.tsx";
import { Referrals } from "./Referrals.tsx";
import { Boosts } from "./Boosts.tsx";
import { Stats } from "./Stats.tsx";
import { Tasks } from "./Tasks.tsx";

const App = observer(() => {
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
  const testRouter = createBrowserRouter([
    {
      path: "/",
      element: <ClickerTestApp />,
    },
  ]);
  // return <RouterProvider router={testRouter} />;
  return state.profile ? <RouterProvider router={router} /> : null;
  // <RouterProvider router={testRouter} />
});
export default App;
