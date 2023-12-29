import { FC, useEffect, useRef } from "react";
import p5Types from "p5";
import p5 from "p5";

const SHADER_PATH = "/shaders/shaderTest";
function sketch(p5: p5Types) {
  let myShader: p5Types.Shader;
  p5.preload = () => {
    myShader = p5.loadShader(
      `${SHADER_PATH}/shader.vert`,
      `${SHADER_PATH}/shader.frag`
    );
  };

  p5.setup = () => {
    p5.createCanvas(400, 400, p5.WEBGL);
    p5.background(0);
  };

  p5.draw = () => {
    p5.shader(myShader);

    const time = Math.abs(p5.map(p5.millis() % 5_000, 0, 5_000, -1, 1));
    myShader.setUniform("time", time);
    p5.rect(0, 0, 5, 5);
  };
}

export const ShaderTest: FC = () => {
  const p5ContainerRef = useRef<any>();

  useEffect(() => {
    const p5Instance = new p5(sketch, p5ContainerRef.current);
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={p5ContainerRef} />;
};
