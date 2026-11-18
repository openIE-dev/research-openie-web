"""Study 4c: finer seasonal skeleton on held-out Viking 1 years. See PREREGISTRATION_study4c.md."""
import json
import numpy as np
import analyze as A
import mars as M
import mars_dust as MD

d = M.load()["viking1_vl_p"]
sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
fit, test = sol < 1338, sol >= 1338
out = {}
for kmax in (4, 8):
    X = np.column_stack([M.seasonal(ls, kmax), M.diurnal(sol, ls)])
    b, *_ = np.linalg.lstsq(X[fit], p[fit], rcond=None)
    r = p[test] - X[test] @ b
    sl, fl = MD.haar_slope(sol[test], r)
    out[kmax] = {"heldout_slope_6_96": sl, "heldout_haar": fl, "heldout_resid_var": float(np.var(r)),
                 "heldout_resid_mean": float(np.mean(r)), "fit_hours": int(fit.sum()), "test_hours": int(test.sum())}
s8 = out[8]["heldout_slope_6_96"]
out["H17"] = "supported" if s8 is not None and s8 < 0 else "refuted" if s8 is not None else "undecided"
(A.RESULTS / "study4c.json").write_text(json.dumps(out, indent=1))
print(json.dumps(out, indent=1))
