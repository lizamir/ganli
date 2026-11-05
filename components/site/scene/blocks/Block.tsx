import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { BLOCK_COUNT, DROP_HEIGHT, type Progress } from "./constants";

/** Makes a dropped block land with a small bounce. */
function easeOutBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

type BlockProps = {
  position: [number, number, number];
  delay: number;
  step: number;
  animate: boolean;
  progress?: Progress;
  children: React.ReactNode;
};

/** A block that drops into place, lifts on hover and wobbles when clicked. */
export default function Block({ position, delay, step, animate, progress, children }: BlockProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const wobbleAt = useRef(-10);
  const now = useRef(0);
  const lift = useRef(0);
  const placed = useRef(0);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = (now.current = clock.elapsedTime);
    let p: number;
    if (progress) {
      // Scroll mode: block `step` lands while the scroll passes step/BLOCK_COUNT of the way.
      const target = Math.min(Math.max(progress.current * (BLOCK_COUNT + 1) - step, 0), 1);
      placed.current += (target - placed.current) * 0.14;
      p = placed.current < 0.002 ? 0 : placed.current;
    } else {
      p = animate ? Math.min(Math.max((t - delay) / 0.95, 0), 1) : 1;
    }
    lift.current += ((hovered ? 0.18 : 0) - lift.current) * 0.15;
    g.position.y = position[1] + (1 - (progress ? p : easeOutBounce(p))) * DROP_HEIGHT + lift.current;
    g.visible = p > 0;

    const w = t - wobbleAt.current;
    g.rotation.z = w < 1.6 ? Math.sin(w * 16) * 0.22 * Math.exp(-w * 3.2) : 0;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    wobbleAt.current = now.current;
  };

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={onClick}
    >
      {children}
    </group>
  );
}
