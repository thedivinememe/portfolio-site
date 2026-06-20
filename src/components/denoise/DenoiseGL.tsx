"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FullscreenTri } from "../three/FullscreenTri";
import { useEffect, useMemo, useRef } from "react";
import { vert, frag } from "./shader";
import { hexToRgb } from "@/lib/textures";

export type SourceDraw = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
) => void;

export type DenoiseGLProps = {
  sourceDraw: SourceDraw;
  /** Bump to force the source texture to be repainted (size/font/content). */
  redrawKey: string | number;
  revealed: boolean;
  hovered: boolean;
  /** Stagger, ms — delay before this surface starts developing. */
  delay?: number;
  /** Grain tint (hex). */
  tintHex: string;
  /** Resting grain intensity over resolved areas. 0 for crisp text. */
  grain?: number;
  /** Start fully resolved (e.g. a deferred hero overlay that only re-grains
   *  on hover) instead of developing from grain. */
  startResolved?: boolean;
};

function Scene({
  sourceDraw,
  redrawKey,
  revealed,
  hovered,
  delay = 0,
  tintHex,
  grain = 0.05,
  startResolved = false,
}: DenoiseGLProps) {
  const { size, invalidate } = useThree();

  const texRef = useRef<THREE.CanvasTexture | null>(null);
  const progress = useRef(startResolved ? 1 : 0);
  const delayLeft = useRef(0);
  const wasRevealed = useRef(false);

  // Own the material imperatively so uniform mutations are never lost to
  // reconciler prop-diffing.
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTex: { value: null },
        uProgress: { value: startResolved ? 1 : 0 },
        uTime: { value: 0 },
        uGrain: { value: grain },
        uTint: { value: new THREE.Color(1, 1, 1) },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  // Tint.
  useEffect(() => {
    const { r, g, b } = hexToRgb(tintHex);
    material.uniforms.uTint.value.setRGB(r / 255, g / 255, b / 255);
    invalidate();
  }, [tintHex, material, invalidate]);

  // Grain.
  useEffect(() => {
    material.uniforms.uGrain.value = grain;
  }, [grain, material]);

  // (Re)build the source texture on size / content change.
  useEffect(() => {
    if (size.width < 2 || size.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    sourceDraw(ctx, w, h, dpr);

    const tex = new THREE.CanvasTexture(canvas);
    // Pass the sRGB image bytes through untouched. Tagging as sRGB would make
    // three decode to linear on sample, but this custom ShaderMaterial doesn't
    // re-encode on output — the net effect crushed shadows and darkened images.
    tex.colorSpace = THREE.LinearSRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    texRef.current?.dispose();
    texRef.current = tex;
    material.uniforms.uTex.value = tex;
    invalidate();
  }, [size.width, size.height, redrawKey, sourceDraw, material, invalidate]);

  useEffect(() => () => texRef.current?.dispose(), []);

  // Kick the on-demand render loop whenever the target changes.
  useEffect(() => {
    if (revealed && !wasRevealed.current) delayLeft.current = (delay || 0) / 1000;
    wasRevealed.current = revealed;
    invalidate();
  }, [revealed, hovered, delay, invalidate]);

  useFrame((state, dt) => {
    const step = Math.min(dt, 0.05);

    let target = 0;
    if (revealed) {
      if (delayLeft.current > 0) {
        delayLeft.current -= step;
        target = 0;
      } else {
        target = hovered ? 0.5 : 1; // hover nudges back toward grain
      }
    }

    progress.current += (target - progress.current) * Math.min(1, step * 2.6);
    material.uniforms.uProgress.value = progress.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;

    const moving =
      Math.abs(target - progress.current) > 0.0015 || delayLeft.current > 0;
    const grainLive = progress.current < 0.985;
    if (moving || (hovered && grainLive)) invalidate();
  });

  return <FullscreenTri material={material} />;
}

export default function DenoiseGL(props: DenoiseGLProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
