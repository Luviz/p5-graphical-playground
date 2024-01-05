precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

#define MAX_ITER 100
#define MAX_DIST 100.

mat2 rotate_2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float mapSphere(vec3 p) {
  vec3 q = p;
  q.x -= 3.0;
  q.y -= 1.0;
  return sdSphere(q, 1.);
}

float mapBox(vec3 p) {
  float sec = u_time / 1000.;

  vec3 q = p;
  q.x += 2.0;
  q.y -= .5;
  q.yz *= rotate_2d(sec);
  q.xy *= rotate_2d(sec);
  return sdBox(q, vec3(1.));
}

float mapGround(vec3 p) {
  float g = p.y;
  g += 3.5;
  return g;
}


float map(vec3 p) {
  float d = min(mapBox(p), mapSphere(p));
  float g = mapGround(p);

  d = min(d, g);
  return d;
}

float rayCast(vec3 ray_org, vec3 ray_dir) {
  float distance_traved = 0.;
  for(int i = 0; i < MAX_ITER; i++) {
    vec3 current_pos = ray_org + ray_dir * distance_traved;
    float dist = map(current_pos);

    distance_traved += dist;

    if(dist < .001 || distance_traved > MAX_DIST)
      break;
  }

  return distance_traved;
}

vec3 getNormal(vec3 p) {
  float d = map(p);
  vec2 e = vec2(.01, 0);

  vec3 n = d - vec3(map(p - e.xyy), map(p - e.yxy), map(p - e.yyx));

  return normalize(n);
}

float getLight(vec3 p) {
  float sec = u_time / 1000.;
  vec3 lightPos = vec3(0., .8, -4.0);
  lightPos.x += 3. * sin(sec);

  vec3 light = normalize(lightPos - p);
  vec3 normals = getNormal(p);

  float dirLight = dot(normals, light);
  float dif = clamp(dirLight, 0., 1.);
  float distLight = rayCast(p + normals, light);

  // if(d<length(lightPos-p)) dif *= .1;
  if(distLight < length(lightPos - p))
    dif *= 0.1;

  return dif;
}

void main() {
  vec2 st = (2. * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;

  vec3 color = vec3(0.);

  vec3 ray_org = vec3(0., 0., -4.);
  vec3 ray_dir = normalize(vec3(st, 1.));

  float dist = rayCast(ray_org, ray_dir);
  vec3 point = ray_org + ray_dir * dist;

  float dif = getLight(point);
  color = vec3(dif);

  gl_FragColor = vec4(color, 1.);
}