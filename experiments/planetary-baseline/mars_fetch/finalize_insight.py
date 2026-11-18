"""Combine reduced InSight JSONL into the analysis CSV.

usage: python3 -I finalize_insight.py INDEX_JSON REDUCED_JSONL OUT_DIR
"""
import bisect, json, sys
from collections import defaultdict

idx_path, red_path, out = sys.argv[1:4]
idx = json.load(open(idx_path))


def lmst_abs(s):
    return int(s[:5]) + (int(s[6:8]) * 3600 + int(s[9:11]) * 60 + float(s[12:])) / 86400.0


# Ls anchor points from label start/stop (LMST, solar_longitude)
pts = {}
for d in idx:
    pts[lmst_abs(d['start_lmst'])] = d['start_ls']
    pts[lmst_abs(d['stop_lmst'])] = d['stop_ls']
xs = sorted(pts)
ys, off, prev = [], 0.0, None
for x in xs:
    y = pts[x]
    if prev is not None and y + off < prev - 180:
        off += 360.0
    ys.append(y + off); prev = y + off


def ls_at(x):
    i = bisect.bisect_left(xs, x)
    if i <= 0:
        return ys[0] % 360
    if i >= len(xs):
        return ys[-1] % 360
    x0, x1, y0, y1 = xs[i - 1], xs[i], ys[i - 1], ys[i]
    return (y0 + (y1 - y0) * (x - x0) / (x1 - x0)) % 360


acc = defaultdict(lambda: [0.0] * 10)
modes = defaultdict(set)
tot_bytes = 0
for ln in open(red_path):
    r = json.loads(ln)
    tot_bytes += r['bytes']
    for k, v in r['acc'].items():
        a = acc[k]
        for i in range(10):
            a[i] += v[i]
        modes[k].add(r['kind'][:2] + ':' + r['mode'])

keys = sorted(acc, key=lambda k: tuple(map(int, k.split(':'))))
np_ = nt = nboth = 0
with open(out + '/insight_hourly.csv', 'w') as f, open(out + '/insight_hourly_detail.csv', 'w') as g:
    f.write('dataset,sol,ls,pressure_pa,air_temp_k\n')
    g.write('dataset,sol,n_pressure_rows,n_temp_rows,bmy_air_temp_k,n_bmy,bpy_air_temp_k,n_bpy,sampling\n')
    for k in keys:
        sol, b = map(int, k.split(':'))
        a = acc[k]
        if a[1] == 0 and a[3] == 0:
            continue
        x = sol + (b + 0.5) / 24.0
        p = '%.3f' % (a[0] / a[1]) if a[1] else ''
        t = '%.3f' % (a[2] / a[3]) if a[3] else ''
        np_ += bool(a[1]); nt += bool(a[3]); nboth += bool(a[1] and a[3])
        f.write('insight,%.5f,%.3f,%s,%s\n' % (x, ls_at(x), p, t))
        g.write('insight,%.5f,%d,%d,%s,%d,%s,%d,%s\n' % (
            x, a[1], a[3], '%.3f' % (a[4] / a[5]) if a[5] else '', a[5],
            '%.3f' % (a[6] / a[7]) if a[7] else '', a[7], '|'.join(sorted(modes[k]))))
print('bins with P', np_, 'with T', nt, 'both', nboth, 'downloaded GB', tot_bytes / 1e9)
