import * as THREE from "three";
import { DEPTH } from "./constants";

/** Turns a flat shape into a block with soft edges. */
export function extrude(shape: THREE.Shape, depth = DEPTH) {
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

/** A triangle block from three points. */
export function triangle(points: [number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(...points[0]);
  points.slice(1).forEach((p) => s.lineTo(...p));
  s.closePath();
  return extrude(s);
}

/** The arch from the logo. */
export function archShape(w: number, h: number, r: number, legH: number) {
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

/** A half-circle block. */
export function halfDisc(r: number) {
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.absarc(0, 0, r, Math.PI, 0, true);
  s.closePath();
  return extrude(s);
}

/** A star with the given outer and inner radius. */
export function starShape(outer: number, inner: number) {
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
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}
