const core = require('./entry.js')

let systemInfo = tt.getSystemInfoSync();
let canvas = tt.createCanvas();
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;

// let ctx = canvas.getContext('2d');
function draw() {
  core.createGame(canvas._canvas)
}

draw();
