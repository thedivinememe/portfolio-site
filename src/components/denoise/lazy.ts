"use client";

import dynamic from "next/dynamic";

// All WebGL is code-split into its own chunk and only loaded client-side,
// so first paint never pays for three.js.
export const DenoiseGL = dynamic(() => import("./DenoiseGL"), { ssr: false });
