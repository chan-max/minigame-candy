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


export function loadTexture(url) {
    let loader = new TextureLoader();
    return new Promise(async (resolve, reject) => {
        try {
            let texture = await loader.loadAsync(url)
            resolve(texture)
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

    get width() {
        return this.canvas.clientWidth
    }

    get height() {
        return this.canvas.clientHeight
    }


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

        this.render()

        this.init()

        this.addPlaneBackground()
    }

    setBgColor(color, alpha = 1) {
        this.renderer.setClearColor(color, alpha);
    }

    setLinearGradientBackground() {
        // 设置渐变色的开始颜色和结束颜色
    }

    setRadialGradientBackground() {
    }

    initModelPosition(object, scale = 1) {
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
        const pointLight = new PointLight(0xffffff, 10); // 设置颜色和强度
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

    loadTexture = loadTexture

    addPlaneBackground() {
      var aspectRatio = this.width / this.height;
      var canvas = document.createElement('canvas');
      canvas.width = this.width
      canvas.height = this.height
      var ctx = canvas.getContext('2d');
      document.body.appendChild(canvas);
      var gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2);
      // 设定颜色渐变
      gradient.addColorStop(0, 'hsl(295,91%,74%)');
      gradient.addColorStop(1, 'hsl(295,81%,40%)');

      // 应用渐变到整个 canvas
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);

      var geometry = new this.THREE.PlaneGeometry(30,30 / aspectRatio);

      var shadowTexture = new this.THREE.Texture(canvas);
      shadowTexture.needsUpdate = true;

      var material = new this.THREE.MeshBasicMaterial({
          map: shadowTexture,
          side: this.THREE.DoubleSide
      });

     var  mesh = new this.THREE.Mesh(geometry, material);
     mesh.position.set(0,0,-10)
      this.scene.add(mesh);
    }
}












