# Planetary baselines: hand-off ledger

Append-only. Newest entry at the bottom. Correct earlier entries in a new one.

## Start here (for any new agent)

1. Read `docs/planetary-baselines/SOURCE_HANDOFF.md` (where the study comes from), then
   `docs/planetary-baselines/BLUEPRINT.md`, then the newest entry below, then take the
   first `todo` row in `docs/planetary-baselines/TRACKER.md` whose dependencies are done.
2. The toy planet belongs to the planet study (`docs/planet/`). Read its
   blueprint before touching `public/living/planet/core.js`; anything added
   for this study is an option that is off by default.
3. Before pushing: `pnpm build` and `pnpm test:planet`.
4. The study is a draft ("In preparation"): it is excluded from listings and
   stripped from `dist/`. Do not add a PDF entry until BLN-050.

---

## 2026-11-18 · entry 1 · study set up

**Done.** BLN-001 to BLN-003.
- `SOURCE_HANDOFF.md`: the handoff supplied with the request, verbatim.
- Draft study `src/content/papers/planetary-baselines.md` with hypotheses BL-H1 to
  BL-H6 and kill criteria (BL-H5 has none by design: either outcome is
  reported). Pages under `src/pages/{papers,about}/baselines.astro`;
  `studies.json` entry with `"status": "In preparation"`.

**Citation check, first pass (search results only, BLN-004).**
- Lovejoy, Muller and Boisvert, GRL 41(21):7694-7700, 2014,
  doi:10.1002/2014GL061861: exists. The "about 1.8 Martian days" transition
  appears in press coverage; the derivation was not read.
- Verkercke et al., JGR Planets 130, e2025JE009309, 2025: exists; about the
  cold-longitude sodium enhancement via subsurface retention.
- CUISINES (Sohl et al., PSJ 5:175, 2024, arXiv:2406.09275): a framework for
  exoplanet model intercomparisons. The handoff's "Earth, Mars, Venus, Titan"
  wording was not confirmed; the study says so.
- ROCKE-3D: GISS GCM from ModelE2; no source linked it to CUISINES.
- Kleidon: maximum-power thermodynamic limits; his own papers separate the
  limit from the hypothesis that systems operate at it. The study keeps that
  distinction.
- BepiColombo: third Mercury flyby, 19 June 2023, passed the nightside at
  about 200 km with SERENA on, so some nightside in-situ data exist; the
  handoff calls SERENA the "first real opportunity", which is consistent but
  should be checked against what that flyby measured.
- Not checked: "CELL consortium".

**Measured.** Nothing.

**Next.** BLN-010 (residual-protocol runner on the toy; commit before
running), or BLN-012 (rotation option) if BL-H3 is the priority.

---

## 2026-11-18 · entry 2 · BL-H1 registered (before running)

**Registered.** `scripts/planetary-baselines/run-h1.mjs` (protocol in its
header) and `scripts/planetary-baselines/model.mjs` (the analyst's model: a
copy of the toy's step with four switches). Committed before the first run.

**Design checks run before registering (not BL-H1 results).**
- `checkFaithful`: with every switch on, the copy equals `core.step` by state
  hash for 300 ticks on seeds 1 and 1234.
- Effect of each switch, cells changed per tick from the same state, averaged
  over 20 ticks after a 200-tick spin-up, seeds 1 / 7 / 1234:
  altitude cooling 15,797 / 11,860 / 5,847; westerly 8,831 / 8,815 / 8,770;
  orographic 1.0 / 1.0 / 56.8; erosion 47.5 / 123.2 / 441.4.
  Because orographic condensation barely acts on some seeds, the kill
  criterion was clarified before the run: a (seed, process) pair is scored
  only if withholding changes at least 0.1% of cells per tick; a process is
  scored only with at least 4 eligible seeds. Study Section 5 updated.
- Statistics self-test (`--selftest`): chi-square tails match tables;
  equal values share a bin; perfect split gives eta^2 = 1.

---

## 2026-11-18 · entry 3 · BL-H1 killed, BL-H7 survives

**Run (Node 22, Linux x86-64; about 50 s each).**
- BL-H1 (registered in `6ab23f2`, run after): killed. Cooling of high ground
  found 8/8; westerly 0/8 (largest effect, ~47% of cells per tick; the local
  candidates average a transport signal away); orographic 0/6 eligible
  (effects 0.1-0.5% of cells); erosion 5/7 eligible (below 75%; lost twice
  to water depth); null 0/8 with structure. `results/h1.json`.
- Refactor: the protocol moved to `scripts/planetary-baselines/protocol.mjs`;
  BL-H1 rerun gave identical results apart from the timestamp.
- BL-H7 (registered in `74e9e18`, run after): survives. Adds candidates
  dqWest and dTWest (west neighbour minus the cell), seeds 208-215. Westerly
  8/8 (T against dTWest, eta^2 0.51-0.54); cooling of high ground 8/8; null
  0/8. Erosion 4/7 and orographic 0/8, reported, not scored. `results/h7.json`.

**Note on the BL-H7 log.** `runProtocol` prints its own BL-H1-style summary
(all four processes scored) labelled "BL-H7 ... killed". The registered BL-H7
verdict is the second JSON line, "survives this test", and is the verdict
stored in `results/h7.json`. The script was not edited after its run.

**Study.** Section 5.1 reports both, with the two lessons: candidates must
be shaped like the processes (transport needs differences along the flow),
and a miss on a weak process measures the protocol's power, not absence.

**Next.** BLN-011 (BL-H2: baseline prior past the horizon), or BLN-015
(power of the protocol), or BLN-012 (rotation option).
