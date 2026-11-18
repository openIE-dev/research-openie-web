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
| Rust reference | `experiments/planet-core/` (`src/lib.rs`, `src/bin/hashes.rs`) | Exact | Line-for-line port of `core.js`. Hashing uses explicit wrapping; everything else runs with overflow checks on (release too), so a value leaving 32 bits panics instead of diverging silently. Exports plain C functions for Wasm (no binding generator); the built module is `public/living/planet/core.wasm`. |
| Cross-implementation test | `scripts/planet/test-rust.mjs` | — | Builds the crate, compares JS, Wasm and native hashes at every tick under fuzzed logs, generator parity, and a sensitivity check. Writes `docs/planet/results/rust-wasm.json`. |
| Shared test helpers | `scripts/planet/divergence.mjs` | — | The fuzzed edit log and the divergence trial, so every script measures the same thing. |
| PL-H12 runner | `scripts/planet/run-h12.mjs` | — | Registered rules in its header; committed before it was run. |
| 64-bit positions | `public/living/planet/pos64.js` | Exact (integers), tolerance (float conversion) | Coordinates in micrometres as `vec2<u32>` (lo, hi), two's complement. `add64`, `sub64`, `lt64` must match BigInt exactly. `relMetres` converts a camera-relative difference to f32 metres for drawing only; read the low word as signed (see ledger entry 5). |
| Browser runner | `scripts/planet/browser.mjs` | — | Serves `public/` on localhost and runs a function in headless Chromium with WebGPU. Used by `gpu-parity.mjs` and `pos64-parity.mjs`. |
| Sphere generator | `public/living/planet/sphere.js` | Exact | Cube-sphere mapping with exact `isqrt`, `floorDiv`, `divTrunc` (float estimate then integer correction; every product below 2^53), 3D integer value noise with 16-bit fractions, elevation in millimetres, surface points in BigInt micrometres. Rounding is always floor; ports must match. Checks: `scripts/planet/test-sphere.mjs` (in `pnpm test:planet`), which prints reference hashes per face for future Rust/WGSL ports. |
| Globe renderer | `public/living/planet/globe/` (`index.html`, `globe.js`) | Tolerance | Quadtree per cube face to level 18 (about 1.2 m quads), tiles built on the CPU within a time budget per frame, skirts with edge normals, reversed-Z infinite projection, per-tile camera-relative offsets computed exactly in micrometres. `?offscreen` renders to a texture without configuring the canvas; `window.__globe.set/stats/capture` drive it headless. |
| Vertex-position check | `public/living/planet/jitter.js`, `scripts/planet/jitter.mjs` | — | GPU compute: naive vs camera-relative vertex positions against exact BigInt differences at four distances from the centre. Writes `docs/planet/results/jitter.json`. |

The first cube-sphere renderer is in place (M3). Later milestones (see the
tracker) add volumetric bricks, creatures and the mechanics.

**Changing the core.** `core.js` and `experiments/planet-core/src/lib.rs` must
change together, in the same commit. Then run `node scripts/planet/test-rust.mjs`
(rebuilds `core.wasm`) and `node scripts/planet/test-core.mjs`. Any change to
the step changes every hash: say so in the ledger, and rerun any registered
hypothesis whose numbers depend on it before quoting them again.

**Options in the core.** `initState(seed, W, H, { rot })` sets rotation (0..256, default 0): in step 4, a share of north-south air flow growing with latitude is turned east (poleward flow) or west (equatorward flow). With `rot` 0 the code path is skipped and every hash is unchanged. It is a world parameter like the seed and is not hashed. Rust: `State.rot`, Wasm `world_set_rot`, native `hashes <seed> <ticks> <log> [rot]`. The analyst's copy in `scripts/planetary-baselines/model.mjs` does not model rotation.

**Other users of the core.** The planetary-baselines study
(`docs/planetary-baselines/`) runs experiments on this toy. Its additions must
be options that are off by default, so the hashes and registered results here
do not change.

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

## 5. Camera-relative drawing budget

Measured on SwiftShader (ledger entry 5): f32 camera-relative positions stay
under 1 mm of error within 8 km of the camera. Anything drawn farther away
must either accept more than 1 mm or be drawn relative to a nearer local
origin (for example the centre of its own terrain tile), which the renderer
of M3 should do by default.

## 6. Known environment limits

Headless Chromium on SwiftShader (the cloud container) loses its GPU instance as
soon as a WebGPU canvas is configured ("A valid external Instance reference no
longer exists"); compute-only pages are unaffected. A bare page reproduces it,
so it is the environment, not the planet code. Visual checks therefore use the
globe's `?offscreen` mode and its `capture()` hook. The real canvas path has not
been run here; it needs a browser with a GPU (PLN-033).

## 7. Hypotheses the build can test now

From Section 7 of the study. M1 can run PL-H1 (on the devices available),
PL-H3, PL-H4 (on the toy weather) and PL-H6 (on the toy's two conserved
quantities). PL-H2 needs several GPU vendors and is not runnable in a single
container. The others need later milestones.

## 8. Definition of done for a milestone

- Its tracker rows are `done` with evidence (a results file, a commit, a URL).
- `pnpm build` passes; `node scripts/planet/test-core.mjs` passes.
- A ledger entry names what changed, what was measured, what was not, and the
  next task.
