import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const ROOM_SIZE = 20;
const ROOM_HEIGHT = 6;

const models = [
  {
    path: "http://localhost:5000/uploads/glb/1744782709727-terrace_shop_table.glb",
    name: "Terrace Table",
    description: "Outdoor Table",
    category: "Tables",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744782999699-dining_set.glb",
    name: "Dining Set",
    description: "Complete Dining Set",
    category: "Dining",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744766113326-bed.glb",
    name: "Bed",
    description: "Modern Bed",
    category: "Bedroom",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744768162596-s01_m03.glb",
    name: "Furniture Set",
    description: "Living Room Set",
    category: "Living Room",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744771046559-wooden_tool.glb",
    name: "Wooden Tool",
    description: "Decorative Item",
    category: "Decor",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744771176001-leather_chairgltf.glb",
    name: "Leather Chair",
    description: "Comfortable Chair",
    category: "Seating",
  },
  {
    path: "http://localhost:5000/uploads/glb/1744782035786-wooden_chair_uknjbb2bw_mid.glb",
    name: "Wooden Chair",
    description: "Classic Design",
    category: "Seating",
  },
];

const ThreeDRoom = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const transformControlsRef = useRef(null);
  const draggableObjectsRef = useRef([]);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [placedModels, setPlacedModels] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showInstructions, setShowInstructions] = useState(true);
  const [transformMode, setTransformMode] = useState("translate");
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(0.5);
  const [showGrid, setShowGrid] = useState(true);
  const [groupedModels, setGroupedModels] = useState([]);
  const [dragObject, setDragObject] = useState(null);
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const dragPoint = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();
  const [isRotating, setIsRotating] = useState(false);
  const rotationSpeed = 0.02;
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [modelScale, setModelScale] = useState({ x: 1, y: 1, z: 1 });

  const addModelToScene = (modelData, position) => {
    if (!sceneRef.current) return;

    const loader = new GLTFLoader();
    fetch(modelData.path)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        loader.load(
          url,
          (gltf) => {
            const group = new THREE.Group();
            const model = gltf.scene;
            group.add(model);
            group.userData = { ...modelData, id: Date.now() };

            fitModelToRoom(model, 1.2);
            group.position.set(...position);

            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.flatShading = true;
                  child.material.needsUpdate = true;
                }
              }
            });

            sceneRef.current.add(group);
            draggableObjectsRef.current.push(group);
            setPlacedModels((prev) => [
              ...prev,
              { ...modelData, position, id: group.userData.id },
            ]);

            URL.revokeObjectURL(url);
          },
          undefined,
          (err) => {
            setError(
              `Failed to load model: ${modelData.name} - ${err.message}`
            );
            URL.revokeObjectURL(url);
          }
        );
      })
      .catch((error) => {
        setError(`Failed to fetch model: ${modelData.name} - ${error.message}`);
      });
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    const container = canvasRef.current.parentElement;
    const getContainerSize = () => {
      return {
        width: container.clientWidth,
        height: container.clientHeight,
      };
    };
    let { width, height } = getContainerSize();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(ROOM_SIZE / 2 - 1, 2, 0); // Near right wall, eye level
    camera.lookAt(0, 2, 0); // Look at room center at eye level

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.target.set(0, 2, 0); // Target room center at eye level
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = ROOM_SIZE * 1.5;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.rotateSpeed = 0.7;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(
      ROOM_SIZE * 0.8,
      ROOM_HEIGHT * 1.5,
      ROOM_SIZE * 0.8
    );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = ROOM_SIZE * 4;
    directionalLight.shadow.camera.left = -ROOM_SIZE * 1.5;
    directionalLight.shadow.camera.right = ROOM_SIZE * 1.5;
    directionalLight.shadow.camera.top = ROOM_SIZE * 1.5;
    directionalLight.shadow.camera.bottom = -ROOM_SIZE * 1.5;
    scene.add(directionalLight);

    setupRoom(scene);

    const transformControls = new TransformControls(
      camera,
      renderer.domElement
    );
    transformControlsRef.current = transformControls;
    transformControls.addEventListener("dragging-changed", (event) => {
      controls.enabled = !event.value;
    });
    scene.add(transformControls);

    const onKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "r":
          setIsRotating(true);
          break;
        case "escape":
          setIsRotating(false);
          break;
      }
    };

    const onKeyUp = (event) => {
      if (event.key.toLowerCase() === "r") {
        setIsRotating(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      if (isRotating) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        draggableObjectsRef.current,
        true
      );

      if (intersects.length > 0) {
        let object = intersects[0].object;
        while (object && !draggableObjectsRef.current.includes(object)) {
          object = object.parent;
        }
        if (object && draggableObjectsRef.current.includes(object)) {
          setSelectedModel(object.userData);
          setDragObject(object);

          if (transformControlsRef.current) {
            transformControlsRef.current.detach();
          }

          raycaster.ray.intersectPlane(dragPlane, dragPoint);
          dragOffset.copy(object.position).sub(dragPoint);

          setIsDragging(true);
          controls.enabled = false;

          object.traverse((child) => {
            if (child.isMesh) {
              child.material.emissive = new THREE.Color(0x666666);
            }
          });

          setModelPosition({
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
          });
          setModelRotation({
            x: (object.rotation.x * 180) / Math.PI,
            y: (object.rotation.y * 180) / Math.PI,
            z: (object.rotation.z * 180) / Math.PI,
          });
          setModelScale({
            x: object.scale.x,
            y: object.scale.y,
            z: object.scale.z,
          });
        }
      } else {
        setSelectedModel(null);
        setDragObject(null);
        draggableObjectsRef.current.forEach((obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              child.material.emissive = new THREE.Color(0x000000);
            }
          });
        });
        if (transformControlsRef.current) {
          transformControlsRef.current.detach();
        }
      }
    };

    const onPointerMove = (event) => {
      if (isRotating) {
        scene.rotation.y += rotationSpeed;
        return;
      }

      if (!isDragging || !dragObject) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(dragPlane, dragPoint);

      const newPosition = dragPoint.add(dragOffset);
      const halfRoomSize = ROOM_SIZE / 2 - 0.5;
      newPosition.x = Math.max(
        -halfRoomSize,
        Math.min(halfRoomSize, newPosition.x)
      );
      newPosition.z = Math.max(
        -halfRoomSize,
        Math.min(halfRoomSize, newPosition.z)
      );
      newPosition.y = 0;

      dragObject.position.copy(newPosition);
      setModelPosition({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
      });
    };

    const onPointerUp = () => {
      if (isDragging && dragObject) {
        if (transformControlsRef.current) {
          transformControlsRef.current.attach(dragObject);
        }
      }
      setIsDragging(false);
      setDragObject(null);
      controls.enabled = true;
      draggableObjectsRef.current.forEach((obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x000000);
          }
        });
      });
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const handleResize = () => {
      const { width, height } = getContainerSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      scene.clear();
      sceneRef.current = null;
      if (transformControlsRef.current) {
        transformControlsRef.current.detach();
      }
    };
  }, []);

  const handleModelSelect = (model) => {
    const position = [0, 0, 0];
    addModelToScene(model, position);
  };

  const handleTransformModeChange = (mode) => {
    setTransformMode(mode);
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode);
    }
  };

  const handleGroupModels = () => {
    if (selectedModel) {
      const selectedObjects = draggableObjectsRef.current.filter(
        (obj) => obj.userData.id === selectedModel.id
      );

      if (selectedObjects.length > 1) {
        const group = new THREE.Group();
        selectedObjects.forEach((obj) => {
          group.add(obj);
          draggableObjectsRef.current = draggableObjectsRef.current.filter(
            (o) => o !== obj
          );
        });

        sceneRef.current.add(group);
        draggableObjectsRef.current.push(group);
        setGroupedModels((prev) => [...prev, group]);
      }
    }
  };

  const handleUngroupModels = () => {
    if (selectedModel && groupedModels.includes(selectedModel)) {
      const children = [...selectedModel.children];
      selectedModel.remove(...children);
      children.forEach((child) => {
        sceneRef.current.add(child);
        draggableObjectsRef.current.push(child);
      });

      setGroupedModels((prev) => prev.filter((g) => g !== selectedModel));
    }
  };

  const handleDuplicateModel = () => {
    if (!selectedModel) return;

    const original = draggableObjectsRef.current.find(
      (obj) => obj.userData.id === selectedModel.id
    );
    if (!original) return;

    const clone = original.clone();
    clone.position.x += 1;
    clone.userData = { ...original.userData, id: Date.now() };

    sceneRef.current.add(clone);
    draggableObjectsRef.current.push(clone);
    setPlacedModels((prev) => [
      ...prev,
      {
        ...clone.userData,
        position: [clone.position.x, clone.position.y, clone.position.z],
      },
    ]);

    transformControlsRef.current.attach(clone);
    setSelectedModel(clone.userData);
  };

  const handleModelTransform = (mode) => {
    setTransformMode(mode);
    if (transformControlsRef.current && selectedModel) {
      transformControlsRef.current.setMode(mode);
    }
  };

  const updateModelPosition = (axis, value) => {
    if (!selectedModel) return;

    const object = draggableObjectsRef.current.find(
      (obj) => obj.userData.id === selectedModel.id
    );
    if (!object) return;

    const newPosition = { ...modelPosition, [axis]: parseFloat(value) || 0 };
    object.position[axis] = newPosition[axis];
    setModelPosition(newPosition);
  };

  const updateModelRotation = (axis, value) => {
    if (!selectedModel) return;

    const object = draggableObjectsRef.current.find(
      (obj) => obj.userData.id === selectedModel.id
    );
    if (!object) return;

    const newRotation = { ...modelRotation, [axis]: parseFloat(value) || 0 };
    object.rotation[axis] = (newRotation[axis] * Math.PI) / 180;
    setModelRotation(newRotation);
  };

  const updateModelScale = (axis, value) => {
    if (!selectedModel) return;

    const object = draggableObjectsRef.current.find(
      (obj) => obj.userData.id === selectedModel.id
    );
    if (!object) return;

    const newScale = { ...modelScale, [axis]: parseFloat(value) || 1 };
    object.scale[axis] = newScale[axis];
    setModelScale(newScale);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex overflow-hidden">
      <div className="flex-1 relative bg-white shadow-md">
        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-gray-200"
            aria-label="3D Room Canvas"
          />
        </div>

        {isRotating && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
            Room Rotation Active - Release 'R' to stop
          </div>
        )}

        {error && (
          <div
            className={`absolute ${
              isRotating ? "top-16" : "top-4"
            } left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-10`}
          >
            {error}
          </div>
        )}
      </div>

      <div className="w-96 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Room Designer
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {showInstructions && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  How to Use:
                </h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Click and drag objects to move them</li>
                  <li>
                    Use transform controls to move, rotate, or scale objects
                  </li>
                  <li>Hold 'R' key to rotate the room</li>
                  <li>Press 'ESC' to stop rotation</li>
                  <li>Click an object to select it</li>
                </ul>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  Hide Instructions
                </button>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {["All", ...new Set(models.map((m) => m.category))].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      aria-pressed={activeCategory === category}
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Furniture
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {models
                  .filter(
                    (model) =>
                      activeCategory === "All" ||
                      model.category === activeCategory
                  )
                  .map((model) => (
                    <div
                      key={model.name}
                      onClick={() => handleModelSelect(model)}
                      onMouseEnter={() => setHoveredModel(model.name)}
                      onMouseLeave={() => setHoveredModel(null)}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleModelSelect(model)
                      }
                      aria-label={`Add ${model.name} to room`}
                    >
                      <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                        <span className="text-gray-600 text-sm text-center">
                          {model.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {model.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {selectedModel && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Model Controls
                </h3>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Position
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["x", "y", "z"].map((axis) => (
                      <div key={axis} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                          {axis.toUpperCase()}
                        </label>
                        <input
                          type="number"
                          value={modelPosition[axis]}
                          onChange={(e) =>
                            updateModelPosition(axis, e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border rounded"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Rotation (degrees)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["x", "y", "z"].map((axis) => (
                      <div key={axis} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                          {axis.toUpperCase()}
                        </label>
                        <input
                          type="number"
                          value={modelRotation[axis]}
                          onChange={(e) =>
                            updateModelRotation(axis, e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border rounded"
                          step="1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Scale
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["x", "y", "z"].map((axis) => (
                      <div key={axis} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                          {axis.toUpperCase()}
                        </label>
                        <input
                          type="number"
                          value={modelScale[axis]}
                          onChange={(e) =>
                            updateModelScale(axis, e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border rounded"
                          step="0.1"
                          min="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {placedModels.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Placed Items
                </h3>
                <div className="flex flex-col gap-2">
                  {placedModels.map((model) => (
                    <div
                      key={model.id}
                      className={`p-3 rounded-md flex justify-between items-center ${
                        selectedModel?.id === model.id
                          ? "bg-blue-50"
                          : "bg-white"
                      } shadow-sm border border-gray-200`}
                    >
                      <span className="text-sm text-gray-700">
                        {model.name}
                      </span>
                      <button
                        onClick={() => {
                          const object = draggableObjectsRef.current.find(
                            (obj) => obj.userData.id === model.id
                          );
                          if (object) {
                            sceneRef.current.remove(object);
                            draggableObjectsRef.current =
                              draggableObjectsRef.current.filter(
                                (obj) => obj !== object
                              );
                            setPlacedModels((prev) =>
                              prev.filter((m) => m.id !== model.id)
                            );
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Remove ${model.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const setupRoom = (scene) => {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
    new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const wallGeo = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT);

  const createWall = (x, y, z, rotY) => {
    const wall = new THREE.Mesh(wallGeo, wallMaterial);
    wall.position.set(x, y, z);
    wall.rotation.y = rotY;
    wall.receiveShadow = true;
    scene.add(wall);
  };

  createWall(0, ROOM_HEIGHT / 2, -ROOM_SIZE / 2, 0);
  createWall(0, ROOM_HEIGHT / 2, ROOM_SIZE / 2, Math.PI);
  createWall(-ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0, Math.PI / 2);
  createWall(ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0, -Math.PI / 2);

  const gridHelper = new THREE.GridHelper(ROOM_SIZE, 40, 0x000000, 0x000000);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);
};

const fitModelToRoom = (model, maxSize = 1.2) => {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxSize / maxDim;
  model.scale.setScalar(scale);
};

export default ThreeDRoom;
