import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const MyAvatar = (props) => {

  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/animated_avatar.glb");
  const { actions } = useAnimations(animations, group);
  const headRef = useRef();
  const [arrVismeCode, setArrVisemeCode] = useState();
  const [speed, setSpeed] = useState(0);
  const [velocity, setVelocity] = useState(0.01);
  useFrame(()=>{
    let headObj = headRef.current;

    if(arrVismeCode !=null){
      
      arrVismeCode.map(vc => {
          // while(speed == 1){
          //   headObj.morphTargetInfluences[headObj.morphTargetDictionary[vc]] = speed;
          //   setSpeed(speed + velocity);
          //   console.log(speed)
          // }
          // while(speed == 0){
          //   headObj.morphTargetInfluences[headObj.morphTargetDictionary[vc]] = speed;
          //   setSpeed(speed - velocity);
          //   console.log(speed)
          // }
        }
      )
    }
    // if (headObj.morphTargetInfluences[headObj.morphTargetDictionary['viseme_SS']] + 0.01 < 1) {
    //   headObj.morphTargetInfluences[headObj.morphTargetDictionary['viseme_SS']] += 0.01
    // } else {
    //   headObj.morphTargetInfluences[headObj.morphTargetDictionary['viseme_SS']] = 0
    // }
  })

  // once MyAvatar.js is loaded
  useEffect(() =>  {
    startvts();
    actions.AvatarIdle.play();
    console.log(headRef);
  });

  function getViseme(word){
    const dict = {
      p: "viseme_PP",
      b: "viseme_PP",
      m: "viseme_PP",
      f: "viseme_FF",
      v: "viseme_FF",
      th: "viseme_TH",
      d: "viseme_DD",
      t: "viseme_DD",
      k: "viseme_kk",
      g: "viseme_kk",
      s: "viseme_SS",
      z: "viseme_SS",
      n: "viseme_nn",
      l: "viseme_nn",
      r: "viseme_RR",
      e: "viseme_E"
    }

    var charArr = word.toLowerCase().split('');
    var visemeResult = [];

    charArr.map(c => {
      if(dict[c] == null){
        visemeResult.push("viseme_Sil");
      }else{
        visemeResult.push(dict[c]);
      }
    });

    return visemeResult;
  }

  const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken('df57e548c72643fbb8f3314bfd285e98', 'eastus2');
  speechConfig.speechRecognitionLanguage = 'en-US';
  const synthesizerAudioConfig = speechsdk.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, synthesizerAudioConfig);
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const [n, setN] = useState(0);
  const [i, setI] = useState(0);
  function startvts(){
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.start();
    
    let startIndex, endIndex = 0;

    recognition.onresult = function (event) {
      setN(n+1)
      
      var final = "";
      let words = "";
      if (event.results[i].isFinal) {//slient
          final += event.results[i][0].transcript.split(" ").slice(-1);
          console.log(`***final: ${final}` );
          console.log(` ` )
          setArrVisemeCode(getViseme(final));
          console.log(arrVismeCode);
          setI(i+1);
      } else {//interim
        words += event.results[i][0].transcript;
        endIndex = words.length;
        const interim = words.substring(startIndex,endIndex)
        setArrVisemeCode(getViseme(interim));
        console.log(arrVismeCode);
        console.log(`num: ${n}` )
        console.log(`full sentence: ${words}` )
        console.log(`***custom interim: ${interim}` )
        startIndex = endIndex;
        console.log(` ` )

          
      }
  }

    synthesizer.visemeReceived = function (s, e) {
      // window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);
      window.console.log(" Viseme ID: " + e.visemeId);
      //window.console.log(" Viseme Animation: " + e.Animation);
      // `Animation` is an xml string for SVG or a json string for blend shapes
      var animation = e.Animation;
    }
  }

  

  return (
    <group ref={group} {...props} dispose={null} rotation={[0.05, 89.0, -0.1]}>
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