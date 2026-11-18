# Study 2 preregistration: one named driver in the residual

Fixed and committed after Study 1 and before `study2.py` was run on the real series. Study 2 exists because of a Study 1 result: the M3 forecast error correlates with Niño 3.4 at the origin, negatively at 1 to 6 months and positively at 24 months (`results/study1.md`). That pattern was seen before this file was written, so Study 2 is a confirmatory test of a hypothesis suggested by Study 1 data, on the same records and the same origins. A pass is weaker evidence than a pass on unseen data; Study 3 (below) is the out-of-sample check.

## Model

Everything in Study 1 (data, fit window, origins, horizons, annual refit, CO2 extrapolation, bootstrap, seed) is unchanged.

- **M6 = M2 + beta_h N34(o).** The skeleton and AR(1) residual of M2, plus one coefficient per horizon on Niño 3.4 at the origin.
- beta_h is refitted each January by least squares, no intercept, on the in-sample errors of M2 at training origins o' from 1961-01 to o - h (so every target month is at or before the origin), using that January's skeleton and phi.
- Free parameters: 3 shared plus 1 per horizon.

## Hypotheses (same 3-of-4 records rule as Study 1)

- **H6, ENSO adds short-range skill.** Skill of M6 against M2 is positive with a 95% interval excluding 0 at each of h = 1, 3, 6. Refuted if it is at or below 0 at all three.
- **H7, the ENSO sign flip is forecastable.** Skill of M6 against M2 at h = 24 is positive with a 95% interval excluding 0. Refuted if it is at or below 0.
- **Reported, no decision rule:** skill of M6 against M0 and M3 at every horizon.

## Study 3 (plan, not run here)

Repeat M0, M2, M3 and M6 with origins from 2027-01 onward as the records extend, with parameters frozen at the 2026-01 refit, scored once 24 months of new data exist (2029-01). No change to code other than the origin window.
