import {
    Box3,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    AmbientLight,
    Vector3,
    Box3Helper,
    Vector2,
    Object3D,
    SphereGeometry,
    DoubleSide,
    Raycaster,
    Texture,
    Euler,
    MeshPhongMaterial,
    TextureLoader,
    CubeTextureLoader,
    BackSide,
    PointLight
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function loadGltf(url) {
    let loader = new GLTFLoader();
    return new Promise(async (resolve, reject) => {
        try {
            let gltf = await loader.loadAsync(url)
            resolve(gltf)
        } catch (e) {
            reject(e)
        }
    })
}



export class ThreeController {
    // three
    THREE = null
    // 场景
    scene
    // 渲染器
    renderer
    // 摄像机
    camera
    // 当前画布容器
    canvasContainer
    // 控制器
    controller
    // 尺寸侦听器
    resizeObserver
    // 画布
    canvas

    constructor({
        // threejs核心库
        THREE,
        canvas
    }) {

        this.THREE = THREE
        this.canvas = canvas
        this.camera = new this.THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 1)
        this.renderer = new this.THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.scene = new this.THREE.Scene()
        this.scene
        this.resizeObserver = new ResizeObserver(
            () => {
                this.canvas.width = document.body.clientWidth;
                this.canvas.height = document.body.clientHeight;
                this.camera.aspect = this.canvas.width / this.canvas.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.canvas.width, this.canvas.height);
            }
        );

        this.controller = new OrbitControls(this.camera, canvas);
        this.controller.enableDamping = true; 
        this.controller.dampingFactor = 0.1; // 设置阻尼强度
        this.resizeObserver.observe(document.body);
        this.renderer.setSize(canvas.width, canvas.height);

        this.camera.position.z = 20;
        this.setBgColor(0xedc5ed)

        this.render()

        this.init()
        this.scene.background = this.getLinearGradientBackground()
    }

    setBgColor(color, alpha = 1) {
        this.renderer.setClearColor(color, alpha);
    }

    getLinearGradientBackground() {
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const ctx = canvas.getContext('2d')
        // 创建线渐变色 - 四个参数为坐标
        const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0)
        gradient.addColorStop(0, '#4e22b7')
        gradient.addColorStop(1, '#3292ff')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        const canvasTexture = new this.THREE.CanvasTexture(canvas)
        return canvasTexture
    }

    initModelPosition(object,scale = 1) {
        // 先处理尺寸，再居中
        const sizeBox = new Box3().setFromObject(object);
        let size = new Vector3();
        sizeBox.getSize(size);
        let length = size.length();
        object.scale.set(scale / length, scale / length, scale / length);
        const centerBox = new Box3().setFromObject(object);
        const center = centerBox.getCenter(new Vector3());
        object.position.x += object.position.x - center.x;
        object.position.y += object.position.y - center.y;
        object.position.z += object.position.z - center.z;
    }

    async init() {

        const ambientLight = new this.THREE.AmbientLight(0xffffff, 0.5); // 设置颜色和强度
        this.scene.add(ambientLight);

        // 添加平行光
        const directionalLight1 = new DirectionalLight(0xffffff, 3); // 设置颜色和强度
        directionalLight1.position.set(1, 1, 1); // 设置光源位置
        this.scene.add(directionalLight1);

        // 添加平行光
        const directionalLight2 = new DirectionalLight(0xffffff, 3); // 设置颜色和强度
        directionalLight2.position.set(-1, -1, -1); // 设置光源位置
        this.scene.add(directionalLight2);

        // 添加点光源
        const pointLight = new PointLight(0xffffff, 3); // 设置颜色和强度
        pointLight.position.set(0, 0, 2); // 设置光源位置
        this.scene.add(pointLight);

    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    // 获取随机颜色
    getRandomColor() {
        return new this.THREE.Color(Math.random() * 0xffffff);
    }

    loadGltf = loadGltf
}












