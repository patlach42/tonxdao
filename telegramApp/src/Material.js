import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const WaveMaterial = shaderMaterial(
  {
    time: 0,
    coins: 0,
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
      uniform float coins;
      uniform vec2 resolution;
      uniform vec2 pointer;
      varying vec2 vUv;      

      vec3 palette(float t) {
        // vec3 a = vec3(0.5, 0.5, 0.5);
        // vec3 b = vec3(0.5, 0.5, 0.5);
        // vec3 c = vec3(1.0, 1.0, 1.0);
        // vec3 d = vec3(0.263, 0.416, 0.557);
        // return a + b * cos(6.28318 * (c * t + d));
        vec3 a = vec3(0.158, 0.248, 0.048);
        vec3 b = vec3(0.590, 0.590, 0.590);
        vec3 c = vec3(2.197, 1.448, 0.440);
        vec3 d = vec3(0.000, 0.333, 0.667);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / (resolution.y * 0.5);
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);
        float iLimit = 5.0;
        for (float i = 0.0; i < iLimit; i++) {
            uv = fract(uv * 1.5) -.5;     

            float d = length(uv) * exp(-length(uv0));

            vec3 col = palette(length(uv0) + i*.4 + time*.1 + coins*0.01);
            
            d = sin(d * 8.0 + coins*0.01) / 8.0;
            d = abs(d);

            d = pow(0.01 / d, 1.2);
            // d = 0.01 / d;
    
            finalColor += col * d;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);   
      }`,
);

extend({ WaveMaterial });

export { WaveMaterial };
