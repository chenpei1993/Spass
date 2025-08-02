import Spass from "../Core/Spass.js";

export class Cube{

    constructor() {
        this.createGeometry()
    }

    createGeometry(){

        let vertex = [
                -0.5,0.5,0,0, -0.5,-0.5,0,0, 0.5,-0.5,0,0, 0.5,0.5,0,0,			//Front
                0.5,0.5,-1,1, 0.5,-0.5,-1,1, -0.5,-0.5,-1,1, -0.5,0.5,-1,1		//Back
            ]
        let uv = [
                0,0, 0,1, 1,1, 1,0,
                0,0, 0,1, 1,1, 1,0
            ]
        let index = [
                0,1,2, 2,3,0, //Front
                4,5,6, 6,7,4, //Back
                3,2,5, 5,4,3, //Right
                7,0,3, 3,4,7, //Top
                7,6,1, 1,0,7  //Left
        ]

        this.mode =  Spass.gl.TRIANGLES
        this.vertex = vertex
        this.index = index
        this.indexCount =  index.length
        this.vertexLen = 4
    }
}