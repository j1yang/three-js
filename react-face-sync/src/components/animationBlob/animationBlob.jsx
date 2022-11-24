import React from 'react';
import {
  Sphere,
  MeshDistortMaterial,
  OrbitControls
} from "@react-three/drei";


const AnimationBlob = (props) => {
  return (
    <Sphere args={[1, 100, 100]} scale={[10, 10, 1]} position={[-3, 0, -3]}>
      <OrbitControls enableZoom={true} />
      <MeshDistortMaterial
        color="#CE6D39"
        distort={0.5}
        speed={1.8}
        roughness={0}
      />
    </Sphere>
  );
};

export default AnimationBlob;