<!-- Source document for the baselines study, supplied with the request of 2026-11-18 and kept verbatim. Do not edit; record corrections in HANDOFF.md. -->

# Handoff Document: Structure-First Comparative Planetary Sensing and Forecasting

**Purpose**  
This document captures a research direction for moving beyond pure data-driven or post-hoc statistical weather and climate modeling. It is written so that both human researchers and AI agents can use it to design experiments, isolate residuals, identify structural drivers, and generate testable new science.

**How to Use This Document**  
- **AI agents**: Treat the Core Thesis and Methodological Principles as hard constraints. Excel at residual computation, large parameter sweeps, literature cross-checks, and ensemble analysis. Do not absorb unexplained residuals into additional free parameters.  
- **Human researchers**: Own the hypothesis about which small set of variables (or dimensionless groups) actually matter. Use the residual protocols, scaling ladder, and next steps as experimental and modeling blueprints. Design instruments and missions that target specific unexplained residuals rather than expanding general coverage.  
- Update the Open Research Questions as they are resolved or refined. Prefer structure-constrained hypotheses over pure data-driven fitting.

---

## Core Thesis

Most atmospheric modeling oversamples. Millions of measurable signals exist, but only a small number of structural drivers control the system’s evolution. Pure data-driven models (and many physics-informed ones) fit correlations among the reports rather than the mechanisms producing them.

True progress requires:
- Establishing long-term structural baselines first (macroweather memory, planetary scaling laws, residual floors after known-process subtraction).
- Treating short-term forecasts as residual corrections on that skeleton.
- Using planetary boundary cases (Mercury, Venus, Mars, Pluto) and controlled laboratory systems as natural experiments to isolate which variables actually transfer.

This is a reductionist, structure-first approach, not a capture-everything approach. A broken clock is right twice a day; alignment with an underlying rhythm is not the same as comprehension of the mechanism. A short-term model that conditions on a trusted decade-scale skeleton solves a smaller residual problem and should show skill gains precisely where pure pattern engines currently degrade (beyond ~10 days).

---

## Key Insights from the Discussion

- **Microscopy parallel**: In live-cell imaging, high-frame-rate capture of hypothesized drivers (membrane dynamics, cytoskeletal tension) under controlled perturbation reveals what matters. Logging every Brownian motion does not. Planetary sensing currently logs everything and sorts later.
- **Earth-as-cell framing**: The atmosphere is a semi-permeable boundary. Internal nutrient, chemical, and thermodynamic cycles produce self-regulation closer to a thermodynamic optimum or anticipatory free-energy minimization than to pure statistical correlation. The framing is useful for intuition but must be made falsifiable through scaling, not metaphor.
- **Creature sensing**: Other organisms detect signals (infrasound, barometric pressure, electromagnetic fields, chemical gradients) closer to drivers. Human instruments reflect historical choices about what is measurable at the scales we chose.
- **Hierarchy inversion**: Decade-scale structural baselines (macroweather memory with negative spectral slope, converging averages) should be the foundation. Short-term models then predict only the residual around that baseline.
- **Mercury as a clean test case**: Collisionless exosphere. Known solar-driven processes do not fully explain the sodium floor, especially on the nightside. Asymmetry and residual after subtraction are the signal. The nightside is almost unmeasured. The thermal cliff at the terminator is a map of time-in-sunlight, not radial distance, and implies possible thermoelectric ion fluxes that have not been instrumented.
- **Scaling ladder**: Controlled rotating annulus and chamber experiments → mesocosms → planetary comparison via Buckingham-Pi dimensionless groups. Identify which groups transfer and where transfer fails.

---

## Open Research Questions

1. What is the measurable residual “floor” for Mercury sodium (and other species) after all currently modeled drivers are subtracted? Does it correlate with magnetic cusps, hot-pole longitudes, subsurface thermal gradients, or something else?
2. Which dimensionless groups from rotating annulus or chamber experiments transfer cleanly to planetary regimes? Where do they break, and why?
3. Can macroweather scaling laws be extended from Earth and Mars to Venus superrotation, Mars dust cycles, and Pluto freeze-out to produce transferable baselines?
4. Which under-sampled signals (thermoelectric ion fluxes at terminators, biological or chemical tracers, high-resolution soil moisture, mesoscale ocean eddies, infrasound below ~20 Hz) are closest to actual drivers on Earth?
5. How should a structure-first model be validated? A residual that is flat across all candidate variables is evidence of a missing mechanism, not a fitting failure.

---

## Proposed Approaches

### Residual Isolation Protocol (Mercury Example, Extensible)

1. Assemble existing sodium column density and tail measurements (ground-based campaigns such as Potter/Killen, MESSENGER UVVS limb scans, published tail imaging).
2. Bin by true anomaly angle, local time, latitude, and altitude.
3. Fit and subtract known drivers: thermal desorption, photon-stimulated desorption, solar-wind sputtering, micrometeoroid vaporization, radiation pressure, and photoionization.
4. Analyze the residual for correlation with candidate mechanisms (magnetic field geometry and cusp locations, thermal inertia or hot-pole maps, subsurface diffusion parameters).
5. If the residual is unstructured across all candidates, a new process is required. This outcome is falsifiable.

**Note**: Nightside composition data are almost nonexistent (Mariner 10 occultations provided only H/He scale heights; BepiColombo’s SERENA package is the first real opportunity for in-situ nightside measurements). The floor is currently inferred from the dayside, not measured. That inference itself is a result.

The same protocol can be applied to Venus superrotation, Mars dust lifting, or Pluto volatile migration.

### Scaling Ladder

- Run families of rotating annulus or differentially heated chamber experiments that vary heat flux, rotation rate, and fluid properties.
- Apply Buckingham-Pi analysis to identify governing dimensionless numbers.
- Test transfer of those numbers against planetary observations (Mars landers, Venus cloud tracking, Earth reanalysis).
- Use AI agents to sweep parameter space and flag where transfer fails.

### Hierarchy Inversion for Forecasting

- Adopt or construct a macroweather-scale or scaling-law baseline as the long-term skeleton.
- Train or constrain short-term numerical or data-driven models to predict only the residual around that skeleton.
- Evaluate skill first on 10-day to multi-year horizons. Short-term skill is a secondary metric. The expected outcome is reduced residual error beyond the deterministic horizon relative to unconstrained models.

### Sensing Recommendations

- Mercury: ion flux and surface potential sensors that cross the terminator; nightside composition measurements.
- Earth: higher-cadence biological and chemical tracers, denser infrasound arrays, and mesoscale ocean current observations targeted at hypothesized drivers.
- Cross-planet: consistent residual analysis protocols applied to existing Venus, Mars, and Pluto datasets.

---

## Methodological Principles (Guardrails)

- Structure before statistics. The hypothesis about drivers constrains sampling rate and location.
- The residual after known-process subtraction is the primary scientific object.
- Planetary comparison is a natural experiment with no human interference.
- Scaling must be tested, not assumed. A wrong equation remains wrong at any size.
- Alignment with data is not evidence of mechanism.
- Prefer converging averages (macroweather) over fitting noise.
- Do not add sensors or free parameters without a hypothesis about which residual they should explain.

---

## Key Prior Work and Groups

- Shaun Lovejoy and collaborators (McGill): Macroweather regime and scaling theory applied to Earth and Mars. Lovejoy et al. (2014), *Geophysical Research Letters*, “On Mars too expect macroweather.” Predicted the weather-to-macroweather transition at approximately 1.8 sols from solar-driven turbulent energy flux; confirmed with Viking and reanalysis data.
- CUISINES framework (NASA NExSS and partners): Systematic intercomparison of planetary climate models across Earth, Mars, Venus, Titan, and exoplanets. Emphasizes defining questions first and producing observation-comparable data products.
- ROCKE-3D (NASA GISS): Generalized GCM descended from ModelE2, extended across wide ranges of pressure, rotation, composition, and topography for rocky planets.
- Planet-in-a-Bottle / rotating annulus tradition: Controlled laboratory systems (cold center representing the pole, warm outer wall representing the equator) that generate baroclinic instability, eddies, and heat transport for regime testing and dimensional analysis.
- Verkercke et al. (2025), *Journal of Geophysical Research: Planets*: Multiscale Mercury sodium model coupling subsurface diffusion to a 3-D exosphere simulation. Explains cold-pole enhancements via retention at low temperatures; still requires tuned source terms for the nightside floor.
- Related thermodynamic and systems framing: Axel Kleidon’s work on Earth’s thermodynamic optimum; applications of Markov blankets and free-energy minimization to planetary climate; the CELL consortium’s search for scale-invariant governing operators.

---

## Concrete Next Steps

1. Implement the Mercury residual protocol on publicly available MESSENGER and ground-based sodium data. Publish the residual map and any correlations (or the demonstration that none exist).
2. Engage or replicate Lovejoy-style scaling analysis on additional planetary datasets to test transferability of the macroweather baseline.
3. Design a small set of rotating annulus experiments whose dimensionless groups are predicted to map onto specific planetary regimes (Mercury terminator transition, Venus superrotation analog, Mars dust loading). Run them and quantify transfer limits.
4. Review BepiColombo and future Mercury mission instrument suites against the residual and terminator ion-flux questions; propose targeted additions if gaps remain.
5. Prototype a forecasting pipeline that uses a scaling-law baseline as the mean and a short-term model as the anomaly. Benchmark multi-week to seasonal skill against unconstrained AI or numerical baselines.

---

## Potential Pitfalls

- Fitting residuals with additional free parameters instead of isolating them.
- Assuming linear scaling without testing where transfer fails.
- Treating nightside or dark-side inferences as direct measurements.
- Optimizing short-term forecast skill metrics that reward matching historical noise.
- Instrumenting whatever is currently measurable and declaring that the composition or the driver.
- Confusing instrument response with physical process.

---

## Success Criteria

- Identification of at least one residual that cannot be absorbed by current mechanisms and that correlates with a previously untested physical variable (or is demonstrably flat, requiring a new mechanism).
- Demonstration that a structure-first baseline improves skill on 10-day and longer horizons relative to pure short-term models (example metric: reduction in multi-week RMSE when the scaling baseline is supplied as a prior versus pure GraphCast-style baselines).
- Transfer of at least one dimensionless group from laboratory scale to a planetary observation with quantified limits of validity.
- A clear experimental or mission recommendation that directly targets an unexplained residual.

---

*This document is a starting point for continuation. It should be refined as residuals are computed, scaling limits are quantified, and new measurements become available. Both human researchers and AI agents are expected to operate under the methodological constraints above.*
