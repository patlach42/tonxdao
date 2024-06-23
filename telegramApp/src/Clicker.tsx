import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCentrifugo } from "./Centrifugo.tsx";
import * as THREE from "three";
import { Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { easing } from "maath";
import { observer } from "mobx-react-lite";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Effects } from "./Effects";
import { state } from "./state.tsx";
import { makeAutoObservable } from "mobx";
import { useWebApp } from "./TelegramAppProvider.tsx";

const colors = ["green", "purple", "red", "white"];

function Sphere({
  position,
  children,
  vec = new Vector3(),
  scale = 0.1,
  r = THREE.MathUtils.randFloatSpread,
  color = "white",
}: PropsWithChildren<{
  position?: Vector3;
  vec?: Vector3;
  scale?: number;
  r?: (a: number) => number;
  color?: string;
}>) {
  const api = useRef<RapierRigidBody | null>(null);
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((_frameState, delta) => {
    delta = Math.min(0.2, delta);
    // Gravity
    api.current?.applyImpulse(
      vec
        .copy(api.current.translation())
        .negate()
        .multiplyScalar(0.4 * scale),
      false,
    );
    api.current?.applyImpulse(
      vec.copy(api.current.rotation()).multiplyScalar(0.2 * scale),
      false,
    );
    easing.dampC(
      (ref?.current?.material as unknown as { color: THREE.Color })?.color,
      color,
      0,
      delta,
    );
  });
  const _position = useMemo(() => {
    const a = (n: number) => (n > 0 ? n + 20 : n - 20);
    return position || new Vector3(a(r(100)), a(r(100)), a(r(100)));
  }, [position, r]);
  return (
    <RigidBody
      linearDamping={2}
      angularDamping={2}
      friction={0.6}
      position={_position}
      ref={(_ref) => {
        api.current = _ref;
      }}
      colliders={false}
    >
      <BallCollider args={[scale * 1.1]} />
      <mesh
        ref={(_ref) => {
          ref.current = _ref;
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[scale, 4, 4]} />
        {children}
      </mesh>
    </RigidBody>
  );
}

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

const ClickerScreen: React.FC<PropsWithChildren> = observer(() => {
  const centrifugo = useCentrifugo();
  const maxEnery = 500;

  // { particlesCount, onTouch = () => {} }
  const particlesCountRef = useRef(state.particlesCount);
  // const [particlesCount, setParticlesCount] = useState(0);
  const { particlesCount } = state;
  const totalEnergy = game.maxEnergy;
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

  const energyPercent = (energy / totalEnergy) * 100;

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
      let _energy = Math.floor(
        Number(
          game.energy +
            (new Date().getTime() -
              new Date(
                (state.profile?.last_energy_change || 0) * 1000,
              ).getTime()) /
              1000,
        ),
      );
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
          state.profile.last_energy_change + (game.energy - lastEnergy);
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

  const x1ParticlesCount = particlesCount % 100;
  const x3ParticlesCount = ~~(particlesCount / 1000);
  const x2ParticlesCount = ~~((particlesCount - x3ParticlesCount * 1000) / 100);
  const x4ParticlesCount = ~~(particlesCount / 10000);

  return (
    <>
      <div
        className="absolute left-0 right-0 top-0 bottom-0 z-10 flex flex-col justify-between items-center "
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
        <div className="bg-opacity-35 w-20 h-10  text-white mt-4 font-bold text-3xl">
          <div>{particlesCount}</div>
        </div>
        <div className="w-full flex-1  flex flex-row justify-start items-start text-white mt-4 font-bold text-3xl"></div>
        <div className="w-full flex flex-row justify-around items-end text-white mt-20 mb-6">
          <div className="w-full ml-10 mr-10 h-10 border-2 border-blue-950 rounded-3xl overflow-hidden relative flex items-center justify-center">
            <div className="text-white text-center z-20">{energy}</div>
            <div
              style={{ width: `${energyPercent}%`, height: "100%" }}
              className="bg-blue-300 absolute left-0 top-0 bottom-0"
            ></div>
          </div>
        </div>
      </div>
      <Canvas
        flat
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 70], fov: 17.5, near: 10, far: 1000 }}
      >
        <color attach="background" args={["#141622"]} />
        <Physics /*debug*/ timeStep="vary" gravity={[0, 0, 0]}>
          {/*{connectors.map((props, i) => (*/}
          {/*  <Sphere key={i} {...props} />*/}
          {/*))}*/}
          {Array.from({ length: x4ParticlesCount }, (_, i) => (
            <Sphere
              scale={2.2}
              key={1000 + i}
              color={colors[i % colors.length]}
            />
          ))}
          {Array.from({ length: x3ParticlesCount }, (_, i) => (
            <Sphere
              scale={2}
              key={100 + i}
              color={colors[i % colors.length]}
              position={new Vector3(0, 0, 0)}
            />
          ))}
          {Array.from({ length: x2ParticlesCount }, (_, i) => (
            <Sphere
              scale={0.8}
              position={new Vector3(0, 0, 0)}
              key={10 + i}
              color={colors[i % colors.length]}
            />
          ))}
          {Array.from({ length: x1ParticlesCount }, (_, i) => (
            <Sphere
              scale={0.2}
              key={i}
              color={colors[i % colors.length]}
              // position={new Vector3(0, 0, 0)}
            />
          ))}
        </Physics>
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer
              form="circle"
              intensity={100}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, -1, -1]}
              scale={2}
            />
            <Lightformer
              form="circle"
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={8}
            />
            <Lightformer
              form="ring"
              color="#4060ff"
              intensity={80}
              onUpdate={(self) => self.lookAt(0, 0, 0)}
              position={[10, 10, 0]}
              scale={10}
            />
          </group>
        </Environment>
        <Effects />
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
