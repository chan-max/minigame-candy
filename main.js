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

// import { Application } from 'pixi.js';

// // Asynchronous IIFE
// (async () =>
// {
//     // Create a PixiJS application.
//     const app = new Application();

//     // Intialize the application.
//     await app.init({ background: '#1099bb', resizeTo: window });

//     // Then adding the application's canvas to the DOM body.
//     document.body.appendChild(app.canvas);
// })();






