"""Stream-and-reduce InSight APSS PS (ps_calib) and TWINS (twins_model) CSVs
into per-(sol, Mars-hour) sums using systematic HTTP byte-range subsampling.

Nothing raw is written to disk: each file is fetched as N evenly spaced byte
ranges (multipart/byteranges), partial edge lines are discarded, and every
complete row in the fetched chunks is assigned to its LMST bin.

usage: python3 -I reduce_insight.py INDEX_JSON OUT_JSONL [workers]
Resumable: files already present in OUT_JSONL are skipped.
"""
import json, math, os, re, ssl, sys, threading, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = 'https://atmos.nmsu.edu/PDS/data/PDS4/InSight/'
CTX = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE'))
OPENER = urllib.request.build_opener(urllib.request.HTTPSHandler(context=CTX))
# (chunk_bytes, max_chunks) per product kind
PLAN = {'ps_calib': (2400, 576), 'twins_model': (3000, 384)}
RANGES_PER_REQ = 100
lock = threading.Lock()
stats = {'bytes': 0, 'files': 0}


def fetch_ranges(url, ranges):
    """Return list of byte strings for the given (start, end) inclusive ranges."""
    out = []
    for i in range(0, len(ranges), RANGES_PER_REQ):
        grp = ranges[i:i + RANGES_PER_REQ]
        hdr = 'bytes=' + ','.join('%d-%d' % r for r in grp)
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, headers={'Range': hdr})
                with OPENER.open(req, timeout=120) as r:
                    body = r.read()
                    ctype = r.headers.get('Content-Type', '')
                    status = r.status
                break
            except Exception as e:  # retry transient errors
                if attempt == 4:
                    raise
                time.sleep(3 * (attempt + 1))
        with lock:
            stats['bytes'] += len(body)
        if status == 200:  # server ignored ranges: whole file
            return [body]
        if 'multipart/byteranges' in ctype:
            boundary = re.search(r'boundary=([^;\s]+)', ctype).group(1).encode()
            for part in body.split(b'--' + boundary)[1:]:
                if part.startswith(b'--'):
                    break
                head, _, data = part.partition(b'\r\n\r\n')
                m = re.search(rb'bytes (\d+)-(\d+)/', head, re.I)
                if not m:
                    continue
                n = int(m.group(2)) - int(m.group(1)) + 1
                out.append(data[:n])
        else:  # single range
            out.append(body)
    return out


def lmst_bin(s):
    # '00124M13:05:22.123' -> (sol, sol_fraction)
    sol = int(s[:5])
    h, m, sec = int(s[6:8]), int(s[9:11]), float(s[12:])
    return sol, (h * 3600 + m * 60 + sec) / 86400.0


def process(d):
    kind = 'ps_calib' if d['csv'].startswith('ps_calib') else 'twins_model'
    chunk, nmax = PLAN[kind]
    size = d['size']
    url = BASE + d['path']
    if size <= chunk * nmax:
        ranges = [(0, size - 1)]
        mode = 'full'
    else:
        step = (size - chunk) / (nmax - 1)
        ranges = [(int(round(i * step)), min(size - 1, int(round(i * step)) + chunk - 1)) for i in range(nmax)]
        mode = 'sampled'
    parts = fetch_ranges(url, ranges)
    header = parts[0].split(b'\n', 1)[0].decode().strip().split(',')
    col = {n: i for i, n in enumerate(header)}
    acc = {}  # key "sol:bin" -> [sums...]
    nrows = 0
    for k, p in enumerate(parts):
        lines = p.split(b'\n')
        if len(parts) == 1 and mode == 'full':
            lines = lines[1:]  # header
        else:
            lines = lines[1:-1]  # drop partial edge lines (incl. header in chunk 0)
        for ln in lines:
            f = ln.decode('ascii', 'replace').rstrip('\r').split(',')
            if len(f) != len(header):
                continue
            try:
                sol, fr = lmst_bin(f[col['LMST']])
            except Exception:
                continue
            b = min(int(fr * 24), 23)
            key = '%d:%d' % (sol, b)
            a = acc.setdefault(key, [0.0, 0, 0.0, 0, 0.0, 0, 0.0, 0, 0.0, 0])
            nrows += 1
            if kind == 'ps_calib':
                v = f[col['PRESSURE']]
                if v:
                    x = float(v)
                    if 100.0 < x < 1500.0:
                        a[0] += x; a[1] += 1; a[8] += fr; a[9] += 1
            else:
                vals = []
                for j, bm in enumerate(('BMY', 'BPY')):
                    v = f[col[bm + '_AIR_TEMP']]
                    fl = f[col[bm + '_AIR_TEMP_OPERATIONAL_FLAGS']]
                    if v and fl[:1] == '1':  # ASIC temperature in operational range
                        x = float(v)
                        if 100.0 < x < 350.0:
                            vals.append(x)
                            a[4 + 2 * j] += x; a[5 + 2 * j] += 1
                if vals:
                    a[2] += sum(vals) / len(vals); a[3] += 1; a[8] += fr; a[9] += 1
    return dict(csv=d['csv'], kind=kind, mode=mode, nranges=len(ranges),
                bytes=sum(len(p) for p in parts), rows=nrows, acc=acc)


def main():
    idx = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    workers = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    done = set()
    if os.path.exists(out):
        for ln in open(out):
            done.add(json.loads(ln)['csv'])
    todo = [d for d in idx if d['csv'] not in done]
    print('todo', len(todo), 'done', len(done), flush=True)
    fo = open(out, 'a')
    t0 = time.time()
    with ThreadPoolExecutor(workers) as ex:
        for r in ex.map(process, todo):
            with lock:
                fo.write(json.dumps(r) + '\n'); fo.flush()
                stats['files'] += 1
                if stats['files'] % 25 == 0:
                    print('%d/%d files, %.2f GB, %.0f s' % (stats['files'], len(todo), stats['bytes'] / 1e9, time.time() - t0), flush=True)
    print('total GB', stats['bytes'] / 1e9)


if __name__ == '__main__':
    main()
