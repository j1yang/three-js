import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

let camera, scene, renderer, mixer, clock;
let model;
init();
animate();

function init() {
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(2, 4, 6);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);

  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "https://models.readyplayer.me/64775bf7c16b82b1e6bab280.glb",
    function (gltf) {
      model = gltf.scene;

      //console.log(model);
      mixer = new THREE.AnimationMixer(gltf.scene);

      //console.log(model);
      scene.add(model);
      console.log(gltf.scene);
      gltf.scene.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  );

  const fbxLoader = new FBXLoader();
  fbxLoader.load("/res/Taunt (1).fbx", function (fbx) {});
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  // console.log(camera.position);
}

function render() {
  const delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
