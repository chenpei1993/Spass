
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

    set preRender(preRender){
        this._preRender = preRender
    }

    set postRender(postRender){
        this._postRender = postRender
    }

    set preItemRender(preItemRender){
        this._preItemRender = preItemRender
    }

    set postItemRender(postItemRender){
        this._postItemRender= postItemRender
    }

    render(){
        Spass.gl.clearColor(1, 1, 1, 1)
        Spass.gl.clear(  Spass.gl.COLOR_BUFFER_BIT |   Spass.gl.DEPTH_BUFFER_BIT)

        if(this._preRender){
            this._preRender()
        }
        for(let i = 0; i < this._scene.list.length; i++){
            let geometry = this._scene.list[i]
            if(this._preItemRender){
                this._preItemRender(geometry)
            }
            geometry.draw(this.camera.view, this.camera.projection)
            if(this._postItemRender){
                this._postItemRender(geometry)
            }
        }

        if(this._postRender){
            this._postRender()
        }
    }
}