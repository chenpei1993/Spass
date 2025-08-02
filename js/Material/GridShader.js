import Shader from "./Shader.js";

export default class GridShader extends Shader{

    constructor() {
        let vertexShader =  `#version 300 es
        in vec4 a_position;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uCameraViewMatrix;
        uniform mat4 uProjectViewMatrix;
        void main(void){
            gl_Position =   uProjectViewMatrix  * uCameraViewMatrix * uModelViewMatrix * vec4(a_position.xyz, 1.0);
        }
        `
        let fragmentShader = `#version 300 es
        precision mediump float;
        out vec4 fragColor;
        void main(void){
            fragColor = vec4(0.8,0.8,0.8,1.0);
        }
        `
        super(vertexShader, fragmentShader);
    }
}