import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Block from "./Block";
import { COLORS, DEPTH, type Progress } from "./constants";
import { archShape, halfDisc, triangle } from "./geometry";
import { useWoodTexture } from "./useWoodTexture";

/** The block castle the page builds as you scroll. */
export default function Castle({ animate, progress }: { animate: boolean; progress?: Progress }) {
  const wood = useWoodTexture();
  const group = useRef<THREE.Group>(null);

  const geo = useMemo(
    () => ({
      arch: archShape(1.7, 1.75, 0.5, 0.55),
      teal: triangle([
        [-0.5, 0],
        [0.5, 0],
        [0.5, 0.95],
      ]),
      tomato: triangle([
        [-0.5, 0],
        [0.5, 0],
        [-0.5, 1.05],
      ]),
      roof: triangle([
        [-0.5, 0],
        [0.5, 0],
        [0, 0.62],
      ]),
      dome: halfDisc(0.46),
    }),
    [],
  );

  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: wood, color: "#ffffff", roughness: 0.75 }),
    [wood],
  );
  const woodBoxMat = useMemo(() => {
    const m = woodMat.clone();
    if (wood) {
      m.map = wood.clone();
      m.map.repeat.set(1, 1);
    }
    return m;
  }, [woodMat, wood]);

  useFrame(({ pointer, clock }) => {
    const g = group.current;
    if (!g) return;
    const idle = animate ? Math.sin(clock.elapsedTime * 0.4) * 0.08 : 0;
    g.rotation.y += (pointer.x * 0.3 + idle - 0.12 - g.rotation.y) * 0.05;
    g.rotation.x += (-pointer.y * 0.08 + 0.06 - g.rotation.x) * 0.05;
  });

  const color = (c: string) => <meshStandardMaterial color={c} roughness={0.55} />;
  const box = (args: [number, number, number]) => (
    <RoundedBox args={args} radius={0.09} smoothness={4} material={woodBoxMat} castShadow receiveShadow />
  );

  let i = 0;
  const d = () => 0.25 + i++ * 0.14;
  const common = (n: number) => ({ delay: d(), step: n, animate, progress });

  return (
    <group ref={group} position={[0, -1.75, 0]}>
      {/* ground floor */}
      <Block position={[-2.45, 0.55, 0]} {...common(0)}>
        <RoundedBox args={[1, 1.1, DEPTH]} radius={0.12} smoothness={4} castShadow receiveShadow>
          {color(COLORS.cocoa)}
        </RoundedBox>
      </Block>
      <Block position={[2.45, 0.9, 0]} {...common(1)}>
        <RoundedBox args={[1, 1.8, DEPTH]} radius={0.12} smoothness={4} castShadow receiveShadow>
          {color(COLORS.cocoa)}
        </RoundedBox>
      </Block>
      <Block position={[-1.38, 0.5, 0]} {...common(2)}>
        {box([1, 1, DEPTH])}
      </Block>
      <Block position={[1.38, 0.5, 0]} {...common(3)}>
        {box([1, 1, DEPTH])}
      </Block>
      <Block position={[0, 0, 0]} {...common(4)}>
        <mesh geometry={geo.arch} material={woodMat} castShadow receiveShadow />
      </Block>

      {/* second floor */}
      <Block position={[-1.38, 1.4, 0]} {...common(5)}>
        {box([0.66, 0.8, DEPTH])}
      </Block>
      <Block position={[1.38, 1.4, 0]} {...common(6)}>
        {box([0.66, 0.8, DEPTH])}
      </Block>
      <Block position={[-2.45, 1.1, 0]} {...common(7)}>
        <mesh geometry={geo.teal} castShadow>
          {color(COLORS.teal)}
        </mesh>
      </Block>
      <Block position={[2.45, 1.8, 0]} {...common(8)}>
        <mesh geometry={geo.tomato} castShadow>
          {color(COLORS.tomato)}
        </mesh>
      </Block>

      {/* plank and top */}
      <Block position={[0, 1.97, 0]} {...common(9)}>
        {box([3.5, 0.34, DEPTH])}
      </Block>
      <Block position={[-0.62, 2.14, 0]} {...common(10)}>
        <mesh geometry={geo.dome} castShadow>
          {color(COLORS.mustard)}
        </mesh>
      </Block>
      <Block position={[0.55, 2.55, 0]} {...common(11)}>
        {box([0.82, 0.82, DEPTH])}
      </Block>
      <Block position={[0.55, 2.96, 0]} {...common(12)}>
        <mesh geometry={geo.roof} castShadow>
          {color(COLORS.blush)}
        </mesh>
      </Block>
    </group>
  );
}
