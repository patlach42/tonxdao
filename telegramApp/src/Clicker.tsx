import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useCentrifugo } from "./Centrifugo.tsx";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { state } from "./state.tsx";
import { useWebApp } from "./TelegramAppProvider.tsx";
import { NewDaoModal } from "./modal/NewDao.tsx";
import { Renderer, useFrameTime } from "./MainRenderer.tsx";
import { useVibration } from "./useVibration.tsx";

const ClickerApp: React.FC<PropsWithChildren> = observer(() => {
  const centrifugo = useCentrifugo();
  const twa = useWebApp();
  useEffect(() => {
    state.centrifugo = centrifugo || undefined;
  }, [centrifugo]);

  const {
    particlesCount,
    energy,
    maxEnergy,
    coinsPerSecond,
    nextLevelScore,
    currentLevel,
  } = state;

  const touchRef = useRef(false);
  const touchingRef = useRef(false);

  const energyPercent = (energy / maxEnergy) * 100;
  const prevLevelScore = state?.levels?.[currentLevel - 2] || 0;
  const levelPercent =
    ((particlesCount - prevLevelScore) / (nextLevelScore - prevLevelScore)) *
    100;
  const lastCountedFrame = useRef(performance.now());
  const lastEnergyRestoredFrame = useRef(performance.now());
  const app = useWebApp();
  useEffect(() => {
    const cb = () => {
      touchRef.current = false;
    };
    twa?.onEvent("viewportChanged", cb);
    return () => {
      twa?.offEvent("viewportChanged", cb);
    };
  }, [twa]);

  const touchingDelay = state?.startedAt
    ? new Date()?.getTime() - state?.startedAt?.getTime()
    : 0;
  const isStarted = touchingDelay > state.startDelay;
  const touchingCountDown = Math.abs(
    Math.max(0, state.startDelay - touchingDelay),
  );
  let displayTouchingCountDown = Math.ceil(touchingCountDown / 1000);
  if (!touchRef.current) {
    displayTouchingCountDown = 0;
  }

  useEffect(() => {
    if (displayTouchingCountDown > 0) {
      app?.HapticFeedback?.impactOccurred("light");
    }
  }, [app?.HapticFeedback, displayTouchingCountDown]);
  const isVibrating =
    touchingRef.current && touchRef.current && state.energy > 0 && isStarted;
  const frameTime = useFrameTime();
  // alert(new Date().getTime())
  useEffect(() => {
    if (touchingRef.current && !touchRef.current) {
      touchingRef.current = false;
      state.stop();
    } else if (!touchingRef.current && touchRef.current) {
      touchingRef.current = true;
      state.start();
    } else if (touchingRef.current && touchRef.current && isStarted) {
      // pressing now
      if (frameTime - lastCountedFrame.current >= 1000 / coinsPerSecond) {
        if (state.tap()) {
          lastCountedFrame.current = frameTime;
        }
      }
    } else if (touchingRef.current && touchRef.current && !isStarted) {
      // alert();
    }

    // Energy restore
    if (lastEnergyRestoredFrame.current + 100 < frameTime) {
      lastEnergyRestoredFrame.current = frameTime;
      state.calculateEnergy();
    }
  }, [app?.HapticFeedback, centrifugo, coinsPerSecond, frameTime, isStarted]);

  const {
    vibrationCycle,
    setVibrationCycle,
    vibrationType,
    setVibrationType,
    vibrationDelay,
    setVibrationByStyle,
    vibrate,
    vibrationStyle,
    setVibrationStyle,
  } = useVibration();
  const lastVibrateFrame = useRef(performance.now());
  useEffect(() => {
    if (!isVibrating) return;
    if (frameTime - lastVibrateFrame.current >= vibrationDelay) {
      setVibrationByStyle();
      vibrate();
      lastVibrateFrame.current = frameTime;
    }
  }, [
    isVibrating,
    frameTime,
    vibrationCycle,
    setVibrationCycle,
    vibrationType,
    setVibrationType,
    app?.HapticFeedback,
    vibrationDelay,
    setVibrationByStyle,
    vibrate,
  ]);

  const [modalShow, setModalShow] = useState<"level_2" | "dao_settings" | null>(
    null,
  );
  useEffect(() => {
    // if (currentLevel > 1 && !state.profile?.dao_id) {
    // setModalShow("level_2");
    setModalShow(null);
    // }
  }, [currentLevel]);
  return (
    <>
      {modalShow ? <NewDaoModal /> : null}
      <div className="absolute left-0 right-0 top-0 bottom-16 z-10 flex flex-col items-stretch">
        <div className="w-full flex flex-col justify-start items-center text-white pl-6 pr-6 pt-2">
          <div
            className="w-full flex-col items-start rounded-xl pl-4 pr-4 pt-4 pb-4 z-40"
            style={{
              background:
                "linear-gradient(90deg, rgba(38, 38, 38, 255) 0%, rgba(38, 38, 38, 0.5) 100%)",
            }}
          >
            <div className="w-full flex flex-row justify-between items-center">
              <div style={{ color: "#B9B2C4" }} className="text-base">
                Your progress:
              </div>
              <div className="flex flex-row text-white font-bold text-base gap-2 sora-bold items-center">
                <div className="coin-logo"></div>
                <div>{particlesCount} $XDAO</div>
              </div>
            </div>
            <div
              className="w-full h-2 bg-blue-300 rounded-2xl relative mt-2 mb-2 overflow-hidden border box-content"
              style={{ backgroundColor: "#171717", borderColor: "#171717" }}
            >
              <div
                className="h-full top-0 left-0 right-0 rounded-2xl"
                style={{
                  width: `${levelPercent}%`,
                  background: "#4200FF",
                }}
              ></div>
            </div>

            <div
              className="w-full flex flex-row justify-between albert-sans-semi-bold text-xs"
              style={{ color: "#A3A3A3" }}
            >
              <div>Level {`${state.currentLevel}`}</div>
              <div>Level {`${state.nextLevel}`}</div>
            </div>
          </div>
          <div
            className="ml-auto mr-auto gap-6 border flex flex-row items-center justify-center sora-bold pl-4 pr-4 pt-2 pb-2 rounded-xl z-40"
            style={{
              backgroundColor: "#262626",
              borderColor: "#2D2D2D",
              color: "#C7C7C7",
              opacity: 0.4,
            }}
          >
            <div style={{ color: "#C7C7C7" }}>Vibration:</div>
            <div
              style={{ color: vibrationStyle === 1 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(1)}
            >
              1
            </div>
            <div
              style={{ color: vibrationStyle === 2 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(2)}
            >
              2
            </div>
            <div
              style={{ color: vibrationStyle === 3 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(3)}
            >
              3
            </div>
            <div
              style={{ color: vibrationStyle === 4 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(4)}
            >
              4
            </div>
            <div
              style={{ color: vibrationStyle === 5 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(5)}
            >
              5
            </div>
            <div
              style={{ color: vibrationStyle === 6 ? "#AD00FF" : "#C7C7C7" }}
              onClick={() => setVibrationStyle(6)}
            >
              6
            </div>
          </div>
        </div>
        <div
          className="flex-1"
          onTouchStartCapture={(e) => {
            touchRef.current = true;
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEndCapture={(e) => {
            touchRef.current = false;
            e.preventDefault();
            e.stopPropagation();
          }}
        ></div>
        <div className="w-full flex flex-col justify-end items-center text-white text-xl mb-5 pl-6 pr-6">
          <div
            className="ml-auto mr-auto border mb-5 flex flex-row items-center justify-center sora-bold pl-4 pr-4 pt-2 pb-2 rounded-xl"
            style={{
              backgroundColor: "#262626",
              borderColor: "#2D2D2D",
              color: "#C7C7C7",
            }}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                d="M16.75 11.75C16.75 13.4076 16.0915 14.9973 14.9194 16.1694C13.7473 17.3415 12.1576 18 10.5 18C8.8424 18 7.25269 17.3415 6.08058 16.1694C4.90848 14.9973 4.25 13.4076 4.25 11.75C4.25 9.36172 5.37656 7.19844 6.67188 5.5L9.25 8L11.3023 2.375C12.9891 3.775 16.75 7.38672 16.75 11.75Z"
                fill="#C7C7C7"
              />
              <path
                d="M14.8664 12.4796C14.7043 13.3848 14.2688 14.2187 13.6185 14.8689C12.9681 15.5191 12.1342 15.9544 11.2289 16.1163C11.1945 16.1218 11.1598 16.1247 11.125 16.1249C10.9682 16.1248 10.8172 16.0659 10.7018 15.9597C10.5865 15.8535 10.5153 15.7079 10.5023 15.5516C10.4893 15.3954 10.5355 15.24 10.6318 15.1162C10.728 14.9924 10.8673 14.9094 11.0219 14.8835C12.3164 14.6655 13.4148 13.5671 13.6344 12.2702C13.6621 12.1067 13.7537 11.9609 13.8889 11.865C14.0242 11.769 14.192 11.7307 14.3555 11.7585C14.519 11.7862 14.6647 11.8778 14.7607 12.013C14.8566 12.1483 14.895 12.3161 14.8672 12.4796H14.8664ZM17.375 11.7499C17.375 13.5732 16.6507 15.3219 15.3614 16.6112C14.072 17.9005 12.3234 18.6249 10.5 18.6249C8.67664 18.6249 6.92795 17.9005 5.63864 16.6112C4.34933 15.3219 3.625 13.5732 3.625 11.7499C3.625 9.56862 4.48438 7.33815 6.17656 5.12097C6.23013 5.05076 6.29796 4.9927 6.37559 4.95062C6.45323 4.90853 6.5389 4.88338 6.62696 4.87681C6.71502 4.87024 6.80347 4.88241 6.88649 4.91251C6.96951 4.94261 7.04521 4.98996 7.10859 5.05144L8.99297 6.88034L10.7117 2.16081C10.7461 2.06668 10.8025 1.98219 10.8764 1.91445C10.9502 1.84671 11.0392 1.79772 11.136 1.77161C11.2327 1.74549 11.3343 1.74301 11.4322 1.76438C11.5301 1.78575 11.6214 1.83035 11.6984 1.8944C13.407 3.31237 17.375 7.10534 17.375 11.7499ZM16.125 11.7499C16.125 8.14909 13.3289 5.03737 11.5773 3.44284L9.8375 8.21394C9.80179 8.31193 9.74213 8.39943 9.66395 8.46846C9.58577 8.53749 9.49155 8.58586 9.38989 8.60916C9.28823 8.63246 9.18236 8.62994 9.08192 8.60185C8.98148 8.57376 8.88966 8.52097 8.81484 8.44831L6.75469 6.44987C5.50703 8.25066 4.875 10.0311 4.875 11.7499C4.875 13.2417 5.46763 14.6725 6.52252 15.7273C7.57742 16.7822 9.00816 17.3749 10.5 17.3749C11.9918 17.3749 13.4226 16.7822 14.4775 15.7273C15.5324 14.6725 16.125 13.2417 16.125 11.7499Z"
                fill="currentColor"
              />
            </svg>
            <div className="ml-2">{energy}</div>
            <div>/</div>
            <div>{maxEnergy}</div>
          </div>
          <div
            className="w-full h-3 rounded-md overflow-hidden relative flex border-2 items-center justify-center box-content"
            style={{ backgroundColor: "#1B1B1B", borderColor: "#1B1B1B" }}
          >
            <div className="overflow-hidden relative flex flex-1 w-full h-full">
              <div
                style={{
                  width: `${energyPercent}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #783CDA 0%, #A3D0F9 100%)",
                }}
                className="bg-blue-300 absolute left-0 top-0 bottom-0 rounded-md"
              ></div>
            </div>
            {/*<div className="text-white text-center z-20">{energy}</div>*/}
          </div>
        </div>
        <div className="h-6"></div>
      </div>

      {state?.startedAt && touchingCountDown > 0 ? (
        <div
          className="absolute left-0 right-0 top-0 bottom-12 z-10 flex flex-col items-center justify-center transition-opacity duration-75 "
          style={{
            color: "#C7C7C7",
          }}
        >
          <div className="sora-bold text-2xl" style={{ color: "#C7C7C7" }}>
            {displayTouchingCountDown}
          </div>
        </div>
      ) : null}
      <Canvas flat>
        <Renderer isTouching={isVibrating} coins={state.particlesCount} />
      </Canvas>
    </>
  );
});

export { ClickerApp };
