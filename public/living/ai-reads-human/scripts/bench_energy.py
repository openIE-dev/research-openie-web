#!/usr/bin/env python3
"""Parse ENERGY benchmark (macOS, sudo-free). Power source: macmon (IOReport/SMC, user level).
Protocol: rounds; each round = idle window, then every format in a shuffled order (fixed seed),
then idle window. Window length W seconds. Parse is looped for the full window on one thread.
Raw macmon samples (timestamped) and window boundaries are saved; analysis is in summarize_energy.py.
Copyright Open Interface Engineering, Inc. MIT OR Apache-2.0."""
import sys, os, time, json, io, csv, struct, random, subprocess, datetime as dt, platform, hashlib
import msgpack, cbor2, orjson, yaml
from lxml import etree
H = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(H, '..', 'data')
ROUNDS = int(sys.argv[1]); W = float(sys.argv[2]); OUT = sys.argv[3]; os.makedirs(OUT, exist_ok=True)
rd = lambda n: open(os.path.join(D, n), 'rb').read()
N = 20000
def p_csv(b): return list(csv.reader(io.StringIO(b.decode())))
cases = [
 ('json (stdlib)', 'recs.json', lambda b: json.loads(b)),
 ('json pretty (stdlib)', 'recs_pretty.json', lambda b: json.loads(b)),
 ('json (orjson)', 'recs.json', lambda b: orjson.loads(b)),
 ('yaml (libyaml C)', 'recs.yaml', lambda b: yaml.load(b, Loader=yaml.CSafeLoader)),
 ('xml (lxml)', 'recs.xml', lambda b: etree.fromstring(b)),
 ('csv (stdlib)', 'recs.csv', p_csv),
 ('msgpack', 'recs.msgpack', lambda b: msgpack.unpackb(b)),
 ('cbor2', 'recs.cbor', lambda b: cbor2.loads(b)),
 ('fixed binary (struct.iter_unpack)', 'recs.bin', lambda b: list(struct.iter_unpack('<IdBI3B3B', b))),
]
data = {f: rd(f) for _, f, _ in cases}
ref = json.loads(data['recs.json']); assert len(ref) == N
for name, f, fn in cases:
    r = fn(data[f])
    if name.startswith('csv'): assert len(r) == N + 1
    elif not name.startswith(('xml',)): assert len(r) == N, name
meta = {'host': platform.node(), 'platform': platform.platform(), 'python': sys.version, 'machine': platform.machine(),
        'cpu': subprocess.run(['sysctl', '-n', 'machdep.cpu.brand_string'], capture_output=True, text=True).stdout.strip(),
        'macmon': subprocess.run(['macmon', '--version'], capture_output=True, text=True).stdout.strip(),
        'pmset': subprocess.run(['pmset', '-g', 'batt'], capture_output=True, text=True).stdout.strip(),
        'powermode': subprocess.run(['pmset', '-g'], capture_output=True, text=True).stdout,
        'rounds': ROUNDS, 'window_s': W, 'files_sha256': {f: hashlib.sha256(data[f]).hexdigest() for f in data},
        'start_utc': dt.datetime.now(dt.timezone.utc).isoformat()}
json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
keep = ('timestamp', 'all_power', 'cpu_power', 'gpu_power', 'ane_power', 'ram_power', 'gpu_ram_power', 'sys_power', 'cpu_usage_pct')
mm = subprocess.Popen(['macmon', 'pipe', '-s', '0', '-i', '500'], stdout=subprocess.PIPE, text=True)
import threading
rawf = open(os.path.join(OUT, 'macmon_raw.jsonl'), 'w')
def reader():
    for line in mm.stdout:
        try: d = json.loads(line)
        except Exception: continue
        rawf.write(json.dumps({k: d.get(k) for k in keep}) + '\n'); rawf.flush()
threading.Thread(target=reader, daemon=True).start()
time.sleep(3)
wins = []; rnd = random.Random(7)
now = lambda: dt.datetime.now(dt.timezone.utc).isoformat()
def idle(rn, tag):
    s = now(); time.sleep(W); e = now(); wins.append({'round': rn, 'kind': 'idle', 'tag': tag, 'start': s, 'end': e, 'iters': 0, 'load1': os.getloadavg()[0]})
def run(rn, name, f, fn):
    b = data[f]; fn(b); s = now(); t0 = time.perf_counter(); c0 = time.process_time(); it = 0
    while time.perf_counter() - t0 < W: fn(b); it += 1
    t1 = time.perf_counter(); c1 = time.process_time(); e = now()
    wins.append({'round': rn, 'kind': 'load', 'format': name, 'start': s, 'end': e, 'iters': it, 'records': it * N, 'wall_s': t1 - t0, 'cpu_s': c1 - c0, 'load1': os.getloadavg()[0]})
for rn in range(ROUNDS):
    idle(rn, 'pre'); order = cases[:]; rnd.shuffle(order)
    for name, f, fn in order: run(rn, name, f, fn)
    idle(rn, 'post')
    json.dump(wins, open(os.path.join(OUT, 'windows.json'), 'w'), indent=0); print('round', rn, 'done', now(), flush=True)
time.sleep(1.5); mm.terminate(); rawf.close()
json.dump(wins, open(os.path.join(OUT, 'windows.json'), 'w'), indent=0)
meta['end_utc'] = now(); json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1); print('DONE')
