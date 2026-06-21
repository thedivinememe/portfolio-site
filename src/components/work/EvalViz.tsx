"use client";

import { useState } from "react";
import { useReveal } from "@/lib/hooks";

// The decisive cases: confident, consistent, and false — every one scored as
// "grounded" by the signal (ν), so none crossed the flag threshold. Numbers
// supplied by the author.
const CLAIMS: { text: string; v: number }[] = [
  { text: "JWST sits at the L1 Lagrange point", v: 0.95 },
  { text: "Light travels ~300,000 miles per second", v: 0.95 },
  { text: "The Sahara is Earth's largest desert", v: 0.97 },
  { text: "Lake Superior is the largest freshwater lake by volume", v: 0.95 },
  { text: "Vesuvius destroyed Pompeii in 79 BC", v: 0.98 },
  { text: "The Last Supper is a fresco", v: 0.96 },
  { text: "Newton was Royal Society president from 1703", v: 0.9 },
];

const THRESHOLD = 0.5;

// Signal's incremental gain over the honest (signed-verdict) baseline, across
// runs, against the preregistered effect-size bar.
const DELTA_AUC = [
  { label: "run 1", v: 0.0 },
  { label: "run 2", v: 0.02 },
  { label: "run 3", v: 0.01 },
];
const PREREG_BAR = 0.03;

export function EvalViz() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      ref={ref}
      className="p-5 transition-[opacity,transform] duration-[var(--duration-reveal)] ease-[var(--ease-develop)] sm:p-8"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(12px)",
      }}
    >
      <p className="max-w-[48ch] font-display text-[1.15rem] leading-snug text-paper sm:text-[1.4rem]">
        I built an eval harness to falsify a signal I believed in — and it did.
      </p>

      {/* Plot A — every false-but-confident claim scored "grounded". */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between font-mono text-label text-ash-500">
          <span>signal score (ν) per confident-but-false claim</span>
          <span className="text-accent">flagged 0 / 7</span>
        </div>

        <div className="relative mt-4">
          {/* threshold line */}
          <div
            className="absolute bottom-6 top-0 border-l border-dashed border-ash-500/50"
            style={{ left: `${THRESHOLD * 100}%` }}
            aria-hidden
          />
          <ul className="flex flex-col gap-2.5">
            {CLAIMS.map((c, i) => (
              <li
                key={c.text}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${c.text} — signal ${c.v.toFixed(2)}, not flagged`}
                className="relative h-7 rounded-sm outline-none"
              >
                {/* claim label sits in the empty "should-be-flagged" zone */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 truncate pr-4 text-[0.8rem] transition-colors ${
                    active === i ? "text-paper" : "text-paper-dim"
                  }`}
                  style={{ maxWidth: "72%" }}
                >
                  {c.text}
                </span>
                {/* dot at ν, far right */}
                <span
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-all"
                  style={{
                    left: `${c.v * 100}%`,
                    width: active === i ? 14 : 10,
                    height: active === i ? 14 : 10,
                    boxShadow: active === i ? "0 0 0 4px var(--color-accent)" : "none",
                    opacity: active === i ? 1 : 0.85,
                  }}
                />
                {active === i && (
                  <span
                    className="absolute -translate-x-1/2 -translate-y-[150%] font-mono text-label text-paper"
                    style={{ left: `${c.v * 100}%`, top: "50%" }}
                  >
                    {c.v.toFixed(2)}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* axis */}
          <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-ash-500">
            <span>ν 0</span>
            <span style={{ marginLeft: "-8%" }}>0.50 — flag below</span>
            <span>1.0</span>
          </div>
        </div>
      </div>

      {/* Plot C — the signal's gain over the honest baseline collapses. */}
      <div className="mt-10 border-t border-ink-700 pt-6">
        <div className="font-mono text-label text-ash-500">
          ν&apos;s gain over the honest baseline (ΔAUC) vs the preregistered bar
        </div>
        <div className="relative mt-4 h-px" aria-hidden>
          <div
            className="absolute -top-1 bottom-0 border-l border-dashed border-paper-dim/60"
            style={{ left: `${(PREREG_BAR / 0.05) * 100}%`, height: `${DELTA_AUC.length * 34 + 8}px` }}
          />
        </div>
        <ul className="mt-1 flex flex-col gap-3">
          {DELTA_AUC.map((d) => (
            <li key={d.label} className="flex items-center gap-3">
              <span className="w-12 font-mono text-[0.65rem] text-ash-500">{d.label}</span>
              <span className="relative h-3 flex-1 rounded-sm bg-ink-900">
                <span
                  className="absolute inset-y-0 left-0 rounded-sm bg-accent/70"
                  style={{ width: `${Math.max((d.v / 0.05) * 100, 1.5)}%` }}
                />
              </span>
              <span className="w-16 text-right font-mono text-[0.65rem] text-paper-dim">
                +{d.v.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[0.65rem] text-ash-500">
          dashed line = preregistered +0.03 bar · the signal never clears it
        </p>
      </div>
    </div>
  );
}
