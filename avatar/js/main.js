import {} from './../node_modules/three/build/three.js';
import {} from "./../node_modules/three/examples/js/loaders/GLTFLoader.js";

let scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
  renderer = new THREE.WebGLRenderer(),
  model,
  anims,
  mixer;
  
  
init();
update();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function init(){
  const backgroundColour = 0xf1f1f1;

  //init scene
  scene.background = new THREE.Color(backgroundColour);
  scene.fog = new THREE.Fog(backgroundColour, 60, 100);

  // Init the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);//Set the render area size
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Add lights
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  let d = 8.25;
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 1500;
  dirLight.shadow.camera.left = d * -1;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = d * -1;
  scene.add(dirLight);

  //init floor
  let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  let floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    //color: 0xff0000,
    shininess: 0,
  });
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
  floor.receiveShadow = true;
  floor.position.y = -11;
  scene.add(floor);

  //init camera
  camera.position.z = 30;
  camera.position.x = 0;
  camera.position.y = -3;

  //init model
  const MODEL_PATH = '/avatar/avatars/basic_rpm.glb';
  glbLoader(MODEL_PATH);

  //init mixer
  mixer = new THREE.AnimationMixer(model);
}


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

      model.scale.set(10,10,10);

      model.position.y = -11;

      scene.add(model);
    }
  ),
  undefined,
  function(error){
    console.error(error);
  };

}

function update() {
  if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
  const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
      renderer.setSize(width, height, false);
  }
  return needResize;
}

function render() {
  renderer.render(scene,camera);
}