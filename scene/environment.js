import * as THREE from 'three'
import { RGBELoader } from 'jsm/loaders/RGBELoader.js'

export function loadEnvironment(scene, path, callback = () => {}) {
  const loader = new RGBELoader()
  loader.load(path, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
    callback(texture)
  })
}