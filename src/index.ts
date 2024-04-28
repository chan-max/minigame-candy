import { ThreeController } from './threeController'
import * as THREE from 'three'
import './index.css'
import {
  CandyJarContructor,
  BananaCandyContructor,
  HardCandyContructor,
  CubeCandyContructor,
  SphereCandyContructor
} from './elements/index'
import { ThreeEvnets } from './base'
import { Directions } from './threeController'

class CandyEngine {

  // 3d 控制器
  threeController

  constructor({
    THREE,
    canvas
  }) {
    this.threeController = new ThreeController({
      THREE,
      canvas
    });

    (window as any).candyEngine = this
    this.init()
  }

  async init() {
    //
    const engine = this
    this.clearChessBorard()
    this.initChessBoard()

    this.threeController.$on(ThreeEvnets.MESH_SWIPE, (mesh, direction) => {
      console.log('滑动了元素')

      console.log(mesh._instance.xIndex,mesh._instance.yIndex)
    })
  }


  // 所有的糖果元素类型
  candyConstructors: any = {
    // HardCandyContructor,
    BananaCandyContructor,
    SphereCandyContructor
    // CubeCandyContructor
  }

  // 清空当前棋盘
  clearChessBorard() {
    this.elementGrid = []
    this.elementSet.forEach((el) => {
      this.threeController.scene.remove(el.target)
    })
    this.elementSet = []
  }

  // 存储当前元素的网格 , 坐标从右下开始，
  /*
    [
      [],
      [(0,1),(1,1),()],
      [(0,0),(1,0)]
    ]
  */
  elementGrid: any[][] = []

  // 当前所有元素的平铺集合
  elementSet: any = []

  // 初始化棋盘
  async initChessBoard() {

    // 支持定于简单的行和列 , 和二维甚至三维数组的形式
    let columns = 4
    let rows = 2

    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {


        /* 设置每个元素的位置和大小 */
        let paddingPervent = 10

        let size = (this.threeController.ruleWidth * (1 - paddingPervent / 100)) / Math.max(rows, columns) * 1



        let element = await this.getRandomCandyElement({size})

        this.threeController.initModelSize(element.target,size * (element.scale || 1.3 ))

        element.target.position.x = column * size + size / 2 - size * columns / 2
        element.target.position.y = row * size + size / 2 - size * rows / 2

        // 在网格上保存当前实例
        element.target._instance = element

        element.xIndex = column
        element.yIndex = row

        this.threeController.scene.add(element.target)

        this.elementGrid[column] || (this.elementGrid[column] = [])

        this.elementGrid[column][row] = element

        this.elementSet.push(element)
      }
    }
  }

  // 获取棋盘的元素
  async getRandomCandyElement({size}) {
    const keys = Object.keys(this.candyConstructors);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const instance = await new this.candyConstructors[randomKey]({
      threeController: this.threeController,
      size
    }).init()

    return instance
  }
}



function createGame(options) {
  return new CandyEngine(options)
}

export {
  createGame
}

