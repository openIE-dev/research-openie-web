# Study 4 preregistration: does the macroweather baseline transfer to Mars?

Fixed and committed before `mars.py` was run on the lander data in `data/mars/`. Before the commit, `mars.py` was run only with `--selftest` on synthetic series. Before writing this file, the only thing looked at in the Mars data was coverage: the number of sols with at least 8, 12 or 16 hourly bins after sol 700, per lander. Study 3 (Earth, out of sample) is planned in `PREREGISTRATION_study2.md` and keeps its number.

## Question

Study 1 found, on Earth, that a structural skeleton carries the forecast beyond the weather-to-macroweather transition and that residual memory adds little there. Lovejoy, Muller and Boisvert (2014) predict that the transition on Mars is near 1.8 sols. Study 4 asks two things of Mars surface pressure: is there a transition near that scale, and does the skeleton-first ordering of models hold?

## Data

Hourly (1/24 sol) mean surface pressure from `data/mars/` (provenance in `data/mars/PROVENANCE.md`):

- Viking Lander 1, VL_P point pressures re-binned, sols 0 to 2245.
- Viking Lander 2, VL_P, sols 0 to 1204.
- InSight PS calibrated pressure, byte-range subsampled, sols 4 to 1219.

Temperature is not used: the Viking 2 sensor carries a known error of about 3 °C and the two InSight booms disagree by a median of 2.3 K and up to 25 K.

## Part A: Haar scaling of the skeleton residual

- **Skeleton (27 parameters, per lander, least squares on all hourly bins):** seasonal harmonics k = 0 to 4 in solar longitude Ls, plus diurnal harmonics j = 1 to 3 in local time, each multiplied by {1, cos Ls, sin Ls}.
- **Residual series** on a regular hourly grid (bin = floor(24 × sol), sol being the bin centre), with missing bins left missing.
- **RMS Haar fluctuation** at lag L bins: for every start, the mean of the second half minus the mean of the first half, using only starts where each half has at least 75% of its bins present.
- Lags (sols): 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128. Decisions use only whole-sol lags, where any diurnal leftover cancels.
- **What H8 measures.** The transition is read as the lag at which the RMS Haar fluctuation stops growing and starts to shrink, the break between weather and macroweather scaling. This study reads the 1.8-sol prediction as a prediction of that break scale. It is not an e-folding time: in the self-test, a weather process with an e-folding time of 2 sols has its Haar peak near 12 sols.
- **H8, a transition near 1.8 sols.** Among whole-sol lags 1 to 32, the RMS Haar fluctuation peaks at a lag of 1 to 4 sols. Refuted if it peaks at 6 sols or more.
- **H9, macroweather beyond the transition.** The least-squares slope of log RMS Haar fluctuation on log lag over whole-sol lags 6 to 96 is negative. Refuted if it is at or above 0.

## Part B: hindcast ladder on daily means

- **Daily value:** the mean over a sol's hourly bins of pressure minus a diurnal correction, for sols with at least 12 bins. The diurnal correction is the diurnal part (j = 1 to 3, modulated by {1, cos Ls, sin Ls}) of a skeleton fitted only on sols 0 to 668 (the first Mars year), so no later data enters it.
- **Origins:** every sol o from 700 to the end such that the daily value exists at o and at the five sols before it and at o + h. Horizons h = 1, 3, 10, 30 sols. Parameters are refitted every 30 sols on all daily values before the origin.
- **Models:**
  - D0, skeleton: seasonal harmonics k = 0 to 4 in Ls, fitted on daily values (9 parameters).
  - D1, persistence of the daily value at o.
  - D2, D0 plus AR(1) on the D0 residual, phi from consecutive-sol pairs (10 parameters).
  - D5, AR(5) with intercept on raw daily values, from consecutive six-sol windows, iterated (6 parameters, no skeleton).
- Skill and 95% moving-block bootstrap intervals as in Study 1, with blocks of 30 sols, 2000 resamples, seed 20261118.
- A lander enters a Part B decision at a horizon only if it has at least 100 origins there.
- **H10, the skeleton beats the unconstrained fit.** Skill of D2 against D5 is positive with an interval excluding 0 at both h = 10 and h = 30. Refuted if it is at or below 0 at both.
- **H11, memory fades beyond the transition (the Earth result).** At h = 30, skill of D2 against D0 lies within ±0.05. Refuted if it lies outside ±0.05.

## Decision rule

A hypothesis is supported when its condition holds in at least 2 of the landers that enter it (and at least 2 enter), refuted when the opposite condition holds in at least 2, and otherwise undecided.

## Not in this study

Residual isolation against dust optical depth (protocol step 5 in the paper) needs the Viking and InSight optical depth series, which are not yet in `data/`. It is the next Mars study.
