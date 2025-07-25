import * as THREE from 'three'
import { Water } from 'jsm/objects/Water.js'

export function createWater(scene) {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
  const waterNormals = new THREE.TextureLoader().load('assets/textures/waternormals.jpg', (tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  })

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(0, 0, 0),
    sunColor: 0xffffff,
    waterColor: 0x0f5e9c,
    distortionScale: 6,
    fog: false
  })

  water.rotation.x = -Math.PI / 2
  scene.add(water)
  return water
}
