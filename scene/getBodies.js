import * as THREE from "three";

function getBody(RAPIER, world, model, translation, scale, randomPositions = false) {
    const mesh = model.clone();
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    mesh.scale.setScalar(scale);
  
    const boundingBox = new THREE.Box3() // Find object's size
    boundingBox.setFromObject(mesh)
    const modelSize = new THREE.Vector3()
    boundingBox.getSize(modelSize)

    const colliderHalfExtents = {
        x: modelSize.x * 0.5,
        y: modelSize.y * 0.5,
        z: modelSize.z * 0.5
    };

    const range = 200;
    const density = scale * 10; // Try to find a more realistic weight/density

    // For multiple ships
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
    let colliderDesc = RAPIER.ColliderDesc.cuboid(colliderHalfExtents.x, colliderHalfExtents.y, colliderHalfExtents.z).setDensity(density);
    world.createCollider(colliderDesc, rigid);
    
    function update (t) {
      rigid.resetForces(true);
      let pos = rigid.translation();
      mesh.position.copy(pos);
      let q = rigid.rotation();
      let rote = new THREE.Quaternion(q.x, q.y, q.z, q.w);
      mesh.rotation.setFromQuaternion(rote);

      // Buoyancy Calculation 
      const shipBottomY = pos.y; // Approximate bottom of the ship's collider
      let submergedDepth = Math.max(0, 3 - shipBottomY); // How far below water the bottom is. Water level is set to 3 because density is not uniform throughout a real ship and it needs to be there to compensate this.

      // This is a real rough approximation of volume
      const estimatedSubmergedVolume = submergedDepth * (modelSize.x * modelSize.z); // Assuming a cube base
      let buoyancyForceMagnitude = estimatedSubmergedVolume * 1000 * Math.abs(9.81); // Buoyancy formula

      // Apply the upward buoyant force
      if (submergedDepth > 0) {
        const waveInfluence = Math.random() * 2 - 1 // Randomize the influence to add some bobbing to simulate waves
        buoyancyForceMagnitude *= (1 + waveInfluence); // Apply variation to the force

        const buoyancyForce = new RAPIER.Vector3(0, buoyancyForceMagnitude, 0);
        rigid.addForce(buoyancyForce, true); 

        const linearVelocity = rigid.linvel();
        const dampingFactor = 0.9; 
        rigid.setLinvel(
            {
                x: linearVelocity.x * dampingFactor,
                y: linearVelocity.y * dampingFactor,
                z: linearVelocity.z * dampingFactor
            },
            true
        );
      }

      // Righting Moment (Torque) Calculation
      const currentRotation = rigid.rotation();
      const currentQuaternion = new THREE.Quaternion(currentRotation.x, currentRotation.y, currentRotation.z, currentRotation.w);

      // Get the normal vector of the ship in world coordinates
      const shipUp = new THREE.Vector3(0, 1, 0).applyQuaternion(currentQuaternion);

      // The target normal vector is simply (0, 1, 0)
        const targetUp = new THREE.Vector3(0, 1, 0);

      // Calculate the angle between the ship's normal and the world's normal
      const angle = shipUp.angleTo(targetUp);

      if (angle > 0.01) { 
          const rotationAxis = new THREE.Vector3().crossVectors(shipUp, targetUp).normalize();

          // The magnitude of the restoring torque
          // This is a simplified model. A more accurate one would involve something called metacentric height (according to wikipedia, I am not a naval engineer)
          const torqueMagnitude = angle * restoringForceMultiplier;

          const rapierTorque = new RAPIER.Vector3(
                rotationAxis.x * torqueMagnitude,
                rotationAxis.y * torqueMagnitude,
                rotationAxis.z * torqueMagnitude
          );
          rigid.addTorque(rapierTorque, true);
        }

        // Angular Damping 
        const angularVelocity = rigid.angvel();
        const angularDampingFactor = 0.9;
        rigid.setAngvel(
            {
                x: angularVelocity.x * angularDampingFactor,
                y: angularVelocity.y * angularDampingFactor,
                z: angularVelocity.z * angularDampingFactor
            },
            true
        );
    }
    return { mesh, rigid, update };
  }

  export { getBody };