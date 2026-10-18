#!/usr/bin/env python3
"""Compute J/record from raw macmon samples + window boundaries. Output: data/energy_joules.tsv (NEW file).
Method: P_window = mean of macmon samples whose timestamp is in (start+0.5 s, end]. Baseline = mean of the pre and post idle
windows of the same round. net_J = (P_load - P_base) * wall_s. J/record = net_J / records. mean and sample SD over rounds.
Copyright Open Interface Engineering, Inc. MIT OR Apache-2.0."""
import json, os, glob, statistics as st, datetime as dt, sys
H = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(H, '..', 'data')
P = lambda s: dt.datetime.fromisoformat(s)
rows = []; notes = []
for d in sorted(glob.glob(os.path.join(D, 'energy_raw_*'))):
    host = os.path.basename(d)[len('energy_raw_'):]
    meta = json.load(open(os.path.join(d, 'meta.json'))); wins = json.load(open(os.path.join(d, 'windows.json')))
    raw = [json.loads(l) for l in open(os.path.join(d, 'macmon_raw.jsonl'))]
    ts = [P(r['timestamp']) for r in raw]
    def pw(w, key):
        s = P(w['start']) + dt.timedelta(seconds=0.5); e = P(w['end'])
        v = [r[key] for r, t in zip(raw, ts) if s < t <= e and r[key] is not None]
        return (st.mean(v), len(v)) if v else (None, 0)
    for key in ('all_power', 'sys_power'):
        res = {}
        for rn in sorted({w['round'] for w in wins}):
            idl = [pw(w, key)[0] for w in wins if w['round'] == rn and w['kind'] == 'idle']
            if len(idl) < 2 or None in idl: continue
            base = st.mean(idl)
            for w in wins:
                if w['round'] != rn or w['kind'] != 'load': continue
                pl, n = pw(w, key)
                if pl is None: continue
                res.setdefault(w['format'], []).append(dict(pl=pl, base=base, wall=w['wall_s'], rec=w['records'], n=n, load1=w['load1'], idle_pair=idl))
        for fmt, L in res.items():
            net = [(x['pl'] - x['base']) * x['wall'] / x['rec'] for x in L]
            gross = [x['pl'] * x['wall'] / x['rec'] for x in L]
            rps = [x['rec'] / x['wall'] for x in L]
            sd = lambda v: st.stdev(v) if len(v) > 1 else float('nan')
            idsp = st.mean(abs(x['idle_pair'][0] - x['idle_pair'][1]) for x in L)
            rows.append((host, key, fmt, len(L), st.mean(net), sd(net), st.mean(gross), sd(gross), st.mean(x['pl'] for x in L),
                         st.mean(x['base'] for x in L), idsp, st.mean(rps), st.mean(x['load1'] for x in L)))
    notes.append((host, meta))
out = os.path.join(D, 'energy_joules.tsv')
with open(out, 'w') as f:
    for host, m in notes:
        f.write('# host=%s | %s | %s | python %s | %s | window %s s, rounds %s | start %s\n' % (host, m['platform'], m['cpu'], m['python'].split()[0], m['macmon'], m['window_s'], m['rounds'], m['start_utc']))
    f.write('# power source: macmon (IOReport/SMC), no root. all_power = CPU+GPU+ANE package W. sys_power = whole-system W (SMC). Values are measured with that counter; see article for limits.\n')
    f.write('host\tpower_key\tformat\tn_rounds\tnet_J_per_record_mean\tnet_J_per_record_sd\tgross_J_per_record_mean\tgross_J_per_record_sd\tP_load_W_mean\tP_idle_W_mean\tidle_pre_post_abs_diff_W\trecords_per_s_mean\tloadavg1_mean\n')
    for r in sorted(rows):
        f.write('\t'.join([r[0], r[1], r[2], str(r[3])] + ['%.4g' % x for x in r[4:]]) + '\n')
print(open(out).read())
