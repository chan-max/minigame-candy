/*
 最基本的糖元素
*/
import * as THREE from 'three'

export class ElementConstructor {

    size

    gltf

    threeController

    target


    xIndex

    yIndex

    constructor({ threeController, size }) {
        this.threeController = threeController
        this.size = size
    }

    // 鼠标或手指覆盖时触发

    onHover() {

    }

    // 鼠标或手指点击时触发
    private _clickEvents = new Set()
    onClick(fn) {
        this._clickEvents.add(fn)
        return () => this._clickEvents.delete(fn)
    }
}


export class CandyJarContructor extends ElementConstructor {

    scale = 1.5

    constructor(params) {
        super(params)
        this.init()
    }

    async init() {
        let gltf = await this.threeController.useGltf('candyjar', '/assets/models/candy_jar.glb')
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.material.roughness = .0;  // 可改为你需要的值，范围通常是0到1
                node.material.metalness = .3;  // 可改为你需要的值，范围通常是0到1
                node.material.color = new THREE.Color(0xffffff);
            }
        });

        this.target = gltf.scene
        return this
    }
}



export class HardCandyContructor extends ElementConstructor {

    constructor(params) {
        super(params)
        this.init()
    }

    async init() {
        let gltf = await this.threeController.useGltf('handCandy', '/assets/models/hard_candy.glb')
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                // node.rotation.x = Math.PI / 2;
                node.castShadow = true;
                // 判断该模型是否有材质并且是否有这两个属性
                if ('material' in node && 'roughness' in node.material && 'metalness' in node.material) {
                    // 设置粗糙度和金属感
                    node.material.roughness = .0;  // 可改为你需要的值，范围通常是0到1
                    node.material.metalness = .3;  // 可改为你需要的值，范围通常是0到1
                    node.material.color = new THREE.Color(0xffffff);
                }
            }
        });

        this.target = gltf.scene
        return this
    }
}


export class BananaCandyContructor extends ElementConstructor {

    constructor(params) {
        super(params)
        this.init()
    }

    scale = 2.5

    async init() {
        let gltf = await this.threeController.useGltf('bananaCandy', '/assets/models/candy2.glb')

        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                if (!this.target) {
                    this.target = node
                }
                node.castShadow = true;
                // 判断该模型是否有材质并且是否有这两个属性
                // 设置粗糙度和金属感
                node.material.roughness = .0;  // 可改为你需要的值，范围通常是0到1
                node.material.metalness = .3;  // 可改为你需要的值，范围通常是0到1
                node.material.color = new THREE.Color(0xff0000);
            }
        });

        return this
    }
}


export class CubeCandyContructor extends ElementConstructor {

    constructor(params) {
        super(params)
        this.init()
    }

    async init() {

        let geometry = new THREE.BoxGeometry(1, 1, 1)

        let material = new THREE.MeshStandardMaterial({
            roughness: .0, // 可改为你需要的值，范围通常是0到1
            metalness: .3, // 可改为你需要的值，范围通常是0到1
            color: new THREE.Color(0xffffff)
        })

        const mesh = new THREE.Mesh(geometry, material)

        this.target = mesh
        return this
    }
}


export class SphereCandyContructor extends ElementConstructor {

    constructor(params) {
        super(params)
        this.init()
    }

    async init() {

        let geometry = new THREE.SphereGeometry(1)

        let material = new THREE.MeshStandardMaterial({
            roughness: .0, // 可改为你需要的值，范围通常是0到1
            metalness: .0, // 可改为你需要的值，范围通常是0到1
            color: new THREE.Color(0xffffff)
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        this.target = mesh
        return this
    }
}
