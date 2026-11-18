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
