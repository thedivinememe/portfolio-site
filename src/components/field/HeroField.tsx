"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useDeferredMount, useReducedMotion } from "@/lib/hooks";
import { useActiveAccent } from "@/lib/useActiveAccent";
import { shouldUseWebGL } from "@/lib/webgl";
import { hexToRgb, hexA } from "@/lib/textures";

const HeroFieldGL = dynamic(() => import("./HeroFieldGL"), { ssr: false });

/**
 * Fixed, full-viewport atmospheric field behind all content. WebGL fbm when
 * supported (still frame under reduced motion); a quiet CSS poster otherwise.
 */
export function HeroField() {
  const reduced = useReducedMotion();
  const deferred = useDeferredMount();
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(shouldUseWebGL()), []);

  const accentHex = useActiveAccent("#8a8077");
  const accentRgb = useMemo(() => {
    const { r, g, b } = hexToRgb(accentHex);
    return [r / 255, g / 255, b / 255] as [number, number, number];
  }, [accentHex]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-ink-900"
      aria-hidden
    >
      {webgl && deferred ? (
        <HeroFieldGL accentRgb={accentRgb} animate={!reduced} />
      ) : (
        <FieldPoster accentHex={accentHex} />
      )}
    </div>
  );
}

function FieldPoster({ accentHex }: { accentHex: string }) {
  return (
    <div
      className="absolute inset-0 transition-[background] duration-[1200ms] ease-[var(--ease-develop)]"
      style={{
        background: `radial-gradient(120% 90% at 50% 30%, ${hexA(
          accentHex,
          0.1,
        )}, transparent 60%), #14100C`,
      }}
    />
  );
}
