import { Vector } from "p5";
import { Walker } from "./Walker";

export class Planet extends Walker {
  public EffectedBy: Walker[] = [];
  public HistoryCount: number = 250;
  public History: Vector[] = [];
  public id: string = "";

  PastEdge() {}

  GetGravAcc() {
    for (const walker of this.EffectedBy) {
      const force = Vector.sub(walker.position, this.position);
      let dist = force.mag();
      const strength = (1 * this.mass * walker.mass) / (dist * dist);
      force.normalize();
      force.mult(strength);
      this.ApplyForce(force);
    }
  }

  Draw() {
    if (this.HistoryCount > 0) {
      this.History.unshift(this.position.copy());
      this.History = this.History.splice(0, this.HistoryCount);
    }
    
    this.p.push();
    this.p.noFill();

    this.p.strokeWeight(5);
    this.p.beginShape();
    this.History.forEach((hist, ix) => {
      const alpha = 100 * (1 - ix / this.HistoryCount);
      this.color.setAlpha(alpha);
      this.p.stroke(this.color);
      this.p.point(hist.x, hist.y);
    });

    this.p.endShape();
    this.p.pop();

    this.color.setAlpha(255);
    super.Draw();
    
  }
}
