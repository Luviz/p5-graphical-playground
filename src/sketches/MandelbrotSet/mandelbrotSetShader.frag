precision highp float;

#define PI 3.14159265359
#define ITER_MAX 1000.

varying vec2 v_pos;
uniform vec2 u_resolution;
uniform float u_time;

vec3 color_palette(float t) {
  vec3 color_a = vec3(0.5, 0.5, 0.5);
  vec3 color_b = vec3(0.5, 0.5, 0.5);
  vec3 color_c = vec3(1.0, 1.0, 1.0);
  vec3 color_d = vec3(0.0, 0.333, 0.667);

  return color_a + color_b * cos(6.28318 * (color_c * t + color_d));
}

float plot(float d) {
  return 1.0 - smoothstep(0.0, 0.01, abs(d));
}

mat2 rotate_2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float zoom() {
  float x = u_time / 5000.;
  // x = PI * 1.;
  float v =  0.745 * cos(x) + 0.755;
  return v;
}



void main() {
  vec2 uv = v_pos.xy * 2.0 - 1.0;
  vec2 q = uv * zoom();
  // vec2 st = (zoom() * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  // st += 0.15;
  // st.x -= 0.29; // * sin(u_time / 10000.);
  // st.y += 0.57; // * cos(u_time / 10000.);
  q.x -= 0.74;
  q.y += .14;
  // st *= rotate_2d(u_time / 7000.);
  vec3 color = vec3(.0);
  float _realComp = q.x;
  float _imagComp = q.y;
  float currentRealComp = _realComp;
  float currentImagComp = _imagComp;
  for(float iter = 0.; iter < ITER_MAX; iter++) {
    float rc = _realComp * _realComp - _imagComp * _imagComp;
    float ic = 2. * _realComp * _imagComp;
    _realComp = rc + currentRealComp;
    _imagComp = ic + currentImagComp;
    if(rc > 100.) {
      color = color_palette(iter / 50.);
      break;
    }
  }
  // color = mix(color, vec3(1.), plot(.05 - length(uv)));
  gl_FragColor = vec4(color, 1.);
}