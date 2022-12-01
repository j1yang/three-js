/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { BufferAttribute } from "three";
//import { getVectorsFromBufferArray } from './../../utils/faceMesh'

export default function Model(props) {
  const head = useRef();
  const { nodes, materials } = useGLTF('/avatar.glb')
  
  function BufferPoints({ count = 1000 }) {
    const points = useMemo(() => {
      //const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 7.5);
      //console.log(new BufferAttribute(new Float32Array(p), 3))
      return new BufferAttribute(new Float32Array(nodes.Wolf3D_Head.geometry.morphAttributes.position[20].array),3);
    }, [count]);
  
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute attach={"attributes-position"} {...points} />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          threshold={0.1}
          color={0xFF0000}
          sizeAttenuation={true}
        />
      </points>
    );
  }


  useEffect(()=>{
    //console.log(nodes.Wolf3D_Head.geometry.morphAttributes.position[0].array[36])
    // console.log(Object.keys(nodes).length) // 78
    console.log(nodes.Wolf3D_Head.geometry)
    console.log(nodes.Wolf3D_Head.geometry.morphAttributes) // position: array 72 > Float32Array 6486/3=2162
    console.log(nodes.Wolf3D_Head.geometry.index) // BufferAttribute: 12282
  })

  return (
    <>
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh ref={head} name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>

    <BufferPoints /></>
  )
}

useGLTF.preload('/avatar.glb')
