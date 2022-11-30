import WebcamVideo from './WebcamVideo'

export default class WebcamCanvas {
    private readonly webcamVideo: WebcamVideo
    canvas: HTMLCanvasElement
    canvasSize: number
    receivingStreem: boolean
    private readonly canvasCtx: CanvasRenderingContext2D

    constructor(canvasSize = 500) {
        this.webcamVideo = new WebcamVideo(this.setReceivingStreem.bind(this))
        this.canvasSize = canvasSize
        this.canvas = document.createElement('canvas')
        this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.receivingStreem = false
        this.init()
    }

    private init() {
        this.canvas.width = this.canvasSize
        this.canvas.height = this.canvasSize / this.webcamVideo.aspectRatio
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    setReceivingStreem() {
        this.receivingStreem = true
    }

    updateFromWebCam() {
        this.canvasCtx.drawImage(
            this.webcamVideo.videoTarget,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }
}
