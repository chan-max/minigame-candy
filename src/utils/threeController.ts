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
    PointLight,
    Color,
    PlaneGeometry,
    MeshStandardMaterial
} from "three";
import * as THREE from 'three'

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

    fov = 75

    cameraZ = 11

    // 宽高比
    get aspectRatio(){
        return this.width / this.height
    }

    // 画布的宽
    get width() {
        return this.canvas.clientWidth
    }

    // 画布的高
    get height() {
        return this.canvas.clientHeight
    }

    get h(){
        return 2 * Math.tan( (this.fov / 2) * Math.PI / 180 ) * this.cameraZ;
    }

    get w(){
       return this.h * this.aspectRatio;
    }

    
    constructor({
        // threejs核心库
        THREE,
        canvas
    }) {
        // window.threeController = this
        this.THREE = THREE
        this.canvas = canvas
        this.camera = new PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 1)
        this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
        this.scene = new Scene()
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
        this.renderer.shadowMap.enabled = true
        this.camera.position.z = this.cameraZ;

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
        const ambientLight = new AmbientLight(0xffffff, 2.2); // 设置颜色和强度
        this.scene.add(ambientLight);

        let light = new THREE.SpotLight( 0xffffff, 120 ); // 使用SpotLight
        light.position.set(0,0,10); //设置光源的位置
        light.castShadow = true; //允许光源产生阴影

        let light2 = new THREE.SpotLight( 0xffffff, 200 ); // 使用SpotLight
        light2.position.set(10,10,10); //设置光源的位置
        light2.castShadow = true; //允许光源产生阴影


        let light3 = new THREE.SpotLight( 0xffffff, 200 ); // 使用SpotLight
        light3.position.set(10,-10,10); //设置光源的位置
        light3.castShadow = true; //允许光源产生阴影


        let light4 = new THREE.SpotLight( 0xffffff, 200 ); // 使用SpotLight
        light4.position.set(-10,10,10); //设置光源的位置
        light4.castShadow = true; //允许光源产生阴影
    
        let light5 = new THREE.SpotLight( 0xffffff, 200 ); // 使用SpotLight
        light5.position.set(-10,-10,10); //设置光源的位置
        light5.castShadow = true; //允许光源产生阴影

        //设置光源产生阴影的一些参数，可以根据场景需要进行调整
        
        this.scene.add( light );
        this.scene.add( light2 );
        this.scene.add( light3 );
        this.scene.add( light4 );
        this.scene.add( light5 );
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    // 获取随机颜色
    getRandomColor() {
        return new Color(Math.random() * 0xffffff);
    }

    private gltfCache = {}

    public useGltf(name, url) {
        if (this.gltfCache[name]) {

            const copy = {
                ...this.gltfCache[name],
                scene: this.gltfCache[name].scene.clone()
            }

            return Promise.resolve(copy)
        } else {
            return new Promise(async (resolve, reject) => {

                // 缓存该模型
                const gltf: any = await loadGltf(url)
                this.gltfCache[name] = gltf

                // 第一个也会生成克隆的模型
                let returnGltf = await this.useGltf(name,url)
                resolve(returnGltf)
            })
        }
    }

    loadTexture = loadTexture

    addPlaneBackground() {
        var aspectRatio = this.width / this.height;
        var canvas = document.createElement('canvas');
        canvas.width = this.width
        canvas.height = this.height
        var ctx: any = canvas.getContext('2d');
        document.body.appendChild(canvas);
        var gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 60, this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2);
        // 设定颜色渐变
        gradient.addColorStop(0, 'hsl(295,91%,50%)');
        gradient.addColorStop(1, 'hsl(295,91%,30%)');

        // 应用渐变到整个 canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        let rule = 13

        var geometry = new PlaneGeometry(rule, rule / aspectRatio);

        var shadowTexture = new Texture(canvas);
        shadowTexture.needsUpdate = true;

        var material = new MeshStandardMaterial({
            map: shadowTexture,
            side: DoubleSide
        });

        var mesh = new Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.position.set(0, 0, -3)
        this.scene.add(mesh);
    }
}












