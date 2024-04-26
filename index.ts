import { ThreeController } from './src/utils/threeController'
import * as THREE from 'three'

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
    // 一个简单的5x5的格子布局来创建墙
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // 为每个方块生成一个随机的颜色
        var color = new THREE.Color(Math.random() * 0xffffff);
        var boxMaterial = new THREE.MeshBasicMaterial({ color: color });
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        var cube = new THREE.Mesh(boxGeometry, boxMaterial);

        // 将方块排列成墙
        // cube.position.x = j - 4.5
        // cube.position.y = i - 4.5
        // this.threeController.scene.add(cube);

        let model = await this.threeController.useGltf('candy1','src/assets/models/candy2.glb')
        model.scene.traverse( (node) => {
          if (node.isMesh) { 
              node.castShadow = true;
              // 判断该模型是否有材质并且是否有这两个属性
              if ('material' in node && 'roughness' in node.material && 'metalness' in node.material) { 
                  // 设置粗糙度和金属感
                  node.material.roughness = .0;  // 可改为你需要的值，范围通常是0到1
                  node.material.metalness = .2;  // 可改为你需要的值，范围通常是0到1
                  node.material.shininess = 100
                  // node.specular = new THREE.Color("rgb(255, 0, 0)"),
                  node.material.color = new THREE.Color(0xff0000);
              }
          }
      });

        this.threeController.initModelPosition(model.scene,1.5)
        model.scene.position.x = j - 4
        model.scene.position.y = i - 4
        this.threeController.scene.add(model.scene)
      }
    }
  }
}



function createGame(options) {
  return new CandyEngine(options)
}

export {
  createGame
}

