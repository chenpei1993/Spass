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


export  class FacedCube{

    constructor(x, y, z) {
        this.createGeometry(x, y, z)
    }

    createGeometry(x, y, z){
        var w = 0.5, h = 0.5, d = 0.5
        var x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d

        //Starting bottom left corner, then working counter clockwise to create the front face.
        //Backface is the first face but in reverse (3,2,1,0)
        //keep each quad face built the same way to make index and uv easier to assign
        console.log(x0, x1, y0, y1, z0, z1)
        this.vertex = [
            x0, y1, z1, 0,	//0 Front
            x0, y0, z1, 0,	//1
            x1, y0, z1, 0,	//2
            //
            x0, y1, z1, 0,	//0 Front
            x1, y0, z1, 0,	//2
            x1, y1, z1, 0,	//3
            //
            x1, y1, z0, 1,	//4 Back
            x1, y0, z0, 1,	//5
            x0, y0, z0, 1,	//6

            x1, y1, z0, 1,	//4 Back
            x0, y0, z0, 1,	//6
            x0, y1, z0, 1,	//7
            //
            x0, y1, z0, 2,	//7 Left
            x0, y0, z0, 2,
            x0, y0, z1, 2,

            x0, y0, z1, 2,
            x0, y1, z1, 2,
            x0, y1, z0, 2,
            // // //
            // // //

            x1, y0, z1, 3,	//5
            x0, y0, z1, 3,	//6
            x0, y0, z0, 3,	//1 Bottom
            //
            x0, y0, z0, 3,	//6
            x1, y0, z0, 3,	//2
            x1, y0, z1, 3,	//5
            // // //
            x1, y1, z1, 4,	//3 Right
            x1, y0, z1, 4,	//2
            x1, y0, z0, 4,	//5

            x1, y0, z0, 4,	//2
            x1, y1, z0, 4,
            x1, y1, z1, 4,	//3 Right
            //
            //
            // //
            x0, y1, z0, 5,	//7 Top
            x0, y1, z1, 5,	//0
            x1, y1, z1, 5,	//3

            x1, y1, z1, 5,	//3
            x1, y1, z0, 5,
            x0, y1, z0, 5,	//7 Top

        ]
        this.vertexLen = 4
        this.vertexCount = this.vertex.length / this.vertexLen


        //Build UV data for each vertex
        this.uv = []
        for(let i=0; i < 6; i++) {
            this.uv.push(0,0, 0,1,  1,1)
            this.uv.push(1,1, 1,0,  0,0)
        }


        this.mode =  Spass.gl.TRIANGLES
    }
}