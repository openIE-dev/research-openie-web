#!/usr/bin/env python3
"""Tokenizer throughput (TIME ONLY, single thread) for tiktoken cl100k_base and o200k_base on the first S records of each view."""
import os, sys, time, statistics as st, json
import tiktoken
D = os.path.join(os.path.dirname(__file__), '..', 'data'); S = 2000; R = 7
N = len(json.load(open(os.path.join(D, 'recs.json'))))
def prefix(b):
    if b[:2] == b'[{':
        i = 0
        for _ in range(S): i = b.find(b'},{', i + 1)
        return b[:i + 1] + b']'
    cut = int(len(b) * S / N); i = b.find(b'\n', cut); return b[:i]
print('encoding\tview\tbytes\ttokens\twall_min_s\tns_per_byte\tns_per_token\tMB_per_s')
for n in ['cl100k_base', 'o200k_base']:
    e = tiktoken.get_encoding(n)
    for f in ['recs.json', 'recs.jsonl', 'recs.yaml', 'recs.xml', 'recs.csv', 'recs_table.md', 'recs_list.md']:
        s = prefix(open(os.path.join(D, f), 'rb').read()).decode()
        nb = len(s.encode()); nt = len(e.encode(s, disallowed_special=()))
        ts = []
        for _ in range(R):
            t = time.perf_counter(); e.encode(s, disallowed_special=()); ts.append(time.perf_counter() - t)
        m = min(ts); print('%s\t%s\t%d\t%d\t%.5f\t%.1f\t%.0f\t%.1f' % (n, f, nb, nt, m, m*1e9/nb, m*1e9/nt, nb/m/1e6))
