import * as p5 from "p5";

export default class Particle {

    public p: p5
    public postion: p5.Vector;
    public velocity: p5.Vector;
    public acceleration: p5.Vector;
    public color: p5.Color;
    
    constructor(p:p5) {
        this.p = p;
        this.postion = p.createVector();
        this.velocity = p.createVector();
        this.acceleration = p.createVector();
        this.color = p.color("grey")
    }

    public ApplyForce(vector: p5.Vector){
        this.acceleration.add(vector);
    }

    public Update(){
        this.velocity.add(this.acceleration);
        this.velocity.limit(4);
        this.postion.add(this.velocity);
        this.acceleration.mult(0);
        this.Edge();
    }

    protected Edge(){
        if (this.postion.x < 0 ){
            this.postion.x = this.p.width;
        }
        if (this.postion.x > this.p.width){
            this.postion.x = 0
        }
        if (this.postion.y < 0){
            this.postion.y = this.p.height
        }
        if (this.postion.y > this.p.height){
            this.postion.y = 0
        }
    }   

    public Draw(){
        this.p.push();
        this.p.stroke(this.color);
        this.p.point(this.postion.x, this.postion.y);
        this.p.pop();
    }

}
