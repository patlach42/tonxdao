uniform float time;
uniform float fireballTime;
uniform float coins;
uniform vec2 resolution;
uniform vec2 pointer;
varying vec2 vUv;
#define timeScale 1.

const float innerRadius = 0.6;
const float noiseScale = 0.7;

// noise from https://www.shadertoy.com/view/4sc3z2
vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(.1031, .11369, .13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
}

float snoise(vec3 uv, float res) {
	const vec3 s = vec3(1e0, 1e2, 1e3);
	uv *= res;
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);
	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	return mix(r0, r1, f.z)*2.-1.;
}

float snoise3(vec3 p) {
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
    const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
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
    return c == 0 ? color1 : c == 1 ? color2 : color3;
}

float light1(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist)
{
    return intensity / (1.0 + dist * dist * attenuation);
}
void draw(out vec4 _FragColor, in vec2 vUv1, float _time, int colorStyle)
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
    n0 = snoise3(vec3(uv * noiseScale, _time * 0.5)) * 0.5 + 0.5;
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
    v1 *= light1(1.0, 50.0, d0);

    // back decay
    v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);

    // hole
    v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.6), len);

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

vec3 palette(float t) {
     vec3 a = vec3(0.5, 0.5, 0.5);
     vec3 b = vec3(0.5, 0.5, 0.5);
     vec3 c = vec3(1.0, 1.0, 1.0);
     vec3 d = vec3(0.263, 0.416, 0.557);
     return a + b * cos(6.28318 * (c * t + d));
}
vec4 drawFireball(vec2 _p) {
	vec2 p = _p;
    float size = 3.0;

	float color = 3.0 - (3.*length(2.*p));
	vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
	for(int i = 1; i <= 7; i++)
	{
		float power = pow(4.0, float(i));
		color += (1.5 / power) * snoise(coord + vec3(0.,-fireballTime*.05, fireballTime*.01), power*16.);
	}
	vec3 fireBall = vec3( color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15);
    fireBall = fireBall *  vec3(0.1, 0.160784, 0.913725);
	vec4 fireBallAlpha = extractAlpha(fireBall);
    return fireBallAlpha;
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

void main() {
    vec2 centerPos = (gl_FragCoord.xy * 2. - resolution.xy) / (resolution.y * 0.45);
    centerPos.y = centerPos.y - 0.2;
    vec2 leftPos = vec2(centerPos.x - 1.8, centerPos.y);
    vec2 rightPos = vec2(centerPos.x + 1.8, centerPos.y);

    vec3 data = vec3(0.0);
    vec4 col;
    vec4 col1;
    vec4 col2;
    draw(col, centerPos, time, 0);
    draw(col1, leftPos, time+2., 1);
    draw(col2, rightPos, time+3., 1);

    vec4 fireBallAlpha = drawFireball(centerPos);
//    vec3 fractal1 = fractal();
//    data = mix(data, fractal1, 1.);
    data = mix(data, col.rgb, col.a);
    data = mix(data, col1.rgb, col1.a);
    data = mix(data, col2.rgb, col2.a);
    data = mix(data, fireBallAlpha.rgb,fireBallAlpha.a);


    gl_FragColor.rgb = data;
}
