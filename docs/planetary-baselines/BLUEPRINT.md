# Planetary baselines: blueprint

The working plan behind the draft study at `src/content/papers/planetary-baselines.md`
(status "In preparation": excluded from every listing and stripped from the
built site until it is published). Read this file once, then `TRACKER.md` for
the next open task, then the newest entry in `HANDOFF.md`. The origin of the
study is `SOURCE_HANDOFF.md`, kept verbatim; do not edit it.

## 1. Goal

Test two ideas from the source handoff, in this order:

1. **Hierarchy inversion.** A long-term structural baseline is the skeleton of a
   forecast; short-term models predict only the departure from it. Expected
   gain: beyond the deterministic horizon, not at short range.
2. **Residuals as the object.** Subtract every known process; test what remains
   against candidate variables; a residual flat across all of them is evidence
   of a missing mechanism.

Each method is scored first on the planet study's toy, where the mechanism is
known, then used on real data (Mercury, a third body for macroweather, Earth).

## 2. Rules

1. The source handoff's guardrails apply: structure before statistics; no new
   free parameter or sensor without the residual it should explain; agreement
   with data is not evidence of mechanism; inferred values (for example
   Mercury's nightside) are labelled as inferences.
2. Every hypothesis is committed with its kill criterion before it is run (the
   planet study's practice; see `scripts/planet/run-h12.mjs` for the pattern).
   Kill criteria may be tightened only before the run, and the change goes in
   the ledger.
3. The planet toy is shared. Anything this study adds to
   `public/living/planet/core.js` (and its Rust twin
   `experiments/planet-core/src/lib.rs`) must be an option that is off by
   default, so that the planet study's registered results and hashes do not
   change. `pnpm test:planet` and `node scripts/planet/test-rust.mjs` must
   still pass unchanged.
4. Site writing rules apply to the study page: define before use, terms list,
   no narrated author, no "we", no restricted status words (run
   `node scripts/lint-claims.mjs`; note "laws" is restricted, so write
   "scaling relations").
5. Sources: label every source by how it was checked (read in full, or search
   result only). The draft currently has no source read in full.

## 3. Workstreams

| Stream | Hypotheses | Needs | Where code goes |
|---|---|---|---|
| A. Toy planet tests | BL-H1, BL-H2, BL-H3 | Nothing external; BL-H3 needs a rotation option in the core | `scripts/planetary-baselines/`, results in `docs/planetary-baselines/results/` |
| B. Mercury sodium residual | BL-H5 | MESSENGER MASCS/UVVS sodium data (PDS), ground-based campaign data, published source-process models | `experiments/planetary-baselines-mercury/` |
| C. Macroweather transfer | BL-H4 | Long records of a third body (Venus cloud tracking, Titan) and the Lovejoy et al. derivation read in full | `experiments/planetary-baselines-macroweather/` |
| D. Baseline prior for Earth | BL-H6 | Reanalysis (ERA5 or a benchmark subset), compute for training | `experiments/planetary-baselines-earth/` |

Network note: in the cloud container used so far, most publisher and archive
hosts were unreachable, which blocks streams B to D and full-text source
checks. Stream A runs entirely locally.

## 4. Stream A design notes

- **BL-H1 (residual protocol).** The analyst's model is the toy's step with one
  process removed; the truth is the full step. Residual = observed next state
  minus the analyst's prediction, per cell per tick. Candidate variables:
  altitude above sea level, latitude, water depth, vapour, local heat gradient,
  wind band membership. Score: rank of the withheld process's driving variable
  by the protocol's chosen statistic. The statistic and the candidate list are
  fixed in the runner before it is run.
- **BL-H2 (baseline prior).** "Baseline" = the per-cell, per-season mean state
  of the same world over a long spin-up. Forecaster A predicts the state;
  forecaster B predicts state minus baseline. Start with the same simple
  learner for both (for example ridge regression on a local stencil), so the
  comparison is about the prior, not the learner.
- **BL-H3 (scaling ladder).** World parameters: size (W, H), water (sea level),
  sunlight amplitude, heat-transport coefficients, and rotation once added.
  Measured per world: doubling time (as in the planet study) and the spectral
  transition time of cell temperature series.

## 5. Definition of done for a task

A results file under `docs/planetary-baselines/results/`, a commit, a tracker row set to
`done` with that evidence, and a ledger entry that says what was measured, on
what, and what was not.
