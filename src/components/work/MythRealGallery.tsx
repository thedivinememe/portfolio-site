import { ArtifactFrame } from "../ArtifactFrame";
import { DenoiseImage } from "../denoise/DenoiseImage";
import type { GalleryItem } from "@/lib/content";

/** Denoise-reveal gallery for MythReal's design output. Staggered so the grid
 *  "develops" rather than snapping. */
export function MythRealGallery({
  items,
  accent,
}: {
  items: GalleryItem[];
  accent: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
      {items.map((it, i) => (
        <div key={it.src} className="flex flex-col gap-3">
          <ArtifactFrame label={it.caption} aspect={it.aspect}>
            <DenoiseImage
              src={it.src}
              alt={it.alt}
              accent={accent}
              transparent={it.transparent}
              delay={i * 90}
            />
          </ArtifactFrame>
          <p className="font-mono text-label text-ash-500">{it.caption}</p>
        </div>
      ))}
    </div>
  );
}
