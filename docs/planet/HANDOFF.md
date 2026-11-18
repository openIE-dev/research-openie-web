# Planet: hand-off ledger

Append-only. Newest entry at the bottom. Each entry says what changed, what
was measured (and on what), what was not, and exactly where the next agent
starts. Do not edit earlier entries; correct them in a new one.

## Start here (for any new agent)

1. Read `docs/planet/BLUEPRINT.md` (design and rules), then the newest entry
   below, then pick the first `todo` row in `docs/planet/TRACKER.md` whose
   dependencies are `done`.
2. Branch: work on the branch your session is given; the planet work so far
   lives on `claude/fervent-pasteur-x594ei`.
3. Before pushing: `pnpm build` (runs the lints and reprints stale PDFs) and
   `node scripts/planet/test-core.mjs`.
4. Local view of the living figure: `pnpm build && pnpm preview`, then open
   `/living/planet/`. WebGPU in headless Chromium needs a secure origin
   (`http://localhost`) and `--enable-unsafe-webgpu`; the adapter is then
   SwiftShader (software), which is one device, not a GPU vendor.
5. External sources: most publisher hosts are unreachable from the cloud
   container; record anything found only in search results as such.

---

## 2026-11-17 · entry 1 · study published, M1 started

**Done.**
- Study written and published: `src/content/papers/planet.md`, pages under
  `src/pages/{papers,about}/planet.astro`, entry in `src/data/studies.json`,
  PDF block in `scripts/generate-pdfs.sh`, figures from
  `scripts/figures/planet_figures.py` (commits `6dcb974`, `4127fe1`, `dcac4dd`).
- Blueprint, tracker and this ledger created (PLN-010).

**Measured.** Nothing yet. The study's numbers are arithmetic.

**Probed.** Headless Chromium in the container exposes WebGPU on a
`http://localhost` page with `--enable-unsafe-webgpu`; adapter reported as
vendor `google`, architecture `swiftshader`.

**Not done / blocked.** PLN-003 (source verification) is blocked on network
access to publisher hosts.

**Next.** PLN-011: exact core in `public/living/planet/core.js`.

## 2026-11-17 · entry 2 · exact core, tests, GPU parity

**Done.** PLN-011 to PLN-014.
- `public/living/planet/core.js`: integer generator (five-octave value noise,
  `mix32` hash), material ids and an element composition table (ppm from
  mineral formulae and standard atomic weights, illustrative modal mixes),
  a toy weather and water step in flux form, edits with a checker, replay,
  state hash, totals, divergence. 192 x 96 cells.
- Design change while building: the first step damped every perturbation
  (heat only diffused). Two couplings were added so the toy can show the
  butterfly effect: cooling with altitude (ground affects heat) and air that
  carries its heat as well as its vapour (the wind depends on the heat it
  moves). Both are in the step, commented.
- `scripts/planet/test-core.mjs` and `scripts/planet/gpu-parity.mjs`.

**Measured (run here, Node 22 on Linux x64; Chromium headless).**
- Determinism: 4 seeds x 1,000 ticks with fuzzed edit logs, identical hashes
  at every tick; replay from seed and log reproduces the final hash.
- Conservation (PL-H6 on the toy): ground + inventory and water + vapour +
  inventory unchanged at every tick; inadmissible edits refused (35 to 54 per
  seed) and change nothing.
- Divergence (PL-H3, PL-H4): one unit dug at one cell after 200 ticks, 12
  trials per seed, followed 800 ticks. 20 of 48 trials spread to half the map,
  22 stayed within 10 cells. Median doubling times per seed: 392 ticks (seed
  1, a dry planet with about a tenth of the others' water), 26.4 (seed 7),
  23.65 (seed 1234), 24.96 (seed 99991). Max over min of the medians is about
  16, so **PL-H4 as stated is killed on the toy**. Without the dry seed the
  medians agree within 1.12x: chaos in this toy needs water. PLN-017 records
  the refined hypothesis; do not edit PL-H4 in place.
- GPU parity (PL-H1, one device): WGSL integer generator vs `core.js` over
  4 seeds x 1024 x 512 = 2,097,152 cells, 0 mismatches. Adapter: vendor
  `google`, architecture `swiftshader` (software, on the CPU). Mutation check:
  changing one hash constant by one bit gives 524,276 mismatches of 524,288,
  so the comparison can fail.

**Not done.** PL-H1 on real GPUs from three vendors and three browsers
(PLN-021). PL-H2 not runnable on one device.

**Next.** PLN-015: the living figure page `public/living/planet/index.html`.

---

## 2026-11-17 · entry 3 · living figure, study updated

**Done.** PLN-015, PLN-016, PLN-017.
- `/living/planet/` (`index.html`, `app.js`): branches A and B, difference
  map, divergence chart, replay check, inspector with element fractions,
  edit logs, a "dig one unit somewhere wet" button, and the GPU parity panel.
  Linked from the living hub and from Section 3 of the study.
- Study: abstract no longer says nothing was built; new Section 7.1 reports
  the toy runs (PL-H1 on one software adapter, PL-H3 and PL-H6 hold on the
  toy, PL-H4 killed as stated) and pre-registers PL-H12 (wet worlds only,
  fresh seeds). A terms list was added, forward section references removed,
  and `dist/papers/planet/index.html` added to the default pages of
  `scripts/lint-order.mjs`, so the order rules are now enforced on it.
- PDF header note for the planet study updated in `scripts/generate-pdfs.sh`.

**Measured.** Page driven in headless Chromium at 1280 px and 390 px: no
page errors; replay of 501 ticks identical to the live state; a demo dig
spread to 2,417 of 18,432 cells within 300 ticks; GPU parity 0 mismatches on
SwiftShader with the mutation check detected; no horizontal scroll at 390 px.
`pnpm build` passes, all order lints clean, internal links pass.

**Not done.** PL-H12 has been registered and not run (PLN-018). Core tests
are not yet in CI (PLN-019).

**Next.** PLN-018 (run PL-H12 on eight fresh wet seeds, about 6 minutes of
CPU in Node with `test-core.mjs` adapted to take seeds as arguments), then
PLN-019, then M2 (PLN-020, a Rust reference compiled to Wasm).

---

## 2026-11-18 · entry 4 · PL-H12 run, CI step, Rust/Wasm reference

**Done.** PLN-018, PLN-019, PLN-020.
- `scripts/planet/divergence.mjs`: the fuzzed log and the divergence trial,
  now shared; `test-core.mjs` output was checked unchanged after the move.
- PL-H12 runner `scripts/planet/run-h12.mjs` committed (`dc96370`) before it
  was run, with its seed rule, median and no-growth rule in the header.
- CI: `pnpm test:planet` (quick core tests) and a Rust/Wasm parity step added
  to `.github/workflows/ci.yml`. Neither has been seen running on GitHub yet
  (PLN-024).
- `experiments/planet-core/`: Rust port of `core.js`, native binary `hashes`,
  Wasm exports without a binding generator; `public/living/planet/core.wasm`
  (47 KB) built from it. The living page's replay button now replays in both
  JavaScript and Wasm.
- Study Section 7.1 updated with both results. Blueprint gained the new
  modules and a rule: change `core.js` and `lib.rs` together.

**Measured (Node 22, rustc 1.97.0, Linux x86-64).**
- PL-H12: seeds 100 to 105, 107, 108 (106 below the water rule). Median
  doubling times 22.51 to 36.66 ticks, max over min 1.63 (kill above 2), no
  seed without growth: survives. Whether a dig spreads at all still varies
  from 0 of 12 trials (seed 103) to 11 of 12 (107, 108); PLN-025 is the
  follow-up. Results: `docs/planet/results/h12.json`.
- Rust vs JS: per-tick hashes identical for 1,000 ticks on seeds 1, 7, 1234,
  99991, native and Wasm; refused-edit counts identical; generator 0 of
  2,097,152 cells differ; dropping one admitted edit is detected. Native
  overflow checks never fired. Results: `docs/planet/results/rust-wasm.json`.
- Page: replay with 3 edits identical in JS and Wasm in headless Chromium.

**Not done.** Real-GPU parity (PLN-021), CI confirmation (PLN-024).

**Next.** M3, PLN-030: 64-bit micrometre positions emulated as `vec2<u32>`
in WGSL, checked against a BigInt reference. It needs no GPU vendor for a
first pass (SwiftShader runs it) and unblocks the sphere renderer.

---

## 2026-11-18 · entry 5 · 64-bit positions on the GPU

**Done.** PLN-030.
- `public/living/planet/pos64.js`: positions as `vec2<u32>` in micrometres;
  WGSL and word-by-word JS versions of add, subtract, signed compare and the
  camera-relative f32 conversion; BigInt reference; test vectors (every
  combination of carry and sign edge words, plus 65,536 pairs with camera
  offsets in buckets from 1 m to 100 km).
- `scripts/planet/browser.mjs` (shared headless runner; `gpu-parity.mjs` now
  uses it), `pos64-parity.mjs` (GPU), `test-pos64.mjs` (CPU, added to
  `pnpm test:planet`, so CI runs it).

**Found and fixed.** The first conversion added `f32(hi) * 2^32 + f32(lo)`
with `lo` unsigned. A small negative difference has `hi = -1` and `lo` near
2^32, and a 32-bit float holds that only to the nearest 512 um, so the error
was 0.128 mm even within 1 m of the camera. Reading `lo` as signed and adding
its sign bit to `hi` fixed it (error within 1 m now about 3 nm in JS).

**Measured (SwiftShader, headless Chromium; Node 22).**
- Integer ops: 0 of 65,536 pairs differ from BigInt, GPU and JS. Mutant with
  the carry removed: 32,631 differ (detected).
- f32 conversion, max error by distance from the camera, GPU / JS:
  1 m 0.0000321 / 0.00000252 mm; 100 m 0.00802 / 0.00425; 1 km 0.063 /
  0.0345; 4 km 0.313 / 0.198; 8 km 0.567 / 0.337; 16 km 1.08 / 0.615;
  100 km 7.93 / 4.35. The GPU float error is larger than JS's, as the
  tolerance zone allows; the integer results agree exactly.
- Consequence recorded in the blueprint (section 5): draw tiles relative to
  their own centre; f32 within 8 km of a local origin stays under 1 mm here.

**Next.** PLN-031: a first cube-sphere view in WebGPU. Suggested first slice:
one planet at 6,371 km radius, a quadtree per cube face, tiles meshed from
`core.js`'s generator on a sphere parameterisation (the toy generator is
flat; a sphere version needs a 3D noise lattice, so start by sampling the
existing generator with longitude and latitude and note the seam at the
date line), camera-relative vertices per tile, reversed-Z depth. Measure
jitter at the surface, at the core and at lunar distance.

---

## 2026-11-18 · entry 6 · the globe (PLN-031, first slice)

**Done.**
- `public/living/planet/sphere.js`: exact sphere generator. Cube-face integer
  coordinates, exact integer square root and divisions (float estimate, then
  integer correction; every product below 2^53), 17 octaves of 3D integer
  value noise from 4,194 km to 64 m with 16-bit fractions, elevation in mm,
  surface points in BigInt micrometres.
- `public/living/planet/globe/`: WebGPU globe. Quadtree per face to level 18,
  tiles built on the CPU within 12 ms per frame (parents drawn meanwhile),
  skirts, reversed-Z, per-tile offsets from exact micrometre differences, a
  naive planet-centred mode and a 5 mm-per-frame creep to compare them.
  Linked from the living hub and from study Section 2.2.
- `public/living/planet/jitter.js` + `scripts/planet/jitter.mjs`: PL-H9
  arithmetic on the GPU. `scripts/planet/test-sphere.mjs` in `test:planet`.
- Study Section 7.1: new bullet with the numbers below; PL-H9 stays open.

**Found while building (all fixed).**
1. First version kept vertices in integer metres: a flat sea showed +-0.5 m
   rounding bumps from 2 m up. Now micrometres.
2. 8-bit noise fractions meant 32 m steps on the finest octave. Now 16-bit,
   still exact in doubles.
3. Skirt vertices had sideways normals and showed as dark cracks. Now they
   take the normal of their edge vertex.
4. 827 tiles at ground level; tiles wholly behind the camera are now culled
   (545).

**Environment limit found.** Configuring a WebGPU canvas in headless
Chromium on SwiftShader loses the GPU instance; a bare page reproduces it.
Visual checks used `?offscreen` and `capture()`. The canvas path is untested
here (PLN-033). See blueprint section 6.

**Measured (SwiftShader; Node 22).**
- `isqrt`, `divTrunc`, `floorDiv` vs BigInt: 1,000,014 inputs, 0 differ.
- Cube edges: 6,172 shared samples identical from both faces.
- Elevation over 155,526 samples: -4,918.7 m to 5,347.8 m, 56.1% land.
- Vertex position error within about 100 m of the camera, naive / relative:
  surface 338 / 0.00713 mm; 1,000 km from centre 1.65 / 0.00775 mm; lunar
  distance 48,000 / 0.00788 mm; Neptune distance 8,140,000 / 0.00737 mm.
- Offscreen renders built 6 tiles (Moon, space), 224 (low orbit), 545
  (ground, level 18). On SwiftShader a 545-tile frame takes over a minute;
  that is a software rasteriser, not a frame-time measurement.

**Next.** PLN-033 needs a person with a GPU. Without one: PLN-034 (Rust port
of `sphere.js`, match the printed hashes), then PLN-035 (worker and eviction),
or M4 PLN-040 (volumetric bricks), which reuses `noise3`.
