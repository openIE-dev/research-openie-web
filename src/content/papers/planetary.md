---
title: "Structure First: Planetary Forecasting as a Skeleton Plus a Residual"
deck: "Work in progress. Most atmospheric models fit correlations in the record. This topic forecasts from a small structural skeleton, treats what is left as the scientific object, and tests the idea on Earth's temperature record and Mars surface pressure, with Mercury next."
id: planetary
status: "Work in progress"
author: "David Charlot, Open Interface Engineering"
figures: "/figures/planetary/rmse-horizon.svg"
pdf: "/pdfs/planetary.pdf"
board_metered: false
---

# Structure First: Planetary Forecasting as a Skeleton Plus a Residual

*{{revision}}. Code, data and preregistrations: `experiments/planetary-baseline/` in the site repository.*

## Abstract

A planetary atmosphere produces millions of measurable signals, but a few structural drivers set how it evolves. This topic builds forecasts in that order: first a small structural skeleton, then a model of the residual around it, then a search for the driver behind whatever residual is left. Two preregistered hindcasts on four independent records of Earth's monthly global temperature, 1990 to 2026, test the approach. A two-parameter skeleton in the logarithm of carbon dioxide cuts mean square error by 32 to 42% at two years and by 66 to 73% at ten years against a 25-parameter autoregression fitted to the raw record. Beyond one year, no residual model improves on the skeleton alone. A one-parameter long-memory model of the residual helps up to six months, then does worse than short memory; the residual's fluctuations decay faster than that model allows. One named driver, the El Niño–Southern Oscillation, explains part of the residual and adds 14 to 20% skill at three to six months. On Mars, a third preregistered study of Viking and InSight surface pressure finds the predicted weather break near two sols at one lander out of three. Beyond it, residual fluctuations rise again past about 16 sols; measured dust optical depth does not explain the rise linearly, but at Viking 1 it is confined to the 1977 dust-storm years, and in later years the residual falls with a slope close to Earth's. Protocols for Mercury and a laboratory scaling ladder follow.

**In plain words**

1. Instead of learning patterns from every number in the weather record, start from the one or two causes known to drive it, and forecast only what those causes leave unexplained.
2. On Earth's global temperature, a straight line in carbon dioxide forecasts the next one to ten years better than a pattern-fitting model with twelve times as many settings.
3. What the line misses is mostly El Niño, and adding El Niño helps for a few months. Beyond a year, nothing tried here beats the line alone.
4. On Mars the picture is less tidy. In quiet years the leftover behaves much as on Earth; in years with planet-wide dust storms something slow remains that dust measurements alone do not explain.

## Terms

<div id="terms"></div>

- **Skeleton:** the part of a forecast set by a small number of structural drivers, fitted with very few parameters.
- **Residual:** the observed value minus the skeleton. In this topic the residual, not the fit, is the object of study.
- **CO2:** carbon dioxide. Here, the deseasonalized Mauna Loa monthly mean concentration.
- **Hindcast:** a forecast made for a past date using only data available before that date, scored against what happened.
- **Horizon (h):** months between the last observation used and the month forecast.
- **RMSE (root mean square error)** and **MSE (mean square error):** the usual error measures, in °C and °C².
- **Skill of A against B:** 1 − MSE(A)/MSE(B). Positive means A is better; 0.2 means 20% less mean square error.
- **AR(p):** an autoregression, which predicts the next value from the last p values with p fitted weights.
- **fGn (fractional Gaussian noise):** a stationary random process whose correlations decay as a power of the lag, set by one number, the Hurst exponent H. H = 0.5 is white noise; H near 1 is long memory.
- **Macroweather:** the regime between weather (up to about ten days on Earth) and climate (decades and longer), in which averages over longer intervals converge.
- **Haar fluctuation:** the difference between the mean of the second half and the mean of the first half of an interval. How its size changes with interval length gives the scaling exponent of a series. For fGn the exponent is H − 1.
- **ENSO (El Niño–Southern Oscillation):** the coupled ocean-atmosphere oscillation of the tropical Pacific, with a period of two to seven years. **Niño 3.4** is the sea surface temperature anomaly in the central equatorial Pacific box that indexes it.
- **NOAA:** the United States National Oceanic and Atmospheric Administration.
- **GISTEMP:** the Goddard Institute for Space Studies Surface Temperature Analysis, from NASA.
- **MESSENGER:** the MErcury Surface, Space ENvironment, GEochemistry, and Ranging spacecraft, in orbit at Mercury from 2011 to 2015.
- **SHA-256:** a cryptographic hash; a matching sum shows a file is byte-for-byte the one used.
- **Sol:** a Mars solar day, 24 h 39 min 35 s.
- **Ls (solar longitude):** the position of Mars in its orbit, in degrees, used as the Mars season. Ls = 0 is northern spring equinox.
- **Buckingham-Pi analysis:** dimensional analysis that reduces a set of physical variables to a smaller set of dimensionless groups.

## 1. Thesis

Most atmospheric modelling oversamples. The record contains far more measured signals than there are drivers, and models trained on the record, whether statistical or machine-learned, learn the correlations among the reports rather than the mechanisms that produce them. Agreement with the record is not evidence of mechanism: a stopped clock agrees with the time twice a day.

The structure-first alternative inverts the usual hierarchy. It fixes a long-term skeleton first, from the fewest drivers that can carry it, and asks short-term models to predict only the residual around that skeleton. A model with a trusted skeleton has a smaller problem to solve, so its gains should appear where pattern-fitting models lose skill, beyond the deterministic weather horizon.

The residual after known processes are removed is the primary scientific object. If the residual correlates with a named variable, that variable is a candidate driver. If it is flat against every candidate, a mechanism is missing, and that is a result, not a fitting failure. Adding free parameters to absorb a residual destroys the evidence and is ruled out.

Other planets supply the natural experiments. Mars, Venus, Mercury and Pluto share some drivers with Earth and lack others, so a relation that holds across them is structural and one that fails marks a variable that matters. Controlled laboratory flows, such as the differentially heated rotating annulus, supply the experiments in which the dimensionless groups can be varied on purpose.

## 2. Prior work this topic builds on

**Macroweather.** Lovejoy and collaborators describe a regime between weather and climate in which fluctuations decrease as the averaging interval grows, and they predict where it begins from the energy flux that drives turbulence. On Mars the predicted transition is about 1.8 sols, against roughly ten days on Earth, and Viking lander and reanalysis data agree [1]. The ScaLIng Macroweather Model (SLIMM) [2] and the Stochastic Seasonal to Interannual Prediction System (StocSIPS) [3] forecast global temperature from this scaling. StocSIPS separates an anthropogenic component driven by CO2 from natural variability modelled as fGn, and in its hindcasts it matched an operational system at one month and did better at longer lead times [3]. Study 1 below is a reduced, independent replication of that architecture, built so that its parts can be removed one at a time.

**Records.** The four temperature records are HadCRUT5 [4], GISTEMP v4 [5], NOAAGlobalTemp [6] and Berkeley Earth [7]. They share much of their input data but differ in method, so agreement across them is a check on method and not on the planet.

**Mercury.** Mercury's sodium exosphere was found from the ground in 1985 [8]. Orbital observations by MESSENGER show a dayside exosphere that changes little from one Mercury year to the next [9], which makes it a clean case for a seasonal skeleton. The most recent multiscale model couples subsurface diffusion to a three-dimensional exosphere and explains the enhancement over the cold-pole longitudes by retention at low temperature [10].

**Pattern engines.** Machine-learned weather models such as GraphCast [11] now match or beat numerical models out to about ten days. Their skill beyond that horizon is the comparison this topic aims at eventually. Nothing in this paper is a comparison against them.

## 3. Study 1: a CO2 skeleton and residual memory on Earth

### 3.1 Design

The design was fixed in the preregistration file (`PREREGISTRATION.md`) and committed before any model ran on the real records; the code had been run only on synthetic series. Each record is used on its own baseline. Every model is fitted only on data from January 1959 up to the forecast origin, refitted each January, and forecasts are made from every month from January 1990 at horizons of 1, 3, 6, 12, 24, 60 and 120 months. Future CO2 is extrapolated from the ten years before the origin, never taken from the record.

| Model | Skeleton | Residual model | Free parameters |
|---|---|---|---|
| M0 | a + b log2 CO2 | none | 2 |
| M1 | none | persistence of the last value | 0 |
| M2 | a + b log2 CO2 | AR(1) | 3 |
| M3 | a + b log2 CO2 | fGn, H by maximum likelihood on the last 30 years | 3 |
| M4 | a + b log2 CO2 | AR(12) | 14 |
| M5 | none | AR(24) with intercept on the raw record | 25 |

M5 stands in for a pattern-fitting model with no skeleton. Intervals are 95% moving-block bootstrap intervals over origins, in 60-month blocks.

The preregistered hypotheses, each decided by agreement in at least three of the four records:

- **H1:** at 12 months and beyond, fGn memory (M3) beats short memory (M2).
- **H2:** at 12 months and beyond, M3 is within 5% of the 14-parameter M4.
- **H3:** at 24 months and beyond, the skeleton model M3 beats the unconstrained M5.
- **H4:** the M3 error correlates with Niño 3.4 at the origin at 1 to 6 months (a check that the residual pipeline sees a known driver).
- **H5:** the Haar exponent of the skeleton residual over 1 to 20 years is negative.

### 3.2 Results

![Figure 1. RMSE of each model against forecast horizon, mean of the four records, origins 1990 onward. Models with the CO2 skeleton (M0, M2, M3, M4) stay near 0.15 °C out to five years; persistence (M1) and the unconstrained autoregression (M5) grow to above 0.3 °C at ten years.](/figures/planetary/rmse-horizon.svg)

**Figure 1** shows the main result. With the skeleton, error is nearly flat with horizon; without it, error grows steadily.

| Comparison (skill, range over four records) | 1 mo | 6 mo | 12 mo | 24 mo | 60 mo | 120 mo |
|---|---|---|---|---|---|---|
| M0 against M5 (skeleton alone against no skeleton) | −1.23 to −0.90 | +0.02 to +0.11 | +0.22 to +0.31 | +0.32 to +0.42 | +0.51 to +0.58 | +0.66 to +0.73 |
| M3 against M5 (skeleton with memory against no skeleton) | +0.01 to +0.03 | +0.15 to +0.16 | +0.22 to +0.26 | +0.28 to +0.33 | +0.48 to +0.56 | +0.64 to +0.72 |
| M3 against M0 (memory against skeleton alone) | +0.48 to +0.56 | +0.05 to +0.13 | −0.07 to +0.01 | −0.15 to −0.05 | −0.07 to −0.03 | −0.05 to −0.02 |
| M3 against M2 (long memory against short memory) | +0.02 to +0.04 | +0.02 to +0.08 | −0.07 to +0.01 | −0.15 to −0.05 | −0.07 to −0.03 | −0.05 to −0.02 |

At one month the skeleton alone is worse than the unconstrained fit, as expected: it ignores the last observation. Per-record values with intervals are in `results/study1.md`.

| Hypothesis | Verdict | Records for, against |
|---|---|---|
| H1, long memory beats short memory beyond a year | undecided | 0 for, 2 against |
| H2, one memory parameter matches twelve | undecided | 1 for, 0 against |
| H3, the skeleton beats the unconstrained fit beyond two years | supported | 4 for, 0 against |
| H4, the residual sees ENSO at short range | supported | 4 for, 0 against |
| H5, negative Haar exponent of the residual | supported | 4 for, 0 against |

Three findings follow.

**The skeleton carries the long range.** Two parameters in log2 CO2 hold RMSE near 0.15 °C out to five years. The fitted slope is 2.66 to 2.84 °C per doubling of CO2 across the records. That number is a statistical slope in which CO2 stands in for all anthropogenic forcing, including other greenhouse gases and aerosols; it is not an estimate of climate sensitivity.

**Beyond one year, no residual model helps.** Memory of any kind (M2, M3, M4) improves on the skeleton by about half at one month and by nothing at twelve months or more. At 24 months M3 is 5 to 15% worse than the skeleton alone, with intervals that exclude zero in all four records.

**The residual is not single-exponent long memory.** The fitted Hurst exponent is 0.85 to 0.96 throughout the hindcast, which implies a Haar exponent near −0.07. The measured Haar exponent of the residual over 1 to 20 years is −0.32 to −0.39 (Figure 2). The fluctuations are nearly flat from one to three years, the ENSO band, and then fall faster than the fitted memory allows. The maximum-likelihood fit is dominated by month-to-month persistence and extrapolates it to scales where it does not hold, which is why M3 loses beyond a year.

![Figure 2. RMS Haar fluctuation of the skeleton residual against averaging interval, four records. Dashed: the slope implied by fGn at the fitted H. Dotted: white noise. The residual follows neither: flat to about three years, then falling with slope steeper than −0.3.](/figures/planetary/haar-residual.svg)

A post hoc control, not preregistered, checks that removing the fitted skeleton does not by itself produce this steepening. Synthetic series built as the skeleton plus fGn at H = 0.92 and 0.96, passed through the same skeleton fit, give median Haar exponents of −0.11 and −0.06; exponents at or below −0.32 occur in 4% and 1% of 300 realizations (`control_haar.py`). The four records share most of their inputs and are one planet, so this is about a 1-in-25 to 1-in-100 result, not four independent ones.

![Figure 3. Correlation of the M3 forecast error with Niño 3.4 at the origin, with 95% intervals, four records. Negative at 1 to 6 months, positive at 24 months.](/figures/planetary/enso-residual.svg)

**The residual of the residual has a named driver.** The M3 error correlates with Niño 3.4 at the origin at −0.29 to −0.39 for horizons of 1 to 6 months: when the tropical Pacific is warm at the origin, the world is warmer over the next months than the model expects (Figure 3). At 24 months the sign reverses, +0.21 to +0.26: a warm origin is followed by a cooler world two years later than expected, the signature of an oscillation and not of scale-free memory.

## 4. Study 2: one named driver in the residual

Study 2 asks whether the ENSO structure Study 1 found can be used. Its preregistration file (`PREREGISTRATION_study2.md`) was committed after Study 1 and before Study 2 ran. Because the hypothesis was suggested by the same data, a pass here is weaker evidence than a pass on unseen data.

The model, **M6**, is M2 plus one coefficient per horizon on Niño 3.4 at the origin, fitted each January on in-sample errors whose targets are all at or before the origin. Two hypotheses, with the same three-of-four rule:

- **H6:** M6 beats M2 at 1, 3 and 6 months.
- **H7:** M6 beats M2 at 24 months, where the ENSO correlation reverses.

| Skill of M6 (range over four records) | 1 mo | 3 mo | 6 mo | 12 mo | 24 mo | 120 mo |
|---|---|---|---|---|---|---|
| against M2 | +0.08 to +0.09 | +0.18 to +0.20 | +0.14 to +0.15 | +0.03 to +0.04 | +0.00 to +0.03 | −0.02 to −0.01 |
| against M0 (skeleton alone) | +0.51 to +0.59 | +0.31 to +0.38 | +0.17 to +0.20 | +0.03 to +0.04 | +0.00 to +0.03 | −0.02 to −0.01 |

**H6 is supported** in all four records, with intervals excluding zero at every short horizon. **H7 is undecided:** the fitted coefficient at 24 months has the reversed sign in every record, but the gain is 0 to 3% and every interval includes zero. At ten years the per-horizon coefficient costs 1 to 2%, a small, measurable price for a parameter that carries no signal there.

### 4.1 Study 2b: a physical forcing skeleton

Study 1's skeleton lets CO2 stand in for every human influence and leaves volcanic eruptions in the residual. Study 2b, preregistered in its own file (`PREREGISTRATION_study2b.md`), replaces log2 CO2 with the effective radiative forcing (ERF) itself, from the Indicators of Global Climate Change dataset [12]: anthropogenic plus volcanic plus solar forcing in W m⁻², passed through a one-box response with one sensitivity and one response time (three parameters). A year's forcing counts as known only from the following January. Two hypotheses were fixed: that the forcing skeleton beats the CO2 skeleton at 12 and 24 months, and that the gain survives with the AR(1) and ENSO terms added.

Both were **refuted in all four records**. The forcing skeleton is worse than the CO2 line at every horizon from 6 months, by 18 to 34% in mean square error at 12 months and by a factor of 2.2 to 2.9 at ten years. Post hoc diagnostics, not preregistered (`diag_study2b.py`), locate the cause:

| Skeleton variant, skill against the CO2 skeleton (range over four records) | 12 mo | 24 mo | 120 mo |
|---|---|---|---|
| One sensitivity, one response time (as preregistered) | −0.34 to −0.18 | −0.52 to −0.29 | −1.94 to −1.18 |
| Same, with the true future forcing supplied | −0.24 to −0.07 | −0.36 to −0.13 | −1.62 to −0.89 |
| Separate sensitivities for anthropogenic and natural forcing | −0.08 to −0.01 | −0.18 to −0.05 | −0.55 to −0.25 |
| Both changes | −0.01 to +0.05 | −0.03 to +0.06 | −0.21 to −0.01 |

The main fault is structural. Per W m⁻², natural forcing, dominated by eruptions, moves global temperature by about 0.16 to 0.18 °C, against 0.40 to 0.42 °C for anthropogenic forcing. A single sensitivity cannot fit both, and the fit compensates with a four-year response time that delays the warming trend. Extrapolating the forcing itself is the second fault. With both removed, the physical skeleton only matches the CO2 line. The finding agrees with the two-time-scale picture of the climate response, a fast mixed layer and a slow deep ocean [13]: a skeleton has to carry the system's time scales, not merely have few parameters.

## 5. What the two studies say about the thesis

The structure-first claim survives its first test in its strong form at long range and needs revising at medium range.

1. **Supported:** a skeleton built from one driver with two parameters is the right foundation. Beyond one year it is the forecast, and unconstrained fitting to the record loses to it by a large margin that grows with horizon.
2. **Revised:** "macroweather memory" should not be modelled as one scale-free exponent for this residual. At 1 to 3 years it behaves as an oscillation with a named driver; beyond that it decays faster than single-exponent memory. A residual model should be built from the drivers the residual points to, not from one power law fitted to its first lags.
3. **The protocol works as intended.** The residual pointed to a driver (ENSO), adding that driver helped exactly where the residual said it would, and it did not help where the residual said it would not. That is the residual-isolation loop on a case where the answer is known, which is the precondition for trusting it on a case where it is not.

4. **Fewer parameters is not the same as more structure.** Study 2b's physically motivated skeleton lost to the CO2 line because it forced two time scales into one. A structural skeleton has to be right about the system's time scales before it is economical.

Not yet tested: a two-time-scale forcing skeleton; regional fields rather than one global number; any comparison with ECMWF (European Centre for Medium-Range Weather Forecasts) seasonal systems or machine-learned models. Each is listed with the studies below.

## 6. Study 3: out of sample on Earth

Planned and preregistered in the Study 2 preregistration file (`PREREGISTRATION_study2.md`). M0, M2, M3 and M6 with parameters frozen at the January 2026 refit are scored on origins from January 2027 onward, first scored in January 2029 when 24 months of new data exist. It is the unseen-data test that Study 2 could not be.

## 7. Study 4: does the macroweather baseline transfer to Mars?

The question is whether the skeleton-plus-residual structure, and the weather-to-macroweather transition near 1.8 sols [1], hold in a second atmosphere with a different driver mix: a thin CO2 atmosphere, a seasonal CO2 condensation cycle that changes surface pressure by about a quarter, and dust instead of oceans.

### 7.1 Design

The preregistration file (`PREREGISTRATION_study4.md`) was committed before the analysis ran on the lander data; before that, only the data coverage had been looked at. The data are hourly mean surface pressures from the Planetary Data System (PDS): Viking Lander 1 (22°N, sols 0 to 2245), Viking Lander 2 (48°N, sols 0 to 1204) and InSight (4°N, sols 4 to 1219), with a provenance file beside them in `data/mars/`. Air temperature was left out because of known sensor errors at Viking 2 and InSight.

- **Skeleton (27 parameters per lander):** seasonal harmonics 0 to 4 in Ls, plus diurnal harmonics 1 to 3 in local time with amplitudes that vary with Ls.
- **Part A:** Haar fluctuation of the hourly residual from a quarter sol to 128 sols, with decisions taken only at whole-sol lags.
- **Part B:** a hindcast ladder on daily means from sol 700, at 1 to 30 sols. D0 is the seasonal skeleton alone, D1 is persistence, D2 is the skeleton plus AR(1), and D5 is an AR(5) on the raw daily series with no skeleton.

The self-test changed how the transition hypothesis has to be read. A synthetic weather process that forgets over 2 sols has its Haar peak near 12 sols. The Haar peak therefore marks the break between growing and shrinking fluctuations, a scale several times longer than a memory time, and the 1.8-sol prediction is tested as a prediction of that break.

Hypotheses, each decided by agreement in at least two landers:

- **H8:** the Haar fluctuation peaks at a whole-sol lag of 1 to 4 sols.
- **H9:** beyond the break, between 6 and 96 sols, the Haar slope is negative (macroweather).
- **H10:** at 10 and 30 sols, the skeleton model D2 beats the unconstrained D5.
- **H11:** at 30 sols, memory adds less than 5% to the skeleton alone.

### 7.2 Results

![Figure 4. RMS Haar fluctuation of the Mars surface pressure residual against averaging interval, three landers. Shaded: lags under one sol, where diurnal leftovers dominate. Dashed: the predicted 1.8-sol break.](/figures/planetary/mars-haar.svg)

| Hypothesis | Verdict | Landers for, against (of those that entered) |
|---|---|---|
| H8, break at 1 to 4 sols | supported | 3 for, 0 against (of 3) |
| H9, macroweather slope beyond the break | refuted | 0 for, 3 against (of 3) |
| H10, skeleton beats the unconstrained fit | undecided | 1 for, 0 against (of 2; InSight had too few origins) |
| H11, memory fades by 30 sols | supported | 2 for, 0 against (of 2) |

The verdicts need reading against Figure 4.

**The break.** Only Viking 2 shows the predicted shape: fluctuations grow from one sol to a peak at two to three sols and then shrink. Viking 2 sits at 48°N, under the travelling weather systems of the northern mid-latitudes. At Viking 1 and InSight, nearer the equator, fluctuations already shrink from the smallest whole-sol lag, so their break lies at one sol or below and is not resolved. H8 passes by its rule; the positive detection rests on one lander.

**No macroweather plateau.** After a minimum near 8 to 16 sols, fluctuations grow again out to about 100 sols at all three landers (slopes +0.01 to +0.18). On Earth the residual fluctuations kept falling to 20 years. On Mars, a slow component that a fixed seasonal skeleton cannot follow remains in the residual. Two candidates are year-to-year differences in the seasonal cycle and dust: the residual at tens of sols includes the 1977 global dust storms in the Viking record. The protocol does not let that component be absorbed by more harmonics. It points to the next named driver to test, dust optical depth.

**The ordering of models.** At Viking 1, the record with most origins, the skeleton dominates as it does on Earth: D2 beats the unconstrained AR(5) by 81% in mean square error at 10 sols and by 98% at 30 sols. At Viking 2 the AR(5) beats the skeleton at 1 to 10 sols, where weather systems carry real short-range memory and the seasonal skeleton alone has an RMSE of 22 Pa. At 30 sols the skeleton wins there too (+44%), but the interval includes zero. H11 passes, but it was a weak test: an AR(1) residual forecast decays to the skeleton by construction, so this result adds little.

Per-lander tables are in `results/study4.md`.

### 7.3 Study 4b: is dust the slow driver?

Residual isolation against the named candidate, as ENSO was for Earth. Each lander measured its own column optical depth in visible light: Viking from direct images of the Sun at 0.67 µm [14], InSight from sky brightness near 600 nm [15]. Both include water ice as well as dust. The Viking series stop at sols 920 and 872, so the test uses only sols where optical depth can be interpolated across gaps of at most 30 sols, with and without dust on the same hours. The preregistration file (`PREREGISTRATION_study4b.md`) fixed two hypotheses: that the daily residual correlates with optical depth, and that adding two dust terms to the skeleton turns the Haar slope from 6 to 96 sols negative.

**Both were refuted.** Only Viking 2's correlation excludes zero, and it is small (+0.08, interval +0.01 to +0.23). Viking 1's is +0.26 with an interval from −0.20 to +0.51. The dust terms flatten Viking 1's slow rise (slope +0.08 to +0.02) without removing it, and steepen InSight's (+0.13 to +0.20). The self-test had warned that the test is conservative, because seasonal harmonics absorb dust variations as smooth as the seasons.

### 7.4 Where the slow rise lives

Three post hoc diagnostics, not preregistered (`diag_mars_years.py`), and one preregistered follow-up locate the rise.

- **Year-specific seasons** barely change it (Viking 1 slope +0.18 to +0.15, InSight +0.13 to +0.13).
- **Finer seasons**, harmonics up to the eighth instead of the fourth, remove it at both Viking landers (Viking 1 to −0.07, Viking 2 to −0.23) but not at InSight (+0.13).
- **By years at Viking 1**, with the Study 4 skeleton fitted on all four Mars years, the slope is +0.20 in years 1 and 2 and −0.40 in years 3 and 4. Mars year 1 at Viking 1 contains the two global dust storms of 1977.
- **Study 4c** (`PREREGISTRATION_study4c.md`) fitted the finer skeleton on Viking 1 years 1 and 2 and scored the held-out years 3 and 4. The held-out slope is −0.47, so the hypothesis that a finer skeleton leaves a falling slope passes; but the original skeleton also gives −0.38 on those years, so the finer skeleton is not what makes the difference there.

Read together: on Mars, a falling, macroweather-like residual does appear once the storm years are set aside. At Viking 1 in years 3 and 4 its slope, −0.40, is close to Earth's −0.32 to −0.39, a cross-planet agreement that is post hoc and rests on one lander. The rise is concentrated in the years of planet-wide dust storms, where the measured optical depth, dropped at its most uncertain points, does not explain it linearly. At InSight it persists through every skeleton tried. InSight's calibration used estimated inputs for sols 233 to 702, and its sampling thinned after about sol 567 [15], so instrument drift has to be ruled out before the InSight rise is read as atmospheric.

### 7.5 Next on Mars

1. A dust-storm term that responds to storm onset rather than linearly to optical depth, tested on Viking 1 year 1 against year 3.
2. A check of the InSight rise against its calibration history, sol by sol.
3. Curiosity pressure at Gale crater, which spans more than six Mars years and the 2018 global storm.

## 8. Study 5: the Mercury sodium residual floor

Mercury has no ocean and almost no atmosphere; its exosphere is collisionless, so its drivers are few and listed: thermal desorption, photon-stimulated desorption, solar-wind sputtering, micrometeoroid vaporization, radiation pressure and photoionization. The protocol:

1. Assemble MESSENGER UVVS (Ultraviolet and Visible Spectrometer) sodium limb scans from the PDS, with published ground-based columns as a cross-check.
2. Bin by Mercury true anomaly angle, local time, latitude and altitude. The near repeatability between Mercury years [9] makes true anomaly angle the natural skeleton coordinate.
3. Fit the listed source and loss terms with physically bounded parameters, and subtract.
4. Test the residual against magnetic cusp geometry, hot-pole and cold-pole longitudes, and subsurface diffusion parameters [10].
5. A residual flat against all of them requires a new process.

The nightside is almost unmeasured. Any nightside floor the protocol reports is inferred from the dayside, and will be labelled as an inference, not a measurement, until in-situ data from BepiColombo arrive.

## 9. Study 6: the scaling ladder

Rotating annulus and differentially heated chamber experiments, varied in heat flux, rotation rate and fluid, are reduced by Buckingham-Pi analysis to their governing groups, chiefly the thermal Rossby number and the Taylor number. Read and collaborators place planetary atmospheres in the same terms [16]. The test is whether the regime boundaries the laboratory finds in those groups predict observed regimes on Earth, Mars, Venus and Titan, and where they fail. A failure of transfer locates a variable the laboratory does not contain.

### 9.1 Rung 0: no laboratory, one boundary

Rung 0 asks whether the annulus boundary near a thermal Rossby number Ro_T = R ΔT_h / (Ω a)² of order one sorts four bodies correctly. R is the specific gas constant, ΔT_h the equator-to-pole temperature difference, Ω the rotation rate and a the radius. Inputs are ranges, sampled 10,000 times (`ladder.py`). The decision rule was committed first (`PREREGISTRATION_study6.md`) as hypothesis **H14**: every body classified, and all four matching the regime observed.

| Body | Ro_T (5th to 95th percentile) | Predicted | Observed |
|---|---|---|---|
| Earth | 0.041 to 0.065 | baroclinic eddies | baroclinic eddies, irregular |
| Mars | 0.14 to 0.29 | baroclinic eddies | regular winter baroclinic waves |
| Titan | 4.6 to 10 | axisymmetric | wide Hadley cells, superrotation |
| Venus | 220 to 1,100 | axisymmetric | planet-wide Hadley cells, superrotation |

**H14 is supported**, with margins of more than a factor of four on every body. The result replicates a known placement, so its value is as a calibration of the procedure. Within the eddy regime, Mars has about four times Earth's Ro_T and the more regular waves, which matches the annulus ordering. Transfer fails at the next question: both axisymmetric bodies superrotate, and the annulus regime diagram has no group that predicts superrotation. The obvious missing variable is radiation, the ratio of the radiative relaxation time to the rotation period, which the annulus lacks altogether. Rung 1 is a laboratory or numerical experiment that adds a radiative relaxation term and asks whether superrotation appears at the Ro_T where Titan and Venus sit.

## 10. Falsifiers for the topic

- If Study 3 finds that M0 or M6 loses to the unconstrained M5 at 24 months on unseen data, the central claim fails on Earth.
- If a storm-onset dust term fitted on Viking 1 year 1 does not reduce the residual rise in a held-out storm year, the slow driver at the Viking sites is not dust, and the falling macroweather slope of quiet Mars years is not a baseline that transfers.
- If the Mercury residual can be absorbed by the six listed processes within their physical bounds, there is no missing mechanism to find there.

## 11. Reproduce

```bash
cd experiments/planetary-baseline
pip install numpy scipy matplotlib
python3 analyze.py --selftest   # synthetic check
python3 analyze.py              # Study 1, about one minute
python3 study2.py               # Study 2
python3 control_haar.py         # post hoc control
python3 study2b.py              # Study 2b
python3 diag_study2b.py         # post hoc diagnostics for 2b
python3 ladder.py               # Study 6 rung 0
python3 mars.py --selftest      # Mars synthetic check
python3 mars.py                 # Study 4
python3 mars_dust.py            # Study 4b
python3 diag_mars_years.py      # post hoc Mars diagnostics
python3 mars_holdout.py         # Study 4c
python3 figures.py              # figures into public/figures/planetary/
```

`fetch.sh` downloads newer copies of the data; the committed copies in `data/`, with SHA-256 sums, are the ones the reported results were computed from (fetched 18 November 2026).

## 12. References

How each reference was checked is stated after it.

<ol data-refs>
<li>S. Lovejoy, J.-P. Muller, J. P. Boisvert, "On Mars too, expect macroweather," <em>Geophysical Research Letters</em> 41, 7694–7700 (2014), DOI 10.1002/2014GL061861. Abstract and publisher record checked.</li>
<li>S. Lovejoy, L. del Rio Amador, R. Hébert, "The ScaLIng Macroweather Model (SLIMM): using scaling to forecast global-scale macroweather from months to decades," <em>Earth System Dynamics</em> 6, 637–658 (2015). Cited for the model's existence and scope only; not re-read for this draft.</li>
<li>L. del Rio Amador, S. Lovejoy, "Predicting the global temperature with the Stochastic Seasonal to Interannual Prediction System (StocSIPS)," <em>Climate Dynamics</em> 53, 4373–4411 (2019), DOI 10.1007/s00382-019-04791-4. Abstract and publisher record checked.</li>
<li>C. P. Morice et al., "An updated assessment of near-surface temperature change from 1850: the HadCRUT5 data set," <em>Journal of Geophysical Research: Atmospheres</em> 126, e2019JD032361 (2021). Data used: HadCRUT.5.0.2.0 global monthly summary series.</li>
<li>N. J. L. Lenssen et al., "Improvements in the GISTEMP uncertainty model," <em>Journal of Geophysical Research: Atmospheres</em> 124, 6307–6326 (2019). Data used: GISTEMP v4 GLB.Ts+dSST.</li>
<li>NOAA National Centers for Environmental Information, NOAAGlobalTemp global land and ocean monthly series, Climate at a Glance. Data used as downloaded; no paper claim made.</li>
<li>R. A. Rohde, Z. Hausfather, "The Berkeley Earth Land/Ocean Temperature Record," <em>Earth System Science Data</em> 12, 3469–3479 (2020). Data used: Land_and_Ocean_complete, air temperature over sea ice.</li>
<li>A. E. Potter, T. H. Morgan, "Discovery of sodium in the atmosphere of Mercury," <em>Science</em> 229, 651–653 (1985). Cited for the discovery only.</li>
<li>T. A. Cassidy et al., "Mercury's seasonal sodium exosphere: MESSENGER orbital observations," <em>Icarus</em> 248, 547–559 (2015), DOI 10.1016/j.icarus.2014.10.037. Abstract checked.</li>
<li>S. Verkercke et al., "On the origins of Mercury's sodium exospheric cold poles enhancement: a multiscale exosphere global model," <em>Journal of Geophysical Research: Planets</em> 130, e2025JE009309 (2025), DOI 10.1029/2025JE009309. Abstract checked.</li>
<li>R. Lam et al., "Learning skillful medium-range global weather forecasting," <em>Science</em> 382, 1416–1421 (2023). Cited for scope only.</li>
<li>P. M. Forster et al., "Indicators of Global Climate Change 2024: annual update of key indicators of the state of the climate system and human influence," <em>Earth System Science Data</em> (2025). Data used: the ClimateIndicator forcing-timeseries repository, file ERF_best_aggregates_1750-2024.csv. The paper itself was not re-read.</li>
<li>I. M. Held et al., "Probing the fast and slow components of global warming by returning abruptly to preindustrial forcing," <em>Journal of Climate</em> 23, 2418–2427 (2010). Cited for the two-time-scale picture only.</li>
<li>R. A. Colburn, J. B. Pollack, R. M. Haberle, "Diurnal variations in optical depth at Mars," <em>Icarus</em> 79, 159–189 (1989). Data used: PDS Viking lander opacity products (VL_OPAC); the paper itself was not re-read.</li>
<li>M. T. Lemmon et al., "Results from the InSight atmospheric imaging campaign" (manuscript archived with the data; the archive indicates <em>Icarus</em>, 2024), and the PDS Atmospheres node InSight optical depth bundle, DOI 10.17189/dc8r-ag55 (unresolvable on the day of download; files taken from the review area). Data used as archived; the paper was not re-read.</li>
<li>P. L. Read, S. R. Lewis, G. K. Vallis, "Atmospheric dynamics of terrestrial planets," in <em>Handbook of Exoplanets</em> (Springer, 2018). Repository record checked; cited for the use of the thermal Rossby number in planetary regimes.</li>
</ol>

Methods used without a claim about their sources' content: Haar fluctuation analysis as used in geophysics by Lovejoy and Schertzer (*Nonlinear Processes in Geophysics* 19, 513–527, 2012); fractional Gaussian noise (Mandelbrot and Van Ness, *SIAM Review* 10, 422–437, 1968); the moving-block bootstrap (Künsch, *Annals of Statistics* 17, 1217–1241, 1989).

*© 2026 Open Interface Engineering, Inc. Text, figures, data and scripts: under the MIT license or the Apache License 2.0, at your option.*
