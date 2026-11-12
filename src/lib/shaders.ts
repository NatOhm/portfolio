/**
 * Fragment bodies for the generative plates on the case studies.
 *
 * These are Shadertoy ports, kept as close to the originals as GLSL ES 3.00
 * allows, so they can be compared against the source when tweaking. Each body
 * declares only `#define`s, helpers and `mainImage`; the renderer in
 * `ProjectShader.tsx` wraps them with the precision qualifiers, the `iTime` and
 * `iResolution` uniforms, and the `main` that calls `mainImage`.
 *
 * Written for WebGL2 because two of the three need it: the Menger field marches
 * up to 100 steps with a data-dependent exit, and the hexagon field hashes with
 * integer bits (`floatBitsToUint`). Both are errors under the WebGL1 rules. The
 * plate falls back to its CSS gradient when WebGL2 is unavailable.
 */

/**
 * Menger sponge fly-through. Original by "enphoto".
 *
 * Changes from the original: `tanh` is polyfilled (GLSL ES has no such
 * built-in), the camera direction gets a tiny epsilon so a degenerate frame
 * cannot produce NaN, and the `for(; i++ < 1e2 && d < 1e1;)` header is written
 * as a bounded loop with a `break`, which is valid on every GLSL ES 3.00
 * compiler rather than only the forgiving ones.
 */
export const MENGER = /* glsl */ `
#define P(z) vec3(cos((z) * .06) * 64., cos((z) * .09) * 12., z)

#define M(f, h) \\
  s /= (f), \\
  p = abs(fract(q / s) * s - s * .5), \\
  d = min(d, min(max(p.x, p.y), min(max(p.y, p.z), max(p.x, p.z))) - s / (h))

vec3 tanh3(vec3 x) {
  vec3 e = exp(2. * clamp(x, -20., 20.));
  return (e - 1.) / (e + 1.);
}

void mainImage(out vec4 o, vec2 u) {
  float T = iTime;
  float d = 0., s = 0.;
  float j = .003 * dot(fract(sin(.07 * T + u)), sin(u));
  vec3 c = vec3(0.);
  vec2 r = iResolution;
  mat2 rot = mat2(cos(cos(T * .2) * .6 + vec4(0., 33., 11., 0.)));

  u = (u + u - r.xy) / r.y;

  vec3 q, p = P(T),
       Z = normalize(P(T + 2.) - p + 1e-3),
       X = normalize(vec3(Z.z, 0., -Z)),
       D = vec3(rot * u, 1.) * mat3(-X, cross(X, Z), Z);

  for (int k = 0; k < 100; k++) {
    if (!(d < 1e1)) break;

    q = p += j + D * s;
    d = s = 24.;
    M(2., 6.);
    M(2., 4.);
    M(9., 4.);
    p = abs(q - P(q.z));
    s = min(4. - p.x, 2. - p.y);
    s = max(s, .001 + .5 * abs(min(d, cos(p.z))));
    p = q;
    c += s * vec3(5., 2., 1.) + .04 * vec3(1., 2., 5.);
  }

  o = vec4(tanh3(c * c / 2e3), 1.);
}
`;

/**
 * Retro perspective grid. Original: the "3d project" sketch.
 *
 * Only guard added: the reciprocal of a zero-length axis cell would be
 * infinity, so the distance is floored before the divide.
 */
export const GRID = /* glsl */ `
void mainImage(out vec4 O, vec2 U) {
  vec2 R = iResolution.xy;
  float C = 1. - U.y / R.y;
  U = 5. * (U + U - R) / R.y;
  U.y = 1. - U.y * 2.;
  U /= 1. + U.y / 10.;
  U.y -= iTime;
  U = abs(fract(U) - .5);
  U = .14 / sqrt(max(U, vec2(1e-4)));
  O = (U.x * C + U.y * C * 2.) * vec4(.3, .3, 1., 0.) * C + vec4(.4, .1, .2, 0.) * C;
  /* Lifted for the plate: behind the band's scrim the original read as a
     near-black rectangle, so the lines are wider and the whole field brighter. */
  O.rgb = O.rgb * 1.7 + .02;
  O.a = 1.;
}
`;

/**
 * Random hexagon subdivision. Original by Shane (Shadertoy), "Hexagon
 * Subdivision" — kept verbatim except for the two things GLSL ES 3.00 rejects
 * at global scope: `const` arrays whose initialisers are not constant
 * expressions (the scaled vertex and mid-edge tables) are now plain globals
 * filled once per frame by `initTables()`.
 */
export const HEXAGONS = /* glsl */ `
#define SUBDIV 2
#define PI 3.14159265
#define TAU 6.2831853

/* Rotation about the grey axis, so the palette drifts without changing
   brightness; iHue is the amplitude in radians, set by the plate. */
uniform float iHue;

vec3 hueShift(vec3 c, float a) {
  const vec3 k = vec3(.57735);
  float cs = cos(a);
  return c * cs + cross(k, c) * sin(a) + k * dot(k, c) * (1. - cs);
}

mat2 rot2(in float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

float hash21(vec2 f) {
  uvec2 p = floatBitsToUint(f + 16384.);
  p = 1664525U * (p >> 1U ^ p.yx);
  return float(1103515245U * (p.x ^ (p.y >> 3U))) / float(0xffffffffU);
}

float distLineS(vec2 p, vec2 a, vec2 b) {
  b -= a;
  return dot(p - a, vec2(-b.y, b.x) / length(b));
}

float getHexFT(in vec2 p, float r, in float sf) {
  const vec3 k = vec3(-.8660254, .5, .57735);
  p = abs(p);
  p -= 2. * min(dot(k.xy, p), 0.) * k.xy;
  r -= sf;
  return length(p - vec2(clamp(p.x, -k.z * r, r), r)) * sign(p.y - r) - sf;
}

const float gSc = 1. / 3.5;
vec2 s = vec2(1.7320508, 1.) * gSc;

const vec2[6] vID = vec2[6](vec2(-4, 0), vec2(-2, 6), vec2(2, 6),
                            vec2(4, 0), vec2(2, -6), vec2(-2, -6));
const vec2[6] eID = vec2[6](vec2(-3, 3), vec2(0, 6), vec2(3),
                            vec2(3, -3), vec2(0, -6), vec2(-3));

vec2 v[6];
vec2 e[6];

void initTables() {
  for (int i = 0; i < 6; i++) {
    v[i] = vID[i] * s / 12.;
    e[i] = eID[i] * s / 12.;
  }
}

vec4 getGrid(vec2 p) {
  vec4 h = vec4(p, p - s / 2.);
  vec4 iC = floor(h / s.xyxy) + .5;
  h -= iC * s.xyxy;
  return dot(h.xy, h.xy) < dot(h.zw, h.zw)
    ? vec4(h.xy, iC.xy * 12.)
    : vec4(h.zw, iC.zw * 12. + 6.);
}

int pID;
int polyID;
vec2[8] pV;
float vert;
float gHx;
int grate;

vec3 distField(vec2 p) {
  vec4 p4 = getGrid(p);
  vec2 id = p4.zw;

  p4.xy *= rot2(TAU / 6. * mod(floor(hash21(id + .07) * 72.), 2.));
  if (hash21(id + .07) < .5) p4.x = -p4.x;

  vec2[6] mV;
  for (int i = 0; i < 6; i++) { mV[i] = v[i] * .5; }

  float poly = getHexFT(p4.xy, gSc / 2., 0.);

  float[6] lnS;
  for (int i = 0; i < 6; i++) {
    lnS[i] = distLineS(p4.xy, vec2(0), mV[i]);
    lnS[i] = max(lnS[i], distLineS(p4.xy, mV[i], e[i]));
  }

  gHx = poly;

  pID = 6;
  pV[0] = v[0]; pV[1] = v[1]; pV[2] = v[2]; pV[3] = v[3];
  pV[4] = v[4]; pV[5] = v[5]; pV[6] = v[0];

  polyID = 0;

  #if SUBDIV >= 1
  if (hash21(id + .13) < .85) {
    pID = 7;
    for (int i = 0; i < 6; i += 2) {
      int ip1 = (i + 1) % 6;
      int ipN = (i + 4) % 6;
      float lnI = max(lnS[ipN], -lnS[i]);

      if (lnI < 0.) {
        poly = max(poly, lnI);
        polyID = i;

        id += vID[i] * .666;

        pV[0] = vec2(0);
        pV[1] = mV[ipN];
        pV[2] = e[ipN];
        pV[3] = v[(i + 5) % 6];
        pV[4] = v[i];
        pV[5] = e[i];
        pV[6] = mV[i];
        pV[7] = vec2(0.);
        break;
      }
    }
  }
  #endif

  #if SUBDIV > 1
  if (hash21(id + .08) < .5 && pID == 7) {
    vec2 pM = mix(pV[3], pV[4], .5);
    float divLn = distLineS(p4.xy, pV[1], pM);

    if (divLn < 0.) {
      poly = max(poly, divLn);
      id += eID[polyID] / 2.;

      pV[0] = pV[0];
      pV[1] = pV[1];
      pV[2] = pM;
      pV[3] = pV[4];
      pV[4] = pV[5];
      pV[5] = pV[6];
      pV[6] = pV[0];
      pID = 6;
    } else {
      poly = max(poly, -divLn);
      id += vID[polyID] / 2. + eID[(polyID + 5) % 6] / 4.;

      pV[0] = pV[1];
      pV[1] = pV[2];
      pV[2] = pV[3];
      pV[3] = pM;
      pV[4] = pV[0];
      pID = 4;
      polyID++;
    }
  }
  #endif

  float ew = gSc * .045;
  float bordPoly = abs(poly + ew) - ew;

  float hl = hash21(id + .045);
  if (hl < .5) poly = bordPoly;

  poly += gSc * .01 / 3.;

  grate = 0;

  if (hl >= .8) {
    float sc2 = gSc / 24.;
    vec2 q = rot2(floor(hash21(id + .22) * 6.) * TAU / 6. + TAU / 12.) * p;
    q = mod(q - sc2 / 2. * 0., sc2) - sc2 / 2.;
    float grD = max(abs(q.x) - sc2 * .75, poly + ew * 1.5);

    grate = grD < bordPoly ? 1 : 0;
    poly = min(bordPoly, grD);
  }

  vert = 1e5;

  return vec3(poly, id);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  initTables();

  float res = iResolution.y;
  vec2 uv = (fragCoord - iResolution.xy * .5) / res;

  uv *= .95 + dot(uv, uv) * .1;

  const float sc = 1.;
  float sf = sc / res;

  mat2 sRot = rot2(-PI / 12.);
  vec2 camDir = sRot * normalize(s);
  vec2 ld = sRot * normalize(vec2(-1, -1));
  vec2 p = sRot * uv * sc + camDir * vec2(1, 0) * iTime / 8.;

  vec3 p3Hi = distField(p - ld * .003);
  vec3 p3 = distField(p);

  float poly = p3.x;
  vec2 id = p3.yz;

  float ew = .0065;

  float rnd = hash21(id + .05);
  float sat = 1.;
  vec3 pCol = .5 + .45 * cos(TAU * rnd / 4. + vec3(0, PI / 2., PI) * sat - .5);
  vec3 svCol = pCol;
  if (hash21(id + .32) < .5) pCol = vec3(.8, .85, 1) * vec3(rnd * .5 + .15);

  if (grate == 1) {
    pCol = pCol / (.5 + pCol) * .4;
  }

  float b = max(p3Hi.x - poly, 0.) / .003;
  float b2 = max(max(p3Hi.x, -.015) - max(poly, -.015), 0.) / .003;

  pCol = mix(pCol, mix((pCol.yzx * .5), pCol * sqrt(pCol) * 2., min(.5 + b + b2, 1.)), .4);
  pCol *= .85 + b2 * b2 * 1. + b * b * .5;

  vec3 sCol = pCol / (.5 + pCol);
  vec3 col = sCol * sCol * .4 * (b * b + .5);

  col = mix(col, col * .6, (1. - smoothstep(0., 6. / 450., poly)));
  col = mix(col, pCol * 0., (1. - smoothstep(0., sf, poly)));
  col = mix(col, pCol, (1. - smoothstep(0., sf, poly + ew)));

  uv = fragCoord / iResolution.xy;
  col *= pow(16. * uv.x * uv.y * (1. - uv.x) * (1. - uv.y), 1. / 16.);

  col = hueShift(col, iHue * sin(iTime * .35));

  fragColor = vec4(sqrt(max(col, 0.)), 1.);
}
`;

/**
 * Wind over a paddy. For the TK campaign: contour bands that bend with a slow
 * wind field, in the brand's gold, with one gust crossing the field at a time so
 * the surface reads as moving rather than as a texture.
 */
export const PADDY = /* glsl */ `
void mainImage(out vec4 O, vec2 U) {
  vec2 R = iResolution.xy;
  vec2 uv = U / R.y;
  float t = iTime * .18;

  /* The wind bends the terrace lines but they stay horizontal, like water
     standing in a paddy, so the field reads as landscape and not as stripes. */
  float wind = sin(uv.x * 1.5 + sin(uv.y * 2.2 + t) * 1.1 + t) * .5 + .5;
  float y = uv.y * 5.5 + wind * .22 - t * .35;
  float terrace = smoothstep(.55, .98, 1. - abs(fract(y) - .5) * 2.);

  vec3 low = vec3(.04, .045, .03);
  vec3 high = vec3(.92, .70, .28);
  vec3 col = mix(low, high, terrace * terrace);

  /* A wash at the top, so the terraces fade into the band instead of stacking
     into a wall of lines behind the title. */
  col += vec3(.35, .24, .10) * smoothstep(.62, 0., uv.y) * .5;

  float gust = exp(-pow(fract(uv.x * .4 - t * .14) - .5, 2.) * 60.);
  col += vec3(1., .82, .45) * gust * terrace * 1.4;

  O = vec4(col, 1.);
}
`;

export const TIDE = /* glsl */ `
void mainImage(out vec4 O, vec2 U) {
  vec2 R = iResolution.xy;
  vec2 uv = (U - R * .5) / R.y;
  float t = iTime * .35;

  /* Water lines run across the frame and tighten toward the horizon; the two
     frequencies interfere into crests instead of a regular stripe. */
  float depth = 1. / (uv.y * .55 + .8);
  float wave = sin(depth * 9. + uv.x * 3.2 + t * 1.6)
             + sin(depth * 14. - uv.x * 2.1 - t * 1.1);
  float crest = smoothstep(-.2, .9, wave * .5);

  float horizon = exp(-pow((uv.y - .16) * 3.2, 2.));
  vec3 deep = vec3(.03, .09, .12);
  vec3 sea = vec3(.22, .82, .92);
  vec3 sun = vec3(1., .80, .55);

  O = vec4(deep + sea * crest * (1.6 + 1.2 * smoothstep(.5, -.6, uv.y))
               + sun * horizon * (.35 + crest * 1.4), 1.);
}
`;

export const SHELF = /* glsl */ `
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
}

void mainImage(out vec4 O, vec2 U) {
  vec2 R = iResolution.xy;
  vec2 uv = (U - R * .5) / R.y;
  float t = iTime * .09;

  vec2 grid = vec2(5., 3.);
  vec2 p = uv * grid;
  p.y += t * 1.6;
  vec2 cell = floor(p);
  vec2 f = fract(p) - .5;
  float d = sdRoundBox(f, vec2(.31, .34), .06);
  float tile = smoothstep(.03, -.01, d);
  float h = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.545);

  vec3 dark = vec3(.07, .055, .045);
  vec3 lit = mix(vec3(.62, .46, .30), vec3(.95, .76, .50), h);
  vec3 col = mix(dark, lit, tile * (.55 + .45 * step(.45, h)));

  /* One bright edge per row, so the stack reads as shelves rather than bricks. */
  col += vec3(.62, .46, .28) * smoothstep(.92, 1., fract(p.y)) * .7;

  float sweep = exp(-pow(fract(uv.x * .45 - iTime * .08) - .5, 2.) * 45.);
  col += vec3(1., .80, .52) * sweep * (.25 + tile * .55);

  O = vec4(col, 1.);
}
`;
