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
const { spinUp, divergenceTrial, fuzzLog: fuzz } = await import(pathToFileURL(path.join(ROOT, 'scripts/planet/divergence.mjs')).href);

const TICKS = QUICK ? 200 : 1000;
const SEEDS = QUICK ? [1, 1234] : [1, 7, 1234, 99991];
const TRIALS = QUICK ? 4 : 12; // perturbation trials per seed
const HORIZON = QUICK ? 300 : 800; // ticks followed after each perturbation
let failures = 0;
const fail = (msg) => { failures++; console.log('  FAIL ' + msg); };
const ok = (msg) => console.log('  ok   ' + msg);


const results = { generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`, quick: QUICK, seeds: {}, divergence: [] };

for (const seed of SEEDS) {
  console.log(`seed ${seed}`);
  const s0 = C.initState(seed);
  const log = fuzz(C, seed, TICKS, s0.W, s0.H);
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
  const base = spinUp(C, seed);
  for (let trial = 0; trial < TRIALS; trial++) results.divergence.push(divergenceTrial(C, base, seed, trial, HORIZON));
}

// Rotation option (off by default; used by the planetary-baselines study).
{
  const opts = { rot: 128 };
  const a = C.replay(1234, [], 300, 192, 96, opts), b = C.replay(1234, [], 300, 192, 96, opts), z = C.replay(1234, [], 300);
  const t0 = C.totals(C.initState(1234, 192, 96, opts)), t1 = C.totals(a);
  const ok1 = C.hashState(a) === C.hashState(b), ok2 = t0.ground === t1.ground && t0.water === t1.water, ok3 = C.hashState(a) !== C.hashState(z);
  ok1 && ok2 && ok3 ? ok('rotation 128: deterministic, conserves ground and water, and changes the weather') : fail(`rotation: deterministic ${ok1}, conserved ${ok2}, differs ${ok3}`);
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
