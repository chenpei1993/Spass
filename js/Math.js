export class Vector3{
    constructor(x = 0.0, y = 0.0, z = 0.0){
        this.x = x
        this.y = y
        this.z = z
    }

    getFloatArray(){
        return new Float32Array([this.x,this.y,this.z])
    }

    getArray(){
        return [this.x,this.y,this.z]
    }

    set(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }

    static subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    }

    static normalize(v) {
        const length = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
        return [v[0] / length, v[1] / length, v[2] / length]
    }

    static cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ]
    }

    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }
}


export class Matrix4{

    constructor() {
       this._raw = Matrix4.identity()
    }

    get value(){
        return this._raw
    }

    reset(){
        this._raw = Matrix4.identity()
    }

    static identity(){
        let out = new Float32Array(16)
        out[0] = out[5] = out[10] = out[15] = 1
        return out
    }

    static translate(out, x, y, z){
        out[12] = out[0] * x + out[4] * y + out[8]	* z + out[12];
        out[13] = out[1] * x + out[5] * y + out[9]	* z + out[13];
        out[14] = out[2] * x + out[6] * y + out[10]	* z + out[14];
        out[15] = out[3] * x + out[7] * y + out[11]	* z + out[15];
    }

    static rotateY(out,rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0],
            a01 = out[1],
            a02 = out[2],
            a03 = out[3],
            a20 = out[8],
            a21 = out[9],
            a22 = out[10],
            a23 = out[11]

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c - a20 * s
        out[1] = a01 * c - a21 * s
        out[2] = a02 * c - a22 * s
        out[3] = a03 * c - a23 * s
        out[8] = a00 * s + a20 * c
        out[9] = a01 * s + a21 * c
        out[10] = a02 * s + a22 * c
        out[11] = a03 * s + a23 * c
        return out
    }

    static rotateX(out,rad) {
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = out[4],
            a11 = out[5],
            a12 = out[6],
            a13 = out[7],
            a20 = out[8],
            a21 = out[9],
            a22 = out[10],
            a23 = out[11]

        // Perform axis-specific matrix multiplication
        out[4] = a10 * c + a20 * s
        out[5] = a11 * c + a21 * s
        out[6] = a12 * c + a22 * s
        out[7] = a13 * c + a23 * s
        out[8] = a20 * c - a10 * s
        out[9] = a21 * c - a11 * s
        out[10] = a22 * c - a12 * s
        out[11] = a23 * c - a13 * s
        return out
    }

    static rotateZ(out,rad){
        let s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = out[0],
            a01 = out[1],
            a02 = out[2],
            a03 = out[3],
            a10 = out[4],
            a11 = out[5],
            a12 = out[6],
            a13 = out[7]

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c + a10 * s
        out[1] = a01 * c + a11 * s
        out[2] = a02 * c + a12 * s
        out[3] = a03 * c + a13 * s
        out[4] = a10 * c - a00 * s
        out[5] = a11 * c - a01 * s
        out[6] = a12 * c - a02 * s
        out[7] = a13 * c - a03 * s
        return out
    }

    static invert(out,mat) {
        if(mat === undefined) mat = out; //If input isn't sent, then output is also input

        var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
            a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
            a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return false;
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return true;
    }

    static multiplyVector4(matrix, vector) {
        const result = new Float32Array(4);

        result[0] = matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12] * vector[3];
        result[1] = matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13] * vector[3];
        result[2] = matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3];
        result[3] = matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3];

        return result;
    }
}
