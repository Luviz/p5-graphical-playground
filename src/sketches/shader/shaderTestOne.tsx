import { FC, useEffect, useRef } from "react";
import p5Types from "p5";
import p5 from "p5";
import { WithP5 } from "../../components/withP5";
import { loadShader } from "../../util/shaders";

const sketch = (p5: p5Types) => {
  const [width, height] = [800, 600];
  let myShader: p5Types.Shader;
  p5.preload = () => {
    myShader = loadShader(p5, 'shaderTest');
  };

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
    p5.background(0); // polar 
  };

  p5.draw = () => {
    p5.shader(myShader);
    const mousePos = [
      p5.map(p5.mouseX, 0, width, 0, 1),
      p5.map(p5.mouseY, 0, height, 1, 0),
    ];
    const time = Math.abs(p5.map(p5.millis() % 5_000, 0, 5_000, -1, 1));
    myShader.setUniform("time", time);
    myShader.setUniform("u_time", p5.millis());
    myShader.setUniform("u_resolution", [width, height]);
    myShader.setUniform("u_mouse", mousePos);
    p5.rect(0, 0, 5, 5);
  };
}

export const ShaderTest: FC = () => {
  return <WithP5 sketch={sketch}/>;
};
