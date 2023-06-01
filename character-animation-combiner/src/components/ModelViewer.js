import React, { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import { RoughnessMipmapper } from "three/examples/jsm/utils/RoughnessMipmapper";
import setCamera from "../helpers/setCamera";
import setControls from "../helpers/setControls";
import setLights from "../helpers/setLights";
import resizeWindow from "../helpers/resizeWindow";
import loadModel from "../helpers/loadModel";
import { Context as ModalContext } from "../context/ModelContext";

const ModelViewer = ({ model, fileExt }) => {
  const viewer = useRef(null);
  const {
    addMainModel,
    addAnimationFromMainModel,
    addMixer,
    toggleLoading,
  } = useContext(ModalContext);

  useEffect(() => {
    if (!model) return;
    const clock = new THREE.Clock();
    const { current } = viewer;
    const scene = new THREE.Scene();
    const camera = setCamera(current);
    let mixer = null;

    //=================================================>
    // Init renderer
    //=================================================>
    const renderer = new THREE.WebGLRenderer();
    resizeWindow(camera, current, renderer);
    if (current.children.length) current.removeChild(current.lastChild);
    current.appendChild(renderer.domElement);

    // ground
    var mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.position.y = -80;
    scene.add(mesh);

    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.position.y = -80;
    scene.add(grid);

    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    var roughnessMipmapper = new RoughnessMipmapper(renderer);
    toggleLoading();
    loadModel(model, fileExt, (object) => {
      toggleLoading();
      object.animations.forEach((anim) => {
        if (anim.name === "Take 001") {
          anim.name = "T-Pose (No Animation)";
        }
      });

      let mainModel = fileExt === "fbx" ? object : object.scene;

      scene.add(mainModel);

      // Add main model in reducer
      addMainModel(mainModel);
      // add animation if there any
      if (object.animations.length)
        addAnimationFromMainModel(object.animations);

      mixer = new THREE.AnimationMixer(
        fileExt === "fbx" ? object : object.scene
      );
      addMixer(mixer);
      roughnessMipmapper.dispose();
    });

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    setControls(camera, current);
    setLights(scene);
    scene.background = new THREE.Color(0xa0a0a0);
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);

    //=================================================>
    // Resize listener
    //=================================================>

    window.addEventListener("resize", () =>
      resizeWindow(camera, current, renderer)
    );

    //=================================================>
    // Animate on frame update
    //=================================================>
    var animate = function () {
      requestAnimationFrame(animate);
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return <div style={{ height: "90vh" }} ref={viewer}></div>;
};

export default ModelViewer;
