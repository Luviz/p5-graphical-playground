import { FC, useCallback, useMemo } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Walker } from "../lib";

export const DropSketch: FC = () => {
  const walkers: Walker[] = []

  // const setup = useCallback(, []);
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(800, 800);
    canvas.parent(canvasParentRef);

    const walker = new Walker(
      p5,
      p5.createVector(p5.width / 2, p5.height / 2),
      50
    );

    walker.debug = true;
    for (let i = 5; i < 10; i++) {
      const initX = 20 + i * 50,
        initY = 50;
      const w = new Walker(p5, p5.createVector(initX, initY), 10 + i * 4);
      w.color = p5.color("grey");
      w.color.setAlpha(128);
      walkers.push(w);
    }
    walkers.push(walker);
  };

  const draw = (p5: p5Types) => {
    p5.background(200);
    let xAcc = 0;
    for (const listWalker of walkers) {
      if (p5.mouseIsPressed) {
        console.log("wind");

        listWalker.ApplyForce(p5.createVector(1, 0));
      }
      const fg = p5.createVector(xAcc, 1 * listWalker.mass);
      listWalker.ApplyForce(fg);
      listWalker.Update();
      listWalker.Draw();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
