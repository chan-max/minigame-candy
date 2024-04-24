const THREE = require('three')
const { createGame } = require('./index')
import VConsole from 'vconsole'


new VConsole({
  mode:'dark'
})

let canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

createGame({
  THREE,
  canvas
}) 







