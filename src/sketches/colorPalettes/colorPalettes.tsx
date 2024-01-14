import { WithP5 } from "@/components/withP5";
import { plainText as VERT } from "@/shaders/common.vert";
import { useLocalStorage } from "@/util/hook";
import p5Types from "p5";
import { FC, useEffect, useState } from "react";
import { plainText as FRAG } from "./colorPalette.frag";

const getColors = (): CosineGradientParma => {
  const v = localStorage.getItem("colors");
  return v ? (JSON.parse(v) as CosineGradientParma) : cgZero;
};

const normalizeColor = (values: ColorSet | Number[]): number[] => {
  const flattenColorSet = (set: ColorSet): Number[] => {
    return [set.r, set.g, set.b];
  };
  const normalizeColor = (values: Number[]): number[] => {
    return values.map((v) => Number((Number(v) / 255).toPrecision(2)));
  };
  const color = "r" in values ? flattenColorSet(values) : values;
  return normalizeColor(color);
};

const sketch = (p5: p5Types) => {
  const [width, height] = [850, 250];
  let shader: p5Types.Shader;
  let shaderLayer: p5Types.Graphics;
  p5.preload = () => {
    shader = p5.createShader(VERT, FRAG);
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    shaderLayer = p5.createGraphics(width, height, p5.WEBGL);
  };

  p5.draw = () => {
    const colors = getColors();
    const wColorBox = (width - 30) / 4;

    Object.values(colors).forEach(({ r, g, b }, i) => {
      p5.fill(r, g, b);
      p5.rect(i * 10 + wColorBox * i, 190, wColorBox, 40);
    });

    shaderLayer.shader(shader);
    shader.setUniform("u_time", p5.millis());
    shader.setUniform("u_resolution", [width, height]);
    Object.entries(colors).forEach(([k, v]) => {
      const key = `u_color_${k.toLowerCase()}`;
      shader.setUniform(key, normalizeColor(v));
    });
    shaderLayer.rect(0, 0, width, height);
    p5.image(shaderLayer, 0, 0, width, 180);
  };
};

export const ColorPalettes: FC = () => {
  return (
    <div>
      <WithP5 sketch={(p) => sketch(p)} />
      <div style={{ maxWidth: "850px", margin: "auto" }}>
        <Controller />
      </div>
    </div>
  );
};

type ColorSet = {
  r: number;
  g: number;
  b: number;
};

type CosineGradientParma = {
  a: ColorSet;
  b: ColorSet;
  c: ColorSet;
  d: ColorSet;
};

const cgZero: CosineGradientParma = {
  a: { r: 0, g: 0, b: 0 },
  b: { r: 0, g: 0, b: 0 },
  c: { r: 0, g: 0, b: 0 },
  d: { r: 0, g: 0, b: 0 },
};

const cgHalf: CosineGradientParma = {
  a: { r: 128, g: 128, b: 128 },
  b: { r: 128, g: 128, b: 128 },
  c: { r: 128, g: 128, b: 128 },
  d: { r: 128, g: 128, b: 128 },
};

const cgFull: CosineGradientParma = {
  a: { r: 255, g: 255, b: 255 },
  b: { r: 255, g: 255, b: 255 },
  c: { r: 255, g: 255, b: 255 },
  d: { r: 255, g: 255, b: 255 },
}

const Controller: FC<{}> = () => {
  const [sliderKey, setSliderKey] = useState(0);
  const [colors, setColors] = useLocalStorage<CosineGradientParma>(
    "colors",
    cgHalf
  );

  return (
    <>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <label>{key.toUpperCase()}</label>
              <GRBGroup
                key={sliderKey.toString()}
                id={key.toLowerCase()}
                initialValue={value}
                onChange={(nv) => setColors((pv) => ({ ...pv, [key]: nv }))}
              />
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
            setColors(cgHalf);
            setSliderKey((pv) => (pv ^= 1));
          }}
        />
      </div>
      <hr />
      <CodeSection colors={colors} />
    </>
  );
};

type GRBGroupProp = {
  id: string;
  onChange?: (nv: ColorSet) => void;
  initialValue?: ColorSet;
};

const GRBGroup: FC<GRBGroupProp> = ({ id, onChange, initialValue }) => {
  const [rgb, setRGB] = useState<ColorSet>(
    initialValue || { r: 0, g: 0, b: 0 }
  );
  useEffect(() => onChange && onChange(rgb), [rgb]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
      {Object.entries(rgb).map(([key, value]) => (
        <Slider
          id={`${id}_${key.toLowerCase()}`}
          key={key}
          label={key}
          name={key.toLowerCase()}
          min={0}
          max={255}
          onChange={(nv) => setRGB((pv) => ({ ...pv, [key]: nv }))}
          initialValue={value}
        />
      ))}
    </div>
  );
};

type SliderProp = {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  initialValue?: number;
  onChange?: (nv: number) => void;
};
const Slider: FC<SliderProp> = ({ onChange, initialValue, ...props }) => {
  const [v, setV] = useState(initialValue || 0);

  useEffect(() => {
    onChange && onChange(v);
  }, [v]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label
        htmlFor={props.name}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div>{v}</div>
        <div>{props.label}</div>
        <div>{(v / props.max).toFixed(2)}</div>
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


const CodeSection: FC<{
  colors: CosineGradientParma;
}> = ({ colors }) => {
  const nColors: CosineGradientParma = Object.entries(colors).reduce(
    (o, [k, v]) => {
      const [r, g, b] = normalizeColor(v).map((v) => v.toFixed(2));
      return { ...o, [k]: { r, g, b } };
    },
    colors
  );
  const matrix = Object.values(colors).map(normalizeColor);
  return (
    <div style={{ textAlign: "left" }}>
      <pre>
        {JSON.stringify(matrix[0])}
        <br />
        {JSON.stringify(matrix[1])}
        <br />
        {JSON.stringify(matrix[2])}
        <br />
        {JSON.stringify(matrix[3])}
        <br />
      </pre>
      <pre>
        // GLSL <br />
        vec3 a_color = vec3({nColors.a.r}, {nColors.a.g}, {nColors.a.b});
        <br />
        vec3 b_color = vec3({nColors.b.r}, {nColors.b.g}, {nColors.b.b});
        <br />
        vec3 c_color = vec3({nColors.c.r}, {nColors.c.g}, {nColors.c.b});
        <br />
        vec3 d_color = vec3({nColors.d.r}, {nColors.d.g}, {nColors.d.b});
        <br />
      </pre>
    </div>
  );
};
