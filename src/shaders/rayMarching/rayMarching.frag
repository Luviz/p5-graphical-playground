precision highp float;

#define PI 3.14159265359

uniform vec3 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform mat4 u_color_sets;
uniform sampler2D u_some;

vec3 color_palette(float t) {
  vec3 color_a = u_color_sets[0].rgb;
  vec3 color_b = u_color_sets[1].rgb;
  vec3 color_c = u_color_sets[2].rgb;
  vec3 color_d = u_color_sets[3].rgb;

  return color_a + color_b * cos(6.28318 * (color_c * t + color_d));
}

float mapRange(float value, vec2 inRange, vec2 outRange) {
  float t = (value - inRange.x) / (inRange.y - inRange.x);
  return outRange.x + t * (outRange.y - outRange.x);
}

float sdSphere(vec3 p, float s) {
  texture2D(u_some, vec2(0, 1));
  return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}

mat2 rotate_2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.) / k;
  return min(a, b) - h * h * h * k * (1. / 6.);
}

float get_box(in vec3 p) {
  vec3 q = p;
  float sec = u_time / 1000.;

  q.xz *= rotate_2d(sec);
  q.xy *= rotate_2d(sec);
  return sdBox(q, vec3(.75));
}

float get_fracts(in vec3 p) {
  vec3 q = p;
  float sec = u_time / 1000.;

  q.y -= sec * .2;
  q.z -= sec * -.1;

  q = fract(q) - 0.5;
  q.xy *= rotate_2d(sec);

  float o = sdOctahedron(q, 0.1);
  return o;
}

float map(vec3 p) {
  float sec = u_time / 1000.;
  float t = 0.5 + 0.5 * sin(sec);

  float sphere = sdSphere(p - vec3(4. * sin(sec), 0., 0.), 1.); // distance to a sphere of radius 1

  float box = get_box(p);

  float fract = get_fracts(p);

  float ground = p.y + 1.20;
  float bf = smin(box, fract, 1.);
  float fc = smin(fract, sphere, 1.);
  float bc = smin(box, sphere, 2.);

  float value = min(bf, bc);
  value = min(fc, value);
  value = smin(value, ground, 0.5);
  value = smin(value, sphere, .2);
  return value;
}

void main() {
  vec2 st = (2. * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec2 mouse = (2.0 * u_mouse.xy - u_resolution.xy) / u_resolution.y;

  vec3 ray_org = vec3(0., 0., -3.);
  vec3 ray_dir = normalize(vec3(st, 1.));

  vec3 col = vec3(st, 0.);

  if(u_mouse.z == 1.) {
    ray_org.yz *= rotate_2d(-mouse.y);
    ray_dir.yz *= rotate_2d(-mouse.y);

    ray_org.xz *= rotate_2d(-mouse.x);
    ray_dir.xz *= rotate_2d(-mouse.x);
  }

  // Raymarching
  const float max_iter = 100.;
  const float max_dist = 100.;
  float distance_traved = 0.;
  for(float i = 0.; i < max_iter; i++) {
    vec3 current_pos = ray_org + ray_dir * distance_traved;
    float dist = map(current_pos);

    distance_traved += dist;
    // col = vec3(i / 100.);

    if(dist < .001)
      break;
    if(distance_traved > max_dist)
      break;
  }

  // float norm_distance_traved = mapRange(distance_traved, vec2(0., 100.), vec2(0., .002));
  float sec = u_time / 1000.;
  float t = 0.05 * sin(sec);
  float m = .1 - t;
  // m -= t;
  col = vec3(distance_traved * m);
  col = smoothstep(vec3(1.), vec3(0), col);
  col *= color_palette(distance_traved + u_time / 5000.);
  gl_FragColor = vec4(col, 1.);
}