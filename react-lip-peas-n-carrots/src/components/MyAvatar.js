import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';


const MyAvatar = (props) => {
  // Avatar Reference
  const group = useRef();
  const headRef = useRef();
  const teethRef = useRef();

  // glTF Avatar loads
  const { nodes, materials, animations } = useGLTF("/animated_avatar.glb");
  // Animation loads
  const { actions } = useAnimations(animations, group);

  const [pncViseme, setPncViseme] = useState([
    'viseme_PP', 'viseme_E', 'viseme_SS', 'viseme_E', 'viseme_DD', 'viseme_K', 'viseme_a', 'viseme_RR', 'viseme_O', 'viseme_D', 'viseme_SS'
  ]
  );

  let micOn = false;


  let lastCheck = 0;
  let openCheck = 0;
  let isDone = true;
  const animateLip = (viseme, headRef, teethRef, influence) => {
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[viseme]] = influence;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary[viseme]] = influence;
    console.log(`${viseme} H MOUTH OPENED: ${headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[viseme]]}`);
    console.log(`${viseme} T MOUTH OPENED: ${teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary[viseme]]}`);

  }

  // Execute code on every rendered frame
  useFrame((state,delta)=>{
    // delta = 0.016
    //Debouncing on executing code
    if (lastCheck >= 0.60) { //Frame Every 20ms 58
      console.log("frame active") //frame active
      
      if(micOn == true){
        if(isDone == true){
          let pncCount = 0;
          
          pncViseme.forEach((vc)=>{
            pncCount ++;
            isDone = false
            //OPEN MOUTH: set lip position at 0.55 
            headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['browInnerUp']] = 0.23;
            teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['browInnerUp']] = 0.2;
            teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['jawOpen']] = 0.1;
            
            setTimeout(function () {
              animateLip(vc, headRef, teethRef, 0.3);
            },pncCount * 30);//50
  
            

            if(vc == 'viseme_SS'){
              isDone = true
              pncCount = 0
              
            }
            resetFace();
          })
          
        }
      }else{
        resetFace();
      }
      lastCheck = 0;
    } else {
      // console.log(lastCheck)
      lastCheck += delta;
    }
})


// default face motions
let eyeCheck = 0
let noseCheck = 0;
// Frame
useFrame((state,delta)=>{
  if(eyeCheck > 3){// Eye Blinking
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['eyesClosed']] = 1;
    eyeCheck= 0;
  }else{
    eyeCheck += delta;
  }

  if(noseCheck > 7){// Nose Moving
    if(Math.floor(Math.random() * 2) == 0){
      headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['noseSneerLeft']] = 0.8;
    }else{
      headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['noseSneerRight']] = 0.1;
    }
    noseCheck = 0;
  }else{
    noseCheck+= delta;
  }
})

  // Reset Face
  function resetFace() {
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_Sil']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_PP']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_FF']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_TH']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_DD']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_kk']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_CH']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_SS']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_nn']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_RR']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_aa']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_E']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_I']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_O']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['viseme_U']] =0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['mouthOpen']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['mouthShrugUpper']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['browInnerUp']] = 0.2;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['eyesClosed']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['noseSneerLeft']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['noseSneerRight']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['mouthSmile']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['cheekPuff']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['mouthFunnel']] = 0;
    headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary['jawOpen']] = 0;

    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['jawOpen']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['mouthFunnel']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_Sil']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_PP']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_FF']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_TH']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_DD']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_kk']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_CH']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_SS']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_nn']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_RR']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_aa']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_E']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_I']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_O']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['viseme_U']] =0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['mouthOpen']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['mouthShrugUpper']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['browInnerUp']] = 0.2;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['eyesClosed']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['noseSneerLeft']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['noseSneerRight']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['mouthSmile']] = 0;
    teethRef.current.morphTargetInfluences[teethRef.current.morphTargetDictionary['cheekPuff']] = 0;
  }

  // once MyAvatar.js is loaded
  useEffect(() =>  {
    startvts();
    actions.AvatarIdle.play();
  });



  // Speech Configruration
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Start Voice Recognition.
  function startvts(){
    // Recognition Configuration
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Start Recognizing
    recognition.start();
    
    
    // Text
    recognition.onresult = function (event) {
      micOn = true;
      
      var final = "";
      var oldInterim = "";
      var interim = "";
      for (var i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
          micOn = false;
          console.log(micOn)
        } else {
          micOn = true;
          interim += event.results[i][0].transcript;
          
          console.log(micOn)
          console.log(interim)
        }
      }
    }
    
  }

  // Render Avatar
  return (
    <group ref={group} {...props} dispose={null} rotation={[0.59, 95.0, -0.2]}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Hips} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Left} />
          <primitive object={nodes.Ctrl_Hand_IK_Left} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Right} />
          <primitive object={nodes.Ctrl_Hand_IK_Right} />
          <primitive object={nodes.Ctrl_Foot_IK_Left} />
          <primitive object={nodes.Ctrl_LegPole_IK_Left} />
          <primitive object={nodes.Ctrl_Foot_IK_Right} />
          <primitive object={nodes.Ctrl_LegPole_IK_Right} />
          <primitive object={nodes.Ctrl_Master} />
          <skinnedMesh
            name="Wolf3D_Glasses"
            geometry={nodes.Wolf3D_Glasses.geometry}
            material={materials.Wolf3D_Glasses}
            skeleton={nodes.Wolf3D_Glasses.skeleton}
          />
          <skinnedMesh
            name="EyeLeft"
            geometry={nodes.EyeLeft.geometry}
            material={nodes.EyeLeft.material}
            skeleton={nodes.EyeLeft.skeleton}
            morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
          />
          <skinnedMesh
            name="EyeRight"
            geometry={nodes.EyeRight.geometry}
            material={nodes.EyeRight.material}
            skeleton={nodes.EyeRight.skeleton}
            morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
          />
          <skinnedMesh
            ref={headRef}
            name="Wolf3D_Head"
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
          />
          <skinnedMesh
            ref={teethRef}
            name="Wolf3D_Teeth"
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={materials.Wolf3D_Teeth}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
          />
          <skinnedMesh
            name="Wolf3D_Hair"
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials.Wolf3D_Hair}
            skeleton={nodes.Wolf3D_Hair.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Footwear"
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Top"
            geometry={nodes.Wolf3D_Outfit_Top.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Bottom"
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Body"
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/animated_avatar.glb");

export default MyAvatar;