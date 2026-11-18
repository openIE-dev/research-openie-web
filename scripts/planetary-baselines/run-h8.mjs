#!/usr/bin/env node
// BL-H8: the power of the residual protocol. Registered (committed) before first run.
//
// A hidden heat sink is added to the true world: after every true step, each cell in a
// hidden set M loses k heat units. M is a fixed fraction p of cells chosen by hash:
// cell i is in M when hash3(seed ^ 0xB1A5, i, 0) % 10000 < p * 10000. The analyst's
// model is the full toy step (it knows nothing of M). Everything else is the BL-H1
// protocol (scripts/planetary-baselines/protocol.mjs): heat observed with noise -2..2,
// spin-up 200 ticks (with the sink active), analysis ticks 200 to 299 every 5th tick,
// fields T, q, w, g; candidates = BL-H1's nine plus "marker" (1 if the cell is in M);
// eta^2 with 10 quantile bins; structure = p < 0.01 / 40 (Bonferroni over 4 x 10 pairs)
// and eta^2 >= 0.01.
//
// Grid: p in {0.001, 0.003, 0.01, 0.03, 0.1}; k in {0, 1, 2, 4, 8}; seeds 216 to 223.
// Found (k > 0): the top pair by eta^2 is (T, marker) and has structure.
// False detection (k = 0): the pair (T, marker) has structure, at any rank.
//
// Kill: detection in fewer than 6 of 8 seeds for any cell with p >= 0.01 and k >= 2; or
// false detection in more than 1 of 8 seeds at any p. The rest of the grid is the
// protocol's power curve, reported without a pass condition.
//
//   node scripts/planetary-baselines/run-h8.mjs   # writes docs/planetary-baselines/results/h8.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BASE_CANDS, observe, candidates, bins, etaSquared, ETA_MIN } from './protocol.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);

const PS = [0.001, 0.003, 0.01, 0.03, 0.1], KS = [0, 1, 2, 4, 8], SEEDS = [216, 217, 218, 219, 220, 221, 222, 223];
const FIELDS = ['T', 'q', 'w', 'g'], CANDS = [...BASE_CANDS, 'marker'];
const ALPHA = 0.01 / (FIELDS.length * CANDS.length);

function run(seed, p, k) {
  const n0 = C.initState(seed).g.length;
  const inM = new Uint8Array(n0);
  for (let i = 0; i < n0; i++) inM[i] = C.hash3(seed ^ 0xb1a5, i, 0) % 10000 < p * 10000 ? 1 : 0;
  const trueStep = (s) => { const t = C.step(s); if (k) for (let i = 0; i < n0; i++) if (inM[i]) t.T[i] -= k; return t; };
  let s = C.initState(seed);
  for (let t = 0; t < 200; t++) s = trueStep(s);
  const truth = [s];
  for (let t = 0; t < 100; t++) truth.push(trueStep(truth[truth.length - 1]));
  const R = Object.fromEntries(FIELDS.map((f) => [f, []])), Xs = Object.fromEntries(CANDS.map((c) => [c, []]));
  for (let j = 0; j < truth.length - 1; j += 5) {
    const o0 = observe(truth[j], seed), o1 = observe(truth[j + 1], seed);
    const pred = C.step(o0), X = candidates(o0);
    for (const f of FIELDS) { const a = o1[f], b = pred[f]; for (let i = 0; i < a.length; i++) R[f].push(a[i] - b[i]); }
    for (const c of BASE_CANDS) for (let i = 0; i < X[c].length; i++) Xs[c].push(X[c][i]);
    for (let i = 0; i < n0; i++) Xs.marker.push(inM[i]);
  }
  const B = Object.fromEntries(CANDS.map((c) => [c, bins(Xs[c])]));
  const pairs = [];
  for (const f of FIELDS) for (const c of CANDS) {
    const r = etaSquared(R[f], B[c]);
    if (r) pairs.push({ field: f, cand: c, eta2: r.eta2, structure: r.p < ALPHA && r.eta2 >= ETA_MIN });
  }
  pairs.sort((a, b) => b.eta2 - a.eta2);
  const marker = pairs.find((x) => x.field === 'T' && x.cand === 'marker');
  return {
    markerCells: inM.reduce((a, b) => a + b, 0), top: `${pairs[0].field}~${pairs[0].cand}`, topEta2: Number(pairs[0].eta2.toFixed(4)),
    markerEta2: marker ? Number(marker.eta2.toFixed(4)) : null, markerStructure: !!marker?.structure,
    found: pairs[0].field === 'T' && pairs[0].cand === 'marker' && pairs[0].structure,
  };
}

if (process.argv.includes('--smoke')) { console.log(JSON.stringify(run(999, 0.01, 2))); process.exit(0); } // unregistered seed

const grid = [];
const T0 = Date.now();
for (const p of PS) for (const k of KS) {
  const per = SEEDS.map((seed) => ({ seed, ...run(seed, p, k) }));
  const hits = k ? per.filter((r) => r.found).length : per.filter((r) => r.markerStructure).length;
  const eta = per.map((r) => r.markerEta2).filter((v) => v !== null);
  grid.push({ p, k, hits, of: SEEDS.length, kind: k ? 'detected' : 'false detection', medianMarkerEta2: eta.sort((a, b) => a - b)[Math.floor(eta.length / 2)], per });
  console.log(`[${((Date.now() - T0) / 1000).toFixed(0)}s] p=${p} k=${k}: ${k ? 'detected' : 'false detection'} in ${hits} of 8 (median eta2 of T~marker ${grid[grid.length - 1].medianMarkerEta2})`);
}

const failsDetect = grid.filter((g) => g.k >= 2 && g.p >= 0.01 && g.hits < 6);
const failsNull = grid.filter((g) => g.k === 0 && g.hits > 1);
const verdict = { hypothesis: 'BL-H8', missedCells: failsDetect.map((g) => `p=${g.p},k=${g.k}: ${g.hits}/8`), falseDetections: failsNull.map((g) => `p=${g.p}: ${g.hits}/8`), result: failsDetect.length || failsNull.length ? 'killed' : 'survives this test' };
console.log(JSON.stringify(verdict));
const out = path.join(ROOT, 'docs/planetary-baselines/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h8.json'), JSON.stringify({ generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`, design: { PS, KS, SEEDS, alpha: ALPHA, etaMin: ETA_MIN }, verdict, grid }, null, 1) + '\n');
