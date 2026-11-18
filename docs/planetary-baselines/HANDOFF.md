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
