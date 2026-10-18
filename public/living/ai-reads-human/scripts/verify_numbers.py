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
sys.exit(1 if bad else 0)
