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

float smoothstep_clamp(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

float zoom() {
    float x = u_time / 5000.0;
    float v = 1.2 * cos(x) + 1.0;

    float smooth_clamped_v = smoothstep_clamp(0.001, 2.0, v);
    
    return mix(0.001, 2.0, smooth_clamped_v);
}

void main() {
  vec2 uv = v_pos.xy * 2.0 - 1.0;
  vec2 q = uv * zoom();

  q.x -= 0.74;
  q.y += .14;

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

  gl_FragColor = vec4(color, 1.);
}