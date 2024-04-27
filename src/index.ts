import { ThreeController } from './threeController'
import * as THREE from 'three'
import './index.css'
class CandyEngine {

  threeController

  constructor({
    THREE,
    canvas
  }) {
    this.threeController = new ThreeController({
      THREE,
      canvas
    })

    this.initChessBoard()
  }



  // 初始化棋盘
  async initChessBoard() {
    // 支持定于简单的行和列 , 和二维甚至三维数组的形式
    let row = 9
    let column = 9

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {

        let element = await this.getElement()

        /* 设置每个元素的位置和大小 */
        let padding = 20

        let width = (this.threeController.width - padding) / Math.max(column, row) * 1

        this.threeController.initModelPosition(element, width * 1.2)  // 大于1 看起来更饱满

        element.position.x = i * width + width / 2 - width * row / 2
        element.position.y = j * width + width / 2 - width * column / 2
        this.threeController.scene.add(element)
      }
    }
  }

  // 获取棋盘的元素
  async getElement() {
    // return Promise.resolve(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 })))

    let gltf = await this.threeController.useGltf('candy1', '/assets/models/candy2.glb')
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        // 判断该模型是否有材质并且是否有这两个属性
        if ('material' in node && 'roughness' in node.material && 'metalness' in node.material) {
          // 设置粗糙度和金属感
          node.material.roughness = .0;  // 可改为你需要的值，范围通常是0到1
          node.material.metalness = .3;  // 可改为你需要的值，范围通常是0到1
          node.material.shininess = 100
          // node.specular = new THREE.Color("rgb(255, 0, 0)"),
          node.material.color = new THREE.Color(0xffffff);
        }
      }
    });

    return gltf.scene
  }

}



function createGame(options) {
  return new CandyEngine(options)
}

export {
  createGame
}

