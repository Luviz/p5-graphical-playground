import { FC, useEffect, useState } from "react";
import p5Types from "p5";
import { WithP5 } from "@/components/withP5";
import { useSessionStorage } from "@/util/hook";
import styled from "@emotion/styled";
import * as mathjs from "mathjs";

const vec2Zero: Vec2 = { x: 0, y: 0 };
const interfaceZero: Interface = {
  v1: vec2Zero,
  v2: vec2Zero,
  v3: vec2Zero,
};

type Interface = {
  v1: Vec2;
  v2: Vec2;
  v3: Vec2;
};

type Vec2 = {
  x: number;
  y: number;
};

type p5Color = number[];

const getInterface = (): Interface => {
  const v = sessionStorage.getItem("interface");
  return v ? (JSON.parse(v) as Interface) : interfaceZero;
};

const sketch = (p5: p5Types) => {
  const UNIT = 1;

  const [width, height] = [800, 400];

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    const inter = getInterface();

    const sec = p5.millis() / 1_000;

    const [[m1, nm1], [m2, nm2], [m3, nm3]] = [
      inter.v1,
      inter.v2,
      inter.v3,
    ].map(({ x, y }) => [
      mathjs.matrix([x, y]),
      mathjsNormalize(mathjs.matrix([x, y])),
    ]);

    const rotTime = rot2d(sec);
    const m1Rot = mathjs.multiply(m1, rotTime);

    setScene();
    drawGrid();

    drawVectorMat(m1, [200, 0, 0]);
    drawVectorMat(m2, [0, 100, 0]);
    drawVectorMat(nm1, [0, 0, 0, 128]);
    drawVectorMat(nm2, [0, 0, 0, 128]);

    drawVectorMat(mathjs.add(m1, m2), [0, 100, 0]);
    drawVectorMat(mathjs.add(m2, m1), [100, 100, 100], { x: 1, y: 1 });

    drawVectorMat(m1Rot, [100, 100, 100]);
    drawVectorMat(mathjs.add(m1Rot, m1), [200, 200, 200]);
  };
  const getVector2 = ({ x, y }: Vec2) => {
    return p5.createVector(x, y);
  };
  const matrixToP5Vector = (mat: mathjs.Matrix) => {
    const isVec = mat.size().length == 1;
    let v = isVec ? mat.toArray() : mat.toArray()[0];
    const [x, y, z] = v as number[];

    return p5.createVector(x, y, z);
  };

  const mathjsNormalize = (mat: mathjs.Matrix) => {
    return mathjs.divide(mat, mathjs.norm(mat)) as mathjs.Matrix;
  };

  const p5VectorToMatrix = ({ x, y, z }: p5Types.Vector) => {
    return mathjs.matrix([x, y, z]);
  };

  const drawVectorMat = (
    mat: mathjs.Matrix,
    color: number[],
    org: Vec2 | p5Types.Vector = vec2Zero
  ) => {
    return drawVector(matrixToP5Vector(mat), color, org);
  };

  const drawVector = (
    { x, y }: Vec2 | p5Types.Vector,
    color: number[],
    { x: oX, y: oY }: Vec2 | p5Types.Vector = vec2Zero
  ) => {
    p5.push();
    p5.stroke(color);
    p5.fill(color);
    p5.strokeWeight(0.1);
    p5.line(oX, oY, x, y);

    p5.pop();
  };

  const drawGrid = () => {
    const drawUnitCircle = (weight = 0.01) => {
      p5.strokeWeight(weight);
      p5.circle(0, 0, 2);
    };
    const drawHLines = (y: number, weight = 0.01) => {
      p5.strokeWeight(weight);
      p5.line(-width, y, width, y);
    };
    const drawVLines = (x: number, weight = 0.01) => {
      p5.strokeWeight(weight);
      p5.line(x, -height, x, height);
    };

    p5.push();
    p5.noFill();
    p5.stroke([80, 80, 80, 228]);
    for (let y = -height / 2; y < height / 2; y += 1) {
      drawHLines(y);
    }
    for (let x = -width / 2; x < width / 2; x += 1) {
      drawVLines(x);
    }
    drawUnitCircle();
    drawHLines(0, 0.03);
    drawVLines(0, 0.03);
    p5.pop();
  };

  const setScene = () => {
    p5.translate(width / 2, height / 1.5);
    let scaleFactor = p5.min(width / 7, height / 7);
    p5.scale(scaleFactor, -scaleFactor);
    p5.background(250);
  };
};

const print = (val: any) => console.log(mathjs.format(val, 2));
const rot2d = (angle: number) => {
  const [s, c] = [mathjs.sin(angle), mathjs.cos(angle)];
  return mathjs.matrix([
    [c, -s],
    [s, c],
  ]);
};
export const Vectors2D: FC = () => {
  return (
    <div>
      <WithP5 sketch={sketch} />
      <Controller />
    </div>
  );
};

const Controller: FC = () => {
  const [int, setInt] = useSessionStorage<Interface>("interface", {
    v1: vec2Zero,
    v2: vec2Zero,
    v3: vec2Zero,
  });

  const handelInput = (v: Vec2, key: keyof Interface) => {
    setInt((pv) => ({ ...pv, [key]: v }));
  };

  return (
    <ControllerContainer>
      <Vec2Input
        label="v1"
        initialValue={int.v1}
        onChange={(nv) => handelInput(nv, "v1")}
      />
      <Vec2Input
        label="v2"
        initialValue={int.v2}
        onChange={(nv) => handelInput(nv, "v2")}
      />
      {/* <Vec2Input
        label="v3"
        initialValue={int.v3}
        onChange={(nv) => handelInput(nv, "v3")}
      /> */}
    </ControllerContainer>
  );
};

type Vec2InputProps = {
  label: string;
  onChange?: (v: Vec2) => void;
  initialValue?: Vec2;
};

const Vec2Input: FC<Vec2InputProps> = ({ onChange, label, initialValue }) => {
  const [x, setX] = useState(initialValue?.x || 0);
  const [y, setY] = useState(initialValue?.y || 0);

  useEffect(() => onChange && onChange({ x, y }), [x, y]);

  return (
    <FlexContainer>
      <label>{label}:</label>
      <input
        type="number"
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
      />
      <input
        type="number"
        value={y}
        onChange={(e) => setY(Number(e.target.value))}
      />
    </FlexContainer>
  );
};

const ControllerContainer = styled.main`
  margin: auto;
`;

const FlexContainer = styled.section`
  margin: 1rem 2rem;
  display: flex;
  gap: 1rem;
`;
