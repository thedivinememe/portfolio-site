// Denoise shader. Mixes a source texture with procedural film-static via
// uProgress (0 = full grain → 1 = resolved). A per-pixel threshold map makes
// the image *develop* unevenly — areas resolve at staggered moments, the way
// a diffusion sample sharpens — rather than cross-fading uniformly.

export const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // ScreenQuad covers clip space; derive uv from position (ignores camera).
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTex;
  uniform float uProgress;
  uniform float uTime;
  uniform float uGrain;   // subtle resting grain over resolved areas
  uniform vec3  uTint;    // warm/accent tint mixed into the static

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    vec4 src = texture2D(uTex, uv);

    // Per-pixel reveal threshold: clumpy value noise + fine speckle.
    float clump = vnoise(uv * 90.0);
    float fine  = hash(floor(uv * 900.0));
    float threshold = clump * 0.7 + fine * 0.3;

    float edge = 0.16;
    float p = uProgress * (1.0 + 2.0 * edge) - edge; // allow full clear
    float reveal = smoothstep(threshold - edge, threshold + edge, p);

    // Animated static for unresolved areas, quantised to ~24fps for a filmic feel.
    float st = hash(uv * vec2(900.0, 520.0) + floor(uTime * 24.0) * 1.7);
    vec3 grainCol = mix(vec3(st), uTint, 0.30) * mix(0.25, 1.0, st);

    // Faint resting grain over resolved areas.
    float rest = (hash(uv * vec2(1100.0, 620.0) + uTime * 9.0) - 0.5) * uGrain;

    vec3 col = mix(grainCol, src.rgb + rest, reveal);

    // Mask to glyph coverage for text (transparent bg); images are opaque.
    gl_FragColor = vec4(col, src.a);
  }
`;
