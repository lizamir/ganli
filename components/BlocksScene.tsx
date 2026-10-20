"use client";

import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const COLORS = {
  wood: "#d9c3a3",
  grain: "#b0916b",
  cocoa: "#6b5a4f",
  teal: "#2e9ea0",
  tomato: "#eb5a3b",
  blush: "#f3a59b",
  mustard: "#eaa23a",
};

const DEPTH = 0.9;
const DROP_HEIGHT = 7;

/* ───────── Geometry ───────── */

function extrude(shape: THREE.Shape, depth = DEPTH) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 32,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function triangle(points: [number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(...points[0]);
  points.slice(1).forEach((p) => s.lineTo(...p));
  s.closePath();
  return extrude(s);
}

function archShape(w: number, h: number, r: number, legH: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-r, 0);
  s.lineTo(-r, legH);
  s.absarc(0, legH, r, Math.PI, 0, true);
  s.lineTo(r, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2, h);
  s.lineTo(-w / 2, h);
  s.closePath();
  return extrude(s);
}

function halfDisc(r: number) {
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.absarc(0, 0, r, Math.PI, 0, true);
  s.closePath();
  return extrude(s);
}

function starShape(outer: number, inner: number) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
  geo.center();
  return geo;
}

/** Procedural wood: soft beige with the curved grain lines from the logo. */
function useWoodTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = COLORS.wood;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = COLORS.grain;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.75;
    for (let i = 0; i < 4; i++) {
      const y = 70 + i * 125;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(size * 0.3, y - 60, size * 0.6, y + 70, size + 20, y - 10);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

/* ───────── Animation helpers ───────── */

function easeOutBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

// Phones and tablets: fewer pixels and no shadow map, so scrolling stays smooth next to the canvas.
const LITE = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

const BLOCK_COUNT = 13;
/** Scroll progress (0..1) reported by the page; when given, blocks are placed by scroll, not by time. */
type Progress = MutableRefObject<number>;

type BlockProps = {
  position: [number, number, number];
  delay: number;
  step: number;
  animate: boolean;
  progress?: Progress;
  children: React.ReactNode;
};

/** A block that drops into place, lifts on hover and wobbles when clicked. */
function Block({ position, delay, step, animate, progress, children }: BlockProps) {
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

/* ───────── The castle ───────── */

function Castle({ animate, progress }: { animate: boolean; progress?: Progress }) {
  const wood = useWoodTexture();
  const group = useRef<THREE.Group>(null);

  const geo = useMemo(
    () => ({
      arch: archShape(1.7, 1.75, 0.5, 0.55),
      teal: triangle([[-0.5, 0], [0.5, 0], [0.5, 0.95]]),
      tomato: triangle([[-0.5, 0], [0.5, 0], [-0.5, 1.05]]),
      roof: triangle([[-0.5, 0], [0.5, 0], [0, 0.62]]),
      dome: halfDisc(0.46),
    }),
    []
  );

  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: wood, color: "#ffffff", roughness: 0.75 }),
    [wood]
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

function StarMesh({ star, animate, progress, index }: { star: (typeof STARS)[number]; animate: boolean; progress?: Progress; index: number }) {
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

function Stars({ animate, progress }: { animate: boolean; progress?: Progress }) {
  return (
    <>
      {STARS.map((star, i) => (
        <StarMesh key={i} star={star} animate={animate} progress={progress} index={i} />
      ))}
    </>
  );
}

/** Pulls the camera back on narrow canvases so the whole castle stays in frame. */
function FitCamera() {
  useFrame(({ camera, size }) => {
    camera.position.z = Math.max(12, 11.6 / (size.width / size.height));
  });
  return null;
}

export default function BlocksScene({ animate = true, progress, active = true }: { animate?: boolean; progress?: Progress; active?: boolean }) {
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
