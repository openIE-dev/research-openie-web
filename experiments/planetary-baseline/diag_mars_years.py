"""Post hoc diagnostic for Studies 4 and 4b (not preregistered): does a seasonal skeleton that
may differ from one Mars year to the next remove the residual rise past 16 sols? The seasonal
harmonics (k = 0..4 in Ls) are fitted separately for each Mars year of the record (sol // 669);
the diurnal part is shared, as in Study 4."""
import json
import numpy as np
import analyze as A
import mars as M
import mars_dust as MD

out = {}
P = M.load()
for k, key in M.LANDERS.items():
    d = P[key]; sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
    yr = (sol // M.YEAR1).astype(int)
    S = M.seasonal(ls)
    blocks = [S * (yr == y)[:, None] for y in np.unique(yr)]
    X0 = np.column_stack([S, M.diurnal(sol, ls)])
    X1 = np.column_stack(blocks + [M.diurnal(sol, ls)])
    res = {}
    for tag, X in (("shared_seasons", X0), ("per_year_seasons", X1)):
        b, *_ = np.linalg.lstsq(X, p, rcond=None)
        sl, fl = MD.haar_slope(sol, p - X @ b)
        res[tag] = {"slope_6_96": sl, "haar_96": fl.get(96), "params": X.shape[1]}
    res["mars_years"] = int(len(np.unique(yr)))
    out[k] = res
    print(k, json.dumps(res))
(A.RESULTS / "diag_mars_years.json").write_text(json.dumps(out, indent=1))

# Second post hoc check: finer seasonal resolution (harmonics up to 8 and 12), shared across years.
fine = {}
for k, key in M.LANDERS.items():
    d = P[key]; sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
    fine[k] = {}
    for kmax in (4, 8, 12):
        X = np.column_stack([M.seasonal(ls, kmax), M.diurnal(sol, ls)])
        b, *_ = np.linalg.lstsq(X, p, rcond=None)
        sl, fl = MD.haar_slope(sol, p - X @ b)
        fine[k][kmax] = {"slope_6_96": sl, "haar_96": fl.get(96)}
    print(k, "seasonal kmax", json.dumps(fine[k]))
out["finer_seasons"] = fine
(A.RESULTS / "diag_mars_years.json").write_text(json.dumps(out, indent=1))

# Third post hoc check (descriptive): where in the Viking 1 record is the slow rise?
d = P["viking1_vl_p"]; sol, ls, p = d[:, 0], d[:, 1], d[:, 2]
X = np.column_stack([M.seasonal(ls), M.diurnal(sol, ls)])
b, *_ = np.linalg.lstsq(X, p, rcond=None); r = p - X @ b
split = {}
for tag, m in (("years_1_2", sol < 1338), ("years_3_4", sol >= 1338)):
    sl, fl = MD.haar_slope(sol[m], r[m]); split[tag] = {"slope_6_96": sl, "haar_96": fl.get(96)}
print("Viking 1 by year pair", json.dumps(split))
out["viking1_by_years"] = split
(A.RESULTS / "diag_mars_years.json").write_text(json.dumps(out, indent=1))
