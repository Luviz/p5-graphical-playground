import { FC } from "react";
import { DropSketch } from "../drop";
import { RouteObject } from "react-router-dom";
import { SketchCard, SketchCardProp } from "./sketchCard";
import { Gravity } from "../gravity";
import { Gravity2 } from "../gravity/gravity2Sketch";
import {
  MandelbrotSet2Sketch,
  MandelbrotSetSketch,
  MandelbrotShader,
} from "../MandelbrotSet";
import { ShaderTest, ShaderTestTwo, Shapes } from "../shader";
import { RayMarching, RayMarchingLight } from "../rayMarching";
import { SquareWave } from "../waves";
import { ColorPalettes } from "../colorPalettes/colorPalettes";
import { Vectors2D } from "../vectors2D";

type SketchType = SketchCardProp & RouteObject;

const _sketches: SketchType[] = [
  {
    name: "Drop",
    description: "Some object dropping",
    path: "/sketch/drop",
    element: <DropSketch />,
  },
  {
    name: "Gravity",
    description: "Testing the gravitational equation",
    path: "/sketch/gravity",
    element: <Gravity />,
  },

  {
    name: "Gravity II",
    description: "Trying 4 body problem",
    path: "/sketch/gravity2",
    element: <Gravity2 />,
  },
  {
    name: "Mandelbrot Set",
    description: "The MandelbrotSet",
    path: "/sketch/mandelbrotSet",
    element: <MandelbrotSetSketch />,
  },
  {
    name: "Mandelbrot Set II",
    description: "The MandelbrotSet faster",
    path: "/sketch/mandelbrotSet3",
    element: <MandelbrotSet2Sketch />,
  },
  {
    name: "Mandelbrot Set With shader",
    description: "The MandelbrotSet using Shaders",
    path: "/sketch/mandelbrotSet2",
    element: <MandelbrotShader />,
  },
  {
    name: "Shader Test I",
    description: "Working with webGL",
    path: "/sketch/shader_1",
    element: <ShaderTest />,
  },
  {
    name: "Shader Test II",
    description: "Working with webGL",
    path: "/sketch/shader_2",
    element: <ShaderTestTwo />,
  },
  {
    name: "Shader Shapes",
    description: "Working with webGL shader SDF",
    path: "/sketch/shader_shape",
    element: <Shapes />,
  },
  {
    name: "Ray marching",
    description: "Ray marching",
    path: "/sketch/ray_marching",
    element: <RayMarching />,
  },
  {
    name: "Ray marching light",
    description: "Ray marching working with lights",
    path: "/sketch/ray_marching_light",
    element: <RayMarchingLight />,
  },
  {
    name: "Waves square",
    description: "Plotting a square",
    path: "/sketch/waves_sq",
    element: <SquareWave />,
  },
  {
    name: "Palettes",
    description: "working with cos color palettes",
    path: "/sketch/palettes",
    element: <ColorPalettes />,
  },
  {
    name: "Vector 2D",
    description: "visualizing liner algebra operation",
    path: "/sketch/vectors/2D/base",
    element: <Vectors2D />,
  },
];

export const SketchNavigator: FC = () => {
  return (
    <div className="sketch-navigator">
      {_sketches.map((s) => (
        <SketchCard {...s} />
      ))}
    </div>
  );
};

export const routerSketchElements: RouteObject[] = [
  {
    path: "/sketch/",
    element: <SketchNavigator />,
  },
  ..._sketches,
];
