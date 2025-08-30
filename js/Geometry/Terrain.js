import Spass from "../Core/Spass.js";
import Noise from "../Util/NoiseUtil.js";

export default class Terrain {
    constructor(w, h, rLen, cLen) {
        this.createGeometry(w, h, rLen, cLen)
    }


    createGeometry(w, h, rLen, cLen){

        this.vertex = []
        this.uv = []
        this.index = []
        this.norm = []

        let rStart = w / -2,		//Starting position for rows when calculating Z position
            cStart = h / -2,		//Starting position of column when calcuating X position
            vLen = rLen * cLen,		//Total Vertices needed to create plane
            iLen = (rLen-1)*cLen,	//Total Index values needed to create the Triangle Strip (Not counting Degenerating Triangle positions)
            cInc = w / (cLen-1),	//Increment value for columns when calcuting X position
            rInc = h / (rLen-1),	//Increment value for rows when calcuating Z position
            cRow = 0,				//Current Row
            cCol = 0,				//Current Column
            uvxInc = 1 / (cLen-1),	//Increment value for columns when calcuting X UV position of UV
            uvyInc = 1 / (rLen-1);	//Increment value for rows when calcuating Z UV position

        let noise = new Noise()
        noise.seed(1)

        let th = 0,					//temporary height
            freq = 13,				//Frequency on how to step through perlin noise
            maxHeight = -3;			//Max Height

        //..................................
        //Generate the vertices and the index array.
        for(let i= 0; i < vLen; i++){
            cRow = Math.floor(i / cLen);	//Current Row
            cCol = i % cLen;				//Current Column
            th = noise.perlin2((cRow+1)/freq, (cCol+1)/freq) * maxHeight;

            //Create Vertices,x,y,z
            this.vertex.push(cStart+cCol*cInc, 1 + th, rStart+cRow*rInc);

            //Create UV s,t. Spread the 0,0 to 1,1 throughout the whole plane
            this.uv.push( (cCol === cLen-1) ? 1 : cCol * uvxInc,
                (cRow === rLen-1) ? 1 : cRow * uvyInc );

            //Create the index, We stop creating the index before the loop ends creating the vertices.
            if(i < iLen){
                this.index.push(cRow * cLen + cCol, (cRow+1) * cLen + cCol);
                if(cCol === cLen - 1 && i < iLen-1) {
                    this.index.push( (cRow+1) * cLen + cCol, (cRow+1) * cLen);
                }
            }
        }

        let x,					//X Position in grid
            y,					//Y Position in grid
            p,					//Temp Array Index when calcating neighboring vertices
            pos,				//Using X,Y, determine current vertex index position in array
            xMax = cLen-1,		//Max X Position in Grid
            yMax = rLen -1,		//Max Y Position in Grid
            nX = 0,				//Normal X value
            nY = 0,				//Normal Y value
            nZ = 0,				//Normal Z value
            nL = 0,				//Normal Vector Length
            hL,					//Left Vector height
            hR,					//Right Vector Height
            hD,					//Down Vector height
            hU					//Up Vector Height

        for(var i=0; i < vLen; i++){
            y = Math.floor(i / cLen);	//Current Row
            x = i % cLen;				//Current Column
            pos = y*3*cLen + x*3;		//X,Y position to Array index conversion

            //-----------------
            //Get the height value of 4 neighboring vectors: Left,Right,Top Left

            if(x > 0){ //LEFT
                p = y*3*cLen + (x-1)*3;	//Calc Neighbor Vector
                hL = this.vertex[p+1];		//Grab only the Y position which is the height.
            }else hL = this.vertex[pos+1];	//Out of bounds, use current

            if(x < xMax){ //RIGHT
                p = y*3*cLen + (x+1)*3;
                hR = this.vertex[p+1];
            }else hR = this.vertex[pos+1];

            if(y > 0){ //UP
                p = (y-1)*3*cLen + x*3;
                hU = this.vertex[p+1];
            }else hU = this.vertex[pos+1];

            if(y < yMax){ //DOWN
                p = (y+1)*3*cLen + x*3;
                hD = this.vertex[p+1];
            }else hD = this.vertex[pos+1];

            //-----------------
            //Calculate the final normal vector
            nX = hL - hR;
            nY = 2.0;
            nZ = hD - hU;
            nL = Math.sqrt( nX*nX + nY*nY + nZ*nZ);	//Length of vector
            this.norm.push(nX/nL,nY/nL,nZ/nL);			//Normalize the final normal vector data before saving to array.
        }

        this.mode =  Spass.gl.TRIANGLE_STRIP
        this.indexCount =  this.index.length
        this.vertexLen = 3
    }
}