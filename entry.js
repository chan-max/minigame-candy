const THREE  = require('./modules/three.js')


function createGame(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

  renderer.setSize(canvas.width, canvas.height);
  
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({color: '#00ffff'});
  const cube = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(0xffffff);
  light.position.set(-10, 10, 10);
  scene.add(light);

  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

module.exports = {
  createGame
}