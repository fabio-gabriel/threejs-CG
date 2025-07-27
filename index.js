import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { createCamera } from './scene/camera.js'
import { createControls } from './scene/controls.js'
import { loadEnvironment } from './scene/environment.js'
import { createWater } from './scene/water.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { getBody } from './scene/getBodies.js'
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = createCamera()
const controls = createControls(camera, renderer)

const scene = new THREE.Scene()
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

let water
loadEnvironment(scene, 'assets/hdr/secluded_beach_2k.hdr', () => {water = createWater(scene)})  // Custom shader from three.js for water

const loader = new GLTFLoader()
const shipGLTF = await loader.loadAsync('assets/models/empty_ship.glb')
const ship = shipGLTF.scene
ship.traverse(child => {
    child.castShadow = true
    child.receiveShadow = true
})

const numBodies = 1;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
  const body = getBody(RAPIER, world, ship, [0, 10, -7], 0.1);
  bodies.push(body);
  scene.add(body.mesh);
}

function animate(t = 0) {
    requestAnimationFrame(animate)
    if (water) {water.material.uniforms['time'].value += 0.5 / 60.0} // water
    world.step()
    bodies.forEach(b => b.update(t))
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.5)
    renderer.render(scene, camera)
    controls.update()
}

animate()