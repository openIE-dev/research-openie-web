// The analyst's model of the planet toy for BL-H1: a copy of core.js `step` with
// four processes that can be switched off. With every switch on it must equal
// core.step exactly; `checkFaithful` verifies that by state hash.
//
// Switches (all true by default):
//   altitudeCooling  step 1: T loses (g - SEA) >> 3 on high ground
//   westerly         step 4: mid-latitude drift of vapour and heat to the east
//   orographic       step 5: lower saturation over high ground
//   erosion          step 6: strong flow carries one unit of ground
export const PROCESSES = ['altitudeCooling', 'westerly', 'orographic', 'erosion'];

export function makeStep(C, opts = {}) {
  const on = { altitudeCooling: true, westerly: true, orographic: true, erosion: true, ...opts };
  const { SEA, sun } = C;
  return function step(s) {
    const { W, H } = s, n = W * H;
    const g = s.g.slice(), w = s.w.slice(), q = s.q.slice();
    const T1 = new Int32Array(n), T = new Int32Array(n);
    const idx = (x, y) => y * W + ((x + W) % W);
    for (let y = 0; y < H; y++) {
      const sy = sun(y, s.t, H);
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const heat = s.w[i] > 16 ? sy >> 1 : sy;
        const alt = on.altitudeCooling && s.g[i] > SEA ? (s.g[i] - SEA) >> 3 : 0;
        T1[i] = s.T[i] + heat - (s.T[i] >> 4) - alt;
        if (T1[i] < 0) T1[i] = 0;
      }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const n_ = y > 0 ? T1[idx(x, y - 1)] : T1[i];
      const s_ = y < H - 1 ? T1[idx(x, y + 1)] : T1[i];
      const lap = n_ + s_ + T1[idx(x - 1, y)] + T1[idx(x + 1, y)] - 4 * T1[i];
      T[i] = T1[i] + (lap >> 3);
    }
    for (let i = 0; i < n; i++) {
      let ev = T[i] > 400 ? (T[i] - 400) >> 5 : 0;
      if (ev > w[i]) ev = w[i];
      w[i] -= ev; q[i] += ev;
    }
    const dq = new Int32Array(n), dT = new Int32Array(n);
    for (let y = 0; y < H; y++) {
      const lat = Math.abs(2 * y - (H - 1));
      const band = on.westerly && lat * 6 >= (H - 1) && lat * 3 <= (H - 1) * 2;
      for (let x = 0; x < W; x++) {
        const i = y * W + x, qi = q[i], Ti = T[i];
        const nb = [idx(x + 1, y), idx(x - 1, y)];
        if (y > 0) nb.push(idx(x, y - 1));
        if (y < H - 1) nb.push(idx(x, y + 1));
        for (const j of nb) {
          if (T[j] > T[i]) {
            const d = T[j] - T[i];
            const f = d < 64 ? d : 64;
            const amt = (qi * f) >> 9, heat = (Ti * f) >> 10;
            dq[i] -= amt; dq[j] += amt;
            dT[i] -= heat; dT[j] += heat;
          }
        }
        if (band) {
          const j = idx(x + 1, y), amt = qi >> 3, heat = Ti >> 4;
          dq[i] -= amt; dq[j] += amt; dT[i] -= heat; dT[j] += heat;
        }
      }
    }
    for (let i = 0; i < n; i++) { q[i] += dq[i]; T[i] += dT[i]; }
    for (let i = 0; i < n; i++) {
      const oro = on.orographic && g[i] > SEA ? (g[i] - SEA) >> 3 : 0;
      let sat = 16 + (T[i] >> 2) - oro;
      if (sat < 4) sat = 4;
      if (q[i] > sat) { const c = (q[i] - sat + 1) >> 1; q[i] -= c; w[i] += c; }
    }
    const dw = new Int32Array(n), dg = new Int32Array(n);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (w[i] === 0) continue;
      const hi = g[i] + w[i];
      const nb = [idx(x + 1, y), idx(x - 1, y)];
      if (y < H - 1) nb.push(idx(x, y + 1));
      if (y > 0) nb.push(idx(x, y - 1));
      let j = -1, hj = hi;
      for (const k of nb) { const hk = g[k] + w[k]; if (hk < hj) { hj = hk; j = k; } }
      if (j < 0) continue;
      let d = (hi - hj) >> 1;
      if (d > w[i]) d = w[i];
      if (d === 0) continue;
      dw[i] -= d; dw[j] += d;
      if (on.erosion && d >= 24 && g[i] > 0) { dg[i] -= 1; dg[j] += 1; }
    }
    for (let i = 0; i < n; i++) { w[i] += dw[i]; g[i] += dg[i]; }
    return { ...s, t: s.t + 1, g, w, q, T };
  };
}

// With all switches on, the copy must match core.step at every tick.
export function checkFaithful(C, seeds = [1, 1234], ticks = 300) {
  const full = makeStep(C);
  for (const seed of seeds) {
    let a = C.initState(seed), b = C.initState(seed);
    for (let t = 0; t < ticks; t++) {
      a = C.step(a); b = full(b);
      if (C.hashState(a) !== C.hashState(b)) return { ok: false, seed, tick: t + 1 };
    }
  }
  // And each switch must change something, or withholding it tests nothing.
  const changes = {};
  for (const p of PROCESSES) {
    let a = C.initState(1234), b = C.initState(1234);
    const off = makeStep(C, { [p]: false });
    for (let t = 0; t < 50; t++) { a = C.step(a); b = off(b); }
    changes[p] = C.hashState(a) !== C.hashState(b);
  }
  return { ok: true, seeds, ticks, switchesChangeState: changes };
}
