// The fuzzed edit log and the divergence trial shared by test-core.mjs (PL-H3, PL-H4) and run-h12.mjs (PL-H12).
// One unit of ground is dug at one cell after 200 ticks of spin-up; both branches are
// followed for `horizon` ticks. Floating point is used only to fit the measurement,
// never inside the simulation.

export function spinUp(C, seed, ticks = 200) {
  let base = C.initState(seed);
  for (let t = 0; t < ticks; t++) base = C.advance(base, []);
  return base;
}

// Doubling time: least-squares slope of ln(mass) while mass is between 10 and 1/10
// of its final value. Null when fewer than 10 points qualify or the slope is not positive.
export function fitDoubling(series) {
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
  return { final, fitPoints: pts.length, doubling };
}

export function divergenceTrial(C, base, seed, trial, horizon) {
  let h = C.hash3(seed, trial, 77), i;
  do { i = h % base.g.length; h = C.mix32(h); } while (base.g[i] < 1);
  const x = i % base.W, y = Math.floor(i / base.W);
  let p = C.cloneState(base), q = C.cloneState(base);
  const logQ = [{ t: base.t, x, y, op: 'dig', k: 1 }];
  const series = [];
  for (let k = 1; k <= horizon; k++) {
    p = C.advance(p, []); q = C.advance(q, logQ);
    series.push(C.divergence(p, q));
  }
  const { final, fitPoints, doubling } = fitDoubling(series);
  const at = (k) => series[Math.min(k, horizon) - 1].cells;
  return {
    seed, trial, x, y, ground: base.g[i], water: base.w[i],
    cells: { 1: at(1), 10: at(10), 50: at(50), 100: at(100), 200: at(200), [horizon]: at(horizon) },
    finalMass: final, fitPoints, doublingTicks: doubling && Number(doubling.toFixed(2)),
  };
}

// Upper median, the definition used since the first run.
export const upperMedian = (v) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

// Deterministic pseudo-random edits (the fuzz stream is itself seeded). About one
// edit every eight ticks, of every op, so some are refused by the checker.
export function fuzzLog(C, seed, ticks, W, H) {
  const log = [];
  let h = C.mix32(seed ^ 0xabcdef);
  for (let t = 0; t < ticks; t++) {
    h = C.mix32(h + t);
    if ((h & 7) !== 0) continue;
    const r = C.mix32(h);
    log.push({ t, x: r % W, y: (r >>> 12) % H, op: C.OPS[(r >>> 24) & 3], k: 1 + ((r >>> 8) & 63) });
  }
  return log;
}
