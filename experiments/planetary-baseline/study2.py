"""Study 2: M6 = skeleton + AR(1) + beta_h * Nino3.4(origin). See PREREGISTRATION_study2.md."""
import json
import numpy as np
import analyze as A

MODELS = ["M0", "M2", "M3", "M6"]


def run(T, co2, nino):
    last_T = max(T)
    errs = {m: {h: [] for h in A.HORIZONS} for m in MODELS}
    cur = None
    for o in range(A.ORIGIN_START, last_T):
        months = [m for m in range(A.FIT_START, o + 1) if m in T]
        if cur is None or o % 12 == 0:
            path0 = A.co2_path(co2, o, o)
            Xs = np.column_stack([np.ones(len(months)), np.log2([path0[m] for m in months])])
            ab, *_ = np.linalg.lstsq(Xs, np.array([T[m] for m in months]), rcond=None)
            rr = dict(zip(months, np.array([T[m] for m in months]) - Xs @ ab))
            r = np.array(list(rr.values()))
            phi = float(r[1:] @ r[:-1] / (r[:-1] @ r[:-1]))
            beta = {}
            for h in A.HORIZONS:
                pairs = [(rr[op + h] - phi ** h * rr[op], nino[op]) for op in range(A.mi(1961, 1), o - h + 1)
                         if op in rr and op + h in rr and op in nino]
                e, n = map(np.array, zip(*pairs))
                beta[h] = float(n @ e / (n @ n))
            cur = {"ab": ab, "phi": phi, "H": A.fgn_ml(r[-A.MEM:]), "beta": beta}
        path = A.co2_path(co2, o, o + max(A.HORIZONS))
        skel = lambda m: cur["ab"][0] + cur["ab"][1] * np.log2(path[m])
        r = np.array([T[m] - skel(m) for m in months])
        for h in A.HORIZONS:
            if o + h not in T or o not in nino:
                continue
            s = skel(o + h)
            m2 = s + cur["phi"] ** h * r[-1]
            f = {"M0": s, "M2": m2, "M3": s + A.fgn_forecast(r[-A.MEM:], cur["H"], h),
                 "M6": m2 + cur["beta"][h] * nino[o]}
            for m in MODELS:
                errs[m][h].append(f[m] - T[o + h])
    return errs, cur["beta"]


def main():
    rng = np.random.default_rng(A.SEED)
    co2, nino = A.load_co2(), A.load_nino34()
    res = {}
    for name, load in A.RECORDS.items():
        errs, beta = run(load(), co2, nino)
        res[name] = {
            "rmse": {m: {h: float(np.sqrt(np.mean(np.square(errs[m][h])))) for h in A.HORIZONS} for m in MODELS},
            "skill": {f"M6_vs_{r}": {h: A.skill_ci(errs["M6"][h], errs[r][h], rng) for h in A.HORIZONS} for r in ("M2", "M0", "M3")},
            "beta_last_fit": beta,
        }
    def tally(cs, cr):
        s = sum(cs(R) for R in res.values()); r = sum(cr(R) for R in res.values())
        return {"verdict": "supported" if s >= 3 else "refuted" if r >= 3 else "undecided", "records_supporting": s, "records_refuting": r}
    sk = lambda R, h: R["skill"]["M6_vs_M2"][h]
    verd = {"H6": tally(lambda R: all(sk(R, h)[1] > 0 for h in (1, 3, 6)), lambda R: all(sk(R, h)[0] <= 0 for h in (1, 3, 6))),
            "H7": tally(lambda R: sk(R, 24)[1] > 0, lambda R: sk(R, 24)[0] <= 0)}
    (A.RESULTS / "study2.json").write_text(json.dumps({"results": res, "verdicts": verd}, indent=1))
    lines = ["# Study 2 results\n", "Computed by `study2.py`. Skill = 1 - MSE(M6)/MSE(reference), 95% block-bootstrap interval.\n"]
    for name, R in res.items():
        lines += [f"\n### {name}\n", "| h | RMSE M0 | RMSE M2 | RMSE M3 | RMSE M6 | M6 vs M2 | M6 vs M0 | M6 vs M3 | beta_h (last fit) |", "|---" * 9 + "|"]
        for h in A.HORIZONS:
            s = [R["skill"][k][h] for k in ("M6_vs_M2", "M6_vs_M0", "M6_vs_M3")]
            lines.append(f"| {h} | " + " | ".join(f"{R['rmse'][m][h]:.3f}" for m in MODELS) + " | "
                         + " | ".join(f"{p:+.3f} [{lo:+.3f}, {hi:+.3f}]" for p, lo, hi in s) + f" | {R['beta_last_fit'][h]:+.3f} |")
    lines += ["\n## Verdicts\n"] + [f"- {k}: {v['verdict']} ({v['records_supporting']} supporting, {v['records_refuting']} refuting)" for k, v in verd.items()]
    (A.RESULTS / "study2.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
