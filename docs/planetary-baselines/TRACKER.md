# Planetary baselines: tracker

Status is `todo`, `doing`, `done` or `blocked`. A task is not `done` without
evidence (a path, a commit, a URL). Hypothesis IDs refer to Section 5 of
`src/content/papers/planetary-baselines.md`.

## B0. Setup

| ID | Task | Status | Depends | Acceptance | Evidence |
|---|---|---|---|---|---|
| BLN-001 | Keep the source handoff verbatim | done | — | `docs/planetary-baselines/SOURCE_HANDOFF.md` | this commit |
| BLN-002 | Draft study (In preparation), pages, catalogue entry marked as draft | done | — | Builds; nothing published | `src/content/papers/planetary-baselines.md`, `src/pages/{papers,about}/baselines.astro`, `src/data/studies.json` |
| BLN-003 | Blueprint, tracker, ledger | done | — | Three files here | this commit |
| BLN-004 | Check the handoff's citations | doing | — | Each source labelled read or search-only in study Section 6 | First pass by search results recorded in ledger entry 1; "CELL consortium" not yet checked |
| BLN-005 | Read sources in full (Lovejoy et al. 2014 derivation; Verkercke et al. 2025; Kleidon reviews; CUISINES; BepiColombo flyby papers) | blocked | network | Section 6 updated | Hosts unreachable from the container |

## A. Toy planet (no outside data)

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| BLN-010 | Residual-protocol runner: withhold each of four processes, plus a null case; fix candidates and statistic in the file header; commit before running | todo | BLN-003 | Results in `docs/planetary-baselines/results/h1.json` | BL-H1 |
| BLN-011 | Long-run baseline of a toy world (per cell, per season) and two matched forecasters | todo | BLN-003 | Errors at 1, 3, 10 doubling times on held-out seeds | BL-H2 |
| BLN-012 | Rotation option for the toy (off by default) in `core.js` and `lib.rs`; planet hashes unchanged with it off | todo | — | `pnpm test:planet` and `test-rust.mjs` pass unchanged; new tests for rotation on | — |
| BLN-013 | Scaling ladder across toy worlds; spectral transition time per world | todo | BLN-012 | Held-out prediction error | BL-H3 |

## B. Mercury

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| BLN-020 | Locate MESSENGER MASCS/UVVS sodium products in the PDS and ground-based datasets; record versions and licences | blocked | network | A data manifest with checksums | BL-H5 |
| BLN-021 | Fix binning and the list of subtracted processes before fitting | todo | BLN-020 | Committed protocol file | BL-H5 |
| BLN-022 | Residual map and correlations, or a demonstration of none | todo | BLN-021 | Results and figures | BL-H5 |
| BLN-023 | Review BepiColombo instruments (SERENA, Mio) against the residual questions | todo | BLN-022 | Short memo | — |

## C. Macroweather transfer

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| BLN-030 | Read the Lovejoy et al. derivation in full; restate it with units | blocked | network | Derivation in the study | BL-H4 |
| BLN-031 | Pick a third body with usable records; compute its spectrum and predicted transition | todo | BLN-030 | Predicted vs observed | BL-H4 |

## D. Earth forecasts

| ID | Task | Status | Depends | Acceptance | Hypothesis |
|---|---|---|---|---|---|
| BLN-040 | Choose reanalysis subset and baseline; matched forecasters with and without the prior | blocked | data, compute | RMSE from 2 weeks to a season | BL-H6 |

## Publish

| ID | Task | Status | Depends | Acceptance |
|---|---|---|---|---|
| BLN-050 | Publish: status to "Research study" in the frontmatter and `studies.json`, `gen_one planetary-baselines` and a measurement block in `scripts/generate-pdfs.sh`, add the page to `scripts/lint-order.mjs`, hub link | todo | at least one of BL-H1 to BL-H3 run | `pnpm build` passes, order lint clean |
