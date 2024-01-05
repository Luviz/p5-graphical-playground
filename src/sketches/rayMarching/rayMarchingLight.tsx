import { FC } from "react";
import p5Types from "p5";
import { WithP5 } from "@/components/withP5";
import {plainText as VERT} from "@/shaders/common.vert"
import {plainText as FRAG} from "@/shaders/rayMarching/rayMarchingLight.frag"

const sketch = (p5: p5Types) => {
  const [width, height] = [800, 400];
  let rayShader: p5Types.Shader;

  p5.preload = () => {
    rayShader = p5.createShader(VERT, FRAG);
  };

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);
  };

  p5.draw = () => {
    p5.rect(0,0,width, height);
    p5.shader(rayShader);
    rayShader.setUniform("u_resolution", [width, height]);
    rayShader.setUniform("u_time", p5.millis());
  }
};

export const RayMarchingLight: FC = () => {
  return <WithP5 sketch={sketch} />;
};
