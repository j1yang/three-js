import React, { useEffect, useRef, useState } from 'react';
import { Suspense } from "react";

import './App.css';
import Avatar from './components/avatar/Avatar';

import { Canvas } from "@react-three/fiber";
import AnimationBlob from './components/animationBlob/animationBlob';

function App() {
  

  return (
  <div className="App">
    <div className="extra-info">
      <h1>
        Face Sync App
      </h1>
    </div>
    <Canvas className="canvas">
       {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[-2, 5, 2]} intensity={1} />
      <AnimationBlob/>
      <Suspense fallback={null}>
        <Avatar scale={2.2} position={[-2, -2, 1]} />
      </Suspense>
    </Canvas>
  </div>
  );
}

export default App;