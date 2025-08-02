
class Scene{
    constructor() {
        this._list = []
    }

    get list(){
        return this._list
    }

    add(o){
        this._list.push(o)
    }
}

export default class Spass {
    
    static gl;

    constructor(gl) {
        Spass.gl = gl
        this._scene = new Scene()
    }

    get scene(){
        return this._scene
    }

    setCamera(camera){
        this.camera = camera
    }

    render(){
        Spass.gl.clearColor(0, 0, 0, 1)
        Spass.gl.clear(  Spass.gl.COLOR_BUFFER_BIT |   Spass.gl.DEPTH_BUFFER_BIT)

        for(let i = 0; i < this._scene.list.length; i++){
            let geometry = this._scene.list[i]
            geometry.draw(this.camera.view, this.camera.projection)
        }
    }
}