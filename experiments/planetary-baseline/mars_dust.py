"""Study 4b: dust in the Mars pressure residual. See PREREGISTRATION_study4b.md."""
import csv
import json
import sys

import numpy as np

import analyze as A
import mars as M

DUST = {"Viking 1": "dust_viking1.csv", "Viking 2": "dust_viking2.csv", "InSight": "dust_insight.csv"}


def load_tau(f):
    rows = list(csv.DictReader(open(A.DATA / "mars" / f)))
    return {int(r["sol"]): float(r["tau"]) for r in rows}


def tau_interp(tau, sol):
    s = np.array(sorted(tau)); v = np.array([tau[k] for k in s])
    x = np.interp(sol, s, v)
    j = np.searchsorted(s, sol)
    ok = (sol >= s[0]) & (sol <= s[-1])
    jj = np.clip(j, 1, len(s) - 1)
    ok &= (s[jj] - s[jj - 1]) <= 30
    return x, ok


def haar_slope(sol, r):
    idx = np.floor(sol * 24).astype(int)
    grid = np.full(idx.max() - idx.min() + 1, np.nan)
    grid[idx - idx.min()] = r
    lags, fl = [], []
    for s in [6, 8, 12, 16, 24, 32, 48, 64, 96]:
        f, _ = M.haar_gappy(grid, s * 24)
        if not np.isnan(f):
            lags.append(s); fl.append(f)
    slope = float(np.polyfit(np.log(lags), np.log(fl), 1)[0]) if len(lags) >= 4 else None
    return slope, dict(zip(lags, fl))


def analyse(d, tau, rng):
    sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
    t, ok = tau_interp(tau, sol)
    sol, ls, p, t = sol[ok], ls[ok], p[ok], t[ok]
    X0 = np.column_stack([M.seasonal(ls), M.diurnal(sol, ls)])
    X1 = np.column_stack([X0, t, t * np.cos(2 * np.pi * (sol % 1))])
    out = {"hours": int(len(sol)), "sols": int(len(np.unique(np.floor(sol))))}
    for tag, X in (("no_dust", X0), ("dust", X1)):
        b, *_ = np.linalg.lstsq(X, p, rcond=None)
        r = p - X @ b
        sl, fl = haar_slope(sol, r)
        out[tag] = {"slope_6_96": sl, "haar": fl, "resid_var": float(np.var(r))}
        if tag == "dust":
            out[tag]["dust_coef_pa_per_tau"] = [float(b[-2]), float(b[-1])]
        if tag == "no_dust":
            day = np.floor(sol).astype(int)
            pairs = []
            for s in np.unique(day):
                m = day == s
                if m.sum() >= 12 and s in tau:
                    pairs.append((float(r[m].mean()), tau[s]))
            a, c = map(np.array, zip(*pairs))
            A.BLOCK = 30
            # block bootstrap in sol order
            pt = float(np.corrcoef(a, c)[0, 1]); bs = []
            for _ in range(A.NBOOT):
                i = A.block_indices(len(a), rng); bs.append(np.corrcoef(a[i], c[i])[0, 1])
            out["corr_resid_tau"] = [pt, float(np.percentile(bs, 2.5)), float(np.percentile(bs, 97.5))]
            out["n_corr_sols"] = len(pairs)
    return out


def synthetic():
    d = M.synthetic()
    sol = d[:, 0]
    tau_s = {s: 0.5 + 0.8 * np.exp(-((s - 400) / 40.0) ** 2) + 0.3 * np.exp(-((s - 1100) / 60.0) ** 2) for s in range(0, 1500, 7)}
    t, _ = tau_interp(tau_s, sol)
    d = d.copy(); d[:, 2] += 15 * t
    return d, tau_s


def main():
    rng = np.random.default_rng(A.SEED)
    if "--selftest" in sys.argv:
        d, tau = synthetic()
        print(json.dumps(analyse(d, tau, rng), indent=1, default=str)[:2000])
        return
    P = M.load()
    res = {k: analyse(P[M.LANDERS[k]], load_tau(f), rng) for k, f in DUST.items()}

    def tally(cs, cr):
        s = sum(cs(R) for R in res.values()); r = sum(cr(R) for R in res.values())
        return {"verdict": "supported" if s >= 2 else "refuted" if r >= 2 else "undecided", "supporting": s, "refuting": r}
    v = {"H15": tally(lambda R: R["corr_resid_tau"][1] > 0 or R["corr_resid_tau"][2] < 0,
                      lambda R: R["corr_resid_tau"][1] <= 0 <= R["corr_resid_tau"][2]),
         "H16": tally(lambda R: R["dust"]["slope_6_96"] is not None and R["dust"]["slope_6_96"] < 0,
                      lambda R: R["dust"]["slope_6_96"] is not None and R["dust"]["slope_6_96"] >= 0)}
    (A.RESULTS / "study4b.json").write_text(json.dumps({"results": res, "verdicts": v}, indent=1))
    L = ["# Study 4b results (dust in the Mars pressure residual)\n",
         "| Lander | hours | sols | r(daily residual, tau) [95%] | n sols | Haar slope 6-96, no dust | with dust | residual variance no dust / dust (Pa^2) | dust coef (Pa per unit tau; tide term) |",
         "|---|---|---|---|---|---|---|---|---|"]
    fs = lambda x: "—" if x is None else f"{x:+.3f}"
    for k, R in res.items():
        c = R["corr_resid_tau"]
        L.append(f"| {k} | {R['hours']} | {R['sols']} | {c[0]:+.2f} [{c[1]:+.2f}, {c[2]:+.2f}] | {R['n_corr_sols']} | {fs(R['no_dust']['slope_6_96'])} | "
                 f"{fs(R['dust']['slope_6_96'])} | {R['no_dust']['resid_var']:.1f} / {R['dust']['resid_var']:.1f} | "
                 f"{R['dust']['dust_coef_pa_per_tau'][0]:+.1f}; {R['dust']['dust_coef_pa_per_tau'][1]:+.1f} |")
    L.append("\nHaar lags available (sols), no dust / dust:\n")
    for k, R in res.items():
        L.append(f"- {k}: " + ", ".join(f"{l}: {R['no_dust']['haar'][l]:.2f}/{R['dust']['haar'][l]:.2f}" for l in R["no_dust"]["haar"]))
    L += ["\n## Verdicts\n"] + [f"- {k}: {x['verdict']} ({x['supporting']} supporting, {x['refuting']} refuting)" for k, x in v.items()]
    (A.RESULTS / "study4b.md").write_text("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()
