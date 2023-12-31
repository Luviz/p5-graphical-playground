precision mediump float;

float plot(vec2 st, float pct){
    float offset = 0.02 / 2.; 
  return  smoothstep( pct-offset, pct, st.y) -
          smoothstep( pct, pct+offset, st.y);
}

float smooth_pulse(float edge, float width, float x){
    return smoothstep(edge - width, edge, x) - smoothstep(edge,edge+width, x);
}

float rect(vec2 st, float x, float y, float w, float h, float stork){
    
    float rect = smooth_pulse(x, stork, st.x) + smooth_pulse(x+w, stork, st.x) + 
        smooth_pulse(y, stork, st.y) + smooth_pulse(y+h, stork, st.y);

	return rect;    
}

float circle(vec2 st, float x, float y, float r){
    float c = length(st - vec2(x,y)) * r;
    return smooth_pulse(0.1, 0.01, c);
}

float plot_step(vec2 st, float pct){
  return  step( pct-0.005, st.y) -
          step( pct+0.005, st.y);
}

float circle_two(vec2 st, float x, float y, float r){
    float c = distance(st,vec2(x,y)) ;
    // return step(r, c);
    // return smooth_pulse(r, 0.01, c);
    return 1.-smoothstep(r-(r*0.01), r+(r*0.01), dot(c,c)*4.0);
}
