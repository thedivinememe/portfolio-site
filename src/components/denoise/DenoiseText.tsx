"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { DenoiseGL } from "./lazy";
import { useDeferredMount, useReducedMotion, useReveal } from "@/lib/hooks";
import { shouldUseWebGL } from "@/lib/webgl";
import { drawText, type TextStyle } from "@/lib/textures";

/**
 * Denoise-reveal for display text (the hero name). The real <h1> always lives
 * in the DOM for a11y/SEO/no-JS — when the WebGL path is active it's held at
 * opacity 0 (still in the accessibility tree and still defining layout) while
 * an aria-hidden canvas paints the same text resolving out of grain.
 *
 * Fallback (reduced-motion or no/low WebGL): the real <h1>, blur-up fade.
 */
export function DenoiseText({
  text,
  className = "",
  delay = 120,
  sheenColor,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Overrides the hover sheen tint for the name (defaults to section accent). */
  sheenColor?: string;
}) {
  const reduced = useReducedMotion();
  const deferred = useDeferredMount();
  const [webgl, setWebgl] = useState(false);
  const { ref, mounted, revealed } = useReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(false);

  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [style, setStyle] = useState<Omit<TextStyle, "text"> | null>(null);
  const [redrawKey, setRedrawKey] = useState(0);

  useEffect(() => setWebgl(shouldUseWebGL()), []);

  // Read the DOM element's computed type style so the canvas matches the
  // design tokens exactly. Recompute after fonts load and on resize.
  const measure = useCallback(() => {
    const el = h1Ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    setStyle({
      fontFamily: cs.fontFamily,
      weight: cs.fontWeight,
      sizePx: parseFloat(cs.fontSize),
      lineHeightPx: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 0.9,
      letterSpacingPx: parseFloat(cs.letterSpacing) || 0,
      color: cs.color,
    });
    setRedrawKey((k) => k + 1);
  }, []);

  useEffect(() => {
    measure();
    let alive = true;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => alive && measure());

    const el = h1Ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [measure]);

  const fancy = webgl && !reduced && !!style && deferred;

  const drawName = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) => {
      if (!style) return;
      drawText(ctx, w, h, dpr, { text, ...style });
    },
    [text, style],
  );

  return (
    <div
      ref={ref}
      className="relative inline-block max-w-full align-top"
      style={sheenColor ? ({ "--sheen": sheenColor } as CSSProperties) : undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      {/* The real name paints its final, sharp state on first paint so it's a
          fast LCP (animating the LCP element's own paint pushes LCP to the last
          frame). The reveal is carried by the WebGL overlay (deferred to idle,
          starting resolved) and the surrounding page-load orchestration. On
          hover a specular sheen runs across the letters (see .sheen-text). */}
      <h1
        ref={h1Ref}
        className={className}
        style={fancy ? { opacity: 0 } : undefined}
      >
        {text}
      </h1>

      {fancy && mounted && (
        <div aria-hidden className="absolute inset-0">
          <DenoiseGL
            sourceDraw={drawName}
            redrawKey={redrawKey}
            revealed={revealed}
            delay={delay}
            tintHex="#8a8077"
            grain={0}
            startResolved
          />
        </div>
      )}

      <span
        aria-hidden
        className={`${className} sheen-text`}
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {text}
      </span>
    </div>
  );
}
