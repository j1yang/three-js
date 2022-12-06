import "./styles.css";
import { Canvas } from "@react-three/fiber";
import MyAvatar from "./components/MyAvatar";
import AnimatedBlob from "./components/AnimatedBlob";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";

const App = () => {

  return (
    <div className="App">
      <div className="extra-info">
          <h1>
            Avatar Voice to Speech
          </h1>
        </div>
        <Canvas className="canvas">
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[-2, 5, 2]} intensity={1} />
          <AnimatedBlob />
          <Suspense fallback={null}>
            <MyAvatar scale={2.2} position={[-2, -2, 1]}/>
          </Suspense>
        </Canvas>
        
    </div>
  );
};

export default App;
