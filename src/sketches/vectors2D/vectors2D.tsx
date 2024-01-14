import { FC, useEffect, useState } from "react";
import p5Types from "p5";
import { WithP5 } from "@/components/withP5";
import { useSessionStorage } from "@/util/hook";
import styled from "@emotion/styled";

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
  const UNIT = 100;

  const [width, height] = [800, 400];

  p5.setup = () => {
    p5.createCanvas(width, height);
  };

  p5.draw = () => {
    const inter = getInterface();
    const [v1, v2, v3] = [inter.v1, inter.v2, inter.v3].map(getVector2);

    p5.translate(width / 2, height / 2);
    p5.scale(1, -1);
    p5.background(200);

    drawGrid();

    const v12 = v1.copy().sub(v2);
    const [nV1, nV2, nV3] = [v1, v2, v3].map((v) => v.copy().normalize());
    const nV1Sub2 = nV1.copy().sub(nV2).normalize();
    const v1sub2 = v1.copy().sub(v2);
    const reflection = v2.copy().add(nV1);

    // drawVector(v1, [150, 0, 0]);
    drawVector(v2, [0, 100, 0]);
    drawVector(nV1.copy().mult(UNIT), [0, 0, 0, 80]);
    drawVector(v2.copy().sub(nV1.copy().mult(UNIT)), [100, 0, 0, 80]);
    // drawVector(nV2.copy().mult(UNIT), [0, 0, 0, 80]);
    // drawVector(nV1Sub2.copy().mult(UNIT), [0, 0, 0, 80]);
    drawVector(reflection, [100, 0, 200, 80]);

    // drawVector(v1.add(v2), [0, 0, 0]);
    // p5.line(0, 0, inter.v1.x || 0, inter.v1.y || 0);
  };
  const getVector2 = ({ x, y }: Vec2) => {
    return p5.createVector(x, y, 0);
  };
  const drawVector = (
    { x, y }: Vec2 | p5Types.Vector,
    color: number[],
    { x: oX, y: oY }: Vec2 | p5Types.Vector = vec2Zero
  ) => {
    p5.push();
    p5.stroke(color);
    p5.strokeWeight(5);
    p5.line(oX, oY, x, y);
    p5.pop();
  };

  const drawGrid = () => {
    const drawUnitCircle = (weight = 1) => {
      p5.strokeWeight(weight);
      p5.circle(0, 0, UNIT * 2);
    };
    const drawHLines = (y: number, weight = 1) => {
      p5.strokeWeight(weight);
      p5.line(-width, y, width, y);
    };
    const drawVLines = (x: number, weight = 1) => {
      p5.strokeWeight(weight);
      p5.line(x, -height, x, height);
    };

    p5.push();
    p5.noFill();
    p5.stroke([80, 80, 80, 228]);
    for (let y = -height / 2; y < height / 2; y += UNIT) {
      drawHLines(y);
    }
    for (let x = -width / 2; x < width / 2; x += UNIT) {
      drawVLines(x);
    }
    drawUnitCircle();
    drawHLines(0, 3);
    drawVLines(0, 3);
    p5.pop();
  };
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
