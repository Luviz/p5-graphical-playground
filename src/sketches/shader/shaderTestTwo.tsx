import { FC } from "react";
import p5Types from "p5";
import { WithP5 } from "../../components/withP5";
import { Walker } from "../lib";

const sketch = (p5: p5Types) => {
  const SHADER_PATH = "/shaders/shaderTest";
  const SHADER_2_PATH = "/shaders/shaderTest2";
  const [width, height] = [800, 400];
  const w = new Walker(p5, p5.createVector(width / 2, height / 2), 50);
  let shaderTest: p5Types.Shader;
  let shaderTestTwo: p5Types.Shader;
  let layerOne: p5Types.Graphics;
  let baseLayer: p5Types.Graphics;

  p5.preload = () => {
    shaderTest = p5.loadShader(
      `${SHADER_PATH}/shader.vert`,
      `${SHADER_PATH}/shader.frag`
    );
    shaderTestTwo = p5.loadShader(
      `${SHADER_2_PATH}/shader.vert`,
      `${SHADER_2_PATH}/shader.frag`
    );
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    baseLayer = p5.createGraphics(width, height, p5.WEBGL);
    
    layerOne = p5.createGraphics(width, height, p5.WEBGL);
    layerOne.shader(shaderTest);
  };

  p5.draw = () => {
    baseLayer.background(250);
    const uTime = p5.millis();
    const mousePos = [
      p5.map(p5.mouseX, 0, width, 0, 1),
      p5.map(p5.mouseY, 0, height, 1, 0),
    ];

    layerOne.rect(0, 0, 0, 0);

    shaderTest.setUniform("u_time", uTime);
    shaderTest.setUniform("u_resolution", [width, height]);
    shaderTest.setUniform("u_mouse", mousePos);

    baseLayer.texture(layerOne);
    baseLayer.ellipse(0, 0, 200, 200, 150);

    shaderTestTwo.setUniform("u_time", uTime);

    p5.image(baseLayer, 0, 0);
  };
};

export const ShaderTestTwo: FC = () => {
  return <WithP5 sketch={sketch} />;
};
