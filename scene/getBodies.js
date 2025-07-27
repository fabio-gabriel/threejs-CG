import * as THREE from "three";

function getBody(RAPIER, world, model, translation, scale, randomPositions = false) {
    const boundingBox = new THREE.Box3() // Find object's size
    boundingBox.setFromObject(model)
    const size = new THREE.Vector3()
    boundingBox.getSize(size)

    const colliderSize = size;
    const range = 200;
    const density = scale;
    let x = Math.random() * range - range / 2;
    let y = Math.random() * 0.01 + 5;
    let z = Math.random() * range - range / 2;

    let rigidBodyDesc = null
    if (randomPositions) {{
        rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
    }} else {
        rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation[0], translation[1], translation[2])
    }
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(colliderSize.x, colliderSize.y, colliderSize.z).setDensity(density);
    world.createCollider(colliderDesc, rigid);

    const mesh = model.clone();
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    mesh.scale.setScalar(scale);
    
    function update (t) {
      rigid.resetForces(true);
      let pos = rigid.translation();
      mesh.position.copy(pos);
      let q = rigid.rotation();
      let rote = new THREE.Quaternion(q.x, q.y, q.z, q.w);
      mesh.rotation.setFromQuaternion(rote);

      // Buoyancy Calculation 
      const shipBottomY = pos.y; // Approximate bottom of the ship's collider
      let submergedDepth = Math.max(0, 3 - shipBottomY); // How far below water the bottom is. Water level is set to 3 because I am only approximating buoyancy and the values are not perfect.

      // This is a real rough approximation of volume
      const estimatedSubmergedVolume = submergedDepth * (colliderSize.x * colliderSize.z); // Assuming a cube base
      let buoyancyForceMagnitude = estimatedSubmergedVolume * 1000 * Math.abs(9.81); // Buoyancy formula

      // Apply the upward buoyant force
      if (submergedDepth > 0) {
        const waveInfluence = Math.random() * 2 - 1 // Small sine wave for bobbing
        buoyancyForceMagnitude *= (1 + waveInfluence); // Apply variation to the force

        const buoyancyForce = new RAPIER.Vector3(0, buoyancyForceMagnitude, 0);
        rigid.addForce(buoyancyForce, true); 

        const linearVelocity = rigid.linvel();
        const dampingFactor = 0.9; 
        rigid.setLinvel(
            {
                x: linearVelocity.x * dampingFactor,
                y: linearVelocity.y * dampingFactor, // 
                z: linearVelocity.z * dampingFactor
            },
            true
        );
      }
    }
    return { mesh, rigid, update };
  }

  export { getBody };