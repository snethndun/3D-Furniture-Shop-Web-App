import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";

const FurnitureModel = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);

  return (
    <Canvas style={{ height: "400px", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[12, 10, 10]}
        angle={0.15}
        intensity={1}
        castShadow
      />

      {/* Add environment lighting */}
      <Environment preset="city" />

      <Center>
        <primitive object={scene} />
      </Center>

      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};

export default FurnitureModel;
