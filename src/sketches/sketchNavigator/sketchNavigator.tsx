import { FC } from "react";
import { DropSketch } from "../drop";
import { RouteObject } from "react-router-dom";
import { SketchCard, SketchCardProp } from "./sketchCard";

type SketchType = SketchCardProp & RouteObject;

const _sketches: SketchType[] = [
  {
    name: "Drop",
    description: "Some object dropping",
    path: "/sketch/drop",
    element: <DropSketch />,
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
