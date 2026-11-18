# Mars lander surface meteorology: reduced time series (provenance)

Produced 2026-11-18. Data acquisition and reduction only, with no scaling analysis.
Scripts are in `../scripts/` (`reduce_viking.py`, `parse_labels.py`, `reduce_insight.py`, `finalize_insight.py`).

Every main CSV has the columns `dataset,sol,ls,pressure_pa,air_temp_k`.
- `sol` is the lander sol number plus the fraction of the sol at the **bin centre**.
- `ls` is the areocentric solar longitude in degrees.
- An empty field means no valid data for that variable in that bin.
- Bins with no data for either variable are left out.

| File | dataset values | Bin | Rows | Sol coverage |
|---|---|---|---|---|
| `insight_hourly.csv` | `insight` | 1/24 sol (LMST) | 18,790 (P: 18,713; T: 15,963; both: 15,886) | P: sols 4–1219; T: sols 4–1333 |
| `viking_vl_p_hourly.csv` | `viking1_vl_p`, `viking2_vl_p` | 1/24 sol | VL1: 35,179; VL2: 18,680 (pressure only) | VL1: 0–2245 (1,635 sols with data); VL2: 0–1204 (1,025 sols) |
| `viking_tbin25.csv` | `viking1_tbin25`, `viking2_tbin25` | native 1/25 sol | VL1: 826; VL2: 22,549 | VL1: 1–45; VL2: 1–1050 |
| `viking_vl1_mbin25.csv` | `viking1_mbin25` | native 1/25 sol | 8,325 | VL1: 1–350 (no data for 117–133) |

Sidecars:
- `insight_hourly_detail.csv` gives per-bin row counts, per-boom temperature means and the sampling mode.
- `viking_vl_p_hourly_counts.csv` gives the number of raw samples per bin.
- `viking_tbin25_detail.csv` gives PRESS_TOT, flags, TAMB_NLI_DEV and TREF_NLI_MN.
- `insight_products_index.json` lists every InSight product used, with its LID, version, size, md5, record count, sol and start/stop LMST and Ls.

---

## 1. InSight APSS (PS pressure and TWINS air temperature)

### Sources
- Pressure: `https://atmos.nmsu.edu/PDS/data/PDS4/InSight/ps_bundle/data_calibrated/sol_XXXX_YYYY/ps_calib_SSSS_VV.csv`.
  - Collection `urn:nasa:pds:insight_ps:data_calibrated`, product LIDs `urn:nasa:pds:insight_ps:data_calibrated:ps_calib_SSSS`.
  - 932 continuous products covering sols 4–1219. Versions: 746 at v1.0 and 186 at v2.0.
  - The `ps_calibevent_*` products (event bursts) were not used.
- Temperature: `https://atmos.nmsu.edu/PDS/data/PDS4/InSight/twins_bundle/data_derived/sol_XXXX_YYYY/twins_model_SSSS_VV.csv`. This is "APSS TWINS Modeled Data", processing level Derived.
  - Collection `urn:nasa:pds:insight_twins:data_derived`.
  - 747 continuous products covering sols 4–1333. Versions: 352 at v1.0, 259 at v2.0 and 136 at v3.0. The label history gives v2.0 as "Updated Air Temperature Sensor computational model" and v3.0 as "Spurious data removed".
  - The `twins_modelevent_*` products were not used. Per the release notes, the continuous derived products already include gaps that were recovered from event data.
- File lists come from the HTTP directory listings and are saved in `../manifest.txt`. All 1,679 PDS4 labels (`.xml`) were downloaded and parsed (`../raw/labels/`).
- Documents read:
  - `twins_bundle/document/release_notes.txt` (release 16, 2023-07-01)
  - `twins_bundle/document/twinsps_dp_sis_issue10.pdf` (CAB-TWINS-SPC-0008, issue 10)
  - `ps_bundle/document/pressure_processing.pdf`

### Columns used (names from the PDS4 labels)
- `LMST` (Local Mean Solar Time, format `SSSSSMhh:mm:ss.sss`). This gives the sol and the fraction of the sol, which sets the bin: bin = floor(24 × LMST fraction).
- PS: `PRESSURE`. The label unit is pascal and the label description is "Pressure". It is calibrated from DN using pressure-sensor temperature (`PRESSURE_TEMP`), as described in pressure_processing.pdf. Values are rounded to 1e-4 Pa because finer precision is noise. No calibrated pressure is produced where the pressure-temperature gaps exceed 16 min.
- TWINS: `BMY_AIR_TEMP` and `BPY_AIR_TEMP` (kelvin), which are the local air temperature at boom −Y and boom +Y. Each comes with `*_AIR_TEMP_OPERATIONAL_FLAGS`, a 4-character flag string with these bits:
  - bit 0: ASIC temperature in range
  - bit 1: direct measurement (rather than proxy)
  - bit 2: not affected by the lander thermal plume
  - bit 3: accuracy < 6 °C (this is only possible with 1 Hz data)
- `ls`: neither CSV contains Ls. It is linearly interpolated in time between the labels' `insight:start_solar_longitude` and `stop_solar_longitude`, which are anchored at `start_/stop_local_mean_solar_time`. All PS and TWINS labels were used, and the 360→0 wrap was handled.

### Quality flags and filters applied
- Pressure: rows with an empty `PRESSURE` were skipped. A sanity range of 100–1500 Pa was applied, and it removed nothing visible: the output range is 594–811 Pa. No other quality flag exists in ps_calib.
- Temperature: for each row, each boom value is accepted if it is non-empty, has flag bit 0 (ASIC in range) = 1, and lies in the range 100–350 K. The row value is the mean of the accepted booms, and the bin value is the mean of the row values.
  - The plume and accuracy bits were **not** used as filters. In the 0.1 Hz derived data they are 0 essentially everywhere (for example, every row of sol 124 is `1000`), so filtering on them would remove nearly all data.
  - The two booms disagree, with a median |BMY−BPY| of 2.3 K per bin, a 95th percentile of 16.6 K and a maximum of 25 K, mostly in daytime. This is lander thermal-plume and boom-orientation contamination. Per-boom bin means are in the detail file if one wants to use a single boom or the larger/smaller value.

### Reduction: byte-range systematic subsampling (important)
The full archive is too large for the ~3 GB budget: PS continuous is 58.9 GB (up to ~60 MB/sol at 20 Hz) and TWINS derived is 6.2 GB. Each CSV was therefore streamed as evenly spaced HTTP byte ranges (multipart range requests) and reduced in memory, so no raw CSV was stored.
- PS: 576 chunks of 2,400 bytes per file (~24 chunks per Mars hour, ≈1.38 MB per sol).
- TWINS: 384 chunks of 3,000 bytes per file (≈1.15 MB per sol).
- Files smaller than that budget were read whole: 6 PS files and 21 TWINS files.
- The partial first and last line of each chunk was discarded. Every complete row was time-tagged by its own LMST, so assigning rows to bins is exact.
- A bin value is the mean of all rows that fell in that bin within the fetched chunks. This is a systematic sub-sample of the raw samples, not every raw sample.
- Validation on sol 124 against the full files gave these differences between subsampled and full bin means:
  - pressure: RMS 0.07 Pa, max 0.21 Pa
  - temperature: RMS 0.07 K, max 0.20 K
  These are well below the hour-to-hour variability, but they add a small white-noise floor to Haar fluctuations at the 1-bin scale.
- Because the chunks are spaced evenly in bytes, an hour with a low sample rate gets fewer chunks. `n_pressure_rows` and `n_temp_rows` in the detail file show the support for each bin.
- Total transferred was ≈2.21 GB, including multipart overhead.

### Coverage and gaps
- Pressure: 18,713 bins over 932 sols with data, from sol 4 to 1219.
  - 677 sols have all 24 bins and 167 sols have fewer than 12. The last sol with at least 20 bins is 1098.
  - Gaps of more than 3 sols: 5–10, 10–14, 108–112, 269–284 (solar conjunction), 567–577, 612–633, 720–724, 730–735, 789–793, 794–802, 871–875, 889–893, 946–950, 977–981, 987–996, 1005–1052, 1068–1074, 1077–1081, 1087–1095, 1099–1137, 1143–1148, 1154–1161, 1162–1166, 1174–1185, 1186–1192 and 1200–1212.
- Temperature: 15,963 bins over 747 sols with data, from sol 4 to 1333.
  - 607 sols have all 24 bins.
  - From about sol 708 onward there are long gaps: 708–735, 741–754, 761–793, 794–843, 915–965 and 965–1056, among others. After sol 1219 the only data is sol 1333 (a diagnostic power-on).
- Release notes, Section B:
  - Cadence was reduced from about sol 567 because of power. TWINS was powered only a few hours on selected sols from about sol 708, and pressure from about sol 789. The cadence was chosen to cover the diurnal cycle over several sols.
  - The last nominal sol for both sensors is 1219.
  - In the derived TWINS data, some gaps in sols 233–702 were filled from event data, and in some of those the pressure input to the TWINS calibration was estimated. On sols 754–756 and 1333, the TWINS calibration used pressure estimated from the same Ls one year earlier.
- After about sol 700, many sols are partial-day. Diurnal-cycle sampling is then non-uniform, which matters for any deseasonalisation or diurnal removal.

---

## 2. Viking Landers 1 and 2 (PDS3 volume VL_1001, PDS4 bundle `urn:nasa:pds:vl_met`)

### Sources
Base URL: `https://atmos.nmsu.edu/PDS/data/vl_1001/`. The files used were:
- `data/vl_p.dat`, `.lbl` and `.xml`: LID `urn:nasa:pds:vl_met:data:vl_p` v1.0, DATA_SET_ID `VL1/VL2-M-MET-3-P-V1.0`, producer J. E. Tillman (UW), 150,551 rows, md5 2f2cd56ae2712a165da37c7ea8ce0661.
- `data/vl_tbin.dat`, `.lbl` and `.xml`: LID `urn:nasa:pds:vl_met:data:vl_tbin` v1.0, DATA_SET_ID `VL1/VL2-M-MET-4-BINNED-P-T-V-V1.0`, 25,750 rows, md5 e8cc5fecd42b39bee975a7a86555b452.
- `data/vl_mbin.dat`, `.lbl` and `.xml`: LID `urn:nasa:pds:vl_met:data:vl_mbin` v1.0, DATA_SET_ID `VL1-M-MET-4-BINNED-P-T-V-CORR-V1.0`, 8,325 rows, md5 b71059348fa3f51d8d4eaa1fad5542ca.
- `catalog/vl_p.cat`, `vl_tbin.cat` and `vl_mbin.cat` (data set descriptions and confidence notes), plus `aareadme.txt` and `errata.txt`.

The files are fixed-width ASCII and were parsed using the label START_BYTE/FORMAT. Raw files are kept in `../raw/vl/` (≈10 MB).

### 2a. `viking_vl_p_hourly.csv`: point pressures binned to 1/24 sol
- Columns used: `SC_ID`, `SOL_LON` (Ls of the local time), `MARTIAN_DAY` (sol, 0 = touchdown), `LOCAL_HOUR`, `LOCAL_MINUTE`, `LOCAL_SECOND`, `PRESSURE` (millibars, converted ×100 to Pa).
- The label states that local time is in **Earth** hours, minutes and seconds, starting at local midnight, with a sol of 24 h 39 m 35.25 s. The data does run to 24:39:3x. The sol fraction is therefore (h·3600 + m·60 + s) / 88775.25 s, and bin = floor(24 × fraction).
- The label does not say whether this is local mean or true solar time. It is lander local time as archived.
- `ls` is the circular mean of SOL_LON over the samples in the bin. The bin value is the mean of all raw samples in the bin, with counts in `_counts.csv`.
- Calibration (vl_p.cat):
  - Transducers were calibrated to 0.01–0.02 mb, with stability better than 0.04 mb (possibly ~0.01 mb) over the mission.
  - The DN 140 calibration point was missing, giving a max error of 0.0425 mb on VL1 and 0.008 mb on VL2. Corrections have been applied.
  - Single samples are **quantized at 0.088 mb (8.8 Pa)**, so bin means of a few samples carry quantization noise of several Pa.
  - Sampling was variable, from 1 s up to 65 min (VL1) and 105 min (VL2).
- Coverage:
  - VL1: 35,179 bins over 1,635 sols in the range 0–2245. 1,353 sols have at least 20 bins. Gaps of more than 10 sols: 117–131, 870–888, 901–913, 923–968, 971–1008, 1045–1061, 1075–1127, 1341–1357, 1445–1460, 1468–1482, 1497–1519, 1526–1542, 1660–1690, 1778–1808, 1815–1838, 1859–1875, 1919–1933 and 2215–2229.
  - VL2: 18,680 bins over 1,025 sols in the range 0–1204. 523 sols have at least 20 bins; later in the mission ~12–15 bins/sol is typical because of the ~105 min sampling. Gaps of more than 10 sols: 560–626 and 1050–1143.
- No temperature is available as point data on this volume.
- Cross-check of daily means (sols with ≥20 bins):
  - VL_P − TBIN for VL2: mean +0.02 Pa, SD 0.35 Pa (n = 503)
  - VL_P − MBIN for VL1: mean −0.15 Pa, SD 0.56 Pa (n = 229)

### 2b. `viking_tbin25.csv`: binned and splined, 25 bins per sol (VL1 sols 1–45, VL2 sols 1–1050)
- Columns used:
  - `LOCAL_HR_BIN`: the data contain 1..25. The catalog says bins start at local midnight, each 1/25 sol, so sol = MARTIAN_DAY + (bin − 0.5)/25.
  - `SOL_LON`: Ls at the beginning of the bin.
  - `PRESS_MEAN` (mean recalibrated pressure, mb, F6.2, so a 1 Pa output resolution), `PRESS_TOT` and `PRESS_FLAG`.
  - `TAMB_NLI_MN`: mean ambient temperature in K for samples with no lander interference.
  - `T_NLI_FLAG`.
- Flags, from the label: M = missing, n = no data, I = lander interference only, S = splined, $ = splined because of lander interference. Blank means good.
- Filters applied:
  - Pressure is kept only if PRESS_FLAG is blank, PRESS_TOT > 0 and the value is > 0.
  - Temperature is kept only if T_NLI_FLAG is blank and the value is > 0.
  - Splined (S, $), interference (I) and missing (M, n) bins are excluded.
  - A row is written if either variable survives, and 2,375 rows were dropped entirely.
- Resulting counts: VL1 has 637 P and 770 T values; VL2 has 17,748 P and 21,152 T values.
- These are **native 1/25-sol bins**. They were not re-binned to 1/24, because their raw samples are not on this volume.
- Calibration (vl_tbin.cat):
  - The ambient temperature sensor is three parallel thermocouples, accurate to about 1.5 °C.
  - **VL2 sensor problem:** a temperature-dependent error, which grows as the lander body cools and decays 30–40 min after power-up. It was corrected using the reference sensors, which required continuous power from VL2 sol 25 onward. VL2 accuracy is therefore about 3 °C (Hess et al. 1977). Treat VL2 sols 1–24 temperatures with extra caution.
  - The reference temperature (platinum resistance thermometer) has a residual error under 4 °C after correction. It is in the detail file only.
  - The TBIN catalog lists the only major VL2 gap as sols 561–625.
  - VL1 data stop at sol 45 because of the wind quadrant-sensor failure.

### 2c. `viking_vl1_mbin25.csv`: VL1 sols 1–350, 25 bins per sol, splined
- Columns used: `MARTIAN_DAY`, `LOCAL_HR_BIN`, `SOL_LON`, `PRESS_MEAN` (mb ×100 → Pa) and `TEMP_MEAN` (K).
- This product has **no flags**: the values are "binned and splined", so interpolated bins cannot be told apart from measured ones. There is no data for sols 117–133.
- Its catalog notes that the effects of lander interference are not included, and points to Murphy (1986) for the post-sol-45 recovery.
- All 8,325 rows have positive values.

---

## Caveats for the scaling analysis
1. **Different sampling grids.** InSight and Viking VL_P use 1/24 sol, while Viking TBIN and MBIN use 1/25 sol. Do not concatenate them without accounting for this. Bin-centre times are given throughout.
2. **Irregular support.** Some bins rest on 1 to 4 samples, especially for Viking VL_P late in the mission and for VL2. Use the count sidecars if you weight or threshold.
3. **Measurement noise floors:**
   - InSight subsampling adds ~0.07 Pa or K RMS.
   - Viking single-sample pressure quantization is 8.8 Pa.
   - Viking TBIN pressure output resolution is 1 Pa.
   - InSight TWINS has a lander-plume bias. There is up to ~25 K disagreement between booms in daytime, and no usable plume flag at 0.1 Hz.
4. **Spline contamination.** VL1 MBIN is fully splined and unflagged. TBIN splined bins were excluded.
5. **Late-mission duty cycling** (InSight after about sol 567–789) gives non-uniform diurnal coverage. This aliases into fluctuations if you deseasonalise by diurnal mean.
6. **Ls** for InSight is interpolated from per-product label endpoints (accurate to well under 0.1°). For Viking it comes from the archived SOL_LON.
