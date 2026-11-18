#!/usr/bin/env node
// BL-H2 (study Section 5): a baseline prior helps past the horizon.
// Everything below was fixed and committed before this script was first run.
//
// Worlds
// - Seeds from 300 upward whose initial water (core.totals) is at least 15 units per
//   cell (the PL-H12 rule). The first 16 such seeds train; the next 8 test.
//
// Baseline (the "structure")
// - For each world, a separate climatology run: the world's initial state with one unit
//   dug at a hashed land cell at tick 0, run for 2,880 ticks (4 seasons of 720). Ticks
//   720 to 2,879 give the mean of T per cell per season phase (24 phases of 30 ticks).
//   This run never shares a trajectory with the forecast samples below.
//
// Forecast samples
// - A second trajectory of the same world (unperturbed), run from tick 0. Start times
//   t0 = 720 + 60k for k = 0..11; lead times L = 25, 75, 250 ticks (about 1, 3 and 10
//   doubling times, from PL-H12). Every 7th cell is used.
//
// Forecasters: ridge regression (lambda = 1e-3 on standardised features, intercept
// unpenalised), fitted on the training worlds, one model per lead time.
// - A  (direct):   target T(t0+L); features T, q, w, altitude, |latitude|, sun(t0), sun(t0+L).
// - B  (baseline): target T(t0+L) - clim(t0+L); features T - clim(t0), q, w, altitude,
//                  |latitude|, sun(t0), sun(t0+L); prediction clim(t0+L) + fitted value.
// - A+ (direct with the baseline as input): A's features plus clim(t0) and clim(t0+L).
// - Reference forecasts, reported: persistence T(t0); climatology clim(t0+L).
//
// Measure: RMSE of T per test world and lead time.
// Kill: at L = 250, B's RMSE is not lower than A's on at least 6 of the 8 test worlds.
// B against A+ is reported as a secondary comparison, with no pass condition.
//
//   node scripts/planetary-baselines/run-h2.mjs   # writes docs/planetary-baselines/results/h2.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);

const LEADS = [25, 75, 250], PERIOD = 720, PHASES = 24, PHASE_LEN = PERIOD / PHASES;
const STARTS = Array.from({ length: 12 }, (_, k) => 720 + 60 * k), CELL_STEP = 7, LAMBDA = 1e-3;
const phase = (t) => Math.floor((t % PERIOD) / PHASE_LEN);

// ---------------------------------------------------------------- worlds
const worlds = [];
for (let s = 300; worlds.length < 24; s++) {
  const st = C.initState(s);
  if (C.totals(st).water / st.g.length >= 15) worlds.push(s);
}
const TRAIN = worlds.slice(0, 16), TEST = worlds.slice(16);
console.log('train', TRAIN.join(' '), '| test', TEST.join(' '));

function climatology(seed) {
  let s = C.initState(seed);
  let h = C.hash3(seed, 1, 2), i;
  do { i = h % s.g.length; h = C.mix32(h); } while (s.g[i] < C.SEA);
  C.applyEdit(s, { t: 0, x: i % s.W, y: Math.floor(i / s.W), op: 'dig', k: 1 });
  const n = s.g.length, sum = new Float64Array(PHASES * n), cnt = new Float64Array(PHASES);
  for (let t = 0; t < 4 * PERIOD; t++) {
    if (t >= PERIOD) { const p = phase(s.t); cnt[p]++; for (let c = 0; c < n; c++) sum[p * n + c] += s.T[c]; }
    s = C.step(s);
  }
  for (let p = 0; p < PHASES; p++) for (let c = 0; c < n; c++) sum[p * n + c] /= cnt[p];
  return (t, c) => sum[phase(t) * n + c];
}

// Rows for one world: per lead, arrays of { features per arm, target, persistence, clim }.
function samples(seed) {
  const clim = climatology(seed);
  const maxT = STARTS[STARTS.length - 1] + LEADS[LEADS.length - 1];
  const traj = new Map();
  let s = C.initState(seed);
  const need = new Set(STARTS.flatMap((t0) => [t0, ...LEADS.map((L) => t0 + L)]));
  for (let t = 0; t <= maxT; t++) { if (need.has(s.t)) traj.set(s.t, s); s = C.step(s); }
  const H = s.H, W = s.W;
  const out = Object.fromEntries(LEADS.map((L) => [L, []]));
  for (const t0 of STARTS) {
    const a = traj.get(t0);
    const sun0 = (y) => C.sun(y, t0, H);
    for (const L of LEADS) {
      const b = traj.get(t0 + L);
      for (let c = 0; c < a.g.length; c += CELL_STEP) {
        const y = Math.floor(c / W), lat = Math.abs(2 * y - (H - 1)), alt = Math.max(0, a.g[c] - C.SEA);
        const sunL = C.sun(y, t0 + L, H), c0 = clim(t0, c), cL = clim(t0 + L, c);
        out[L].push({
          A: [a.T[c], a.q[c], a.w[c], alt, lat, sun0(y), sunL],
          B: [a.T[c] - c0, a.q[c], a.w[c], alt, lat, sun0(y), sunL],
          Ap: [a.T[c], a.q[c], a.w[c], alt, lat, sun0(y), sunL, c0, cL],
          y: b.T[c], c0, cL, persist: a.T[c],
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- ridge regression
function fitRidge(X, y) {
  const n = X.length, d = X[0].length;
  const mu = new Array(d).fill(0), sd = new Array(d).fill(0);
  for (const r of X) for (let j = 0; j < d; j++) mu[j] += r[j] / n;
  for (const r of X) for (let j = 0; j < d; j++) sd[j] += (r[j] - mu[j]) ** 2 / n;
  for (let j = 0; j < d; j++) sd[j] = Math.sqrt(sd[j]) || 1;
  const ym = y.reduce((a, b) => a + b, 0) / n;
  const A = Array.from({ length: d }, () => new Array(d).fill(0)), bv = new Array(d).fill(0);
  for (let i = 0; i < n; i++) {
    const z = X[i].map((v, j) => (v - mu[j]) / sd[j]), t = y[i] - ym;
    for (let j = 0; j < d; j++) { bv[j] += z[j] * t; for (let k = 0; k < d; k++) A[j][k] += z[j] * z[k]; }
  }
  for (let j = 0; j < d; j++) A[j][j] += LAMBDA * n;
  for (let j = 0; j < d; j++) { // Gaussian elimination with partial pivoting
    let p = j; for (let r = j + 1; r < d; r++) if (Math.abs(A[r][j]) > Math.abs(A[p][j])) p = r;
    [A[j], A[p]] = [A[p], A[j]]; [bv[j], bv[p]] = [bv[p], bv[j]];
    for (let r = j + 1; r < d; r++) { const f = A[r][j] / A[j][j]; for (let k = j; k < d; k++) A[r][k] -= f * A[j][k]; bv[r] -= f * bv[j]; }
  }
  const w = new Array(d).fill(0);
  for (let j = d - 1; j >= 0; j--) { let s = bv[j]; for (let k = j + 1; k < d; k++) s -= A[j][k] * w[k]; w[j] = s / A[j][j]; }
  return (x) => ym + x.reduce((s, v, j) => s + w[j] * (v - mu[j]) / sd[j], 0);
}

// ---------------------------------------------------------------- run
const t0 = Date.now();
const trainRows = Object.fromEntries(LEADS.map((L) => [L, []]));
for (const seed of TRAIN) { const s = samples(seed); for (const L of LEADS) trainRows[L].push(...s[L]); }
console.log(`training rows per lead: ${trainRows[LEADS[0]].length} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
const models = {};
for (const L of LEADS) {
  const R = trainRows[L];
  models[L] = {
    A: fitRidge(R.map((r) => r.A), R.map((r) => r.y)),
    B: fitRidge(R.map((r) => r.B), R.map((r) => r.y - r.cL)),
    Ap: fitRidge(R.map((r) => r.Ap), R.map((r) => r.y)),
  };
}

const perWorld = [];
for (const seed of TEST) {
  const s = samples(seed), row = { seed };
  for (const L of LEADS) {
    const m = models[L], R = s[L];
    const rmse = (f) => Math.sqrt(R.reduce((acc, r) => acc + (f(r) - r.y) ** 2, 0) / R.length);
    row[L] = {
      A: rmse((r) => m.A(r.A)), B: rmse((r) => r.cL + m.B(r.B)), Ap: rmse((r) => m.Ap(r.Ap)),
      persistence: rmse((r) => r.persist), climatology: rmse((r) => r.cL),
    };
    for (const k of Object.keys(row[L])) row[L][k] = Number(row[L][k].toFixed(2));
  }
  perWorld.push(row);
  console.log(`test world ${seed}: ` + LEADS.map((L) => `L=${L} A ${row[L].A} B ${row[L].B} A+ ${row[L].Ap} pers ${row[L].persistence} clim ${row[L].climatology}`).join(' | '));
}

const wins = perWorld.filter((r) => r[250].B < r[250].A).length;
const winsAp = perWorld.filter((r) => r[250].B < r[250].Ap).length;
const verdict = { hypothesis: 'BL-H2', bBeatsAAt250: `${wins} of ${perWorld.length}`, bBeatsAPlusAt250: `${winsAp} of ${perWorld.length} (secondary, no pass condition)`, result: wins >= 6 ? 'survives this test' : 'killed' };
console.log(JSON.stringify(verdict));
const out = path.join(ROOT, 'docs/planetary-baselines/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h2.json'), JSON.stringify({
  generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`,
  design: { train: TRAIN, test: TEST, leads: LEADS, starts: STARTS, cellStep: CELL_STEP, lambda: LAMBDA, phases: PHASES },
  verdict, perWorld,
}, null, 1) + '\n');
