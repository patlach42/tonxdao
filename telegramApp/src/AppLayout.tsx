import "./App.css";
import { NavLink, Outlet } from "react-router-dom";

import { useWebApp } from "./TelegramAppProvider.tsx";
import { useEffect } from "react";

export function AppLayout() {
  const twa = useWebApp();
  const colorScheme = twa?.colorScheme;
  useEffect(() => {
    twa?.setHeaderColor("#111111");
  }, [twa, colorScheme]);
  return (
    <>
      <div className="flex flex-col h-screen">
        <main
          className="flex-1 relative"
          style={{ backgroundColor: "#111111" }}
        >
          <Outlet />
        </main>
        <nav
          // className={`flex flex-row justify-around ${colorScheme === "dark" ? "bg-black text-white" : "bg-white text-black"} pb-2 pt-4 pl-2 pr-2`}
          className={`flex flex-row justify-around items-stretch p-1 absolute bottom-4 left-4 right-4 z-40 border rounded-xl poppins-semi-bold`}
          style={{
            backgroundColor: "#141414",
            borderColor: "#1B1B1B",
            color: "#818181",
          }}
        >
          {/*<NavLink*/}
          {/*  to="/tasks"*/}
          {/*  className="flex flex-col items-center justify-center gap-2"*/}
          {/*>*/}
          {/*  <BsListTask />*/}
          {/*  <span className={"text-sm"}>Tasks</span>*/}
          {/*</NavLink>*/}
          <NavLink
            to="/referrals"
            className={({ isActive }) =>
              [
                "flex flex-row flex-1 items-center justify-center gap-2 rounded-lg p-1",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <span className={"text-xs"}>Referral</span>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M8.125 2.97363V5.47363C8.125 5.63939 8.05915 5.79836 7.94194 5.91557C7.82473 6.03278 7.66576 6.09863 7.5 6.09863H5C4.83424 6.09863 4.67527 6.03278 4.55806 5.91557C4.44085 5.79836 4.375 5.63939 4.375 5.47363V2.97363C4.375 2.80787 4.44085 2.6489 4.55806 2.53169C4.67527 2.41448 4.83424 2.34863 5 2.34863H7.5C7.66576 2.34863 7.82473 2.41448 7.94194 2.53169C8.05915 2.6489 8.125 2.80787 8.125 2.97363ZM16.25 7.97363H13.75C13.5842 7.97363 13.4253 8.03948 13.3081 8.15669C13.1908 8.2739 13.125 8.43287 13.125 8.59863V11.0986C13.125 11.2644 13.1908 11.4234 13.3081 11.5406C13.4253 11.6578 13.5842 11.7236 13.75 11.7236H16.25C16.4158 11.7236 16.5747 11.6578 16.6919 11.5406C16.8092 11.4234 16.875 11.2644 16.875 11.0986V8.59863C16.875 8.43287 16.8092 8.2739 16.6919 8.15669C16.5747 8.03948 16.4158 7.97363 16.25 7.97363ZM16.25 14.8486H13.75C13.5842 14.8486 13.4253 14.9145 13.3081 15.0317C13.1908 15.1489 13.125 15.3079 13.125 15.4736V17.9736C13.125 18.1394 13.1908 18.2984 13.3081 18.4156C13.4253 18.5328 13.5842 18.5986 13.75 18.5986H16.25C16.4158 18.5986 16.5747 18.5328 16.6919 18.4156C16.8092 18.2984 16.875 18.1394 16.875 17.9736V15.4736C16.875 15.3079 16.8092 15.1489 16.6919 15.0317C16.5747 14.9145 16.4158 14.8486 16.25 14.8486Z"
                fill="#818181"
              />
              <path
                d="M13.75 12.3486H16.25C16.5815 12.3486 16.8995 12.2169 17.1339 11.9825C17.3683 11.7481 17.5 11.4302 17.5 11.0986V8.59863C17.5 8.26711 17.3683 7.94917 17.1339 7.71475C16.8995 7.48033 16.5815 7.34863 16.25 7.34863H13.75C13.4185 7.34863 13.1005 7.48033 12.8661 7.71475C12.6317 7.94917 12.5 8.26711 12.5 8.59863V9.22363H6.875V6.72363H7.5C7.83152 6.72363 8.14946 6.59194 8.38388 6.35752C8.6183 6.1231 8.75 5.80515 8.75 5.47363V2.97363C8.75 2.64211 8.6183 2.32417 8.38388 2.08975C8.14946 1.85533 7.83152 1.72363 7.5 1.72363H5C4.66848 1.72363 4.35054 1.85533 4.11612 2.08975C3.8817 2.32417 3.75 2.64211 3.75 2.97363V5.47363C3.75 5.80515 3.8817 6.1231 4.11612 6.35752C4.35054 6.59194 4.66848 6.72363 5 6.72363H5.625V15.4736C5.625 15.9709 5.82254 16.4478 6.17417 16.7995C6.52581 17.1511 7.00272 17.3486 7.5 17.3486H12.5V17.9736C12.5 18.3052 12.6317 18.6231 12.8661 18.8575C13.1005 19.0919 13.4185 19.2236 13.75 19.2236H16.25C16.5815 19.2236 16.8995 19.0919 17.1339 18.8575C17.3683 18.6231 17.5 18.3052 17.5 17.9736V15.4736C17.5 15.1421 17.3683 14.8242 17.1339 14.5897C16.8995 14.3553 16.5815 14.2236 16.25 14.2236H13.75C13.4185 14.2236 13.1005 14.3553 12.8661 14.5897C12.6317 14.8242 12.5 15.1421 12.5 15.4736V16.0986H7.5C7.33424 16.0986 7.17527 16.0328 7.05806 15.9156C6.94085 15.7984 6.875 15.6394 6.875 15.4736V10.4736H12.5V11.0986C12.5 11.4302 12.6317 11.7481 12.8661 11.9825C13.1005 12.2169 13.4185 12.3486 13.75 12.3486ZM5 2.97363H7.5V5.47363H5V2.97363ZM13.75 15.4736H16.25V17.9736H13.75V15.4736ZM13.75 8.59863H16.25V11.0986H13.75V8.59863Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "flex flex-row flex-1 items-center justify-center gap-2 rounded-lg p-1",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <span className={"text-xs"}>Vibrate</span>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M13.75 4.84863V16.0986C13.75 16.4302 13.6183 16.7481 13.3839 16.9825C13.1495 17.2169 12.8315 17.3486 12.5 17.3486H7.5C7.16848 17.3486 6.85054 17.2169 6.61612 16.9825C6.3817 16.7481 6.25 16.4302 6.25 16.0986V4.84863C6.25 4.51711 6.3817 4.19917 6.61612 3.96475C6.85054 3.73033 7.16848 3.59863 7.5 3.59863H12.5C12.8315 3.59863 13.1495 3.73033 13.3839 3.96475C13.6183 4.19917 13.75 4.51711 13.75 4.84863Z"
                fill="white"
              />
              <path
                d="M12.5 2.97363H7.5C7.00272 2.97363 6.52581 3.17118 6.17417 3.52281C5.82254 3.87444 5.625 4.35135 5.625 4.84863V16.0986C5.625 16.5959 5.82254 17.0728 6.17417 17.4245C6.52581 17.7761 7.00272 17.9736 7.5 17.9736H12.5C12.9973 17.9736 13.4742 17.7761 13.8258 17.4245C14.1775 17.0728 14.375 16.5959 14.375 16.0986V4.84863C14.375 4.35135 14.1775 3.87444 13.8258 3.52281C13.4742 3.17118 12.9973 2.97363 12.5 2.97363ZM13.125 16.0986C13.125 16.2644 13.0592 16.4234 12.9419 16.5406C12.8247 16.6578 12.6658 16.7236 12.5 16.7236H7.5C7.33424 16.7236 7.17527 16.6578 7.05806 16.5406C6.94085 16.4234 6.875 16.2644 6.875 16.0986V4.84863C6.875 4.68287 6.94085 4.5239 7.05806 4.40669C7.17527 4.28948 7.33424 4.22363 7.5 4.22363H12.5C12.6658 4.22363 12.8247 4.28948 12.9419 4.40669C13.0592 4.5239 13.125 4.68287 13.125 4.84863V16.0986ZM16.875 7.34863V13.5986C16.875 13.7644 16.8092 13.9234 16.6919 14.0406C16.5747 14.1578 16.4158 14.2236 16.25 14.2236C16.0842 14.2236 15.9253 14.1578 15.8081 14.0406C15.6908 13.9234 15.625 13.7644 15.625 13.5986V7.34863C15.625 7.18287 15.6908 7.0239 15.8081 6.90669C15.9253 6.78948 16.0842 6.72363 16.25 6.72363C16.4158 6.72363 16.5747 6.78948 16.6919 6.90669C16.8092 7.0239 16.875 7.18287 16.875 7.34863ZM19.375 8.59863V12.3486C19.375 12.5144 19.3092 12.6734 19.1919 12.7906C19.0747 12.9078 18.9158 12.9736 18.75 12.9736C18.5842 12.9736 18.4253 12.9078 18.3081 12.7906C18.1908 12.6734 18.125 12.5144 18.125 12.3486V8.59863C18.125 8.43287 18.1908 8.2739 18.3081 8.15669C18.4253 8.03948 18.5842 7.97363 18.75 7.97363C18.9158 7.97363 19.0747 8.03948 19.1919 8.15669C19.3092 8.2739 19.375 8.43287 19.375 8.59863ZM4.375 7.34863V13.5986C4.375 13.7644 4.30915 13.9234 4.19194 14.0406C4.07473 14.1578 3.91576 14.2236 3.75 14.2236C3.58424 14.2236 3.42527 14.1578 3.30806 14.0406C3.19085 13.9234 3.125 13.7644 3.125 13.5986V7.34863C3.125 7.18287 3.19085 7.0239 3.30806 6.90669C3.42527 6.78948 3.58424 6.72363 3.75 6.72363C3.91576 6.72363 4.07473 6.78948 4.19194 6.90669C4.30915 7.0239 4.375 7.18287 4.375 7.34863ZM1.875 8.59863V12.3486C1.875 12.5144 1.80915 12.6734 1.69194 12.7906C1.57473 12.9078 1.41576 12.9736 1.25 12.9736C1.08424 12.9736 0.925268 12.9078 0.808058 12.7906C0.690848 12.6734 0.625 12.5144 0.625 12.3486V8.59863C0.625 8.43287 0.690848 8.2739 0.808058 8.15669C0.925268 8.03948 1.08424 7.97363 1.25 7.97363C1.41576 7.97363 1.57473 8.03948 1.69194 8.15669C1.80915 8.2739 1.875 8.43287 1.875 8.59863Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/boosts"
            className={({ isActive }) =>
              [
                "flex flex-row flex-1 items-center justify-center gap-2 rounded-lg p-1",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <span className={"text-xs"}>Boosts</span>
          </NavLink>
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
