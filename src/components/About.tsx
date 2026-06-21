import { Container } from "./Container";
import { ABOUT } from "@/lib/content";

export function About() {
  return (
    <section
      id="about"
      data-accent="#8a8077"
      className="scroll-mt-16 py-24 sm:py-32"
    >
      <Container>
        <header className="mb-12 flex items-baseline justify-between border-t border-ink-700 pt-6 sm:mb-16">
          <h2 className="font-display text-display font-light text-paper">
            About
          </h2>
          <span className="font-mono text-label text-ash-500">04</span>
        </header>

        <div className="grid md:grid-cols-12">
          <p className="max-w-[52ch] text-lede text-paper-dim md:col-span-9 md:col-start-4">
            {ABOUT.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
