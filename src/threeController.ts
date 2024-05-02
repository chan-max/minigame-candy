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
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Helper } from "./base";
import { ThreeEvnets } from './base'
import TWEEN from '@tweenjs/tween.js'

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

export enum Directions {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
}

export class ThreeController extends Helper {
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


    // 宽高比
    get aspectRatio() {
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



    // 假定的横向高度 
    get ruleWidth() {
        return 1
    }

    get ruleHeight() {
        return this.ruleWidth / this.aspectRatio
    }

    constructor({
        // threejs核心库
        THREE,
        canvas
    }) {
        super()
        this.THREE = THREE
        this.canvas = canvas
        this.init()
    }

    init() {
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        // 增加分辨率 
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = true
        this.scene = new Scene()

        this.initView()

        this.initLight()

        this.initEvent()

        this.addShadowPlane()

        this.addPlaneBackground()

        this.initCamera()

        this.initHdr()

        this.render()

        // this.initController()

        document.body.onload = () => {
            this.resizeObserver = new ResizeObserver(() => {
                this.$dispatch(ThreeEvnets.CANVAS_RESIZE)
                this.initView()
                this.updateCamera()
            });
            this.resizeObserver.observe(document.body)
        };
    }

    // 清空当前场景
    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }

    initController() {
        this.controller = new OrbitControls(this.camera, this.canvas);
        this.controller.enableDamping = true;
        this.controller.dampingFactor = 0.1; // 设置阻尼强度
    }


    updateCamera() {
        this.camera.aspect = this.aspectRatio;
        this.camera.left = - this.ruleWidth / 2
        this.camera.right = this.ruleWidth / 2
        this.camera.top = this.ruleHeight / 2
        this.camera.bottom = - this.ruleHeight / 2
        this.camera.near = .1
        this.camera.far = 10000
        this.camera.updateProjectionMatrix();
    }

    initCamera() {
        this.camera = new THREE.OrthographicCamera(- this.ruleWidth / 2, this.ruleWidth / 2, this.ruleHeight / 2, - this.ruleHeight / 2, .1, 10000);
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, this.ruleWidth)
    }

    initView() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }



    setBgColor(color, alpha = 1) {
        this.renderer.setClearColor(color, alpha);
    }

    setLinearGradientBackground() {
        // 设置渐变色的开始颜色和结束颜色
    }

    setRadialGradientBackground() {
    }

    initModelSize(object, scale = 1) {
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

    async initLight() {
        const ambientLight = new AmbientLight(0xffffff, 1); // 设置颜色和强度
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 创建一个新的方向光源，颜色为白色，强度为0.5
        directionalLight.position.set(0, 0, this.ruleWidth); // 设置光源的位置，光源将从该位置照射下来

        var directionalLight2 = new THREE.DirectionalLight(0xffffff, 5); // 创建一个新的方向光源，颜色为白色，强度为0.5
        directionalLight2.position.set(this.ruleWidth * .02, this.ruleWidth * .02, this.ruleWidth); // 设置光源的位置，光源将从该位置照射下来
        directionalLight2.castShadow = true
        directionalLight2.shadow.mapSize.set(10240, 10240);


        this.scene.add(directionalLight); // 将光源添加到场景中
        this.scene.add(directionalLight2); // 将光源添加到场景中
    }



    render() {
        requestAnimationFrame(this.render.bind(this));
        TWEEN.update()
        this.renderer.render(this.scene, this.camera);
    }

    // 获取随机颜色
    getRandomColor() {
        return new Color(Math.random() * 0xffffff);
    }

    private gltfCache = {}

    // gltf 加载带缓存
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
                let returnGltf = await this.useGltf(name, url)
                resolve(returnGltf)
            })
        }
    }

    public loadTexture = loadTexture


    addPlaneBackground() {
        var canvas = document.createElement('canvas');
        canvas.width = this.ruleWidth
        canvas.height = this.ruleHeight

        var ctx: any = canvas.getContext('2d');
        var gradient = ctx.createRadialGradient(this.ruleWidth / 2, this.ruleHeight / 2, 60, this.ruleWidth / 2, this.ruleHeight / 2, Math.max(this.ruleWidth, this.ruleHeight) / 2);
        // 设定颜色渐变
        gradient.addColorStop(0, 'hsl(295,91%,50%)');
        gradient.addColorStop(1, 'hsl(295,91%,30%)');

        // 应用渐变到整个 canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.ruleWidth, this.ruleHeight);

        var geometry = new PlaneGeometry(this.ruleWidth, this.ruleHeight);

        var shadowTexture = new Texture(canvas);
        shadowTexture.needsUpdate = true;

        var material = new MeshStandardMaterial({
            map: shadowTexture,
            side: DoubleSide
        });

        var mesh = new Mesh(geometry, material);
        mesh.position.set(0, 0, -1)
        this.scene.add(mesh);
    }
    
    initHdr() {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const hdriLoader = new RGBELoader()
        hdriLoader.load('/assets/env.hdr', (texture) => {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            texture.dispose();
            this.scene.environment = envMap
        });
    }

    addShadowPlane() {
        const geometry = new THREE.PlaneGeometry(this.ruleWidth * 2, this.ruleWidth * 2);
        const material = new THREE.ShadowMaterial();
        material.opacity = 0.2;
        const plane = new THREE.Mesh(geometry, material);
        plane.position.z = -this.ruleWidth / 10;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    initEvent() {
        const onPointerClick = (event) => {
            event.preventDefault();
            this.$dispatch(ThreeEvnets.CLICK)
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();

            mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
            mouse.y = - (event.clientY / this.canvas.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            var intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
            }

        }
        this.canvas.addEventListener('click', onPointerClick, false);

        /* 点击滑动事件 */
        let startPoint = new THREE.Vector2();
        let endPoint = new THREE.Vector2();
        // 事件开始是否从网格元素开始 , 记录起始元素
        var isStartFromMesh = false
        var startMesh: any = null

        const onPointerDown = (event) => {
            // 

            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();

            mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
            mouse.y = - (event.clientY / this.canvas.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            var intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                isStartFromMesh = true
                startMesh = intersects[0].object
            }


            startPoint.set(event.clientX, event.clientY);
            this.canvas.addEventListener('pointermove', onPointerMove, false);
        }

        const onPointerMove = (event) => {
            // 当鼠标或手指移动时，记录当前位置
            endPoint.set(event.clientX, event.clientY);
        }

        const onPointerUp = (event) => {
            // 当鼠标松开或触摸结束时，判断移动的方向

            this.canvas.removeEventListener('pointermove', onPointerMove, false);
            let direction = getSwipeDirection(startPoint, endPoint);

            if (direction) {
                this.$dispatch(ThreeEvnets.SWIPE)
                if (isStartFromMesh) {
                    this.$dispatch(ThreeEvnets.MESH_SWIPE, startMesh, direction)
                }
            }

            startMesh = null
            isStartFromMesh = false
        }


        this.canvas.addEventListener('pointerdown', onPointerDown, false);
        this.canvas.addEventListener('pointerup', onPointerUp, false);

        // 判断滑动方向的函数
        const getSwipeDirection = (startPoint, endPoint) => {
            let dy = startPoint.y - endPoint.y;
            let dx = startPoint.x - endPoint.x;

            // 忽略半径 , 小于会被忽略
            let ignoreRadius = 5

            if (Math.abs(dy) < ignoreRadius && Math.abs(dx) < ignoreRadius) {
                return ''
            }

            let result = "";

            if (Math.abs(dx) > Math.abs(dy)) {
                //判断为横向滑动
                result = dx > 0 ? "left" : "right";
            } else {
                //判断为纵向滑动
                result = dy > 0 ? "up" : "down";
            }

            return result;
        }
    }
}












