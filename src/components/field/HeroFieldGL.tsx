"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FullscreenTri } from "../three/FullscreenTri";
import { useEffect, useMemo, useRef } from "react";
import { fieldVert, fieldFrag } from "./fieldShader";

export type HeroFieldGLProps = {
  /** Active accent as linear-ish 0..1 RGB; the field lerps toward it. */
  accentRgb: [number, number, number];
  /** When false (reduced motion), render a single still frame. */
  animate: boolean;
};

function Scene({ accentRgb, animate }: HeroFieldGLProps) {
  const { size, invalidate } = useThree();

  const mouse = useRef<[number, number]>([0, 0]);
  const mouseTarget = useRef<[number, number]>([0, 0]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fieldVert,
        fragmentShader: fieldFrag,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uRes: { value: new THREE.Vector2(1, 1) },
          uColor: { value: new THREE.Color(...accentRgb) },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  const target = useMemo(
    () => new THREE.Color(accentRgb[0], accentRgb[1], accentRgb[2]),
    [accentRgb],
  );

  // Resolution.
  useEffect(() => {
    material.uniforms.uRes.value.set(size.width, size.height);
    invalidate();
  }, [size.width, size.height, material, invalidate]);

  // Still-frame path: snap colour, render once.
  useEffect(() => {
    if (animate) return;
    material.uniforms.uColor.value.copy(target);
    invalidate();
  }, [animate, target, material, invalidate]);

  // Cursor parallax (animated path only).
  useEffect(() => {
    if (!animate) return;
    const onMove = (e: PointerEvent) => {
      mouseTarget.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ];
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  useFrame((state, dt) => {
    if (!animate) return;
    const u = material.uniforms;
    const step = Math.min(dt, 0.05);

    u.uTime.value = state.clock.elapsedTime;

    mouse.current[0] += (mouseTarget.current[0] - mouse.current[0]) * Math.min(1, step * 2);
    mouse.current[1] += (mouseTarget.current[1] - mouse.current[1]) * Math.min(1, step * 2);
    u.uMouse.value.set(mouse.current[0], mouse.current[1]);

    u.uColor.value.lerp(target, Math.min(1, step * 0.6)); // slow drift
  });

  return <FullscreenTri material={material} />;
}

export default function HeroFieldGL({ accentRgb, animate }: HeroFieldGLProps) {
  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Scene accentRgb={accentRgb} animate={animate} />
    </Canvas>
  );
}
