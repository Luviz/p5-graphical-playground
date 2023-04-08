import { FC } from "react";
import { DropSketch } from "../drop";
import { RouteObject } from "react-router-dom";
import { SketchCard, SketchCardProp } from "./sketchCard";
import { Gravity } from "../gravity";
import { Gravity2 } from "../gravity/gravity2Sketch";
import { MandelbrotSetSketch } from "../MandelbrotSet";

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
  }
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
