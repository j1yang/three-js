import {} from './../node_modules/three/build/three.js';
import {} from "./../node_modules/three/examples/js/loaders/GLTFLoader.js";

function glbLoader(MODEL_PATH){
  var loader = new THREE.GLTFLoader();

  loader.load(
    MODEL_PATH,
    function(gltf){
      model = gltf.scene;
      anims = gltf.animations;

      //model traverse
      model.traverse(obj => {
        console.log(obj);
      })
    }
  );

}

function render() {
  renderer.render(scene,camera);
}

function init(){
  const backgroundColour = 0xf1f1f1;

  //init scene
  scene.background = new THREE.Color(backgroundColour);
  scene.fog = new THREE.Fog(backgroundColour, 60, 100);

  //init camera
  camera.position.z = 30;
  camera.position.x = 0;
  camera.position.y = -3;

  //init model
  const MODEL_PATH = '/avatar/avatars/basic_rpm.glb';
  glbLoader(MODEL_PATH);

}

let scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
  renderer = new THREE.WebGLRenderer(),
  model,
  anims,
  mixer;


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

init();