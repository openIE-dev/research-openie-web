"""Parse InSight PDS4 labels (twins_model, ps_calib) into a JSON index.
usage: python3 -I parse_labels.py LABEL_DIR MANIFEST OUT_JSON
"""
import json, os, re, sys

lab_dir, manifest, out = sys.argv[1:4]
paths = {os.path.basename(p): p for p in open(manifest).read().split()}

def g(s, tag):
    m = re.search(r'<(?:\w+:)?%s[^>]*>(.*?)</(?:\w+:)?%s>' % (tag, tag), s, re.S)
    return m.group(1).strip() if m else None

idx = []
for fn in sorted(os.listdir(lab_dir)):
    if not fn.endswith('.xml'):
        continue
    s = open(os.path.join(lab_dir, fn)).read()
    csvname = g(s, 'file_name')
    idx.append(dict(
        label=fn, csv=csvname, path=paths[fn].replace('.xml', '.csv'),
        lid=g(s, 'logical_identifier'), version=g(s, 'version_id'),
        size=int(g(s, 'file_size')), records=int(g(s, 'records')),
        md5=g(s, 'md5_checksum'),
        sol=int(g(s, 'sol_number')),
        start_lmst=g(s, 'start_local_mean_solar_time'),
        stop_lmst=g(s, 'stop_local_mean_solar_time'),
        start_ls=float(g(s, 'start_solar_longitude')),
        stop_ls=float(g(s, 'stop_solar_longitude')),
        start_utc=g(s, 'start_date_time'), stop_utc=g(s, 'stop_date_time'),
    ))
json.dump(idx, open(out, 'w'), indent=0)
for kind in ('twins_model', 'ps_calib'):
    sub = [d for d in idx if d['csv'].startswith(kind + '_')]
    print(kind, len(sub), 'files', sum(d['size'] for d in sub) / 1e9, 'GB',
          'sols', min(d['sol'] for d in sub), max(d['sol'] for d in sub))
