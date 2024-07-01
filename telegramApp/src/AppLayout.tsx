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
          className={`flex flex-row justify-around items-stretch p-1 h-16 absolute bottom-6 left-6 right-6 z-40 border rounded-xl poppins-semi-bold`}
          style={{
            backgroundColor: "#141414",
            borderColor: "#2D2D2D",
            color: "#818181",
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "flex flex-col flex-1 items-center justify-end pb-1.5 pt-1.5 rounded-lg",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M22.75 7.5V25.5C22.75 26.0304 22.5393 26.5391 22.1642 26.9142C21.7891 27.2893 21.2804 27.5 20.75 27.5H12.75C12.2196 27.5 11.7109 27.2893 11.3358 26.9142C10.9607 26.5391 10.75 26.0304 10.75 25.5V7.5C10.75 6.96957 10.9607 6.46086 11.3358 6.08579C11.7109 5.71071 12.2196 5.5 12.75 5.5H20.75C21.2804 5.5 21.7891 5.71071 22.1642 6.08579C22.5393 6.46086 22.75 6.96957 22.75 7.5Z"
                fill="currentColor"
              />
              <path
                d="M20.75 4.5H12.75C11.9544 4.5 11.1913 4.81607 10.6287 5.37868C10.0661 5.94129 9.75 6.70435 9.75 7.5V25.5C9.75 26.2956 10.0661 27.0587 10.6287 27.6213C11.1913 28.1839 11.9544 28.5 12.75 28.5H20.75C21.5456 28.5 22.3087 28.1839 22.8713 27.6213C23.4339 27.0587 23.75 26.2956 23.75 25.5V7.5C23.75 6.70435 23.4339 5.94129 22.8713 5.37868C22.3087 4.81607 21.5456 4.5 20.75 4.5ZM21.75 25.5C21.75 25.7652 21.6446 26.0196 21.4571 26.2071C21.2696 26.3946 21.0152 26.5 20.75 26.5H12.75C12.4848 26.5 12.2304 26.3946 12.0429 26.2071C11.8554 26.0196 11.75 25.7652 11.75 25.5V7.5C11.75 7.23478 11.8554 6.98043 12.0429 6.79289C12.2304 6.60536 12.4848 6.5 12.75 6.5H20.75C21.0152 6.5 21.2696 6.60536 21.4571 6.79289C21.6446 6.98043 21.75 7.23478 21.75 7.5V25.5ZM27.75 11.5V21.5C27.75 21.7652 27.6446 22.0196 27.4571 22.2071C27.2696 22.3946 27.0152 22.5 26.75 22.5C26.4848 22.5 26.2304 22.3946 26.0429 22.2071C25.8554 22.0196 25.75 21.7652 25.75 21.5V11.5C25.75 11.2348 25.8554 10.9804 26.0429 10.7929C26.2304 10.6054 26.4848 10.5 26.75 10.5C27.0152 10.5 27.2696 10.6054 27.4571 10.7929C27.6446 10.9804 27.75 11.2348 27.75 11.5ZM31.75 13.5V19.5C31.75 19.7652 31.6446 20.0196 31.4571 20.2071C31.2696 20.3946 31.0152 20.5 30.75 20.5C30.4848 20.5 30.2304 20.3946 30.0429 20.2071C29.8554 20.0196 29.75 19.7652 29.75 19.5V13.5C29.75 13.2348 29.8554 12.9804 30.0429 12.7929C30.2304 12.6054 30.4848 12.5 30.75 12.5C31.0152 12.5 31.2696 12.6054 31.4571 12.7929C31.6446 12.9804 31.75 13.2348 31.75 13.5ZM7.75 11.5V21.5C7.75 21.7652 7.64464 22.0196 7.45711 22.2071C7.26957 22.3946 7.01522 22.5 6.75 22.5C6.48478 22.5 6.23043 22.3946 6.04289 22.2071C5.85536 22.0196 5.75 21.7652 5.75 21.5V11.5C5.75 11.2348 5.85536 10.9804 6.04289 10.7929C6.23043 10.6054 6.48478 10.5 6.75 10.5C7.01522 10.5 7.26957 10.6054 7.45711 10.7929C7.64464 10.9804 7.75 11.2348 7.75 11.5ZM3.75 13.5V19.5C3.75 19.7652 3.64464 20.0196 3.45711 20.2071C3.26957 20.3946 3.01522 20.5 2.75 20.5C2.48478 20.5 2.23043 20.3946 2.04289 20.2071C1.85536 20.0196 1.75 19.7652 1.75 19.5V13.5C1.75 13.2348 1.85536 12.9804 2.04289 12.7929C2.23043 12.6054 2.48478 12.5 2.75 12.5C3.01522 12.5 3.26957 12.6054 3.45711 12.7929C3.64464 12.9804 3.75 13.2348 3.75 13.5Z"
                fill="currentColor"
              />
            </svg>

            <span
              className="mt-0.5"
              style={{ fontSize: "0.625rem", lineHeight: "0.625rem" }}
            >
              Vibrate
            </span>
          </NavLink>
          <NavLink
            to="/referrals"
            className={({ isActive }) =>
              [
                "flex flex-col flex-1 items-center justify-end pb-1.5 pt-1.5 rounded-lg",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M13.25 4.5V8.5C13.25 8.76522 13.1446 9.01957 12.9571 9.20711C12.7696 9.39464 12.5152 9.5 12.25 9.5H8.25C7.98478 9.5 7.73043 9.39464 7.54289 9.20711C7.35536 9.01957 7.25 8.76522 7.25 8.5V4.5C7.25 4.23478 7.35536 3.98043 7.54289 3.79289C7.73043 3.60536 7.98478 3.5 8.25 3.5H12.25C12.5152 3.5 12.7696 3.60536 12.9571 3.79289C13.1446 3.98043 13.25 4.23478 13.25 4.5ZM26.25 12.5H22.25C21.9848 12.5 21.7304 12.6054 21.5429 12.7929C21.3554 12.9804 21.25 13.2348 21.25 13.5V17.5C21.25 17.7652 21.3554 18.0196 21.5429 18.2071C21.7304 18.3946 21.9848 18.5 22.25 18.5H26.25C26.5152 18.5 26.7696 18.3946 26.9571 18.2071C27.1446 18.0196 27.25 17.7652 27.25 17.5V13.5C27.25 13.2348 27.1446 12.9804 26.9571 12.7929C26.7696 12.6054 26.5152 12.5 26.25 12.5ZM26.25 23.5H22.25C21.9848 23.5 21.7304 23.6054 21.5429 23.7929C21.3554 23.9804 21.25 24.2348 21.25 24.5V28.5C21.25 28.7652 21.3554 29.0196 21.5429 29.2071C21.7304 29.3946 21.9848 29.5 22.25 29.5H26.25C26.5152 29.5 26.7696 29.3946 26.9571 29.2071C27.1446 29.0196 27.25 28.7652 27.25 28.5V24.5C27.25 24.2348 27.1446 23.9804 26.9571 23.7929C26.7696 23.6054 26.5152 23.5 26.25 23.5Z"
                fill="currentColor"
              />
              <path
                d="M22.25 19.5H26.25C26.7804 19.5 27.2891 19.2893 27.6642 18.9142C28.0393 18.5391 28.25 18.0304 28.25 17.5V13.5C28.25 12.9696 28.0393 12.4609 27.6642 12.0858C27.2891 11.7107 26.7804 11.5 26.25 11.5H22.25C21.7196 11.5 21.2109 11.7107 20.8358 12.0858C20.4607 12.4609 20.25 12.9696 20.25 13.5V14.5H11.25V10.5H12.25C12.7804 10.5 13.2891 10.2893 13.6642 9.91421C14.0393 9.53914 14.25 9.03043 14.25 8.5V4.5C14.25 3.96957 14.0393 3.46086 13.6642 3.08579C13.2891 2.71071 12.7804 2.5 12.25 2.5H8.25C7.71957 2.5 7.21086 2.71071 6.83579 3.08579C6.46071 3.46086 6.25 3.96957 6.25 4.5V8.5C6.25 9.03043 6.46071 9.53914 6.83579 9.91421C7.21086 10.2893 7.71957 10.5 8.25 10.5H9.25V24.5C9.25 25.2956 9.56607 26.0587 10.1287 26.6213C10.6913 27.1839 11.4544 27.5 12.25 27.5H20.25V28.5C20.25 29.0304 20.4607 29.5391 20.8358 29.9142C21.2109 30.2893 21.7196 30.5 22.25 30.5H26.25C26.7804 30.5 27.2891 30.2893 27.6642 29.9142C28.0393 29.5391 28.25 29.0304 28.25 28.5V24.5C28.25 23.9696 28.0393 23.4609 27.6642 23.0858C27.2891 22.7107 26.7804 22.5 26.25 22.5H22.25C21.7196 22.5 21.2109 22.7107 20.8358 23.0858C20.4607 23.4609 20.25 23.9696 20.25 24.5V25.5H12.25C11.9848 25.5 11.7304 25.3946 11.5429 25.2071C11.3554 25.0196 11.25 24.7652 11.25 24.5V16.5H20.25V17.5C20.25 18.0304 20.4607 18.5391 20.8358 18.9142C21.2109 19.2893 21.7196 19.5 22.25 19.5ZM8.25 4.5H12.25V8.5H8.25V4.5ZM22.25 24.5H26.25V28.5H22.25V24.5ZM22.25 13.5H26.25V17.5H22.25V13.5Z"
                fill="currentColor"
              />
            </svg>

            <span
              className="mt-1"
              style={{ fontSize: "0.625rem", lineHeight: "0.625rem" }}
            >
              Invite
            </span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              [
                "flex flex-col flex-1 items-center justify-end pb-1.5 pt-1.5 rounded-lg",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M26.45 20.4263L27.4587 24.5L23.75 22.3175L20.0413 24.5L21.05 20.4263L17.75 17.7013L22.0812 17.3675L23.75 13.5L25.4188 17.3675L29.75 17.7013L26.45 20.4263Z"
                fill="#818181"
              />
              <path
                d="M4.75 8.5C4.75 8.23478 4.85536 7.98043 5.04289 7.79289C5.23043 7.60536 5.48478 7.5 5.75 7.5H27.75C28.0152 7.5 28.2696 7.60536 28.4571 7.79289C28.6446 7.98043 28.75 8.23478 28.75 8.5C28.75 8.76522 28.6446 9.01957 28.4571 9.20711C28.2696 9.39464 28.0152 9.5 27.75 9.5H5.75C5.48478 9.5 5.23043 9.39464 5.04289 9.20711C4.85536 9.01957 4.75 8.76522 4.75 8.5ZM5.75 17.5H12.75C13.0152 17.5 13.2696 17.3946 13.4571 17.2071C13.6446 17.0196 13.75 16.7652 13.75 16.5C13.75 16.2348 13.6446 15.9804 13.4571 15.7929C13.2696 15.6054 13.0152 15.5 12.75 15.5H5.75C5.48478 15.5 5.23043 15.6054 5.04289 15.7929C4.85536 15.9804 4.75 16.2348 4.75 16.5C4.75 16.7652 4.85536 17.0196 5.04289 17.2071C5.23043 17.3946 5.48478 17.5 5.75 17.5ZM14.75 23.5H5.75C5.48478 23.5 5.23043 23.6054 5.04289 23.7929C4.85536 23.9804 4.75 24.2348 4.75 24.5C4.75 24.7652 4.85536 25.0196 5.04289 25.2071C5.23043 25.3946 5.48478 25.5 5.75 25.5H14.75C15.0152 25.5 15.2696 25.3946 15.4571 25.2071C15.6446 25.0196 15.75 24.7652 15.75 24.5C15.75 24.2348 15.6446 23.9804 15.4571 23.7929C15.2696 23.6054 15.0152 23.5 14.75 23.5ZM30.3862 18.4725L27.5713 20.7962L28.4287 24.26C28.4758 24.451 28.4654 24.6516 28.399 24.8367C28.3326 25.0218 28.213 25.1832 28.0553 25.3008C27.8976 25.4183 27.7088 25.4867 27.5124 25.4975C27.316 25.5083 27.1208 25.4609 26.9513 25.3612L23.75 23.4775L20.5487 25.3612C20.3792 25.4609 20.184 25.5083 19.9876 25.4975C19.7912 25.4867 19.6024 25.4183 19.4447 25.3008C19.287 25.1832 19.1674 25.0218 19.101 24.8367C19.0346 24.6516 19.0242 24.451 19.0713 24.26L19.9275 20.7962L17.1138 18.4725C16.9603 18.3456 16.8483 18.1758 16.7919 17.9848C16.7356 17.7938 16.7376 17.5903 16.7976 17.4005C16.8576 17.2106 16.9729 17.043 17.1288 16.9191C17.2847 16.7952 17.474 16.7206 17.6725 16.705L21.4025 16.4163L22.8312 13.1038C22.9085 12.9241 23.0366 12.771 23.1999 12.6635C23.3632 12.5559 23.5545 12.4986 23.75 12.4986C23.9455 12.4986 24.1368 12.5559 24.3001 12.6635C24.4634 12.771 24.5915 12.9241 24.6688 13.1038L26.0975 16.4163L29.8275 16.705C30.026 16.7206 30.2153 16.7952 30.3712 16.9191C30.5271 17.043 30.6424 17.2106 30.7024 17.4005C30.7624 17.5903 30.7644 17.7938 30.7081 17.9848C30.6518 18.1758 30.5397 18.3456 30.3862 18.4725ZM27.2025 18.5075L25.3412 18.3638C25.1597 18.3498 24.9854 18.2866 24.8371 18.1808C24.6889 18.0751 24.5723 17.9309 24.5 17.7638L23.75 16.0238L23 17.7638C22.9277 17.9309 22.8111 18.0751 22.6629 18.1808C22.5146 18.2866 22.3403 18.3498 22.1588 18.3638L20.2975 18.5075L21.6863 19.655C21.8317 19.7749 21.9403 19.9334 21.9996 20.1123C22.0589 20.2912 22.0664 20.4833 22.0212 20.6663L21.5837 22.4312L23.2425 21.455C23.3963 21.3644 23.5715 21.3167 23.75 21.3167C23.9285 21.3167 24.1037 21.3644 24.2575 21.455L25.9163 22.4312L25.4788 20.6663C25.4336 20.4833 25.4411 20.2912 25.5004 20.1123C25.5597 19.9334 25.6683 19.7749 25.8137 19.655L27.2025 18.5075Z"
                fill="currentColor"
              />
            </svg>

            <span
              className="mt-1"
              style={{ fontSize: "0.625rem", lineHeight: "0.625rem" }}
            >
              Tasks
            </span>
          </NavLink>
          <NavLink
            to="/boosts"
            className={({ isActive }) =>
              [
                "flex flex-col flex-1 items-center justify-end pb-1.5 pt-1.5 rounded-lg",
                isActive ? "active-nav-tab" : "",
              ].join(" ")
            }
          >
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M12.25 30.5L14.25 20.5L6.25 17.5L20.25 2.5L18.25 12.5L26.25 15.5L12.25 30.5Z"
                fill="#818181"
              />
              <path
                d="M27.2238 15.2711C27.1859 15.1108 27.1091 14.9624 27 14.839C26.891 14.7156 26.7532 14.621 26.5988 14.5636L19.3975 11.8624L21.23 2.69612C21.2715 2.48315 21.2426 2.26246 21.1477 2.06735C21.0528 1.87224 20.8969 1.71331 20.7038 1.61453C20.5106 1.51574 20.2905 1.48248 20.0767 1.51974C19.863 1.55701 19.6672 1.66279 19.5188 1.82112L5.51879 16.8211C5.40508 16.9409 5.32283 17.0871 5.27937 17.2464C5.23591 17.4058 5.23261 17.5734 5.26975 17.7344C5.30689 17.8953 5.38332 18.0446 5.49222 18.1688C5.60111 18.293 5.73908 18.3883 5.89379 18.4461L13.0975 21.1474L11.27 30.3036C11.2285 30.5166 11.2574 30.7373 11.3524 30.9324C11.4473 31.1275 11.6031 31.2864 11.7963 31.3852C11.9895 31.484 12.2096 31.5173 12.4233 31.48C12.6371 31.4427 12.8329 31.337 12.9813 31.1786L26.9813 16.1786C27.0929 16.0588 27.1734 15.9134 27.2157 15.7551C27.258 15.5969 27.2608 15.4307 27.2238 15.2711ZM13.9213 27.2499L15.23 20.7024C15.2769 20.4702 15.2398 20.2289 15.1253 20.0215C15.0108 19.8141 14.8265 19.654 14.605 19.5699L8.00004 17.0886L18.5775 5.75612L17.27 12.3036C17.2232 12.5358 17.2603 12.7771 17.3748 12.9845C17.4892 13.1919 17.6736 13.352 17.895 13.4361L24.495 15.9111L13.9213 27.2499Z"
                fill="currentColor"
              />
            </svg>

            <span
              className="mt-1"
              style={{ fontSize: "0.625rem", lineHeight: "0.625rem" }}
            >
              Boosts
            </span>
          </NavLink>
        </nav>
      </div>
    </>
  );
}
