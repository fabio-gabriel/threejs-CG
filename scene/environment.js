import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export function loadEnvironment(scene, path, callback = () => {}) {
  const loader = new RGBELoader()
  loader.load(path, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture // Immage-Based Lighting (IBL)
    scene.environmentIntensity = 0.6 // Reduce intensity of scene lighting
    callback(texture)
  })
}