import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const ModelViewer = ({ modelPath }) => {
  const model = useGLTF(modelPath);
  return <primitive object={model.scene} dispose={null} />;
};

export default ModelViewer;
