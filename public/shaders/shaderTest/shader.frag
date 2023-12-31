precision mediump float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_pos;

vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
    smoothstep(pct, pct + 0.02, st.y);
}

vec4 getPlot1() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  float y = st.x;
  vec3 color = vec3(st.x);
  float pct = plot(gl_FragCoord.xy / u_resolution, y);
  color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);
  return vec4(color, 1.);
}

vec4 getPlot2() {
  // vec2 st = gl_FragCoord.xy / u_resolution;
  vec2 st = v_pos; // / u_resolution;

  float y = pow(st.x, 5.0);

  vec3 color = vec3(y);

  float pct = plot(st, y);
  color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);
  return vec4(color, 1.);
}

vec4 getPlot3() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  float x = st.x;
  float y = sin(x * PI * 4.);
  
  vec3 color = vec3(y);

  float pct = plot(st, y);
  color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);
  return vec4(color, 1.);
}

vec4 getHSBinPoloar(vec2 st) {
  vec2 toCenter = 0.5 - st;
  float angle = atan(toCenter.y, toCenter.x );
  float radius = length(toCenter) * 2.0;

  vec3 polarHSB = vec3((angle / TWO_PI) + (u_time / 3000.), radius, 1.0);

  return vec4(hsb2rgb(polarHSB), 1.);
}

void main() {
  vec2 st = v_pos; // u_resolution;
  vec3 c = vec3(st.x, 1.0, st.y);
  vec3 rgb = hsb2rgb(c);
  gl_FragColor = getHSBinPoloar(st);

  
  // gl_FragColor = getPlot3();
}