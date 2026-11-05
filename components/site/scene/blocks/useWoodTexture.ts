import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

/** Procedural wood: soft beige with the curved grain lines from the logo. */
export function useWoodTexture() {
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
