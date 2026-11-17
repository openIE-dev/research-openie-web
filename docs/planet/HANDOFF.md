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
