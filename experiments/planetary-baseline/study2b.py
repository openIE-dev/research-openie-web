"""Study 2b: forcing skeleton (one sensitivity, one response time). See PREREGISTRATION_study2b.md."""
import csv
import json
import sys

import numpy as np

import analyze as A

TAUS = [6, 12, 24, 48, 96]
START = A.mi(1850, 1)


def load_erf():
    rows = list(csv.DictReader(open(A.DATA / "erf_igcc.csv")))
    return {int(float(r[""])): {k: float(r[k]) for k in ("anthro", "volcanic", "solar")} for r in rows}


def forcing_path(erf, last_year, end_month):
    """Monthly total forcing START..end_month using annual ERF for years <= last_year only."""
    years = [y for y in sorted(erf) if y <= last_year]
    mids = np.array([A.mi(y, 7) - 0.5 for y in years])  # mid-year as month index
    comp = {k: np.array([erf[y][k] for y in years]) for k in ("anthro", "volcanic", "solar")}
    months = np.arange(START, end_month + 1)
    tl = mids[-1]
    out = np.zeros(len(months))
    an10 = np.polyfit(mids[-10:], comp["anthro"][-10:], 1)
    vbase = np.median(comp["volcanic"][[i for i, y in enumerate(years) if y >= 1959]])
    sol11 = comp["solar"][-11:].mean()
    for k in ("anthro", "volcanic", "solar"):
        inside = np.interp(months, mids, comp[k])
        after = months > tl
        if k == "anthro":
            inside[after] = np.polyval(an10, months[after])
        elif k == "volcanic":
            inside[after] = vbase + (comp[k][-1] - vbase) * np.exp(-(months[after] - tl) / 12.0)
        else:
            inside[after] = sol11
        out += inside
    return dict(zip(months.tolist(), out))


def response(F, tau, end_month):
    R, r = {}, F[START]
    for m in range(START, end_month + 1):
        r = r + (F[m] - r) / tau
        R[m] = r
    return R


def run(T, erf, nino, nowcast=False):
    errs = {m: {h: [] for h in A.HORIZONS} for m in ("M0", "M2", "M6", "F0", "F2", "F6")}
    co2 = A.load_co2()
    cur = None
    maxh = max(A.HORIZONS)
    for o in range(A.ORIGIN_START, max(T)):
        yo = o // 12
        months = [m for m in range(A.FIT_START, o + 1) if m in T]
        y = np.array([T[m] for m in months])
        F = forcing_path(erf, yo if nowcast else yo - 1, o + maxh)
        if cur is None or o % 12 == 0:
            best = None
            for tau in TAUS:
                R = response(F, tau, o)
                X = np.column_stack([np.ones(len(months)), [R[m] for m in months]])
                b, *_ = np.linalg.lstsq(X, y, rcond=None)
                sse = float(np.sum((y - X @ b) ** 2))
                if best is None or sse < best[0]:
                    best = (sse, tau, b)
            _, tau, b = best
            R = response(F, tau, o)
            rf = dict(zip(months, y - np.column_stack([np.ones(len(months)), [R[m] for m in months]]) @ b))
            path = A.co2_path(co2, o, o)
            Xc = np.column_stack([np.ones(len(months)), np.log2([path[m] for m in months])])
            bc, *_ = np.linalg.lstsq(Xc, y, rcond=None)
            rc = dict(zip(months, y - Xc @ bc))

            def phi_beta(rr):
                r = np.array(list(rr.values()))
                phi = float(r[1:] @ r[:-1] / (r[:-1] @ r[:-1]))
                beta = {}
                for h in A.HORIZONS:
                    pr = [(rr[q + h] - phi ** h * rr[q], nino[q]) for q in range(A.mi(1961, 1), o - h + 1)
                          if q in rr and q + h in rr and q in nino]
                    e, n = map(np.array, zip(*pr))
                    beta[h] = float(n @ e / (n @ n))
                return phi, beta
            cur = {"tau": tau, "b": b, "bc": bc, "f": phi_beta(rf), "c": phi_beta(rc)}
        R = response(F, cur["tau"], o + maxh)
        sf = lambda m: cur["b"][0] + cur["b"][1] * R[m]
        cpath = A.co2_path(co2, o, o + maxh)
        sc = lambda m: cur["bc"][0] + cur["bc"][1] * np.log2(cpath[m])
        rf0, rc0 = T[o] - sf(o), T[o] - sc(o)
        for h in A.HORIZONS:
            if o + h not in T or o not in nino:
                continue
            (pf, bf), (pc, bcn) = cur["f"], cur["c"]
            f = {"M0": sc(o + h), "M2": sc(o + h) + pc ** h * rc0, "F0": sf(o + h), "F2": sf(o + h) + pf ** h * rf0}
            f["M6"] = f["M2"] + bcn[h] * nino[o]
            f["F6"] = f["F2"] + bf[h] * nino[o]
            for m in f:
                errs[m][h].append(f[m] - T[o + h])
    return errs, cur


def main():
    rng = np.random.default_rng(A.SEED)
    erf, nino = load_erf(), A.load_nino34()
    if "--selftest" in sys.argv:
        F = forcing_path(erf, 2024, A.mi(2026, 12))
        R = response(F, 24, A.mi(2026, 12))
        x = A.fgn_sim(0.75, A.mi(2026, 12) - A.FIT_START + 1, np.random.default_rng(5)) * 0.08
        T = {m: -0.3 + 0.6 * R[m] + x[m - A.FIT_START] for m in range(A.FIT_START, A.mi(2026, 12) + 1)}
        errs, cur = run(T, erf, nino)
        print("tau", cur["tau"], "lambda", cur["b"][1])
        for h in (12, 24, 60):
            print(h, {k: round(float(np.sqrt(np.mean(np.square(errs[k][h])))), 4) for k in errs})
        return
    res, v = {}, {}
    for name, load in A.RECORDS.items():
        T = load()
        errs, cur = run(T, erf, nino)
        errs_n, _ = run(T, erf, nino, nowcast=True)
        R = {"tau_last": cur["tau"], "lambda_last": float(cur["b"][1]),
             "rmse": {m: {h: float(np.sqrt(np.mean(np.square(errs[m][h])))) for h in A.HORIZONS} for m in errs},
             "skill": {}}
        for a, b in (("F0", "M0"), ("F6", "M6"), ("F2", "M2"), ("F6", "F0")):
            R["skill"][f"{a}_vs_{b}"] = {h: A.skill_ci(errs[a][h], errs[b][h], rng) for h in A.HORIZONS}
        R["skill"]["F6n_vs_M6"] = {h: A.skill_ci(errs_n["F6"][h], errs[ "M6"][h], rng) for h in A.HORIZONS}
        res[name] = R

    def tally(cs, cr):
        s = sum(cs(R) for R in res.values()); r = sum(cr(R) for R in res.values())
        return {"verdict": "supported" if s >= 3 else "refuted" if r >= 3 else "undecided", "records_supporting": s, "records_refuting": r}
    sk = lambda R, k, h: R["skill"][k][h]
    v["H12"] = tally(lambda R: all(sk(R, "F0_vs_M0", h)[1] > 0 for h in (12, 24)), lambda R: all(sk(R, "F0_vs_M0", h)[0] <= 0 for h in (12, 24)))
    v["H13"] = tally(lambda R: all(sk(R, "F6_vs_M6", h)[1] > 0 for h in (12, 24)), lambda R: all(sk(R, "F6_vs_M6", h)[0] <= 0 for h in (12, 24)))
    (A.RESULTS / "study2b.json").write_text(json.dumps({"results": res, "verdicts": v}, indent=1))
    f = lambda x: f"{x[0]:+.3f} [{x[1]:+.3f}, {x[2]:+.3f}]"
    L = ["# Study 2b results (forcing skeleton)\n", "Computed by `study2b.py`.\n"]
    for name, R in res.items():
        L += [f"\n### {name} (last fit: tau {R['tau_last']} months, lambda {R['lambda_last']:.2f} C per W m-2)\n",
              "| h | RMSE M0 | RMSE F0 | RMSE M6 | RMSE F6 | F0 vs M0 | F6 vs M6 | F6 vs F0 | F6 nowcast vs M6 |", "|---" * 9 + "|"]
        for h in A.HORIZONS:
            L.append(f"| {h} | " + " | ".join(f"{R['rmse'][m][h]:.3f}" for m in ("M0", "F0", "M6", "F6")) + " | "
                     + " | ".join(f(R["skill"][k][h]) for k in ("F0_vs_M0", "F6_vs_M6", "F6_vs_F0", "F6n_vs_M6")) + " |")
    L += ["\n## Verdicts\n"] + [f"- {k}: {x['verdict']} ({x['records_supporting']} supporting, {x['records_refuting']} refuting)" for k, x in v.items()]
    (A.RESULTS / "study2b.md").write_text("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()
