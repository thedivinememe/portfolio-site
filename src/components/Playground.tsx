import { Container } from "./Container";
import { PlaygroundToy } from "./playground/PlaygroundToy";
import { PLAYGROUND } from "@/lib/content";

export function Playground() {
  return (
    <section
      id="playground"
      data-accent="#8a8077"
      className="scroll-mt-16 py-24 sm:py-32"
    >
      <Container>
        <header className="mb-12 flex items-baseline justify-between border-t border-ink-700 pt-6 sm:mb-16">
          <h2 className="font-display text-display font-light text-paper">
            Playground
          </h2>
          <span className="font-mono text-label text-ash-500">03 — live</span>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="font-display text-title font-light text-paper">
              {PLAYGROUND.title}
            </h3>
            <p className="mt-4 max-w-[40ch] text-body text-paper-dim">
              {PLAYGROUND.blurb}
            </p>
          </div>
          <div className="lg:col-span-8">
            <PlaygroundToy />
          </div>
        </div>
      </Container>
    </section>
  );
}
