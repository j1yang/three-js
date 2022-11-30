import * as THREE from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class ThreeSetUp {
    sizes: Sizes
    scene: THREE.Scene
    rendererBackGround: number | string | THREE.Color
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer

    constructor(rendererBackGround = 0xffffff) {
        this.scene = new Scene()
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        this.rendererBackGround = rendererBackGround
        this.camera = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.01, 100)
        this.renderer = new WebGLRenderer()
        this.init()
    }

    private init() {
        document.body.appendChild(this.renderer.domElement)
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2))
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2))
        this.renderer.setClearColor(this.rendererBackGround)
        this.initResizeResponse()
    }

    private initResizeResponse() {
        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    getSetUp() {
        return {
            camera: this.camera,
            scene: this.scene,
            renderer: this.renderer,
            sizes: this.sizes,
        }
    }

    applyOrbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement!)
        controls.enableDamping = true
        return () => controls.update()
    }
}

export default ThreeSetUp
