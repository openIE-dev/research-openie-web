"""Study 1: structural skeleton plus residual memory for monthly global temperature.

Usage:
  python3 analyze.py            # run the preregistered study on data/
  python3 analyze.py --selftest # run the same pipeline on synthetic temperatures

Everything here follows PREREGISTRATION.md. Requires numpy and scipy.
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.linalg import cho_factor, cho_solve, solve_toeplitz

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
RESULTS = HERE / "results"

FIT_START = 1959 * 12 + 0          # 1959-01, month index = year*12 + (month-1)
ORIGIN_START = 1990 * 12 + 0       # 1990-01
HORIZONS = [1, 3, 6, 12, 24, 60, 120]
MEM = 360                          # residual memory window for fGn (months)
H_GRID = np.round(np.arange(0.50, 0.995, 0.01), 2)
CO2_WIN = 120                      # months of CO2 used to extrapolate
BLOCK = 60
NBOOT = 2000
SEED = 20261118
MODELS = ["M0", "M1", "M2", "M3", "M4", "M5"]


def mi(year, month):
    return year * 12 + (month - 1)


def label(m):
    return f"{m // 12:04d}-{m % 12 + 1:02d}"


# ---------------------------------------------------------------- loaders
def load_hadcrut():
    out = {}
    for line in (DATA / "hadcrut5.csv").read_text().splitlines()[1:]:
        t, v = line.split(",")[:2]
        y, m = t.split("-")
        out[mi(int(y), int(m))] = float(v)
    return out


def load_gistemp():
    out = {}
    lines = (DATA / "gistemp.csv").read_text().splitlines()
    for line in lines[2:]:
        p = line.split(",")
        if not p[0].isdigit():
            continue
        for k in range(12):
            if p[1 + k].strip() not in ("***", ""):
                out[mi(int(p[0]), k + 1)] = float(p[1 + k])
    return out


def load_noaa():
    out = {}
    started = False
    for line in (DATA / "noaa.csv").read_text().splitlines():
        if line.startswith("Date,"):
            started = True
            continue
        if started and line.strip():
            t, v = line.split(",")[:2]
            v = float(v)
            if v > -900:
                out[mi(int(t[:4]), int(t[4:6]))] = v
    return out


def load_berkeley():
    """First data block: sea-ice temperature inferred from air temperatures."""
    out = {}
    in_block = False
    for line in (DATA / "berkeley.txt").read_text().splitlines():
        if "Sea Ice Temperature Inferred from Air Temperatures" in line:
            in_block = True
            continue
        if "Sea Ice Temperature Inferred from Water Temperatures" in line:
            break
        if not in_block or line.startswith("%") or not line.strip():
            continue
        p = line.split()
        if p[2] != "NaN":
            out[mi(int(p[0]), int(p[1]))] = float(p[2])
    return out


def load_co2():
    out = {}
    for line in (DATA / "co2_mlo.txt").read_text().splitlines():
        if line.startswith("#") or not line.strip():
            continue
        p = line.split()
        v = float(p[4])  # deseasonalized
        if v > 0:
            out[mi(int(p[0]), int(p[1]))] = v
    return out


def load_nino34():
    out = {}
    for line in (DATA / "nino34.txt").read_text().splitlines()[1:]:
        p = line.split()
        if len(p) != 13 or not p[0].isdigit():
            continue
        for k in range(12):
            v = float(p[1 + k])
            if v > -90:
                out[mi(int(p[0]), k + 1)] = v
    return out


RECORDS = {
    "HadCRUT5": load_hadcrut,
    "GISTEMP": load_gistemp,
    "NOAAGlobalTemp": load_noaa,
    "BerkeleyEarth": load_berkeley,
}


# ---------------------------------------------------------------- models
def co2_path(co2, origin, last_needed):
    """CO2 for months FIT_START..last_needed, using only CO2 known at origin.

    Months after the last CO2 value at or before the origin are extrapolated
    with a quadratic fitted to the CO2_WIN months up to that value."""
    known = [m for m in co2 if m <= origin]
    last = max(known)
    win = np.array([m for m in range(last - CO2_WIN + 1, last + 1) if m in co2])
    coef = np.polyfit(win - last, [co2[m] for m in win], 2)
    path = {}
    for m in range(FIT_START, last_needed + 1):
        path[m] = co2[m] if (m <= last and m in co2) else float(np.polyval(coef, m - last))
    return path


def fgn_acf(H, n):
    k = np.arange(n, dtype=float)
    return 0.5 * (np.abs(k + 1) ** (2 * H) - 2 * np.abs(k) ** (2 * H) + np.abs(k - 1) ** (2 * H))


def fgn_ml(x):
    """Profile maximum likelihood for H over H_GRID (zero-mean fGn)."""
    n = len(x)
    best = (-np.inf, None)
    for H in H_GRID:
        rho = fgn_acf(H, n)
        R = rho[np.abs(np.subtract.outer(np.arange(n), np.arange(n)))]
        c = cho_factor(R, lower=True)
        q = x @ cho_solve(c, x)
        logdet = 2 * np.log(np.diag(c[0])).sum()
        ll = -0.5 * n * np.log(q / n) - 0.5 * logdet
        if ll > best[0]:
            best = (ll, float(H))
    return best[1]


def fgn_forecast(x, H, h):
    """Conditional mean of x[n+h-1] given x[0..n-1], zero-mean fGn."""
    n = len(x)
    rho = fgn_acf(H, n + h)
    # covariance of future with past x[j]: rho[n - 1 - j + h]; past ordered oldest..newest
    c = rho[np.arange(n - 1, -1, -1) + h]
    w = solve_toeplitz(rho[:n], c)
    return float(w @ x)


def ar_fit(x, p, intercept):
    X = np.column_stack([x[p - k - 1:len(x) - k - 1] for k in range(p)])
    if intercept:
        X = np.column_stack([np.ones(len(X)), X])
    y = x[p:]
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    return beta


def ar_forecast(x, beta, p, intercept, h):
    hist = list(x[-p:])
    for _ in range(h):
        lags = hist[::-1][:p]
        v = (beta[0] + beta[1:] @ lags) if intercept else beta @ lags
        hist.append(float(v))
    return hist[-1]


# ---------------------------------------------------------------- hindcast
def hindcast(T, co2):
    last_T = max(T)
    errs = {m: {h: [] for h in HORIZONS} for m in MODELS}
    origins = {h: [] for h in HORIZONS}
    params = {}
    cur = None
    for o in range(ORIGIN_START, last_T):
        months = [m for m in range(FIT_START, o + 1) if m in T]
        if cur is None or o % 12 == 0:
            path = co2_path(co2, o, o)
            Xs = np.column_stack([np.ones(len(months)), np.log2([path[m] for m in months])])
            ab, *_ = np.linalg.lstsq(Xs, np.array([T[m] for m in months]), rcond=None)
            r = np.array([T[m] for m in months]) - Xs @ ab
            raw = np.array([T[m] for m in months])
            cur = {
                "ab": ab,
                "phi": float(r[1:] @ r[:-1] / (r[:-1] @ r[:-1])),
                "H": fgn_ml(r[-MEM:]),
                "ar12": ar_fit(r, 12, False),
                "ar24": ar_fit(raw, 24, True),
            }
            params[label(o)] = {"a": float(ab[0]), "b": float(ab[1]), "phi": cur["phi"], "H": cur["H"]}
        maxh = max(HORIZONS)
        path = co2_path(co2, o, o + maxh)
        skel = lambda m: cur["ab"][0] + cur["ab"][1] * np.log2(path[m])
        r = np.array([T[m] - skel(m) for m in months])
        raw = np.array([T[m] for m in months])
        for h in HORIZONS:
            tgt = o + h
            if tgt not in T:
                continue
            s = skel(tgt)
            f = {
                "M0": s,
                "M1": T[o],
                "M2": s + cur["phi"] ** h * r[-1],
                "M3": s + fgn_forecast(r[-MEM:], cur["H"], h),
                "M4": s + ar_forecast(r, cur["ar12"], 12, False, h),
                "M5": ar_forecast(raw, cur["ar24"], 24, True, h),
            }
            for m in MODELS:
                errs[m][h].append(f[m] - T[tgt])
            origins[h].append(o)
    return errs, origins, params


# ---------------------------------------------------------------- statistics
def block_indices(n, rng):
    nb = int(np.ceil(n / BLOCK))
    starts = rng.integers(0, max(1, n - BLOCK + 1), nb)
    return np.concatenate([np.arange(s, min(s + BLOCK, n)) for s in starts])[:n]


def skill_ci(em, er, rng):
    em, er = np.asarray(em), np.asarray(er)
    point = 1 - (em ** 2).sum() / (er ** 2).sum()
    bs = []
    for _ in range(NBOOT):
        i = block_indices(len(em), rng)
        bs.append(1 - (em[i] ** 2).sum() / (er[i] ** 2).sum())
    lo, hi = np.percentile(bs, [2.5, 97.5])
    return float(point), float(lo), float(hi)


def corr_ci(a, b, rng):
    a, b = np.asarray(a), np.asarray(b)
    point = np.corrcoef(a, b)[0, 1]
    bs = []
    for _ in range(NBOOT):
        i = block_indices(len(a), rng)
        bs.append(np.corrcoef(a[i], b[i])[0, 1])
    lo, hi = np.percentile(bs, [2.5, 97.5])
    return float(point), float(lo), float(hi)


def haar(x, lags):
    out = []
    for L in lags:
        half = L // 2
        c = np.concatenate([[0.0], np.cumsum(x)])
        i = np.arange(0, len(x) - L + 1)
        f = (c[i + L] - c[i + half]) / half - (c[i + half] - c[i]) / half
        out.append(np.sqrt(np.mean(f ** 2)))
    return np.array(out)


HAAR_LAGS = np.unique((np.round(np.geomspace(12, 240, 12) / 2) * 2).astype(int))


def haar_slope(x):
    s = haar(x, HAAR_LAGS)
    return float(np.polyfit(np.log(HAAR_LAGS), np.log(s), 1)[0]), s


_CHOL = {}


def fgn_sim(H, n, rng):
    if (H, n) not in _CHOL:
        rho = fgn_acf(H, n)
        R = rho[np.abs(np.subtract.outer(np.arange(n), np.arange(n)))]
        _CHOL[(H, n)] = np.linalg.cholesky(R + 1e-12 * np.eye(n))
    return _CHOL[(H, n)] @ rng.standard_normal(n)


# ---------------------------------------------------------------- study
def evaluate(T, co2, nino, rng):
    errs, origins, params = hindcast(T, co2)
    out = {"n_origins": {h: len(origins[h]) for h in HORIZONS}, "rmse": {}, "skill": {}, "params": params}
    for m in MODELS:
        out["rmse"][m] = {h: float(np.sqrt(np.mean(np.square(errs[m][h])))) for h in HORIZONS}
    for (m, r) in [("M3", "M2"), ("M3", "M4"), ("M3", "M5"), ("M3", "M0"), ("M3", "M1"), ("M0", "M5"), ("M4", "M2")]:
        out["skill"][f"{m}_vs_{r}"] = {h: skill_ci(errs[m][h], errs[r][h], rng) for h in HORIZONS}
    # H4: correlation of M3 error with Nino 3.4 at origin
    out["nino_corr"] = {}
    for h in HORIZONS:
        pairs = [(e, nino[o]) for e, o in zip(errs["M3"][h], origins[h]) if o in nino]
        a, b = zip(*pairs)
        out["nino_corr"][h] = corr_ci(a, b, rng)
    # H5: Haar exponent of the full skeleton residual
    months = [m for m in range(FIT_START, max(T) + 1) if m in T]
    path = co2_path(co2, max(T), max(T))
    Xs = np.column_stack([np.ones(len(months)), np.log2([path[m] for m in months])])
    y = np.array([T[m] for m in months])
    ab, *_ = np.linalg.lstsq(Xs, y, rcond=None)
    r = y - Xs @ ab
    slope, s = haar_slope(r)
    Hfull = fgn_ml(r[-MEM:])
    sims = [haar_slope(fgn_sim(Hfull, len(r), rng))[0] for _ in range(300)]
    out["haar"] = {
        "lags": HAAR_LAGS.tolist(),
        "fluct": s.tolist(),
        "slope": slope,
        "fgn_H": Hfull,
        "fgn_expected_slope": Hfull - 1,
        "fgn_slope_interval": [float(np.percentile(sims, 2.5)), float(np.percentile(sims, 97.5))],
        "skeleton": {"a": float(ab[0]), "b_per_doubling": float(ab[1])},
    }
    out["last_month"] = label(max(T))
    return out


def verdicts(results):
    long12 = [h for h in HORIZONS if h >= 12]
    long24 = [h for h in HORIZONS if h >= 24]
    v = {}

    def tally(cond_s, cond_r):
        s = sum(cond_s(R) for R in results.values())
        r = sum(cond_r(R) for R in results.values())
        return "supported" if s >= 3 else "refuted" if r >= 3 else "undecided", s, r

    v["H1"] = tally(lambda R: all(R["skill"]["M3_vs_M2"][h][1] > 0 for h in long12),
                    lambda R: all(R["skill"]["M3_vs_M2"][h][0] <= 0 for h in long12))
    v["H2"] = tally(lambda R: all(R["rmse"]["M3"][h] ** 2 <= 1.05 * R["rmse"]["M4"][h] ** 2 for h in long12),
                    lambda R: all(R["rmse"]["M3"][h] ** 2 > 1.05 * R["rmse"]["M4"][h] ** 2 for h in long12))
    v["H3"] = tally(lambda R: all(R["skill"]["M3_vs_M5"][h][1] > 0 for h in long24),
                    lambda R: all(R["skill"]["M3_vs_M5"][h][0] <= 0 for h in long24))
    v["H4"] = tally(lambda R: all(R["nino_corr"][h][1] > 0 or R["nino_corr"][h][2] < 0 for h in [1, 3, 6]),
                    lambda R: all(R["nino_corr"][h][1] <= 0 <= R["nino_corr"][h][2] for h in [1, 3, 6]))
    v["H5"] = tally(lambda R: R["haar"]["slope"] < 0, lambda R: R["haar"]["slope"] >= 0)
    return {k: {"verdict": a, "records_supporting": b, "records_refuting": c} for k, (a, b, c) in v.items()}


def table(results):
    lines = []
    for name, R in results.items():
        lines.append(f"\n### {name} (to {R['last_month']})\n")
        lines.append("| h (months) | " + " | ".join(f"RMSE {m}" for m in MODELS) + " | M3 vs M2 | M3 vs M4 | M3 vs M5 | r(err M3, Nino3.4) |")
        lines.append("|---" * (len(MODELS) + 5) + "|")
        for h in HORIZONS:
            row = [f"{R['rmse'][m][h]:.3f}" for m in MODELS]
            sk = [R["skill"][k][h] for k in ("M3_vs_M2", "M3_vs_M4", "M3_vs_M5")]
            nc = R["nino_corr"][h]
            lines.append(f"| {h} | " + " | ".join(row) + " | " + " | ".join(f"{p:+.3f} [{lo:+.3f}, {hi:+.3f}]" for p, lo, hi in sk)
                         + f" | {nc[0]:+.2f} [{nc[1]:+.2f}, {nc[2]:+.2f}] |")
        hz = R["haar"]
        lines.append(f"\nHaar exponent of skeleton residual (lags 12-240 mo): {hz['slope']:+.3f}; fGn H (last 360 mo) = {hz['fgn_H']:.2f}, "
                     f"expected {hz['fgn_expected_slope']:+.2f}, fGn sampling interval [{hz['fgn_slope_interval'][0]:+.3f}, {hz['fgn_slope_interval'][1]:+.3f}]. "
                     f"Skeleton: {hz['skeleton']['b_per_doubling']:.2f} C per CO2 doubling (transient, statistical).")
    return "\n".join(lines)


def main():
    rng = np.random.default_rng(SEED)
    co2, nino = load_co2(), load_nino34()
    if "--selftest" in sys.argv:
        # synthetic temperature: known skeleton + fGn(H=0.9) noise, sd 0.1 C
        months = sorted(m for m in co2 if m >= FIT_START)
        x = fgn_sim(0.9, len(months), np.random.default_rng(1)) * 0.1
        T = {m: -6.0 + 2.0 * np.log2(co2[m]) + x[i] for i, m in enumerate(months)}
        R = evaluate(T, co2, nino, rng)
        print(json.dumps({"rmse": R["rmse"], "H_fits": sorted({p["H"] for p in R["params"].values()}),
                          "b_fits": [round(p["b"], 2) for p in list(R["params"].values())[::6]],
                          "haar": {k: R["haar"][k] for k in ("slope", "fgn_H", "fgn_slope_interval")},
                          "M3_vs_M2": R["skill"]["M3_vs_M2"]}, indent=1))
        return
    results = {name: evaluate(load(), co2, nino, rng) for name, load in RECORDS.items()}
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "study1.json").write_text(json.dumps({"results": results, "verdicts": verdicts(results)}, indent=1))
    md = "# Study 1 results\n\nComputed by `analyze.py` from the files in `data/`.\n" + table(results)
    md += "\n\n## Verdicts\n\n" + "\n".join(f"- {k}: {v['verdict']} ({v['records_supporting']} supporting, {v['records_refuting']} refuting)"
                                          for k, v in verdicts(results).items()) + "\n"
    (RESULTS / "study1.md").write_text(md)
    print(md)


if __name__ == "__main__":
    main()
