import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";

const FurnitureModel = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);

  return (
    <Canvas
      style={{ height: "100%", width: "100%", background: "transparent" }}
      camera={{ position: [0, 2, 5], fov: 50 }}
      gl={{ alpha: true, preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <spotLight
        position={[12, 10, 10]}
        angle={0.15}
        intensity={1}
        castShadow
      />

      {/* Disable HDRI background */}
      <Environment preset="city" background={false} />

      <Center>
        <primitive object={scene} />
      </Center>

      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};

export default FurnitureModel;
