uniform float time;
uniform float coins;
uniform vec2 resolution;
uniform vec2 pointer;
varying vec2 vUv;
#define timeScale 1.

vec3 palette(float t) {
     vec3 a = vec3(0.5, 0.5, 0.5);
     vec3 b = vec3(0.5, 0.5, 0.5);
     vec3 c = vec3(1.0, 1.0, 1.0);
     vec3 d = vec3(0.263, 0.416, 0.557);
     return a + b * cos(6.28318 * (c * t + d));
}
vec3 fractal() {
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
    return finalColor;
}