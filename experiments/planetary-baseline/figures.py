"""Draw the Study 1 figures from results/study1.json into public/figures/planetary/."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

HERE = Path(__file__).resolve().parent
OUT = HERE.parents[1] / "public" / "figures" / "planetary"
OUT.mkdir(parents=True, exist_ok=True)
R = json.loads((HERE / "results" / "study1.json").read_text())["results"]
REC = list(R)
H = [1, 3, 6, 12, 24, 60, 120]

# Reference categorical palette, fixed order; markers and direct labels carry identity too.
C = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"]
INK, INK2, GRID, SURF = "#1f1f1e", "#5c5b55", "#e4e3de", "#fcfcfb"
plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 11, "axes.edgecolor": INK2, "axes.labelcolor": INK,
    "xtick.color": INK2, "ytick.color": INK2, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.8, "figure.facecolor": SURF,
    "axes.facecolor": SURF, "svg.fonttype": "none", "legend.frameon": False,
})


def save(fig, name):
    fig.savefig(OUT / f"{name}.svg", bbox_inches="tight")
    fig.savefig(OUT / f"{name}.png", dpi=200, bbox_inches="tight")
    plt.close(fig)


# Figure 1: RMSE against horizon, mean over the four records.
names = {
    "M0": "M0 skeleton only", "M1": "M1 persistence", "M2": "M2 skeleton + AR(1)",
    "M3": "M3 skeleton + fGn", "M4": "M4 skeleton + AR(12)", "M5": "M5 AR(24), no skeleton",
}
marks = {"M0": "o", "M1": "s", "M2": "^", "M3": "D", "M4": "v", "M5": "P"}
fig, ax = plt.subplots(figsize=(8.5, 5))
for i, m in enumerate(names):
    y = [np.mean([R[r]["rmse"][m][str(h)] for r in REC]) for h in H]
    ax.plot(H, y, color=C[i], lw=2, marker=marks[m], ms=7, mec=SURF, mew=1.5, label=names[m])
    if m in ("M0", "M1", "M5"):
        ax.annotate(m, (H[-1], y[-1]), xytext=(8, 0), textcoords="offset points", va="center", color=INK, fontsize=10)
ax.set_xscale("log")
ax.set_xticks(H, [str(h) for h in H])
ax.minorticks_off()
ax.set_xlabel("Forecast horizon (months)")
ax.set_ylabel("RMSE (°C), mean of four records")
ax.set_title("Hindcast error 1990 onward: the skeleton holds the long range", loc="left", color=INK, fontsize=12)
ax.legend(loc="upper left", fontsize=9.5, ncol=2)
save(fig, "rmse-horizon")

# Figure 2: Haar fluctuation of the skeleton residual against two references.
fig, ax = plt.subplots(figsize=(8.5, 5))
for i, r in enumerate(REC):
    hz = R[r]["haar"]
    lags = np.array(hz["lags"]) / 12
    ax.plot(lags, hz["fluct"], color=C[i], lw=2, marker="osD^"[i], ms=6, mec=SURF, mew=1.2,
            label=f"{r}: slope {hz['slope']:+.2f}")
hz = R[REC[0]]["haar"]
lags = np.array(hz["lags"]) / 12
s0 = np.mean([R[r]["haar"]["fluct"][0] for r in REC])
Hm = np.mean([R[r]["haar"]["fgn_H"] for r in REC])
ax.plot(lags, s0 * (lags / lags[0]) ** (Hm - 1), color=INK2, lw=1.5, ls="--")
ax.annotate(f"fGn at fitted H = {Hm:.2f} (slope {Hm - 1:+.2f})", (lags[-1], s0 * (lags[-1] / lags[0]) ** (Hm - 1)),
            xytext=(0, 10), textcoords="offset points", ha="right", color=INK2, fontsize=9.5)
ax.plot(lags, s0 * (lags / lags[0]) ** -0.5, color=INK2, lw=1.5, ls=":")
ax.annotate("white noise (slope −0.5)", (2.2, s0 * (2.2 / lags[0]) ** -0.5),
            xytext=(6, 0), textcoords="offset points", ha="left", va="center", color=INK2, fontsize=9.5)
ax.set_xscale("log"); ax.set_yscale("log")
ax.set_xticks([1, 2, 5, 10, 20], ["1", "2", "5", "10", "20"])
ax.set_ylim(0.025, 0.15)
ax.set_yticks([0.04, 0.06, 0.1, 0.15], ["0.04", "0.06", "0.10", "0.15"])
ax.minorticks_off()
ax.set_xlabel("Averaging interval (years)")
ax.set_ylabel("RMS Haar fluctuation (°C)")
ax.set_title("Skeleton residual: fluctuations die faster than the fitted memory says", loc="left", color=INK, fontsize=12)
ax.legend(loc="lower left", fontsize=9.5)
save(fig, "haar-residual")

# Figure 3: correlation of the M3 error with Nino 3.4 at the origin.
fig, ax = plt.subplots(figsize=(8.5, 4.6))
x = np.arange(len(H))
for i, r in enumerate(REC):
    nc = np.array([R[r]["nino_corr"][str(h)] for h in H])
    off = (i - 1.5) * 0.13
    ax.errorbar(x + off, nc[:, 0], yerr=[nc[:, 0] - nc[:, 1], nc[:, 2] - nc[:, 0]], fmt="osD^"[i], color=C[i],
                ms=6, mec=SURF, mew=1.2, elinewidth=1.5, capsize=0, label=r)
ax.axhline(0, color=INK2, lw=1)
ax.set_xticks(x, [str(h) for h in H])
ax.set_xlabel("Forecast horizon (months)")
ax.set_ylabel("Correlation, M3 error vs Niño 3.4")
ax.set_title("The residual of the residual is ENSO, and it changes sign near two years", loc="left", color=INK, fontsize=12, pad=30)
ax.legend(loc="lower center", bbox_to_anchor=(0.5, 1.0), fontsize=9.5, ncol=4)
ax.set_ylim(-0.62, 0.42)
save(fig, "enso-residual")
print("wrote", sorted(p.name for p in OUT.iterdir()))

# Figure 4: Mars Haar fluctuation of the skeleton residual (Study 4), if computed.
p4 = HERE / "results" / "study4.json"
if p4.exists():
    M = json.loads(p4.read_text())["results"]
    fig, ax = plt.subplots(figsize=(8.5, 5))
    for i, (k, R) in enumerate(M.items()):
        a = R["A"]
        xs = [s for s, f in zip(a["lags_sol"], a["fluct_pa"]) if f is not None]
        ys = [f for f in a["fluct_pa"] if f is not None]
        ax.plot(xs, ys, color=C[i], lw=2, marker="osD"[i], ms=6, mec=SURF, mew=1.2, label=k)
    ax.axvline(1.8, color=INK2, lw=1.2, ls="--")
    ax.annotate("predicted break, 1.8 sols", (1.8, 0.47), xycoords=("data", "axes fraction"), xytext=(6, 0),
                textcoords="offset points", va="top", color=INK2, fontsize=9.5)
    ax.axvspan(0.2, 1, color=GRID, alpha=0.6, lw=0)
    ax.annotate("sub-sol: diurnal leftovers", (0.22, 0.03), xycoords=("data", "axes fraction"), color=INK2, fontsize=9)
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xticks([0.25, 1, 2, 4, 8, 16, 32, 64, 128], ["0.25", "1", "2", "4", "8", "16", "32", "64", "128"])
    ax.set_yticks([1, 2, 4, 8], ["1", "2", "4", "8"])
    ax.minorticks_off()
    ax.set_xlabel("Averaging interval (sols)")
    ax.set_ylabel("RMS Haar fluctuation of pressure residual (Pa)")
    ax.set_title("Mars: a break near two sols at Viking 2, then a rise past ten sols everywhere", loc="left", color=INK, fontsize=12)
    ax.legend(loc="lower left", bbox_to_anchor=(0.0, 0.08), fontsize=9.5)
    save(fig, "mars-haar")
