import Shader from "../../js/Material/Shader.js";
import Mesh from "../../js/Mesh/Mesh.js";
import Terrain from "../../js/Geometry/Terrain.js";
import {Quad} from "../../js/Geometry/Quad.js";
export function createTerrain(){
    let vertexShaderSrc = `#version 300 es
      in vec4 a_position;
      in vec2 a_uv;
      in vec3 a_norm;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uCameraViewMatrix;
      uniform mat4 uProjectViewMatrix;
      out vec2 uv;
      out vec3 norm;
      out float h;
      out vec4 modelPosition;
      void main(void){
        modelPosition = uModelViewMatrix * vec4(a_position.xyz, 1.0);
        gl_Position =   uProjectViewMatrix  * uCameraViewMatrix * modelPosition;
        uv = a_uv;
        norm = a_norm;
        h = a_position.y;
      }
    `
    let fragmentShaderSrc =  `#version 300 es
        precision mediump float;
        in vec2 uv;
        in float h;
        const float OCHRE_HEIGHT = 0.0;
        const float GREEN_HEIGHT = 0.5;
        const float SNOW_WHITE_HEIGHT = 3.5;
      
        const vec3 OCHRE = vec3(0.8, 0.46, 0.13);
        const vec3 GREEN = vec3(0.18, 0.71, 0.17);
        const vec3 SNOW_WHITE = vec3(1.0, 1.0, 1.0);
        
        uniform vec4 plane;
        in vec4 modelPosition;
        
        out vec4 fragColor;
        void main(void){
            if(dot(modelPosition, plane) < 0.0){
                discard;
            }
            float mix_ochre_green = smoothstep(OCHRE_HEIGHT, GREEN_HEIGHT, h);
            float mix_green_white = smoothstep(GREEN_HEIGHT, SNOW_WHITE_HEIGHT, h);

            // 第一次混合：在土黄色和绿色之间
            vec3 color = mix(OCHRE, GREEN, mix_ochre_green);

            // 第二次混合：在上面的结果和雪白色之间
            color = mix(color, SNOW_WHITE, mix_green_white);
      
            fragColor = vec4(color, 1.0);
      }
     `

    const shader = new Shader(vertexShaderSrc, fragmentShaderSrc)
    let terrain = new Terrain(64, 64, 64, 64)
    return new Mesh(terrain, shader)
}


export function createQuad(){
    let vertexShaderSrc = `#version 300 es
      in vec4 a_position;
      in vec2 a_uv;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uCameraViewMatrix;
      uniform mat4 uProjectViewMatrix;

      out vec2 uv;
      void main(void){
        gl_Position = a_position;
        uv = a_uv;

      }
    `
    let fragmentShaderSrc =  `#version 300 es
      precision mediump float;
      uniform sampler2D reflectionTexture;
      uniform sampler2D refractionTexture;
      
      in vec2 uv;
      out vec4 fragColor;
      void main(void){
         vec4 reflectColor = texture(reflectionTexture, uv);
        vec4 refractColor = texture(refractionTexture, uv);
        fragColor = mix(refractColor, reflectColor, 0.5);
         // fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
     `

    const shader = new Shader(vertexShaderSrc, fragmentShaderSrc)
    let quad = new Quad()
    let quadMesh = new Mesh(quad, shader)

    return quadMesh
}
