import * as THREE from "three"
import { OrbitControls } from "jsm/controls/OrbitControls.js"
import { RGBELoader } from 'jsm/loaders/RGBELoader.js'

const w = window.innerWidth
const h = window.innerHeight
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

const fov = 75
const aspect = w / h
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2
const scene = new THREE.Scene()

const rgbeLoader = new RGBELoader()
rgbeLoader.load(
  'assets/hdr/secluded_beach_2k.hdr',
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  }
)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.03

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

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000)
scene.add(hemiLight)

const groundGeo = new THREE.PlaneGeometry(10, 10)
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x555555,
  roughness: 0.05,
  metalness: 1.0
})
const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2 // rotate to lie flat
ground.position.y = -1 
ground.receiveShadow = true 
scene.add(ground)


function animate(t = 0) {
    requestAnimationFrame(animate)
    mesh.rotation.y = t * 0.001
    mesh.rotation.x = t * 0.001
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.5)
    renderer.render(scene, camera)
    controls.update()
}

animate()