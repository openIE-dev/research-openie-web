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
