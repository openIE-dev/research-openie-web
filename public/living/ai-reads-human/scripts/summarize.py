#!/usr/bin/env python3
"""Derive ratios from results/*.tsv. No new measurements."""
import csv
P = {r['format']: r for r in csv.DictReader([l for l in open('results/parse_time.tsv') if not l.startswith('#')], delimiter='\t') if not r['format'].startswith('#')}
base = float(P['fixed binary (struct.iter_unpack)']['ns_per_record'])
print('parse ns/record and ratio to fixed binary via struct.iter_unpack (same Python object materialisation class: tuples vs dict, see caveat in OUTLINE.md)')
for k, r in P.items(): print('%-48s %10.0f ns/rec  x%.1f  %8.2f ns/B  %6d B/rec' % (k, float(r['ns_per_record']), float(r['ns_per_record']) / base, float(r['ns_per_byte']), int(r['bytes']) / 20000))
T = list(csv.reader(open('results/tokens.tsv'), delimiter='\t'))
hdr = [h for h in T if h and h[0] == 'view'][0]; rows = [r for r in T if r and not r[0].startswith('#') and r[0] != 'view']
ci = hdr.index('cl100k_base:tok/rec'); 
print('\ntokens per record (cl100k_base) and ratio to CSV')
csvt = float([r for r in rows if r[0] == 'recs.csv'][0][ci])
for r in rows: print('%-26s %6.1f tok/rec  x%.2f vs csv' % (r[0], float(r[ci]), float(r[ci]) / csvt))
