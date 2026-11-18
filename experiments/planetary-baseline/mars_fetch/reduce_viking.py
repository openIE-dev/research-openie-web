"""Reduce Viking Lander MET (PDS volume VL_1001) to analysis CSVs.

usage: python3 -I reduce_viking.py VL_DATA_DIR OUT_DIR

Outputs (columns: dataset,sol,ls,pressure_pa,air_temp_k):
  viking_vl_p_hourly.csv   VL_P point pressures -> 1/24-sol bin means (VL1, VL2)
  viking_tbin25.csv        VL_TBIN native 1/25-sol bins (VL1 sols 1-45, VL2 1-1050), unflagged only
  viking_vl1_mbin25.csv    VL_MBIN native 1/25-sol bins (VL1 sols 1-350, splined/recovered)
Fixed-width byte positions are taken from the PDS3 labels (START_BYTE is 1-based).
"""
import math, os, sys
from collections import defaultdict

src, out = sys.argv[1:3]
SOL_SECONDS = 24 * 3600 + 39 * 60 + 35.25  # label: sol = 24 h 39 m 35.25 s (Earth units)
MB2PA = 100.0


def fld(line, start, nbytes):
    return line[start - 1:start - 1 + nbytes]


def circmean(degs):
    s = sum(math.sin(math.radians(d)) for d in degs)
    c = sum(math.cos(math.radians(d)) for d in degs)
    return math.degrees(math.atan2(s, c)) % 360.0


def fmt(x, nd):
    return '' if x is None else ('%.*f' % (nd, x))


# ---- VL_P: point-by-point pressure --------------------------------------
bins = defaultdict(lambda: [0.0, 0, []])
nraw = defaultdict(int)
for ln in open(os.path.join(src, 'vl_p.dat')):
    if len(ln.rstrip('\n')) < 36:
        continue
    sc = fld(ln, 1, 5).strip()
    ls = float(fld(ln, 8, 8))
    day = int(fld(ln, 16, 5))
    hh, mm, ss = int(fld(ln, 21, 3)), int(fld(ln, 24, 3)), int(fld(ln, 27, 3))
    p = float(fld(ln, 30, 7))
    frac = (hh * 3600 + mm * 60 + ss) / SOL_SECONDS
    if not (0 <= frac < 1.0005):
        continue
    b = min(int(frac * 24), 23)
    a = bins[(sc, day, b)]
    a[0] += p; a[1] += 1; a[2].append(ls)
    nraw[sc] += 1

rows = []
for (sc, day, b), (s, n, lss) in sorted(bins.items()):
    rows.append(('viking%s_vl_p' % sc[-1], day + (b + 0.5) / 24, circmean(lss), s / n * MB2PA, None, n))
with open(os.path.join(out, 'viking_vl_p_hourly.csv'), 'w') as f:
    f.write('dataset,sol,ls,pressure_pa,air_temp_k\n')
    for r in rows:
        f.write('%s,%.5f,%.3f,%.3f,\n' % r[:4])
with open(os.path.join(out, 'viking_vl_p_hourly_counts.csv'), 'w') as f:
    f.write('dataset,sol,n_pressure_samples\n')
    for r in rows:
        f.write('%s,%.5f,%d\n' % (r[0], r[1], r[5]))
print('VL_P raw samples', dict(nraw), 'bins', defaultdict(int, {}))
for ds in ('viking1_vl_p', 'viking2_vl_p'):
    rr = [r for r in rows if r[0] == ds]
    print(ds, 'bins', len(rr), 'sol range', rr[0][1], rr[-1][1], 'distinct sols', len({int(r[1]) for r in rr}))

# ---- VL_TBIN: 25 bins/sol, flagged ---------------------------------------
cnt = defaultdict(int)
with open(os.path.join(out, 'viking_tbin25.csv'), 'w') as f, \
        open(os.path.join(out, 'viking_tbin25_detail.csv'), 'w') as g:
    f.write('dataset,sol,ls,pressure_pa,air_temp_k\n')
    g.write('dataset,sol,press_tot,press_flag,t_nli_flag,tamb_nli_dev,tref_nli_mn\n')
    for ln in open(os.path.join(src, 'vl_tbin.dat')):
        if len(ln.rstrip('\n')) < 140:
            continue
        sc = fld(ln, 1, 4).strip()
        ls = float(fld(ln, 7, 8)); day = int(fld(ln, 15, 5)); b = int(fld(ln, 20, 3))
        ptot = int(fld(ln, 33, 5))
        pmean = float(fld(ln, 77, 6)); pflag = fld(ln, 83, 3).strip()
        tmean = float(fld(ln, 86, 7)); tdev = float(fld(ln, 93, 7)); tflag = fld(ln, 100, 3).strip()
        tref = float(fld(ln, 103, 7))
        p = pmean * MB2PA if (pflag == '' and ptot > 0 and pmean > 0) else None
        t = tmean if (tflag == '' and tmean > 0) else None
        if p is None and t is None:
            cnt[(sc, 'dropped')] += 1
            continue
        ds = 'viking%s_tbin25' % sc[-1]
        sol = day + (b - 0.5) / 25.0  # bins 1..25 span the sol from local midnight
        f.write('%s,%.5f,%.3f,%s,%s\n' % (ds, sol, ls, fmt(p, 2), fmt(t, 2)))
        g.write('%s,%.5f,%d,%s,%s,%.2f,%.2f\n' % (ds, sol, ptot, pflag, tflag, tdev, tref))
        cnt[(sc, 'rows')] += 1; cnt[(sc, 'p')] += p is not None; cnt[(sc, 't')] += t is not None
print('TBIN', dict(cnt))

# ---- VL_MBIN: VL1 sols 1-350, 25 bins/sol, no flags ----------------------
n = 0
with open(os.path.join(out, 'viking_vl1_mbin25.csv'), 'w') as f:
    f.write('dataset,sol,ls,pressure_pa,air_temp_k\n')
    for ln in open(os.path.join(src, 'vl_mbin.dat')):
        if len(ln.rstrip('\n')) < 50:
            continue
        ls = float(fld(ln, 8, 8)); day = int(fld(ln, 16, 4)); b = int(fld(ln, 20, 3))
        p = float(fld(ln, 23, 7)); t = float(fld(ln, 46, 8))
        f.write('viking1_mbin25,%.5f,%.3f,%s,%s\n' % (day + (b - 0.5) / 25.0, ls,
                fmt(p * MB2PA if p > 0 else None, 2), fmt(t if t > 0 else None, 2)))
        n += 1
print('MBIN rows', n)
