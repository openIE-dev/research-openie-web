#!/usr/bin/env node
// PL-H12 (study Section 7.1), registered before this script was run:
//   On toy worlds with at least 15 units of water per cell, the doubling time of a
//   one-unit dig is stable. Test: 8 seeds not used in Section 7.1, 12 trials each,
//   800 ticks. Measure: median doubling time per seed. Kill: medians that differ
//   more than twofold.
//
// Rules fixed here before any result was seen:
// - Seeds: the first 8 integers from 100 upward, excluding 1, 7, 1234 and 99991,
//   whose initial water (water + vapour + inventory, from core.totals) divided by
//   the number of cells is at least 15.
// - Median: the upper median of the trials that gave a doubling time (the definition
//   used in Section 7.1).
// - A seed whose 12 trials give no doubling time has no measured growth; that kills
//   the hypothesis, because "stable" cannot hold for a seed with no growth.
//
//   node scripts/planet/run-h12.mjs   # writes docs/planet/results/h12.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const { spinUp, divergenceTrial, upperMedian } = await import(pathToFileURL(path.join(ROOT, 'scripts/planet/divergence.mjs')).href);

const USED = new Set([1, 7, 1234, 99991]);
const MIN_WATER_PER_CELL = 15, N_SEEDS = 8, TRIALS = 12, HORIZON = 800, MAX_RATIO = 2;

const seeds = [];
for (let s = 100; seeds.length < N_SEEDS; s++) {
  if (USED.has(s)) continue;
  const st = C.initState(s);
  const perCell = C.totals(st).water / st.g.length;
  if (perCell >= MIN_WATER_PER_CELL) seeds.push({ seed: s, waterPerCell: Number(perCell.toFixed(2)) });
}
console.log('seeds selected by the rule:', seeds.map((s) => `${s.seed} (${s.waterPerCell}/cell)`).join(', '));

const perSeed = [];
const trials = [];
for (const { seed, waterPerCell } of seeds) {
  const base = spinUp(C, seed);
  const ts = [];
  for (let k = 0; k < TRIALS; k++) ts.push(divergenceTrial(C, base, seed, k, HORIZON));
  trials.push(...ts);
  const dts = ts.map((t) => t.doublingTicks).filter(Boolean);
  const row = {
    seed, waterPerCell, fitted: dts.length,
    medianDoublingTicks: dts.length ? upperMedian(dts) : null,
    spreadToHalfTheMap: ts.filter((t) => t.cells[HORIZON] >= base.g.length / 2).length,
    stayedWithin10Cells: ts.filter((t) => t.cells[HORIZON] <= 10).length,
  };
  perSeed.push(row);
  console.log(JSON.stringify(row));
}

const medians = perSeed.map((r) => r.medianDoublingTicks);
const noGrowth = perSeed.filter((r) => r.medianDoublingTicks === null).map((r) => r.seed);
const ratio = noGrowth.length ? null : Math.max(...medians) / Math.min(...medians);
const killed = noGrowth.length > 0 || ratio > MAX_RATIO;
const verdict = {
  hypothesis: 'PL-H12',
  killCriterion: `per-seed median doubling times differ more than ${MAX_RATIO}-fold, or a seed shows no growth`,
  maxOverMinMedian: ratio && Number(ratio.toFixed(3)),
  seedsWithNoGrowth: noGrowth,
  result: killed ? 'killed' : 'survives this test',
};
console.log(JSON.stringify(verdict));

const out = path.join(ROOT, 'docs/planet/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h12.json'), JSON.stringify({
  generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`,
  rules: { seedsFrom: 100, excluded: [...USED], minWaterPerCell: MIN_WATER_PER_CELL, nSeeds: N_SEEDS, trials: TRIALS, horizonTicks: HORIZON, median: 'upper median of fitted trials' },
  verdict, perSeed, trials,
}, null, 1) + '\n');
