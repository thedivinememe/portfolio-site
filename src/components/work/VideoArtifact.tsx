"use client";

import { useState } from "react";
import { ArtifactFrame } from "../ArtifactFrame";
import { useReducedMotion, useReveal } from "@/lib/hooks";
import { hexA } from "@/lib/textures";

/**
 * Lead video slot for a case study — a looping, muted product capture inside
 * the standard contact-sheet frame, with a visible mono caption below (matching
 * the gallery pattern).
 *
 * - Lazy: the <video> only mounts once the frame is near the viewport.
 * - Reduced motion: shows the poster still instead of playing.
 * - Resilient: if the poster file is missing, falls back to a quiet accent
 *   placeholder so the layout never breaks before the capture is added.
 */
export function VideoArtifact({
  webm,
  mp4,
  poster,
  alt,
  caption,
  label,
  aspect,
  accent,
}: {
  webm: string;
  mp4: string;
  poster: string;
  alt: string;
  caption: string;
  label: string;
  aspect: string;
  accent: string;
}) {
  const reduced = useReducedMotion();
  const { ref, mounted } = useReveal<HTMLDivElement>();
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <ArtifactFrame label={label} aspect={aspect} priority>
        <div ref={ref} className="absolute inset-0">
          {!reduced && mounted ? (
            // TODO: drop the capture files at the paths below to make this play.
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster={posterFailed ? undefined : poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              aria-label={alt}
              tabIndex={-1}
            >
              <source src={webm} type="video/webm" />
              <source src={mp4} type="video/mp4" />
            </video>
          ) : posterFailed ? (
            <div
              role="img"
              aria-label={alt}
              className="absolute inset-0 grid place-items-center"
              style={{
                background: `radial-gradient(60% 60% at 50% 42%, ${hexA(accent, 0.16)}, transparent 70%), #1C1611`,
              }}
            >
              <span className="px-6 text-center font-mono text-label text-ash-500/70">
                {caption}
              </span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={alt}
              loading="lazy"
              decoding="async"
              onError={() => setPosterFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </ArtifactFrame>
      <p className="font-mono text-label text-ash-500">{caption}</p>
    </div>
  );
}
