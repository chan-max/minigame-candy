import * as  THREE from 'three'
import { createGame } from './index'
import VConsole from 'vconsole'

new VConsole({
  mode: 'dark' as any
})

let canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

createGame({
  THREE,
  canvas
})






