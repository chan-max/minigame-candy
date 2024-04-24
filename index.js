const { ThreeController } = require('./src/utils/core')
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
    let width = 5
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

        let model = await this.threeController.loadGltf('src/assets/models/candy.glb')
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