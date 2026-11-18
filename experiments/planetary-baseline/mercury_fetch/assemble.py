"""Assemble reduced UVVS Na DDR npz files into analysis-ready CSVs + coverage stats.

Usage: python3 -I assemble.py <workdir with reduced/> <outdir>

Inputs (from fetch_reduce.py): reduced/ud_MM_orbNNNN_YYDDD_summary_na.npz (UVVSDNASUM)
and reduced/ud_MM_{ls,ld,ns}_na.npz (UVVSDNALS/LD/NS).

Outputs in outdir:
  uvvs_na.csv           limb rows (line of sight has a tangent point above the surface)
  uvvs_na_nonlimb.csv   rows whose line of sight hits the disk or points away from the planet
  coverage_stats.txt    counts / coverage tables used in MERCURY_PROVENANCE.md
"""
import datetime as dt
import glob
import os
import re
import sys

import numpy as np

R_M = 2439.4            # km, Mercury radius used by the MESSENGER DDR geometry (DDR altitudes reproduce with 2439.4)
AU = 1.495978707e8      # km
GM_SUN = 1.32712440018e11  # km^3 s^-2
A_MER = 0.38709893      # AU, Mercury semi-major axis (J2000 mean elements)
E_MER = 0.20563069      # eccentricity
# UVVS grating-drive anomaly windows (UVVS_PROCESSING_UPDATES_PDS16)
GRATING = [(dt.datetime(2012, 3, 30), dt.datetime(2012, 4, 24)),
           (dt.datetime(2013, 9, 5), dt.datetime(2013, 11, 23))]


def s(a):
    return np.char.strip(np.char.decode(a, "latin-1"))


def load(paths, summary):
    cols = {}
    for p in paths:
        z = np.load(p)
        n = len(z["ORBIT_NUMBER"])
        my = int(re.match(r"ud_(\d\d)_", os.path.basename(p)).group(1))
        tag = os.path.basename(p)[:-4]
        for k in z.files:
            cols.setdefault(k, []).append(z[k])
        cols.setdefault("MERCURY_YEAR", []).append(np.full(n, my, np.int16))
        cols.setdefault("SRC_FILE", []).append(np.full(n, tag, dtype="U40"))
    return {k: np.concatenate(v) for k, v in cols.items()}


def utc_iso(u):
    out = []
    for x in u:
        yy, doy, rest = int(x[:2]), int(x[2:5]), x[6:]
        d = dt.datetime(2000 + yy, 1, 1) + dt.timedelta(days=doy - 1)
        out.append("%sT%s" % (d.strftime("%Y-%m-%d"), rest))
    return np.array(out)


def min_sunlit_alt(sc, b, u, s_hit, s_t, chunk=20000):
    """Minimum altitude (km) of any sunlit point on the LOS (s>=0, before the surface hit).
    Shadow = cylinder of radius R_M behind the planet (umbra approximation, no penumbra).
    Returns nan if no sunlit point within 40000 km of the tangent point."""
    out = np.full(len(sc), np.nan)
    d = np.sinh(np.linspace(-6, 6, 1201)) / np.sinh(6) * 40000.0   # ~0.2 km spacing near s_t
    for i in range(0, len(sc), chunk):
        j = slice(i, i + chunk)
        S = s_t[j, None] + d[None, :]
        S = np.where(S < 0, np.nan, S)
        S = np.where(S > s_hit[j, None], np.nan, S)
        P = sc[j, None, :] + S[..., None] * b[j, None, :]
        r = np.linalg.norm(P, axis=2)
        x = (P * u[j, None, :]).sum(2)
        rho = np.sqrt(np.maximum(r ** 2 - x ** 2, 0))
        lit = ~((x < 0) & (rho < R_M)) & np.isfinite(S)
        alt = np.where(lit, r - R_M, np.inf)
        m = alt.min(1)
        out[j] = np.where(np.isfinite(m), m, np.nan)
    return out


def main():
    work, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    red = os.path.join(work, "reduced")
    sp = sorted(glob.glob(os.path.join(red, "*_summary_na.npz")))
    gp = sorted(glob.glob(os.path.join(red, "ud_??_l[sd]_na.npz")) + glob.glob(os.path.join(red, "ud_??_ns_na.npz")))
    S = load(sp, True)
    G = load(gp, False)
    stats = []
    P = lambda *a: stats.append(" ".join(str(x) for x in a))
    P("summary files:", len(sp), "rows:", len(S["ORBIT_NUMBER"]))
    P("geometry-classified files:", len(gp), "rows:", len(G["ORBIT_NUMBER"]))

    cdr = s(S["CDR_NAME"]); met = S["MID_SPECTRUM_TIME"].astype(float)
    key = np.char.add(cdr, np.char.mod("_%.2f", met))
    _, first = np.unique(key, return_index=True)
    first.sort()
    P("duplicate (CDR_NAME, MID_SPECTRUM_TIME) rows dropped from summaries:", len(key) - len(first))
    S = {k: v[first] for k, v in S.items()}; cdr = cdr[first]; met = met[first]; key = key[first]
    n = len(met)

    # join geometry class
    gcls = np.array([re.match(r"ud_\d\d_(l[sd]|ns)_na", f).group(1).upper() for f in G["SRC_FILE"]])
    gkey = np.char.add(s(G["CDR_NAME"]), np.char.mod("_%.2f", G["MID_SPECTRUM_TIME"].astype(float)))
    gmap = {}
    for k, c, q, rad in zip(gkey, gcls, G["OBS_SEQUENCE_INDEX"], G["TOTAL_RADIANCE_KR"]):
        gmap.setdefault(k, (c, int(q), float(rad)))
    ddr_class = np.array([gmap.get(k, ("", -1, np.nan))[0] for k in key])
    seq = np.array([gmap.get(k, ("", -1, np.nan))[1] for k in key])
    grad = np.array([gmap.get(k, ("", -1, np.nan))[2] for k in key])
    sk = set(key.tolist())
    P("geometry-classified rows matched in summaries:", sum(k in sk for k in gmap), "of", len(gmap))
    m = np.isfinite(grad)
    dr = np.abs(grad[m] - S["TOTAL_RADIANCE_KR"][m])
    P("max |radiance(LS/LD/NS) - radiance(summary)| on matched rows (kR):", dr.max() if m.any() else None,
      "; rows differing >1e-6:", int((dr > 1e-6).sum()))
    from collections import Counter
    P("ddr_class counts in summaries:", dict(Counter(ddr_class.tolist())))

    # geometry
    psv = S["PLANET_SUN_VECTOR_TG"].astype(float); sc = S["PLANET_SC_VECTOR_TG"].astype(float)
    b = S["BORESIGHT_UNIT_VECTOR_CENTER_TG"].astype(float)
    b = b / np.linalg.norm(b, axis=1)[:, None]
    rsun = np.linalg.norm(psv, axis=1); u = psv / rsun[:, None]
    r_au = rsun / AU
    taa = S["PLANET_TRUE_ANOMALY"].astype(float)
    p_km = A_MER * (1 - E_MER ** 2) * AU
    vr = np.sqrt(GM_SUN / p_km) * E_MER * np.sin(np.radians(taa))
    r_kep = p_km / (1 + E_MER * np.cos(np.radians(taa))) / AU
    P("check |r_helio(PLANET_SUN_VECTOR) - r_kepler(TAA)| AU: median %.2e max %.2e" %
      (np.median(np.abs(r_au - r_kep)), np.max(np.abs(r_au - r_kep))))
    # finite-difference radial velocity check (per orbit, rows > 1 h apart)
    fd = []
    for orb in np.unique(S["ORBIT_NUMBER"])[::50]:
        w = np.where(S["ORBIT_NUMBER"] == orb)[0]
        if np.ptp(met[w]) > 3600:
            c = np.polyfit(met[w] - met[w].mean(), rsun[w], 1)[0]
            fd.append(c - vr[w].mean())
    P("check finite-difference dr/dt minus Kepler v_r (km/s), %d orbits: median %.3f, max abs %.3f" %
      (len(fd), np.median(fd), np.max(np.abs(fd))))

    s_t = -(sc * b).sum(1)
    tp = sc + s_t[:, None] * b
    rtp = np.linalg.norm(tp, axis=1)
    away = s_t <= 0
    disk = (~away) & (rtp < R_M)
    limb = (~away) & ~disk
    los = np.where(away, "away", np.where(disk, "disk", "limb"))
    disc = np.sqrt(np.maximum(R_M ** 2 - rtp ** 2, 0))
    s_hit = np.where(disk, s_t - disc, np.inf)
    s_hit = np.where(disk & (s_hit < 0), 0, s_hit)  # spacecraft can't be inside planet; guard
    x = (tp * u).sum(1); rho = np.sqrt(np.maximum(rtp ** 2 - x ** 2, 0))
    shadow = (x < 0) & (rho < R_M)
    sza = np.degrees(np.arccos(np.clip(x / rtp, -1, 1)))
    alt_ddr = S["TARGET_ALTITUDE"].astype(float)
    alt_rec = rtp - R_M
    missing = (alt_ddr[:, 0] < -1e31)
    zero_geom = (alt_ddr[:, 0] == 0) & (S["TARGET_LATITUDE"] == 0) & (S["TARGET_LONGITUDE"] == 0)
    P("DDR TARGET_ALTITUDE == -1e32 rows:", int(missing.sum()), "; all-zero tangent geometry rows:", int(zero_geom.sum()))
    P("LOS class from recomputed geometry:", dict(Counter(los.tolist())))
    P("all-zero tangent geometry by LOS class:", dict(Counter(los[zero_geom].tolist())))
    P("DDR alt_center==0 by LOS class:", dict(Counter(los[alt_ddr[:, 0] == 0].tolist())))
    dd = alt_rec[limb] - alt_ddr[limb, 0]
    P("limb rows: recomputed tangent alt (R=R_M) minus DDR alt: pct1/50/99 = %s" %
      np.round(np.percentile(dd, [1, 50, 99]), 3).tolist(), "; |diff|>10 km:", int((np.abs(dd) > 10).sum()))
    geom_mismatch = np.zeros(n, bool); geom_mismatch[limb] = np.abs(dd) > 10

    msa = np.full(n, np.nan)
    need = (~away) & (shadow | disk)
    msa[limb & ~shadow] = alt_rec[limb & ~shadow]
    idx = np.where(need)[0]
    msa[idx] = min_sunlit_alt(sc[idx], b[idx], u[idx], s_hit[idx], s_t[idx])

    rad = S["TOTAL_RADIANCE_KR"].astype(float); snr = S["TOTAL_RADIANCE_SNR"].astype(float)
    with np.errstate(divide="ignore", invalid="ignore"):
        sig = np.where(snr != 0, np.abs(rad / snr), np.nan)
    utc = utc_iso(s(S["UTC_TIME"]))
    tdt = np.array([dt.datetime.strptime(x[:10], "%Y-%m-%d") for x in utc])
    gflag = np.zeros(n, bool)
    for a, z in GRATING:
        gflag |= (tdt >= a) & (tdt < z)
    partial = limb & (alt_ddr[:, 1] <= 0)
    for k in ("SPARE_1", "SPARE_2", "SPARE_3", "SPARE_4"):
        P(k, "nonzero rows:", int((S[k] != 0).sum()))
    P("SLIT_POS counts:", dict(Counter(S["SLIT_POS"].tolist())))
    P("radiance == -1e32 rows:", int((rad < -1e31).sum()), "; SNR==0 rows:", int((snr == 0).sum()))

    lt = S["TARGET_LOCAL_TIME"].astype(float)
    cols = [
        ("mercury_year", S["MERCURY_YEAR"], "%d"),
        ("orbit", S["ORBIT_NUMBER"], "%d"),
        ("cdr_name", cdr, "%s"),
        ("obs_type", s(S["OBSERVATION_TYPE"]), "%s"),
        ("ddr_class", ddr_class, "%s"),
        ("obs_seq_index", seq, "%d"),
        ("utc", utc, "%s"),
        ("met_s", met, "%.2f"),
        ("taa_deg", taa, "%.4f"),
        ("r_helio_au", r_au, "%.6f"),
        ("vr_helio_kms", vr, "%.4f"),
        ("tan_alt_km", alt_ddr[:, 0], "%.2f"),
        ("tan_alt_min_km", alt_ddr[:, 1], "%.2f"),
        ("tan_alt_max_km", alt_ddr[:, 2], "%.2f"),
        ("tan_lat_deg", S["TARGET_LATITUDE"].astype(float), "%.4f"),
        ("tan_lon_deg", S["TARGET_LONGITUDE"].astype(float), "%.4f"),
        ("tan_lt_h", lt, "%.4f"),
        ("tan_sza_deg", sza, "%.3f"),
        ("tan_in_shadow", shadow.astype(int), "%d"),
        ("min_sunlit_los_alt_km", msa, "%.2f"),
        ("los_geom", los, "%s"),
        ("sc_alt_km", S["SPACECRAFT_ALTITUDE"].astype(float), "%.2f"),
        ("sc_lat_deg", S["SUBSPACECRAFT_LATITUDE"].astype(float), "%.4f"),
        ("sc_lon_deg", S["SUBSPACECRAFT_LONGITUDE"].astype(float), "%.4f"),
        ("sc_lt_h", S["SPACECRAFT_LOCAL_TIME"].astype(float), "%.4f"),
        ("subsolar_lat_deg", S["SUBSOLAR_LATITUDE"].astype(float), "%.4f"),
        ("subsolar_lon_deg", S["SUBSOLAR_LONGITUDE"].astype(float), "%.4f"),
        ("slit_pos", S["SLIT_POS"], "%d"),
        ("n_spec_points", S["N_SPEC_POINTS"], "%d"),
        ("na_kR", rad, "%.5g"),
        ("na_snr", snr, "%.5g"),
        ("na_sigma_kR", sig, "%.4g"),
        ("flag_grating_anomaly", gflag.astype(int), "%d"),
        ("flag_slit_touches_surface", partial.astype(int), "%d"),
        ("flag_geom_mismatch", geom_mismatch.astype(int), "%d"),
    ]
    order = np.argsort(utc, kind='stable')  # MET resets between partitions; ISO UTC sorts correctly

    def write(path, sel):
        ii = order[sel[order]]
        with open(path, "w") as f:
            f.write(",".join(c[0] for c in cols) + "\n")
            strs = []
            for name, arr, fm in cols:
                a = arr[ii]
                if fm == "%s":
                    strs.append(a.astype(str))
                else:
                    strs.append(np.char.mod(fm, a))
            for row in zip(*strs):
                f.write(",".join(row) + "\n")
        return len(ii)

    nl = write(os.path.join(outdir, "uvvs_na.csv"), limb)
    nn = write(os.path.join(outdir, "uvvs_na_nonlimb.csv"), ~limb)
    P("written limb rows:", nl, "; non-limb rows:", nn)

    # coverage stats for limb rows
    L = limb
    night = (lt >= 18) | (lt < 6)
    P("\n== Limb rows ==")
    P("UTC range:", utc[order[L[order]]][0], "->", utc[order[L[order]]][-1])
    P("orbits with limb rows:", len(np.unique(S["ORBIT_NUMBER"][L])))
    P("by Mercury year:", dict(sorted(Counter(S["MERCURY_YEAR"][L].tolist()).items())))
    P("by obs_type:", dict(Counter(s(S["OBSERVATION_TYPE"])[L].tolist()).most_common()))
    P("by ddr_class:", dict(Counter(ddr_class[L].tolist())))
    h, e = np.histogram(taa[L], bins=np.arange(0, 361, 30)); P("TAA 30-deg bins:", dict(zip(e[:-1].astype(int).tolist(), h.tolist())))
    h, e = np.histogram(lt[L], bins=np.arange(0, 25, 2)); P("tangent LT 2-h bins:", dict(zip(e[:-1].astype(int).tolist(), h.tolist())))
    h, e = np.histogram(S["TARGET_LATITUDE"][L], bins=np.arange(-90, 91, 30)); P("tangent lat 30-deg bins:", dict(zip(e[:-1].astype(int).tolist(), h.tolist())))
    ab = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 20000, 1e6]
    h, e = np.histogram(alt_ddr[L, 0], bins=ab); P("tangent alt bins (km):", dict(zip([int(x) for x in e[:-1]], h.tolist())))
    P("nightside (tangent LT 18-6 h) limb rows:", int((L & night).sum()), "of", int(L.sum()),
      "(%.1f%%)" % (100 * (L & night).sum() / L.sum()))
    P("  of which tangent point in geometric shadow:", int((L & night & shadow).sum()))
    P("  of which tangent in shadow AND whole LOS within 40000 km in shadow (min_sunlit nan):", int((L & night & shadow & np.isnan(msa)).sum()))
    P("  nightside by obs_type:", dict(Counter(s(S["OBSERVATION_TYPE"])[L & night].tolist()).most_common()))
    P("  nightside by ddr_class:", dict(Counter(ddr_class[L & night].tolist())))
    h, e = np.histogram(taa[L & night], bins=np.arange(0, 361, 30)); P("  nightside TAA 30-deg bins:", dict(zip(e[:-1].astype(int).tolist(), h.tolist())))
    h, e = np.histogram(alt_ddr[L & night, 0], bins=ab); P("  nightside alt bins:", dict(zip([int(x) for x in e[:-1]], h.tolist())))
    P("dayside rows with tangent in shadow (should be ~0):", int((L & ~night & shadow).sum()))
    P("SNR>=3 limb rows:", int((L & (snr >= 3)).sum()), "; SNR>=3 nightside:", int((L & night & (snr >= 3)).sum()),
      "; nightside & tangent in shadow & SNR>=3:", int((L & night & shadow & (snr >= 3)).sum()))
    P("na_kR percentiles (1,10,50,90,99) limb:", np.round(np.percentile(rad[L], [1, 10, 50, 90, 99]), 3).tolist())
    P("negative na_kR limb rows:", int((L & (rad < 0)).sum()))
    P("flag_grating_anomaly limb rows:", int((L & gflag).sum()), "; flag_slit_touches_surface:", int(partial.sum()),
      "; flag_geom_mismatch:", int(geom_mismatch.sum()))
    P("r_helio range AU:", round(r_au[L].min(), 4), round(r_au[L].max(), 4), "; vr range km/s:", round(vr[L].min(), 2), round(vr[L].max(), 2))
    P("\n== Non-limb rows ==")
    P("by los_geom:", dict(Counter(los[~L].tolist())), "; by obs_type:", dict(Counter(s(S["OBSERVATION_TYPE"])[~L].tolist()).most_common()))
    open(os.path.join(outdir, "coverage_stats.txt"), "w").write("\n".join(stats) + "\n")
    print("\n".join(stats))


if __name__ == "__main__":
    main()
