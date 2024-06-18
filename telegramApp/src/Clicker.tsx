import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
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

const manualInterval = (functionRef: () => void, delay: number) => {
  const intervalStart = Date.now();
  let timerId: string | number | NodeJS.Timeout | undefined;
  const nextTime = () => {
    const nextInterval = delay - ((Date.now() - intervalStart) % delay);
    timerId = setTimeout(nextTime, nextInterval);
    functionRef();
  };

  setTimeout(nextTime, delay);
  return () => clearTimeout(timerId);
};

class Clock {
  interval?: () => unknown;
  realTime?: number;
  callbacks: Array<(realTime?: number) => unknown> = [];

  constructor() {}

  addCallback(callback: (realTime?: number) => unknown) {
    this.callbacks.push(callback);
  }

  async getServerTime() {
    return Date.now();
  }
  async start() {
    this.realTime = await this.getServerTime();
    this.interval = manualInterval(() => this.tick(), 1000);
  }
  stop() {
    this.interval?.();
  }
  tick() {
    this.realTime = Date.now();
    this.callbacks.forEach((callback) => callback(this.realTime));
  }
}

class Game {
  energy: number;

  constructor() {
    makeAutoObservable(this);
    this.energy = this.maxEnergy;
  }
  get maxEnergy() {
    return 3000;
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
  const frameTime = useRef(performance.now());
  useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      frameTime.current = time;
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

const useFrameCallback = (callback: (time: number) => void) => {
  useEffect(() => {
    let frameId: number;
    const frame = () => {
      callback(performance.now());
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
};

const ClickerScreen: React.FC<
  PropsWithChildren<{
    particlesCount: number;
    onTouch?: () => void;
  }>
> = observer((props) => {
  const centrifugo = useCentrifugo();

  // { particlesCount, onTouch = () => {} }
  const particlesCountRef = useRef(state.particlesCount);
  // const [particlesCount, setParticlesCount] = useState(0);
  const { particlesCount } = state;
  const totalEnergy = game.maxEnergy;
  const energy = game.energy;

  const touchRef = useRef(false);
  const touchingRef = useRef(false);

  const [touchedFrameTimeStart, setTouchedFrameTimeStart] = useState(
    performance.now(),
  );
  const [touchedFrameTimeEnd, setTouchedFrameTimeEnd] = useState(
    performance.now(),
  );

  useEffect(() => {
    game.start();
  }, []);

  const energyPercent = (energy / totalEnergy) * 100;

  const lastCountedFrame = useRef(performance.now());
  const lastEnergyRestoredFrame = useRef(performance.now());
  const lastVibrateFrame = useRef(performance.now());

  useFrameCallback((frameTime) => {
    if (touchingRef.current && !touchRef.current) {
      navigator.vibrate(0);
      console.log("touchingRef.current && !touchRef.current");
      touchingRef.current = false;
      setTouchedFrameTimeEnd(performance.now());
    } else if (!touchingRef.current && touchRef.current) {
      console.log("!touchingRef.current && touchRef.current");
      touchingRef.current = true;
      setTouchedFrameTimeStart(performance.now());
    } else if (touchingRef.current && touchRef.current) {
      // pressing now
      if (frameTime - lastCountedFrame.current >= 50) {
        lastCountedFrame.current = frameTime;
        particlesCountRef.current += 1;
        game.minusEnergy();
        state.particlesCount = particlesCountRef.current;
        centrifugo?.rpc("tap", {});
      }
      if (frameTime - lastVibrateFrame.current >= 40) {
        navigator.vibrate(2);
        lastVibrateFrame.current = frameTime;
      }
    } else {
      if (frameTime - lastEnergyRestoredFrame.current >= 100) {
        lastEnergyRestoredFrame.current = frameTime;
        game.plusEnergy();
      }
    }
  });

  const x1ParticlesCount = particlesCount % 100;
  const x3ParticlesCount = ~~(particlesCount / 1000);
  const x2ParticlesCount = ~~((particlesCount - x3ParticlesCount * 1000) / 100);
  const x4ParticlesCount = ~~(particlesCount / 10000);

  return (
    <>
      <div
        className="absolute left-0 right-0 top-0 bottom-0 z-10 flex flex-col justify-between items-center "
        onTouchStart={() => {
          touchRef.current = true;
        }}
        onTouchEnd={() => {
          touchRef.current = false;
        }}
        onMouseDown={() => {
          console.log("onMouseDown");
          touchRef.current = true;
        }}
        onMouseUp={() => {
          console.log("onMouseUp");
          touchRef.current = false;
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

const ClickerTestApp = () => {
  const [particlesCount, setParticlesCount] = useState(0);
  return (
    <>
      <div className="flex flex-col h-screen">
        <main className="flex-1 bg-gray-100 relative">
          <ClickerScreen
            particlesCount={particlesCount}
            onTouch={() => {
              setParticlesCount(particlesCount + 1);
            }}
          ></ClickerScreen>
        </main>
      </div>
    </>
  );
};

const ClickerApp = observer(() => {
  const centrifugo = useCentrifugo();
  const onTouch = useCallback(() => {
    centrifugo?.rpc("tap", {});
    state.addParticle();
  }, [centrifugo]);

  return (
    <>
      <ClickerScreen
        particlesCount={state.particlesCount}
        onTouch={onTouch}
      ></ClickerScreen>
    </>
  );
});

export { ClickerApp, ClickerScreen, ClickerTestApp };
