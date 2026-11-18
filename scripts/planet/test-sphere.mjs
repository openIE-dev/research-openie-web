#!/usr/bin/env node
// Checks for the sphere module (public/living/planet/sphere.js), PLN-031.
//   - isqrt and divTrunc agree with BigInt on edge cases and random inputs
//   - the 12 cube edges give identical samples from both faces (no seams)
//   - elevation statistics, and a reference hash for other implementations
//
//   node scripts/planet/test-sphere.mjs [--quick]
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const S = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/sphere.js')).href);
const { mix32 } = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const QUICK = process.argv.includes('--quick');
let failures = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) failures++; };

// 1. Exact integer helpers against BigInt.
{
  const bisqrt = (n) => { if (n < 2n) return n; let x = n, y = (x + 1n) / 2n; while (y < x) { x = y; y = (x + n / x) / 2n; } return x; };
  const MAX = 2 ** 53 - 1;
  const cases = [0, 1, 2, 3, 4, 15, 16, 17, 2 ** 52, MAX, (2 ** 26) ** 2, (2 ** 26) ** 2 - 1, (2 ** 26 + 1) ** 2 - 1, 3 * 2 ** 48];
  let h = 12345;
  for (let i = 0; i < (QUICK ? 20000 : 200000); i++) {
    h = mix32(h + i);
    cases.push(Math.floor((h / 2 ** 32) * MAX));
    const r = (mix32(h ^ 9) % 94906265) + 1; // around sqrt(2^53)
    cases.push(r * r, r * r - 1);
  }
  let bad = 0;
  for (const n of cases) if (n >= 0 && n <= MAX && BigInt(S.isqrt(n)) !== bisqrt(BigInt(n))) bad++;
  check(bad === 0, `isqrt matches BigInt on ${cases.length} inputs`);

  let badDiv = 0, nDiv = 0;
  for (let i = 0; i < (QUICK ? 20000 : 200000); i++) {
    h = mix32(h + i);
    const b = (mix32(h ^ 1) % 29058990) + 1;
    let a = Math.floor((mix32(h ^ 2) / 2 ** 32) * 2 ** 52);
    if (mix32(h ^ 3) & 1) a = -a;
    if (i % 7 === 0) a = (a > 0 ? 1 : -1) * Math.abs(Math.floor(a / b)) * b; // exact multiples
    const want = BigInt(a) / BigInt(b); // BigInt division truncates toward zero
    if (BigInt(S.divTrunc(a, b)) !== want) badDiv++;
    nDiv++;
  }
  check(badDiv === 0, `divTrunc matches BigInt on ${nDiv} inputs`);

  let badFloor = 0;
  for (let i = 0; i < (QUICK ? 20000 : 200000); i++) {
    h = mix32(h + i);
    const b = (mix32(h ^ 4) % 65536) + 1;
    let a = Math.floor((mix32(h ^ 5) / 2 ** 32) * 2 ** 50);
    if (mix32(h ^ 6) & 1) a = -a;
    const A = BigInt(a), B = BigInt(b);
    const want = A >= 0n ? A / B : -((-A + B - 1n) / B); // floor division
    if (BigInt(S.floorDiv(a, b)) !== want) badFloor++;
  }
  check(badFloor === 0, `floorDiv matches BigInt floor division on ${QUICK ? 20000 : 200000} inputs`);
}

// 2. No seams: points on each cube edge, sampled from both faces, are identical.
{
  const F = S.FACE_HALF, seed = 1234;
  const n = QUICK ? 64 : 512;
  let compared = 0, bad = 0;
  // For every pair of faces, any (u, v) on face a whose cube point lies on face b
  // must be re-expressible on face b; compare by cube point.
  const key = (p) => p.join(',');
  const pointsByCube = new Map();
  for (let f = 0; f < 6; f++) {
    for (let i = 0; i <= n; i++) {
      const t = -F + Math.floor((2 * F * i) / n);
      for (const [u, v] of [[-F, t], [F, t], [t, -F], [t, F]]) {
        const p = S.cubePoint(f, u, v);
        const s = S.surfaceSample(seed, f, u, v);
        const k = key(p), prev = pointsByCube.get(k);
        if (prev) { compared++; if (key(prev.surfaceUm) !== key(s.surfaceUm) || prev.elevationMm !== s.elevationMm) bad++; }
        else pointsByCube.set(k, s);
      }
    }
  }
  check(compared > 0 && bad === 0, `cube edges: ${compared} shared samples identical from both faces`);
}

// 3. Elevation statistics and reference hashes.
{
  const seed = 1234, n = QUICK ? 48 : 160;
  let land = 0, total = 0, min = Infinity, max = -Infinity;
  for (let f = 0; f < 6; f++) for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const F = S.FACE_HALF, step = Math.floor((2 * F) / n);
    const e = S.surfaceSample(seed, f, -F + i * step, -F + j * step).elevationMm / 1000;
    total++; if (e > 0) land++; if (e < min) min = e; if (e > max) max = e;
  }
  console.log(`  elevation over ${total} samples: min ${min.toFixed(1)} m, max ${max.toFixed(1)} m, land ${(100 * land / total).toFixed(1)}%`);
  check(min > -12000 && max < 12000 && land > 0 && land < total, 'elevations within +-12 km and both land and sea present');
  const hashes = [0, 1, 2, 3, 4, 5].map((f) => S.hashSamples(seed, f, 32));
  console.log(`  reference hashes (seed ${seed}, 33 x 33 per face): ${hashes.join(' ')}`);
}

console.log(failures ? `${failures} failure(s)` : 'all checks passed');
process.exit(failures ? 1 : 0);
