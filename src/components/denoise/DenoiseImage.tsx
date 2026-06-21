"use client";

import { useCallback, useEffect, useState } from "react";
import { DenoiseGL } from "./lazy";
import { useReducedMotion, useReveal } from "@/lib/hooks";
import { shouldUseWebGL } from "@/lib/webgl";
import { hexA } from "@/lib/textures";

/**
 * Denoise-reveal for a real image. WebGL path loads the image into the source
 * texture and resolves it out of grain (re-grains on hover); the underlying
 * <img alt> stays in the DOM for a11y/SEO/no-JS. Fallback (reduced motion /
 * no-WebGL / not-yet-loaded) is a blur-up fade on that same <img>.
 */
export function DenoiseImage({
  src,
  alt,
  accent,
  delay = 0,
  transparent = false,
}: {
  src: string;
  alt: string;
  accent: string;
  delay?: number;
  transparent?: boolean;
}) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const { ref, mounted, revealed } = useReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(false);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => setWebgl(shouldUseWebGL()), []);

  useEffect(() => {
    if (!mounted) return; // only fetch the texture source when near-viewport
    let alive = true;
    const im = new Image();
    im.decoding = "async";
    im.onload = () => alive && setImg(im);
    im.onerror = () => alive && setErrored(true);
    im.src = src;
    return () => {
      alive = false;
    };
  }, [src, mounted]);

  const fancy = webgl && !reduced && !!img;

  const sourceDraw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!img) return;
      ctx.clearRect(0, 0, w, h);
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw: number;
      let dh: number;
      if (transparent) {
        // contain (+ padding) so logos aren't cropped
        if (ir > cr) {
          dw = w * 0.82;
          dh = dw / ir;
        } else {
          dh = h * 0.82;
          dw = dh * ir;
        }
      } else if (ir > cr) {
        dh = h;
        dw = h * ir;
      } else {
        dw = w;
        dh = w / ir;
      }
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    [img, transparent],
  );

  // Quiet placeholder if the file isn't present yet (keeps layout intact).
  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `radial-gradient(60% 60% at 50% 42%, ${hexA(accent, 0.16)}, transparent 70%), #1C1611`,
        }}
      >
        <span className="px-6 text-center font-mono text-label text-ash-500/70">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0"
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full ${
          transparent ? "object-contain p-[9%]" : "object-cover"
        }`}
        style={
          fancy
            ? { opacity: 0 }
            : {
                opacity: revealed || reduced ? 1 : 0,
                filter: revealed || reduced ? "blur(0px)" : "blur(14px)",
                transition:
                  "opacity var(--duration-reveal) var(--ease-develop), filter var(--duration-reveal) var(--ease-develop)",
              }
        }
      />

      {fancy && mounted && (
        <div aria-hidden className="absolute inset-0">
          <DenoiseGL
            sourceDraw={sourceDraw}
            redrawKey={src}
            revealed={revealed}
            delay={delay}
            tintHex={accent}
            grain={0}
          />
        </div>
      )}

      <span
        aria-hidden
        className="sheen-layer"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}
