import { Container } from "./Container";
import { CONTACT, HERO } from "@/lib/content";

export function Contact() {
  return (
    <section
      id="contact"
      data-accent="#8a8077"
      className="scroll-mt-16 pt-24 pb-32 sm:pt-32"
    >
      <Container>
        <header className="mb-12 flex items-baseline justify-between border-t border-ink-700 pt-6 sm:mb-16">
          <h2 className="font-display text-display font-light text-paper">
            Contact
          </h2>
          <span className="font-mono text-label text-ash-500">05</span>
        </header>

        {/* Email as the primary mark. */}
        <a
          href={`mailto:${CONTACT.email}`}
          className="inline-block font-display text-title font-light text-paper underline decoration-ash-500/40 underline-offset-[6px] transition-colors hover:decoration-paper"
        >
          {CONTACT.email}
        </a>

        <ul className="mt-8 flex flex-wrap gap-x-8 font-mono text-label text-ash-500">
          {[CONTACT.github, CONTACT.linkedin].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-2 text-paper-dim underline decoration-ash-500/30 underline-offset-4 transition-colors hover:decoration-paper"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
          <li>
            <a
              href={CONTACT.resume.href}
              download
              className="inline-block py-2 text-paper-dim underline decoration-ash-500/30 underline-offset-4 transition-colors hover:decoration-paper"
            >
              {CONTACT.resume.label} ↓
            </a>
          </li>
        </ul>
      </Container>

      <Container className="mt-24">
        <div className="flex items-center justify-between border-t border-ink-700 pt-6 font-mono text-label text-ash-500">
          <span>{HERO.name}</span>
          <span>2026</span>
        </div>
      </Container>
    </section>
  );
}
