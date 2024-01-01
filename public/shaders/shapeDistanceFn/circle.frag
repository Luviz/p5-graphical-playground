precision mediump float;

uniform float u_time;
varying vec2 v_pos;

float cricle(vec2 st, float r) {
  return length(st) - r;
}

float plot(float d) {
  return 1.0 - smoothstep(0.0, 0.01, abs(d));
}

void main() {
  vec2 st = 0.5 - v_pos;
  float d = cricle(st, 0.25);

  vec3 innerColor = vec3(.5, 0.,0.);
  vec3 outerColor = vec3(0.8);
  float plot = plot(d);

  vec3 col = mix(outerColor, innerColor, step(d, 0.));
  col *= 0.8 + 0.2*cos(150.0*d);
  col = mix(col, vec3(1.0), plot);

  gl_FragColor = vec4(col, 1.);
}
