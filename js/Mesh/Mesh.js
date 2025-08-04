import Spass from "../Core/Spass.js";
import {OUtil} from "../Util/OUtil.js";
import {Matrix4} from "../Math.js";

export default class Mesh {
    constructor(geometry, material) {
        this._geometry = geometry
        this._material = material
        this._transfrom = new Matrix4()
        this._uniforms = {}
        this._textures = {}
        this.init()
    }

    init(){
        //...........Vertex Arrays..............
        //......................................
        //..| Buffer 0 | Buffer 1 | Buffer 3 |..
        //..| Buffer 4 | Buffer 5 | Buffer 6 |..
        //..|..........|..........|..........|..
        //......................................
        Spass.gl.useProgram(this._material.program)
        // Spass.gl.bindAttribLocation(this._material.program, 1, "a_position")
        // Spass.gl.bindAttribLocation(this._material.program, 2, "a_uv")
        //
        this._id = Spass.gl.createVertexArray()
        Spass.gl.bindVertexArray(this._id)
        if(OUtil.isNotBlank(this._geometry.vertex)){
            let loc  = Spass.gl.getAttribLocation(this._material.program, "a_position")
            let vertexBuf = Spass.gl.createBuffer()
            Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, vertexBuf)
            //https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/bufferData
            Spass.gl.bufferData(Spass.gl.ARRAY_BUFFER, new Float32Array(this._geometry.vertex), Spass.gl.STATIC_DRAW)
            // 指定Buffer中顶点的各种属性，获取方式等等
            Spass.gl.vertexAttribPointer(loc, this._geometry.vertexLen, Spass.gl.FLOAT, false, 0, 0)
            Spass.gl.enableVertexAttribArray(loc)
        }

        if(OUtil.isNotBlank(this._geometry.uv)){
            let loc  = Spass.gl.getAttribLocation(this._material.program, "a_uv")
            let uvBuf = Spass.gl.createBuffer()
            Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, uvBuf)
            Spass.gl.bufferData(Spass.gl.ARRAY_BUFFER, new Float32Array(this._geometry.uv), Spass.gl.STATIC_DRAW)
            Spass.gl.vertexAttribPointer(loc, 2, Spass.gl.FLOAT, false, 0, 0)
            Spass.gl.enableVertexAttribArray(loc)
        }

        if(OUtil.isNotBlank(this._geometry.norm)){
            let loc  = Spass.gl.getAttribLocation(this._material.program, "a_norm")
            let normBuf = Spass.gl.createBuffer()
            Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, normBuf)
            Spass.gl.bufferData(Spass.gl.ARRAY_BUFFER, new Float32Array(this._geometry.norm), Spass.gl.STATIC_DRAW)
            Spass.gl.vertexAttribPointer(loc, 3, Spass.gl.FLOAT, false, 0, 0)
            Spass.gl.enableVertexAttribArray(loc)
        }

        if(OUtil.isNotBlank(this._geometry.index)){
            let indexBuf = Spass.gl.createBuffer()
            Spass.gl.bindBuffer(Spass.gl.ELEMENT_ARRAY_BUFFER, indexBuf)
            Spass.gl.bufferData(Spass.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._geometry.index), Spass.gl.STATIC_DRAW)
        }

        Spass.gl.bindBuffer(Spass.gl.ARRAY_BUFFER, null)
        Spass.gl.bindVertexArray(null)
        Spass.gl.useProgram(null)
    }

    setUniform(name, type, value){
        if(!this._uniforms.hasOwnProperty(name)){
            let loc = Spass.gl.getUniformLocation(this._material.program, name)
            this._uniforms[name] = {
                name: name,
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
            case "float":
                Spass.gl.uniform1f(obj.location, obj.value)
                break
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

    setImage(name, img){
        const texture =  Spass.gl.createTexture()
        Spass.gl.bindTexture( Spass.gl.TEXTURE_2D, texture)
        Spass.gl.texImage2D(Spass.gl.TEXTURE_2D, 0, Spass.gl.RGBA, Spass.gl.RGBA, Spass.gl.UNSIGNED_BYTE, img)
        Spass.gl.texParameteri( Spass.gl.TEXTURE_2D,  Spass.gl.TEXTURE_WRAP_S,  Spass.gl.CLAMP_TO_EDGE)
        Spass.gl.texParameteri( Spass.gl.TEXTURE_2D,  Spass.gl.TEXTURE_WRAP_T,  Spass.gl.CLAMP_TO_EDGE)
        Spass.gl.texParameteri( Spass.gl.TEXTURE_2D,  Spass.gl.TEXTURE_MIN_FILTER,  Spass.gl.LINEAR)
        Spass.gl.texParameteri( Spass.gl.TEXTURE_2D,  Spass.gl.TEXTURE_MAG_FILTER,  Spass.gl.LINEAR)
        // Spass.gl.generateMipmap( Spass.gl.TEXTURE_2D)
        this._textures[name] = {
            loc: Spass.gl.getUniformLocation(this._material.program, name),
            tex: texture
        }
        Spass.gl.bindTexture( Spass.gl.TEXTURE_2D, null)

    }

    setTexture(name, texture){
        Spass.gl.bindTexture(Spass.gl.TEXTURE_2D, texture)
        // Spass.gl.generateMipmap( Spass.gl.TEXTURE_2D)
        this._textures[name] = {
            loc: Spass.gl.getUniformLocation(this._material.program, name),
            tex: texture
        }
        Spass.gl.bindTexture( Spass.gl.TEXTURE_2D, null)
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

        Spass.gl.useProgram(this._material.program)
        Spass.gl.bindVertexArray(this._id)

        Spass.gl.enable(Spass.gl.CULL_FACE)
        // Spass.gl.enable(Spass.gl.BLEND)

        // 处理 uniform
        if(OUtil.isNotBlank(viewMatrix) && OUtil.isNotBlank(projectionMatrix)){
            this.setUniform("uModelViewMatrix", "mat4",  new Float32Array(this._transfrom.value))
            this.setUniform("uCameraViewMatrix", "mat4", new Float32Array(viewMatrix))
            this.setUniform("uProjectViewMatrix", "mat4", new Float32Array(projectionMatrix))
        }

        Object.values(this._uniforms).forEach(value => {
            this._setUniform(value)
        })

        // 处理纹理
        let i = 0
        Object.values(this._textures).forEach(value => {
            let texSlot = Spass.gl["TEXTURE" + i]
            Spass.gl.activeTexture(texSlot)
            Spass.gl.bindTexture( Spass.gl.TEXTURE_2D, value.tex)
            Spass.gl.uniform1i(value.loc, i)
        })

        if(OUtil.isNotBlank(this._geometry.indexCount)){
            Spass.gl.drawElements(this._geometry.mode, this._geometry.indexCount, Spass.gl.UNSIGNED_SHORT, 0)
        }else{
            Spass.gl.drawArrays(this._geometry.mode, 0, this._geometry.vertexCount)
        }

        Spass.gl.bindVertexArray(null)
        Spass.gl.useProgram(null)
    }
}