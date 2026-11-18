#!/usr/bin/env node
// BL-H1 (study Section 5): the residual protocol finds a withheld driver and invents none.
// Everything below was fixed and committed before this script was first run.
//
// World and observations
// - Toy planet (public/living/planet/core.js), 192 x 96 cells. Seeds 200 to 207 (not used before).
// - Spin-up 200 ticks; analysis ticks 200 to 299, sampled every 5th tick (20 ticks).
// - The analyst observes the state with noise on heat only: T + u, u uniform integer in
//   -2..2 from a hash of (seed, cell, tick). Ground, water and vapour are observed exactly.
// - Analyst's model: scripts/planetary-baselines/model.mjs with one process switched off
//   (or none, for the null case). It is applied to the observed state at t.
// - Residual, per field F in {T, q, w, g} and cell: observed(t+1)[F] - model(observed(t))[F].
//
// Candidate variables X (computed from the observed state at t)
//   altitude  max(0, g - SEA)            absLat  |2y - (H - 1)|
//   band      1 inside the westerly band  water   w        vapour  q        heat  T
//   heatGrad  max |T_i - T_j| over the 4 neighbours
//   slope     max(0, max over neighbours of (g + w)_i - (g + w)_j)
//   flow      min(w, slope >> 1)
//
// Statistic, for each of the 4 x 9 = 36 (F, X) pairs
// - eta^2: share of residual variance explained by X in 10 quantile bins (equal X values
//   always share a bin). Significance: n * eta^2 against chi-square with (bins - 1) degrees
//   of freedom; p < 0.01 / 36 (Bonferroni). "Structure" = significant AND eta^2 >= 0.01.
//   Samples are spatially correlated, so p is optimistic; the eta^2 floor guards against that.
// - A field whose residual has zero variance is skipped (no structure).
//
// Scoring
// - Accepted (F, X) pairs per withheld process:
//     altitudeCooling: (T, altitude)        westerly: (T, band), (q, band)
//     orographic: (q, altitude), (w, altitude)     erosion: (g, flow), (g, slope)
// - Found = the top pair by eta^2 is an accepted pair AND has structure.
// - Eligible (seed, process) = withholding the process changes at least 0.1% of cells per
//   tick, averaged over the 20 analysis ticks, comparing one step of the full and reduced
//   models from the true state. Ineligible pairs are reported and not scored.
// - Kill: for any process with at least 4 eligible seeds, found in fewer than 75% of them;
//   or structure found in more than 1 of the 8 null seeds.
//
//   node scripts/planetary-baselines/run-h1.mjs   # writes docs/planetary-baselines/results/h1.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProtocol, selftest } from './protocol.mjs';

if (process.argv.includes('--selftest')) { selftest(); process.exit(0); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const result = runProtocol({ seeds: [200, 201, 202, 203, 204, 205, 206, 207], label: 'BL-H1' });
const out = path.join(ROOT, 'docs/planetary-baselines/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h1.json'), JSON.stringify(result, null, 1) + '\n');
