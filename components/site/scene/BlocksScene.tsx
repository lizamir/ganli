"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Castle from "./blocks/Castle";
import { LITE, type Progress } from "./blocks/constants";
import Stars from "./blocks/Stars";

/** Pulls the camera back on narrow canvases so the whole castle stays in frame. */
function FitCamera() {
  useFrame(({ camera, size }) => {
    camera.position.z = Math.max(12, 11.6 / (size.width / size.height));
  });
  return null;
}

/** The 3D stage: lights, camera, the castle and the stars. */
export default function BlocksScene({
  animate = true,
  progress,
  active = true,
}: {
  animate?: boolean;
  progress?: Progress;
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows={LITE ? false : "percentage"}
      dpr={LITE ? [1, 1.4] : [1, 2]}
      camera={{ position: [0, 1.2, 12], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#fff7ea", "#d9c3a3", 0.9]} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-6, 3, 4]} intensity={0.6} color="#ffe2c4" />
      <FitCamera />
      <Castle animate={animate} progress={progress} />
      <Stars animate={animate} progress={progress} />
      <ContactShadows position={[0, -1.76, 0]} opacity={0.35} scale={12} blur={2.6} far={4} color="#5b4a40" />
    </Canvas>
  );
}
