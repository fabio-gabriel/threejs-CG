import * as THREE from "three"
import { createCamera } from "./scene/camera.js"
import { createControls } from "./scene/controls.js"
import { loadEnvironment } from "./scene/environment.js"
import { createWater } from "./scene/water.js"
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js"

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = createCamera()
const controls = createControls(camera, renderer)

const scene = new THREE.Scene()

let water
loadEnvironment(scene, 'assets/hdr/secluded_beach_2k.hdr', () => {water = createWater(scene)})  // Custom shader from three.js for water

const loader = new GLTFLoader()
loader.load('assets/models/empty_ship.glb', (gltf) => {
  const ship = gltf.scene
  ship.scale.set(0.1, 0.1, 0.1)  // adjust as needed
  ship.position.set(0, 2, -7)
  ship.traverse(child => {
    child.castShadow = true
    child.receiveShadow = true
  })
  scene.add(ship)

  // Optionally attach Rapier rigid body here later
})

function animate(t = 0) {
    requestAnimationFrame(animate)
    if (water) water.material.uniforms['time'].value += 0.5 / 60.0 // water
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.5)
    renderer.render(scene, camera)
    controls.update()
}

animate()