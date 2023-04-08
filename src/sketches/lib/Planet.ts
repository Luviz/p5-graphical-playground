import { Vector } from "p5";
import { Walker } from "./Walker";

export default class Planet extends Walker {
  public EffectedBy: Walker[] = [];
  public HistoryCount: number = 1000;
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
    super.Draw();
    this.color.setAlpha(100);
    this.p.push();
    this.p.noFill();
    this.p.stroke(this.color);

    this.p.strokeWeight(5);
    this.p.beginShape();
    for (const hist of this.History) {
      this.p.vertex(hist.x, hist.y);
    }
    this.p.endShape();
    this.p.pop();
  }
}
