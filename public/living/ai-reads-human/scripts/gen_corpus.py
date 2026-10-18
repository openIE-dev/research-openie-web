#!/usr/bin/env python3
"""Deterministic synthetic corpus: N records, identical logical content in many encodings."""
import json, random, struct, csv, io, sys, os
import msgpack, cbor2, yaml
from xml.sax.saxutils import escape
N = int(sys.argv[1]) if len(sys.argv) > 1 else 20000
out = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(out, exist_ok=True)
rnd = random.Random(20261016)
words = "alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega".split()
recs = []
for i in range(N):
    recs.append({"id": i, "name": " ".join(rnd.choice(words) for _ in range(3)),
                 "score": round(rnd.uniform(0, 1000), 3), "active": rnd.random() < 0.5,
                 "tags": [rnd.choice(words) for _ in range(3)],
                 "count": rnd.randrange(0, 1 << 31)})
w = lambda n, d, m='w': open(os.path.join(out, n), m).write(d) if m == 'w' else open(os.path.join(out, n), m).write(d)
w('recs.json', json.dumps(recs, separators=(',', ':')))
w('recs_pretty.json', json.dumps(recs, indent=2))
w('recs.jsonl', "\n".join(json.dumps(r, separators=(',', ':')) for r in recs) + "\n")
w('recs.yaml', yaml.safe_dump(recs, sort_keys=False))
x = ['<?xml version="1.0" encoding="UTF-8"?>\n<records>']
for r in recs:
    x.append('<rec id="%d" active="%s" score="%s" count="%d"><name>%s</name>%s</rec>' % (
        r['id'], 'true' if r['active'] else 'false', repr(r['score']), r['count'], escape(r['name']),
        ''.join('<tag>%s</tag>' % t for t in r['tags'])))
x.append('</records>\n'); w('recs.xml', "\n".join(x))
s = io.StringIO(); c = csv.writer(s, lineterminator="\n")
c.writerow(['id', 'name', 'score', 'active', 'tag1', 'tag2', 'tag3', 'count'])
for r in recs: c.writerow([r['id'], r['name'], repr(r['score']), 'true' if r['active'] else 'false', *r['tags'], r['count']])
w('recs.csv', s.getvalue())
t = []
for r in recs:
    t.append('[[rec]]\nid = %d\nname = "%s"\nscore = %r\nactive = %s\ntags = [%s]\ncount = %d\n' % (
        r['id'], r['name'], r['score'], 'true' if r['active'] else 'false', ', '.join('"%s"' % g for g in r['tags']), r['count']))
w('recs.toml', "\n".join(t))
w('recs.msgpack', msgpack.packb(recs), 'wb'); w('recs.cbor', cbor2.dumps(recs), 'wb')
# fixed-layout binary: id u32, score f64, active u8, count u32, name 3 x u8 word index, tags 3 x u8 word index
wi = {k: i for i, k in enumerate(words)}
b = bytearray()
for r in recs:
    b += struct.pack('<IdBI3B3B', r['id'], r['score'], r['active'], r['count'], *[wi[q] for q in r['name'].split()], *[wi[q] for q in r['tags']])
w('recs.bin', bytes(b), 'wb')
# markdown table + markdown prose list of same data
md = ['| id | name | score | active | tags | count |', '|---|---|---|---|---|---|']
for r in recs: md.append('| %d | %s | %r | %s | %s | %d |' % (r['id'], r['name'], r['score'], str(r['active']).lower(), ', '.join(r['tags']), r['count']))
w('recs_table.md', "\n".join(md) + "\n")
md = []
for r in recs: md.append('- **%d** %s: score %r, active %s, tags %s, count %d' % (r['id'], r['name'], r['score'], str(r['active']).lower(), ', '.join(r['tags']), r['count']))
w('recs_list.md', "\n".join(md) + "\n")
print("wrote", N)
