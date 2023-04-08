import * as p5 from "p5";

export function DrawArrow(p: p5, base: p5.Vector, vec: p5.Vector, myColor: string) {
    p.push();
    p.stroke(myColor);
    p.strokeWeight(3);
    p.fill(myColor);
    p.translate(base.x, base.y);
    p.line(0, 0, vec.x, vec.y);
    p.rotate(vec.heading());
    let arrowSize = 7;
    p.translate(vec.mag() - arrowSize, 0);
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    p.pop();
}

export function traceValue(p:p5, val:number,c:string= "black", arr:number[] = []){
    arr.push(val);
    if (arr.length > p.width){ arr.splice(0,1)}

    p.push();
    p.stroke(p.color(c));
    p.noFill();
    p.beginShape();
    for (let index = 0; index < arr.length; index++) {
        p.vertex(index , arr[index]);
    }
    p.endShape();
    p.strokeWeight(10)
    p.point(arr.length-1, arr[arr.length-1]);
    p.pop()
    return arr;
}