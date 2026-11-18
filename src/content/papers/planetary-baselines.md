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

This study tests a structure-first approach to planetary atmospheres. It has two parts. First, a long-term baseline built from scaling relations and long-run averages is treated as the skeleton of a forecast, and short-term models predict only the departure from it. Second, after every known process is subtracted from an observation, the residual is treated as the main scientific object: a residual that follows a candidate variable points to that variable, and a residual that follows none points to a missing mechanism. Both ideas are tested first on a toy planet in which every process is known and every run can be replayed exactly, so the methods can be checked against a known answer before they are used on real data. Tests on Mercury's sodium exosphere, on the weather-to-macroweather transition of other planets, and on Earth forecasts beyond about ten days follow, and need data and computing not yet in hand. Nothing has been run.

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

- **BL-H1, the residual protocol on a known system.** One process of the toy (for example the cooling of high ground, or the westerly drift) is removed from the model the analyst fits, while the simulation keeps it. The residual left after subtracting the fitted model is then tested against candidate variables, among them the one that was withheld. A sound protocol names the withheld variable; with nothing withheld, it finds no structure beyond its stated false-positive rate.
- **BL-H2, hierarchy inversion on the toy.** Two forecasters of the toy's weather are trained on the same runs: one predicts the state directly, the other predicts only the departure from a long-run baseline of the same world. Both are scored on seeds not used in training, at lead times of one, three and ten doubling times.
- **BL-H3, a scaling ladder across toy worlds.** Worlds that differ in size, water, sunlight and heat transport are run, and candidate dimensionless groups are tested as predictors of each world's doubling time and of the timescale at which its temperature spectrum flattens, the toy's own weather-to-macroweather transition.

The toy has no rotation, so the dimensionless groups of rotating flows, among them the Rossby and Taylor numbers, do not yet exist in it. Rotation must be added before BL-H3 can speak to laboratory annulus experiments or to real planets. It will be added as an option that is off by default, so that the planet study's registered results, which depend on the current step, are unchanged.

## 4. Tests that need data

- **BL-H4, macroweather transfer.** The transition timescale predicted from first principles, which Lovejoy and co-authors tested on Earth and Mars, is computed for a third body with suitable records (Venus cloud tracking or Titan are candidates) and compared with the observed spectrum. Data and a derivation read in full are both needed.
- **BL-H5, Mercury's sodium residual.** Following the handoff note's protocol: assemble MESSENGER and ground-based sodium measurements, bin them by true anomaly, local time, latitude and altitude, subtract the modelled sources (thermal desorption, photon-stimulated desorption, solar-wind sputtering, micrometeoroid vaporisation, radiation pressure and photoionisation, and the subsurface model above), and test the residual against magnetic cusp location, cold and hot longitudes, and terminator crossing. Either outcome is reported: a correlation, or a residual flat across all candidates. Nightside values inferred from dayside data are labelled as inferences.
- **BL-H6, a baseline prior for Earth forecasts.** A forecaster given a scaling baseline as its prior is compared with the same forecaster without it, on reanalysis such as ERA5, by RMSE at lead times from two weeks to a season. Short-range skill is reported but is not the test.

## 5. Test plan

Each hypothesis is listed with its kill criterion. BL-H1 to BL-H3 run on the toy and can be registered now; BL-H4 to BL-H6 wait for data.

| ID | Hypothesis | Test | Measure | Kill criterion |
|---|---|---|---|---|
| BL-H1 | The residual protocol finds a withheld driver and invents none | Toy planet, each of four processes withheld in turn, plus a null case; 8 seeds each | Rank of the withheld variable among candidates; structure found in the null case | Withheld variable not ranked first in at least 6 of 8 seeds for any process, or structure found in more than 1 of 8 null seeds |
| BL-H2 | A baseline prior helps past the horizon | Two forecasters as above, held-out seeds | Error at 1, 3 and 10 doubling times | No reduction at 10 doubling times, or a reduction smaller than the spread between seeds |
| BL-H3 | A dimensionless group predicts the doubling time across worlds | Toy worlds varying size, water, sunlight, heat transport | Prediction error on held-out worlds | Error above a factor of 2 on more than a quarter of held-out worlds |
| BL-H4 | The macroweather transition transfers to a third body | Spectra of a third body's records | Predicted against observed transition time | Off by more than a factor of 2 |
| BL-H5 | Mercury's sodium residual follows a named candidate, or none | MESSENGER and ground-based sodium | Correlation with each candidate | Neither outcome is a kill; the result is reported either way, with the binning fixed before the data are fitted |
| BL-H6 | A scaling baseline lowers multi-week forecast error on Earth | Reanalysis, matched forecasters | RMSE at 2 weeks to a season | No reduction beyond the seed-to-seed spread |

## 6. Sources and limits

All external sources above were checked only against search results, not against full texts. Lovejoy, Muller and Boisvert 2014: citation and abstract; the 1.8-day figure from press coverage only. Verkercke and co-authors 2025: citation and abstract. Sohl and co-authors 2024 (CUISINES): citation and summary. ROCKE-3D: summary pages. Kleidon: abstracts and conference pages. BepiColombo flyby of 19 June 2023: a conference abstract. Not yet checked at all: the "CELL consortium" named in the handoff note, and the location of MESSENGER sodium data in the PDS.

Nothing has been run. The kill criteria in Section 5 are a first statement and may be tightened, but only before the corresponding test is run, and any change is recorded in the study's working ledger.
