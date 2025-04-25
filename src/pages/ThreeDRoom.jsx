import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ROOM_SIZE = 6;
const ROOM_HEIGHT = 3;

const models = [
  { path: "/chair.glb", position: [-1.5, 0, 0] },
  { path: "/sofa.glb", position: [1, 0, -1] },
  { path: "/table.glb", position: [0, 0, 1] },
];

const ThreeDRoom = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.5, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 6; // limit zoom in/out
    controls.minPolarAngle = 0.9;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    setupLights(scene);
    setupRoom(scene);

    const loader = new GLTFLoader();
    const draggableObjects = [];

    models.forEach(({ path, position }) => {
      loader.load(
        path,
        (gltf) => {
          const group = new THREE.Group(); // create wrapper group
          const model = gltf.scene;
          group.add(model); // add model to group

          fitModelToRoom(model, 1.2);
          group.position.set(...position); // position group instead of model

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(group);
          draggableObjects.push(group); // use group for dragging
        },
        undefined,
        (err) => console.error("Model load error:", err)
      );
    });

    // RAYCASTING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedModel = null;
    let offset = new THREE.Vector3();
    let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const getIntersects = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(draggableObjects, true);
    };

    const onPointerDown = (event) => {
      const intersects = getIntersects(event);
      if (intersects.length > 0) {
        controls.enabled = false;
        // get top group
        selectedModel = intersects[0].object.parent;
        while (
          selectedModel.parent &&
          !draggableObjects.includes(selectedModel)
        ) {
          selectedModel = selectedModel.parent;
        }

        const intersectPoint = intersects[0].point;
        plane.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 1, 0),
          intersectPoint
        );
        offset
          .copy(intersectPoint)
          .sub(selectedModel.getWorldPosition(new THREE.Vector3()));
      }
    };

    const onPointerMove = (event) => {
      if (!selectedModel) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersect = raycaster.ray.intersectPlane(
        plane,
        new THREE.Vector3()
      );

      if (intersect) {
        selectedModel.position.copy(intersect.sub(offset));
        selectedModel.position.y = 0;
      }
    };

    const onPointerUp = () => {
      controls.enabled = true;
      selectedModel = null;
    };

    renderer.domElement.style.cursor = "pointer";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      scene.clear();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "10px" }}>
        Virtual Room Environment
      </h1>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100vw", height: "100vh" }}
      />
    </div>
  );
};

export default ThreeDRoom;

// === UTILITIES ===

const setupLights = (scene) => {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(0, 3, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
};

const setupRoom = (scene) => {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT;
  scene.add(ceiling);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const wallGeo = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT);

  const createWall = (x, y, z, rotY) => {
    const wall = new THREE.Mesh(wallGeo, wallMaterial);
    wall.position.set(x, y, z);
    wall.rotation.y = rotY;
    scene.add(wall);
  };

  createWall(0, ROOM_HEIGHT / 2, -ROOM_SIZE / 2, 0); // Back
  createWall(0, ROOM_HEIGHT / 2, ROOM_SIZE / 2, Math.PI); // Front
  createWall(-ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0, Math.PI / 2); // Left
  createWall(ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0, -Math.PI / 2); // Right
};

const fitModelToRoom = (model, maxSize = 1.2) => {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxSize / maxDim;
  model.scale.setScalar(scale);
};
