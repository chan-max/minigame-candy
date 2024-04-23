import * as THREE from 'three'
import { ThreeController } from './src/utils/core';



let canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight


createGame({
  THREE,
  canvas
})

export function createGame({
  THREE,
  canvas
}) {
  
  const threeController = new ThreeController({
    THREE,
    canvas
  })
}






