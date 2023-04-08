import { FC } from "react";
import p5Types from "p5";
import Sketch from "react-p5";
import { Planet } from "../lib";

export const Gravity: FC = () => {
  const objects: Planet[] = [];

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const planet_1 = new Planet(p5, p5.createVector(0), 50);
    const planet_2 = new Planet(p5, p5.createVector(0), 100);
    const planet_3 = new Planet(p5, p5.createVector(0), 10);
    const canvas = p5.createCanvas(800, 800);
    canvas.parent(canvasParentRef);

    planet_1.position = p5.createVector(50, 100);
    planet_1.color = p5.color("blue");
    planet_1.EffectedBy.push(planet_2, planet_3);
    planet_1.ApplyForce(p5.createVector(500, -200));

    planet_2.position = p5.createVector(p5.width / 2, p5.height / 2);
    planet_2.color = p5.color("yellow");
    planet_2.mass *= 10;
    planet_2.EffectedBy.push(planet_1, planet_3);

    planet_3.position = p5.createVector(
      p5.width / 2 + 50,
      p5.height / 2 + 150
    );
    planet_3.color = p5.color("red");
    planet_3.EffectedBy.push(planet_1, planet_2);
    planet_3.ApplyForce(p5.createVector(-200, 100));


    objects.push(planet_1, planet_2, planet_3);
  };

  const draw = (p5: p5Types) => {
    p5.background(200);
    p5.point(p5.width / 2, p5.height / 2);

    for (const planet of objects) {
      planet.GetGravAcc();
    }

    for (const planet of objects) {
      planet.Update();
      planet.Draw();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};
