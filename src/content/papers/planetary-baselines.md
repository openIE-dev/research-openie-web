---
title: "Structure Before Statistics: Planetary Baselines, Residuals and Forecasting Past the Horizon"
deck: "Weather and climate models fit an enormous number of signals, while a small number of drivers may control how a planet's atmosphere evolves. This study asks whether a long-term structural baseline, with short-term forecasts treated as corrections to it, gives skill where pattern-matching models lose it, and whether the residual left after known processes are subtracted can point to a missing mechanism. It starts on a toy planet whose every process is known, then turns to Mercury, Mars and Earth."
id: planetary-baselines
status: "In preparation"
author: "David Charlot, Open Interface Engineering"
figures: "/living/planet/"
pdf: "/pdfs/planetary-baselines.pdf"
board_metered: false
---

# Structure Before Statistics: Planetary Baselines, Residuals and Forecasting Past the Horizon

*{{revision}}. Draft in preparation; not published.*

## Abstract

This study tests a structure-first approach to planetary atmospheres. It has two parts. First, a long-term baseline built from scaling relations and long-run averages is treated as the skeleton of a forecast, and short-term models predict only the departure from it. Second, after every known process is subtracted from an observation, the residual is treated as the main scientific object: a residual that follows a candidate variable points to that variable, and a residual that follows none points to a missing mechanism. Both ideas are tested first on a toy planet in which every process is known and every run can be replayed exactly, so the methods can be checked against a known answer before they are used on real data. Tests on Mercury's sodium exosphere, on the weather-to-macroweather transition of other planets, and on Earth forecasts beyond about ten days follow, and need data and computing not yet in hand. Three toy tests have been run; they are reported with the test plan.

**In plain words**

1. A forecast can start from what the planet does over years and decades, and only then add what today's weather adds. The bet is that this helps most where today's best models stop helping, beyond about ten days.
2. When everything known has been subtracted from a measurement, what is left over is the clue. If the leftover follows nothing that has been measured, something is missing from the explanation.
3. These methods are first tried on a small simulated planet where the right answer is known, so that a method that fails can be caught before it is trusted on Mercury or Earth.

## Terms

Every acronym on this page is either expanded where it is first used or listed here.

<ul id="terms">
<li>BL: the prefix of this study's hypothesis identifiers (BL-H1 and onwards)</li>
<li>ERA5: the fifth global atmospheric reanalysis of the European Centre for Medium-Range Weather Forecasts</li>
<li>GCM: general circulation model, a numerical model of a planet's atmosphere or climate</li>
<li>GISS: the NASA Goddard Institute for Space Studies</li>
<li>GRL: Geophysical Research Letters</li>
<li>JGR: Journal of Geophysical Research</li>
<li>MESSENGER: the NASA spacecraft that orbited Mercury from 2011 to 2015</li>
<li>NASA: National Aeronautics and Space Administration</li>
<li>NExSS: the NASA Nexus for Exoplanet System Science</li>
<li>PDS: the NASA Planetary Data System, the archive of planetary mission data</li>
<li>PSJ: the Planetary Science Journal</li>
<li>RMSE: root-mean-square error</li>
<li>SERENA: the particle instrument package on the BepiColombo Mercury Planetary Orbiter</li>
</ul>

## 1. The idea under test

The research direction comes from a handoff note kept with the study's working files (`docs/planetary-baselines/SOURCE_HANDOFF.md` in the repository). Its core claim is that most atmospheric modelling oversamples: many signals are measured, few drivers control the system, and models that fit correlations among the signals learn the reports rather than the mechanisms behind them. The note proposes three moves.

1. **Hierarchy inversion.** Build a long-term baseline first, from scaling relations, long-run averages and the floor left after known processes are subtracted, and let short-term models predict only the departure from it.
2. **Residuals as the object.** Subtract every known process from an observation, then test what remains against candidate variables. A residual that is flat across every candidate is evidence of a missing mechanism, not a failed fit.
3. **Planets as natural experiments.** Use other planets and laboratory flows as comparisons in which some variables differ and others do not, and test which dimensionless groups carry across.

The note also sets rules for anyone continuing the work, human or machine: structure before statistics; no new free parameters or sensors without a hypothesis about which residual they should explain; agreement with data is not evidence of mechanism; and inferences about places that have not been measured, such as Mercury's nightside, must not be reported as measurements. This study adopts those rules and adds the one the [planet study](/papers/planet/) follows: every hypothesis is stated with its kill criterion, and committed, before it is run.

## 2. What is already known

The sources below were checked only against search results for this draft; the last section lists what each check covered.

**Macroweather.** Lovejoy, Muller and Boisvert report that terrestrial atmospheric spectra change character at about 10 days, the transition from weather to the slower regime they call macroweather, and that Martian spectra from the Viking landers and from reanalysis, once scaled by a theoretically predicted amount, match the terrestrial ones ("On Mars too, expect macroweather," *GRL* 41(21):7694–7700, 2014, [doi:10.1002/2014GL061861](https://doi.org/10.1002/2014GL061861)). Press coverage gives the Martian transition as about 1.8 Martian days; the derivation was not read.

**The deterministic horizon.** The planet study cites a practical limit of about ten days for midlatitude weather prediction on Earth, and its toy planet showed a stable doubling time for small differences on wet worlds. A baseline matters most beyond such a horizon, where differences in starting conditions have grown to the size of the signal.

**Thermodynamic limits.** Axel Kleidon's work derives first-order estimates of atmospheric motion, the water cycle and land productivity from limits on how much work an Earth-system process can extract from the energy that flows through it, and argues for maximum power over maximum entropy production as the governing limit. His own papers separate the limit, which follows from thermodynamics, from the hypothesis that real systems operate at it, which is open. The handoff note's "thermodynamic optimum" belongs to the second kind of claim.

**Mercury's sodium.** Verkercke and co-authors couple a model of sodium diffusion through Mercury's regolith to a three-dimensional exosphere model and find that low temperatures can hold sodium near the surface at the cold longitudes and release it as they warm, which would produce the enhancements MESSENGER observed there ("On the Origins of Mercury's Sodium Exospheric Cold Poles Enhancement," *JGR Planets* 130, e2025JE009309, 2025, [doi:10.1029/2025JE009309](https://doi.org/10.1029/2025JE009309)). Whether a nightside floor remains unexplained after such models is the question this study would test, not a result it can cite. The BepiColombo spacecraft passed Mercury's nightside at about 200 km on 19 June 2023 with SERENA operating, so some nightside in-situ data already exist; how much they constrain sodium was not checked.

**Model intercomparison.** The CUISINES framework of NExSS organises intercomparisons of models of exoplanet climates, built on the practice of Earth climate intercomparisons (Sohl and co-authors, *PSJ* 5:175, 2024, [arXiv:2406.09275](https://arxiv.org/abs/2406.09275)). ROCKE-3D, a GISS GCM derived from the Earth model ModelE2, extends that model to other rocky planets. The handoff note's description of CUISINES as covering Earth, Mars, Venus and Titan was not confirmed; the sources found describe exoplanets.

## 3. Tests that need no outside data: a planet in a bottle

The planet study's toy planet is a strip of $192 \times 96$ cells with sun, heat, wind, vapour, rain, rivers and erosion, computed in 32-bit integers. Every process in it is written down, and every run can be replayed exactly from a seed and a log of edits. That makes it the opposite of a real planet: the mechanism is known, so a method that claims to find mechanisms can be scored.

- **BL-H1, the residual protocol on a known system.** One of four processes of the toy (cooling of high ground, the westerly drift, lower condensation over high ground, erosion by strong flow) is switched off in the analyst's model, while the simulation keeps it. The analyst sees the state with a small error on temperature, predicts one step ahead, and tests the residual of each field against nine candidate variables by the share of its variance each one explains. A sound protocol ranks the withheld process's driving variable first; with nothing withheld, it finds no structure. The full protocol, including thresholds and seeds, was committed before the first run (`scripts/planetary-baselines/run-h1.mjs`).
- **BL-H2, hierarchy inversion on the toy.** Two forecasters of the toy's weather are trained on the same runs: one predicts the state directly, the other predicts only the departure from a long-run baseline of the same world. Both use the same ridge regression and the same local features; the baseline is the world's own climatology, computed from a separate long run. Both are scored on 8 worlds not used in training, at lead times of one, three and ten doubling times, with persistence and climatology alone as references. The design was committed before the first run (`scripts/planetary-baselines/run-h2.mjs`).
- **BL-H3, a scaling ladder across toy worlds.** Worlds that differ in size, water, sunlight and heat transport are run, and candidate dimensionless groups are tested as predictors of each world's doubling time and of the timescale at which its temperature spectrum flattens, the toy's own weather-to-macroweather transition.

The toy has no rotation, so the dimensionless groups of rotating flows, among them the Rossby and Taylor numbers, do not yet exist in it. Rotation has since been added as an option that is off by default, so that the planet study's registered results are unchanged: a share of the air moving north or south, growing with latitude, is turned east when it moves toward a pole and west when it moves toward the equator. It is a crude stand-in for the Coriolis effect, enough to give BL-H3 a rotation rate to vary.

## 4. Tests that need data

- **BL-H4, macroweather transfer.** The transition timescale predicted from first principles, which Lovejoy and co-authors tested on Earth and Mars, is computed for a third body with suitable records (Venus cloud tracking or Titan are candidates) and compared with the observed spectrum. Data and a derivation read in full are both needed.
- **BL-H5, Mercury's sodium residual.** Following the handoff note's protocol: assemble MESSENGER and ground-based sodium measurements, bin them by true anomaly, local time, latitude and altitude, subtract the modelled sources (thermal desorption, photon-stimulated desorption, solar-wind sputtering, micrometeoroid vaporisation, radiation pressure and photoionisation, and the subsurface model above), and test the residual against magnetic cusp location, cold and hot longitudes, and terminator crossing. Either outcome is reported: a correlation, or a residual flat across all candidates. Nightside values inferred from dayside data are labelled as inferences.
- **BL-H6, a baseline prior for Earth forecasts.** A forecaster given a scaling baseline as its prior is compared with the same forecaster without it, on reanalysis such as ERA5, by RMSE at lead times from two weeks to a season. Short-range skill is reported but is not the test.

## 5. Test plan

Each hypothesis is listed with its kill criterion. BL-H1 to BL-H3 run on the toy and can be registered now; BL-H4 to BL-H6 wait for data.

| ID | Hypothesis | Test | Measure | Kill criterion |
|---|---|---|---|---|
| BL-H1 | The residual protocol finds a withheld driver and invents none | Toy planet, each of four processes withheld in turn, plus a null case; 8 seeds each | Rank of the withheld variable among candidates; structure found in the null case | For any process that is detectable in at least 4 seeds (withholding it changes at least 0.1% of cells per tick), found in fewer than 75% of those seeds; or structure found in more than 1 of 8 null seeds |
| BL-H2 | A baseline prior helps past the horizon | Two forecasters as above, held-out seeds | Error at 1, 3 and 10 doubling times | At 10 doubling times, the forecaster with the baseline prior is not more accurate than the direct one on at least 6 of 8 held-out worlds |
| BL-H3 | A dimensionless group predicts the doubling time across worlds | 60 toy worlds: 3 sizes, 5 rotation rates, 4 seeds (water varies by seed); a log-linear fit in water per cell, rotation and the drift's crossing time over the season, every 4th world held out | Prediction error on held-out worlds | Error above a factor of 2 on more than a quarter of held-out worlds with measured growth; not testable if more than half the worlds show no growth |
| BL-H4 | The macroweather transition transfers to a third body | Spectra of a third body's records | Predicted against observed transition time | Off by more than a factor of 2 |
| BL-H5 | Mercury's sodium residual follows a named candidate, or none | MESSENGER and ground-based sodium | Correlation with each candidate | Neither outcome is a kill; the result is reported either way, with the binning fixed before the data are fitted |
| BL-H6 | A scaling baseline lowers multi-week forecast error on Earth | Reanalysis, matched forecasters | RMSE at 2 weeks to a season | No reduction beyond the seed-to-seed spread |

### 5.1 First result: BL-H1

BL-H1 was run as registered on seeds 200 to 207 in Node 22 on one Linux machine; results are in `docs/planetary-baselines/results/h1.json` in the repository. It is killed.

- **Cooling of high ground: found on 8 of 8 seeds.** The residual of temperature against altitude explained 28% to 87% of its variance.
- **The westerly drift: found on 0 of 8,** although withholding it changes about 47% of cells per tick, the largest effect of the four. The drift moves vapour and heat from each cell to its eastern neighbour, so the residual at a cell follows the difference between the cell and its upwind neighbour. Inside the band, cells gain and lose about equally, and no local candidate separates them. A protocol that tests residuals against local quantities is blind to transport.
- **Lower condensation over high ground: found on 0 of 6 eligible seeds.** Withholding it changes 0.1% to 0.5% of cells per tick, below what the protocol's effect-size floor can see.
- **Erosion: found on 5 of 7 eligible seeds,** below the 75% bar. On the two misses, water depth ranked first and the accepted flow variable second.
- **The null case: no structure on any of 8 seeds.** The protocol invented nothing.

The finding that matters for real planets is the second. Mercury's sodium is moved by radiation pressure and by transport around the planet, and a residual analysis that bins against local quantities can miss a large transported signal entirely. The next hypothesis tests the obvious repair, registered before it was run on new seeds:

| ID | Hypothesis | Test | Measure | Kill criterion |
|---|---|---|---|---|
| BL-H7 | Adding upwind differences as candidates lets the protocol find the westerly drift | BL-H1's protocol with two extra candidates (vapour and heat of the western neighbour minus the cell's own), seeds 208 to 215 | Westerly found; null structure; cooling of high ground still found | Westerly found on fewer than 6 of 8 seeds; or structure in more than 1 of 8 null seeds; or cooling of high ground found on fewer than 75% of its eligible seeds |

BL-H7 was then run as registered (`docs/planetary-baselines/results/h7.json`). It survives this test. The westerly drift was found on 8 of 8 seeds: the residual of temperature against the western neighbour's temperature minus the cell's own explained 51% to 54% of its variance, where no BL-H1 candidate had explained more than 8%. Cooling of high ground was still found on 8 of 8, and no null seed showed structure. Erosion was found on 4 of 7 eligible seeds and lower condensation over high ground on none, as before; BL-H7 does not score them.

Two lessons carry to real data. A residual protocol needs candidates shaped like the processes it is looking for: transport needs differences along the flow, not local values. And a process that changes a small share of the field, like the condensation term here, can sit below any sensible effect-size floor; failing to find it is a statement about the protocol's power, not evidence that the process is absent.

### 5.2 Second result: BL-H2

BL-H2 was run as registered on 16 training and 8 test worlds (`docs/planetary-baselines/results/h2.json`). It survives this test. The table gives the range of temperature RMSE over the 8 test worlds, in the toy's heat units.

| Lead time | Direct (A) | Baseline prior (B) | Direct with the baseline as input (A+) | Persistence | Climatology alone |
|---|---|---|---|---|---|
| 25 ticks, about 1 doubling time | 46.8 to 54.8 | 46.1 to 54.7 | 46.0 to 54.6 | 66.1 to 75.5 | 113.9 to 189.1 |
| 75 ticks, about 3 | 105.6 to 121.1 | 63.7 to 99.0 | 64.1 to 98.8 | 177.1 to 205.2 | 109.0 to 187.8 |
| 250 ticks, about 10 | 181.8 to 217.3 | 99.5 to 171.7 | 99.9 to 169.7 | 411.4 to 483.9 | 105.6 to 190.6 |

At 250 ticks the baseline prior was more accurate than the direct forecaster on 8 of 8 worlds, by 21% to 45%, and more accurate than climatology alone on all 8. At one doubling time it added almost nothing. The gain appears where the handoff note predicts it, beyond the horizon.

The secondary comparison changes how the result should be read. The direct forecaster given the same baseline as an input (A+) did as well as the one that predicts the departure from it; B was ahead of A+ on only 3 of 8 worlds. For this learner, the gain comes from knowing the structure, not from recasting the forecast as a residual. Whether the residual form matters for learners that can overfit, where a fixed skeleton may act as a constraint rather than as information, is a separate question this test does not answer.

## 6. Sources and limits

All external sources above were checked only against search results, not against full texts. Lovejoy, Muller and Boisvert 2014: citation and abstract; the 1.8-day figure from press coverage only. Verkercke and co-authors 2025: citation and abstract. Sohl and co-authors 2024 (CUISINES): citation and summary. ROCKE-3D: summary pages. Kleidon: abstracts and conference pages. BepiColombo flyby of 19 June 2023: a conference abstract. Not yet checked at all: the "CELL consortium" named in the handoff note, and the location of MESSENGER sodium data in the PDS.

BL-H1, BL-H7 and BL-H2 have been run (Sections 5.1 and 5.2). The kill criteria in Section 5 are a first statement and may be tightened, but only before the corresponding test is run, and any change is recorded in the study's working ledger.
