import {} from './../node_modules/three/build/three.js';
import {} from "./../node_modules/three/examples/js/loaders/GLTFLoader.js";
//import {} from "./../node_modules/three/examples/js/controls/OrbitControls.js";
import {} from "./../node_modules/three/examples/js/controls/PointerLockControls.js";
import {} from "./../node_modules/three/examples/js/objects/Reflector.js";
import {VRButton} from './../node_modules/three/examples/jsm/webxr/VRButton.js';

function glbLoader(MODEL_PATH){
  var loader = new THREE.GLTFLoader();

  loader.load(
    MODEL_PATH,
    function(gltf){
      model = gltf.scene;
      anims = gltf.animations;

      //model traverse
      model.traverse(obj => {
        // if(obj.isBone){
        //   console.log(obj.name);
        // }

        if(obj.isMesh){
          obj.castShadow = true;
          obj.receiveShadow = true;
        }

        if (obj.isBone && obj.name === 'Neck') { 
          neck = obj;
        }
        if (obj.isBone && obj.name === 'Spine') { 
          waist = obj;
        }
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

let scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
  renderer = new THREE.WebGLRenderer(),
  model,
  anims,
  mixer;
  
let neck, waist;
  
//enable xr rendering
renderer.xr.enabled = true;

init();
update();

var controls = new THREE.PointerLockControls(camera,renderer.domElement)
document.addEventListener('keydown', moveAvatar);//Monitor mouse and keyboard events
function moveAvatar(e){
  var xSpeed = 1;
  var ySpeed = 1;
  var keyCode = e.which;
  console.log(keyCode)
  if (keyCode == 87) {
    camera.position.z += ySpeed;
    model.position.z += ySpeed;
  } else if (keyCode == 83) {
    camera.position.z -= ySpeed;
    model.position.z -= ySpeed;
  } else if (keyCode == 65) {
    camera.position.x += xSpeed;
    model.position.x += xSpeed;
  } else if (keyCode == 68) {
    camera.position.x -= xSpeed;
    model.position.x -= xSpeed;
  } else if (keyCode == 32) {
    console.log('spacebar clicked')
  }
  render()
}
// document.addEventListener('mousemove', function(e) {
//   var mousecoords = getMousePos(e);
//   if (neck && waist) {
//       moveJoint(mousecoords, neck, 50);//degreeLimit to 50
//       moveJoint(mousecoords, waist, 30);
//   }
// });


renderer.setSize( window.innerWidth, window.innerHeight );
//add vr button
document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild( renderer.domElement );

function render() {
  renderer.render(scene,camera);
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
    color: 0xFF6600,
    //color: 0xff0000,
    shininess: 0,
  });
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
  floor.receiveShadow = true;
  floor.position.y = -11;
  scene.add(floor);

  //init camera
  camera.position.set(0,7,1);
  camera.rotateY(Math.PI)

  //init model
  const MODEL_PATH = '/avatar/avatars/basic_rpm.glb';
  glbLoader(MODEL_PATH);

  //init mixer
  mixer = new THREE.AnimationMixer(model);


  //init mirror
  const mirrorOption = {
    clipBias: 0.000,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 2734335,
    mulitisample: 4,
    border: 2
  }
  const mirrorGeometry = new THREE.BoxGeometry( 30, 30,1); 

  const mirror = new THREE.Reflector(mirrorGeometry, mirrorOption);
  // const mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
  // const mirrorMesh = new THREE.Mesh( mirrorGeometry, mirrorMaterial ); 
  mirror.rotateX(Math.PI);
  mirror.position.set(0, -3, 10);
  scene.add( mirror );
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

function getMousePos(e) {
  return { x: e.clientX, y: e.clientY };
}

//moveJoint
function moveJoint(mouse, joint, degreeLimit) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
  joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
}

function getMouseDegrees(x, y, degreeLimit) {
  let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;
  
  let w = { x: window.innerWidth, y: window.innerHeight };
  
  // Left (Rotates neck left between 0 and -degreeLimit)
  
      // 1. If cursor is in the left half of screen
  if (x <= w.x / 2) {
      // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x;  
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100;
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1; }
  // Right (Rotates neck right between 0 and degreeLimit)
  if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
  }
  // Up (Rotates neck up between 0 and -degreeLimit)
  if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      // Note that I cut degreeLimit in half when she looks up
      dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
      }
  
  // Down (Rotates neck down between 0 and degreeLimit)
  if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
  }
  return { x: dx, y: dy };
}

