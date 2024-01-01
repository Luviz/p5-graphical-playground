precision mediump float;

uniform float u_time;
varying vec2 v_pos;

float rect(vec2 st, vec2 dim) {
  vec2 diff = abs(st) - dim;
  return length(max(diff, 0.)) + min(max(diff.x, diff.y), 0.0);
}

float plot(float d) {
  return 1.0 - smoothstep(0.0, 0.01, abs(d));
}


float opXor( float a, float b )
{
    return max( min(a,b), -max(a,b) );
}

void main() {
  vec2 st = 0.5 - v_pos;
  float t = 0.5 * sin(u_time / 1000.) + 0.5;
  vec2 rect1 = vec2(.4, .1);
  float d1 = rect(st, rect1);
  float d2 = rect(st, rect1.yx);
  float d = opXor(d2, d1);
  vec3 innerColor = vec3(.5, 0., 0.);
  vec3 outerColor = vec3(0.8);
  float plot = plot(d);
  vec3 col = mix(outerColor, innerColor, step(d, 0.));
  col *= 0.8 + 0.2 * cos(150.0 * d + u_time / 200.);
  col = mix(col, vec3(1.0), plot);

  gl_FragColor = vec4(col, 1.);
}
