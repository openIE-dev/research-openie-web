# Planet: tracker

One row per task. Status is one of `todo`, `doing`, `done`, `blocked`.
Evidence is a path, a commit or a URL; a task is not `done` without it.
Hypothesis IDs refer to Section 7 of `src/content/papers/planet.md`.

## M0. The study

| ID | Task | Status | Depends | Acceptance | Evidence |
|---|---|---|---|---|---|
| PLN-001 | Write and publish the study | done | — | Page, about page, catalogue entry, PDF; `pnpm build` passes | `dcac4dd`; `/papers/planet/` |
| PLN-002 | Figures from a script | done | — | Regenerable SVGs | `scripts/figures/planet_figures.py`; `6dcb974` |
| PLN-003 | Verify every source against full text | blocked | network hosts | Each "search result only" in Section 10 becomes "read" or is removed | Blocked: arxiv.org, doi.org, en.wikipedia.org, w3.org and most publishers unreachable from the build container |

## M1. Exact core and the living figure

| ID | Task | Status | Depends | Acceptance | Hypothesis | Evidence |
|---|---|---|---|---|---|---|
| PLN-010 | Blueprint, tracker, hand-off ledger | done | — | Three files under `docs/planet/` | — | `d2c0636` |
| PLN-011 | Exact core: generator, composition table, step, edits, hash, replay | done | PLN-010 | Pure ES module; runs in Node and browser | — | `public/living/planet/core.js` |
| PLN-012 | Core tests | done | PLN-011 | Determinism, replay, conservation, divergence, doubling fit; results JSON | PL-H3, PL-H4, PL-H6 | `scripts/planet/test-core.mjs`; `docs/planet/results/core.json` (PL-H3 and PL-H6 hold on the toy; PL-H4 killed as stated, see ledger entry 2) |
| PLN-013 | WGSL generator and parity check | done | PLN-011 | `checkParity()` returns mismatch count and adapter info | PL-H1 | `public/living/planet/gpu.js` (with a mutation check) |
| PLN-014 | GPU parity run in headless Chromium | done | PLN-013 | Results JSON naming the adapter actually used | PL-H1 (one device) | `scripts/planet/gpu-parity.mjs`; `docs/planet/results/gpu-parity.json` (0 of 2,097,152 cells differ on SwiftShader) |
| PLN-015 | Living figure page | done | PLN-011, PLN-013 | Two branches, difference map, divergence chart, replay check, inspector, parity panel; works without WebGPU | — | `public/living/planet/`; driven headless: replay identical, demo dig spread to 2,417 cells in 300 ticks, parity 0 mismatches, no page errors, no horizontal scroll at 390 px |
| PLN-016 | Link the figure from the hub and the study | done | PLN-015 | Hub card; study Section 3 link; `pnpm build` passes | — | Hub card and nav in `public/living/index.html`; link in study Section 3 |
| PLN-017 | Pre-register the refined divergence hypothesis (wet planets only) and report the PL-H4 result in the study | done | PLN-012 | New row in study Section 7 with the toy's numbers, labelled as a toy | PL-H4 | Study Section 7.1 and PL-H12 |
| PLN-018 | Run PL-H12 on 8 seeds not used before (not 1, 7, 1234, 99991) with at least 15 water units per cell | done | PLN-017 | Per-seed median doubling times in `docs/planet/results/`; report pass or kill in Section 7.1 without changing the criterion | PL-H12 | Registered in `dc96370`, run after; `docs/planet/results/h12.json`: max over min of medians 1.63, survives; reported in study 7.1 |
| PLN-019 | Run `node scripts/planet/test-core.mjs --quick` in CI | done | PLN-012 | CI job fails on a determinism, replay or conservation failure | — | `pnpm test:planet` step in `.github/workflows/ci.yml` (about 13 s locally); not yet seen running on GitHub, since CI triggers on pull requests and pushes to `main` |
| PLN-020a | Toy visuals: dried-out sea floor shows as dark basalt; decide whether evaporation should leave a thin water film or draw dry sea floor differently | todo | PLN-015 | A choice recorded in the blueprint | — | |

## M2. Reference and scale

Evidence for PLN-020: `experiments/planet-core/`, `scripts/planet/test-rust.mjs`, `docs/planet/results/rust-wasm.json` (JS, Wasm and native x86-64 agree at every tick, 4 seeds x 1,000 ticks; generator 0 of 2,097,152 cells differ; sensitivity check detected; native overflow checks never fired). The living page's replay button now also replays in Wasm.

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| PLN-020 | Rust reference of the core compiled to Wasm, checked against `core.js` | done | PLN-012 | Identical hashes over the test suite | PL-H1 |
| PLN-021 | Parity on more devices (three GPU vendors, three browsers) | todo | PLN-014 | Results files per device, gathered by people with those devices | PL-H1 |
| PLN-022 | Floating-point generator on several GPUs | todo | PLN-021 | Mismatch counts per device pair | PL-H2 |
| PLN-023 | Edit-log size in long sessions | todo | PLN-015 | Median log size of 100-hour sessions | PL-H5 |
| PLN-024 | Run the Rust/Wasm parity step in CI and confirm it on GitHub | todo | PLN-020 | Green CI run with both planet steps | — |
| PLN-025 | Spread probability: register and test a hypothesis on whether a dig spreads at all (PL-H12 only covers speed) | todo | PLN-018 | Registered before run, as PLN-018 was | new |

## M3. The sphere

Evidence for PLN-030: `public/living/planet/pos64.js`, `scripts/planet/pos64-parity.mjs`, `scripts/planet/test-pos64.mjs` (in `pnpm test:planet`), `docs/planet/results/pos64.json`. Integer ops 0 of 65,536 differ on SwiftShader and in JS; carry-removal mutant caught; f32 conversion under 1 mm within 8 km on SwiftShader.

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| PLN-030 | 64-bit micrometre positions emulated as `vec2<u32>` in WGSL | done | PLN-013 | Add, subtract, compare match a BigInt reference | PL-H9 |
| PLN-031 | Cube-sphere quadtree level of detail, camera-relative rendering, reversed depth | todo | PLN-030 | No visible jitter over 1 mm at surface, core, lunar distance; tiles drawn relative to their own centre (blueprint section 5) | PL-H9 |
| PLN-032 | Atmosphere view (tolerance zone) | todo | PLN-031 | Visual only; reads no state back | — |

## M4. Inside the planet

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| PLN-040 | Volumetric generator in 16^3 bricks (integer WGSL and reference) | todo | PLN-020 | Bit parity with reference | PL-H1 |
| PLN-041 | Active region of 512^3 cells regenerated while walking | todo | PLN-040 | Bricks per frame enough for 10 m/s | PL-H8 |
| PLN-042 | Surface extraction with seam stitching between levels | todo | PLN-040 | No cracks between levels | — |
| PLN-043 | Element conservation checker over 3D edits | todo | PLN-040 | Every fuzzed unbalanced edit refused | PL-H6 |

## M5. Agents and energy

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| PLN-050 | Fixed-point XPBD for gameplay bodies | todo | PLN-020 | Deterministic across targets; frame time | PL-H7 |
| PLN-051 | Active-inference creatures over discrete states, beliefs inspectable | todo | PLN-020 | 1,000 creatures within the tick budget | PL-H7 |
| PLN-052 | Energy budget and the cost of undo | todo | PLN-015 | Budget in state; replay exact | — |

## M6. Mechanics and playtests

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| PLN-060 | Mechanics rows 1 to 17 as playable slices | todo | M4, M5 | One slice per row | — |
| PLN-061 | Concept test against a reading group | todo | PLN-060 | Pre-registered test and analysis | PL-H10 |
| PLN-062 | Specification gaming in player-written rewards | todo | PLN-060 | Share of gamed rewards | PL-H11 |
