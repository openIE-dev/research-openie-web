// The planet as a sphere (PLN-031). Exact zone: integer arithmetic only, with
// results that are the same on every machine.
//
// A surface sample is addressed by a cube face and integer face coordinates.
// It is mapped to the sphere with an exact integer square root and exact
// integer division, raised by an elevation from 3D integer value noise, and
// returned in integer micrometres (BigInt).
//
// JavaScript numbers are exact for integers below 2^53, and Math.sqrt and
// division are correctly rounded (IEEE 754), so each helper below computes a
// float estimate and corrects it to the exact integer answer. Every product in
// this file stays below 2^53. Rounding is always floor (toward minus infinity),
// never truncation; ports must do the same. WGSL's sqrt is not required to be
// correctly rounded, so a GPU port must use an integer square root.

import { mix32 } from './core.js';

export const RADIUS_M = 6371000;          // sea-level radius, metres
export const FACE_HALF = 1 << 24;         // cube half-size in face units (16,777,216)

// ---------------------------------------------------------------- exact helpers

// floor(sqrt(n)) for 0 <= n < 2^53.
export function isqrt(n) {
  let r = Math.floor(Math.sqrt(n));
  while (r * r > n) r--;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}

// floor(a / b) for integers |a| < 2^53, 0 < b < 2^53.
export function floorDiv(a, b) {
  let q = Math.floor(a / b);
  while (q * b > a) q--;
  while ((q + 1) * b <= a) q++;
  return q;
}

// Truncating division (toward zero) on the magnitude, sign restored; |a|, b < 2^53.
export function divTrunc(a, b) {
  const neg = a < 0, q = floorDiv(neg ? -a : a, b);
  return neg ? -q : q;
}

// ---------------------------------------------------------------- 3D integer value noise

export function hash4(seed, x, y, z) {
  let h = mix32((seed ^ Math.imul(x, 0x9e3779b1)) >>> 0);
  h = mix32((h ^ Math.imul(y, 0x85ebca77)) >>> 0);
  return mix32((h ^ Math.imul(z, 0xc2b2ae3d)) >>> 0);
}

// Fixed-point smoothstep with 16 fractional bits: t in 0..65535 -> 0..65536.
// t*t*(3*65536 - 2t) < 2^50, and dividing by 2^32 is exact in floating point.
const smooth16 = (t) => Math.floor((t * t * (196608 - 2 * t)) / 4294967296);
// (b - a) * s < 2^32 in magnitude; floor, not truncation.
const lerp16 = (a, b, s) => a + Math.floor(((b - a) * s) / 65536);

// Value noise on a cubic lattice of 2^k metres, k <= 22. x, y, z are integer metres
// with |v| < 2^31; >> is a floor for negatives and & gives the non-negative remainder.
export function noise3(seed, x, y, z, k) {
  const lx = x >> k, ly = y >> k, lz = z >> k, m = (1 << k) - 1, p = 2 ** k;
  const f = (c) => smooth16(Math.floor(((c & m) * 65536) / p));
  const sx = f(x), sy = f(y), sz = f(z);
  const v = (dx, dy, dz) => hash4(seed, lx + dx, ly + dy, lz + dz) & 0xffff;
  const x00 = lerp16(v(0, 0, 0), v(1, 0, 0), sx), x10 = lerp16(v(0, 1, 0), v(1, 1, 0), sx);
  const x01 = lerp16(v(0, 0, 1), v(1, 0, 1), sx), x11 = lerp16(v(0, 1, 1), v(1, 1, 1), sx);
  return lerp16(lerp16(x00, x10, sy), lerp16(x01, x11, sy), sz);
}

// Octaves from about 4,194 km down to 64 m; amplitudes in millimetres.
const OCT3 = [
  [22, 8000000], [21, 4000000], [20, 2400000], [19, 1400000], [18, 800000], [17, 500000],
  [16, 300000], [15, 160000], [14, 80000], [13, 40000], [12, 24000], [11, 14000],
  [10, 8000], [9, 4500], [8, 2500], [7, 1400], [6, 800],
];

// Elevation in millimetres above sea level at the sea-level point (x, y, z), integer metres.
// The sum is below 32768 * 17,702,600 < 2^40 in magnitude.
export function elevationMm(seed, x, y, z) {
  let sum = 0;
  for (const [k, amp] of OCT3) {
    const s = mix32((seed ^ Math.imul(k + 101, 0x27d4eb2d)) >>> 0);
    sum += (noise3(s, x, y, z, k) - 32768) * amp;
  }
  return floorDiv(sum, 65536);
}

// ---------------------------------------------------------------- cube-sphere mapping

// Face f in 0..5 (+X, -X, +Y, -Y, +Z, -Z); u, v in [-FACE_HALF, FACE_HALF].
export function cubePoint(f, u, v) {
  const S = FACE_HALF;
  switch (f) {
    case 0: return [S, v, -u];
    case 1: return [-S, v, u];
    case 2: return [u, S, -v];
    case 3: return [u, -S, v];
    case 4: return [u, v, S];
    default: return [-u, v, -S];
  }
}

const cubeLen = (p) => isqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]); // |p|^2 <= 3 * 2^48

// Integer metres at radius r (metres, r * 2^24 < 2^53) in the direction of cube point p.
export function onSphere(p, r) {
  const L = cubeLen(p);
  return [divTrunc(r * p[0], L), divTrunc(r * p[1], L), divTrunc(r * p[2], L)];
}

// Integer micrometres (BigInt) at radius rUm (BigInt micrometres) in the direction of p.
export function onSphereUm(p, rUm) {
  const L = BigInt(cubeLen(p));
  return p.map((c) => (rUm * BigInt(c)) / L); // BigInt division truncates toward zero
}

export const SEA_UM = BigInt(RADIUS_M) * 1000000n;

// The surface sample: elevation (mm) at the sea-level point, and the surface point in
// micrometres. Oceans: the surface drawn is the sea surface.
export function surfaceSample(seed, f, u, v, dropUm = 0n) {
  const p = cubePoint(f, u, v);
  const sea = onSphere(p, RADIUS_M);
  const e = elevationMm(seed, sea[0], sea[1], sea[2]);
  const rUm = SEA_UM + (e > 0 ? BigInt(e) * 1000n : 0n) - dropUm;
  return { elevationMm: e, surfaceUm: onSphereUm(p, rUm) };
}

// Hash of a grid of samples, for cross-implementation and cross-machine checks.
export function hashSamples(seed, f, n) {
  let h = 0x811c9dc5;
  const step = Math.floor((2 * FACE_HALF) / n);
  const feed = (x) => { h = mix32((h ^ Number(BigInt.asUintN(32, BigInt(x)))) >>> 0); };
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const s = surfaceSample(seed, f, -FACE_HALF + i * step, -FACE_HALF + j * step);
    for (const c of s.surfaceUm) { feed(c); feed(c >> 32n); }
    feed(s.elevationMm);
  }
  return h.toString(16).padStart(8, '0');
}
