import Spass from "../Core/Spass.js";

export class Quad {
    constructor(bx0,by0,bx1,by1) {
        this.createGeometry(bx0,by0,bx1,by1)
    }


    createGeometry(bx0 = -1, by0 = -1, bx1 = 1, by1 = 1){
        this.mode =  Spass.gl.TRIANGLES
        this.vertex = [ bx0,by1,0.0,  bx0,by0,0.0, bx1,by0,0.0,   bx1,by1,0.0 ]
        this.index = [ 0,1,2 , 2,3,0]
        this.uv = [ 0.0,0.0,   0.0,1.0,   1.0,1.0,   1.0,0.0 ]
        this.indexCount =  this.index.length
        this.vertexLen = 3
    }
}

