# Study 1 preregistration: a structural skeleton under monthly global temperature

Fixed and committed before any model in `analyze.py` was run on the real series in `data/`. Before that commit, `analyze.py` was run only on synthetic series (`analyze.py --selftest`). Nothing below changes after the commit. Anything added later is labelled post hoc in the results.

## Question

The planetary-baseline programme claims that a forecast built as *structure first, residual second* does better beyond the deterministic weather horizon than a model that fits correlations in the raw record. Study 1 tests the smallest form of that claim on Earth's monthly global mean surface temperature, where four independent records exist.

- **Skeleton.** The structural driver is the logarithm of the carbon dioxide (CO2) concentration. The skeleton is a two-parameter line, T = a + b log2 CO2.
- **Residual memory.** Around the skeleton, the residual is modelled as fractional Gaussian noise (fGn) with one parameter, the Hurst exponent H. This is the macroweather memory model of Lovejoy and collaborators (the StocSIPS family, Stochastic Seasonal to Interannual Prediction System), reduced to its core.
- **Comparison.** The same skeleton with short memory (AR(1)) or many free parameters (AR(12)), and a model with no skeleton at all (AR(24) on the raw series).

## Data (all public, fetched by `fetch.sh`, SHA-256 in `data/SHA256SUMS`)

- HadCRUT5.0.2.0 analysis, global monthly (Met Office Hadley Centre and Climatic Research Unit).
- GISTEMP v4, global land-ocean monthly (NASA Goddard Institute for Space Studies).
- NOAAGlobalTemp, global land-ocean monthly (NOAA National Centers for Environmental Information).
- Berkeley Earth Land and Ocean, global monthly, air temperatures over sea ice (first block of the file).
- CO2: Mauna Loa monthly mean, deseasonalized column (NOAA Global Monitoring Laboratory), from 1958-03.
- Niño 3.4 sea surface temperature anomaly, ERSST v6 (NOAA Physical Sciences Laboratory), from 1948.

Each temperature record is used on its own baseline; models are fitted per record.

## Protocol

- Fit window: 1959-01 up to and including the forecast origin. No value after the origin is used for any fit or input.
- Origins: every month from 1990-01 to the last month of each record minus h.
- Horizons h (months): 1, 3, 6, 12, 24, 60, 120.
- Parameters are refitted at each January origin and held for the twelve origins that follow; the inputs (latest observations) update every month.
- Future CO2 for the skeleton: a quadratic in time fitted to the 120 months of deseasonalized CO2 up to the origin, extrapolated. Observed future CO2 is never used.

## Models

| ID | Skeleton | Residual model | Free parameters |
|---|---|---|---|
| M0 | a + b log2 CO2 | none (residual forecast = 0) | 2 |
| M1 | none | persistence: T(t+h) = T(t) | 0 |
| M2 | a + b log2 CO2 | AR(1), phi by least squares | 3 |
| M3 | a + b log2 CO2 | fGn, H by exact Gaussian maximum likelihood on the last 360 residuals (grid 0.50 to 0.99, step 0.01); forecast = conditional mean given the last 360 residuals | 3 |
| M4 | a + b log2 CO2 | AR(12), least squares, iterated | 14 |
| M5 | none | AR(24) with intercept on raw T, least squares, iterated | 25 |

## Metrics

- Root mean square error (RMSE) per record, model and horizon over all origins.
- Skill of model m against reference r: 1 - MSE_m / MSE_r.
- 95% intervals on skill by moving-block bootstrap over origins: blocks of 60 months, 2000 resamples, seed 20261118.

## Hypotheses and decision rules

A hypothesis is **supported** when its condition holds in at least 3 of the 4 records; **refuted** when the opposite condition holds in at least 3 of 4; otherwise **undecided**.

- **H1, memory matters on the skeleton.** At every h of 12 or more, skill of M3 against M2 is positive and its 95% interval excludes 0. Refuted if at every h of 12 or more the skill is at or below 0.
- **H2, one structural parameter is enough.** At every h of 12 or more, MSE of M3 is at most 1.05 times MSE of M4 (AR(12) on the same skeleton). Refuted if MSE of M3 exceeds 1.05 times MSE of M4 at every h of 12 or more.
- **H3, the skeleton beats the unconstrained fit beyond the horizon.** At every h of 24 or more, skill of M3 against M5 is positive and its 95% interval excludes 0. Refuted if at every h of 24 or more it is at or below 0.
- **H4, the residual of the residual has a known driver at short range (sanity check).** For h of 1, 3 and 6, the M3 forecast error correlates with Niño 3.4 at the origin, with a 95% bootstrap interval on the correlation that excludes 0. At h of 24 or more no such correlation is expected. If the short-range correlation is absent, the residual pipeline is suspect, not the hypothesis.
- **H5, macroweather scaling.** The Haar fluctuation exponent of the full 1959-to-end skeleton residual, fitted over lags 12 to 240 months, is negative (fluctuations shrink as the averaging interval grows). Reported with a bootstrap interval from fGn simulations at the fitted H.

## What this study is not

It is not a comparison against GraphCast, ECMWF (European Centre for Medium-Range Weather Forecasts) seasonal systems, or any gridded model. It uses one global scalar. A pass shows that a two-parameter skeleton plus a one-parameter memory is a strong floor on that scalar; it does not show that the same holds for regional fields.
