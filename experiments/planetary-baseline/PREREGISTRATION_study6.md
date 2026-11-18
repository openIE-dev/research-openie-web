# Study 6, rung 0 preregistration: does the annulus regime boundary place the planets?

Fixed before `ladder.py` was run. Rung 0 uses no laboratory run: it asks whether the regime boundary that rotating-annulus experiments find in the thermal Rossby number sorts four planetary atmospheres into the regimes they are observed to have. It is a replication of a known placement and a calibration of the procedure, not a discovery.

## Groups

- Thermal Rossby number Ro_T = R_gas DeltaT_h / (Omega a)^2, with R_gas the specific gas constant, DeltaT_h the equator-to-pole temperature difference, Omega the rotation rate and a the planetary radius.
- Burger-type ratio L_D / a = N H / (f a), with N the buoyancy frequency, H the scale height and f the Coriolis parameter at 45 degrees.

Inputs are ranges, not point values (`ladder.py`), sampled uniformly 10,000 times per body; the 5th to 95th percentile of each group is reported.

## Observed regimes (from the literature, not measured here)

- Earth: mid-latitude baroclinic eddies, irregular.
- Mars: baroclinic waves in the winter hemisphere, more regular and of lower wavenumber than Earth's.
- Venus: planet-wide overturning (Hadley) circulation with atmospheric superrotation.
- Titan: wide Hadley circulation with stratospheric superrotation.

## Hypothesis

- **H14.** Classify a body as "baroclinic eddies" when the 95th percentile of Ro_T is below 1 and as "axisymmetric (Hadley-dominated)" when the 5th percentile is above 1; otherwise unclassified. Supported if all four bodies are classified and all four match their observed regimes; refuted if any classified body is misclassified.
- **Reported, no rule:** whether, among the eddy bodies, the higher Ro_T goes with the more regular waves, as it does in the annulus.
