// Planet exact core (milestone M1). ES module, no DOM: runs in Node and the browser.
//
// Everything here is in the exact zone: 32-bit integer arithmetic only, with the
// same semantics as WGSL (u32 wraps modulo 2^32 via Math.imul and >>> 0; signed >>
// is arithmetic). No floating point, no division of negative numbers. Two runs
// with the same seed and the same edit log give the same state hash on every
// machine. See docs/planet/BLUEPRINT.md.

export const SEA = 520; // ground height of the initial sea surface

// ---------------------------------------------------------------- hashing

export function mix32(h) {
  h = h >>> 0;
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d) >>> 0;
  h ^= h >>> 15; h = Math.imul(h, 0x846ca68b) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

export function hash3(seed, x, y) {
  let h = mix32((seed ^ Math.imul(x, 0x9e3779b1)) >>> 0);
  return mix32((h ^ Math.imul(y, 0x85ebca77)) >>> 0);
}

const octSeed = (seed, k) => mix32((seed ^ Math.imul(k + 1, 0x27d4eb2d)) >>> 0);

// ---------------------------------------------------------------- generator G

function smooth8(t) { // t in 0..255 -> 0..256, fixed-point smoothstep 3t^2 - 2t^3
  return (t * t * (768 - 2 * t)) >> 16;
}

function lerp8(a, b, s) { return a + (((b - a) * s) >> 8); }

// Integer value noise on a lattice of cell size 2^k, wrapping east-west with period W.
export function valueNoise(seed, x, y, k, W) {
  const nx = W >> k;
  const lx = x >> k, ly = y >> k;
  const fx = x & ((1 << k) - 1), fy = y & ((1 << k) - 1);
  const sx = smooth8((fx << 8) >> k), sy = smooth8((fy << 8) >> k);
  const ax = lx % nx, bx = (lx + 1) % nx;
  const v00 = hash3(seed, ax, ly) & 0xffff, v10 = hash3(seed, bx, ly) & 0xffff;
  const v01 = hash3(seed, ax, ly + 1) & 0xffff, v11 = hash3(seed, bx, ly + 1) & 0xffff;
  return lerp8(lerp8(v00, v10, sx), lerp8(v01, v11, sx), sy);
}

const OCTAVES = [[6, 16], [5, 8], [4, 4], [3, 2], [2, 1]]; // [k, weight], weights sum to 31

// Elevation 0..65535 at cell (x, y) of a W-wide strip. W must be a multiple of 64.
export function elevation(seed, x, y, W) {
  let sum = 0;
  for (const [k, wt] of OCTAVES) sum += valueNoise(octSeed(seed, k), x, y, k, W) * wt;
  return Math.floor(sum / 31); // sum >= 0, so floor equals WGSL u32 division
}

export const MATERIALS = [
  // id, name, modal mineral mix (illustrative proportions), element mass fractions in ppm
  { id: 0, name: 'water', mix: 'water (H2O)', ppm: { O: 888093, H: 111907 } },
  { id: 1, name: 'basalt', mix: 'anorthite 45%, diopside 35%, forsterite 15%, magnetite 5%', ppm: { O: 444232, Si: 211586, Ca: 129604, Mg: 91110, Al: 87288, Fe: 36180 } },
  { id: 2, name: 'sand', mix: 'quartz 90%, orthoclase 10%', ppm: { O: 525293, Si: 450965, K: 14048, Al: 9694 } },
  { id: 3, name: 'limestone', mix: 'calcite 95%, quartz 5%', ppm: { O: 482208, Ca: 380414, C: 114006, Si: 23372 } },
  { id: 4, name: 'granite', mix: 'quartz 30%, orthoclase 35%, albite 30%, magnetite 5%', ppm: { O: 480975, Si: 342577, Al: 64800, K: 49166, Fe: 36180, Na: 26302 } },
  { id: 5, name: 'ice', mix: 'water ice (H2O)', ppm: { O: 888093, H: 111907 } },
  { id: 6, name: 'magnetite ore', mix: 'magnetite 60%, quartz 40%', ppm: { Fe: 434158, O: 378867, Si: 186975 } },
  { id: 7, name: 'gold vein', mix: 'quartz 99.9%, native gold 0.1%', ppm: { O: 532031, Si: 466969, Au: 1000 } },
];

// Material id of the ground at (x, y), from elevation, latitude and two extra hashes.
export function material(seed, x, y, e, W, H) {
  const g = e >> 6;
  const lat = Math.abs(2 * y - (H - 1));
  const polar = lat * 6 >= (H - 1) * 5;
  if (g < SEA - 40) return polar ? 5 : 1;
  if (polar) return 5;
  if (g < SEA + 6) return 2;
  const ore = hash3(octSeed(seed, 20), x, y) & 0xffff;
  if (ore < 20) return 7;
  if (ore < 400) return 6;
  const rock = valueNoise(octSeed(seed, 21), x, y, 4, W);
  return rock > 32768 && g < SEA + 150 ? 3 : 4;
}

// Packed generator output for a W x H grid: e | (material << 16). Used for GPU parity.
export function generatePacked(seed, W, H) {
  const out = new Uint32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const e = elevation(seed, x, y, W);
    out[y * W + x] = (e | (material(seed, x, y, e, W, H) << 16)) >>> 0;
  }
  return out;
}

// ---------------------------------------------------------------- state

export function initState(seed, W = 192, H = 96) {
  const n = W * H;
  const s = {
    seed: seed >>> 0, W, H, t: 0, R: 0, V: 0,
    g: new Int32Array(n), w: new Int32Array(n), q: new Int32Array(n), T: new Int32Array(n),
    m: new Uint8Array(n),
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const e = elevation(s.seed, x, y, W);
    s.g[i] = e >> 6;
    s.m[i] = material(s.seed, x, y, e, W, H);
    s.w[i] = s.g[i] < SEA ? SEA - s.g[i] : 0;
    s.T[i] = 16 * sun(y, 0, H);
  }
  return s;
}

export function cloneState(s) {
  return { ...s, g: s.g.slice(), w: s.w.slice(), q: s.q.slice(), T: s.T.slice(), m: s.m };
}

// Insolation 0..64 by row and season (triangle wave of period 720 ticks).
export function sun(y, t, H) {
  const P = 720, A2 = H >> 1;
  const p = t % P, v = p < P / 2 ? p : P - p;
  const offset = Math.floor((v * 2 * A2) / (P / 2)) - A2;
  const d = 2 * y - (H - 1) - offset;
  const s = 64 - Math.floor((d * d * 64) / (H * H));
  return s > 0 ? s : 0;
}

// ---------------------------------------------------------------- edits (the log D)

export const OPS = ['dig', 'raise', 'scoop', 'pour'];

// Returns null if the edit is admissible in state s, else the reason it is refused.
export function checkEdit(s, e) {
  if (!OPS.includes(e.op)) return `unknown op ${e.op}`;
  if (!(e.x >= 0 && e.x < s.W && e.y >= 0 && e.y < s.H)) return 'outside the map';
  if (!(Number.isInteger(e.k) && e.k > 0 && e.k <= 1000)) return 'amount must be 1..1000';
  const i = e.y * s.W + e.x;
  if (e.op === 'dig' && s.g[i] < e.k) return 'not that much ground here';
  if (e.op === 'raise' && s.R < e.k) return 'not that much rock in the inventory';
  if (e.op === 'scoop' && s.w[i] < e.k) return 'not that much water here';
  if (e.op === 'pour' && s.V < e.k) return 'not that much water in the inventory';
  return null;
}

export function applyEdit(s, e) {
  const i = e.y * s.W + e.x;
  if (e.op === 'dig') { s.g[i] -= e.k; s.R += e.k; }
  else if (e.op === 'raise') { s.g[i] += e.k; s.R -= e.k; }
  else if (e.op === 'scoop') { s.w[i] -= e.k; s.V += e.k; }
  else if (e.op === 'pour') { s.w[i] += e.k; s.V -= e.k; }
}

// ---------------------------------------------------------------- step

// One tick. Reads s, returns a new state. Matter moves only through flux arrays,
// so ground and water totals are conserved exactly.
export function step(s) {
  const { W, H } = s, n = W * H;
  const g = s.g.slice(), w = s.w.slice(), q = s.q.slice();
  const T1 = new Int32Array(n), T = new Int32Array(n);
  const idx = (x, y) => y * W + ((x + W) % W);

  // 1. sun, radiative loss, cooling with altitude
  for (let y = 0; y < H; y++) {
    const sy = sun(y, s.t, H);
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const heat = s.w[i] > 16 ? sy >> 1 : sy;
      const alt = s.g[i] > SEA ? (s.g[i] - SEA) >> 3 : 0; // colder with altitude
      T1[i] = s.T[i] + heat - (s.T[i] >> 4) - alt;
      if (T1[i] < 0) T1[i] = 0;
    }
  }
  // 2. heat diffusion (closed at the poles)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const n_ = y > 0 ? T1[idx(x, y - 1)] : T1[i];
    const s_ = y < H - 1 ? T1[idx(x, y + 1)] : T1[i];
    const lap = n_ + s_ + T1[idx(x - 1, y)] + T1[idx(x + 1, y)] - 4 * T1[i];
    T[i] = T1[i] + (lap >> 3);
  }
  // 3. evaporation
  for (let i = 0; i < n; i++) {
    let ev = T[i] > 400 ? (T[i] - 400) >> 5 : 0;
    if (ev > w[i]) ev = w[i];
    w[i] -= ev; q[i] += ev;
  }
  // 4. moving air: from colder towards warmer neighbours (lower pressure), carrying
  //    its vapour and its heat, plus a mid-latitude westerly drift. The wind depends
  //    on the heat it carries, which is the nonlinearity that amplifies differences.
  const dq = new Int32Array(n), dT = new Int32Array(n);
  for (let y = 0; y < H; y++) {
    const lat = Math.abs(2 * y - (H - 1));
    const band = lat * 6 >= (H - 1) && lat * 3 <= (H - 1) * 2;
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
  // 5. condensation, lower over high ground
  for (let i = 0; i < n; i++) {
    const oro = g[i] > SEA ? (g[i] - SEA) >> 3 : 0;
    let sat = 16 + (T[i] >> 2) - oro;
    if (sat < 4) sat = 4;
    if (q[i] > sat) { const c = (q[i] - sat + 1) >> 1; q[i] -= c; w[i] += c; }
  }
  // 6. water flows to the lowest neighbour; strong flow carries one unit of ground
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
    if (d >= 24 && g[i] > 0) { dg[i] -= 1; dg[j] += 1; }
  }
  for (let i = 0; i < n; i++) { w[i] += dw[i]; g[i] += dg[i]; }

  return { ...s, t: s.t + 1, g, w, q, T };
}

// ---------------------------------------------------------------- replay, hash, checks

// Advance s by one tick, applying the log's edits for this tick first (in log order).
// Edits the checker refuses are skipped and reported.
export function advance(s, log, refused = []) {
  for (const e of log) if (e.t === s.t) {
    const why = checkEdit(s, e);
    if (why) refused.push({ ...e, why }); else applyEdit(s, e);
  }
  return step(s);
}

export function replay(seed, log, ticks, W = 192, H = 96) {
  let s = initState(seed, W, H);
  for (let t = 0; t < ticks; t++) s = advance(s, log);
  return s;
}

export function hashState(s) {
  let h1 = 0x811c9dc5, h2 = 0x9747b28c;
  const feed = (v) => {
    h1 = mix32((h1 ^ v) >>> 0);
    h2 = mix32((h2 + Math.imul(v, 0x9e3779b1)) >>> 0);
  };
  feed(s.t); feed(s.R); feed(s.V);
  for (const a of [s.g, s.w, s.q, s.T]) for (let i = 0; i < a.length; i++) feed(a[i]);
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

// Conserved totals: ground + rock inventory, and water + vapour + water inventory.
export function totals(s) {
  let G = s.R, Wt = s.V;
  for (let i = 0; i < s.g.length; i++) { G += s.g[i]; Wt += s.w[i] + s.q[i]; }
  return { ground: G, water: Wt };
}

// How far two states of the same size have drifted apart.
export function divergence(a, b) {
  let cells = 0, mass = 0;
  for (let i = 0; i < a.g.length; i++) {
    const d = Math.abs(a.g[i] - b.g[i]) + Math.abs(a.w[i] - b.w[i]) + Math.abs(a.q[i] - b.q[i]) + Math.abs(a.T[i] - b.T[i]);
    if (d) { cells++; mass += d; }
  }
  return { cells, mass };
}

// Element masses in a cell, in units of (ground units x ppm), from the composition table.
export function cellElements(s, x, y) {
  const i = y * s.W + x;
  const ground = MATERIALS[s.m[i]], water = MATERIALS[0];
  const out = {};
  for (const [el, ppm] of Object.entries(ground.ppm)) out[el] = (out[el] || 0) + s.g[i] * ppm;
  for (const [el, ppm] of Object.entries(water.ppm)) out[el] = (out[el] || 0) + s.w[i] * ppm;
  return { material: ground, ground: s.g[i], water: s.w[i], vapour: s.q[i], heat: s.T[i], elements: out };
}
