import { FC } from "react";
import p5Types from "p5";
import { WithP5 } from "../../components/withP5";
import { loadShader } from "../../util/shaders";

const sketch = (p5: p5Types) => {
  const [width, height] = [800, 400];

  let rayMarchingShader: p5Types.Shader;

  p5.preload = () => {
    rayMarchingShader = loadShader(p5, "rayMarching");
  };
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
  };

  p5.draw = () => {
    p5.rect(0, 0, width, height);
    p5.shader(rayMarchingShader);

    let mouseY = p5.map(p5.mouseY, 0, height, height, 0);
    let mouseX = p5.mouseX; p5.mouseIsPressed

    rayMarchingShader.setUniform("u_resolution", [width, height]);
    rayMarchingShader.setUniform("u_time", p5.millis());
    rayMarchingShader.setUniform("u_mouse", [mouseX, mouseY, p5.mouseIsPressed ? 1: 0])
  };
};

export const RayMarching: FC = () => {
  return <WithP5 sketch={sketch} />;
};
