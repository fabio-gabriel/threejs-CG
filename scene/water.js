import * as THREE from 'three'
import { Water } from 'jsm/objects/Water.js'

export function createWater(scene) {
  const waterGeometry = new THREE.PlaneGeometry(100, 100)
  const waterNormals = new THREE.TextureLoader().load('assets/textures/waternormals.jpg', (tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  })

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 6,
    fog: false
  })

  water.rotation.x = -Math.PI / 2
  scene.add(water)
  return water
}
