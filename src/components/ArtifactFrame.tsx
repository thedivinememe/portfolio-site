import { ReactNode } from "react";

/**
 * The contact-sheet frame that holds each visual artifact. `fixed` frames keep
 * a set aspect ratio and host absolutely-positioned children (images, canvases);
 * `fixed={false}` lets the frame grow to its content (data viz). Corner ticks +
 * a mono label give it the "frame on a developing sheet" feel.
 */
export function ArtifactFrame({
  label,
  aspect = "16 / 10",
  children,
  priority = false,
  fixed = true,
}: {
  label: string;
  aspect?: string;
  children?: ReactNode;
  priority?: boolean;
  fixed?: boolean;
}) {
  return (
    <figure
      className="group relative w-full overflow-hidden bg-ink-800"
      style={fixed ? { aspectRatio: aspect } : undefined}
    >
      <div className={fixed ? "absolute inset-0" : "relative"}>
        {children ?? (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-mono text-label text-ash-500/70">
              {priority ? "▣ " : "▢ "}
              {label}
            </span>
          </div>
        )}
      </div>

      {/* Corner ticks — four L-shaped marks, accent-tinted. */}
      <Tick className="left-3 top-3 border-l border-t" />
      <Tick className="right-3 top-3 border-r border-t" />
      <Tick className="bottom-3 left-3 border-b border-l" />
      <Tick className="bottom-3 right-3 border-b border-r" />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-700"
      />
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

function Tick({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 h-4 w-4 border-accent/60 ${className}`}
    />
  );
}
