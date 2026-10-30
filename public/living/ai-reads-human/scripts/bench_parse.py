#!/usr/bin/env python3
"""Parse-cost benchmark. TIME ONLY: no RAPL/perf counters on this VM (see results/ENV.txt).
Each parser is run R times on the whole file; reports min and median wall and process CPU seconds,
bytes, ns/byte and ns/record. Parse results are checked against the generating records."""
import sys, os, time, json, struct, statistics as st, tomllib, io, csv
import msgpack, cbor2, orjson, yaml, numpy as np
from lxml import etree
import xml.etree.ElementTree as ET
D = os.path.join(os.path.dirname(__file__), '..', 'data'); R = int(sys.argv[1]) if len(sys.argv) > 1 else 7
rd = lambda n, m='rb': open(os.path.join(D, n), m).read()
N = len(json.loads(rd('recs.json')))
def p_csv(b):
    return list(csv.reader(io.StringIO(b.decode())))
def p_bin(b):
    dt = np.dtype([('id','<u4'),('score','<f8'),('a','u1'),('count','<u4'),('n','u1',3),('t','u1',3)], align=False)
    return np.frombuffer(b, dtype=dt)
def p_bin_struct(b):
    return list(struct.iter_unpack('<IdBI3B3B', b))
def p_yaml_c(b): return yaml.load(b, Loader=yaml.CSafeLoader)
def p_yaml_py(b): return yaml.load(b, Loader=yaml.SafeLoader)
def p_md(b):
    from markdown_it import MarkdownIt
    return MarkdownIt('commonmark').parse(b.decode())
cases = [
 ('json (stdlib)', 'recs.json', lambda b: json.loads(b)),
 ('json (orjson)', 'recs.json', lambda b: orjson.loads(b)),
 ('json pretty (stdlib)', 'recs_pretty.json', lambda b: json.loads(b)),
 ('jsonl (stdlib, per line)', 'recs.jsonl', lambda b: [json.loads(l) for l in b.splitlines()]),
 ('yaml (libyaml C)', 'recs.yaml', p_yaml_c),
 ('yaml (pure python)', 'recs.yaml', p_yaml_py),
 ('xml (lxml)', 'recs.xml', lambda b: etree.fromstring(b)),
 ('xml (ElementTree)', 'recs.xml', lambda b: ET.fromstring(b)),
 ('csv (stdlib)', 'recs.csv', p_csv),
 ('toml (tomllib)', 'recs.toml', lambda b: tomllib.loads(b.decode())),
 ('markdown table (markdown-it-py, tokens only)', 'recs_table.md', p_md),
 ('markdown list (markdown-it-py, tokens only)', 'recs_list.md', p_md),
 ('msgpack', 'recs.msgpack', lambda b: msgpack.unpackb(b)),
 ('cbor2', 'recs.cbor', lambda b: cbor2.loads(b)),
 ('fixed binary (struct.iter_unpack)', 'recs.bin', p_bin_struct),
 ('fixed binary (numpy frombuffer, zero copy)', 'recs.bin', p_bin),
]
# correctness spot checks
ref = json.loads(rd('recs.json'))
assert orjson.loads(rd('recs.json')) == ref and yaml.load(rd('recs.yaml'), Loader=yaml.CSafeLoader) == ref
assert msgpack.unpackb(rd('recs.msgpack')) == ref and cbor2.loads(rd('recs.cbor')) == ref
tl = tomllib.loads(rd('recs.toml').decode())['rec']; assert tl == ref
rows = p_csv(rd('recs.csv')); assert len(rows) == N + 1 and float(rows[5][2]) == ref[4]['score'] and int(rows[5][7]) == ref[4]['count']
b = p_bin_struct(rd('recs.bin')); assert b[7][0] == 7 and b[7][1] == ref[7]['score'] and b[7][3] == ref[7]['count']
print('# records', N, 'repeats', R)
print('format\tbytes\twall_min_s\twall_med_s\tcpu_min_s\tns_per_byte\tns_per_record\tMB_per_s')
for name, f, fn in cases:
    b = rd(f); ws, cs = [], []
    fn(b)  # warm
    for _ in range(R):
        t0 = time.perf_counter(); c0 = time.process_time(); fn(b); c1 = time.process_time(); t1 = time.perf_counter()
        ws.append(t1 - t0); cs.append(c1 - c0)
    wm = min(ws)
    print('%s\t%d\t%.6f\t%.6f\t%.6f\t%.2f\t%.0f\t%.1f' % (name, len(b), wm, st.median(ws), min(cs), wm*1e9/len(b), wm*1e9/N, len(b)/wm/1e6))
