import {Matrix4, Vector3} from "./Math.js";

export default class Transform{
    constructor() {
        this.position = new Vector3(0, 0, 0)
        this.scale = new Vector3(1, 1, 1)
        this.rotation = new Vector3(0, 0, 0)

        this.matView = new Matrix4()
        this.matNormal = new Float32Array(9)

        this.forward = new Float32Array(4)
        this.up = new Float32Array(4)
        this.right = new Float32Array(4)
    }
}