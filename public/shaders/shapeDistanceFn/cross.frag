precision mediump float;

uniform float u_time;
varying vec2 v_pos;

float cross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}

float plot(float d) {
  return 1.0 - smoothstep(0.0, 0.01, abs(d));
}


void main() {
  vec2 st = 0.5 - v_pos;
  float t = 0.5*sin(u_time / 1000.) + 0.5 ;
  float d = cross(st, vec2(.4, .1), .0);
  vec3 innerColor = vec3(.5, 0., 0.);
  vec3 outerColor = vec3(0.8);
  float plot = plot(d);
  vec3 col = mix(outerColor, innerColor, step(d, 0.));
  col *= 0.8 + 0.2 * cos(150.0 * d + u_time / 200.);
  col = mix(col, vec3(1.0), plot);

  gl_FragColor = vec4(col, 1.);
}
