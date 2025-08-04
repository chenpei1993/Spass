import Spass from "../Core/Spass.js";

export class Grid {
    constructor(w, h, rStart, cStart, rInc, cInc) {
        this.createGeometry(w, h, rStart, cStart, rInc, cInc)
    }


    createGeometry(w, h, rStart, cStart,  rInc = 0.5, cInc = 0.5){
        let vertex = []
        let index = []
        let uv = []
        let total = w * h

        for(let i = 0; i < total; i++){
            let r = Math.floor(i / w)
            let c = i % w

            //TODO 先XY平面
            vertex.push(cStart + cInc * c, 0.0, rStart + rInc * r)

            //只到倒数第二行
            if(r < w - 1){
                index.push(r * w + c, (r + 1) * w + c)
                //行的最后一个, 最后一行的最后一个不需要处理
                if(c === h - 1 && r !== w - 2){
                    index.push((r + 1) * w + c, (r + 1) * w)
                }
            }
        }

        let norm = []

        for(let i = 0;  i < total; i++){
            norm.push(0.0, 1.0, 0.0)
        }

        this.mode =  Spass.gl.TRIANGLE_STRIP
        this.vertex = vertex
        this.index = index
        this.indexCount =  index.length
        this.vertexLen = 3
        this.norm = norm
    }
}