attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 v_pos;

void main() {
  v_pos = aTexCoord;
  
  gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0);
}
