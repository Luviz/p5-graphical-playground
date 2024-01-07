precision highp float;

#define PI 3.14159265359
#define SCALE 2.5
#define SCALE_H SCALE/2.

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_pos;

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
    smoothstep(pct, pct + 0.02, st.y);
}

float inner(float n) {
  return 2. * n - 1.;
}

float sinFunc(float x, float n) {
  return sin(PI * x * inner(n)) / inner(n);
}

void main() {

  vec2 uv = SCALE * gl_FragCoord.xy / u_resolution.xy;

  vec3 col = vec3(0.);

  float sum = 0.;

  for(float i = 1.; i <= 20.; i++) {
    float v = sinFunc(uv.x + u_time, i);
    sum += v;
    col = mix(col, vec3(1.), plot(uv, SCALE_H + v));
    col = mix(col, vec3(i / 21. - 0.2, 1. - i / 21., 0), plot(uv, SCALE_H + sum));
  }

  col = mix(col, vec3(1., 0, 0), plot(uv, SCALE_H + sum));

  gl_FragColor = vec4(col, 1.0);
}
