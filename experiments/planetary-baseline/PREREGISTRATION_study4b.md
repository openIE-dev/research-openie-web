# Study 4b preregistration: is dust the slow driver in the Mars residual?

Fixed and committed before `mars_dust.py` was run on the lander data. Before the commit, it was run only with `--selftest`. The dust files were opened only to check columns, coverage and the sol and Ls alignment reported in `data/mars/DUST_PROVENANCE.md`.

## Question

Study 4 found that the Mars pressure residual, after a fixed seasonal and diurnal skeleton, stops shrinking near 8 to 16 sols and grows to about 100 sols at all three landers (H9 refuted). The protocol's next step is residual isolation against the named candidate, column optical depth tau. tau here is total aerosol (dust plus water ice) optical depth measured by each lander in visible light: Viking at 0.67 micrometres from direct Sun images (unflagged values only), InSight near 600 nanometres from sky brightness.

## Sample

For each lander, hours are kept only on sols where tau can be interpolated: linear interpolation of the per-sol tau in sol, across gaps of at most 30 sols, and not beyond the first or last tau sol. Every comparison below uses that same restricted set of hours, with and without the dust term.

## Analyses

- **Residual correlation.** The Study 4 skeleton (27 parameters) is fitted on the restricted hours. The daily mean residual (sols with at least 12 bins) is correlated with tau on sols where tau was measured that sol. 95% moving-block bootstrap interval, 30-sol blocks, 2000 resamples, seed 20261118.
- **Dust skeleton.** The same skeleton plus two dust terms, tau and tau multiplied by cos(2 pi local time) (dust changes the diurnal tide), 29 parameters, fitted on the restricted hours. Haar fluctuation of both residuals as in Study 4 Part A, slope over whole-sol lags 6 to 96 among lags with a value (at least 4 needed).

## Hypotheses (rule: at least 2 of the 3 landers)

- **H15, dust is in the residual.** The correlation of the daily residual with tau has a 95% interval excluding 0 (either sign). Refuted if the interval includes 0.
- **H16, dust removes the slow rise.** With the dust terms, the Haar slope over 6 to 96 sols is negative. Refuted if it stays at or above 0.
- **Reported, no rule:** the slope without the dust terms on the same restricted hours, and the change in residual variance.

## Self-test note

In the self-test, a synthetic dust signal of 15 Pa per unit tau with smooth 40-to-60-sol events was recovered as about 10 Pa per unit tau, and the no-dust residual's correlation with tau was near zero, because seasonal harmonics up to the fourth absorb slow, smooth dust variations. H15 is therefore a conservative test: it can miss dust that varies as smoothly as the seasons.
