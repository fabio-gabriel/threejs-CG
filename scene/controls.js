import { OrbitControls } from "jsm/controls/OrbitControls.js"

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.03

  return controls
}