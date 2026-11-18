"""Post hoc, descriptive (not preregistered): Study 5 residual by latitude band and hemisphere."""
import json
import numpy as np
import analyze as A
import mercury as Me

d = Me.load(); S = Me.skeleton(d)
out = {}
edges = [-90, -60, -40, -20, 0, 20, 40, 60, 90]
for b in (1, 2):
    m = (d["band"] == b) & ~np.isnan(S)
    R = d["na_kR"][m] / S[m] - 1; lat = d["lat_deg"][m]
    rows = []
    for lo, hi in zip(edges[:-1], edges[1:]):
        k = (lat >= lo) & (lat < hi)
        if k.sum() >= 30:
            rows.append({"lat": f"{lo} to {hi}", "n": int(k.sum()), "mean_R": float(R[k].mean()), "se": float(R[k].std() / np.sqrt(k.sum()))})
    out[b] = rows
    print(b, json.dumps(rows))
(A.RESULTS / "diag_mercury_lat.json").write_text(json.dumps(out, indent=1))
