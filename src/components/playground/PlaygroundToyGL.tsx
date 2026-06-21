"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FullscreenTri } from "../three/FullscreenTri";
import { useEffect, useMemo } from "react";
import { toyVert, toyFrag } from "./toyShader";

export type PlaygroundToyGLProps = {
  progress: number;
  scale: number;
  /** Animate the grain (false = reduced motion or offscreen). */
  animate: boolean;
};

function Scene({ progress, scale, animate }: PlaygroundToyGLProps) {
  const { size, invalidate } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: toyVert,
        fragmentShader: toyFrag,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: progress },
          uScale: { value: scale },
          uRes: { value: new THREE.Vector2(1, 1) },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    material.uniforms.uRes.value.set(size.width, size.height);
    invalidate();
  }, [size.width, size.height, material, invalidate]);

  // Slider-driven uniforms — render a frame on every change.
  useEffect(() => {
    material.uniforms.uProgress.value = progress;
    material.uniforms.uScale.value = scale;
    invalidate();
  }, [progress, scale, material, invalidate]);

  useFrame((state) => {
    if (!animate) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <FullscreenTri material={material} />;
}

export default function PlaygroundToyGL(props: PlaygroundToyGLProps) {
  return (
    <Canvas
      frameloop={props.animate ? "always" : "demand"}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
