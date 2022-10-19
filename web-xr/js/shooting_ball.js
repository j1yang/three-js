import {} from './../node_modules/three/build/three.js';
import {VRButton} from './../node_modules/three/examples/jsm/webxr/VRButton.js';


//init base
let camera, scene, renderer;

//init xr
let controller1, controller2;
let controllerGrip1, controllerGrip2;

//init vr room
let room;

let count = 0;
const radius = 0.08;
let normal = new THREE.Vector3();
const relativeVelocity = new THREE.Vector3();

const clock = new THREE.Clock();

function init() {
  scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
	camera.position.set( 0, 1.6, 3 );

	room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);
	room.geometry.translate( 0, 3, 0 );
	scene.add( room );

	scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

	const light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	const geometry = new THREE.IcosahedronGeometry( radius, 3 );

	for ( let i = 0; i < 200; i ++ ) {

		const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

		object.position.x = Math.random() * 4 - 2;
		object.position.y = Math.random() * 4;
		object.position.z = Math.random() * 4 - 2;

		object.userData.velocity = new THREE.Vector3();
		object.userData.velocity.x = Math.random() * 0.01 - 0.005;
		object.userData.velocity.y = Math.random() * 0.01 - 0.005;
		object.userData.velocity.z = Math.random() * 0.01 - 0.005;

		room.add( object );

	}

        //

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	document.body.appendChild( renderer.domElement );

	//

	document.body.appendChild( VRButton.createButton( renderer ) );

	// controllers

	function onSelectStart() {

		this.userData.isSelecting = true;

	}

	function onSelectEnd() {

		this.userData.isSelecting = false;

	}

	controller1 = renderer.xr.getController( 0 );
	controller1.addEventListener( 'selectstart', onSelectStart );
	controller1.addEventListener( 'selectend', onSelectEnd );
	controller1.addEventListener( 'connected', function ( event ) {

		this.add( buildController( event.data ) );

	} );
	controller1.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );
	scene.add( controller1 );

	controller2 = renderer.xr.getController( 1 );
	controller2.addEventListener( 'selectstart', onSelectStart );
	controller2.addEventListener( 'selectend', onSelectEnd );
	controller2.addEventListener( 'connected', function ( event ) {

		this.add( buildController( event.data ) );

	} );
	controller2.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );
	scene.add( controller2 );

	// The XRControllerModelFactory will automatically fetch controller models
	// that match what the user is holding as closely as possible. The models
	// should be attached to the object returned from getControllerGrip in
	// order to match the orientation of the held device.

	const controllerModelFactory = new XRControllerModelFactory();

	controllerGrip1 = renderer.xr.getControllerGrip( 0 );
	controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
	scene.add( controllerGrip1 );

  controllerGrip2 = renderer.xr.getControllerGrip( 1 );
	controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
	scene.add( controllerGrip2 );

	//

	window.addEventListener( 'resize', onWindowResize );
}

function buildController( data ) {

  let geometry, material;

  switch ( data.targetRayMode ) {

    case 'tracked-pointer':

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

      material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

      return new THREE.Line( geometry, material );

    case 'gaze':

      geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
      return new THREE.Mesh( geometry, material );

  }

}