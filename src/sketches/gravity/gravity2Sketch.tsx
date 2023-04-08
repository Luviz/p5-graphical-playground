import { FC } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Planet } from "../lib";

export const Gravity2: FC = () => {
  const objects: Planet[] = [];
  let mouseTrace: p5Types.Vector[] = [];

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(800, 800);
    canvas.parent(canvasParentRef);
    const canvasCenter = p5.createVector(0, 0);

    function createPlant(color: string, size: number) {
      const planet = new Planet(p5, p5.createVector(0), size);
      planet.color = p5.color(color);
      planet.id = color;
      return planet;
    }

    const initFValue = 63.246 / 2; //63.246; //59.9998;
    canvasCenter.x = p5.width / 2;
    canvasCenter.y = p5.height / 2;

    const planet_1 = createPlant("yellow", 75);

    const planet_2 = createPlant("blue", 10);
    planet_2.setPosition(250, 0);
    planet_2.ApplyForce(p5.createVector(0, -initFValue));

    const planet_3 = createPlant("red", 5);
    planet_3.setPosition(0, 250);
    planet_3.ApplyForce(p5.createVector(initFValue, 0));

    const planet_4 = createPlant("black", 5);
    planet_4.setPosition(0, -250);
    planet_4.ApplyForce(p5.createVector(-initFValue, 0));

    const planet_5 = createPlant("brown", 10);
    planet_5.setPosition(-250, 0);
    planet_5.ApplyForce(p5.createVector(0, initFValue));

    objects.push(planet_1, planet_2, planet_3, planet_4, planet_5);

    for (const obj of objects) {
      obj.EffectedBy.push(...objects.filter((o) => obj !== o));
    }
  };

  const draw = (p5: p5Types) => {
    const canvasCenter = p5.createVector(0, 0);
    canvasCenter.x = p5.width / 2;
    canvasCenter.y = p5.height / 2;

    p5.background(200);
    // const canvasCenter = p5.ca
    p5.translate(canvasCenter.x, canvasCenter.y);
    const mouseVector = p5.createVector(p5.mouseX, p5.mouseY);

    if (p5.mouseIsPressed) {
      mouseTrace.push(mouseVector);
      const deltaMouse = mouseTrace[mouseTrace.length - 1]
        .copy()
        .sub(mouseTrace[mouseTrace.length - 2]);
      canvasCenter.add(deltaMouse.copy().limit(50));
      // canvCenter.add(newCenter.copy().mult(-1).limit(5));
    } else {
      mouseTrace = [];
    }

    for (const obj of objects) {
      obj.GetGravAcc();
    }

    for (const o of objects) {
      o.Update();
      o.Draw();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
