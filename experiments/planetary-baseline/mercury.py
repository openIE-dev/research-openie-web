"""Study 5: Mercury Na residual against a leave-one-year-out climatology. See PREREGISTRATION_study5.md."""
import csv
import json
import sys
from collections import defaultdict

import numpy as np

import analyze as A

BLOCK = 500


def load():
    rows = list(csv.DictReader(open(A.DATA / "mercury" / "dayside_passes.csv")))
    cols = {k: np.array([float(r[k]) for r in rows]) for k in ("mercury_year", "band", "lt_hour", "n", "na_kR", "taa_deg", "cos2lon", "lat_deg", "coslon", "sinlon")}
    return cols


def skeleton(d):
    """Leave-one-Mercury-year-out count-weighted cell mean."""
    cell = list(zip((d["taa_deg"] // 10).astype(int), d["lt_hour"].astype(int), d["band"].astype(int)))
    tot = defaultdict(lambda: defaultdict(lambda: [0.0, 0.0, 0]))
    for i, c in enumerate(cell):
        t = tot[c][int(d["mercury_year"][i])]
        t[0] += d["na_kR"][i] * d["n"][i]; t[1] += d["n"][i]; t[2] += 1
    S = np.full(len(cell), np.nan)
    for i, c in enumerate(cell):
        y = int(d["mercury_year"][i])
        others = [v for k, v in tot[c].items() if k != y]
        if len(others) >= 2 and sum(v[2] for v in others) >= 3:
            s = sum(v[0] for v in others) / sum(v[1] for v in others)
            if s >= 1.0:
                S[i] = s
    return S


def corr_ci(a, b, rng):
    pt = float(np.corrcoef(a, b)[0, 1]); bs = []
    A.BLOCK = BLOCK
    for _ in range(A.NBOOT):
        i = A.block_indices(len(a), rng); bs.append(np.corrcoef(a[i], b[i])[0, 1])
    return [pt, float(np.percentile(bs, 2.5)), float(np.percentile(bs, 97.5))]


def analyse(d, rng):
    S = skeleton(d)
    out = {}
    for b in range(4):
        m = (d["band"] == b) & ~np.isnan(S)
        B, s, c, lat = d["na_kR"][m], S[m], d["cos2lon"][m], np.abs(d["lat_deg"][m])
        c1, s1 = d["coslon"][m], d["sinlon"][m]
        R = B / s - 1
        dev = B - B.mean()
        o = {"passes": int(m.sum()), "skeleton_skill": float(1 - np.var(B - s) / np.var(dev)),
             "median_kR": float(np.median(B)), "median_resid": float(np.median(R)),
             "corr_R_cos2lon": corr_ci(R, c, rng)}
        X = np.column_stack([np.ones(len(R)), c1, s1])
        coef = np.linalg.lstsq(X, R, rcond=None)[0]
        A.BLOCK = BLOCK
        bs = []
        for _ in range(A.NBOOT):
            i = A.block_indices(len(R), rng)
            bs.append(np.linalg.lstsq(X[i], R[i], rcond=None)[0][1:])
        bs = np.array(bs)
        o["lon1_coef_cos_sin"] = [float(coef[1]), float(coef[2])]
        o["lon1_ci_98_75"] = [[float(np.percentile(bs[:, k], 1.25)), float(np.percentile(bs[:, k], 98.75))] for k in (0, 1)]
        o["lon1_amplitude"] = float(np.hypot(coef[1], coef[2]))
        o["lon1_phase_deg"] = float(np.degrees(np.arctan2(coef[2], coef[1])) % 360)
        R2 = R - X[:, 1:] @ coef[1:]
        o["corr_R2_abslat"] = corr_ci(R2, lat, rng)
        o["resid_sd"] = float(np.std(R)); o["resid2_sd"] = float(np.std(R2))
        # residual means by cos2lon tercile, for reading the size
        o["cos2lon_sd_within_band"] = float(np.std(c))
        q = np.quantile(c, [1 / 3, 2 / 3])
        o["R_mean_cold_mid_hot"] = [float(R[c <= q[0]].mean()), float(R[(c > q[0]) & (c <= q[1])].mean()), float(R[c > q[1]].mean())]
        out[b] = o
    return out


def main():
    rng = np.random.default_rng(A.SEED)
    d = load()
    if "--selftest" in sys.argv:
        g = np.random.default_rng(9)
        base = 40 * np.exp(-np.array([125, 375, 750, 1500])[d["band"].astype(int)] / 400) * (1 + 0.5 * np.cos(np.radians(d["taa_deg"])))
        mode = sys.argv[-1]
        sig = {"cos2": 1 - 0.15 * d["cos2lon"], "lon1": 1 + 0.15 * d["coslon"]}.get(mode, 1.0)
        d["na_kR"] = base * sig * np.exp(g.normal(0, 0.3, len(base)))
        print(json.dumps(analyse(d, rng), indent=1))
        return
    res = analyse(d, rng)
    low = [res[b] for b in (0, 1, 2)]
    sig = sum(any(ci[0] > 0 or ci[1] < 0 for ci in r["lon1_ci_98_75"]) for r in low)
    v = {"H18": "supported" if sig >= 2 else "refuted",
         "H19": "supported" if sum((r["corr_R2_abslat"][1] > 0 or r["corr_R2_abslat"][2] < 0) for r in low) >= 2 else "refuted"}
    (A.RESULTS / "study5.json").write_text(json.dumps({"results": res, "verdicts": v}, indent=1))
    names = ["0-250 km", "250-500 km", "500-1000 km", "1000-2000 km"]
    L = ["# Study 5 results (Mercury Na, dayside)\n", "| band | passes | skeleton skill | median kR | lon harmonic 1: cos, sin coef [98.75% CIs] | amplitude, phase | r(R after lon, abs lat) [95%] |", "|---" * 7 + "|"]
    for b in range(4):
        o = res[b]; c = o["corr_R_cos2lon"]; l = o["corr_R2_abslat"]; t = o["R_mean_cold_mid_hot"]
        k1, ci = o["lon1_coef_cos_sin"], o["lon1_ci_98_75"]
        L.append(f"| {names[b]} | {o['passes']} | {o['skeleton_skill']:.2f} | {o['median_kR']:.1f} | "
                 f"{k1[0]:+.3f} [{ci[0][0]:+.3f}, {ci[0][1]:+.3f}], {k1[1]:+.3f} [{ci[1][0]:+.3f}, {ci[1][1]:+.3f}] | "
                 f"{o['lon1_amplitude']:.3f}, {o['lon1_phase_deg']:.0f} deg | {l[0]:+.3f} [{l[1]:+.3f}, {l[2]:+.3f}] |")
    L += ["\n## Verdicts\n", f"- H18: {v['H18']}", f"- H19: {v['H19']}"]
    (A.RESULTS / "study5.md").write_text("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()
