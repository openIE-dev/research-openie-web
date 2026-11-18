# MESSENGER MASCS/UVVS exospheric sodium: provenance of `uvvs_na.csv`

Acquisition and reduction only. No source/loss or Chamberlain fitting was done here.
Built 2026-11-18.

## 1. Source

| Item | Value |
|---|---|
| Archive | PDS Planetary Atmospheres Node (NMSU), volume **MESSMAS_2101** (published 2017-05-12; it supersedes MESSMAS_2001, which is still online) |
| Volume root | https://atmos.nmsu.edu/PDS/data/messmas_2101/ |
| Dataset ID | **MESS-E/V/H-MASCS-4-UVVS-DDR-V1.0** (UVVS Derived Data Records, CODMAC level 4) |
| Products used | **UVVSDNASUM**: orbit-level Na summary atmosphere DDRs. Path pattern `data/ddr/{orb,ob2,ob3,ob4,ob5}/uvvs_summary_atmosphere/na/MM/ud_MM_orbNNNN_YYDDD_summary_na.dat`, 2863 files, PRODUCT_VERSION_ID V1, created 2017-03. Also **UVVSDNALS / UVVSDNALD / UVVSDNANS**: geometry-classified Na DDRs, one file per Mercury year, `data/ddr/<phase>/uvvs_atmosphere/MM/ud_MM_{ls,ld,ns}_na.dat`, 54 files, PRODUCT_VERSION_ID V4. These were used only to tag rows with their LS/LD/NS class and sequence index. |
| Format files | `label/uvvssumd.fmt` (summaries, 908-byte rows, 30 columns), `label/uvvsscid.fmt` (LS/LD/NS, 910-byte rows, 30 columns; it adds OBS_SEQUENCE_INDEX). Binary big-endian IEEE reals and MSB unsigned integers. |
| SIS | `document/uvvs_cdr_ddr_sis.txt`: "MESSENGER MASCS UVVS Calibrated and Derived Data Record Software Interface Specification", **Version 5.7, 2017-04-11** (Izenberg, Ward). Sections 5.2.2.3, 6.3.3 and 6.3.4 define the products and columns. |
| Other documents read | `catalog/uvvs_ddr_ds.cat` (confidence and limitations), `document/uvvs_processing_updates_pds16.txt`, `document/uvvs_cdr2ddr.txt` (Na pipeline pseudocode), `errata.txt` |
| File list and integrity | Every `*_na.dat` under `data/ddr/` listed in `index/md5.tab` (2917 files). Each download was MD5-verified against `md5.tab`, and all 2917 passed. The list with URLs is in `source_manifest_md5.txt`. |
| Volume downloaded | 3.018 GB total, the **full mission with no subsampling**. Each raw file was deleted after its scalar columns were extracted. The intermediate `.npz` files total 483 MB (`mercury_dl/reduced/`). |

The PDS Geosciences node holds only UVVS EDR and CDR for MESSENGER (`mess-e_v_h-mascs-2-uvvs-edr-v1`, `-3-uvvs-cdr-caldata-v1`). The atmosphere DDRs exist only at the Atmospheres node.

### Why the summary DDRs

The SIS (section 5.2.2.3) calls the orbit-level summary files "the most complete set of usable exospheric data on Na, Ca, and Mg." The LS/LD/NS files are subsets of them. The join confirmed this: 1,241,596 of 1,241,597 unique LS/LD/NS spectra are present in the summaries, with identical TOTAL_RADIANCE_KR. Rows with an empty `ddr_class` are summary-only observation types, such as ExoNadir, PolarScan, and FIPS/EPS ride-alongs.

## 2. Pipeline

The scripts are in `scratchpad/mercury_scripts/`.

1. `fetch_reduce.py <workdir> 6` streams each file with curl, verifies its MD5, and parses it with `pdsfmt.py`, which builds the numpy dtype from the PDS `.fmt` START_BYTE, BYTES, DATA_TYPE and ITEMS. It keeps the scalar columns, drops the 25-element WAVELENGTH, RADIANCE_KR and RADIANCE_SNR spectra but records `n_spec_points`, writes an `.npz`, and deletes the raw file.
2. `assemble.py <workdir> <outdir>` dedupes, joins the LS/LD/NS tags, derives geometry, splits limb from non-limb rows, writes the CSVs and `coverage_stats.txt`.
3. `model_table.py` converts `ud_na_mod.tab` to `uvvs_na_model_ddr.csv`.

## 3. Output files (`scratchpad/mercury/`)

| File | Rows | Content |
|---|---|---|
| `uvvs_na.csv` | **1,686,036** | Na spectra whose line of sight (LOS) has a tangent point above the surface (limb). Sorted by UTC. 449 MB. |
| `uvvs_na_nonlimb.csv` | 384,611 | Same columns. `los_geom=disk` (241,006): the LOS hits the planet. `los_geom=away` (143,605): the LOS points away from the planet, so there is no tangent point. Kept for completeness; these are not limb data. |
| `uvvs_na_model_ddr.csv` | 504 | UVVSDNAMOD: the team's TAA × local-time averaged Chamberlain fits (n0, T, scale height), covering 2011-04-04 to 2013-03-17. 380 of the 504 cells hold a fit; -1 means no fit. Local times 6–18 h only (dayside). |
| `coverage_stats.txt` | | Raw output of all counts and checks quoted below |
| `source_manifest_md5.txt`, `fetch_log.tsv` | | MD5 and URL for each file, plus bytes and rows per file |

### Columns of `uvvs_na.csv` and `uvvs_na_nonlimb.csv`

"DDR" means the value is copied unchanged from the PDS column named. "derived" means it was computed in this pipeline.

| Column | Source | Meaning and units |
|---|---|---|
| mercury_year | file name | Mercury-year index 01–18. The SIS defines a year as starting at TAA = 0. Year 1 is partial (from TAA 73°) and year 18 is partial (to about TAA 64°). |
| orbit | DDR ORBIT_NUMBER | MESSENGER orbit number |
| cdr_name | DDR CDR_NAME | Source CDR (one UVVS observation). Use it as the observation ID. |
| obs_type | DDR OBSERVATION_TYPE | Planning observation type, such as UVVSDaysideScan, UVVSExoScan or UVVSLimbOpp |
| ddr_class | join | LS = dayside limb scan, LD = dayside or nightside limb drift, NS = nightside tail sweep (ExoScan). Empty means the row is in the summary DDR only. |
| obs_seq_index | DDR OBS_SEQUENCE_INDEX (LS/LD/NS) | Point index within a profile sequence. It resets to 1 at each new sequence and counts in time order. -1 when the row has no LS/LD/NS match. |
| utc | DDR UTC_TIME | Converted from `YYDOYTHH:MM:SS.ss` to ISO. It is the mid-spectrum time, corrected for instrument latency. |
| met_s | DDR MID_SPECTRUM_TIME | Mission elapsed time in seconds. **It resets on 2013-01-08 (MET partition change)**, so do not sort or difference on it across that date. Use `utc`. |
| taa_deg | DDR PLANET_TRUE_ANOMALY | Mercury true anomaly at mid-spectrum, in degrees |
| r_helio_au | derived | \|PLANET_SUN_VECTOR_TG\| / 1 AU. It agrees with the Keplerian r(TAA) to better than 2e-5 AU. |
| vr_helio_kms | derived | Mercury's heliocentric radial velocity, `sqrt(GM_sun/p)·e·sin(TAA)`, with a = 0.38709893 AU and e = 0.20563069. Positive means moving away from the Sun. It is not in the DDR. A finite-difference d\|r_sun\|/dt check on 52 orbits agrees to within 0.06 km/s. Range ±10.06 km/s. |
| tan_alt_km, tan_alt_min_km, tan_alt_max_km | DDR TARGET_ALTITUDE[3] | Altitude of the slit field-of-view projection: centre, minimum and maximum. The 1° atmospheric slit spans tens to hundreds of km. |
| tan_lat_deg, tan_lon_deg | DDR TARGET_LATITUDE / LONGITUDE | Sub-tangent-point latitude and longitude of the field-of-view centre (body-fixed, degrees) |
| tan_lt_h | DDR TARGET_LOCAL_TIME | Local time of the tangent point, in hours (0 = midnight, 6 = dawn, 12 = noon) |
| tan_sza_deg | derived | Solar zenith angle of the tangent point, computed from the DDR vectors |
| tan_in_shadow | derived | 1 if the tangent point is inside Mercury's geometric shadow cylinder (umbra approximation, no penumbra) |
| min_sunlit_los_alt_km | derived | Lowest altitude of any **sunlit** point on the LOS, from s ≥ 0 out to where the LOS hits the surface, sampled at ±40,000 km about the tangent point. It equals tan_alt for a sunlit tangent point. For shadowed tangents it is where resonant-scattering emission can actually come from. |
| los_geom | derived | limb, disk or away, from the DDR spacecraft vector and boresight |
| sc_alt_km, sc_lat_deg, sc_lon_deg, sc_lt_h | DDR SPACECRAFT_ALTITUDE, SUBSPACECRAFT_*, SPACECRAFT_LOCAL_TIME | Spacecraft geometry |
| subsolar_lat_deg, subsolar_lon_deg | DDR | Sub-solar point |
| slit_pos | DDR SLIT_POS | 1 = atmospheric slit (1° × 0.04°). 0 = surface slit (0.05° × 0.04°), used at low altitude to avoid saturation. |
| n_spec_points | derived | Number of non-zero wavelength samples in the spectrum. A full scan has 21; truncated scans have fewer, for example during the grating anomaly. |
| **na_kR** | DDR TOTAL_RADIANCE_KR | **Na D1 + D2 (589.8 + 589.2 nm vacuum) total line-of-sight radiance in kilorayleighs.** The two lines are summed because they overlap at UVVS resolution. Dayside solar continuum and dark counts are removed in the CDR. |
| na_snr | DDR TOTAL_RADIANCE_SNR | The SIS calls this a "derived SNR … unitless fraction, applied to total radiance." The data show it is signal/noise with the same sign as the radiance. |
| na_sigma_kR | derived | \|na_kR / na_snr\|, the 1σ uncertainty in kR. It comes from count-rate statistics plus sensitivity uncertainty. |
| flag_grating_anomaly | derived | 1 if the date is in a grating-drive-anomaly window: 2012-03-30 to 2012-04-23, or 2013-09-05 to 2013-11-22 (PDS16 processing-updates document). The wavelength scale was re-registered, but scans lose their long-wavelength solar wing, so dayside solar subtraction was "not always possible." |
| flag_slit_touches_surface | derived | Limb row where tan_alt_min_km ≤ 0, so part of the slit is on the disk |
| flag_geom_mismatch | derived | Recomputed tangent altitude differs from the DDR value by more than 10 km. **It is 0 for every row.** |

**Not in the DDR:** no per-spectrum g-factor and no column density. Derived quantities exist only in the model DDR, `uvvs_na_model_ddr.csv`: TAA in 5° bins and LT in 2-h steps, giving n0 [cm⁻³], T [K] and H [km]. That model used a g-value computed from Mercury's r and v_r (SIS equation 1: N = I / (g·10⁶)), but the g values are not archived. The table carries r_helio_au and vr_helio_kms so g can be computed later.

## 4. Filters and quality handling

- **Upstream filters applied by the MASCS team** (SIS Table 2b, `uvvs_cdr2ddr.txt`): saturated spectra, spectra with the slit half on and half off the planet, and other observations of "marginal to no use" were removed before archiving. The DDR has no per-spectrum quality flag. The SIS refers users to the DATA_QUALITY_INDEX (DQI) of the matching CDRs, which was not fetched.
- **This pipeline:**
  - Exact duplicates on (CDR_NAME, MID_SPECTRUM_TIME) across summary files were dropped: 5,668 rows, where an observation straddles an orbit boundary.
  - Rows were split by LOS geometry.
  - No SNR, radiance or flag cut was applied. Negative radiances are kept (53,304 limb rows) because they are legitimate noise around zero after background subtraction, and dropping them would bias a floor analysis.
  - The suggested cut for analysis is `na_snr >= 3`, which keeps 1,315,289 limb rows. Choose the cut deliberately for a residual-floor study.
- **Missing values:** the SIS says missing values are -1e32, but **none occur**. Missing tangent geometry is coded as all zeros (TARGET_ALTITUDE = 0, lat = lon = LT = 0), in 143,618 rows. These are the `away` rows, so they are not in `uvvs_na.csv`. LOS rows that hit the disk have DDR altitude 0 with real lat/lon. SPARE_1–4 are 0 everywhere.
- **Geometry check:** the tangent point recomputed from the DDR vectors (PLANET_SC_VECTOR_TG and BORESIGHT_UNIT_VECTOR_CENTER_TG) reproduces DDR TARGET_ALTITUDE to ±0.006 km when R = **2439.4 km**. That is the MESSENGER-era radius the DDR uses, not the IAU 2439.7 km. All derived geometry uses 2439.4 km.

## 5. Coverage (`uvvs_na.csv`, limb rows)

- **Time:** 2011-03-29T01:34 to 2015-04-30T15:03 UTC, 2,683 orbits, Mercury years 1–18. Rows by Earth year: 2011 172,676; 2012 386,487; 2013 494,293; 2014 491,188; 2015 141,392. **Every 30° TAA bin is populated in every Earth year.**
- **TAA (30° bins, starting at 0):** 50,294 · 92,971 · 170,589 · 238,197 · 215,817 · 124,298 · 88,339 · 186,947 · 205,333 · 157,658 · 111,479 · 44,114. The 330–30° bins near perihelion are the thinnest.
- **Tangent local time (2-h bins, from 0 h):** 237,105 · 121,928 · 55,026 · 57,715 · 44,598 · 238,365 · 257,817 · 58,537 · 59,226 · 91,218 · 164,590 · 299,911. All 144 cells of a 30° TAA × 2-h LT grid hold at least 100 rows.
- **Tangent latitude (30° bins, from -90°):** 41,936 · 174,380 · 772,503 · 650,901 · 29,339 · 16,977. **The data are heavily southern and equatorial.** MESSENGER's eccentric orbit had periapsis at high northern latitude, so limb tangent points fall mostly at -60° to +30°. Northern tangent latitudes (> 30°) are sparse, about 46k rows.
- **Tangent altitude (km bins):** 0–100: 35,966; 100–250: 97,787; 250–500: 127,331; 500–1000: 235,757; 1000–2000: 352,494; 2000–4000: 461,451; 4000–8000: 346,661; >8000: 28,589. Maximum is about 8,850 km.
- **Observation classes:** LS 248,867; LD 388,342; NS 457,243; summary-only 591,584. The leading observation types are ExoScan 503k, LimbOpp 270k, DaysideScan 249k and ExoNadir 247k.
- **Brightness:** na_kR percentiles (1, 10, 50, 90, 99) are -3.9, 0.88, 16.7, 275 and 5,523 kR. The dayside median falls from about 3,200 kR (0–250 km) to about 0.85 kR (4,000–9,000 km).
- **Ancillary ranges:** r_helio 0.3075–0.4667 AU; v_r -10.06 to +10.06 km/s.

### Nightside (tangent LT 18–6 h)

**There is a lot of nightside data, but it is not nightside emission at the tangent point.**

- 969,778 of 1,686,036 limb rows (57.5%) have a nightside tangent local time. Of these, 863,822 have SNR ≥ 3.
- The main sources are NS (ExoScan tail sweeps) with 457k rows, summary-only types with 385k, LD with 105k and LS with 22k.
- Every 30° TAA bin has between 21k and 139k nightside rows.
- 451,384 nightside rows have the tangent point inside the geometric shadow, and every one of them still has a sunlit LOS segment. UVVS sees Na only by resonant scattering of sunlight, so these signals come from sunlit gas elsewhere on the LOS: the anti-sunward Na tail and sunlit gas beyond the terminator.
  - For shadowed-tangent rows, `min_sunlit_los_alt_km` has a median of 2,117 km (5th percentile 809 km, 95th 5,569 km).
  - The median brightness of these rows is 20–37 kR at every tangent altitude, nearly flat, which fits a tail or LOS-integrated source.
- The other 518,385 nightside rows have a sunlit tangent point (median altitude 3,729 km, outside the shadow cylinder).
- **To study the nightside at the emitting location, use `min_sunlit_los_alt_km` and `tan_in_shadow`, not `tan_lt_h` alone.**
- UVVSNightShadow and NightColumn observations are mostly in `uvvs_na_nonlimb.csv`, because they view the disk.

## 6. Caveats to know before a "residual floor" analysis

1. **The archive documents an uncorrected scattered-light background.** `uvvs_ddr_ds.cat` reports "a systematic instrument effect … in the dayside observations … likely due to a scattering problem of unknown origin, mimics a constant background that shows a dependence on altitude, local time and true anomaly angle." It was corrected for Mg LS only. For Na and Ca, "the effect is minimal … so these data have not been corrected." Any residual floor in dayside Na at high altitude must be checked against this instrumental background before it is interpreted physically.
2. **The archive warns of false detections.** `uvvs_ddr_ds.cat` (Limitations) says background removal and wavelength calibration "may sometimes result in false positives in the calibrated radiance."
3. **The radiances are line-of-sight integrals.** They are not local densities, and the tangent geometry is only the closest-approach point. On the nightside the emitting gas is elsewhere (section 5). Low-altitude dayside rows can include surface-scattered light; the solar continuum is subtracted in the CDR.
4. **The grating-drive anomaly windows** hold 98,510 limb rows (flag_grating_anomaly). They have truncated scans and less reliable solar subtraction on the dayside.
5. **The surface slit** (`slit_pos = 0`) was used at low altitude. It has a different field of view (0.05° vs 1° along the slit), so altitude smearing and sensitivity differ.
6. **Latitude coverage** is mostly southern and equatorial (section 5). Dawn and dusk tangent local times (4–8 h, 14–18 h) are thinner than noon and midnight.
7. **TAA sampling is not uniform in time per orbit.** Mercury moves fastest near perihelion, so the 330–30° bins are thin. Year 1 begins at TAA 73° and year 18 ends near TAA 64°.
8. **v_r comes from Mercury's mean Keplerian elements,** not from SPICE. The error is about 0.06 km/s, which is negligible for Na g-factor Doppler work.
9. **CDR data-quality indices (DQI) were not fetched.** They are under `data/cdr/` on the same volume (and at the Geosciences node); that path was not checked file by file.
10. **The spectra were dropped.** Re-extract them from the source files if line-shape or D2/D1 ratio work is needed. `fetch_reduce.py` already parses them.
