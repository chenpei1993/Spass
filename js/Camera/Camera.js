import Transform from "../Transform.js";
import {Matrix4, Vector3} from "../Math.js";

export default class Camera{
    constructor(ratio, fov = 45, near = 0.1, far = 100.0) {

        this._projection = Camera.perspective(fov,  ratio, near, far)
        this._transform = new Matrix4()
        //TODO
        this._up = [0.0, 1.0, 0.0]
        this._target = [0.0, 0.0, 0.0]
        this._position = new Vector3(0.0, 0.0, 0.0)
        this._rotation = new Vector3(0.0, 0.0, 0.0)

    }

    get projection(){
        return this._projection
    }

    get view(){
        this.updateViewMatrix()
        return this._viewMatrix.value
    }

    position(x, y, z){
        this._position.set(x,  y,  z)
    }

    updateViewMatrix(){
        this._transform.reset()

        Matrix4.rotateX(this._transform.value, this._rotation.x * Math.PI / 180)
        Matrix4.rotateY(this._transform.value, this._rotation.y * Math.PI / 180)

        Matrix4.translate(this._transform.value, this._position.x, this._position.y, this._position.z)

        //目前不使用lookAt
        this._viewMatrix = new Matrix4()
        Matrix4.invert(this._viewMatrix.value, this._transform.value)

        return this._viewMatrix.value
    }

    panX(v){
        this._position.x += v
    }

    panY(v){
        this._position.y += v
    }

    panZ(v){
        this._position.z += v
    }

    rotateX(v){
        this._rotation.x += v
    }

    rotateY(v){
        this._rotation.y += v
    }

    rotateZ(v){
        this._rotation.z += v
    }

    static perspective(fovy, aspect, near, far){
        let out = []
        let f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far)
        out[0] = f / aspect
        out[1] = 0
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = f
        out[6] = 0
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = (far + near) * nf
        out[11] = -1
        out[12] = 0
        out[13] = 0
        out[14] = (2 * far * near) * nf
        out[15] = 0
        return out
    }





}