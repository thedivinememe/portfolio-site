# MythReal assets

The site references the optimized **.webp** files below (generated from the
source PNGs with sharp; ~16MB of PNG → ~1.4MB of WebP). Paths are set in
`src/lib/content.ts`.

| file (used)            | role                              |
| ---------------------- | --------------------------------- |
| `raefund-map.webp`     | hero — Raefund location map       |
| `logo-gold.webp`       | gallery — primary wordmark        |
| `burnys-chamber.webp`  | gallery — key art (Burny's chamber, brightened) |
| `blob-marley.webp`     | gallery — character (Blob Marley) |
| `dragon-anatomy.webp`  | gallery — dragon anatomy plate (from "Burny Map") |
| `teaminton-map.webp`   | gallery — Teaminton location map  |

Generated but **not shown**: `minimalist-logo.webp` (the 3-sized dragon mark —
removed per request). Swap it into the gallery in `content.ts` if you change
your mind. The original `*.png` sources are left in place — safe to delete for a
leaner deploy.
