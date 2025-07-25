import * as THREE from 'three'

export function createCamera() {
  const fov = 75
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far) // width / height = aspect ratio
  camera.position.set(0, 2, 5)

  return camera
}
