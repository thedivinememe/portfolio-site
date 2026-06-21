"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks the user's reduced-motion preference, reactively. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Returns false until the user first interacts (move / scroll / key / touch),
 * then true. Heavy above-the-fold WebGL (hero field + name) mounts only after
 * interaction, so three.js never parses during the critical render path — TBT
 * stays near zero. Real users trigger it within the first gesture; a long
 * safety timeout covers the rare motionless visitor. The static state (poster +
 * sharp text + grain) is a complete, good-looking design on its own.
 */
export function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const events = [
      "pointerdown",
      "pointermove",
      "wheel",
      "keydown",
      "touchstart",
      "scroll",
    ];
    const go = () => {
      if (done) return;
      done = true;
      cleanup();
      setReady(true);
    };
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      clearTimeout(timer);
    };
    events.forEach((e) =>
      window.addEventListener(e, go, { passive: true, once: true }),
    );
    const timer = window.setTimeout(go, 8000);
    return cleanup;
  }, []);
  return ready;
}

/**
 * Two-stage IntersectionObserver:
 *  - `mounted` flips true a little before the element enters (rootMargin),
 *    so the WebGL canvas can be lazily mounted just in time.
 *  - `revealed` flips true once the element is ~20% into view, driving the
 *    denoise toward resolved. Both latch once true.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setMounted(true);
          if (e.intersectionRatio >= 0.2) setRevealed(true);
        }
      },
      { rootMargin: "20% 0px 20% 0px", threshold: [0, 0.2] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, mounted, revealed };
}
