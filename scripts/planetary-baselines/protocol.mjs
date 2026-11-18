// The residual protocol used by BL-H1 and later hypotheses (see run-h1.mjs for the
// protocol as registered). Moved here unchanged after BL-H1 was run, so that a new
// hypothesis can reuse it with extra candidates; BL-H1 reproduces exactly.
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const M = await import(pathToFileURL(path.join(ROOT, 'scripts/planetary-baselines/model.mjs')).href);

const SPIN = 200, WINDOW = 100, EVERY = 5;
const FIELDS = ['T', 'q', 'w', 'g'];
export const BASE_CANDS = ['altitude', 'absLat', 'band', 'water', 'vapour', 'heat', 'heatGrad', 'slope', 'flow'];
let CANDS = BASE_CANDS;
export const BASE_ACCEPT = {
  altitudeCooling: [['T', 'altitude']],
  westerly: [['T', 'band'], ['q', 'band']],
  orographic: [['q', 'altitude'], ['w', 'altitude']],
  erosion: [['g', 'flow'], ['g', 'slope']],
};
let ALPHA = 0.01 / (FIELDS.length * CANDS.length);
export const ETA_MIN = 0.01, ELIGIBLE_SHARE = 0.001;

// ---------------------------------------------------------------- statistics

// Upper regularised incomplete gamma Q(a, x), for the chi-square survival function.
function gammaQ(a, x) {
  const lnG = lgamma(a);
  if (x < a + 1) { // series for P
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 1000; n++) { term *= x / (a + n); sum += term; if (term < sum * 1e-15) break; }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - lnG);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; // continued fraction for Q
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.exp(-x + a * Math.log(x) - lnG) * h;
}
function lgamma(z) {
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
export const chi2Survival = (x, df) => gammaQ(df / 2, x / 2);

// Bin index per sample: 10 quantile bins by rank; equal values share the bin of their first rank.
export function bins(x) {
  const n = x.length, order = Array.from({ length: n }, (_, i) => i).sort((a, b) => x[a] - x[b]);
  const b = new Int32Array(n);
  let start = 0;
  while (start < n) {
    let end = start; while (end + 1 < n && x[order[end + 1]] === x[order[start]]) end++;
    const bin = Math.min(9, Math.floor((10 * start) / n));
    for (let k = start; k <= end; k++) b[order[k]] = bin;
    start = end + 1;
  }
  return b;
}

export function etaSquared(r, b) {
  const n = r.length, sum = new Float64Array(10), cnt = new Float64Array(10);
  let mean = 0; for (let i = 0; i < n; i++) mean += r[i]; mean /= n;
  let sst = 0;
  for (let i = 0; i < n; i++) { const d = r[i] - mean; sst += d * d; sum[b[i]] += r[i]; cnt[b[i]]++; }
  if (sst === 0) return null;
  let ssb = 0, k = 0;
  for (let j = 0; j < 10; j++) if (cnt[j]) { k++; const m = sum[j] / cnt[j]; ssb += cnt[j] * (m - mean) ** 2; }
  const eta2 = ssb / sst;
  return { eta2, bins: k, p: k > 1 ? chi2Survival(n * eta2, k - 1) : 1 };
}

// ---------------------------------------------------------------- observations and candidates

function observe(s, seed) {
  const o = C.cloneState(s);
  for (let i = 0; i < o.T.length; i++) o.T[i] = s.T[i] + (C.hash3(seed ^ 0x5eed, i, s.t) % 5) - 2;
  return o;
}

function candidates(o) {
  const { W, H, SEA } = { W: o.W, H: o.H, SEA: C.SEA };
  const n = W * H, X = Object.fromEntries(CANDS.map((c) => [c, new Float64Array(n)]));
  const idx = (x, y) => y * W + ((x + W) % W);
  for (let y = 0; y < H; y++) {
    const lat = Math.abs(2 * y - (H - 1));
    const band = lat * 6 >= (H - 1) && lat * 3 <= (H - 1) * 2 ? 1 : 0;
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const nb = [idx(x + 1, y), idx(x - 1, y)];
      if (y > 0) nb.push(idx(x, y - 1));
      if (y < H - 1) nb.push(idx(x, y + 1));
      let tg = 0, sl = 0;
      for (const j of nb) {
        tg = Math.max(tg, Math.abs(o.T[i] - o.T[j]));
        sl = Math.max(sl, o.g[i] + o.w[i] - (o.g[j] + o.w[j]));
      }
      X.altitude[i] = Math.max(0, o.g[i] - SEA); X.absLat[i] = lat; X.band[i] = band;
      X.water[i] = o.w[i]; X.vapour[i] = o.q[i]; X.heat[i] = o.T[i];
      X.heatGrad[i] = tg; X.slope[i] = sl; X.flow[i] = Math.min(o.w[i], sl >> 1);
      if (X.dqWest) { const j = idx(x - 1, y); X.dqWest[i] = o.q[j] - o.q[i]; X.dTWest[i] = o.T[j] - o.T[i]; }
    }
  }
  return X;
}

// ---------------------------------------------------------------- one analysis

// Returns the 36 pair statistics for one (seed, withheld process or null).
function analyse(seed, truth, withheld, ACCEPT) {
  const model = M.makeStep(C, withheld ? { [withheld]: false } : {});
  const R = Object.fromEntries(FIELDS.map((f) => [f, []]));
  const Xs = Object.fromEntries(CANDS.map((c) => [c, []]));
  for (let k = 0; k < truth.length - 1; k += EVERY) {
    const o0 = observe(truth[k], seed), o1 = observe(truth[k + 1], seed);
    const pred = model(o0), X = candidates(o0);
    for (const f of FIELDS) { const a = o1[f], b = pred[f]; for (let i = 0; i < a.length; i++) R[f].push(a[i] - b[i]); }
    for (const c of CANDS) for (let i = 0; i < X[c].length; i++) Xs[c].push(X[c][i]);
  }
  const B = Object.fromEntries(CANDS.map((c) => [c, bins(Xs[c])]));
  const pairs = [];
  for (const f of FIELDS) for (const c of CANDS) {
    const r = etaSquared(R[f], B[c]);
    if (r) pairs.push({ field: f, cand: c, eta2: r.eta2, p: r.p, structure: r.p < ALPHA && r.eta2 >= ETA_MIN });
  }
  pairs.sort((a, b) => b.eta2 - a.eta2);
  return { samples: R.T.length, pairs };
}

// One-step effect of withholding a process, from the true state: share of cells changed.
function effectShare(truth, process) {
  const full = M.makeStep(C), off = M.makeStep(C, { [process]: false });
  let changed = 0, total = 0;
  for (let k = 0; k < truth.length - 1; k += EVERY) {
    const a = full(truth[k]), b = off(truth[k]);
    changed += C.divergence(a, b).cells; total += truth[k].g.length;
  }
  return changed / total;
}


// Run the protocol. Config: seeds, extra candidate names (supported: dqWest, dTWest),
// accepted pairs per process. Returns the full result object (also printed as it goes).
export function runProtocol({ seeds, extraCands = [], accept = BASE_ACCEPT, label = 'protocol' }) {
  CANDS = [...BASE_CANDS, ...extraCands];
  ALPHA = 0.01 / (FIELDS.length * CANDS.length);


const faithful = M.checkFaithful(C);
  if (!faithful.ok) throw new Error('analyst model is not faithful: ' + JSON.stringify(faithful));

const rows = [], nulls = [];
for (const seed of seeds) {
  let s = C.initState(seed);
  for (let t = 0; t < SPIN; t++) s = C.step(s);
  const truth = [s];
  for (let t = 0; t < WINDOW; t++) truth.push(C.step(truth[truth.length - 1]));

  const nul = analyse(seed, truth, null, accept);
  const nulStruct = nul.pairs.filter((p) => p.structure);
  nulls.push({ seed, structure: nulStruct.length > 0, structuredPairs: nulStruct.map((p) => `${p.field}~${p.cand} eta2=${p.eta2.toFixed(4)}`), top: nul.pairs.slice(0, 3) });
  console.log(`seed ${seed} null: ${nulStruct.length ? 'STRUCTURE ' + nulStruct.map((p) => p.field + '~' + p.cand).join(', ') : 'no structure'}`);

  for (const proc of M.PROCESSES) {
    const share = effectShare(truth, proc);
    const res = analyse(seed, truth, proc, accept);
    const top = res.pairs[0];
    const accepted = accept[proc].some(([f, c]) => f === top.field && c === top.cand);
    const found = accepted && top.structure;
    const rankOfAccepted = res.pairs.findIndex((p) => accept[proc].some(([f, c]) => f === p.field && c === p.cand)) + 1;
    rows.push({ seed, process: proc, effectShare: Number(share.toFixed(5)), eligible: share >= ELIGIBLE_SHARE, found, rankOfAccepted, top: res.pairs.slice(0, 3) });
    console.log(`seed ${seed} ${proc.padEnd(16)} effect ${(100 * share).toFixed(3)}% ${share >= ELIGIBLE_SHARE ? 'eligible' : 'ineligible'}  top ${top.field}~${top.cand} eta2=${top.eta2.toFixed(4)}${top.structure ? ' (structure)' : ''}  accepted rank ${rankOfAccepted}  ${found ? 'FOUND' : 'missed'}`);
  }
}

const perProcess = {};
for (const proc of M.PROCESSES) {
  const el = rows.filter((r) => r.process === proc && r.eligible);
  perProcess[proc] = { eligibleSeeds: el.length, found: el.filter((r) => r.found).length, scored: el.length >= 4 };
}
const nullStructure = nulls.filter((n) => n.structure).length;
const failing = Object.entries(perProcess).filter(([, v]) => v.scored && v.found < 0.75 * v.eligibleSeeds).map(([k]) => k);
const killed = failing.length > 0 || nullStructure > 1;
const verdict = { hypothesis: label, perProcess, nullSeedsWithStructure: nullStructure, failingProcesses: failing, result: killed ? 'killed' : 'survives this test' };
console.log(JSON.stringify(verdict));

return {
    generated: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`,
    protocol: { seeds, spin: SPIN, window: WINDOW, every: EVERY, fields: FIELDS, candidates: CANDS, accept, alpha: ALPHA, etaMin: ETA_MIN, eligibleShare: ELIGIBLE_SHARE, noise: 'T + uniform integer -2..2' },
    faithful, verdict, nulls, rows,
  };
}

export function selftest() {

  // Known chi-square tail values and a binning check; does not run the protocol.
  const checks = [[16.919, 9, 0.05], [21.666, 9, 0.01], [3.841, 1, 0.05], [30, 9, 4.398e-4]];
  for (const [x, df, want] of checks) console.log(`chi2 survival(${x}, ${df}) = ${chi2Survival(x, df).toPrecision(4)} (expected about ${want})`);
  const b = bins([5, 5, 5, 1, 2, 3, 4, 6, 7, 8, 9, 10]);
  console.log('bins of [5,5,5,1..10]:', Array.from(b).join(','), '(the three 5s must share a bin)');
  const e = etaSquared([1, 1, 2, 2], new Int32Array([0, 0, 1, 1]));
  console.log('eta2 perfect split =', e.eta2, '(expected 1)');
  }
