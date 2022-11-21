import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { SimpleSpeechPhrase } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/Exports';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const MyAvatar = (props) => {

  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/animated_avatar.glb");
  const { actions } = useAnimations(animations, group);
  const headRef = useRef();
  const [arrVismeCode, setArrVisemeCode] = useState();

  let lastCheck = 0;
  useFrame((state,delta)=>{
    if (lastCheck >= 0.3) { //Frame Every 100ms
      console.log("frame active") //frame active

      if(arrVismeCode != null){//if array Viseme is not null
        console.log("Viseme active");//visime active

        //reset avatar viseme influecnes
        //resetMouth();

        let maxInfluence = 0.25;
        //mapping viseme array
        arrVismeCode.map((vc)=>{
          let openCheck = 0;
          //OPEN MOUTH: set lip position at 0.55 
          while(openCheck <= maxInfluence){
            openCheck += 0.0001;
            headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]] = openCheck;
            //console.log(`${vc} close log: ${headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]]}`)
          }

          //display mouth open with influence
          console.log(`${vc} MOUTH OPENED: ${headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]]}`);

          let closeCheck = maxInfluence;
          //CLOSE MOUTH with the buffer: set lip position at 0.
          // while(closeCheck >= 0){
          //   closeCheck -= 0.0001;
          //   headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]] = closeCheck;
          //   //console.log(`${vc} open log: ${headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]]}`)
          // }

          //display mouth close with influence
          console.log(`${vc} MOUTH CLOSED: ${headRef.current.morphTargetInfluences[headRef.current.morphTargetDictionary[vc]]}`);
        })
      }else{//if arr visim is null
        //reset influences of the avatar
        resetMouth();
      }

      //reset arrVisemeCode
      setArrVisemeCode(null);
      lastCheck = 0;
    } else {
      // console.log(lastCheck)
      lastCheck += delta;
    }
})

  function resetMouth() {
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
  }

  // once MyAvatar.js is loaded
  useEffect(() =>  {
    startvts();
    actions.AvatarIdle.play();
    console.log(headRef);
  });

  

  function getViseme(word){
    const dict = {
      a: "viseme_aa",
      b: "viseme_PP",
      c: "viseme_I",
      d: "viseme_DD",
      e: "viseme_E",
      f: "viseme_FF",
      g: "viseme_kk",
      h: "viseme_TH",
      i: "viseme_aa",
      j: "viseme_E",
      k: "viseme_kk",
      l: "viseme_nn",
      m: "viseme_PP",
      n: "viseme_nn",
      o: "viseme_U",
      p: "viseme_PP",
      q: "viseme_kk",
      r: "viseme_RR",
      s: "viseme_SS",
      t: "viseme_DD",
      u: "viseme_U",
      v: "viseme_FF",
      w: "viseme_U",
      x: "viseme_E",
      y: "viseme_O",
      z: "viseme_SS"
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