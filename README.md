# Brandon Welner — portfolio

A personal portfolio built on a single idea: the site behaves like the thing it
talks about. Content **resolves out of noise** the way a diffusion model
denoises an image — the name and every project image develop from procedural
grain as they enter the viewport, and re-grain on hover.

**Live:** [brandonwelner.com](https://brandonwelner.com)

## The build

- **Denoise reveal** — a custom GLSL shader mixes each source (text-as-texture
  or image) with procedural film static via a `uProgress` uniform, driven by an
  IntersectionObserver and eased on enter. Reduced-motion and no-WebGL devices
  get a first-class blur-up fallback, not a broken experience.
- **Generative hero field** — a domain-warped fbm noise field with gentle cursor
  parallax, whose colour drifts toward each section's accent as you scroll.
- **Three case studies, three bespoke artifacts** — a denoise-reveal image
  gallery, a hand-built SVG architecture diagram, and an interactive
  data visualization.
- **A signature playground** — a live shader toy you can drag to develop an
  image out of grain (and push it back).
- **A "darkroom" design system** — a warm near-black palette, per-section
  accents sampled from the imagery, an editorial serif (Fraunces) paired with a
  grotesk and a monospace "instrument" voice, and a subtle animated film grain
  tying the whole page to the noise theme.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · react-three-fiber with
custom GLSL · Motion · deployed on Vercel (static / SSG).

## Performance & accessibility

Lighthouse (desktop): **100 / 100 / 100 / 100**. Zero cumulative layout shift,
all WebGL lazy-loaded and code-split, fonts kept off the critical path, semantic
HTML with full keyboard navigation, and `prefers-reduced-motion` honored as a
first-class path.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

- `src/lib/content.ts` — all copy and case-study data in one place.
- `src/components/denoise/` — the denoise-reveal shader and components.
- `src/components/field/` — the generative hero field.
- `src/components/work/` — the three case-study artifacts.
- `src/components/playground/` — the interactive shader toy.
