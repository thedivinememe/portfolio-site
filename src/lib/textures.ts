/** Pure 2D-canvas drawing helpers (no three.js) used to paint the *source*
 *  that the denoise shader resolves toward. Swapped for real <img> textures
 *  at the content step. */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function hexA(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** A quiet placeholder "image": warm darkroom base + a soft accent wash +
 *  a faint mono label. All sizes are device pixels. */
export function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  accent: string,
  label: string,
) {
  ctx.clearRect(0, 0, w, h);

  // Base surface (ink-800).
  ctx.fillStyle = "#1C1611";
  ctx.fillRect(0, 0, w, h);

  // Accent glow, off-centre and soft — never neon.
  const { r, g, b } = hexToRgb(accent);
  const cx = w * 0.5;
  const cy = h * 0.42;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`);
  grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.05)`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Mono label, centred, ash.
  ctx.fillStyle = "rgba(138, 128, 119, 0.7)";
  ctx.font = `${11 * dpr}px ui-monospace, "Spline Sans Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${1.5 * dpr}px`;
  }
  ctx.fillText(label.toUpperCase(), w / 2, h / 2);
}

export type TextStyle = {
  text: string;
  fontFamily: string;
  weight: string;
  sizePx: number;
  lineHeightPx: number;
  letterSpacingPx: number;
  color: string;
};

/** Draws word-wrapped display text matched to the DOM element's computed
 *  style. Sizes in CSS px, scaled by dpr. Transparent background so the
 *  shader can mask grain to the glyphs. */
export function drawText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  s: TextStyle,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = s.color;
  ctx.font = `${s.weight} ${s.sizePx * dpr}px ${s.fontFamily}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${s.letterSpacingPx * dpr}px`;
  }

  const lines = wrapLines(ctx, s.text, w);
  const lh = s.lineHeightPx * dpr;
  lines.forEach((ln, i) => ctx.fillText(ln, 0, i * lh));
}

/** Greedy word wrap that also breaks overlong tokens by character — mirrors
 *  CSS `overflow-wrap: anywhere`, so the canvas matches the DOM's wrapping. */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
): string[] {
  // Small slack so a line the DOM kept together isn't split by sub-pixel
  // rounding / letter-spacing differences in canvas measureText.
  const limit = maxW * 1.012;
  const lines: string[] = [];
  let line = "";

  const flushOverlong = () => {
    while (ctx.measureText(line).width > limit && line.length > 1) {
      let i = line.length;
      while (i > 1 && ctx.measureText(line.slice(0, i)).width > limit) i--;
      lines.push(line.slice(0, i));
      line = line.slice(i);
    }
  };

  for (const word of text.split(/\s+/)) {
    if (!line) {
      line = word;
    } else if (ctx.measureText(`${line} ${word}`).width <= limit) {
      line = `${line} ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
    flushOverlong();
  }
  if (line) lines.push(line);
  return lines;
}
