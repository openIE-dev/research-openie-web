#!/usr/bin/env python3
"""Reduce lander optical-depth products to per-sol series (acquisition/reduction only).

Usage: python3 -I reduce_dust.py <downloads_dir> <pressure_dir> <out_dir>
  downloads_dir/viking/vl_opac.dat         PDS VL_1001 VL_OPAC (Colburn et al. 1989)
  downloads_dir/insight_pds/nsyt_tau.csv   PDS insight_cameras_tau nsyt_tau (Lemmon et al.)
  pressure_dir: experiments/planetary-baseline/data/mars (read only)
"""
import csv, math, sys, os, statistics
from collections import defaultdict

DL, PDIR, OUT = sys.argv[1:4]
VSOL = 88775.25  # Viking sol length in Earth seconds (VL label)


def circmean(vals):
    s = sum(math.sin(math.radians(v)) for v in vals)
    c = sum(math.cos(math.radians(v)) for v in vals)
    return math.degrees(math.atan2(s, c)) % 360.0


def dls(a, b):
    return (a - b + 180.0) % 360.0 - 180.0


def load_pressure(path, datasets):
    """Return {dataset: sorted list of (sol_float, ls)}."""
    d = defaultdict(list)
    with open(path) as f:
        for r in csv.DictReader(f):
            if r['dataset'] in datasets and r['ls']:
                d[r['dataset']].append((float(r['sol']), float(r['ls'])))
    for k in d:
        d[k].sort()
    return d


def interp_ls(series, s, maxgap=0.5):
    """Interpolate pressure-file Ls at fractional sol s; None if nearest bins are > maxgap sol away."""
    import bisect
    xs = [x for x, _ in series]
    i = bisect.bisect_left(xs, s)
    if i == 0 or i == len(xs):
        return None
    (x0, l0), (x1, l1) = series[i - 1], series[i]
    if s - x0 > maxgap or x1 - s > maxgap:
        return None
    return (l0 + dls(l1, l0) * (s - x0) / (x1 - x0)) % 360.0


def write(path, rows, cols):
    with open(path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(cols)
        w.writerows(rows)


report = []

# ---------------- Viking ----------------
press = load_pressure(os.path.join(PDIR, 'viking_vl_p_hourly.csv'), {'viking1_vl_p', 'viking2_vl_p'})
obs = []
with open(os.path.join(DL, 'viking', 'vl_opac.dat')) as f:
    for line in f:
        line = line.rstrip('\r\n')
        if not line.strip():
            continue
        o = dict(sc=line[0:4].strip(), cam=int(line[4:6]), vyear=int(line[6:8]), sol=int(line[8:12]),
                 hr=int(line[12:15]), mn=int(line[15:18]), tau=float(line[18:24]), flag=int(line[24:26]),
                 eday=float(line[26:35]), ls=float(line[35:43]), e_dig=float(line[43:50]),
                 e_dev=float(line[50:57]), e_vig=float(line[57:64]), e_i0=float(line[64:71]),
                 e_tot=float(line[71:78]))
        o['solf'] = o['sol'] + (o['hr'] * 3600 + o['mn'] * 60) / VSOL
        obs.append(o)
assert len(obs) == 1044, len(obs)

for sc, name, pds in (('VL1', 'viking1', 'viking1_vl_p'), ('VL2', 'viking2', 'viking2_vl_p')):
    L = [o for o in obs if o['sc'] == sc]
    # per-observation sidecar (all flags) + Ls alignment check
    diffs = []
    obsrows = []
    for o in L:
        pl = interp_ls(press[pds], o['solf'])
        d = None if pl is None else dls(o['ls'], pl)
        if d is not None:
            diffs.append(d)
        obsrows.append([name, f"{o['solf']:.5f}", f"{o['ls']:.3f}", f"{o['tau']:.3f}", o['flag'], o['cam'],
                        f"{o['hr']:02d}:{o['mn']:02d}", f"{o['e_tot']:.3f}", f"{o['e_dig']:.3f}",
                        f"{o['eday']:.3f}", '' if d is None else f"{d:.3f}"])
    write(os.path.join(OUT, f'dust_{name}_obs.csv'), obsrows,
          ['lander', 'sol', 'ls', 'tau', 'opacity_flag', 'camera_id', 'local_time_earth_hhmm', 'err_total',
           'err_digitize', 'earth_day_1976_ut', 'ls_minus_pressurefile_ls'])
    bysol = defaultdict(list)
    for o in L:
        bysol[o['sol']].append(o)
    rows = []
    flagonly = []
    for s in sorted(bysol):
        g = bysol[s]
        good = [o for o in g if o['flag'] == 0]
        bad = [o for o in g if o['flag'] != 0]
        if not good:
            flagonly.append((s, [(o['tau'], o['flag']) for o in bad]))
            continue
        tau = statistics.fmean(o['tau'] for o in good)
        ls = circmean([o['ls'] for o in good])
        times = ','.join(f"{o['hr']:02d}:{o['mn']:02d}" for o in good)
        errs = [o['e_tot'] for o in good if o['e_tot'] >= 0]
        note = f"n={len(good)}; local_times(Earth h:m)={times}"
        if len(good) > 1:
            note += f"; range={min(o['tau'] for o in good):.3f}-{max(o['tau'] for o in good):.3f}"
        if errs:
            note += f"; mean_err_total={statistics.fmean(errs):.3f}"
        if bad:
            note += '; excluded_flagged=' + ','.join(f"{o['tau']:.3f}(f{o['flag']})" for o in bad)
        rows.append([name, s, f"{ls:.3f}", f"{tau:.3f}", 'PDS_VL_OPAC_Colburn1989_0.67um_flag0_mean', note])
    write(os.path.join(OUT, f'dust_{name}.csv'), rows, ['lander', 'sol', 'ls', 'tau', 'tau_source', 'notes'])
    psols = sorted({int(math.floor(x)) for x, _ in press[pds]})
    inrange = [r for r in rows if psols[0] <= r[1] <= psols[-1]]
    withp = set(psols)
    report.append(f"== {name}: obs={len(L)} (flag0={sum(o['flag']==0 for o in L)}, flag1={sum(o['flag']==1 for o in L)}, "
                  f"flag2={sum(o['flag']==2 for o in L)}); sols with any obs={len(bysol)}; rows (flag0 sols)={len(rows)}; "
                  f"sol range {rows[0][1]}-{rows[-1][1]}; rows within pressure sol range={len(inrange)}; "
                  f"rows on sols that have pressure data={sum(r[1] in withp for r in rows)}")
    report.append(f"   flag-only sols ({len(flagonly)}): " + '; '.join(f"{s}:{v}" for s, v in flagonly))
    report.append(f"   viking year values: {sorted({o['vyear'] for o in L})}")
    if diffs:
        ad = [abs(x) for x in diffs]
        report.append(f"   Ls check vs pressure file (interp at obs sol fraction): n={len(diffs)} mean={statistics.fmean(diffs):+.4f} "
                      f"median|d|={statistics.median(ad):.4f} max|d|={max(ad):.4f} deg")
    # gaps > 10 sols between consecutive rows
    gaps = [(a[1], b[1]) for a, b in zip(rows, rows[1:]) if b[1] - a[1] > 10]
    report.append(f"   gaps >10 sols between tau rows ({len(gaps)}): " + ', '.join(f"{a}-{b}" for a, b in gaps))
    sp = [b[1] - a[1] for a, b in zip(rows, rows[1:])]
    report.append(f"   median spacing between tau sols={statistics.median(sp)}; tau min/median/max="
                  f"{min(float(r[3]) for r in rows):.3f}/{statistics.median(float(r[3]) for r in rows):.3f}/{max(float(r[3]) for r in rows):.3f}")

# ---------------- InSight ----------------
pi = load_pressure(os.path.join(PDIR, 'insight_hourly.csv'), {'insight'})['insight']
tobs = []
with open(os.path.join(DL, 'insight_pds', 'nsyt_tau.csv')) as f:
    for r in csv.reader(f):
        if not r or not r[0].strip():
            continue
        pid, solt, lmst, ls, tau, sig, fsig = r
        tobs.append(dict(pid=pid, solt=float(solt), lmst=float(lmst), ls=float(ls), tau=float(tau),
                         sig=float(sig), fsig=float(fsig), cam={'c': 'ICC', 'd': 'IDC'}.get(pid[0], pid[0]),
                         pidsol=int(pid[5:9])))
assert len(tobs) == 758, len(tobs)
mism = [o for o in tobs if int(math.floor(o['solt'])) != o['pidsol']]
for o in tobs:
    o['sol'] = o['pidsol']  # LMST sol from the product ID (sol of the image); equals floor(LTST decimal sol) for all rows
    o['solf'] = o['sol'] + o['lmst'] / 24.0
diffs = []
orows = []
for o in tobs:
    pl = interp_ls(pi, o['solf'])
    d = None if pl is None else dls(o['ls'], pl)
    if d is not None:
        diffs.append(d)
    orows.append(['insight', f"{o['solf']:.5f}", f"{o['ls']:.2f}", f"{o['tau']:.3f}", o['cam'], o['pid'],
                  f"{o['solt']:.4f}", f"{o['lmst']:.3f}", f"{o['sig']:.3f}", f"{o['fsig']:.3f}",
                  '' if d is None else f"{d:.3f}"])
write(os.path.join(OUT, 'dust_insight_obs.csv'), orows,
      ['lander', 'sol', 'ls', 'tau', 'camera', 'image_pid', 'sol_ltst_decimal', 'lmst_hours', 'sigma', 'fit_sigma',
       'ls_minus_pressurefile_ls'])
bysol = defaultdict(list)
for o in tobs:
    bysol[o['sol']].append(o)
rows = []
for s in sorted(bysol):
    g = bysol[s]
    tau = statistics.fmean(o['tau'] for o in g)
    ls = circmean([o['ls'] for o in g])
    cams = '+'.join(sorted({o['cam'] for o in g}))
    am = sum(o['lmst'] < 12 for o in g)
    note = (f"n={len(g)} (AM={am}, PM={len(g)-am}); cams={cams}; LMST_h=" + ','.join(f"{o['lmst']:.2f}" for o in g)
            + f"; mean_sigma={statistics.fmean(o['sig'] for o in g):.3f}")
    if len(g) > 1:
        note += f"; range={min(o['tau'] for o in g):.3f}-{max(o['tau'] for o in g):.3f}"
    if any(o['cam'] == 'ICC' and o['sol'] < 50 for o in g):
        note += "; CAUTION ICC before sol 50 (Lemmon et al. text says pre-sol-50 ICC data were discarded for lens debris; row is in the archive)"
    rows.append(['insight', s, f"{ls:.2f}", f"{tau:.3f}", 'PDS_insight_cameras_tau_v1.0_Lemmon_600nm_mean', note])
write(os.path.join(OUT, 'dust_insight.csv'), rows, ['lander', 'sol', 'ls', 'tau', 'tau_source', 'notes'])
psols = sorted({int(math.floor(x)) for x, _ in pi})
withp = set(psols)
inr = [r for r in rows if 4 <= r[1] <= 1219]
report.append(f"== insight: obs={len(tobs)} (ICC={sum(o['cam']=='ICC' for o in tobs)}, IDC={sum(o['cam']=='IDC' for o in tobs)}); "
              f"rows={len(rows)}; sol range {rows[0][1]}-{rows[-1][1]}; rows within sols 4-1219={len(inr)}; "
              f"rows on sols with pressure data={sum(r[1] in withp for r in rows)}")
report.append(f"   PID sol != floor(LTST decimal sol): {len(mism)}  {[ (o['pid'], o['solt']) for o in mism][:10]}")
report.append(f"   ICC obs before sol 50: {sum(o['cam']=='ICC' and o['sol']<50 for o in tobs)}")
ad = [abs(x) for x in diffs]
report.append(f"   Ls check vs pressure file (interp at sol+LMST/24): n={len(diffs)} mean={statistics.fmean(diffs):+.4f} "
              f"median|d|={statistics.median(ad):.4f} max|d|={max(ad):.4f} deg")
# Implied-LTST check: decimal-sol fraction minus LMST fraction (hours) -> should look like the equation of time
eot = [((o['solt'] % 1) * 24 - o['lmst'] + 12) % 24 - 12 for o in tobs]
report.append(f"   LTST(decimal sol frac) - LMST hours: min={min(eot):.3f} max={max(eot):.3f}")
gaps = [(a[1], b[1]) for a, b in zip(rows, rows[1:]) if b[1] - a[1] > 10]
report.append(f"   gaps >10 sols ({len(gaps)}): " + ', '.join(f"{a}-{b}" for a, b in gaps))
sp = [b[1] - a[1] for a, b in zip(rows, rows[1:])]
report.append(f"   median spacing={statistics.median(sp)}; tau min/median/max={min(float(r[3]) for r in rows):.3f}/"
              f"{statistics.median(float(r[3]) for r in rows):.3f}/{max(float(r[3]) for r in rows):.3f}")
report.append(f"   rows by sol block: " + ', '.join(f"{a}-{a+99}:{sum(a<=r[1]<a+100 for r in rows)}" for a in range(0, 1500, 100)))
print('\n'.join(report))
with open(os.path.join(OUT, 'reduce_report.txt'), 'w') as f:
    f.write('\n'.join(report) + '\n')
