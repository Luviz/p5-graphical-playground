precision mediump float;

varying vec2 v_pos;

uniform vec3 u_color_a;
uniform vec3 u_color_b;
uniform vec3 u_color_c;
uniform vec3 u_color_d;

uniform float u_time;
uniform vec2 u_resolution;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = v_pos.xy * 2.0 - 1.0;
  vec2 st = (2. * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec3 color = vec3(0.);

  color = palette(v_pos.x, u_color_a, u_color_b, u_color_c, u_color_d);
  gl_FragColor = vec4(color, 1.);
}