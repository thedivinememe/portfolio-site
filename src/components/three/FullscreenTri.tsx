"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";

/**
 * A single full-screen triangle (clip-space) carrying a shader material.
 * Replaces drei's <ScreenQuad> so we don't pull @react-three/drei into the
 * WebGL bundle — smaller chunk, faster parse. The vertex shaders derive uv
 * from gl_Position, so the oversized triangle covers the viewport with uv 0..1.
 */
export function FullscreenTri({ material }: { material: THREE.Material }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
        3,
      ),
    );
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
