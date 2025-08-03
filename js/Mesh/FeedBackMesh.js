import Spass from "../Core/Spass.js";
import {OUtil} from "../Util/OUtil.js";
import {Matrix4} from "../Math.js";

export default class FeedBackMesh {
    constructor(geometry, material, count, varyings) {
        this._geometry = geometry
        this._material = material
        this._transfrom = new Matrix4()
        this._uniforms = {}
        this._count = count
        this._data = []
        this._vaos = []
        this._tfbs = []
        this._varyings = varyings || []
        this._curID = 0
        this.initData()
        this.init()
    }

    init(){
        //...........Vertex Arrays 0.......................TransformFeedBack 0........
        //............................................................................
        //..| Buffer 0 | Buffer 1 | Buffer 3 |....| Buffer 0 | Buffer 1 | Buffer 3 |..
        //..| Buffer 4 | Buffer 5 | Buffer 6 |....| Buffer 4 | Buffer 5 | Buffer 6 |..
        //..|..........|..........|..........|....|..........|..........|..........|..
        //............................................................................

        //...........Vertex Arrays 1.......................TransformFeedBack 1........
        //............................................................................
        //..| Buffer 0 | Buffer 1 | Buffer 3 |....| Buffer 0 | Buffer 1 | Buffer 3 |..
        //..| Buffer 4 | Buffer 5 | Buffer 6 |....| Buffer 4 | Buffer 5 | Buffer 6 |..
        //..|..........|..........|..........|....|..........|..........|..........|..
        //............................................................................

        // Vertex Arrays 0 -> TransformFeedBack 1 -> Vertex Arrays 1
        // Vertex Arrays 1 -> TransformFeedBack 0 -> Vertex Arrays 0
        Spass.gl.useProgram(this._material.program)

        for(let i = 0;  i < 2; i++){
            let vao = Spass.gl.createVertexArray()
            let tfb = Spass.gl.createTransformFeedback()
            let data = this.initData()
            this._init(vao, tfb, data)
            this._data[i] = data
            this._vaos[i] = vao
            this._tfbs[i] = tfb
        }

        Spass.gl.useProgram(null)

    }


    initData(){
        let data = {}
        if(OUtil.isNotBlank(this._geometry.vertex)){
            this._vertex = []
            for(let i =  0; i < this._count; i++){
                this._vertex.push(...this._geometry.vertex)
            }
            data["vertex"] = {
                name: "a_position",
                data: this._vertex,
                lenPerData: this._geometry.vertexLen,
                lenPerInstance: this._geometry.vertex.length,
                total: this._vertex.length,
                len: this._vertex.length / this._geometry.vertexLen,
                buffer: Spass.gl.createBuffer(),
                loc: Spass.gl.getAttribLocation(this._material.program, "a_position")
            }
        }

        if(OUtil.isNotBlank(this._geometry.uv)){
            this._uv = []
            for(let i =  0; i < this._count; i++){
                this._uv.push(...this._geometry.uv)
            }
            data["uv"] = {
                name: "a_uv",
                data: this._uv,
                lenPerData: 2,
                total: this._uv.length,
                len: this._uv.length / 2,
                buffer: Spass.gl.createBuffer(),
                loc: Spass.gl.getAttribLocation(this._material.program, "a_uv")
            }
        }

        if(OUtil.isNotBlank(this._geometry.index)){
            this._index = []
            for(let i =  0; i < this._count; i++){
                this._index.push(...this._geometry.index)
            }
            data["index"] = {
                name: "a_index",
                data: this._index,
                len: this._index.length,
                buffer: Spass.gl.createBuffer()
            }
        }

        for(let i = 0 ; i < this._varyings.length; i++){
            let name = this._varyings[i].name
            let _data = this._varyings[i].data
            let lenPerData = this._varyings[i].lenPerData
            data[name] = {
                name: name,
                data: _data,
                len: _data.length,
                buffer: Spass.gl.createBuffer(),
                lenPerData: lenPerData,
                loc: Spass.gl.getAttribLocation(this._material.program, name)
            }
        }
        return data
    }

    _init(vao, tfb, data){
        Spass.gl.bindVertexArray(vao)
        Object.values(data).forEach(e => {
            if(e.name === "a_index"){
                //TODO 先不处理
                return
            }
            Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, e.buffer)
            Spass.gl.bufferData(Spass.gl.ARRAY_BUFFER, new Float32Array(e.data), Spass.gl.DYNAMIC_COPY)
            Spass.gl.vertexAttribPointer(e.loc, e.lenPerData,  Spass.gl.FLOAT, false, 0, 0)
            Spass.gl.enableVertexAttribArray(e.loc)
            Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, null)

        })
        Spass.gl.bindVertexArray(null)

        Spass.gl.bindTransformFeedback(Spass.gl.TRANSFORM_FEEDBACK, tfb)
        Object.values(data).forEach(e => {
            if(e.name === "a_index"){
                //TODO 先不处理
                return
            }
            Spass.gl.bindBufferBase(Spass.gl.TRANSFORM_FEEDBACK_BUFFER, e.loc, e.buffer)
        })
        Spass.gl.bindTransformFeedback(Spass.gl.TRANSFORM_FEEDBACK,null)
    }

    setUniform(name, type, value){
        if(!this._uniforms.hasOwnProperty(name)){
            let loc = Spass.gl.getUniformLocation(this._material.program, name)
            this._uniforms[name] = {
                location: loc,
                type: type,
                value: value
            }
        }else{
            this._uniforms[name].value = value;
        }
    }

    _setUniform(obj){

        switch (obj.type){
            case "vec3":
                Spass.gl.uniform3fv(obj.location, obj.value)
                break
            case "vec4":
                Spass.gl.uniform4fv(obj.location, obj.value)
                break
            case "mat4":
                Spass.gl.uniformMatrix4fv(obj.location,false, obj.value)
                break
            default:
                console.error("obj.type not found ", obj)
        }
    }

    setPosition(x, y, z){
        Matrix4.translate(this._transfrom.value, x, y, z)
    }

    rotateX(rad){
        Matrix4.rotateX(this._transfrom.value, rad)
    }

    rotateY(rad){
        Matrix4.rotateY(this._transfrom.value, rad)
    }

    draw(viewMatrix, projectionMatrix){
        let nextBufferID = (this._curID + 1) % 2

        Spass.gl.useProgram(this._material.program)

        Spass.gl.enable(Spass.gl.CULL_FACE)
        // Spass.gl.enable(Spass.gl.BLEND)

        // 设置uniform
        this.setUniform("uModelViewMatrix", "mat4",  new Float32Array(this._transfrom.value))
        this.setUniform("uCameraViewMatrix", "mat4", new Float32Array(viewMatrix))
        this.setUniform("uProjectViewMatrix", "mat4", new Float32Array(projectionMatrix))
        Object.values(this._uniforms).forEach(value => {
            this._setUniform(value)
        })

        Spass.gl.bindVertexArray(this._vaos[this._curID]) // 从vao中读取数据
        Spass.gl.bindTransformFeedback(Spass.gl.TRANSFORM_FEEDBACK, this._tfbs[nextBufferID]) // 回写到transform buffer 中

        Spass.gl.beginTransformFeedback(Spass.gl.POINTS)

        Spass.gl.enable(Spass.gl.RASTERIZER_DISCARD)
        Spass.gl.drawArrays(Spass.gl.POINTS, 0, this._count)
        Spass.gl.disable(Spass.gl.RASTERIZER_DISCARD)

        Spass.gl.endTransformFeedback()

        Spass.gl.bindTransformFeedback(Spass.gl.TRANSFORM_FEEDBACK, null)
        Spass.gl.bindVertexArray(null)


        Spass.gl.bindVertexArray(this._vaos[nextBufferID])
        Spass.gl.drawArraysInstanced(Spass.gl.TRIANGLES, 0, this._count * this._geometry.vertexCount, this._count)

        //
        // this.getBufferContents(name,  this._data[0].vertex.buffer,  this._data[0].vertex.data.length )
        // this.getBufferContents(name,  this._data[1].vertex.buffer,  this._data[1].vertex.data.length )
        //
        // this.getBufferContents(name,  this._data[0].a_offset.buffer,  this._data[1].a_offset.data.length )
        // this.getBufferContents(name,  this._data[1].a_offset.buffer,  this._data[1].a_offset.data.length )

        this._curID = nextBufferID


        Spass.gl.useProgram(null)


    }

    getBufferContents (name, buffer, len){
        // Consider this `sync` object as a flag. It will be dropped
        // into WebGL's instruction pipeline. When WebGL reaches
        // this sync object, it will set its status two one of FOUR
        // values.
        const sync = Spass.gl.fenceSync(Spass.gl.SYNC_GPU_COMMANDS_COMPLETE, 0);

        const checkStatus = () => {
            // Get the status
            const status = Spass.gl.clientWaitSync(sync, Spass.gl.SYNC_FLUSH_COMMANDS_BIT, 0);

            if (status === Spass.gl.TIMEOUT_EXPIRED) {
                console.log('GPU is still busy. Let\'s wait some more.');
                setTimeout(checkStatus);
            } else if (status === Spass.gl.WAIT_FAILED) {
                console.error('Something bad happened and we won\'t get any response.');
            } else  {
                // This code will be reached if the status is either
                // CONDITION_SATISFIED or SIGNALED_ALREADY. We don't
                // really care which status it is as long as one of
                // these was found. So we can safely read the buffer data
                // (assuming another draw call hasn't initiated more
                // changes....)
                const view = new Float32Array(len);
                Spass.gl.bindBuffer(Spass.gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
                Spass.gl.getBufferSubData(Spass.gl.TRANSFORM_FEEDBACK_BUFFER, 0, view);
                Spass.gl.bindBuffer(Spass.gl.TRANSFORM_FEEDBACK_BUFFER, null);
                console.log(name, view);
                let m = new Set()
                for(let i = 0 ; i < view.length; i+=4){
                    m.add(view[i] + " " + view[i + 1] + " " + view[i + 2])
                }
                console.log(m.size)
                for(let i of m){
                    console.log(i)
                }

            }
        };

        setTimeout(checkStatus);
    };
}