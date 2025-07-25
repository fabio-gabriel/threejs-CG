import * as THREE from "three"
import { createCamera } from "./scene/camera.js"
import { createControls } from "./scene/controls.js"
import { loadEnvironment } from "./scene/environment.js"
import { createWater } from "./scene/water.js"

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = createCamera()
const controls = createControls(camera, renderer)

const scene = new THREE.Scene()

let water
loadEnvironment(scene, 'assets/hdr/secluded_beach_2k.hdr', () => {water = createWater(scene)}) 

const geo = new THREE.IcosahedronGeometry(1.0, 2)
const mat = new THREE.MeshStandardMaterial({
    color: 0xccff,
    flatShading: true
})
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xccff,
    wireframe: true
})

const wireMesh = new THREE.Mesh(geo, wireMat)
wireMesh.scale.setScalar(1.001)
mesh.add(wireMesh)

function animate(t = 0) {
    requestAnimationFrame(animate)
    mesh.rotation.y = t * 0.001
    mesh.rotation.x = t * 0.001
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.5)
    renderer.render(scene, camera)
    controls.update()
}

animate()