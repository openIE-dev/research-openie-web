#!/usr/bin/env node
// Tests for the planet exact core (public/living/planet/core.js), milestone M1.
//
//   node scripts/planet/test-core.mjs            # run, print, write docs/planet/results/core.json
//   node scripts/planet/test-core.mjs --quick    # fewer ticks and trials
//
// Exits non-zero if determinism, replay or conservation fails. The divergence and
// doubling-time measurements (PL-H3, PL-H4) are reported, not asserted, except that
// identical logs must never diverge.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const QUICK = process.argv.includes('--quick');

const TICKS = QUICK ? 200 : 1000;
const SEEDS = QUICK ? [1, 1234] : [1, 7, 1234, 99991];
const TRIALS = QUICK ? 4 : 12; // perturbation trials per seed
const HORIZON = QUICK ? 300 : 800; // ticks followed after each perturbation
let failures = 0;
const fail = (msg) => { failures++; console.log('  FAIL ' + msg); };
const ok = (msg) => console.log('  ok   ' + msg);

// Deterministic pseudo-random edits (the fuzz stream is itself seeded).
function fuzzLog(seed, ticks, W, H) {
  const log = [];
  let h = C.mix32(seed ^ 0xabcdef);
  for (let t = 0; t < ticks; t++) {
    h = C.mix32(h + t);
    if ((h & 7) !== 0) continue; // about one edit every eight ticks
    const r = C.mix32(h);
    log.push({ t, x: r % W, y: (r >>> 12) % H, op: C.OPS[(r >>> 24) & 3], k: 1 + ((r >>> 8) & 63) });
  }
  return log;
}

const results = { generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`, quick: QUICK, seeds: {}, divergence: [] };

for (const seed of SEEDS) {
  console.log(`seed ${seed}`);
  const s0 = C.initState(seed);
  const log = fuzzLog(seed, TICKS, s0.W, s0.H);
  const r = { edits: log.length };

  // Determinism: two independent runs give the same hash at every tick (PL-H3, first half).
  let a = C.initState(seed), b = C.initState(seed);
  const refusedA = [], refusedB = [];
  const t0 = C.totals(a);
  let hashMismatch = -1, conservationBreak = -1;
  for (let t = 0; t < TICKS; t++) {
    a = C.advance(a, log, refusedA); b = C.advance(b, log, refusedB);
    if (hashMismatch < 0 && C.hashState(a) !== C.hashState(b)) hashMismatch = t;
    const tt = C.totals(a);
    if (conservationBreak < 0 && (tt.ground !== t0.ground || tt.water !== t0.water)) conservationBreak = t;
  }
  r.finalHash = C.hashState(a);
  r.refused = refusedA.length;
  hashMismatch < 0 ? ok(`identical logs, identical hashes for ${TICKS} ticks`) : fail(`hash mismatch at tick ${hashMismatch}`);
  // PL-H6 on the toy: totals of ground and water never change.
  conservationBreak < 0 ? ok(`ground ${t0.ground} and water ${t0.water} conserved under ${log.length} fuzzed edits (${refusedA.length} refused)`) : fail(`conservation broken at tick ${conservationBreak}`);

  // Replay: seed + log from scratch reproduces the live state.
  const rep = C.replay(seed, log, TICKS);
  C.hashState(rep) === r.finalHash ? ok('replay from seed and log reproduces the final hash') : fail('replay differs');

  // Refused edits never change state: a log with only refused edits equals the empty log.
  const bad = [{ t: 0, x: 0, y: 0, op: 'raise', k: 1 }, { t: 1, x: 1, y: 1, op: 'pour', k: 5 }];
  const e1 = C.replay(seed, bad, 20), e0 = C.replay(seed, [], 20);
  C.hashState(e1) === C.hashState(e0) ? ok('inadmissible edits are refused and change nothing') : fail('a refused edit changed state');
  r.passed = hashMismatch < 0 && conservationBreak < 0;
  results.seeds[seed] = r;

  // Divergence (PL-H3 second half, PL-H4): one unit dug at one cell after 200 ticks of spin-up.
  let base = C.initState(seed);
  for (let t = 0; t < 200; t++) base = C.advance(base, []);
  for (let trial = 0; trial < TRIALS; trial++) {
    let h = C.hash3(seed, trial, 77), i;
    do { i = h % base.g.length; h = C.mix32(h); } while (base.g[i] < 1);
    const x = i % base.W, y = Math.floor(i / base.W);
    let p = C.cloneState(base), q = C.cloneState(base);
    const logQ = [{ t: base.t, x, y, op: 'dig', k: 1 }];
    const series = [];
    for (let k = 1; k <= HORIZON; k++) {
      p = C.advance(p, []); q = C.advance(q, logQ);
      series.push(C.divergence(p, q));
    }
    // Doubling time: least-squares slope of ln(mass) while mass is between 10 and 1/10 of its final value.
    const final = series[series.length - 1].mass;
    const pts = series.map((d, k) => [k + 1, d.mass]).filter(([, m]) => m >= 10 && m <= final / 10);
    let doubling = null;
    if (pts.length >= 10) {
      const n = pts.length, xs = pts.map((p) => p[0]), ys = pts.map((p) => Math.log(p[1]));
      const mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
      let sxy = 0, sxx = 0;
      for (let j = 0; j < n; j++) { sxy += (xs[j] - mx) * (ys[j] - my); sxx += (xs[j] - mx) ** 2; }
      const slope = sxy / sxx;
      if (slope > 0) doubling = Math.LN2 / slope;
    }
    const at = (k) => series[Math.min(k, HORIZON) - 1].cells;
    results.divergence.push({
      seed, trial, x, y, ground: base.g[i], water: base.w[i],
      cells: { 1: at(1), 10: at(10), 50: at(50), 100: at(100), 200: at(200), [HORIZON]: at(HORIZON) },
      finalMass: final, fitPoints: pts.length, doublingTicks: doubling && Number(doubling.toFixed(2)),
    });
  }
}

// Summary of divergence.
const N = results.divergence.length, cellsTotal = C.initState(1).g.length;
const spread = results.divergence.filter((d) => d.cells[HORIZON] >= cellsTotal / 2).length;
const local = results.divergence.filter((d) => d.cells[HORIZON] <= 10).length;
const dts = results.divergence.map((d) => d.doublingTicks).filter((v) => v).sort((a, b) => a - b);
results.summary = {
  cellsPerMap: cellsTotal, horizonTicks: HORIZON, trials: N,
  spreadToHalfTheMap: spread, stayedWithin10Cells: local,
  doublingTicks: dts.length ? { n: dts.length, min: dts[0], median: dts[Math.floor(dts.length / 2)], max: dts[dts.length - 1], maxOverMin: Number((dts[dts.length - 1] / dts[0]).toFixed(2)) } : null,
  failures,
};
console.log('divergence after one unit dug:', JSON.stringify(results.summary));

const out = path.join(ROOT, 'docs/planet/results');
fs.mkdirSync(out, { recursive: true });
if (!QUICK) fs.writeFileSync(path.join(out, 'core.json'), JSON.stringify(results, null, 1) + '\n');
console.log(failures ? `${failures} failure(s)` : 'all checks passed');
process.exit(failures ? 1 : 0);
