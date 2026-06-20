import { Container } from "./Container";
import { DenoiseText } from "./denoise/DenoiseText";
import { HERO } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="hero"
      data-accent="#8a8077"
      className="relative flex min-h-svh flex-col justify-between pt-8 pb-16 sm:pt-10"
    >
      {/* Top mark — quiet. */}
      <Container>
        <div className="flex items-baseline justify-between font-mono text-label text-ash-500">
          <span className="text-paper-dim">{HERO.name}</span>
          <span>portfolio — 2026</span>
        </div>
      </Container>

      {/* The name + positioning, anchored low-left like a print credit. */}
      <Container>
        <DenoiseText
          text={HERO.name}
          className="font-display text-hero font-light text-paper [overflow-wrap:anywhere] max-w-[11ch]"
        />
        <p className="mt-8 max-w-[44ch] text-lede text-paper-dim sm:mt-10">
          {HERO.positioning}
        </p>
      </Container>

      {/* Scroll cue. */}
      <Container>
        <div className="flex items-center gap-3 font-mono text-label text-ash-500">
          <span className="h-8 w-px bg-ink-700" aria-hidden />
          <span>scroll to develop</span>
        </div>
      </Container>
    </section>
  );
}
