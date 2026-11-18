#!/usr/bin/env node
// BL-H3 (study Section 5): a dimensionless group predicts the doubling time across worlds.
// Everything below was fixed and committed before this script was first run.
//
// Worlds: every combination of size W in {128, 192, 256} (H = W / 2), rotation rot in
// {0, 64, 128, 192, 256}, and seed in {400, 401, 402, 403}: 60 worlds, enumerated in
// that nesting order (size outermost). Water per cell varies with seed and size.
//
// Per world
// - Doubling time: as in PL-H12 (scripts/planet/divergence.mjs) but with 8 trials of
//   600 ticks after a 200-tick spin-up: one unit dug at a hashed cell, ln(difference
//   mass) fitted between 10 and 1/10 of its final value; the world's value is the upper
//   median of trials that gave a fit. A world with fewer than 3 fitted trials has no
//   measured growth.
// - Secondary, no pass condition: a weather-to-macroweather transition time. Temperature
//   of every 16th cell over ticks 720 to 2,767 (2,048 ticks); the mean of each of 24
//   season phases (30 ticks) over that window is subtracted; Haar fluctuations (mean of
//   the second half of a window minus the first half, absolute) are averaged over cells
//   and windows at scales 2, 4, ..., 1,024; the transition time is the scale with the
//   largest mean fluctuation. A maximum at the largest scale (1,024) means no transition
//   was found within the range measured, and is reported as such.
//
// Candidate groups (computed from each world's initial state and parameters)
//   omega = initial water per cell / 16 (16 is the smallest saturation in the step)
//   r     = rot / 256
//   chi   = 8 W / 720: ticks for the westerly drift (1/8 of a cell per tick) to cross the
//           map, over the season length
// Model: ln(doubling) = a + b ln(omega) + c r + d ln(chi), ordinary least squares on the
// training worlds. Held out: every 4th world in enumeration order (indices 3, 7, 11, ...).
// Worlds without measured growth are excluded from both sets and counted.
//
// Kill: the prediction is off by more than a factor of 2 (max(pred/obs, obs/pred) > 2) on
// more than a quarter of the held-out worlds that have growth. If more than half of all
// worlds have no measured growth, BL-H3 is reported as not testable, not as killed.
//
//   node scripts/planetary-baselines/run-h3.mjs   # writes docs/planetary-baselines/results/h3.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const D = await import(pathToFileURL(path.join(ROOT, 'scripts/planet/divergence.mjs')).href);

const SIZES = [128, 192, 256], ROTS = [0, 64, 128, 192, 256], SEEDS = [400, 401, 402, 403];
const TRIALS = 8, HORIZON = 600, SPIN = 200;

function doublingTime(seed, W, H, rot) {
  let base = C.initState(seed, W, H, { rot });
  for (let t = 0; t < SPIN; t++) base = C.advance(base, []);
  const dts = [];
  for (let k = 0; k < TRIALS; k++) { const r = D.divergenceTrial(C, base, seed, k, HORIZON); if (r.doublingTicks) dts.push(r.doublingTicks); }
  return { fitted: dts.length, doubling: dts.length >= 3 ? D.upperMedian(dts) : null };
}

function haarTransition(seed, W, H, rot) {
  let s = C.initState(seed, W, H, { rot });
  for (let t = 0; t < 720; t++) s = C.step(s);
  const cells = []; for (let c = 0; c < s.g.length; c += 16) cells.push(c);
  const N = 2048, series = cells.map(() => new Float64Array(N)), ph = new Int32Array(N);
  for (let t = 0; t < N; t++) { ph[t] = Math.floor((s.t % 720) / 30); cells.forEach((c, k) => { series[k][t] = s.T[c]; }); s = C.step(s); }
  for (const x of series) { // remove the mean of each season phase
    const sum = new Float64Array(24), cnt = new Float64Array(24);
    for (let t = 0; t < N; t++) { sum[ph[t]] += x[t]; cnt[ph[t]]++; }
    for (let t = 0; t < N; t++) x[t] -= sum[ph[t]] / cnt[ph[t]];
  }
  const curve = [];
  for (let dt = 2; dt <= 1024; dt *= 2) {
    let acc = 0, n = 0;
    for (const x of series) for (let t = 0; t + dt <= N; t += dt / 2) {
      let a = 0, b = 0;
      for (let k = 0; k < dt / 2; k++) { a += x[t + k]; b += x[t + dt / 2 + k]; }
      acc += Math.abs(b - a) / (dt / 2); n++;
    }
    curve.push([dt, acc / n]);
  }
  const best = curve.reduce((m, p) => (p[1] > m[1] ? p : m));
  return { transition: best[0], curve: curve.map(([d, f]) => [d, Number(f.toFixed(3))]) };
}

// Ordinary least squares via the normal equations.
function ols(X, y) {
  const d = X[0].length, A = Array.from({ length: d }, () => new Array(d).fill(0)), b = new Array(d).fill(0);
  X.forEach((r, i) => { for (let j = 0; j < d; j++) { b[j] += r[j] * y[i]; for (let k = 0; k < d; k++) A[j][k] += r[j] * r[k]; } });
  for (let j = 0; j < d; j++) {
    let p = j; for (let r = j + 1; r < d; r++) if (Math.abs(A[r][j]) > Math.abs(A[p][j])) p = r;
    [A[j], A[p]] = [A[p], A[j]]; [b[j], b[p]] = [b[p], b[j]];
    for (let r = j + 1; r < d; r++) { const f = A[r][j] / A[j][j]; for (let k = j; k < d; k++) A[r][k] -= f * A[j][k]; b[r] -= f * b[j]; }
  }
  const w = new Array(d).fill(0);
  for (let j = d - 1; j >= 0; j--) { let s = b[j]; for (let k = j + 1; k < d; k++) s -= A[j][k] * w[k]; w[j] = s / A[j][j]; }
  return w;
}

if (process.argv.includes('--smoke')) { // crash check on a world outside the registered set
  const t = Date.now();
  console.log(JSON.stringify(doublingTime(999, 128, 64, 64)), JSON.stringify(haarTransition(999, 128, 64, 64).transition), `${Date.now() - t} ms`);
  process.exit(0);
}

const worlds = [];
const T0 = Date.now();
for (const W of SIZES) for (const rot of ROTS) for (const seed of SEEDS) {
  const H = W / 2, st = C.initState(seed, W, H, { rot });
  const omega = C.totals(st).water / st.g.length / 16, r = rot / 256, chi = (8 * W) / 720;
  const dt = doublingTime(seed, W, H, rot), haar = haarTransition(seed, W, H, rot);
  const w = { index: worlds.length, W, H, rot, seed, omega: Number(omega.toFixed(3)), r, chi: Number(chi.toFixed(3)), ...dt, haarTransition: haar.transition, haarCurve: haar.curve };
  worlds.push(w);
  console.log(`[${((Date.now() - T0) / 1000).toFixed(0)}s] world ${w.index} W=${W} rot=${rot} seed=${seed} omega=${w.omega} doubling=${w.doubling} (fitted ${w.fitted}) haar=${w.haarTransition}`);
}

const grown = worlds.filter((w) => w.doubling);
let verdict;
if (grown.length * 2 < worlds.length) {
  verdict = { hypothesis: 'BL-H3', result: 'not testable', worldsWithGrowth: grown.length, of: worlds.length };
} else {
  const feat = (w) => [1, Math.log(w.omega), w.r, Math.log(w.chi)];
  const train = grown.filter((w) => w.index % 4 !== 3), test = grown.filter((w) => w.index % 4 === 3);
  const coef = ols(train.map(feat), train.map((w) => Math.log(w.doubling)));
  const errs = test.map((w) => { const pred = Math.exp(feat(w).reduce((s, v, j) => s + v * coef[j], 0)); return { index: w.index, obs: w.doubling, pred: Number(pred.toFixed(2)), factor: Number(Math.max(pred / w.doubling, w.doubling / pred).toFixed(3)) }; });
  const bad = errs.filter((e) => e.factor > 2).length;
  verdict = {
    hypothesis: 'BL-H3', worldsWithGrowth: grown.length, of: worlds.length, train: train.length, heldOut: errs.length,
    coefficients: { a: coef[0], b_lnOmega: coef[1], c_r: coef[2], d_lnChi: coef[3] },
    heldOutOffByMoreThan2: bad, result: bad * 4 > errs.length ? 'killed' : 'survives this test', heldOutErrors: errs,
  };
}
console.log(JSON.stringify({ ...verdict, heldOutErrors: undefined }));
const out = path.join(ROOT, 'docs/planetary-baselines/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h3.json'), JSON.stringify({ generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`, verdict, worlds }, null, 1) + '\n');
