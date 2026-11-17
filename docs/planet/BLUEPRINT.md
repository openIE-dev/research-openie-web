# Planet: blueprint

The engineering plan behind the study at `/papers/planet/`
(`src/content/papers/planet.md`). This file is the design; `TRACKER.md` is the
work list; `HANDOFF.md` is the append-only log of who did what and where to
pick up. An agent taking over reads them in that order: this file once, the
tracker for the next open task, and the newest ledger entry for the state.

## 1. Goal

A browser game (WebGPU) in which every place on and inside a planet, down to
the elements in its rock, can be explored and edited, and in which ideas from
modern AI are the mechanics. The study gives the argument; this blueprint turns
it into modules with contracts, and each module into tests that can fail.

## 2. Rules every contributor follows

1. **Exact zone, tolerance zone.** Anything gameplay reads (terrain, materials,
   water, weather, physics, creatures, energy budget, the edit log) is computed
   with integer arithmetic and is bit-identical on every machine. Floating
   point is allowed only for drawing, and nothing drawn flows back into state.
2. **The world is `W = G(seed, x)` plus the edit log `D`.** Nothing about the
   planet is stored except the seed and the log. A saved game is the seed and
   the log. Replaying them must give the same state hash.
3. **Conservation is checked, not hoped for.** Every edit and every step
   moves matter between places; totals per conserved quantity are checked each
   tick by a test.
4. **Integer semantics are the WGSL ones.** 32-bit unsigned arithmetic wraps
   modulo 2^32 (JavaScript: `Math.imul(a, b) >>> 0`, `>>>` for logical shift);
   signed right shift is arithmetic (JavaScript `>>`, WGSL `>>` on `i32`). No
   division of negative numbers in the exact zone (truncation rules differ
   between languages).
5. **Status honesty.** Every result is labelled with how it was obtained: run
   here (with the device named), arithmetic, or search result. No claim of a
   GPU vendor, a browser or a device that was not actually used.
6. **Site writing rules apply to anything under `src/` or `public/`.** Define
   before use, no narrated author, no "we", no status words outside the claim
   ledger (`node scripts/lint-claims.mjs`), no narration of tool access
   (`node scripts/lint-private.mjs src`). `pnpm build` must pass before a push.

## 3. Modules and contracts

| Module | Path | Zone | Contract |
|---|---|---|---|
| Exact core | `public/living/planet/core.js` | Exact | ES module, no DOM, runs in Node and the browser. Generator `G`, composition table, simulation step, edit application, state hash, replay. Pure functions of their inputs. |
| GPU generator | `public/living/planet/gpu.js` | Exact (if PL-H1 holds) | WGSL port of `G` in 32-bit integers. Must reproduce `core.js` bit for bit; `checkParity()` reports mismatches. |
| Living figure | `public/living/planet/index.html`, `app.js` | Tolerance | Two branches of the same seed side by side, a difference map, a divergence chart, a replay check, a cell inspector, the GPU parity panel. Reads core state; never writes it except through logged edits. |
| Core tests | `scripts/planet/test-core.mjs` | — | Node. Determinism, replay, conservation, branch divergence, doubling-time fit. Writes `docs/planet/results/core.json`. |
| GPU parity run | `scripts/planet/gpu-parity.mjs` | — | Playwright + headless Chromium. Runs `checkParity()` and writes `docs/planet/results/gpu-parity.json` with the adapter it actually used. |

Later milestones (see the tracker) add a Rust or WebAssembly (Wasm) reference,
a cube-sphere renderer, volumetric bricks, creatures and the mechanics.

## 4. The toy planet of milestone M1

M1 is a flat, equirectangular strip of the planet: `W x H` cells, wrapping
east-west, closed at the poles. It is small enough to run in a page and large
enough to show the butterfly effect.

**Generator `G(seed, x, y)`.** Five octaves of integer value noise (lattice
sizes 64, 32, 16, 8, 4; weights 16, 8, 4, 2, 1; integer hash `mix32`;
fixed-point smoothstep in 8 fractional bits). Output: elevation `e` in
0..65535 and a material id. Materials come from elevation, latitude and a
separate ore hash (rare magnetite and native-gold cells).

**State per cell (Int32):** ground height `g`, surface water `w`, vapour `q`,
heat `T`. Global: rock inventory `R`, water inventory `V`, tick `t`.

**Step (flux form, read old state, write new state):** sun heating by latitude
and season, radiative loss, heat diffusion, evaporation `w -> q`, vapour
transport from cold to warm cells plus a mid-latitude westerly drift,
condensation `q -> w`, water flow to the lowest neighbour, erosion moving one
unit of ground with strong flow.

**Conserved:** `sum(g) + R` and `sum(w) + sum(q) + V`. Heat is not conserved
(sun in, radiation out) and is not checked.

**Edits (the log `D`):** `{t, x, y, op, k}` with `op` in `dig` (ground to
inventory), `raise` (inventory to ground), `scoop` (water to inventory),
`pour` (inventory to water). An edit that would make a quantity negative is
rejected by the checker and never enters the log.

**Composition table.** Element mass fractions in parts per million, computed
from mineral formulae and standard atomic weights; rock types are mixtures of
minerals with illustrative proportions (labelled as such on the page).

## 5. Hypotheses the build can test now

From Section 7 of the study. M1 can run PL-H1 (on the devices available),
PL-H3, PL-H4 (on the toy weather) and PL-H6 (on the toy's two conserved
quantities). PL-H2 needs several GPU vendors and is not runnable in a single
container. The others need later milestones.

## 6. Definition of done for a milestone

- Its tracker rows are `done` with evidence (a results file, a commit, a URL).
- `pnpm build` passes; `node scripts/planet/test-core.mjs` passes.
- A ledger entry names what changed, what was measured, what was not, and the
  next task.
