// import * as p5 from "p5";
import p5Types from "p5";

export class Walker {
    public p: p5Types
    public position: p5Types.Vector;
    public velocity: p5Types.Vector;
    public acceleration: p5Types.Vector;
    public size: number;
    public color: p5Types.Color
    public mass: number
    public debug = false;
    public debug_hist: number[] = [];

    constructor(p: p5Types, pos: p5Types.Vector, size: number) {
        this.p = p;
        this.position = pos
        this.velocity = p.createVector(0, 0)
        this.acceleration = p.createVector(0, 0)
        this.size = size
        this.color = this.p.color("green")
        this.color.setAlpha(200)
        this.mass = size * 5;
    }

    public setPosition(x: number, y: number) { this.position = this.p.createVector(x, y) }
    public setVelocity(x: number, y: number) { this.velocity = this.p.createVector(x, y) }

    public Update() {
        this.velocity.add(this.acceleration)
        this.PastEdge();
        this.acceleration = this.p.createVector(0, 0);
        this.position.add(this.velocity);
    }

    public ApplyForce(vector: p5Types.Vector) {
        const f = p5Types.Vector.div(vector, this.mass)
        this.acceleration.add(f);
    }

    public Draw() {
        this.p.push();
        this.p.fill(this.color)

        this.p.circle(this.position.x, this.position.y, this.size)
        this.p.pop();
    }

    private GetKineticEnergy(velocity: number) {
        return (this.mass * velocity * velocity) * 0.5
    }

    private GetVelocity(energy: number) {
        if (energy < -25) {
            return 0
        }
        return Math.sqrt(2 * energy / this.mass)
    }

    protected PastEdge() {
        const elasticity = 0.75;
        const r = this.size * 0.5;
        const w = this.p.width - r, h = this.p.height - r;
        const nextPosition = this.position.copy().add(this.velocity);

        if (!(r < nextPosition.x && nextPosition.x < w)) {
            const energyAtImpact = this.GetKineticEnergy(this.velocity.x);
            this.velocity.x *= -elasticity //this.GetVelocity(energyAtImpact);
            this.position.x = this.position.x < this.size ? r : w;
        }
        if (!(r < nextPosition.y && nextPosition.y < h)) {
            const energyAtImpact = this.GetKineticEnergy(this.velocity.y);
            this.velocity.y *= -elasticity //this.GetVelocity(energyAtImpact);
            this.position.y = this.position.y < this.size ? r : h;
            if (this.debug) {
                this.debug_hist.push(energyAtImpact)
                if (this.debug_hist[this.debug_hist.length - 2] < this.debug_hist[this.debug_hist.length - 1]) {
                    this.p.frameRate()
                }
            }

        }
    }
}