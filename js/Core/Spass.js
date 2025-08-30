
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

    set backGroundColor(arr){
        this._backGroundColor = arr
    }

    render(){
        if(this._backGroundColor){
            Spass.gl.clearColor(this._backGroundColor[0],
                this._backGroundColor[1],
                this._backGroundColor[2],
                this._backGroundColor[3])
        }else{
            Spass.gl.clearColor(1, 1, 1, 1)
        }
        Spass.gl.clear(  Spass.gl.COLOR_BUFFER_BIT |   Spass.gl.DEPTH_BUFFER_BIT)

        if(this._preRender){
            this._preRender()
        }
        for(let i = 0; i < this._scene.list.length; i++){
            let geometry = this._scene.list[i]

            if(geometry.preRender){
                geometry.preRender()
            }

            geometry.draw(this.camera.view, this.camera.projection)

            if(geometry.postRender){
                geometry.postRender()
            }
        }

        if(this._postRender){
            this._postRender()
        }
    }
}