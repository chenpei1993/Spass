import Spass from "../Core/Spass.js";
import {OUtil} from "../Util/OUtil.js";

export default class FeedbackShader{

    constructor(vertexShader, fragmentShader, varyings) {
        this._varyings = []

        if(OUtil.isNotBlank(varyings)){
            this._varyings.push(...varyings)
        }
        this._program = this.createShader(vertexShader, fragmentShader)

    }

    get program(){
        return this._program
    }


    createShader(vertexShaderSrc, fragmentShaderSrc){
        let vertexShader = Spass.gl.createShader(Spass.gl.VERTEX_SHADER)
        Spass.gl.shaderSource(vertexShader, vertexShaderSrc)
        Spass.gl.compileShader(vertexShader)
        if(!Spass.gl.getShaderParameter(vertexShader, Spass.gl.COMPILE_STATUS)){
            console.error("Error compiling vertex shader: " + vertexShaderSrc, Spass.gl.getShaderInfoLog(vertexShader))
            Spass.gl.deleteShader(vertexShaderSrc)
            throw new Error("Error compiling shader")
        }

        let fragmentShader = Spass.gl.createShader(Spass.gl.FRAGMENT_SHADER)
        Spass.gl.shaderSource(fragmentShader, fragmentShaderSrc)
        Spass.gl.compileShader(fragmentShader)
        if(!Spass.gl.getShaderParameter(fragmentShader, Spass.gl.COMPILE_STATUS)){
            console.error("Error compiling fragment shader: " + fragmentShaderSrc, Spass.gl.getShaderInfoLog(fragmentShader))
            Spass.gl.deleteShader(fragmentShaderSrc)
            throw new Error("Error compiling shader")

        }

        const program = Spass.gl.createProgram()
        Spass.gl.attachShader(program, vertexShader)
        Spass.gl.attachShader(program, fragmentShader)

        if(this._varyings.length > 0){
            Spass.gl.transformFeedbackVaryings(program, this._varyings, Spass.gl.SEPARATE_ATTRIBS)
        }

        Spass.gl.linkProgram(program)
        if(!Spass.gl.getProgramParameter(program, Spass.gl.LINK_STATUS)){
            console.error("Error creating shader program.", Spass.gl.getProgramInfoLog(program))
            Spass.gl.deleteProgram(program)
            throw new Error("Error creating shader program")

        }

        Spass.gl.useProgram(null)
        return program
    }

    dispose(){
        if(Spass.gl.getParameter(Spass.gl.CURRENT_PROGRAM) === this.program){
            Spass.gl.useProgram(null)
        }
        Spass.gl.deleteProgram(this.program)
    }
}