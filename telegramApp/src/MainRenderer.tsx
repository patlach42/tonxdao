import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { observer } from "mobx-react-lite";
import { useFrame, useThree } from "@react-three/fiber";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WaveMaterial } from "./shaders/Material";
import {
  Bloom,
  ChromaticAberration,
  Glitch,
  EffectComposer,
  Vignette,
  Pixelation,
  // Bloom,
  // Autofocus,
  // Depth,
  // DepthOfField,
  // DotScreen,
  // HueSaturation,
  // Sepia,
  // ASCII,
  // Noise,
  // Vignette,
  // ChromaticAberration,
  // ColorAverage,
  // SSAO,
  // LensFlare,
} from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";

export const useFrameTime = () => {
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
const ShaderPlane: React.FC<{
  position?: Vector3;
  scale?: number;
  coins: number;
  isVibrating?: boolean;
  isRef?: boolean;
}> = observer(({ isVibrating, coins }) => {
  const ref = useRef<{ coins: number; time: number; fireballTime: number }>({
    coins: 0,
    time: 0,
    fireballTime: 0,
  });
  const { viewport, size } = useThree();

  useEffect(() => {
    ref.current.coins = coins;
  }, [coins]);

  useFrame((_state, delta) => {
    const _delta = delta * (isVibrating ? 1 : 0.1);
    const _fireballDelta = delta * (isVibrating ? 1 : 0.5);
    ref.current.time += _delta;
    ref.current.fireballTime += _fireballDelta;
  });
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <waveMaterial
        ref={ref}
        key={WaveMaterial.key}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
      />
    </mesh>
  );
});
export const Renderer: React.FC<{ isTouching: boolean; coins: number }> = ({
  isTouching,
  coins,
}) => {
  // const pixelRef = useRef();
  return (
    <>
      <ShaderPlane isVibrating={isTouching} coins={coins}></ShaderPlane>
      {/*<EffectComposer>*/}
      {/*<DepthOfField focusDistance={100} focalLength={0} bokehScale={0} />*/}
      {/*<Bloom luminanceThreshold={1} luminanceSmoothing={0} />*/}
      {/*<ChromaticAberration*/}
      {/*  offset={[0.01, 0]} // color offset*/}
      {/*/>*/}
      {/*<Pixelation*/}
      {/*  ref={pixelRef}*/}
      {/*  granularity={1} // pixel granularity*/}
      {/*/>*/}
      {/*</EffectComposer>*/}
    </>
  );
};
