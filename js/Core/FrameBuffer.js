import Spass from "../Core/Spass.js";
import Shader from "../Material/Shader.js";
import {Quad} from "../Geometry/Quad.js";
import Mesh from "../Mesh/Mesh.js";


function createQuad(){
    let vertexShaderSrc = `#version 300 es
      in vec4 a_position;
      in vec2 a_uv;

      out vec2 uv;
      void main(void){
        gl_Position =  a_position;
        uv = a_uv;

      }
    `
    let fragmentShaderSrc =  `#version 300 es
      precision mediump float;
      uniform sampler2D uTex;
      in vec2 uv;
      out vec4 fragColor;
      void main(void){
         fragColor = texture(uTex, uv);
         // fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
     `

    const shader = new Shader(vertexShaderSrc, fragmentShaderSrc)
    let quad = new Quad()
    let quadMesh = new Mesh(quad, shader)

    return quadMesh
}

export default class FrameBuffer{


    constructor(width, height) {
        this._width = width
        this._height = height

        this.init()
        this._quad = createQuad()

    }

    init(){
        this._id = Spass.gl.createFramebuffer();
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, this._id)
        this.texColorBuffer(Spass.gl.COLOR_ATTACHMENT0)
        this.depthBuffer()
        this.finalize()
    }


    texColorBuffer(cAttachNum){
        this.texColor = Spass.gl.createTexture();
        Spass.gl.bindTexture(Spass.gl.TEXTURE_2D, this.texColor);
        Spass.gl.texImage2D(Spass.gl.TEXTURE_2D,0, Spass.gl.RGBA, this._width, this._height, 0, Spass.gl.RGBA, Spass.gl.UNSIGNED_BYTE, null);
        Spass.gl.texParameteri(Spass.gl.TEXTURE_2D, Spass.gl.TEXTURE_MIN_FILTER, Spass.gl.LINEAR);
        Spass.gl.texParameteri(Spass.gl.TEXTURE_2D, Spass.gl.TEXTURE_MAG_FILTER, Spass.gl.LINEAR);
        Spass.gl.texParameteri(Spass.gl.TEXTURE_2D, Spass.gl.TEXTURE_WRAP_S, Spass.gl.CLAMP_TO_EDGE);	//Stretch image to X position
        Spass.gl.texParameteri(Spass.gl.TEXTURE_2D, Spass.gl.TEXTURE_WRAP_T, Spass.gl.CLAMP_TO_EDGE);	//Stretch image to Y position

        Spass.gl.framebufferTexture2D(Spass.gl.FRAMEBUFFER, cAttachNum, Spass.gl.TEXTURE_2D, this.texColor, 0);
    }

    depthBuffer(){
        this.depth = Spass.gl.createRenderbuffer();
        Spass.gl.bindRenderbuffer(Spass.gl.RENDERBUFFER, this.depth);
        Spass.gl.renderbufferStorage(Spass.gl.RENDERBUFFER, Spass.gl.DEPTH_COMPONENT16, this._width, this._height);
        Spass.gl.framebufferRenderbuffer(Spass.gl.FRAMEBUFFER, Spass.gl.DEPTH_ATTACHMENT, Spass.gl.RENDERBUFFER, this.depth);
    }

    finalize(){
        switch(Spass.gl.checkFramebufferStatus(Spass.gl.FRAMEBUFFER)){
            case Spass.gl.FRAMEBUFFER_COMPLETE: break
            case Spass.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: console.log("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"); break
            case Spass.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: console.log("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"); break
            case Spass.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"); break;
            case Spass.gl.FRAMEBUFFER_UNSUPPORTED: console.log("FRAMEBUFFER_UNSUPPORTED"); break
            case Spass.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: console.log("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"); break
            case Spass.gl.RENDERBUFFER_SAMPLES: console.log("RENDERBUFFER_SAMPLES"); break
        }

        Spass.gl.bindTexture(Spass.gl.TEXTURE_2D, null)
        Spass.gl.bindRenderbuffer(Spass.gl.RENDERBUFFER, null)
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, null)

    }

    readPixel(x, y){
        let p = new Uint8Array(4);
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, this._id);
        Spass.gl.readPixels(x, y, 1, 1, Spass.gl.RGBA, Spass.gl.UNSIGNED_BYTE, p);
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, null);
        return p;
    }

    enable(){
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, this._id);
    }

    disable(){
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER,null)
    }

    clear(){
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER, this._id)
        Spass.gl.clear(Spass.gl.COLOR_BUFFER_BIT | Spass.gl.DEPTH_BUFFER_BIT)
        Spass.gl.bindFramebuffer(Spass.gl.FRAMEBUFFER,null)
    }

}