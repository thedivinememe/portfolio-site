/**
 * Content model. Real copy lives here. Per-section `accent` is the build-time
 * "sampled" dominant colour (clamped toward S35-55% / L60-70% so it reads as
 * tinted light, not a brand fill). Only MythReal has real source imagery to
 * sample (gold); SDLC and eval accents are chosen for hue spread.
 */

export type Section = {
  id: string;
  index: string;
  label: string;
};

export const SECTIONS: Section[] = [
  { id: "hero", index: "01", label: "index" },
  { id: "work", index: "02", label: "selected work" },
  { id: "playground", index: "03", label: "playground" },
  { id: "about", index: "04", label: "about" },
  { id: "contact", index: "05", label: "contact" },
];

export const HERO = {
  // Display name — confirm exact stylization (from git + LinkedIn: Brandon Welner).
  name: "Brandon Welner",
  positioning:
    "Front-end engineer and creative coder building interfaces and tools that feel alive.",
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  transparent?: boolean; // logo PNGs: mask grain to the mark
};

export type CaseStudy = {
  num: string;
  slug: "mythreal" | "agentic-sdlc" | "groundedness-eval";
  title: string;
  kicker: string;
  accent: string;
  hero: { src?: string; alt: string; label: string; aspect: string };
  problem: string;
  role: string;
  craft: string | string[]; // array renders as multiple paragraphs
  outcome: string;
  link?: { label: string; href: string } | null;
  /** Inline row of external deep-links shown near the top of the study. */
  links?: { label: string; href: string }[];
  /** Lead video slot (looping product capture). */
  video?: {
    webm: string;
    mp4: string;
    poster: string;
    alt: string;
    caption: string;
    aspect: string;
  };
  gallery?: GalleryItem[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    num: "01",
    slug: "mythreal",
    title: "MythReal",
    kicker: "art direction · creative systems · interactive product engineering",
    accent: "#d2a94f", // sampled gold
    hero: {
      src: "/mythreal/raefund-map.webp",
      alt: "A hand-finished parchment location map of Raefund, with labelled regions and recurring glyphs.",
      label: "location map — Raefund",
      aspect: "4 / 3",
    },
    // TODO: add the auto-battler capture files — /mythreal/raw-essence-loop.webm
    // and /mythreal/raw-essence-loop.mp4. The poster placeholder renders until then.
    video: {
      webm: "/mythreal/raw-essence-loop.webm",
      mp4: "/mythreal/raw-essence-loop.mp4",
      poster: "/mythreal/raw-essence-poster.webp",
      alt: "The Raw Essence auto-battler in motion: a pack opening resolves into characters, then an auto-battle runs.",
      caption: "Raw Essence — pack opening to battle",
      aspect: "16 / 9",
    },
    links: [
      { label: "mythreal.app", href: "https://mythreal.app" },
      { label: "Open a pack", href: "https://mythreal.app/auto-battler/" },
      { label: "Build a character", href: "https://mythreal.app/forge/" },
    ],
    problem:
      "Most RPGs hand you a class and put you on its rails. MythReal does the opposite — a character is defined entirely by which of 20 tech trees they invest in. Removing classes removes the scaffolding that keeps a system legible, so the real work is replacing that scaffolding with cleaner math and a tighter economy. I've been designing it for about four years.",
    role:
      "Sole designer, developer, and art director. The ruleset, worldbuilding, visual identity, and digital tooling are all mine — and they have to agree with each other.",
    craft: [
      "Twenty curated tech trees instead of classes, modifier-only attributes, and a fixed action-point economy — 5 AP a turn, a 2 AP bank cap, and a spike mechanic where banking AP unlocks decisive abilities. Every tuning choice traces to one unit: 1 AP ≈ a second of focused effort ≈ a d6 of effect. A two-register visual language carries the world: hand-drawn parchment for maps, diagrams, and seals; cinematic painting for scenes and characters. Maps are generated as a base, then finished by hand in Affinity. A repeatable prompt pipeline drives both the art and the tooling — including a Claude Code–built auto-battler that generates characters from the real rules and runs automated combat in a battle log.",
      "The digital tooling is where the ruleset comes alive. The auto-battler, Raw Essence, is a seeded gacha: every run is deterministic and shareable as a copyable code, with pack-opening, a pity system, a persistent collection, and a draft-your-party-of-three loop feeding an auto-battle simulator that runs from half-speed to instant. Both it and the Build Your Legend character forge generate characters from the genuine v0.5 rules — the rules are data, with a single source of truth driving game, tooling, and balance alike.",
    ],
    outcome:
      "A locked v0.5 spec, iterated through public alpha across several versioned releases; a coherent identity that scales to future modules; and live, playable tooling — a seeded auto-battler and a character forge — running on that genuine ruleset.",
    link: null,
    gallery: [
      {
        src: "/mythreal/logo-gold.webp",
        alt: "The MythReal wordmark: a rising-sun sigil above gold serif lettering.",
        caption: "Primary wordmark",
        aspect: "16 / 9",
        transparent: true,
      },
      {
        src: "/mythreal/burnys-chamber.webp",
        alt: "Burny's chamber — a dragon sovereign presides over a sunset hall as advisors gather below.",
        caption: "Key art — Burny's chamber",
        aspect: "16 / 9",
      },
      {
        src: "/mythreal/blob-marley.webp",
        alt: "Blob Marley — a translucent amber slime herald with braided locks holding a microphone-staff.",
        caption: "Character study — Blob Marley",
        aspect: "4 / 5",
      },
      {
        src: "/mythreal/dragon-anatomy.webp",
        alt: "An anatomical study of a dragon in aged-parchment ink — organs and circulatory detail drawn like a Renaissance plate.",
        caption: "Field study — dragon anatomy",
        aspect: "3 / 4",
      },
      {
        src: "/mythreal/teaminton-map.webp",
        alt: "A hand-finished parchment location map of Teaminton.",
        caption: "Location map — Teaminton",
        aspect: "16 / 9",
      },
      {
        src: "/mythreal/raefund-map.webp",
        alt: "A hand-finished parchment location map of Raefund, with labelled regions and recurring glyphs.",
        caption: "Location map — Raefund",
        aspect: "4 / 3",
      },
    ],
  },
  {
    num: "02",
    slug: "agentic-sdlc",
    title: "Agentic SDLC pipeline",
    kicker: "engineering · ai tooling · architecture",
    accent: "#7c8cc4", // steel-violet
    hero: {
      alt: "Architecture diagram of an agentic software-delivery pipeline.",
      label: "architecture — agent + mcp pipeline",
      aspect: "16 / 10",
    },
    problem:
      "An end-to-end tool for the software development lifecycle — carrying a piece of work from its initial requirements writeup all the way through to individual pull-request creation and review, on top of the team's existing systems.",
    role:
      "Two-person build. I owned the requirements-writeup (RPE), spike, epic, and ticket-creation skills — the front half of the pipeline that turns an intent into structured, ready-to-build work.",
    craft:
      "An agentic system built on Claude Code and MCP. Discrete skills handle each stage — RPE, spike, epic, and ticket creation, then dev work, PR review, and addressing PR comments — backed by MCP servers for Confluence, Jira, Bitbucket, and context management. The pattern is the point: small, composable agents that each own one SDLC step and hand off cleanly.",
    outcome:
      "Shipped as a unified SDLC now used across the engineering domain at Choice Hotels.",
    link: null,
  },
  {
    num: "03",
    slug: "groundedness-eval",
    title: "Groundedness eval harness",
    kicker: "research integrity · evaluation · honest negative",
    accent: "#5fa896", // jade
    hero: {
      alt: "Interactive chart of confidence-but-false claims plotted against a flag threshold.",
      label: "results — confidence vs signal",
      aspect: "16 / 10",
    },
    problem:
      "I hypothesized a cheap epistemic signal that could flag a model's ungrounded claims and gate verification inside an agent loop.",
    role:
      "I designed and built the eval to hold my own idea to an empirical standard.",
    craft:
      "A harness with independent measurement pathways and a preregistered effect-size bar — built so the hypothesis could fail cleanly. When the first run looked like a win, I traced it to a directionless baseline and replaced it with the model's own signed verdict.",
    outcome:
      "Against the honest baseline the signal added nothing, and on the decisive cases — confident, consistent, and wrong — it flagged none of seven. The mechanism explained why: it measured whether an entity exists, not whether a claim is true. A clean negative, reported as one.",
    link: null,
  },
];

export const PLAYGROUND = {
  title: "Develop",
  blurb:
    "A procedural image, resolving from grain. Drag to develop it — or push it back into noise.",
};

export const ABOUT = {
  body: "I build things people use, and I build worlds nobody asked for. By day that's consumer web at scale — search, experimentation, the unglamorous reliability work behind interfaces a lot of people actually touch. After hours it's MythReal: a tabletop RPG I designed, branded, and shipped solo, down to the logo. The thread between them is generative AI, which I treat as a material, not a buzzword. I build with it constantly — agent pipelines, eval harnesses, local models running on the GPU next to me — because the most interesting interfaces right now are the ones that help people make things they couldn't make alone.",
};

export const CONTACT = {
  email: "brandonmaxwelner@gmail.com",
  github: { label: "GitHub", href: "https://github.com/thedivinememe" },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brandonwelner/",
  },
  resume: { label: "Résumé", href: "/Brandon_Welner_Resume.pdf" },
};
