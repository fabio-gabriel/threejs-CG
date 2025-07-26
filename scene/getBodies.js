import * as THREE from "three";

function getBody(RAPIER, world, model, translation, scale, randomPositions = false) {
    const colliderSize = scale * 0.5;
    const range = 200;
    const density = scale * 1;
    let x = Math.random() * range - range / 2;
    let y = Math.random() * 0.01 + 5;
    let z = Math.random() * range - range / 2;

    // RIGID BODY
    let rigidBodyDesc = null
    if (randomPositions) {{
        rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
    }} else {
        rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(translation[0], translation[1], translation[2])
    }
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.cuboid(colliderSize, colliderSize, colliderSize).setDensity(density);
    world.createCollider(colliderDesc, rigid);

    const mesh = model.clone();
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    mesh.scale.setScalar(scale);
    
    function update () {
      rigid.resetForces(true);
      let pos = rigid.translation();
      mesh.position.copy(pos);
      let q = rigid.rotation();
      let rote = new THREE.Quaternion(q.x, q.y, q.z, q.w);
      mesh.rotation.setFromQuaternion(rote);

      // --- Buoyancy Calculation ---
      const shipBottomY = pos.y - (colliderSize * 0.5); // Approximate bottom of the ship's collider
      let submergedDepth = Math.max(0, 3.5 - shipBottomY); // How far below water the bottom is. Water level is 0 so we calculate 0 - shipBottomY

      // This is rough; a proper calculation would involve submerged volume.
      const estimatedSubmergedVolume = submergedDepth * (colliderSize * colliderSize); // Assuming a cuboid base
      const buoyancyForceMagnitude = estimatedSubmergedVolume * 0.001 * Math.abs(9.81);

      // Apply the upward buoyant force
      // You can adjust the Y component of force based on how much you want it to float
      const buoyancyForce = new RAPIER.Vector3(0, buoyancyForceMagnitude, 0);
      rigid.applyImpulse(buoyancyForce, true); // applyImpulse or applyForce, depending on your timestep handling

      const linearVelocity = rigid.linvel();
        const dampingFactor = 0.9; // A value between 0 and 1. 0.9 means 10% velocity reduction per step.
                                // Larger values (closer to 1) mean more damping.
                                // For subtle damping, try 0.95 to 0.99.

        // Reduce the velocity directly
        rigid.setLinvel(
            {
                x: linearVelocity.x * dampingFactor,
                y: linearVelocity.y * dampingFactor, // Apply damping to Y velocity
                z: linearVelocity.z * dampingFactor
            },
            true // Wake up the body
        );

// console.log should now show decreasing velocity
    console.log(`Damped Velocity: Y=${rigid.linvel().y.toFixed(4)}`);
    //   rigid.applyImpulse(dampingForce, true);

    // Resets the ship back into the scene
    //   if (pos.y < -10) {
    //     rigid.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    //     rigid.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    //     rigid.setTranslation({ x: x, y: 10.0, z: z });
    //   }
    }
    return { mesh, rigid, update };
  }

  export { getBody };