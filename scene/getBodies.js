import * as THREE from "three";

function getBody(RAPIER, world, model, translation, scale, randomPositions = false) {
    console.log(scale)
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
      if (pos.y < -10) {
        rigid.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        rigid.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        rigid.setTranslation({ x: x, y: 10.0, z: z });
      }
    }
    return { mesh, rigid, update };
  }

  export { getBody };