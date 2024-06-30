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
#define timeScale 1.

float N11(float n)
{
    vec2 v1 = vec2(fract(n*129.3484),fract(n*10.2347+1.4948));
    vec2 v2 = vec2(49.256,n);
    return fract(dot(v1,v2));
}

vec2 N12(float n)
{
    vec2 v1 = vec2(fract(n*33.24102+1.2847),fract(n*4.70234556-2.5856));
    vec2 v2 = vec2(39.3823+n,n*3.1938+1.4028);
    return vec2(fract(dot(v1,v2)),N11(dot(v1,v2)));
}

vec2 N22(vec2 p)
{
    return vec2(N11(4.238+p.y+p.x*0.6274),N11(3.4148*p.y-8.29*p.x+1.39558));
}

float perlin(vec2 p,float scale, float seed)
{
    vec2 pS = p*scale;
    
    float X1 = floor(p.x*scale);
    float X2 = X1+1.;
    float Y1 = floor(p.y*scale);
    float Y2 = Y1+1.;
    
    vec2 v11 = vec2(X1,Y1);
    
    vec2 gpUnfaded = pS - v11;
    float xCub = pow(gpUnfaded.x,3.);
    float yCub = pow(gpUnfaded.y,3.);
    vec2 gp = vec2((6.*gpUnfaded.x*gpUnfaded.x-15.*gpUnfaded.x+10.)*xCub,
              (6.*gpUnfaded.y*gpUnfaded.y-15.*gpUnfaded.y+10.)*yCub);
    
    vec2 v12 = vec2(X1,Y2);
    vec2 v21 = vec2(X2,Y1);
    vec2 v22 = vec2(X2,Y2);
    
vec2 d11 = gp-v11;
    vec2 d12 = gp-v12;
    vec2 d21 = gp-v21;
    vec2 d22 = gp-v22;
    
    float fact = 1.394+seed;
    vec2 g11 = (N22(v11*fact)-.5)*2.;
    vec2 g12 = (N22(v12*fact)-.5)*2.;
    vec2 g21 = (N22(v21*fact)-.5)*2.;
    vec2 g22 = (N22(v22*fact)-.5)*2.;
    
    vec2 contribY1 = mix(g11,g21,gp.x);
    vec2 contribY2 = mix(g12,g22,gp.x);
    
    vec2 contrib = mix(contribY1,contribY2,gp.y);

float value= dot(d11,contrib)+dot(d12,contrib)-dot(d21,contrib)-dot(d22,contrib);
    
    return mix(0.,1.,value);
}

vec3 starColor(vec2 p, float id, float radius)
{
    //center of the star
    vec2 center = N12(id)-.5;
    //random color
    vec3 color = vec3(N11(id),N11(id*7.2819),N11(id/2.));
    vec2 vec = center-p;
    float dist = (length(vec));
   float angle = abs(sqrt(abs(vec.x*vec.y)))*5.;
    float star = smoothstep(radius*.3,radius*.25,dist);
    float halo = smoothstep(radius*1.2,.0,dist)*(.7+abs(sin(time*(20.+center.x*40.)))*.3);
    float scint = smoothstep(1.,.0,angle)*halo*(.7+abs(sin(time*(10.+center.x*20.)))*.3);
    return star*vec3(sqrt(color))+(scint+halo)*color;
}

vec3 layerColor(vec2 uv, float layerIndex,float scale)
{
    uv = uv*scale;
    //random seed for this layer
    float seed = 2.309387+layerIndex*1.283374;
    //subdivision into squares
    vec2 gv = (fract(uv*10.)*2.)-1.;
    //id of the square
    float id= seed*1.4983*floor(uv.y*10.)+5.39283*floor(uv.x*10.);
    //random radius for the star
    float radius = mix(.1,.5,N11(id*3.82918));
   //is the start in this square visible?
    float visible = smoothstep(.95,.96,N11(id*19.10982));
    //value of the star to draw
    vec3 starColor = starColor(gv,id,radius);
    
    
    return starColor*visible;
}

vec3 nebula(vec2 uv,float scale, float seed)
{
    uv = uv*scale;
    vec3 color = 0.5 + 0.5*cos(time*.4*timeScale-length(uv)+vec3(0,2,4));
    
 //value of the nebula
    float valPerlin = perlin(uv,scale,seed)+.6*perlin(uv,5.*scale,seed)+.3*perlin(uv,7.*scale,seed);
    vec3 colNebul = smoothstep(-1.,1.,valPerlin)*color*.12*(.2+.2*length(uv));  
    
    return colNebul;
}

vec4 spaceJourney(  )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy/resolution.xy*2.)-1.;
    uv.x *= resolution.x/resolution.y;

    vec3 col = vec3(0.);
    
    
    float time = time*timeScale;
    // Number of layers
    float nbLayers = 20.;
    float step = .5;
    float width = nbLayers * step;
    
    for(float i = 1. ; i < nbLayers; i++)
    {
        float posI = mod(width-(time+i),width+0.5);
        float scale =posI;
        float visible = clamp(2.-abs(posI - 2.), 0.,1.);
        vec3 nebulVal = nebula(uv,scale,i)*.7;
        col += visible*(layerColor(uv,i,scale)+nebulVal);
    }
                                                                   
    return vec4(col,1.0);
}
    
    
    
    
        // noise from https://www.shadertoy.com/view/4sc3z2
        vec3 hash33(vec3 p3)
        {
        p3 = fract(p3 * vec3(.1031,.11369,.13787));
            p3 += dot(p3, p3.yxz+19.19);
            return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
        }
        float snoise3(vec3 p)
        {
            const float K1 = 0.333333333;
            const float K2 = 0.166666667;

            vec3 i = floor(p + (p.x + p.y + p.z) * K1);
            vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

            vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);

            vec3 d1 = d0 - (i1 - K2);
            vec3 d2 = d0 - (i2 - K1);
            vec3 d3 = d0 - 0.5;

            vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
            vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));

            return dot(vec4(31.316), n);
        }

        vec4 extractAlpha(vec3 colorIn)
        {
            vec4 colorOut;
            float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
            if (maxValue > 1e-5)
            {
                colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
                colorOut.a = maxValue;
            }
            else
            {
                colorOut = vec4(0.0);
            }
            return colorOut;
        }
        
        vec3 getColor(int style, int c) {
            if (style == 0) {
                const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
                const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
                const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
                return c == 0 ? color1 : c == 1 ? color2 : color3;
            }
            if (style == 1) {
                const vec3 color1 = vec3(0.611765, 0.611765, 0.611765);
                const vec3 color2 = vec3(0.913725, 0.913725, 0.913725);
                const vec3 color3 = vec3(0.600000, 0.600000, 0.600000);
                return c == 0 ? color1 : c == 1 ? color2 : color3;
            }
        }
        
        const float innerRadius = 0.5;
        const float noiseScale = 0.7;

        float light1(float intensity, float attenuation, float dist)
        {
            return intensity / (1.0 + dist * attenuation);
        }
        float light2(float intensity, float attenuation, float dist)
        {
            return intensity / (1.0 + dist * dist * attenuation);
        }
        void draw( out vec4 _FragColor, in vec2 vUv1, float _time, int colorStyle)
        {
            vec3 color1 = getColor(colorStyle, 0);
            vec3 color2 = getColor(colorStyle, 1);
            vec3 color3 = getColor(colorStyle, 2);
            vec2 uv = vUv1;
            float ang = atan(uv.y, uv.x);
            float len = length(uv);
            float v0, v1, v2, v3, cl;
            float r0, d0, n0;
            float r, d;

            // ring
            n0 = snoise3( vec3(uv * noiseScale, _time * 0.5) ) * 0.5 + 0.5;
            r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
            d0 = distance(uv, r0 / len * uv);
            v0 = light1(1.0, 10.0, d0);
            v0 *= smoothstep(r0 * 1.05, r0, len);
            cl = cos(ang + _time * 2.0) * 0.5 + 0.5;

            // high light
            float a = _time * -1.0;
            vec2 pos = vec2(cos(a), sin(a)) * r0;
            d = distance(uv, pos);
            v1 = light2(1.5, 5.0, d);
            v1 *= light1(1.0, 50.0 , d0);

            // back decay
            v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);

            // hole
            v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

            // color
            vec3 c = mix(color1, color2, cl);
            vec3 col = mix(color1, color2, cl);
            col = mix(color3, col, v0);
            col = (col + v1) * v2 * v3;
            // col = (col + v1) * v2;
            col.rgb = clamp(col.rgb, 0.0, 1.0);

            //gl_FragColor = extractAlpha(col);
            _FragColor = extractAlpha(col);
        }
      void main() {
        vec2 centerPos = (gl_FragCoord.xy * 2. - resolution.xy) / (resolution.y * 0.4);
        vec2 leftPos = vec2(centerPos.x - 1.8, centerPos.y);
        vec2 rightPos = vec2(centerPos.x + 1.8, centerPos.y);

        // vec4 space = spaceJourney();
        // gl_FragColor = space;
        vec3 data = vec3(0.0);
        vec4 col;
        vec4 col1;
        vec4 col2;
        draw(col, centerPos, time, 0);
        draw(col1, leftPos, time+2., 1);
        draw(col2, rightPos, time+3., 1);
        data = mix(data, col.rgb, col.a); 
        data = mix(data, col1.rgb, col1.a); 
        data = mix(data, col2.rgb, col2.a); 
        
        gl_FragColor.rgb = data;
      }
      
      
      // fractal
      // vec3 palette(float t) {
      //   // vec3 a = vec3(0.5, 0.5, 0.5);
      //   // vec3 b = vec3(0.5, 0.5, 0.5);
      //   // vec3 c = vec3(1.0, 1.0, 1.0);
      //   // vec3 d = vec3(0.263, 0.416, 0.557);
      //   // return a + b * cos(6.28318 * (c * t + d));
      //   vec3 a = vec3(0.158, 0.248, 0.048);
      //   vec3 b = vec3(0.590, 0.590, 0.590);
      //   vec3 c = vec3(2.197, 1.448, 0.440);
      //   vec3 d = vec3(0.000, 0.333, 0.667);
      //   return a + b * cos(6.28318 * (c * t + d));
      // }
      // void main() {
      //   vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / (resolution.y * 0.5);
      //   vec2 uv0 = uv;
      //   vec3 finalColor = vec3(0.0);
      //   float iLimit = 5.0;
      //   for (float i = 0.0; i < iLimit; i++) {
      //       uv = fract(uv * 1.5) -.5;     
      //
      //       float d = length(uv) * exp(-length(uv0));
      //
      //       vec3 col = palette(length(uv0) + i*.4 + time*.1 + coins*0.01);
      //
      //       d = sin(d * 8.0 + coins*0.01) / 8.0;
      //       d = abs(d);
      //
      //       d = pow(0.01 / d, 1.2);
      //       // d = 0.01 / d;
      //
      //       finalColor += col * d;
      //   }
      //
      //   gl_FragColor = vec4(finalColor, 1.0);   
      // }
`,
);

extend({ WaveMaterial });

export { WaveMaterial };
