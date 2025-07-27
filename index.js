import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { createCamera } from './scene/camera.js'
import { createControls } from './scene/controls.js'
import { loadEnvironment } from './scene/environment.js'
import { createWater } from './scene/water.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { getShip } from './scene/getShipBody.js'
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Enable shadows 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

const camera = createCamera()
const controls = createControls(camera, renderer)

const scene = new THREE.Scene()
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

// Setting up shadows and a sun light source
const sunLight = new THREE.DirectionalLight(0xffffff, 1.0); // White light, full intensity
sunLight.position.set(20, 20, 20); // Approximating the position of the background's sun with this light source
sunLight.castShadow = true;

const shadowCameraSize = 50; 
sunLight.shadow.camera.left = -shadowCameraSize;
sunLight.shadow.camera.right = shadowCameraSize;
sunLight.shadow.camera.top = shadowCameraSize;
sunLight.shadow.camera.bottom = -shadowCameraSize;
sunLight.shadow.camera.near = 0.1; 
sunLight.shadow.camera.far = 100; 
sunLight.shadow.mapSize.width = 2048; 
sunLight.shadow.mapSize.height = 2048; 
sunLight.shadow.bias = -0.0001; 

scene.add(sunLight);
// scene.add(new THREE.AmbientLight(0xffffff, 0.4)); // Other Light source

let water
loadEnvironment(scene, 'assets/hdr/secluded_beach_2k.hdr', () => {water = createWater(scene)})  // Custom shader from three.js for water

const loader = new GLTFLoader()
const shipGLTF = await loader.loadAsync('assets/models/empty_ship.glb')
const ship = shipGLTF.scene
ship.traverse(child => {
    child.castShadow = true
    child.receiveShadow = true
})

let numBodies = 3;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
    const body = getShip(RAPIER, world, ship, [0, 10 + i *10, -7], 0.1);
    bodies.push(body);
    scene.add(body.mesh);
}

function animate(t = 0) {
    requestAnimationFrame(animate)
    if (water) {water.material.uniforms['time'].value += 0.3 / 60.0} // water
    world.step()
    bodies.forEach(b => b.update(t))
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.5)
    renderer.render(scene, camera)
    controls.update()
}

animate()