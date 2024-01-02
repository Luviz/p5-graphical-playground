precision mediump float;

#define PI 3.14159265359

uniform vec3 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

float sdSphere(vec3 p, float s) {
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

float smin(float a, float b, float pct) {
  float h = max(pct - abs(a - b), 0.) / pct;
  return min(a, b) - h * h * h * pct * (1. / 6.);
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
  float distance_traved = 0.;
  for(float i = 0.; i < 80.; i++) {
    vec3 current_pos = ray_org + ray_dir * distance_traved;
    float dist = map(current_pos);

    distance_traved += dist;

    if(dist < .001)
      break;
    if(distance_traved > 100.)
      break;
  }

  float t = 0.5 + 0.5 * sin(u_time / 1000.);
  col = vec3(distance_traved * 0.13);
  col = smoothstep(vec3(1.), vec3(0), col);
  gl_FragColor = vec4(col, 1.);
}