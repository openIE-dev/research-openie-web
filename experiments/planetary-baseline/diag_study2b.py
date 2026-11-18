"""Post hoc diagnostics for Study 2b (not preregistered). Why does the forcing skeleton lose?
(a) oracle: future annual forcing known (removes forcing-extrapolation error);
(b) split: separate sensitivities for anthropogenic and natural (volcanic + solar) forcing;
(c) both. Skeleton-only forecasts (F0-type), skill against the CO2 skeleton M0."""
import json
import numpy as np
import analyze as A
import study2b as S


def path_parts(erf, last_year, end, oracle):
    ly = 2024 if oracle else last_year
    out = {}
    for k in ("anthro", "nat"):
        e2 = {y: {"anthro": v["anthro"] if k == "anthro" else 0.0,
                  "volcanic": v["volcanic"] if k == "nat" else 0.0,
                  "solar": v["solar"] if k == "nat" else 0.0} for y, v in erf.items()}
        out[k] = S.forcing_path(e2, ly, end)
    return out


def run(T, erf, oracle, split):
    co2 = A.load_co2()
    e = {h: [] for h in A.HORIZONS}; ec = {h: [] for h in A.HORIZONS}
    cur = None; maxh = max(A.HORIZONS)
    for o in range(A.ORIGIN_START, max(T)):
        months = [m for m in range(A.FIT_START, o + 1) if m in T]
        y = np.array([T[m] for m in months])
        P = path_parts(erf, o // 12 - 1, o + maxh, oracle)
        if cur is None or o % 12 == 0:
            best = None
            for tau in S.TAUS:
                Ra, Rn = S.response(P["anthro"], tau, o), S.response(P["nat"], tau, o)
                cols = [[Ra[m] for m in months], [Rn[m] for m in months]] if split else [[Ra[m] + Rn[m] for m in months]]
                X = np.column_stack([np.ones(len(months))] + cols)
                b, *_ = np.linalg.lstsq(X, y, rcond=None)
                sse = float(np.sum((y - X @ b) ** 2))
                if best is None or sse < best[0]:
                    best = (sse, tau, b)
            path = A.co2_path(co2, o, o)
            Xc = np.column_stack([np.ones(len(months)), np.log2([path[m] for m in months])])
            bc, *_ = np.linalg.lstsq(Xc, y, rcond=None)
            cur = {"tau": best[1], "b": best[2], "bc": bc}
        Ra, Rn = S.response(P["anthro"], cur["tau"], o + maxh), S.response(P["nat"], cur["tau"], o + maxh)
        b = cur["b"]
        sk = (lambda m: b[0] + b[1] * Ra[m] + b[2] * Rn[m]) if split else (lambda m: b[0] + b[1] * (Ra[m] + Rn[m]))
        cp = A.co2_path(co2, o, o + maxh)
        for h in A.HORIZONS:
            if o + h in T:
                e[h].append(sk(o + h) - T[o + h]); ec[h].append(cur["bc"][0] + cur["bc"][1] * np.log2(cp[o + h]) - T[o + h])
    return e, ec, cur


erf = S.load_erf()
out = {}
for name, load in A.RECORDS.items():
    T = load(); out[name] = {}
    for tag, oracle, split in (("baseline", False, False), ("oracle", True, False), ("split", False, True), ("oracle+split", True, True)):
        e, ec, cur = run(T, erf, oracle, split)
        out[name][tag] = {"skill_vs_M0": {h: round(1 - np.mean(np.square(e[h])) / np.mean(np.square(ec[h])), 3) for h in (12, 24, 60, 120)},
                          "tau": cur["tau"], "lambdas": [round(float(x), 3) for x in cur["b"][1:]]}
    print(name, json.dumps(out[name]))
(A.RESULTS / "diag_study2b.json").write_text(json.dumps(out, indent=1))
