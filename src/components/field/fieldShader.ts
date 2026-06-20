// Hero generative field. A domain-warped fbm noise field, kept deliberately
// dark and low-contrast so it never competes with the type. Its colour drifts
// toward the active section's accent; a gentle cursor offset adds parallax.

export const fieldVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fieldFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uRes;
  uniform vec3  uColor;  // active accent (lerped)

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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uRes.x / uRes.y; // aspect correct
    p *= 1.5;
    p += uMouse * 0.12;     // cursor parallax

    float t = uTime * 0.035;

    // Inigo-Quilez style domain warp.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 1.5 * q + vec2(1.7, 9.2) + t * 1.1),
      fbm(p + 1.5 * q + vec2(8.3, 2.8) - t * 0.9)
    );
    float v = fbm(p + 2.0 * r);
    v = smoothstep(0.0, 1.0, v);

    // Warm darkroom base (~#14100C), with a subtle accent bloom.
    vec3 ink = vec3(0.078, 0.063, 0.047);
    vec3 col = ink + uColor * 0.16 * pow(v, 1.5);
    col += vec3(0.018) * (r.x * 0.5 + 0.5); // faint structural light

    // Calm the centre, where the type sits.
    float d = length(uv - 0.5);
    col *= 1.0 - 0.28 * smoothstep(0.15, 0.95, d);

    gl_FragColor = vec4(col, 1.0);
  }
`;
