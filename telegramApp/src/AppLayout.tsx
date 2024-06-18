import "./App.css";
import { NavLink, Outlet } from "react-router-dom";
import {
  BsFillLightningChargeFill,
  BsFire,
  BsHeartFill,
  BsListTask,
  BsStars,
} from "react-icons/bs";
import { useWebApp } from "./TelegramAppProvider.tsx";
import { useEffect } from "react";

export function AppLayout() {
  const twa = useWebApp();
  const colorScheme = twa?.colorScheme;
  useEffect(() => {
    twa?.setHeaderColor(colorScheme === "dark" ? "#000000" : "#ffffff");
  }, [twa, colorScheme]);
  return (
    <>
      <div className="flex flex-col h-screen">
        <main className="flex-1 bg-gray-100 relative">
          <Outlet />
        </main>
        <nav
          className={`flex flex-row justify-around ${colorScheme === "dark" ? "bg-black text-white" : "bg-white text-black"} pb-2 pt-4 pl-2 pr-2`}
        >
          {/*<NavLink*/}
          {/*  to="/tasks"*/}
          {/*  className="flex flex-col items-center justify-center gap-2"*/}
          {/*>*/}
          {/*  <BsListTask />*/}
          {/*  <span className={"text-sm"}>Tasks</span>*/}
          {/*</NavLink>*/}
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "flex flex-col items-center justify-center gap-2",
                isActive ? "active" : "inactive",
              ].join(" ")
            }
          >
            <BsFillLightningChargeFill />
            <span className={"text-sm"}>Vibe</span>
          </NavLink>
          <NavLink
            to="/referrals"
            className="flex flex-col items-center justify-center gap-2"
          >
            <BsHeartFill />
            <span className={"text-sm"}>Ref</span>
          </NavLink>
          {/*<NavLink*/}
          {/*  to="/boosts"*/}
          {/*  className="flex flex-col items-center justify-center gap-2"*/}
          {/*>*/}
          {/*  <BsFire />*/}
          {/*  <span className={"text-sm"}>Boost</span>*/}
          {/*</NavLink>*/}
          {/*<NavLink*/}
          {/*  to="/stats"*/}
          {/*  className="flex flex-col items-center justify-center gap-2"*/}
          {/*>*/}
          {/*  <BsStars />*/}
          {/*  <span className={"text-sm"}>Stats</span>*/}
          {/*</NavLink>*/}
        </nav>
      </div>
    </>
  );
}
