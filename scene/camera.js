import * as THREE from 'three'

export function createCamera() {
  const fov = 75
  const near = 0.1
  const far = 3000
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far) // width / height = aspect ratio
  camera.position.set(-70, 20, 0)

  return camera
}
