#!/usr/bin/env python3
"""Recompute every number quoted in the article from results/*.tsv. Exit 1 on any mismatch.
Copyright Open Interface Engineering, Inc. MIT OR Apache-2.0."""
import csv, math, os, sys
H = os.path.dirname(os.path.abspath(__file__))
R = next(p for p in (os.path.join(H, '..', 'results'), os.path.join(H, '..', 'data')) if os.path.exists(os.path.join(p, 'tokens.tsv')))
rd = lambda n: list(csv.DictReader([l for l in open(os.path.join(R, n)) if not l.startswith('#')], delimiter='\t'))
parse = {r['format']: r for r in rd('parse_time.tsv')}; tok = {r['view']: r for r in rd('tokens.tsv')}
bad = 0
def chk(name, got, want, tol=0):
    global bad
    ok = abs(got - want) <= tol; bad += (not ok)
    print(('OK   ' if ok else 'FAIL ') + f'{name}: got {got:.6g} want {want:.6g}')
chk('Landauer J/bit at 300 K', 1.380649e-23 * 300 * math.log(2), 2.871e-21, 5e-25)
chk('binary ns/record', float(parse['fixed binary (struct.iter_unpack)']['ns_per_record']), 116)
chk('json ns/record', float(parse['json (stdlib)']['ns_per_record']), 904)
chk('yaml libyaml ns/record', float(parse['yaml (libyaml C)']['ns_per_record']), 85300)
chk('json/binary time ratio', 904 / 116, 7.8, 0.05); chk('yaml/binary time ratio', 85300 / 116, 735.3, 0.05); chk('yaml/json time ratio', 85300 / 904, 94.4, 0.05)
c = tok['recs.csv']
for v, want in [('recs.json', 1.58), ('recs.yaml', 2.24), ('recs_pretty.json', 2.86)]:
    r = tok[v]; k = float(r['cl100k_base:tok/rec']) / float(c['cl100k_base:tok/rec'])
    beta = float(r['bytes_per_record']) / float(c['bytes_per_record']); rho = float(c['cl100k_base:B/tok']) / float(r['cl100k_base:B/tok'])
    chk(f'{v} kappa (2 dp)', round(k, 2), want); chk(f'{v} beta*rho_ratio = kappa', beta * rho, k, 0.005)
    print(f'     {v}: beta={beta:.3f} rho_CSV/rho_F={rho:.3f}')

# ---- energy (data/energy_joules.tsv, written by summarize_energy.py from data/energy_raw_*) ----
_ep = os.path.join(H, '..', 'data', 'energy_joules.tsv')
if os.path.exists(_ep):
    er = [r for r in csv.DictReader([l for l in open(_ep) if not l.startswith('#')], delimiter='\t')]
    chk('energy rows (2 machines x 2 counters x 9 formats)', len(er), 36)
    chk('min rounds per energy row (need >= 10)', min(int(r['n_rounds']) for r in er), 10, 0)
    ap = [r for r in er if r['power_key'] == 'all_power']
    tmax = max(abs(float(r['net_J_per_record_mean'])) / (float(r['net_J_per_record_sd']) / 10 ** .5) for r in ap)
    chk('max |t| of net energy, all_power rows (article: 1.45, none resolved)', round(tmax, 2), 1.45, 0.005)
    g = {(r['host'], r['format']): r for r in ap}
    chk('48GB gross J/rec fixed binary (article 7e-6)', float(g[('m5max48', 'fixed binary (struct.iter_unpack)')]['gross_J_per_record_mean']), 7.2e-6, 5e-7)
    chk('48GB gross J/rec json stdlib (article 5.4e-5)', float(g[('m5max48', 'json (stdlib)')]['gross_J_per_record_mean']), 5.4e-5, 5e-7)
    chk('48GB gross J/rec yaml (article 3.6e-3)', float(g[('m5max48', 'yaml (libyaml C)')]['gross_J_per_record_mean']), 3.6e-3, 5e-5)
    chk('128GB gross J/rec yaml (article 7.2e-3)', float(g[('m5max128', 'yaml (libyaml C)')]['gross_J_per_record_mean']), 7.2e-3, 5e-5)
    for h, jw, yw in (('m5max48', 7.6, 470), ('m5max128', 8.9, 750)):
        b = float(g[(h, 'fixed binary (struct.iter_unpack)')]['records_per_s_mean'])
        chk(h + ' json/binary time ratio', b / float(g[(h, 'json (stdlib)')]['records_per_s_mean']), jw, 0.06)
        chk(h + ' yaml/binary time ratio', b / float(g[(h, 'yaml (libyaml C)')]['records_per_s_mean']), yw, 5)
sys.exit(1 if bad else 0)
