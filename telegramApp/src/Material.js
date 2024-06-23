import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const WaveMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2(),
  },
  /*glsl*/ `
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }`,
  /*glsl*/ `
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 pointer;
      varying vec2 vUv;      

      void main() {
        vec3 c;
        float l,z=time;
        for(int i=0;i<3;i++) {
          vec2 uv,p=gl_FragCoord.xy/resolution;
          uv=p;
          p-=.1;
          p.x*=resolution.x/resolution.y;
          z+=.05;
          l=length(p);
          uv+=p/l*(sin(z)+1.)*abs(sin(l*8.-z-z));
          c[i]=.01/length(mod(uv,1.)-.5);
        }
        gl_FragColor = vec4(c/l,time);
      }`,
);

extend({ WaveMaterial });

export { WaveMaterial };
