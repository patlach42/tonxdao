import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useCentrifugo } from "./Centrifugo.tsx";
import { Vector3 } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WaveMaterial } from "./Material";
import { Physics, RigidBody } from "@react-three/rapier";
import { easing } from "maath";
import { observer } from "mobx-react-lite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { state } from "./state.tsx";
import { makeAutoObservable } from "mobx";
import { useWebApp } from "./TelegramAppProvider.tsx";
import { Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

class Game {
  energy: number;

  constructor() {
    makeAutoObservable(this);
    this.energy = this.maxEnergy;
  }

  get maxEnergy() {
    return 500;
  }
  minusEnergy() {
    this.energy = Math.max(0, this.energy - 1);
    // alert(this.energy);
  }
  plusEnergy() {
    this.energy = Math.min(this.maxEnergy, this.energy + 1);
    // alert(this.energy);
  }
  start() {}
}

const game = new Game();

const useFrameTime = () => {
  const [frameTime, setFrameTime] = useState(performance.now());
  useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

const useFrameCallback = (callback: (time: number) => void) => {
  const frameTime = useFrameTime();
  useEffect(() => {
    callback(frameTime);
  }, [frameTime, callback]);
};

const ShaderPlane: React.FC<{
  position?: Vector3;
  scale?: number;
  isVibrating?: boolean;
  isRef?: boolean;
}> = ({ position, scale, isVibrating, isRef }) => {
  const ref = useRef();
  const api = useRef();
  const { viewport, size } = useThree();
  useFrame((state, delta) => {
    if (isVibrating) {
      ref.current.time += delta * 0.5;
    } else {
      ref.current.time += delta * 0.1;
    }
    // easing.damp3(ref.current.pointer, state.pointer, 0.2, delta);
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <waveMaterial
        ref={ref}
        key={WaveMaterial.key}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
      />
    </mesh>
  );
};
const Renderer: React.FC<{ isTouching: boolean }> = ({ isTouching }) => {
  const starsRef = useRef();
  useFrame((state, delta) => {
    if (starsRef.current) {
      const multiplier = isTouching ? 0.06 : 0.01;
      // eslint-disable-next-line
      // @ts-ignore
      starsRef.current.rotation.y += delta * multiplier;
    }
  });
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <ShaderPlane isVibrating={isTouching}></ShaderPlane>
      {/*<ShaderPlane position={new Vector3(-100, -150, 0)} isRef></ShaderPlane>*/}
      {/*<ShaderPlane position={new Vector3(100, -150, 0)} isRef></ShaderPlane>*/}

      {/*<Stars*/}
      {/*  saturation={1}*/}
      {/*  count={100}*/}
      {/*  speed={1}*/}
      {/*  // eslint-disable-next-line*/}
      {/*  // @ts-ignore*/}
      {/*  ref={starsRef}*/}
      {/*/>*/}
      {/*<EffectComposer>*/}
      {/*  <Bloom*/}
      {/*    kernelSize={3}*/}
      {/*    luminanceThreshold={0}*/}
      {/*    luminanceSmoothing={0.4}*/}
      {/*    intensity={0.6}*/}
      {/*  />*/}
      {/*</EffectComposer>*/}
    </>
  );
};

const ClickerScreen: React.FC<PropsWithChildren> = observer(() => {
  const centrifugo = useCentrifugo();
  const maxEnery = 500;

  // { particlesCount, onTouch = () => {} }
  const particlesCountRef = useRef(state.particlesCount);
  // const [particlesCount, setParticlesCount] = useState(0);
  const { particlesCount } = state;
  const energy = game.energy;

  const touchRef = useRef(false);
  const touchingRef = useRef(false);

  useEffect(() => {
    game.start();
    const calculatedEnergy =
      (new Date().getTime() -
        new Date((state.profile?.last_energy_change || 0) * 1000).getTime()) /
      1000;
    game.energy = Math.min(
      Math.floor(
        Number(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          state.profile?.energy + calculatedEnergy,
        ),
      ),
      maxEnery,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.profile.energy = game.energy;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.profile.last_energy_change = state?.profile?.last_energy_change
      ? state.profile.last_energy_change + calculatedEnergy
      : new Date().getTime() / 1000;
    // game.energy = state.profile?.last_energy_change || 0;
  }, []);

  const energyPercent = (energy / maxEnery) * 100;
  const levelPercent = (particlesCount / 25000) * 100;

  const lastCountedFrame = useRef(performance.now());
  const lastEnergyRestoredFrame = useRef(performance.now());
  const lastVibrateFrame = useRef(performance.now());
  const app = useWebApp();

  useFrameCallback((frameTime) => {
    if (touchingRef.current && !touchRef.current) {
      console.log("touchingRef.current && !touchRef.current");
      touchingRef.current = false;
    } else if (!touchingRef.current && touchRef.current) {
      console.log("!touchingRef.current && touchRef.current");
      touchingRef.current = true;
    } else if (touchingRef.current && touchRef.current) {
      // pressing now
      if (frameTime - lastCountedFrame.current >= 50) {
        lastCountedFrame.current = frameTime;
        if (game.energy > 0) {
          particlesCountRef.current += 1;
          state.particlesCount = particlesCountRef.current;
          centrifugo?.publish("game", {});
          game.energy = Math.max(0, game.energy - 1);
          if (state.profile) {
            state.profile.last_energy_change = new Date().getTime() / 1000;
            state.profile.energy = game.energy;
          }
        }
      }
    }
    if (frameTime - lastEnergyRestoredFrame.current >= 100) {
      lastEnergyRestoredFrame.current = frameTime;
      const lastEnergy = game.energy;
      const calculatedEnergy =
        (new Date().getTime() -
          new Date((state.profile?.last_energy_change || 0) * 1000).getTime()) /
        1000;
      let _energy = Math.floor(Number(game.energy + calculatedEnergy));
      _energy = _energy <= maxEnery ? _energy : 500;
      game.energy = _energy;
      if (lastEnergy !== game.energy) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.profile.energy = game.energy;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.profile.last_energy_change =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          state.profile.last_energy_change + calculatedEnergy;
      }
    }
  });

  useEffect(() => {
    const interv = setInterval(() => {
      if (touchingRef.current && touchRef.current && game.energy > 0) {
        // app?.HapticFeedback?.impactOccurred("light");
        app?.HapticFeedback?.notificationOccurred("error");
        // app?.HapticFeedback?.impactOccurred("heavy");
        lastVibrateFrame.current = performance.now();
      }
      // app?.HapticFeedback?.selectionChanged();
    }, 1);
    return () => clearInterval(interv);
  }, [app?.HapticFeedback]);
  const isVibrating =
    touchingRef.current && touchRef.current && game.energy > 0;

  return (
    <>
      <div
        className="absolute left-0 right-0 top-0 bottom-12 z-10 flex flex-col justify-between items-center "
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
      >
        <div className="w-full flex flex-col justify-start items-center text-white pl-4 pr-4 pt-2">
          <div className="w-full flex-col items-start">
            <div className="sora-bold text-xl ">
              Hello, {state?.profile?.full_name}
            </div>
            <div style={{ color: "#C7C7C7" }}>Hold & vibrate with XDAO</div>
          </div>
          <div
            className="w-full flex-col items-start mt-2 rounded-xl pl-4 pr-4 pt-3 pb-3"
            style={{
              background:
                "linear-gradient(90deg, rgba(38, 38, 38, 255) 0%, rgba(38, 38, 38, 0.5) 100%)",
            }}
          >
            <div style={{ color: "#B9B2C4" }} className="text-base">
              Your progress
            </div>
            <div
              className="w-full h-1.5 bg-blue-300 rounded-2xl relative mt-1 mb-1 overflow-hidden border-2"
              style={{ backgroundColor: "#171717", borderColor: "#171717" }}
            >
              <div
                className="h-full top-0 left-0 right-0 rounded-2xl"
                style={{
                  width: `${levelPercent}%`,
                  background: "#AD00FF",
                }}
              ></div>
            </div>

            <div
              className="w-full flex flex-row justify-between albert-sans-semi-bold text-xs"
              style={{ color: "#A3A3A3" }}
            >
              <div>Level 1</div>
              <div>Level 2</div>
            </div>
          </div>
          <div className="bg-opacity-35 flex flex-row text-white mt-2 font-bold text-2xl gap-2 sora-bold items-center">
            <div className="coin-logo"></div>
            <div>{particlesCount} $XDAO</div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-end items-center text-white mt-20 mb-6 pl-4 pr-4">
          <div
            className="ml-auto mr-auto border mb-4 flex flex-row items-center justify-center sora-bold pl-4 pr-4 pt-2 pb-2 rounded-xl"
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
            <div className="ml-1">{energy}</div>
            <div>/</div>
            <div>{maxEnery}</div>
          </div>
          <div
            className="w-full h-4 rounded-lg overflow-hidden relative flex items-center justify-center p-1"
            style={{ backgroundColor: "#1B1B1B", borderColor: "#1B1B1B" }}
          >
            <div className="overflow-hidden relative flex flex-1 w-full h-full">
              <div
                style={{
                  width: `${energyPercent}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #1400FF 0%, #AD00FF 100%)",
                }}
                className="bg-blue-300 absolute left-0 top-0 bottom-0 rounded-xl"
              ></div>
            </div>
            {/*<div className="text-white text-center z-20">{energy}</div>*/}
          </div>
        </div>
      </div>
      <Canvas
        // flat
        color={"#ffffff"}
        // shadows
        // dpr={[1, 1.5]}
        // gl={{ antialias: false }}
        // camera={{ position: [0, 0, 500], near: 10, far: 1000 }}
      >
        <Renderer isTouching={isVibrating} />
      </Canvas>
    </>
  );
});

const ClickerApp = observer(() => {
  return (
    <>
      <ClickerScreen></ClickerScreen>
    </>
  );
});

export { ClickerApp, ClickerScreen };
