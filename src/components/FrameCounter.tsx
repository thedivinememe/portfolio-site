"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/content";

/**
 * The navigation, re-cast as a darkroom frame counter — not a nav bar.
 * A vertical film-strip of frame numbers on the right (desktop) and a slim
 * counter at the bottom (mobile). Active frame tracks scroll via
 * IntersectionObserver. Doubles as anchor navigation; fully keyboard-usable.
 */
export function FrameCounter() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the viewport top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <>
      {/* Desktop: vertical film-strip, right edge. */}
      <nav
        aria-label="Sections"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col items-end gap-3">
          {SECTIONS.map((s) => {
            const isActive = s.id === active;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-2 py-1.5 font-mono text-label transition-colors duration-[var(--duration-slow)] ease-[var(--ease-settle)]"
                >
                  <span
                    className={`transition-opacity duration-[var(--duration-slow)] ${
                      isActive
                        ? "text-paper-dim opacity-100"
                        : "text-ash-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={
                      isActive ? "text-paper" : "text-ash-500 group-hover:text-paper-dim"
                    }
                  >
                    {s.index}
                  </span>
                  <span
                    aria-hidden
                    className={`h-px transition-all duration-[var(--duration-slow)] ease-[var(--ease-settle)] ${
                      isActive ? "w-6 bg-accent" : "w-3 bg-ink-700"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: slim bottom counter. */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 font-mono text-label text-ash-500 backdrop-blur-sm">
          <span className="text-paper">
            {activeSection.index}
            <span className="text-ash-500"> / {SECTIONS.length.toString().padStart(2, "0")}</span>
          </span>
          <span aria-live="polite">{activeSection.label}</span>
        </div>
      </div>
    </>
  );
}
