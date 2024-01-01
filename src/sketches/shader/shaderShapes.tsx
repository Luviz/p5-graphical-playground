import { FC } from "react";
import p5Types from "p5";
import { WithP5 } from "../../components/withP5";
import { loadShader } from "../../util/shaders";

const sketch = (p5: p5Types) => {
  const [width, height] = [800, 800];
  const gridDivider = 4;
  const [gW, gH] = [width / gridDivider, height / gridDivider];

  const shaderMap = {
    circle: "shaderTestCircle",
    rect: "shaderTestRectangle",
    cross: "shaderTestCross",
    boolean: "shaderTestBoolean",
    circleFour: "shaderTestCircle",
    circleFive: "shaderTestCircle",
  } as const;

  type ShaderKeys = keyof typeof shaderMap;
  type ShaderRecord<T> = Partial<Record<ShaderKeys, T>>;

  const shapeShaders: ShaderRecord<p5Types.Shader> = {};
  const shapeCanvas: ShaderRecord<p5Types.Graphics> = {};

  p5.preload = () => {
    Object.entries(shaderMap).forEach(
      ([k, v]) => (shapeShaders[k as ShaderKeys] = loadShader(p5, v))
    );
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    Object.keys(shapeShaders).forEach(
      (k) =>
        (shapeCanvas[k as ShaderKeys] = p5.createGraphics(gW, gH, p5.WEBGL))
    );

    // set shaders for each graphics
    Object.keys(shapeCanvas).forEach((k) => {
      const key = k as ShaderKeys;
      const shader = shapeShaders[key];
      if (shader) {
        shapeCanvas[key]?.shader(shader);
      }
    });
  };

  // filter
  p5.draw = () => {
    p5.rect(0, 0, width, height);
    // render graphics on screen
    Object.values(shapeShaders).forEach((k) =>
      k.setUniform("u_time", p5.millis())
    );

    Object.keys(shapeCanvas).forEach((k, ix) => {
      const cnv = shapeCanvas[k as ShaderKeys];
      if (cnv) {
        cnv.rect(0, 0, 10, 10);
        p5.image(cnv, (ix * gW) % width, Math.trunc(ix / gridDivider) * gH);
      }
    });
  };
};

export const Shapes: FC = () => {
  return <WithP5 sketch={sketch} />;
};
