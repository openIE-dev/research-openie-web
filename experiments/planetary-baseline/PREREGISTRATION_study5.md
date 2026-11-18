# Study 5 preregistration: the Mercury sodium residual

Fixed and committed before `mercury.py` was run on the real passes. Before the commit it was run only with `--selftest`. The reduced file was opened only to count passes per band and per Mercury year.

## Data

MESSENGER MASCS/UVVS sodium (Na D1 + D2) limb brightness in kilorayleighs, PDS volume MESSMAS_2101, dataset MESS-E/V/H-MASCS-4-UVVS-DDR-V1.0, all orbital data 2011-03-29 to 2015-04-30 (provenance in `data/mercury/`). `mercury_reduce.py` keeps spectra with tangent local time 6 to 18 h, tangent point sunlit, line of sight on the limb, and none of the three archive-derived flags (grating anomaly, slit touching the surface, geometry mismatch). It averages them into passes: one Mercury year, orbit, altitude band and local-time hour. Bands: 0-250, 250-500, 500-1000 and 1000-2000 km.

## Skeleton: what repeats every Mercury year

Every process the handoff lists as known (photon-stimulated and thermal desorption, sputtering, micrometeoroid vaporization, radiation pressure and photoionization) depends, for a fixed local time and altitude, on Mercury's distance from the Sun, its radial velocity and the solar input. All of those are functions of true anomaly angle (TAA). The skeleton is therefore the climatology: the count-weighted mean brightness in the cell (TAA 10 degrees, local-time hour, band), computed from the **other** Mercury years only. A pass enters if its cell has at least 3 passes from at least 2 other Mercury years and the skeleton is at least 1 kR. Residual R = brightness / skeleton - 1.

## Why longitude, and which longitude

Mercury rotates three times in two orbits, so at the same TAA and local time, consecutive Mercury years put longitudes 180 degrees apart under the instrument. **Self-test finding, before any real-data run:** the hot-pole and cold-pole pattern, cos(2 x longitude), is the same at two longitudes 180 degrees apart. At fixed TAA and local time it therefore does not alternate between years, and a TAA-by-local-time climatology absorbs it completely: an injected 15% cold-pole enhancement was returned as zero. This design cannot test the cold-pole enhancement modelled by Verkercke et al. (2025); that needs a skeleton built from physical source terms, not a climatology. The correlation of R with cos(2 x longitude) is reported, but carries no decision.

What does alternate between years is the first longitude harmonic, longitude 0 against 180 degrees. A source tied to particular terrain, such as surface composition or a regional reservoir, would appear there. In the self-test an injected 15% first-harmonic signal was recovered at 15 to 17% in every band, and no signal was found when none was injected.

## Hypotheses

Bootstrap: moving blocks of 500 consecutive passes (in time order) within a band, 2000 resamples, seed 20261118.

- **H18, a terrain-locked source.** R is regressed on cos(longitude) and sin(longitude) in each band. Supported if, in at least 2 of the 3 bands below 1000 km, the 98.75% bootstrap interval of at least one of the two coefficients excludes 0 (98.75% so that the two coefficients share a 2.5% error budget). Refuted otherwise.
- **H19, latitude structure after longitude.** After removing the fitted first-harmonic term, the remainder correlates with |tangent latitude| with a 95% interval excluding 0 in at least 2 of the 3 bands. Refuted otherwise. High latitudes are where the magnetospheric cusps deliver ions to the surface; the sample is mostly southern and equatorial.

## Reported without a decision rule

- Skeleton skill per band: 1 - var(brightness - skeleton) / var(brightness - band mean).
- The 1000-2000 km band: the archive documents an uncorrected dayside background of unknown origin for Na. Any floor there is reported, not interpreted.
- Nightside: no tangent-point measurement exists. Nightside lines of sight with a shadowed tangent point still pass through sunlit gas (median lowest sunlit altitude about 2,100 km). Nightside composition is therefore not inferred.
