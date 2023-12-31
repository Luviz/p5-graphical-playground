precision lowp float;

uniform float u_time;
// uniform float u_time;
vec4 red() {
  return vec4(1., 0., 0., 1.);
}
vec4 green() {
  return vec4(0., 1.0, 0.0, 1.0);
}

vec4 blue() {
  return vec4(0., 0., 1., 1.);
}

void main() {
  vec3 color = vec3(1.,0.,0.);
  vec4 myColor = vec4(color, abs(sin(u_time / 1000.)));
  gl_FragColor = myColor;
}