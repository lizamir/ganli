import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, type Progress } from "./constants";
import { starShape } from "./geometry";

const STARS: { p: [number, number, number]; c: string; s: number }[] = [
  { p: [-3.1, 2.2, 0.4], c: COLORS.mustard, s: 1.1 },
  { p: [-1.6, 2.9, -0.4], c: COLORS.tomato, s: 1.2 },
  { p: [-0.3, 3.1, 0.6], c: COLORS.teal, s: 0.8 },
  { p: [1.9, 2.8, 0.2], c: COLORS.mustard, s: 1 },
  { p: [3.2, 1.9, -0.3], c: COLORS.teal, s: 0.9 },
  { p: [2.6, 3.2, 0.5], c: COLORS.tomato, s: 1.3 },
  { p: [-2.6, 1.0, 0.8], c: COLORS.blush, s: 0.9 },
  { p: [-3.5, 0.2, -0.2], c: COLORS.teal, s: 0.8 },
  { p: [3.6, 0.3, 0.6], c: COLORS.blush, s: 1 },
];

/** One star that pops out when the castle is nearly done. */
function StarMesh({
  star,
  animate,
  progress,
  index,
}: {
  star: (typeof STARS)[number];
  animate: boolean;
  progress?: Progress;
  index: number;
}) {
  const geo = useMemo(() => starShape(0.17, 0.075), []);
  const ref = useRef<THREE.Mesh>(null);
  const grown = useRef(progress ? 0 : 1);
  useFrame(() => {
    if (!progress || !ref.current) return;
    // Stars pop out once the castle is nearly done.
    const target = Math.min(Math.max((progress.current - 0.78 - index * 0.02) / 0.1, 0), 1);
    grown.current += (target - grown.current) * 0.12;
    ref.current.scale.setScalar(star.s * grown.current);
    ref.current.visible = grown.current > 0.01;
  });
  return (
    <Float speed={animate ? 1.6 : 0} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh ref={ref} geometry={geo} position={star.p} scale={progress ? 0 : star.s}>
        <meshStandardMaterial color={star.c} roughness={0.4} />
      </mesh>
    </Float>
  );
}

/** The stars floating around the castle. */
export default function Stars({ animate, progress }: { animate: boolean; progress?: Progress }) {
  return (
    <>
      {STARS.map((star, i) => (
        <StarMesh key={i} star={star} animate={animate} progress={progress} index={i} />
      ))}
    </>
  );
}
