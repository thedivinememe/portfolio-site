import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-three-fiber's StrictMode double-mount recreates WebGL contexts in dev
  // and its zustand store subscription trips a benign dev-only hooks-order
  // warning. Disabling StrictMode keeps the dev console clean; production
  // (single-pass render) is identical either way.
  reactStrictMode: false,
};

export default nextConfig;
