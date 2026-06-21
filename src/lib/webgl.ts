/** Cheap WebGL capability probe (cached). */
let cached: boolean | null = null;
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    cached = false;
  }
  return cached;
}

/** Conservative low-power heuristic — only trips on genuinely weak devices,
 *  so most phones still get the WebGL path. The fallback is good-looking
 *  regardless, so erring toward it is safe. */
export function isLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if (typeof mem === "number" && mem <= 2) return true;
  if (typeof cores === "number" && cores <= 2) return true;
  return false;
}

/** Use the WebGL denoise path only when it'll actually run well. */
export function shouldUseWebGL(): boolean {
  return hasWebGL() && !isLowPower();
}
