export default class CameraController{
    constructor(camera, canvas) {
        this._camera = camera
        this._canvas = canvas

        this._zoomRate = 200
        this._rotateRate = -300
        this._panRate = 5

        this._initX = 0
        this._initY = 0
        this._prevX = 0
        this._prevY = 0

        this.onUpHandler = (e) => {
            this.onMouseUp(e)
        }

        this.onMoveHandler = (e) => {
            this.onMouseMove(e)
        }

        this._canvas.addEventListener("wheel", (e) => {
            this.onMouseWheel(e)
        })

        this._canvas.addEventListener("mousedown", (e) => {
            this.onMouseDown(e)
        })


    }

    onMouseWheel(e){
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
        this._camera.panZ(delta * (this._zoomRate / this._canvas.height))
    }

    onMouseDown(e){
        this._prevX = e.offsetX
        this._prevY = e.offsetY
        this._canvas.addEventListener("mouseup", this.onUpHandler)
        this._canvas.addEventListener("mousemove", this.onMoveHandler)
    }

    onMouseMove(e){
        let dx = e.offsetX - this._prevX
        let dy = e.offsetY - this._prevY
        if(!e.shiftKey){
            this._camera.rotateX(dy * (this._rotateRate / this._canvas.width))
            this._camera.rotateY(dx * (this._rotateRate / this._canvas.height))
        }else{
            this._camera.panX(-dx * (this._panRate / this._canvas.width))
            this._camera.panY(-dy * (this._panRate / this._canvas.height))
        }

        this._prevX = e.offsetX
        this._prevY = e.offsetY
    }

    onMouseUp(e){
        this._canvas.removeEventListener("mouseup", this.onUpHandler)
        this._canvas.removeEventListener("mousemove", this.onMoveHandler)
    }

}