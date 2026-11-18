# Study 4c preregistration: a finer seasonal skeleton, tested on held-out Mars years

Fixed and committed before `mars_holdout.py` was run. The hypothesis comes from a post hoc diagnostic (`diag_mars_years.py`, `results/diag_mars_years.json`): with seasonal harmonics up to k = 8 instead of 4, fitted on each full record, the Viking residual Haar slope over 6 to 96 sols turns negative (Viking 1 -0.07, Viking 2 -0.23) while InSight's stays at +0.13. Fitting and scoring on the same years cannot separate a real structural improvement from absorbed variance, so Study 4c fits on early years and scores on later ones.

## Design

- Viking 1 only: it is the one record with four Mars years (sols 0 to 2245).
- Fit: Study 4's skeleton form (diurnal harmonics 1 to 3 modulated by {1, cos Ls, sin Ls}) with seasonal harmonics up to kmax, least squares on sols 0 to 1337 (Mars years 1 and 2).
- Score: Haar fluctuation of the residual on sols 1338 to 2245 only, slope over whole-sol lags 6 to 96 as in Study 4b, for kmax = 4 and kmax = 8.

## Hypothesis

- **H17.** On the held-out years, the residual Haar slope over 6 to 96 sols is negative with kmax = 8. Refuted if it is at or above 0. Also reported: the kmax = 4 slope on the same held-out years, and the residual variance for both.
