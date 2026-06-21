"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which `[data-accent]` element is crossing the viewport centre and
 * returns its accent hex. Used to drift the hero field's colour as you scroll
 * through the sections. Case-study articles declare their sampled accent; quiet
 * sections declare the neutral ash, so the field calms between studies.
 */
export function useActiveAccent(fallback = "#8a8077"): string {
  const [accent, setAccent] = useState(fallback);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-accent]"),
    );
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const a = (e.target as HTMLElement).dataset.accent;
            if (a) setAccent(a);
          }
        }
      },
      // A thin band at the vertical centre — whatever crosses it is "active".
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return accent;
}
