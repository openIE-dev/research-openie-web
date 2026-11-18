# Mars lander column optical depth (tau), per sol: provenance

Produced 2026-11-18. This covers data acquisition and reduction only. It contains no analysis of pressure against dust.
- Script: `../dust_scripts/reduce_dust.py`, run as `python3 -I reduce_dust.py <dust_downloads> <repo>/experiments/planetary-baseline/data/mars <mars_dust>`.
- Alignment test: `../dust_scripts/ls_shift_check.py`.
- Raw downloads (2.3 MB) are in `../dust_downloads/{viking,insight_pds}/`.
- The machine-readable summary of the run is in `reduce_report.txt`.

All three landers have a **lander-measured**, machine-readable optical depth product in the PDS. Nothing was digitized from figures. The Montabone gridded climatology was **not** used, because it was not needed.

## Output files

The main files have the columns `lander,sol,ls,tau,tau_source,notes`. There is one row per sol that has a value, and sols without a value are left out.
- `sol` is the integer lander sol, using the same numbering as the pressure CSVs: Viking `MARTIAN_DAY` (sol 0 = touchdown), and InSight LMST sol.
- `ls` is the circular mean Ls of the observations used on that sol, in degrees.
- `tau` is the plain mean of the observations used on that sol.
- `notes` gives the number of observations, their local times, the spread, the mean uncertainty, and any exclusions.

| File | Rows (sols) | Sol span | Observations |
|---|---|---|---|
| `dust_viking1.csv` | 286 | 6–920 | 504 flag-0 of 592 |
| `dust_viking2.csv` | 234 | 6–872 | 400 flag-0 of 452 |
| `dust_insight.csv` | 682 (630 within sols 4–1219) | 4–1436 | 758 |

Per-observation sidecars keep **every** archived measurement, including flagged ones. Each gives the fractional sol on the pressure-file convention, Ls, tau, flag or camera, uncertainty, and the Ls difference against the pressure file:
- `dust_viking1_obs.csv`
- `dust_viking2_obs.csv`
- `dust_insight_obs.csv`

---

## 1. Viking Landers 1 and 2: Colburn, Pollack and Haberle (1989) lander-camera optical depths

### Source
- URL: `https://atmos.nmsu.edu/PDS/data/vl_1001/data/vl_opac.dat`, together with `.lbl` (PDS3) and `.xml` (PDS4). This is the same volume as our VL_P pressure.
- Catalog: `https://atmos.nmsu.edu/PDS/data/vl_1001/catalog/vl_opac.cat`, plus `refs.cat`, `aareadme.txt` and `errata.txt` (errata has nothing on OPAC).
- Product: PDS4 LID `urn:nasa:pds:vl_met:data:vl_opac`, version 1.0. PDS3 DATA_SET_ID `VL1/VL2-M-LCS-5-ATMOS-OPTICAL-DEPTH-V1.0`.
- Producer: D. S. Colburn (Ames). Release date 1989-11-01. PANDA extract dated 1995-02-13.
- File: 1,044 records, md5 `cac3f6c964170c4f12c409fc61385ad7`.
- Reference: Colburn, D.S., Pollack, J.B. and Haberle, R.M., 1989, "Diurnal variations in optical depth at Mars", Icarus 79, 159–189. Also Pollack et al. 1977 (JGR 82, 4479) and Pollack et al. 1979 (JGR 84, 2929).

### What tau means
- It is **total normal (vertical) column atmospheric optical depth** from Sun-diode images, using direct-Sun extinction.
- Wavelength: **0.67 µm** (visible/red).
- It includes **all aerosol**: dust and also water-ice haze and fog. The catalog notes that ice contributions were studied separately. Viking morning values in particular can include fog or haze.
- It is **not** normalized to a reference pressure. It is the column above each lander: VL1 at ~7–9 mb and VL2 at ~7.5–10.5 mb, varying seasonally.
- It is **not** an infrared absorption optical depth. A visible-to-9.3 µm-absorption ratio of ~2.6 is commonly assumed when comparing against TES or Montabone values, but no such ratio is applied here.
- The catalog gives errors of ~0.02–0.03. The ERR_TOTAL column is typically 0.03–0.15.

### Fields used
These were parsed by fixed byte positions from the label:
- `SC_ID`
- `CAMERA_ID`
- `MARTIAN_DAY` (sol, 0 = touchdown, the same definition as the VL_P label)
- `LOCAL_HOUR` and `LOCAL_MINUTE` (Earth hours and minutes from local midnight, the same convention as VL_P)
- `OPACITY`
- `OPACITY_FLAG`
- `EARTH_DAY`
- `SOL_LON` (Ls)
- `ERR_*`

`VIKING_YEAR` (1 or 2) is not a reset of the sol count: `MARTIAN_DAY` runs continuously.

### Filtering and reduction
- **OPACITY_FLAG**: the archive describes it only as "opacity limitation flag, identifying upper and lower bound estimates". It does **not** say which value is which.
  - Counts: VL1 has flag 0 = 504, flag 1 = 75, flag 2 = 13. VL2 has flag 0 = 400, flag 1 = 17, flag 2 = 35.
  - Flag-1 values are high (VL1 mean 2.29, up to 3.93) and carry large ERR_DIGITIZE. That suggests a faint, digitization-limited Sun, which would make them probably *lower* bounds. This is an inference, not documented.
  - Flag-2 values are moderate (0.26–1.09).
  - Main files use **flag 0 only**. Flagged values on a sol that also has flag-0 data are listed in `notes` as `excluded_flagged=`.
- **Sols with only flagged data are omitted from the main files**: 42 VL1 sols and 16 VL2 sols, all listed in `reduce_report.txt` and present in the `_obs` sidecars.
  - **Important:** this removes almost all of VL1 sols 314–352, the peak of the second (1977b) global dust storm, where the archive has only flag-1 values of 2.0–3.9. It also removes VL1 sol 210 (1977a storm, 2.5–3.1).
  - The VL1 flag-0 series still reaches 3.71 during the 1977a storm.
  - If storm peaks matter, use the sidecar with explicit treatment of the bounds.
- Daily tau is the mean of the flag-0 values on that sol, at whatever local times they were taken.
  - Times range from ~05:30 to ~19:00 and are often a mix of morning and evening.
  - Colburn et al. report real diurnal variation, especially morning fog or haze, so a daily mean mixes local times. The times are in `notes`.

### Sol/Ls alignment check
For each observation, the fractional sol was computed as `MARTIAN_DAY + (h·3600 + m·60)/88775.25 s`. This is the same convention as `viking_vl_p_hourly.csv`. The opacity `SOL_LON` was then compared with the pressure-file `ls` interpolated at that sol, using bins within ±0.5 sol.

| Lander | n | Mean diff | Median abs diff | Max abs diff |
|---|---|---|---|---|
| VL1 | 592 | −0.04° | 0.11° | 0.42° |
| VL2 | 401 | −0.09° | 0.11° | 0.42° |

- Shifting the opacity sols by ±1 raises the median abs diff to 0.47–0.62°, which is about 1 sol of Ls. So **the sol numbering is the same**, with no offset.
- The residual of ~0.1° (~0.2 sol) is consistent with the different Ls algorithms and timestamps used by the two products.

### Coverage and gaps
- **VL1**: 286 sols, from sol 6 to 920. There are **no data after sol 920**, while the VL1 pressure runs to sol 2245.
  - All 286 sols have pressure data. The pressure file has 841 sols inside 6–920, so tau exists on ~34% of them.
  - Median spacing is 1 sol, but sampling is very clustered.
  - Gaps longer than 10 sols: 13–28, 29–41, 41–101, 101–115, 115–155, 155–169, 185–207, 211–222, 222–239, 313–350 (storm, flag-only), 627–639, 752–764 and 838–920.
  - tau ranges from 0.36 to 3.71, with a median of 0.90.
- **VL2**: 234 sols, from sol 6 to 872. There are no data after sol 872, while the pressure runs to sol 1204.
  - 204 of these sols have pressure data. The other 30 fall in pressure gaps, mainly the VL2 pressure gap at sols 560–626.
  - Gaps longer than 10 sols: 55–73, 73–88, 88–111, 120–132, 132–145, 146–159, 160–173, 221–233, 233–245, 245–257, 257–329, 329–377, 653–665, 708–720 and 727–739.
  - Early VL2 coverage is roughly every 12–13 sols.
  - tau ranges from 0.18 to 2.30, with a median of 0.58.
- The series are sparse and irregular at 10–100 sol scales. Any band-pass or Haar analysis needs a method that tolerates gaps.

### Other Viking sources checked
- `vl_1002` (the Viking footpad temperature volume) has no opacity data.
- No later machine-readable re-analysis of Viking opacity was found in the PDS Atmospheres listing.
- The Montabone climatology does not cover Mars Years 12–15.

---

## 2. InSight: ICC/IDC sky-imaging optical depths (Lemmon et al.)

### Source
- Bundle URL: `https://atmos.nmsu.edu/PDS/review/PDS4/insight_tau_bundle/`. The landing page is `https://atmos.nmsu.edu/data_and_services/atmospheres_data/INSIGHT/insight_opacity.html`.
- Data: `data/nsyt_tau.csv` and `nsyt_tau.xml`.
  - LID `urn:nasa:pds:insight_cameras_tau:data_derived:nsyt_tau`, version 1.0. Bundle `urn:nasa:pds:insight_cameras_tau` v1.0. Collection `...:data_derived` v1.0.
  - 758 records, md5 `d767af6c8a1654faa69e325dcc7bf762`.
- Documents: `document/nsyt_tau_sis.pdf` (NYST-TAU-0001, issue 1, 2024-05-22) and `document/Lemmon_et_al_Insight_tau.pdf`. The second is the manuscript "Results from the InSight atmospheric imaging campaign" by Lemmon, Campbell, Wolfe, Viúdez-Moreiras, Lorenz, Maki, Moores, Spiga and Banfield, which the landing page indicates was published in Icarus in 2024.
- Method paper: Wolfe and Lemmon 2023, PSS, doi:10.1016/j.pss.2023.105741.
- Bundle citation DOI: **10.17189/dc8r-ag55** (Sackett 2024).
- **Caveats on archive status:**
  - The bundle sits under the PDS `/review/` path, not under `/PDS/data/PDS4/InSight/`.
  - The DOI returned HTTP 404 at doi.org on 2026-11-18.
  - Treat the bundle as PDS-hosted but possibly not yet formally released.
- Mirror: Lemmon, "InSight Mars lander optical depths", Mendeley Data v1, doi:10.17632/7fn53rjdpc.1, file `insight_tau.csv`. It was **not retrieved**: the site returned HTTP 500 and access was then blocked. It was therefore not cross-checked.

### What tau means
- It is **total aerosol column optical depth (dust plus water ice) at ~600 nm**, from the red channel.
- It was retrieved from the **sky-radiance gradient with elevation** at a near-constant scattering angle of ~80–100°, in ICC/IDC images with the Sun ~25° high. It is **not** a direct-Sun extinction measurement like the Viking values.
- It uses a fixed Tomasko et al. (1999) phase function and a single-scattering albedo of 0.965.
- Representative uncertainty: `Sigma` is the 0.08 floor combined in quadrature with `Fit_sigma`.
- It is not normalized to a reference pressure, and it is not an IR absorption quantity.
- Lemmon et al. note that around the aphelion cloud belt (Ls ~40–140°), roughly half the optical depth can be ice. So **tau is not pure dust**.

### Fields used
- `PID`: image product ID. Prefix `c` = ICC, `d` = IDC. Characters 6–9 are the sol.
- `Sol`: label text "Decimal sols in true solar time".
- `LMST`: hours.
- `L_s`
- `Tau`
- `Sigma`
- `Fit_sigma`

### Sol convention and reduction
- The integer sol used is the sol in the image PID. It equals `floor(Sol)` for all 758 rows, with 0 mismatches. The fraction of `Sol` is LTST, and LTST − LMST ranges from −0.85 to +0.68 h, which is the equation of time.
- All images are daytime (~7–18 LMST), so the LTST sol and the LMST sol never differ. The fractional sol in the sidecar is `sol + LMST/24`, which is the pressure-file convention.
- Daily tau is the mean of all values on the sol, from both cameras and both AM and PM. `notes` gives the AM/PM counts, cameras, LMST times and mean sigma.
- No values were excluded.
- The archive contains 2 ICC values before sol 50 (sols 42 and 48), although the paper text says pre-sol-50 ICC data were discarded because of lens debris. Those two rows carry a `CAUTION` note.
- Morning measurements are rare after sol 612. Late-mission sols are therefore mostly PM-only (~15:30–17:20 LMST).

### Sol/Ls alignment check
For each observation, the archive `L_s` was compared with the pressure-file `ls` interpolated at `sol + LMST/24`. Over n = 527 matches, the mean difference is +0.0002°, the median absolute difference is 0.002° and the maximum is 0.006°. A ±1 sol shift gives a median of ~0.51°. The alignment is exact.

### Coverage and gaps
- 682 sols in the range 4–1436, of which 630 fall within the pressure range 4–1219.
- 517 of those sols also have pressure data.
- Median spacing is 2 sols. Rows per 100 sols, in order from sols 0–99 to 1400–1499: 33, 62, 54, 68, 60, 55, 50, 49, 56, 48, 41, 44, 36, 20 and 6.
- Gaps longer than 10 sols: 14–26, 26–38, 1016–1028, **1105–1129** (safe mode during the MY36 Ls ~150° dust storm, so the storm peak is missing) and 1409–1421.
- tau ranges from 0.48 to 1.83, with a median of 0.72.

### Fallback not used
- The Montabone et al. gridded column dust optical depth was not used. Those maps are given as 9.3 µm absorption, normalized to 610 Pa, for MY24 onward, from the LMD MCD site.
- If wanted as an independent dust-only comparison at 4.5°N 135.6°E, note that its normalization and wavelength differ from the lander values above. It must not be mixed into the same column.

---

## Cross-lander caveats
1. **Different quantities.**
   - Viking: direct-Sun extinction at 0.67 µm.
   - InSight: sky-gradient retrieval at ~0.60 µm.
   - Both are total aerosol (dust plus ice) and both are un-normalized column values. They are comparable in kind but come from different methods, and neither is "dust only".
2. **Local-time mixing.** Daily means combine whatever local times were sampled. Diurnal variation, including ice and fog in the morning, can alias into sol-to-sol variation. The per-observation sidecars allow re-reduction, for example PM-only.
3. **Sparse and irregular sampling.** This is especially true for Viking. There is no Viking tau beyond VL1 sol 920 or VL2 sol 872.
4. **Bounded or flagged Viking values** were excluded from the main files. This censors the VL1 1977b storm peak.
