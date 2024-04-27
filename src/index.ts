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
    this.threeController.$on('update', this.init.bind(this))
  }

  async init() {
    
    this.clearChessBorard()
    this.initChessBoard()
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
  elementGrid: any[][] = []

  // 当前所有元素的平铺集合
  elementSet:any = []

  // 初始化棋盘
  async initChessBoard() {

    // 支持定于简单的行和列 , 和二维甚至三维数组的形式
    let column = 9
    let row = 9

    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row; j++) {

        let element = await this.getRandomCandyElement()

        /* 设置每个元素的位置和大小 */
        let paddingPervent = 10

        let width = (this.threeController.ruleWidth * (1 - paddingPervent / 100)) / Math.max(row, column) * 1

        this.threeController.initModelPosition(element.target, width * 1.3)  // 大于1 看起来更饱满

        element.target.position.x = i * width + width / 2 - width * column / 2
        element.target.position.y = j * width + width / 2 - width * row / 2
        this.threeController.scene.add(element.target)


        this.elementGrid[j] || (this.elementGrid[j] = [])

        this.elementGrid[j][i] = element

        this.elementSet.push(element)

      }
    }
  }

  // 获取棋盘的元素
  async getRandomCandyElement() {
    const keys = Object.keys(this.candyConstructors);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const instance = await new this.candyConstructors[randomKey]({
      threeController: this.threeController
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

