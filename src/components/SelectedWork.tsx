import { CSSProperties } from "react";
import { Container } from "./Container";
import { ArtifactFrame } from "./ArtifactFrame";
import { MythRealGallery } from "./work/MythRealGallery";
import { VideoArtifact } from "./work/VideoArtifact";
import { SdlcDiagram } from "./work/SdlcDiagram";
import { EvalViz } from "./work/EvalViz";
import { CASE_STUDIES, type CaseStudy } from "@/lib/content";

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-16 py-24 sm:py-32">
      <Container>
        <header className="mb-16 flex items-baseline justify-between border-t border-ink-700 pt-6 sm:mb-24">
          <h2 className="font-display text-display font-light text-paper">
            Selected work
          </h2>
          <span className="font-mono text-label text-ash-500">
            02 — three studies
          </span>
        </header>
      </Container>

      <div className="flex flex-col gap-28 sm:gap-40">
        {CASE_STUDIES.map((cs) => (
          <CaseStudyBlock key={cs.slug} cs={cs} />
        ))}
      </div>
    </section>
  );
}

const NARRATIVE: { key: keyof CaseStudy; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "role", label: "My role" },
  { key: "craft", label: "Craft" },
  { key: "outcome", label: "Outcome" },
];

function HeroArtifact({ cs }: { cs: CaseStudy }) {
  // MythReal leads with the live tooling capture, not the static map.
  if (cs.slug === "mythreal" && cs.video) {
    return (
      <VideoArtifact
        webm={cs.video.webm}
        mp4={cs.video.mp4}
        poster={cs.video.poster}
        alt={cs.video.alt}
        caption={cs.video.caption}
        label={cs.video.caption}
        aspect={cs.video.aspect}
        accent={cs.accent}
      />
    );
  }
  if (cs.slug === "agentic-sdlc") {
    return (
      <ArtifactFrame label={cs.hero.label} fixed={false}>
        <SdlcDiagram label={cs.hero.label} />
      </ArtifactFrame>
    );
  }
  return (
    <ArtifactFrame label={cs.hero.label} fixed={false}>
      <EvalViz />
    </ArtifactFrame>
  );
}

function CaseStudyBlock({ cs }: { cs: CaseStudy }) {
  const accentStyle = { "--color-accent": cs.accent } as CSSProperties;

  return (
    <article style={accentStyle} data-accent={cs.accent} className="scroll-mt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <span className="font-mono text-label text-accent">{cs.num}</span>
          <h3 className="font-display text-title font-light text-paper">
            {cs.title}
          </h3>
          <p className="font-mono text-label text-ash-500">{cs.kicker}</p>
        </div>
      </Container>

      <Container>
        <HeroArtifact cs={cs} />
      </Container>

      {cs.links && (
        <Container className="mt-8 sm:mt-10">
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {cs.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block py-2 font-mono text-label text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </Container>
      )}

      <Container className="mt-12 sm:mt-16">
        <dl className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          {NARRATIVE.map(({ key, label }) => (
            <div key={key} className="contents">
              <dt className="font-mono text-label text-accent md:col-span-3">
                {label}
              </dt>
              <dd className="max-w-[62ch] text-body text-paper-dim md:col-span-9 md:col-start-4">
                {Array.isArray(cs[key]) ? (
                  (cs[key] as string[]).map((para, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-4" : undefined}>
                      {para}
                    </p>
                  ))
                ) : (
                  (cs[key] as string)
                )}
              </dd>
            </div>
          ))}

          {cs.link && (
            <div className="contents">
              <dt className="sr-only">Link</dt>
              <dd className="md:col-span-9 md:col-start-4">
                <a
                  href={cs.link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block py-2 font-mono text-label text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {cs.link.label} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Container>

      {cs.gallery && (
        <Container className="mt-16 sm:mt-20">
          <p className="mb-6 font-mono text-label text-ash-500">
            the design output
          </p>
          <MythRealGallery items={cs.gallery} accent={cs.accent} />
        </Container>
      )}
    </article>
  );
}
