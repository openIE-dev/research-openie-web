"""Study 6 rung 0: thermal Rossby number and L_D/a for four bodies. See PREREGISTRATION_study6.md.
Input ranges are approximate values from standard planetary fact sheets and reviews; they are
assumptions of this script, stated here so they can be changed."""
import json
import numpy as np
import analyze as A

DAY = 86400.0
BODIES = {
    #        Omega (s^-1)            a (m)     R_gas      DeltaT_h (K)   N (s^-1)          H (m)
    "Earth": (2 * np.pi / 86164.1, 6.371e6, (287, 287), (30, 50), (0.008, 0.012), (7.5e3, 8.5e3)),
    "Mars": (2 * np.pi / 88642.7, 3.390e6, (188, 192), (40, 90), (0.004, 0.008), (10e3, 12e3)),
    "Venus": (2 * np.pi / (243.02 * DAY), 6.052e6, (188, 192), (3, 20), (0.001, 0.004), (15e3, 16e3)),
    "Titan": (2 * np.pi / (15.945 * DAY), 2.575e6, (290, 297), (2, 5), (0.001, 0.003), (18e3, 21e3)),
}
OBSERVED = {"Earth": "baroclinic eddies", "Mars": "baroclinic eddies", "Venus": "axisymmetric", "Titan": "axisymmetric"}

rng = np.random.default_rng(A.SEED)
out = {}
for b, (om, a, R, dT, N, H) in BODIES.items():
    u = lambda lo_hi: rng.uniform(*lo_hi, 10000)
    ro = u(R) * u(dT) / (om * a) ** 2
    f = 2 * om * np.sin(np.radians(45))
    ld = u(N) * u(H) / (f * a)
    p = lambda x: [float(np.percentile(x, 5)), float(np.percentile(x, 95))]
    cls = "baroclinic eddies" if p(ro)[1] < 1 else "axisymmetric" if p(ro)[0] > 1 else "unclassified"
    out[b] = {"Ro_T_5_95": p(ro), "LD_over_a_5_95": p(ld), "predicted": cls, "observed": OBSERVED[b], "match": cls == OBSERVED[b]}
ok = all(v["predicted"] != "unclassified" for v in out.values())
verdict = "supported" if ok and all(v["match"] for v in out.values()) else \
    "refuted" if any(v["predicted"] != "unclassified" and not v["match"] for v in out.values()) else "undecided"
res = {"bodies": out, "H14": verdict}
(A.RESULTS / "study6.json").write_text(json.dumps(res, indent=1))
L = ["# Study 6 rung 0 results\n", "| Body | Ro_T (5th-95th pct) | L_D/a (5th-95th pct) | Predicted | Observed |", "|---|---|---|---|---|"]
for b, v in out.items():
    L.append(f"| {b} | {v['Ro_T_5_95'][0]:.3g} to {v['Ro_T_5_95'][1]:.3g} | {v['LD_over_a_5_95'][0]:.3g} to {v['LD_over_a_5_95'][1]:.3g} | {v['predicted']} | {v['observed']} |")
L.append(f"\nH14: {verdict}\n")
(A.RESULTS / "study6.md").write_text("\n".join(L))
print("\n".join(L))
