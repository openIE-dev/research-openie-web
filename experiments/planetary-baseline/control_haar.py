"""Post hoc control for Study 1 H5 (not preregistered): does fitting and removing the
CO2 skeleton by itself steepen the Haar exponent? Synthetic temperature = skeleton + fGn at
the fitted H; the skeleton is refitted and removed exactly as in analyze.evaluate."""
import json
import numpy as np
import analyze as A

co2 = A.load_co2()
months = sorted(m for m in co2 if m >= A.FIT_START)
X = np.column_stack([np.ones(len(months)), np.log2([co2[m] for m in months])])
rng = np.random.default_rng(A.SEED + 1)
out = {}
for H in (0.92, 0.96):
    sl = []
    for _ in range(300):
        y = X @ [-6.0, 2.0] + 0.1 * A.fgn_sim(H, len(months), rng)
        ab, *_ = np.linalg.lstsq(X, y, rcond=None)
        sl.append(A.haar_slope(y - X @ ab)[0])
    out[H] = {"median": float(np.median(sl)), "p2.5": float(np.percentile(sl, 2.5)), "p97.5": float(np.percentile(sl, 97.5)),
              "frac_below_-0.32": float(np.mean(np.array(sl) <= -0.32))}
print(json.dumps(out, indent=1))
(A.RESULTS / "control_haar.json").write_text(json.dumps(out, indent=1))
