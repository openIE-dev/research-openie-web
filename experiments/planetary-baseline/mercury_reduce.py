"""Reduce the full UVVS Na limb table (uvvs_na.csv, ~450 MB, rebuilt by mercury_fetch/) to
dayside passes for Study 5. Rules are fixed in PREREGISTRATION_study5.md.

  python3 mercury_reduce.py PATH/uvvs_na.csv   # writes data/mercury/dayside_passes.csv
"""
import csv
import math
import sys
from collections import defaultdict
from pathlib import Path

BANDS = [(0, 250), (250, 500), (500, 1000), (1000, 2000)]
OUT = Path(__file__).resolve().parent / "data" / "mercury" / "dayside_passes.csv"


def band(z):
    for i, (a, b) in enumerate(BANDS):
        if a <= z < b:
            return i
    return None


acc = defaultdict(lambda: [0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, "", 0.0, 0.0, 0.0])
kept = total = 0
with open(sys.argv[1]) as f:
    for r in csv.DictReader(f):
        total += 1
        lt = float(r["tan_lt_h"])
        if not (6 <= lt < 18) or r["tan_in_shadow"] != "0" or r["los_geom"] != "limb":
            continue
        if r["flag_grating_anomaly"] != "0" or r["flag_slit_touches_surface"] != "0" or r["flag_geom_mismatch"] != "0":
            continue
        b = band(float(r["tan_alt_km"]))
        if b is None:
            continue
        kept += 1
        key = (int(r["mercury_year"]), int(r["orbit"]), b, int(lt))
        a = acc[key]
        lon = math.radians(float(r["tan_lon_deg"]))
        a[0] += 1
        a[1] += float(r["na_kR"])
        t = math.radians(float(r["taa_deg"]))  # circular mean of TAA
        a[2] += math.cos(t)
        a[9] += math.sin(t)
        a[3] += math.cos(2 * lon)
        a[10] += math.cos(lon)
        a[11] += math.sin(lon)
        a[4] += float(r["tan_lat_deg"])
        a[5] += float(r["r_helio_au"])
        a[6] += float(r["vr_helio_kms"])
        a[7] += float(r["tan_alt_km"])
        a[8] = a[8] or r["utc"]
with open(OUT, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["mercury_year", "orbit", "band", "lt_hour", "n", "na_kR", "taa_deg", "cos2lon", "lat_deg",
                "r_helio_au", "vr_kms", "alt_km", "utc_first", "coslon", "sinlon"])
    for k in sorted(acc, key=lambda k: (acc[k][8], k[2], k[3])):
        a = acc[k]; n = a[0]
        w.writerow([*k, n, f"{a[1]/n:.4f}", f"{math.degrees(math.atan2(a[9], a[2])) % 360:.3f}", f"{a[3]/n:.4f}", f"{a[4]/n:.3f}",
                    f"{a[5]/n:.5f}", f"{a[6]/n:.3f}", f"{a[7]/n:.1f}", a[8], f"{a[10]/n:.4f}", f"{a[11]/n:.4f}"])
print(f"rows read {total}, dayside limb rows kept {kept}, passes {len(acc)} -> {OUT}")
