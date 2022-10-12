import {} from "/node_modules/three/build/three.js";
import {} from "/node_modules/three/src/math/MathUtils.js";
import {} from "/node_modules/three/examples/js/loaders/GLTFLoader.js";
import {} from "/node_modules/three/examples/js/loaders/DRACOLoader.js";
import {} from "/node_modules/three/examples/js/controls/OrbitControls.js";
//https://github.com/JChehe/blog/issues/45

//构建场景
(function() {
    // Set our main variables
    let scene,  
      renderer,
      camera,
      model,                              // Our character
      neck,                               // Reference to the neck bone in the skeleton
      waist,                               // Reference to the waist bone in the skeleton
      possibleAnims,                      // Animations found in our file
      mixer,                              // THREE.js animations mixer
      idle,                               // Idle, the default state our character returns to
      clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
      currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
      raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
      loaderAnim = document.getElementById('js-loader');
    
    const MODEL_PATH = '/glbs/Avatar_jt.glb';  
    init(); 
    update();
    var controls = new THREE.OrbitControls(camera,renderer.domElement);//Create a control object
    controls.addEventListener('change', render);//Monitor mouse and keyboard events

    function render() {
        renderer.render(scene,camera);//do the render job
        //update()
    }

    function init() {
        const canvas = document.querySelector('#c');
        const backgroundColor = 0xf1f1f1;
        
        //Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        scene.fog = new THREE.Fog(backgroundColor, 60, 100);

        // Add a camera
        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 30 
        camera.position.x = 0;
        camera.position.y = -3;

        //使用 GLTFLoader 加载模型
        var loader = new THREE.GLTFLoader();
        loader.load(
            MODEL_PATH,
            function(gltf) {
                // A lot is going to happen here,这里是模型加载后会执行的地方。除非特别声明，否则接下来所有东西都放在该函数内。
                model = gltf.scene;
                let fileAnimations = gltf.animations;

                //使用模型的 traverse 方法遍历所有网格（mesh）以启用投射和接收阴影的能力。该操作需要在 scene.add(model) 前完成。
                model.traverse(o => {
                    //console.log(o);
                    //利用 o.isBone console 所有骨头
                    if (o.isBone) {
                        console.log(o.name);
                        }
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                    }
                    // Reference the neck and waist bones,在模型的 traverse 方法，将这两个骨头赋值给相应变量（已在项目顶部声明）。
                    if (o.isBone && o.name === 'Neck') { 
                        neck = o;
                    }
                    if (o.isBone && o.name === 'Spine') { 
                        waist = o;
                    }
                });
                // Set the models initial scale
                model.scale.set(10, 10, 10);
                //将模型向下移动 11 个单位，以保证它是站在地板上的。
                model.position.y = -11;

                scene.add(model);

                //删除原有动画层
                loaderAnim.remove();
                //AnimationMixer，它是用于播放场景中特定对象动画的播放器
                mixer = new THREE.AnimationMixer(model);
                //通过 fileAnimations 查找一个名为 idle（空闲）的动画。这个名字是在 Blender 中设置的
                // let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                // idle = mixer.clipAction(idleAnim);
                // idle.play();

 
            
            },
            undefined, // We don't need this function
            function(error) {
              console.error(error);
            }
          );



        // Init the renderer
        //renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);//Set the render area size
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
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
        // Add directional Light to scene
        scene.add(dirLight);
        
        // Floor
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

    document.addEventListener('mousemove', function(e) {
        var mousecoords = getMousePos(e);
        if (neck && waist) {
            moveJoint(mousecoords, neck, 50);
            moveJoint(mousecoords, waist, 30);
        }
      });
      
    function getMousePos(e) {
        return { x: e.clientX, y: e.clientY };
    }

    //moveJoint 函数接收 3 个参数，分别是：当前鼠标的位置，需要移动的关节和允许关节旋转的角度范围。
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

})(); // Don't add anything below this line

