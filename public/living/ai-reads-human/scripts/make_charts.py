#!/usr/bin/env python3
"""Build the SVG charts for the 'AI Reads Human' topic page.
Reads ONLY ../results/*.tsv (and ../data/recs.* for the one-record infographic).
Every plotted number is recomputed from those files; headline values are asserted.
Usage: python3 make_charts.py [outdir]   (stdlib only; no dependencies)
Copyright Open Interface Engineering, Inc. MIT OR Apache-2.0."""
import csv, os, sys, struct
from xml.sax.saxutils import escape as esc
from math import log10
HERE = os.path.dirname(os.path.abspath(__file__))
RES = next(p for p in (os.path.join(HERE, '..', 'results'), os.path.join(HERE, '..', 'data')) if os.path.exists(os.path.join(p, 'tokens.tsv'))); DAT = os.path.join(HERE, '..', 'data')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'charts')
os.makedirs(OUT, exist_ok=True)
BG, FG, MUT, GRID = '#0F1419', '#E2E8F0', '#94A3B8', '#27313d'
CY, AM, VI, GR = '#00D4AA', '#F59E0B', '#a78bfa', '#64748B'
FONT = "font-family=\"Inter,system-ui,sans-serif\""

def rows(name):
    with open(os.path.join(RES, name)) as f:
        lines = [l for l in f if not l.startswith('#')]
    return list(csv.DictReader(lines, delimiter='\t'))
parse = {r['format']: float(r['ns_per_record']) for r in rows('parse_time.tsv')}
tok = {r['view']: r for r in rows('tokens.tsv')}
TOKS = ['cl100k_base', 'o200k_base', 'gpt2', 'mistral-7b', 'qwen2.5']
def tpr(view, tk): return float(tok[view][tk + ':tok/rec'])
def ratio(view, tk='cl100k_base'): return tpr(view, tk) / tpr('recs.csv', tk)
# headline assertions (the numbers David's brief names)
assert parse['fixed binary (struct.iter_unpack)'] == 116
assert parse['json (stdlib)'] == 904
assert parse['yaml (libyaml C)'] == 85300
assert round(ratio('recs.json'), 2) == 1.58 and round(ratio('recs.yaml'), 2) == 2.24 and round(ratio('recs_pretty.json'), 2) == 2.86

def svg(w, h, body, title, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-labelledby="t d">'
            f'<title id="t">{esc(title)}</title><desc id="d">{esc(desc)}</desc>'
            f'<rect width="{w}" height="{h}" fill="{BG}" rx="10"/>{body}</svg>\n')
def text(x, y, s, size=13, fill=FG, anchor='start', weight='400', mono=False):
    fam = 'font-family="JetBrains Mono,monospace"' if mono else FONT
    return f'<text xml:space="preserve" x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}" {fam}>{esc(s)}</text>'
def save(name, s):
    open(os.path.join(OUT, name), 'w').write(s)

def hbar(name, title, subtitle, items, unit_fmt, log=False, xmax=None, note=None, label_w=270):
    """items: (label, value, color)"""
    W = 900; pad_r = 120; top = 78; bh = 26; gap = 12
    H = top + len(items) * (bh + gap) + 70
    vals = [v for _, v, _ in items if v > 0]
    if log:
        lo = 0; hi = log10(xmax or max(vals) * 1.0)
        sc = lambda v: 0 if v <= 1 else log10(v) / hi * (W - label_w - pad_r)
    else:
        hi = xmax or max(vals); sc = lambda v: v / hi * (W - label_w - pad_r)
    b = text(24, 32, title, 18, FG, weight='600') + text(24, 54, subtitle, 12, MUT)
    if log:
        d = 1
        while d <= (xmax or max(vals)) * 1.0001:
            x = label_w + sc(d)
            b += f'<line x1="{x}" y1="{top-8}" x2="{x}" y2="{H-52}" stroke="{GRID}"/>' + text(x, H-36, f'{d:,}', 10, MUT, 'middle', mono=True)
            d *= 10
    else:
        step = 0.5 if hi <= 3.2 else 10
        g = 0
        while g <= hi * 1.0001:
            x = label_w + sc(g)
            b += f'<line x1="{x}" y1="{top-8}" x2="{x}" y2="{H-52}" stroke="{GRID}"/>' + text(x, H-36, f'{g:g}', 10, MUT, 'middle', mono=True)
            g += step
    for i, (lab, v, c) in enumerate(items):
        y = top + i * (bh + gap)
        w = max(sc(v), 2)
        b += text(label_w - 10, y + 17, lab, 12.5, FG, 'end') + f'<rect x="{label_w}" y="{y}" width="{w:.1f}" height="{bh}" fill="{c}" rx="3"/>'
        b += text(label_w + w + 8, y + 17, unit_fmt(v), 12, MUT, mono=True)
    if note: b += text(24, H - 12, note, 11, GR)
    return svg(W, H, b, title, subtitle)

# 1 headline parse time
b, j, y = 'fixed binary (struct.iter_unpack)', 'json (stdlib)', 'yaml (libyaml C)'
save('parse-time-headline.svg', hbar('p1', 'Time to parse one record (lower is faster)',
  'Same 20,000 synthetic records, one machine, Python 3.13.5. TIME ONLY: no energy was measured. Log scale.',
  [('Fixed binary layout (struct)', parse[b], CY), ('JSON (Python stdlib)', parse[j], AM), ('YAML (PyYAML with libyaml)', parse[y], VI)],
  lambda v: f'{v:,.0f} ns', log=True, xmax=100000,
  note='Source: results/parse_time.tsv (ns_per_record). Parsers do different work; see the caveats in the text.'))
# 2 all parse rows
order = sorted([k for k in parse if parse[k] > 1], key=lambda k: parse[k])
col = lambda k: CY if k.startswith('fixed') else (AM if k.startswith('json') else (VI if k.startswith('yaml') else GR))
save('parse-time-all.svg', hbar('p2', 'Parse time per record, every format tested',
  'ns per record, min of 9 repeats, 20,000 records. Time only; no joules. Log scale.',
  [(k, parse[k], col(k)) for k in order], lambda v: f'{v:,.0f} ns', log=True, xmax=1000000,
  note='Source: results/parse_time.tsv. numpy frombuffer (0.15 ns/record, builds no objects) omitted: not comparable.', label_w=330))
# 3 tokens ratio to CSV (cl100k)
names = {'recs.csv': 'CSV', 'recs_table.md': 'Markdown table', 'recs_list.md': 'Markdown list', 'recs.json': 'JSON compact',
         'recs.jsonl': 'JSON Lines', 'recs.toml': 'TOML', 'recs.yaml': 'YAML', 'recs.xml': 'XML', 'recs_pretty.json': 'JSON pretty (indent 2)'}
tv = sorted(names, key=lambda k: ratio(k))
hl = {'recs.json': AM, 'recs.yaml': VI, 'recs_pretty.json': AM}
save('tokens-vs-csv.svg', hbar('t1', 'Tokens per record, relative to CSV (lower is cheaper to read)',
  'Tokenizer cl100k_base, first 2,000 of the same 20,000 records. Tokens only; no joules.',
  [(names[k], ratio(k), hl.get(k, GR if k != 'recs.csv' else CY)) for k in tv], lambda v: f'{v:.2f}x', xmax=3.0,
  note='Ratio = tok/rec of the view divided by tok/rec of CSV. Source: results/tokens.tsv (cl100k_base:tok/rec).'))
# 4 grouped: three headline views x five tokenizers
def grouped():
    W, H = 900, 430; left = 70; top = 80; plot_h = 270
    views = [('recs.json', 'JSON compact', AM), ('recs.yaml', 'YAML', VI), ('recs_pretty.json', 'JSON pretty', '#fb7185')]
    ymax = 4.0; sy = lambda v: top + plot_h - v / ymax * plot_h
    b = text(24, 32, 'The same ratio under five tokenizers', 18, FG, weight='600') + text(24, 54, 'Tokens per record divided by CSV tokens per record, same tokenizer. Tokens only.', 12, MUT)
    for g in [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]:
        b += f'<line x1="{left}" y1="{sy(g)}" x2="{W-20}" y2="{sy(g)}" stroke="{GRID}"/>' + text(left - 8, sy(g) + 4, f'{g:g}', 10, MUT, 'end', mono=True)
    gw = (W - left - 30) / len(TOKS)
    for i, tk in enumerate(TOKS):
        x0 = left + i * gw + 14; bw = (gw - 28) / 3
        for k, (v, lab, c) in enumerate(views):
            r = ratio(v, tk); x = x0 + k * bw
            b += f'<rect x="{x:.1f}" y="{sy(r):.1f}" width="{bw-4:.1f}" height="{top+plot_h-sy(r):.1f}" fill="{c}" rx="2"/>' + text(x + (bw-4)/2, sy(r) - 5, f'{r:.2f}', 10, FG, 'middle', mono=True)
        b += text(left + i * gw + gw / 2, top + plot_h + 20, tk, 11.5, MUT, 'middle', mono=True)
    for k, (v, lab, c) in enumerate(views):
        b += f'<rect x="{left + k*150}" y="{H-50}" width="12" height="12" fill="{c}"/>' + text(left + k*150 + 18, H-40, lab, 12, FG)
    b += text(24, H - 12, 'Source: results/tokens.tsv. Dashed reference at 1.0 = CSV. No closed commercial tokenizer was tested.', 11, GR)
    b += f'<line x1="{left}" y1="{sy(1)}" x2="{W-20}" y2="{sy(1)}" stroke="{CY}" stroke-dasharray="5 4"/>'
    return svg(W, H, b, 'Token ratio to CSV under five tokenizers', 'Grouped bars for compact JSON, YAML and pretty JSON.')
save('tokens-five-tokenizers.svg', grouped())
# 5 bytes per record
bpr = {k: float(tok[k]['bytes_per_record']) for k in tok}
bn = dict(names); bn.update({'recs.bin as base64': 'fixed binary as base64', 'recs.bin as hex': 'fixed binary as hex'})
bl = sorted([k for k in bn if k in bpr], key=lambda k: bpr[k])
bl = [(bn[k], bpr[k], CY if 'binary' in bn[k] else GR) for k in bl]
bl.insert(0, ('fixed binary (raw)', 23.0, CY))
save('bytes-per-record.svg', hbar('b1', 'Encoded bytes per record', 'Same logical records. Fixed binary uses a 23-byte layout whose words are indexes into a shared 24-word list (a dictionary).',
  bl, lambda v: f'{v:.1f} B', xmax=200,
  note='Source: results/tokens.tsv (bytes_per_record); raw binary 23 B = bytes column of parse_time.tsv divided by 20,000 records. Dictionary is not counted.'))
# assert 23 B/rec raw binary from parse_time.tsv
pb = {r['format']: int(r['bytes']) for r in rows('parse_time.tsv')}
assert pb['fixed binary (struct.iter_unpack)'] / 20000 == 23.0

# 6 one record, five ways (from data files)
def one():
    csvl = open(os.path.join(DAT, 'recs.csv')).read().split('\n')[1]
    import json
    js = open(os.path.join(DAT, 'recs.json')).read(); first = js[1:js.index('},{')+1]
    ya = ''.join(open(os.path.join(DAT, 'recs.yaml')).readlines()[:9]).rstrip('\n').split('\n')
    xm = open(os.path.join(DAT, 'recs.xml')).read().split('\n')[2]
    bn_ = open(os.path.join(DAT, 'recs.bin'), 'rb').read(23)
    hx = ' '.join('%02x' % c for c in bn_)
    W, H = 900, 520; b = text(24, 32, 'One record, five encodings', 18, FG, weight='600') + text(24, 54, 'Record 0 of the synthetic corpus (scripts/gen_corpus.py, seed 20261016). Same information, different bytes.', 12, MUT)
    y = 84
    def box(title, lines, color, nb, y, size=11):
        import textwrap
        lines = [c for l in lines for c in (textwrap.wrap(l, 100, drop_whitespace=False) or [''])]
        h = 24 + 16 * len(lines)
        s = f'<rect x="24" y="{y}" width="852" height="{h}" fill="#141b24" stroke="{color}" stroke-width="1" rx="6"/>' + text(36, y + 17, f'{title}  ({nb} bytes)', 11, color, weight='600', mono=True)
        for i, l in enumerate(lines): s += text(36, y + 36 + 16 * i, l, size, FG, mono=True)
        return s, h + 12
    for t, ls, c, n in [('CSV', [csvl], GR, len(csvl)+1), ('JSON compact', [first], AM, len(first)+1), ('YAML', ya, VI, len('\n'.join(ya))+1),
                        ('XML', [xm], GR, len(xm)+1), ('Fixed binary (hex view)', [hx], CY, 23)]:
        s, dh = box(t, ls, c, n, y); b += s; y += dh
    b += text(24, y + 10, 'Long lines are wrapped for display only. Byte counts are for the record text (line break included). The binary form needs the shared word list to be read back.', 11, GR)
    return svg(W, y + 26, b, 'One record in five encodings', 'CSV, JSON, YAML, XML and a fixed binary layout carrying the same fields.')
save('one-record-five-ways.svg', one())

# 7 pipeline infographic (no data)
def pipe():
    W, H = 900, 300
    b = text(24, 32, 'Where the impedance tax is paid', 18, FG, weight='600') + text(24, 54, 'Terms of Z(F) defined in the text. Each box is a cost that a canonical machine form could shrink or skip.', 12, MUT)
    xs = [24, 200, 376, 552, 728]; labs = [('encode', 'E_enc'), ('transport', 'bytes B_F'), ('parse', 'E_parse'), ('tokenize', 'E_tok'), ('model reads', 'e_prefill x T')]
    for x, (l, q) in zip(xs, labs):
        b += f'<rect x="{x}" y="100" width="148" height="76" rx="8" fill="#141b24" stroke="{AM}"/>' + text(x + 74, 132, l, 14, FG, 'middle', weight='600') + text(x + 74, 156, q, 12, AM, 'middle', mono=True)
    for x in xs[:-1]: b += f'<path d="M{x+150} 138 l22 0" stroke="{MUT}" stroke-width="2" marker-end="url(#a)"/>'
    b = f'<defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="{MUT}"/></marker></defs>' + b
    b += text(24, 214, 'Machine to machine: only encode, transport and parse apply. A fixed layout can be read in place.', 13, CY)
    b += text(24, 238, 'Machine to model: tokenize and read apply. Sending fewer, better chosen fields cuts the last two boxes.', 13, CY)
    b += text(24, 278, 'Only time and token counts are measured so far. Joules for every box are planned (M4, M5).', 12, GR)
    return svg(W, H, b, 'Impedance tax pipeline', 'Five stages: encode, transport, parse, tokenize, model reads.')
save('impedance-pipeline.svg', pipe())

# 8 timeline (dates read in the sources listed in the read ledger)
def tl():
    ev = [(1982.7, 'TeX version 0', 'September 1982', 'tex.web header'), (2004.0, 'Markdown', '2004', 'CommonMark 0.31.2, section 1.1'),
          (2005.8, 'CSV, RFC 4180 (informational)', 'October 2005', 'RFC 4180'), (2015.2, 'I-JSON, RFC 7493', 'March 2015', 'RFC 7493'),
          (2017.95, 'JSON, RFC 8259', 'December 2017', 'RFC 8259'), (2020.45, 'JCS (canonical JSON), RFC 8785', 'June 2020', 'RFC 8785'),
          (2020.95, 'CBOR, RFC 8949', 'December 2020', 'RFC 8949'), (2021.75, 'YAML 1.2.2', '1 October 2021', 'YAML 1.2.2 front matter'),
          (2024.07, 'CommonMark 0.31.2', '28 January 2024', 'CommonMark title page')]
    W = 900; x0, x1 = 430, 870; y0, y1 = 1980, 2026; top = 80; rh = 30; H = top + rh * len(ev) + 50
    sx = lambda v: x0 + (v - y0) / (y1 - y0) * (x1 - x0)
    b = text(24, 32, 'Dates of the specifications read for this topic', 18, FG, weight='600') + text(24, 54, 'Each date is printed in the document named in the right-hand label; all are in the read ledger.', 12, MUT)
    for yr in range(1980, 2030, 10):
        b += f'<line x1="{sx(yr)}" y1="{top-10}" x2="{sx(yr)}" y2="{top+rh*len(ev)-8}" stroke="{GRID}"/>' + text(sx(yr), top + rh * len(ev) + 8, str(yr), 11, MUT, 'middle', mono=True)
    for k, (t, lab, dt, src) in enumerate(ev):
        y = top + k * rh
        b += text(24, y + 5, lab, 13, FG) + text(330, y + 5, dt, 11, MUT, 'end', mono=True)
        b += f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{GRID}" stroke-dasharray="1 4"/><circle cx="{sx(t):.1f}" cy="{y}" r="5" fill="{AM}"/>'
    b += text(24, H - 12, 'Position is the year (to the month where printed). Sources: ledger rows S01, S03, S06, S07, S02, S10, S12, tex.web.', 11, GR)
    return svg(W, H, b, 'Timeline of format specifications', 'Nine dated specifications from 1982 to 2024.')
save('format-timeline.svg', tl())
print('wrote charts to', OUT)
