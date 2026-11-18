"""Study 4: Mars surface pressure, Haar scaling and hindcast ladder. See PREREGISTRATION_study4.md.

  python3 mars.py             # run on data/mars/
  python3 mars.py --selftest  # same pipeline on a synthetic lander record
"""
import csv
import json
import sys
from collections import defaultdict

import numpy as np

import analyze as A

LANDERS = {"Viking 1": "viking1_vl_p", "Viking 2": "viking2_vl_p", "InSight": "insight"}
HAAR_SOLS = [0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]
H_SOLS = [1, 3, 10, 30]
YEAR1 = 669
ORIGIN0 = 700
REFIT = 30
BLOCK = 30
MIN_ORIGINS = 100


def load():
    out = defaultdict(list)
    for f in ("insight_hourly.csv", "viking_vl_p_hourly.csv"):
        for r in csv.DictReader(open(A.DATA / "mars" / f)):
            if r["pressure_pa"]:
                out[r["dataset"]].append((float(r["sol"]), float(r["ls"]), float(r["pressure_pa"])))
    return {k: np.array(sorted(v)) for k, v in out.items()}


def seasonal(ls_deg, kmax=4):
    L = np.radians(ls_deg)
    cols = [np.ones_like(L)]
    for k in range(1, kmax + 1):
        cols += [np.cos(k * L), np.sin(k * L)]
    return np.column_stack(cols)


def diurnal(sol, ls_deg):
    phi = 2 * np.pi * (sol % 1.0)
    L = np.radians(ls_deg)
    mods = [np.ones_like(L), np.cos(L), np.sin(L)]
    cols = []
    for j in range(1, 4):
        for base in (np.cos(j * phi), np.sin(j * phi)):
            cols += [base * m for m in mods]
    return np.column_stack(cols)


def skeleton_fit(sol, ls, p):
    X = np.column_stack([seasonal(ls), diurnal(sol, ls)])
    beta, *_ = np.linalg.lstsq(X, p, rcond=None)
    return beta, X


# ---------------------------------------------------------------- Part A
def haar_gappy(series, lag_bins):
    """RMS Haar fluctuation of a series with NaN gaps; each half needs >= 75% coverage."""
    ok = ~np.isnan(series)
    v = np.where(ok, series, 0.0)
    cs = np.concatenate([[0.0], np.cumsum(v)])
    cn = np.concatenate([[0], np.cumsum(ok)])
    half = lag_bins // 2
    i = np.arange(0, len(series) - lag_bins + 1)
    n1 = cn[i + half] - cn[i]
    n2 = cn[i + lag_bins] - cn[i + half]
    good = (n1 >= 0.75 * half) & (n2 >= 0.75 * half)
    if good.sum() < 10:
        return np.nan, int(good.sum())
    m1 = (cs[i + half] - cs[i])[good] / n1[good]
    m2 = (cs[i + lag_bins] - cs[i + half])[good] / n2[good]
    return float(np.sqrt(np.mean((m2 - m1) ** 2))), int(good.sum())


def part_a(d):
    sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
    beta, X = skeleton_fit(sol, ls, p)
    r = p - X @ beta
    idx = np.floor(sol * 24).astype(int)  # sol is the bin centre
    grid = np.full(idx.max() - idx.min() + 1, np.nan)
    grid[idx - idx.min()] = r
    fl, cnt = [], []
    for s in HAAR_SOLS:
        L = int(round(s * 24))
        L += L % 2
        f, c = haar_gappy(grid, L)
        fl.append(f)
        cnt.append(c)
    fl = np.array(fl)
    whole = [k for k, s in enumerate(HAAR_SOLS) if float(s).is_integer() and 1 <= s <= 32 and not np.isnan(fl[k])]
    peak = HAAR_SOLS[whole[int(np.argmax(fl[whole]))]]
    tail = [k for k, s in enumerate(HAAR_SOLS) if float(s).is_integer() and 6 <= s <= 96 and not np.isnan(fl[k])]
    slope = float(np.polyfit(np.log([HAAR_SOLS[k] for k in tail]), np.log(fl[tail]), 1)[0])
    return {"lags_sol": HAAR_SOLS, "fluct_pa": [None if np.isnan(x) else float(x) for x in fl], "n_starts": cnt,
            "peak_whole_sol": peak, "slope_6_96": slope, "residual_sd_pa": float(np.std(r)),
            "skeleton_rms_pa": float(np.sqrt(np.mean((X @ beta - p.mean()) ** 2)))}


# ---------------------------------------------------------------- Part B
def daily_series(d):
    sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
    y1 = sol < YEAR1
    beta, _ = skeleton_fit(sol[y1], ls[y1], p[y1])
    corr = diurnal(sol, ls) @ beta[9:]
    by = defaultdict(list)
    for s, l, v in zip(np.floor(sol).astype(int), ls, p - corr):
        by[s].append((l, v))
    out = {}
    for s, rows in by.items():
        if len(rows) >= 12:
            ls_s = np.array([x[0] for x in rows])
            ls_mean = np.degrees(np.angle(np.mean(np.exp(1j * np.radians(ls_s))))) % 360
            out[s] = (ls_mean, float(np.mean([x[1] for x in rows])))
    return out


def part_b(daily, rng):
    sols = sorted(daily)
    last = max(sols)
    ls_of = {s: daily[s][0] for s in sols}
    # Ls for future sols: need it for the skeleton forecast. Ls is orbital geometry, known in
    # advance; use the observed Ls if present, else interpolate between observed neighbours.
    known = np.array(sols)
    ls_unwrapped = np.degrees(np.unwrap(np.radians([ls_of[s] for s in sols])))
    lsf = lambda s: float(np.interp(s, known, ls_unwrapped)) % 360
    val = {s: daily[s][1] for s in sols}
    errs = {m: {h: [] for h in H_SOLS} for m in ("D0", "D1", "D2", "D5")}
    cur, fitted_at = None, None
    for o in range(ORIGIN0, last):
        if o not in val or any((o - k) not in val for k in range(1, 6)):
            continue
        if cur is None or o - fitted_at >= REFIT:
            tr = [s for s in sols if s < o]
            Xs = seasonal(np.array([ls_of[s] for s in tr]))
            ys = np.array([val[s] for s in tr])
            b, *_ = np.linalg.lstsq(Xs, ys, rcond=None)
            res = dict(zip(tr, ys - Xs @ b))
            pairs = [(res[s], res[s + 1]) for s in tr if s + 1 in res]
            a0, a1 = map(np.array, zip(*pairs))
            phi = float(a0 @ a1 / (a0 @ a0))
            win = [s for s in tr if all((s - k) in val for k in range(0, 6))]
            Xa = np.column_stack([np.ones(len(win))] + [[val[s - k] for s in win] for k in range(1, 6)])
            ya = np.array([val[s] for s in win])
            ar, *_ = np.linalg.lstsq(Xa, ya, rcond=None)
            cur, fitted_at = {"b": b, "phi": phi, "ar": ar}, o
        skel = lambda s: float((seasonal(np.array([lsf(s)])) @ cur["b"])[0])
        r0 = val[o] - skel(o)
        for h in H_SOLS:
            if o + h not in val:
                continue
            hist = [val[o - k] for k in range(5, -1, -1)]
            for _ in range(h):
                hist.append(float(cur["ar"][0] + cur["ar"][1:] @ hist[::-1][:5]))
            f = {"D0": skel(o + h), "D1": val[o], "D2": skel(o + h) + cur["phi"] ** h * r0, "D5": hist[-1]}
            for m in f:
                errs[m][h].append(f[m] - val[o + h])
    A.BLOCK = BLOCK
    out = {"n_origins": {h: len(errs["D0"][h]) for h in H_SOLS},
           "rmse": {m: {h: float(np.sqrt(np.mean(np.square(errs[m][h])))) if errs[m][h] else None for h in H_SOLS} for m in errs},
           "skill": {}}
    for m, r in (("D2", "D5"), ("D2", "D0"), ("D2", "D1"), ("D0", "D5")):
        out["skill"][f"{m}_vs_{r}"] = {h: A.skill_ci(errs[m][h], errs[r][h], rng) if len(errs[m][h]) >= 20 else None for h in H_SOLS}
    return out


def verdicts(res):
    def tally(enter, cs, cr):
        L = [R for R in res.values() if enter(R)]
        s = sum(cs(R) for R in L); r = sum(cr(R) for R in L)
        v = "supported" if len(L) >= 2 and s >= 2 else "refuted" if len(L) >= 2 and r >= 2 else "undecided"
        return {"verdict": v, "entered": len(L), "supporting": s, "refuting": r}
    a = lambda R: R["A"]
    enterB = lambda hs: (lambda R: all(R["B"]["n_origins"][h] >= MIN_ORIGINS for h in hs))
    sk = lambda R, k, h: R["B"]["skill"][k][h]
    return {
        "H8": tally(lambda R: True, lambda R: 1 <= a(R)["peak_whole_sol"] <= 4, lambda R: a(R)["peak_whole_sol"] >= 6),
        "H9": tally(lambda R: True, lambda R: a(R)["slope_6_96"] < 0, lambda R: a(R)["slope_6_96"] >= 0),
        "H10": tally(enterB([10, 30]), lambda R: all(sk(R, "D2_vs_D5", h)[1] > 0 for h in (10, 30)),
                     lambda R: all(sk(R, "D2_vs_D5", h)[0] <= 0 for h in (10, 30))),
        "H11": tally(enterB([30]), lambda R: abs(sk(R, "D2_vs_D0", 30)[0]) <= 0.05, lambda R: abs(sk(R, "D2_vs_D0", 30)[0]) > 0.05),
    }


def synthetic():
    """Two-year lander: seasonal + modulated diurnal skeleton, AR(1) weather with a 2-sol
    e-folding time sampled hourly, gaps."""
    rng = np.random.default_rng(3)
    sol = np.arange(0, 1500, 1 / 24) + 1 / 48
    ls = (sol / 668.6 * 360) % 360
    L = np.radians(ls)
    p = 750 + 60 * np.cos(L - 1) + 25 * np.cos(2 * L) + (8 + 3 * np.cos(L)) * np.cos(2 * np.pi * sol)
    a = np.exp(-1 / 48)
    w = np.zeros(len(sol))
    for i in range(1, len(sol)):
        w[i] = a * w[i - 1] + rng.standard_normal() * 8 * np.sqrt(1 - a * a)
    keep = rng.random(len(sol)) > 0.2
    keep &= ~((sol > 300) & (sol < 330))
    return np.column_stack([sol, ls, p + w])[keep]


def main():
    rng = np.random.default_rng(A.SEED)
    data = {"Synthetic": synthetic()} if "--selftest" in sys.argv else {k: load()[v] for k, v in LANDERS.items()}
    res = {k: {"A": part_a(d), "B": part_b(daily_series(d), rng)} for k, d in data.items()}
    if "--selftest" in sys.argv:
        print(json.dumps(res, indent=1)[:4000])
        return
    v = verdicts(res)
    (A.RESULTS / "study4.json").write_text(json.dumps({"results": res, "verdicts": v}, indent=1))
    L = ["# Study 4 results (Mars surface pressure)\n", "Computed by `mars.py` from `data/mars/`.\n"]
    for k, R in res.items():
        a, b = R["A"], R["B"]
        L.append(f"\n### {k}\n")
        L.append(f"Skeleton RMS {a['skeleton_rms_pa']:.1f} Pa; residual SD {a['residual_sd_pa']:.1f} Pa.\n")
        L.append("| lag (sol) | " + " | ".join(str(s) for s in a["lags_sol"]) + " |")
        L.append("|---" * (len(a["lags_sol"]) + 1) + "|")
        L.append("| RMS Haar (Pa) | " + " | ".join("—" if x is None else f"{x:.2f}" for x in a["fluct_pa"]) + " |")
        L.append(f"\nPeak (whole sols 1–32): {a['peak_whole_sol']} sol. Slope over 6–96 sols: {a['slope_6_96']:+.3f}.\n")
        L.append("| h (sol) | n | RMSE D0 | RMSE D1 | RMSE D2 | RMSE D5 | D2 vs D5 | D2 vs D0 | D0 vs D5 |")
        L.append("|---" * 9 + "|")
        for h in H_SOLS:
            f = lambda x: "—" if x is None else f"{x[0]:+.3f} [{x[1]:+.3f}, {x[2]:+.3f}]"
            rm = lambda m: "—" if b["rmse"][m][h] is None else f"{b['rmse'][m][h]:.2f}"
            L.append(f"| {h} | {b['n_origins'][h]} | {rm('D0')} | {rm('D1')} | {rm('D2')} | {rm('D5')} | "
                     f"{f(b['skill']['D2_vs_D5'][h])} | {f(b['skill']['D2_vs_D0'][h])} | {f(b['skill']['D0_vs_D5'][h])} |")
    L.append("\n## Verdicts\n")
    L += [f"- {k}: {x['verdict']} ({x['entered']} landers entered, {x['supporting']} supporting, {x['refuting']} refuting)" for k, x in v.items()]
    (A.RESULTS / "study4.md").write_text("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()
