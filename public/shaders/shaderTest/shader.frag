precision mediump float;

uniform float time;
varying vec2 vTexCoord;


void main() {
  vec2 uv = vTexCoord;
  vec4 myColor = vec4(1.0, 0.2, 1.0, 1);
  vec4 pColor = vec4(uv, time, 1.0);
  gl_FragColor = pColor;
}