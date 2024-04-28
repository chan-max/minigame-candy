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
    BOTTOM = 'bottom',
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
        // window.threeController = this
        this.THREE = THREE
        this.canvas = canvas
        // this.camera = new PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.scene = new Scene()
        this.initView()

        // this.controller = new OrbitControls(this.camera, canvas);
        // this.controller.enableDamping = true;
        // this.controller.dampingFactor = 0.1; // 设置阻尼强度

        this.render()

        this.initLight()

        this.initEvent()
        // this.addPlaneBackground()
        // this.initHdr()

        document.body.onload = () => {
            this.resizeObserver = new ResizeObserver(() => {
                this.$dispatch('update')
                this.initView()
            });
            this.resizeObserver.observe(document.body);
        }
    }

    // 清空当前场景
    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }

    initView() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.shadowMap.enabled = true
        this.camera = new THREE.OrthographicCamera(- this.ruleWidth / 2, this.ruleWidth / 2, this.ruleHeight / 2, - this.ruleHeight / 2, .1, 10000);
        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 1)
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

        const ambientLight = new AmbientLight(0xffffff, 2); // 设置颜色和强度
        this.scene.add(ambientLight);

        const level = 100

        let light = new THREE.SpotLight(0xffffff, 100); // 使用SpotLight
        light.position.set(0, 0, level); //设置光源的位置
        light.castShadow = true; //允许光源产生阴影

        let light2 = new THREE.SpotLight(0xffffff, 100000); // 使用SpotLight
        light2.position.set(level, level, level); //设置光源的位置
        light2.castShadow = true; //允许光源产生阴影


        this.scene.add(light);
        this.scene.add(light2);

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
        canvas.width = this.width
        canvas.height = this.height
        var ctx: any = canvas.getContext('2d');
        document.body.appendChild(canvas);
        var gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 60, this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2);
        // 设定颜色渐变
        gradient.addColorStop(0, 'hsl(295,91%,50%)');
        gradient.addColorStop(1, 'hsl(295,91%,14%)');

        // 应用渐变到整个 canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        var geometry = new PlaneGeometry(this.width, this.height);

        var shadowTexture = new Texture(canvas);
        shadowTexture.needsUpdate = true;

        var material = new MeshStandardMaterial({
            map: shadowTexture,
            side: DoubleSide
        });

        var mesh = new Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.position.set(0, 0, -100)
        this.scene.add(mesh);
    }

    initHdr() {
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












