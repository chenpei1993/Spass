import Spass from "../Core/Spass.js";

export class GridFloor{
    constructor() {
        this.createGeometry()
    }

    createGeometry(){

        let vertex = [],
            size = 30,
            div = 60.0,
            step = size / div,
            half = size / 2;

        let p;	//Temp variable for position value.
        for(let i=0; i <= div; i++){
            //Vertical line
            p = -half + (i * step);	vertex.push(p, 0, half, p, 0, -half);
            //Horizontal line
            p = half - (i * step);	vertex.push(-half, 0, p, half, 0, p);
        }

        this.mode =  Spass.gl.LINES
        this.vertex = vertex
        this.vertexLen = 3
        this.vertexCount = vertex.length / this.vertexLen
    }
}