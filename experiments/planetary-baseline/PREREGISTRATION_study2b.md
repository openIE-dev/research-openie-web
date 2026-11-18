# Study 2b preregistration: a forcing skeleton in place of log CO2

Fixed and committed before `study2b.py` was run on the real temperature records. Before the commit it was run only with `--selftest`. The forcing file was opened only to check its columns and to print five annual values (1963, 1982, 1991, 1992, 2000) to confirm the volcanic sign.

## Question

Study 1's skeleton uses one driver, log2 CO2, so CO2 stands in for every anthropogenic forcing and volcanic eruptions stay in the residual. Study 2b asks whether a skeleton built from the physical forcings themselves, with one climate sensitivity and one response time, forecasts better.

## Data

Everything in Study 1, plus annual effective radiative forcing (ERF) 1750 to 2024 from the Indicators of Global Climate Change dataset (`data/erf_igcc.csv`, columns `anthro`, `volcanic`, `solar`, in W m-2).

## Information rule

The ERF value for calendar year Y counts as known only at origins from January of Y + 1. Monthly forcing is linear interpolation between mid-year values. After the last known mid-year:
- anthropogenic: linear extrapolation of the last 10 known years;
- volcanic: relaxes from its last known value to the median of known years since 1959, with an e-folding time of 12 months (the stratospheric aerosol lifetime, fixed, not fitted);
- solar: the mean of the last 11 known years.

## Skeleton (3 parameters)

F = anthro + volcanic + solar. A one-box response R relaxes toward F with time constant tau: R(t) = R(t-1) + (F(t) - R(t-1)) / tau, run monthly from 1850. T_skel = a + lambda R. tau is chosen each January from {6, 12, 24, 48, 96} months by least squares, with a and lambda, on 1959 to the origin.

## Models (same origins, horizons, refits, bootstrap and seed as Study 1)

- F0: forcing skeleton alone.
- F2: F0 plus AR(1) on its residual.
- F6: F2 plus beta_h Nino 3.4 at the origin, fitted as M6 in Study 2.
- Compared with M0, M2 and M6 from Studies 1 and 2, recomputed in the same run.

## Hypotheses (3 of 4 records rule)

- **H12, the forcing skeleton beats the CO2 skeleton.** Skill of F0 against M0 is positive with a 95% interval excluding 0 at both h = 12 and h = 24. Refuted if at or below 0 at both.
- **H13, the gain survives the residual models.** Skill of F6 against M6 is positive with a 95% interval excluding 0 at both h = 12 and h = 24. Refuted if at or below 0 at both.

## Reported without a decision rule

A nowcast variant, F6n, in which the volcanic ERF of the origin's own year is known at the origin. It shows what near-real-time aerosol observation would add, since the annual product arrives later than the aerosol itself is observed.
