import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import p5Types from "p5";
import { WithP5 } from "@/components/withP5";
import { plainText as VERT } from "@/shaders/common.vert";
import { plainText as FRAG } from "./colorPalette.frag";
import { json, normalizeHash } from "@remix-run/router/dist/utils";
import { useLocalStorage } from "@/util/hook";

const getValueFromElement = (id: string) => {
  const elem = document.getElementById(id);
  if (!elem) return 0;
  if (!("value" in elem)) return 0;
  const { value } = elem;
  if (Number.isNaN(Number(value))) return 0;
  return Number(value);
};

const getSliderValues = (groupName: string): ColorSet => {
  return {
    red: getValueFromElement(`${groupName}_red`),
    green: getValueFromElement(`${groupName}_green`),
    blue: getValueFromElement(`${groupName}_blue`),
  };
};

const normalizeColor = (values: ColorSet | Number[]): number[] => {
  const flattenColorSet = (set: ColorSet): Number[] => {
    return [set.red, set.green, set.blue];
  };
  const normalizeColor = (values: Number[]): number[] => {
    return values.map((v) => Number((Number(v) / 255).toPrecision(2)));
  };
  const color = "red" in values ? flattenColorSet(values) : values;
  return normalizeColor(color);
};

const sketch = (p5: p5Types) => {
  const [width, height] = [800, 400];
  let shader: p5Types.Shader;
  let shaderLayer: p5Types.Graphics;
  p5.preload = () => {
    shader = p5.createShader(VERT, FRAG);
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    shaderLayer = p5.createGraphics(width, height, p5.WEBGL);
    const a = getSliderValues("a");
    console.log(a);
  };

  p5.draw = () => {
    // p5.background(0);
    const a = getSliderValues("a");
    const b = getSliderValues("b");
    const c = getSliderValues("c");
    const d = getSliderValues("d");

    p5.fill(a.red, a.green, a.blue);
    p5.rect(0, 0, width, 40);
    p5.fill(b.red, b.green, b.blue);
    p5.rect(0, 50, width, 40);
    p5.fill(c.red, c.green, c.blue);
    p5.rect(0, 100, width, 40);
    p5.fill(d.red, d.green, d.blue);
    p5.rect(0, 150, width, 40);

    shaderLayer.shader(shader);
    shader.setUniform("u_time", p5.millis());
    shader.setUniform("u_resolution", [width, height]);
    Object.entries({ a, b, c, d }).forEach(([k, v]) => {
      const key = `u_color_${k.toLowerCase()}`;
      shader.setUniform(key, normalizeColor(v));
    });
    shaderLayer.rect(0, 0, width, height);
    p5.image(shaderLayer, 0, 200, width, 180);
  };
};

export const ColorPalettes: FC = () => {
  return (
    <div>
      <WithP5 sketch={(p) => sketch(p)} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {["A", "B", "C", "D"].map((value) => (
          <div key={value}>
            <label>{value}</label>
            <GRBGroup id={value.toLowerCase()} />
          </div>
        ))}
      </div>
      <input
        type="button"
        value="Reset"
        onClick={() => {
          Object.keys(window.localStorage)
            .filter((k) => k.startsWith("slider"))
            .forEach((k) => window.localStorage.setItem(k, "128"));
          window.location.reload();
        }}
      />
      <hr />
      <CodeSection />
    </div>
  );
};

type SliderProp = {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
};
const Slider: FC<SliderProp> = (props) => {
  const [v, setV] = useLocalStorage(
    props.defaultValue || 128,
    `slider_${props.id}`
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label
        htmlFor={props.name}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div>{v}</div>
        <div>{props.label}</div>
        <div>{(v / props.max).toPrecision(2)}</div>
      </label>
      <input
        type="range"
        {...props}
        value={v}
        onChange={(e) => {
          setV(Number(e.target.value));
        }}
      />
    </div>
  );
};

type ColorSet = {
  red: number;
  green: number;
  blue: number;
};

type GRBGroupProp = {
  id: string;
};

const GRBGroup: FC<GRBGroupProp> = ({ id }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      {["Red", "Green", "Blue"].map((v) => (
        <Slider
          id={`${id}_${v.toLowerCase()}`}
          key={v}
          label={v}
          name={v.toLowerCase()}
          min={0}
          max={255}
        />
      ))}
    </div>
  );
};

const CodeSection: FC = () => {
  const [update, setUpdate] = useState(false);
  const color = useMemo(
    () =>
      Object.values("abcd")
        .map(getSliderValues)
        .map(normalizeColor)
        .map((v) => v.map((f) => f.toPrecision(2))),
    [update]
  );
  useEffect(() => {
    const id = setInterval(() => {
      setUpdate((u) => !u);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign: "left" }}>
      <pre>
        // GLSL <br />
        vec3 a_color = vec3({color[0][0]}, {color[0][1]}, {color[0][2]});
        <br />
        vec3 b_color = vec3({color[1][0]}, {color[1][1]}, {color[1][2]});
        <br />
        vec3 c_color = vec3({color[2][0]}, {color[2][1]}, {color[2][2]});
        <br />
        vec3 d_color = vec3({color[3][0]}, {color[3][1]}, {color[3][2]});
        <br />
      </pre>
    </div>
  );
};
