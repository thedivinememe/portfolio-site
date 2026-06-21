// Playground denoise toy. A fully procedural "developing print": a domain-
// warped grayscale cloudscape that resolves out of static. The viewer drives
// uProgress (develop) and uScale (grain/structure size) directly — the site's
// thesis turned into a tool.

export const toyVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const toyFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform float uScale;
  uniform vec2  uRes;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uRes.x / uRes.y;
    p *= uScale;

    float t = uTime * 0.05;

    // Domain-warped target cloudscape (warm grayscale).
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
    float v = fbm(p + 1.8 * q);
    v = smoothstep(0.05, 0.95, v);

    vec3 ink = vec3(0.078, 0.063, 0.047);
    vec3 paper = vec3(0.925, 0.890, 0.835);
    vec3 target = mix(ink, paper, v);

    // Staggered reveal, same per-pixel-threshold logic as the hero reveal.
    float clump = noise(uv * 90.0);
    float fine = hash(floor(uv * 900.0));
    float threshold = clump * 0.7 + fine * 0.3;
    float edge = 0.16;
    float pr = uProgress * (1.0 + 2.0 * edge) - edge;
    float reveal = smoothstep(threshold - edge, threshold + edge, pr);

    float st = hash(uv * vec2(900.0, 520.0) + floor(uTime * 24.0) * 1.7);
    vec3 grain = vec3(st) * mix(0.25, 1.0, st);

    vec3 col = mix(grain, target, reveal);
    gl_FragColor = vec4(col, 1.0);
  }
`;
