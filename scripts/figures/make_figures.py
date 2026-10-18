#!/usr/bin/env python3
"""House-style figures for research.openie.dev. Pure SVG, no dependencies.
Every data value below is copied from the paper section named beside it.
Run: python3 scripts/figures/make_figures.py  (writes public/figures/<paper>/*.svg and .png)"""
import math, os, subprocess
from xml.sax.saxutils import escape
ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'figures')
FONT = "Inter, 'DejaVu Sans', Helvetica, Arial, sans-serif"
# Okabe-Ito, colorblind safe
BLUE, ORANGE, GREEN, PINK, SKY, VERM, YELLOW, BLACK = '#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00', '#F0E442', '#000000'
INK, MUTED, GRID, CARD, EDGE = '#0f172a', '#475569', '#e2e8f0', '#ffffff', '#cbd5e1'

def wilson(k, n, z=1.959964):
    p = k / n; d = 1 + z*z/n; c = p + z*z/(2*n); h = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n))
    return (c-h)/d, (c+h)/d

class S:
    def __init__(s, w, h, title, sub, kind):
        s.w, s.h, s.o = w, h, []
        s.o.append(f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="18" fill="{CARD}" stroke="{EDGE}" stroke-width="2"/>')
        s.t(40, 58, title, 30, 800)
        s.t(40, 92, sub, 18, 400, MUTED)
        s.badge(w-40, 50, kind)
        s.title, s.desc = title, sub
    def t(s, x, y, txt, size=18, weight=400, fill=INK, anchor='start', rot=None, italic=False, halo=False):
        hl = ''
        if halo:
            tw = len(str(txt)) * size * (0.60 if weight >= 600 else 0.54) + 8
            rx = x - tw / 2 if anchor == 'middle' else (x - tw + 4 if anchor == 'end' else x - 4)
            s.o.append(f'<rect x="{rx:.1f}" y="{y - size:.1f}" width="{tw:.1f}" height="{size * 1.3:.1f}" rx="3" fill="#ffffff"/>')
        r = f' transform="rotate({rot} {x} {y})"' if rot is not None else ''
        st = ' font-style="italic"' if italic else ''
        s.o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}{hl}{r}>{escape(str(txt))}</text>')
    def badge(s, x, y, kind):
        col = {'DATA': BLUE, 'DIAGRAM': PINK, 'MODEL': ORANGE, 'QUALITATIVE': PINK}[kind.split()[0]]
        label = {'DATA': 'Data figure', 'DIAGRAM': 'Diagram', 'MODEL': 'Model illustration', 'QUALITATIVE': 'Qualitative diagram'}[kind.split()[0]]
        wdt = 14 + 10.5*len(label)
        s.o.append(f'<rect x="{x-wdt:.1f}" y="{y-24}" width="{wdt:.1f}" height="34" rx="17" fill="none" stroke="{col}" stroke-width="2"/>')
        s.t(x-wdt/2, y-1, label, 16, 700, col, 'middle')
    def r(s, x, y, w, h, fill, stroke='none', rx=0, sw=2, op=1, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ''
        s.o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w,0):.1f}" height="{max(h,0):.1f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}"{d}/>')
    def l(s, x1, y1, x2, y2, col=INK, sw=2, dash=None, arrow=False):
        d = f' stroke-dasharray="{dash}"' if dash else ''
        a = ' marker-end="url(#ah)"' if arrow else ''
        s.o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{sw}"{d}{a}/>')
    def p(s, d, col=INK, sw=3, fill='none', dash=None, arrow=False, op=1):
        da = f' stroke-dasharray="{dash}"' if dash else ''
        a = ' marker-end="url(#ah)"' if arrow else ''
        s.o.append(f'<path d="{d}" stroke="{col}" stroke-width="{sw}" fill="{fill}" fill-opacity="{op}"{da}{a} stroke-linejoin="round"/>')
    def c(s, x, y, rr, fill, stroke=CARD, sw=2):
        s.o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    def mark(s, x, y, shape, col, size=9):
        if shape == 'o': s.c(x, y, size, col)
        elif shape == 's': s.r(x-size, y-size, 2*size, 2*size, col, CARD, 0, 2)
        elif shape == '^': s.p(f'M{x} {y-size*1.2} L{x+size*1.1} {y+size*.8} L{x-size*1.1} {y+size*.8} Z', CARD, 2, col)
        elif shape == 'd': s.p(f'M{x} {y-size*1.3} L{x+size*1.1} {y} L{x} {y+size*1.3} L{x-size*1.1} {y} Z', CARD, 2, col)
        elif shape == '*': s.p(f'M{x} {y-size*1.5} L{x+size*.45} {y-size*.45} L{x+size*1.5} {y-size*.4} L{x+size*.7} {y+size*.3} L{x+size*.95} {y+size*1.4} L{x} {y+size*.75} L{x-size*.95} {y+size*1.4} L{x-size*.7} {y+size*.3} L{x-size*1.5} {y-size*.4} L{x-size*.45} {y-size*.45} Z', CARD, 2, col)
    def box(s, x, y, w, h, title, lines=(), col=BLUE, tsize=20):
        s.r(x, y, w, h, '#f8fafc', col, 14, 3)
        s.t(x+w/2, y+30, title, tsize, 800, INK, 'middle')
        for i, ln in enumerate(lines): s.t(x+w/2, y+56+i*22, ln, 16, 400, MUTED, 'middle')
    def save(s, paper, name, alt):
        d = os.path.join(ROOT, paper); os.makedirs(d, exist_ok=True)
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}" role="img" aria-labelledby="t d">'
                f'<title id="t">{escape(s.title)}</title><desc id="d">{escape(alt)}</desc>'
                f'<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="{INK}"/></marker></defs>')
        f = os.path.join(d, name + '.svg')
        open(f, 'w').write(head + '\n'.join(s.o) + '</svg>\n')
        subprocess.run(['rsvg-convert', '-z', '1.5', '-o', f[:-4] + '.png', f], check=True)
        print(f)

def legend(s, x, y, items, dx=230):
    for i, (lab, col, shape) in enumerate(items):
        xx = x + (i % 4)*dx; yy = y + (i//4)*30
        s.mark(xx, yy-6, shape, col, 8); s.t(xx+16, yy, lab, 16, 500)

# ---------------- RCE ----------------
def rce_design_space():
    s = S(1200, 900, 'The design space of autonomous coding', 'Five axes; approach classes placed qualitatively. Outward is better on every axis.', 'QUALITATIVE')
    axes = ['Energy per correct result', 'Determinism', 'Verification strength', 'Reuse and compounding', 'Independence from models']
    sub = ['outward: paid once, then the handler floor', 'outward: entropy resolved once', 'outward: tests, coverage and proof', 'outward: every accepted fit stored', 'outward: model only as a last gear']
    cx, cy, R = 600, 470, 250
    ang = [-math.pi/2 + i*2*math.pi/5 for i in range(5)]
    for lev in range(1, 5):
        pts = ' '.join(f'{cx+R*lev/4*math.cos(a):.1f},{cy+R*lev/4*math.sin(a):.1f}' for a in ang)
        s.o.append(f'<polygon points="{pts}" fill="none" stroke="{GRID}" stroke-width="2"/>')
    for i, a in enumerate(ang):
        s.l(cx, cy, cx+R*math.cos(a), cy+R*math.sin(a), '#94a3b8', 2)
        lx, ly = cx+(R+40)*math.cos(a), cy+(R+40)*math.sin(a)
        anc = 'middle' if abs(math.cos(a)) < .3 else ('start' if math.cos(a) > 0 else 'end')
        if i == 0: ly -= 22
        s.t(lx, ly, axes[i], 18, 700, INK, anc); s.t(lx, ly+22, sub[i], 14, 400, MUTED, anc)
    classes = [
        ('A model on every task', [1, 1, 1, 0, 0], VERM, 'o', '0'),
        ('Agent loop gated by tests', [1, 1, 2, 1, 0.5], ORANGE, '^', '10 6'),
        ('Model with retrieval and caching', [2, 2, 1, 2, 1], SKY, 's', '4 6'),
        ('Classical synthesis and repair', [3, 4, 2, 1, 4], GREEN, 'd', '14 6 3 6'),
        ('RCE', [4, 4, 4, 4, 3], BLUE, '*', None),
    ]
    for lab, v, col, sh, dash in classes:
        pts = [(cx+R*max(x, .12)/4*math.cos(a), cy+R*max(x, .12)/4*math.sin(a)) for x, a in zip(v, ang)]
        d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ' Z'
        s.p(d, col, 5 if lab == 'RCE' else 3, col if lab == 'RCE' else 'none', None if dash in (None, '0') else dash, op=.12)
        for x, y in pts: s.mark(x, y, sh, col, 10 if lab == 'RCE' else 7)
    legend(s, 70, 805, [(c[0], c[2], c[3]) for c in classes], 270)
    s.t(600, 880, 'Placements are the paper\u2019s qualitative reading of each class (Section 2), not measurements. Rings mark ordinal levels 1 to 4.', 15, 400, MUTED, 'middle', italic=True)
    s.save('rce', 'design-space', 'Radar chart with five axes: energy per correct result, determinism, verification strength, reuse and compounding, and independence from models. Five approach classes are drawn as polygons. A model on every task sits near the centre on all axes. An agent loop gated by tests is higher on verification. A model with retrieval and caching is higher on reuse. Classical synthesis and repair is high on determinism and model independence. RCE, marked with stars, sits at or near the outer ring on all five axes. Placements are qualitative.')

def rce_form_projections():
    s = S(1200, 840, 'One Form, many projections', 'Each target is emitted from the same Form IR and checked against it.', 'DIAGRAM')
    s.box(80, 300, 300, 170, 'Form', ['state', 'events', 'pure, total transition'], BLUE, 28)
    s.t(230, 500, 'canonical JSON, one shape hash', 15, 600, BLUE, 'middle')
    tg = [('Rust', 'native binary', GREEN), ('Python', 'module, replays trace', GREEN), ('WASM', 'browser engine', GREEN), ('XState', 'statechart JSON', ORANGE), ('SCXML', 'W3C statechart XML', ORANGE)]
    for i, (n, d, col) in enumerate(tg):
        y = 140 + i*115
        s.box(760, y, 300, 86, n, [d], col, 22)
        s.p(f'M380 {385} C 560 {385}, 560 {y+30}, 755 {y+30}', INK, 3, arrow=True)
        if col == ORANGE:
            s.p(f'M760 {y+60} C 580 {y+70}, 560 {420}, 384 {430}', ORANGE, 3, dash='9 6', arrow=True)
    s.t(560, 128, 'project (deterministic: two compiles give the same bytes)', 16, 700, INK, 'middle')
    s.t(1110, 200, 'replay', 16, 700, GREEN, 'middle'); s.t(1110, 222, 'reference', 14, 400, MUTED, 'middle'); s.t(1110, 240, 'trace', 14, 400, MUTED, 'middle')
    s.t(1110, 545, 'decode', 16, 700, ORANGE, 'middle'); s.t(1110, 567, 'back to', 14, 400, MUTED, 'middle'); s.t(1110, 585, 'the Form', 14, 400, MUTED, 'middle')
    s.l(60, 730, 100, 730, INK, 3); s.t(110, 736, 'projection', 16)
    s.l(260, 730, 300, 730, ORANGE, 3, '9 6'); s.t(310, 736, 'round trip: decoded projection is byte identical, same shape hash', 16)
    s.r(60, 765, 22, 22, '#f8fafc', GREEN, 4, 3); s.t(92, 782, 'target runs the reference trace byte for byte (Section 5.1: 529 events, all five targets)', 16)
    s.save('rce', 'form-projections', 'Diagram: one Form, made of state, events and a pure total transition, is projected by deterministic compiles to five targets: Rust, Python, WASM, XState and SCXML. Solid arrows run from the Form to each target. Dashed arrows run back from XState and SCXML to the Form, showing the round trip to byte-identical bytes and the same shape hash. Rust, Python and WASM replay the reference trace byte for byte.')

def rce_stack():
    s = S(1200, 820, 'Corrections compound upward', 'A correction promoted at any level is inherited by every level above it, under the gate.', 'DIAGRAM')
    layers = [('Intent', 'what the person means'), ('Form', 'state, events, transition'), ('Gate', 'tests, coverage, proof certificate'), ('Projections', 'Rust, Python, WASM, XState, SCXML'), ('Runtime', 'handlers, gears G0 to G5'), ('Hardware and energy', 'op counts priced in joules')]
    x, w, h = 70, 520, 92
    for i, (n, d) in enumerate(layers):
        y = 130 + i*105
        col = BLUE if i != 2 else VERM
        s.r(x, y, w, h, '#f8fafc', col, 12, 3); s.t(x+24, y+40, n, 22, 800); s.t(x+24, y+68, d, 16, 400, MUTED)
    # correction at runtime level
    yr = 130 + 4*105
    s.c(x+w-40, yr+46, 18, GREEN); s.t(x+w-40, yr+53, '+', 26, 800, CARD, 'middle')
    s.t(x+w+20, yr+40, 'correction promoted here', 17, 700, GREEN); s.t(x+w+20, yr+62, 'after it passes its boundary check', 15, 400, MUTED)
    for i in range(4):
        y0 = yr - i*105
        s.p(f'M{x+w-40} {y0+20} L{x+w-40} {y0-50}', GREEN, 4, arrow=True)
    s.t(x+w+20, 180, 'every level above inherits it', 17, 700, GREEN); s.t(x+w+20, 202, '(Propositions R1 and R2)', 15, 400, MUTED)
    # chart of escalations per round from the playground reference workload: totals only are in the paper
    bx, by, bw, bh = 700, 290, 430, 300
    s.t(bx, by-20, 'Cumulative escalations, eight rounds', 18, 800)
    s.t(bx, by+2, 'playground reference workload, RCE §2.4', 14, 400, MUTED)
    vals = [('No correction', 21, '#94a3b8'), ('One correction at the sinks', 15, GREEN)]
    for i, (lab, v, col) in enumerate(vals):
        yy = by + 50 + i*100
        s.r(bx, yy, v/21*380, 54, col, 'none', 6); s.t(bx + v/21*380 + 10, yy+36, str(v), 24, 800)
        s.t(bx, yy-8, lab, 16, 600)
    s.t(bx, by+240, 'Both reach zero escalations in the last round;', 15, 400, MUTED)
    s.t(bx, by+260, 'no promotion was refused.', 15, 400, MUTED)
    s.save('rce', 'stack-compounding', 'Diagram of the RCE stack as six levels from intent at the top through Form, gate, projections and runtime to hardware and energy. A correction promoted at the runtime level after passing its boundary check is shown with arrows rising through every level above it. A small bar chart beside it gives cumulative escalations over eight rounds on the playground reference workload: 21 with no correction and 15 with one correction at the sinks.')

def rce_ecosystem():
    s = S(1200, 560, 'The ecosystem at large N', '10,000 preregistered Forms, frozen engine, 0 model calls. Bars show checks that hold.', 'DATA')
    rows = [('Lossless encoding (round trip identity)', 10000), ('Deterministic projection, XState and SCXML', 10000), ('Faithful projection, Python trace', 9999), ('Gate at entry, malformed inputs', 10000), ('Gate at entry, specifications', 10000)]
    x0, w = 520, 560
    for i, (lab, k) in enumerate(rows):
        y = 140 + i*72
        s.t(x0-16, y+30, lab, 17, 600, INK, 'end')
        s.r(x0, y, w, 44, GRID, 'none', 6)
        s.r(x0, y, w*k/10000, 44, BLUE if k == 10000 else ORANGE, 'none', 6)
        lo, hi = wilson(k, 10000)
        s.t(x0+w-12, y+29, f'{k:,} of 10,000', 17, 800, CARD, 'end')
        s.t(x0, y+64, f'Wilson 95% interval {lo*100:.2f}% to {hi*100:.2f}%', 13, 400, MUTED)
    s.save('rce', 'ecosystem-checks', 'Horizontal bar chart of five checks on 10,000 Forms. Lossless encoding, deterministic projection, gate at entry on malformed inputs and gate at entry on specifications each hold on 10,000 of 10,000. The Python trace replay holds on 9,999 of 10,000. Zero model calls.')

def rce_ladder():
    s = S(1200, 700, 'Lift: repair ladder on held-out code', 'Rate solved with Wilson 95% intervals. Frozen engine, location given, token identity gate, 0 model calls.', 'DATA')
    rows = [('L0 one token, 9 repositories', 520541, 520821), ('L0 one token, never tuned on', 23015, 23015), ('L1 Java, whole file', 13586, 21320), ('L1 Java, hunk only', 9288, 24072), ('L1 Python, hunk only', 27266, 157089)]
    x0, w = 420, 680
    for g in range(0, 11):
        xx = x0 + w*g/10; s.l(xx, 130, xx, 520, GRID, 1)
        s.t(xx, 545, f'{g*10}%', 14, 400, MUTED, 'middle')
    for i, (lab, k, n) in enumerate(rows):
        y = 150 + i*74; p = k/n; lo, hi = wilson(k, n)
        col = BLUE if lab.startswith('L0') else (GREEN if 'Java' in lab else ORANGE)
        s.t(x0-16, y+22, lab, 17, 600, INK, 'end'); s.t(x0-16, y+42, f'N = {n:,}', 14, 400, MUTED, 'end')
        s.r(x0, y, w*p, 40, col, 'none', 4, op=.85)
        s.l(x0+w*lo, y+20, x0+w*hi, y+20, INK, 3); s.l(x0+w*lo, y+10, x0+w*lo, y+30, INK, 3); s.l(x0+w*hi, y+10, x0+w*hi, y+30, INK, 3)
        txt = f'{p*100:.2f}%  ({lo*100:.2f} to {hi*100:.2f})' if p > .9 else f'{p*100:.1f}%  ({lo*100:.1f} to {hi*100:.1f})'
        if p > .6: s.t(x0+w*p-10, y+27, txt, 15, 700, CARD, 'end')
        else: s.t(x0+w*hi+12, y+27, txt, 15, 700, INK)
    s.t(x0+w/2, 572, 'tasks solved, held-out test split', 15, 600, MUTED, 'middle')
    s.t(60, 615, 'L2 to L4 (Defects4J held out) and L5 to L7 (SWE-bench Lite offline) are protocols in Section 8, not yet reported.', 15, 400, MUTED)
    s.t(60, 640, 'Colour marks the corpus family; intervals are computed from the counts shown.', 15, 400, MUTED)
    s.save('rce', 'lift-ladder', 'Bar chart of solve rates on held-out code with Wilson 95 percent intervals. L0 one token on nine repositories: 99.95 percent of 520,821. L0 one token on four repositories never tuned on: 100 percent of 23,015. L1 Java whole file: 63.7 percent of 21,320. L1 Java hunk only: 38.6 percent of 24,072. L1 Python hunk only: 17.4 percent of 157,089. Zero model calls.')

# ---------------- Essay ----------------
LAB = {'Projection': VERM, 'Survey estimate': ORANGE, 'Company-reported': SKY, 'Measured': BLUE, 'Estimate': PINK}
SH = {'Projection': 'o', 'Survey estimate': '^', 'Company-reported': 's', 'Measured': '*', 'Estimate': 'd'}
def logaxis(s, x0, w, lo, hi, y0, y1, fmt):
    for e in range(lo, hi+1):
        xx = x0 + w*(e-lo)/(hi-lo); s.l(xx, y0, xx, y1, GRID, 1); s.t(xx, y1+24, fmt(e), 14, 400, MUTED, 'middle')
def essay_spend():
    s = S(1200, 760, 'Dollar figures, by what kind of number they are', 'Log scale. Colour and marker give the label each source carries (Section 2).', 'DATA')
    rows = [('Developer economic contribution', 3e12, None, 'Projection', '[1]'), ('Generative AI value, 63 use cases', 2.6e12, 4.4e12, 'Projection', '[15]'),
            ('Worldwide AI spending, 2025', 1.5e12, None, 'Projection', '[24]'), ('Capex, largest technology firms, 2025', 4e11, None, 'Estimate', '[10]'),
            ('Enterprise generative AI spend, 2025', 3.7e10, None, 'Survey estimate', '[2]'), ('AI code tools market, 2031', 2.996e10, None, 'Projection', '[3]'),
            ('AI code tools market, 2026', 9.35e9, None, 'Projection', '[3]'), ('Enterprise AI coding tool spend, 2025', 4.0e9, None, 'Survey estimate', '[2]'),
            ('Claude Code run-rate revenue', 2.5e9, None, 'Company-reported', '[6]'), ('Cursor annualized revenue', 1.0e9, None, 'Company-reported', '[5]')]
    x0, w, lo, hi = 470, 650, 9, 13
    names = {9: '$1B', 10: '$10B', 11: '$100B', 12: '$1T', 13: '$10T'}
    logaxis(s, x0, w, lo, hi, 125, 640, lambda e: names[e])
    X = lambda v: x0 + w*(math.log10(v)-lo)/(hi-lo)
    for i, (lab, v, v2, kind, ref) in enumerate(rows):
        y = 150 + i*49
        s.t(x0-16, y+6, f'{lab} {ref}', 16, 500, INK, 'end')
        s.l(x0, y, X(v2 or v), y, GRID, 2)
        if v2: s.l(X(v), y, X(v2), y, LAB[kind], 6)
        s.mark(X(v), y, SH[kind], LAB[kind], 9)
        if v2: s.mark(X(v2), y, SH[kind], LAB[kind], 9)
    legend(s, 80, 700, [(k, LAB[k], SH[k]) for k in ['Projection', 'Estimate', 'Survey estimate', 'Company-reported']], 260)
    s.t(80, 735, 'No row is a measured outcome of AI coding; the measured rows of this essay are counts and joules (Figure 4).', 15, 400, MUTED, italic=True)
    s.save('ai-coding-market', 'spend-by-label', 'Log-scale dot chart of dollar figures from the essay tables. Projections: developer contribution about 3 trillion dollars, generative AI value 2.6 to 4.4 trillion, worldwide AI spending 1.5 trillion, AI code tools market 9.35 billion in 2026 and 29.96 billion in 2031. Estimate: capex over 400 billion. Survey estimates: enterprise generative AI spend 37 billion and AI coding tool spend 4.0 billion. Company-reported: Claude Code run-rate over 2.5 billion and Cursor over 1 billion.')

def essay_tokens():
    s = S(1200, 600, 'Tokens processed per month at Google', 'Company-reported, log scale (Pichai [8]).', 'DATA')
    pts = [(2024, 9.7e12, '9.7 trillion'), (2025, 4.8e14, 'about 480 trillion'), (2026.38, 3.2e15, 'over 3.2 quadrillion (May)')]
    x0, w, y0, h, lo, hi = 160, 900, 140, 340, 12, 16
    Y = lambda v: y0 + h - h*(math.log10(v)-lo)/(hi-lo); X = lambda t: x0 + w*(t-2023.8)/(2026.7-2023.8)
    for e in range(lo, hi+1):
        s.l(x0, Y(10**e), x0+w, Y(10**e), GRID, 1); s.t(x0-12, Y(10**e)+5, {12: '1T', 13: '10T', 14: '100T', 15: '1Q', 16: '10Q'}[e], 14, 400, MUTED, 'end')
    for t in (2024, 2025, 2026): s.t(X(t), y0+h+28, str(t), 15, 500, MUTED, 'middle')
    s.p('M' + ' L'.join(f'{X(t):.1f} {Y(v):.1f}' for t, v, _ in pts), SKY, 4)
    for t, v, lab in pts: s.mark(X(t), Y(v), 's', SKY, 10); s.t(X(t)+(-14 if t > 2026 else 16), Y(v)-16, lab, 16, 700, INK, 'end' if t > 2026 else 'start')
    s.t(x0, 545, 'Volume is not value: Bai, Huang and Wang [9] find about 1,000 times more tokens in agentic coding than in code chat,', 15, 400, MUTED)
    s.t(x0, 567, 'and that higher token use does not translate into higher accuracy.', 15, 400, MUTED)
    s.save('ai-coding-market', 'tokens', 'Log-scale line chart of Google tokens processed per month: 9.7 trillion in 2024, about 480 trillion in 2025 and over 3.2 quadrillion in May 2026, company-reported.')

def essay_energy():
    s = S(1200, 700, 'Energy: projected at the grid, measured at the task', 'Two different objects on two panels; neither is converted into the other.', 'DATA')
    # panel a: TWh
    s.t(60, 140, 'a. Data-centre electricity, TWh per year (IEA [10, 11])', 18, 800)
    x0, y0, h, w = 120, 170, 330, 440
    Y = lambda v: y0 + h - h*v/1000
    for v in range(0, 1001, 250): s.l(x0, Y(v), x0+w, Y(v), GRID, 1); s.t(x0-10, Y(v)+5, str(v), 14, 400, MUTED, 'end')
    X = lambda t: x0 + w*(t-2023.5)/(2031-2023.5)
    s.p(f'M{X(2025)} {Y(485)} L{X(2030)} {Y(950)} L{X(2030)} {Y(950)}', PINK, 3, dash='8 6')
    s.mark(X(2024), Y(415), 'd', PINK, 10); s.t(X(2024)+14, Y(415)+24, '415 (2024, estimate)', 15, 600)
    s.mark(X(2025), Y(485), 'd', PINK, 8); s.t(X(2025)+14, Y(485)+6, '485 (2025)', 14, 500)
    s.mark(X(2030), Y(945), 'o', VERM, 10); s.t(X(2030)-14, Y(945)+30, '945 (2030, projection)', 15, 600, INK, 'end')
    for t in (2024, 2026, 2028, 2030): s.t(X(t), y0+h+26, str(t), 14, 400, MUTED, 'middle')
    # panel b: J per unit, log
    s.t(640, 140, 'b. Joules per unit of work, log scale', 18, 800)
    rows = [('One median text prompt, production assistant [12]', 864, None, 'Measured', 'operator-measured 0.24 Wh'), ('RCE, solved repair task, est_j', 0.10, 0.40, 'Estimate', 'CPU seconds times 10 W'), ('RCE, solved repair task, reported_j', 0.026, 0.056, 'Measured', 'RAPL package counter')]
    bx, bw, lo, hi = 660, 480, -2, 3
    logaxis(s, bx, bw, lo, hi, 190, 470, lambda e: {-2: '0.01 J', -1: '0.1 J', 0: '1 J', 1: '10 J', 2: '100 J', 3: '1 kJ'}[e])
    XX = lambda v: bx + bw*(math.log10(v)-lo)/(hi-lo)
    for i, (lab, v, v2, kind, note) in enumerate(rows):
        y = 230 + i*85
        s.t(bx, y-14, lab, 15, 700); s.t(bx, y+30, note, 13, 400, MUTED)
        col = BLUE if kind == 'Measured' else PINK
        if v2: s.l(XX(v), y, XX(v2), y, col, 8)
        s.mark(XX(v), y, '*' if kind == 'Measured' else 'd', col, 9)
        if v2: s.mark(XX(v2), y, '*' if kind == 'Measured' else 'd', col, 9)
    s.t(60, 610, 'A prompt and a solved repair task are different units; panel b places them on one axis for scale, not as a like-for-like comparison.', 15, 400, MUTED, italic=True)
    s.t(60, 635, 'RCE rows: RCE §6.3, est_j 0.10 to 0.40 J across rungs; reported_j 0.026 J (L1) and 0.056 J (L0) on RAPL subsamples.', 15, 400, MUTED, italic=True)
    legend(s, 60, 675, [('Measured', BLUE, '*'), ('Estimate', PINK, 'd'), ('Projection', VERM, 'o')], 200)
    s.save('ai-coding-market', 'energy', 'Two panels. Panel a: data-centre electricity, 415 TWh in 2024 by IEA estimate, a 485 to 950 TWh range for 2025 to 2030, and 945 TWh projected for 2030. Panel b, log scale: one median text prompt measured by its operator at 0.24 Wh or 864 joules; RCE solved repair tasks at 0.10 to 0.40 joules estimated and 0.026 to 0.056 joules on a RAPL package counter.')

def essay_price():
    s = S(1200, 640, 'Price of a fixed level of capability', 'Log scale. Endpoints as printed by the sources; lines are the stated rates, not fitted data.', 'DATA')
    x0, y0, w, h, lo, hi = 150, 140, 900, 380, -2, 2
    X = lambda t: x0 + w*(t-2020.6)/(2026.8-2020.6); Y = lambda v: y0 + h - h*(math.log10(v)-lo)/(hi-lo)
    for e in range(lo, hi+1): s.l(x0, Y(10**e), x0+w, Y(10**e), GRID, 1); s.t(x0-12, Y(10**e)+5, f'${10**e:g}', 14, 400, MUTED, 'end')
    for t in range(2021, 2027): s.t(X(t), y0+h+28, str(t), 15, 500, MUTED, 'middle')
    s.t(40, 120, 'dollars per million tokens', 14, 600, MUTED)
    s.p(f'M{X(2021)} {Y(60)} L{X(2024)} {Y(0.06)}', PINK, 4)
    s.mark(X(2021), Y(60), 'd', PINK, 10); s.t(X(2021)+16, Y(60)-10, '$60 (2021)', 16, 700)
    s.mark(X(2024), Y(0.06), 'd', PINK, 10); s.t(X(2024)+16, Y(0.06)+6, '$0.06 at equivalent performance', 16, 700)
    s.t(X(2021.1), Y(0.35), 'about 10 times cheaper a year (a16z [20], estimate)', 16, 600, PINK)
    # epoch line: 13x/year from 2023, indexed
    t0, v0 = 2023, 10
    s.p(f'M{X(t0)} {Y(v0)} L{X(t0+math.log(1000)/math.log(13))} {Y(0.01)}', BLUE, 4, dash='10 6')
    s.t(X(2024.0), Y(v0/13**0.3)-14, 'about 13 times a year since 2023 (Epoch AI [4])', 16, 600, BLUE)
    s.t(X(2024.0), Y(v0/13**0.3)+8, 'indexed to $10 in 2023; slope only', 14, 400, MUTED)
    s.t(x0, 590, 'Epoch AI [34] finds the fall ranges from 9 to 900 times a year by milestone, fastest where most recent and least certain to persist.', 15, 400, MUTED, italic=True)
    s.save('ai-coding-market', 'price-trend', 'Log-scale chart of price per million tokens at fixed capability. An a16z estimate falls from 60 dollars in 2021 to 0.06 dollars in 2024, about ten times a year. A dashed Epoch AI slope of about thirteen times a year since 2023 is drawn indexed to ten dollars in 2023.')

# ---------------- Agency ----------------
def agency_layers():
    s = S(1200, 600, 'Agency in three layers', 'Each layer presupposes the one below it.', 'DIAGRAM')
    L = [('Layer 1. Definition and gate', 'eligibility: what counts as an agent', 'four clauses: prediction first, coupling to the world, consequence borne, J(a) \u2264 B', BLUE),
         ('Layer 2. Kinematics', 'how fast agency moves, per second and per joule', 'Landauer floor, speed limits, TUR, data-rate theorem', GREEN),
         ('Layer 3. Calculus', 'intelligence read in hindsight', '\u03b9 = dX/dJ, confirmed bits per joule along a run', ORANGE)]
    for i, (a, b, c, col) in enumerate(L):
        y = 440 - i*140; x = 80 + i*60; w = 1040 - i*120
        s.r(x, y, w, 110, '#f8fafc', col, 14, 4)
        s.t(x+30, y+40, a, 22, 800); s.t(x+30, y+68, b, 17, 500, MUTED); s.t(x+30, y+94, c, 16, 600, col)
    s.save('agency', 'three-layers', 'Diagram of three stacked layers. Bottom, layer 1: the definition and gate, eligibility, with four clauses: prediction first, coupling to the world, consequence borne, and the joule budget. Middle, layer 2: kinematics, how fast agency moves per second and per joule, bounded by the Landauer floor, speed limits, the thermodynamic uncertainty relation and the data-rate theorem. Top, layer 3: calculus, intelligence iota equals dX over dJ, read in hindsight.')

def agency_gate_rank():
    s = S(1200, 640, 'Gate first, then rank by joules', 'Correctness is the gate; joules are the ranking among what passes. Run 1 at the loose budget (Section 8.11).', 'DATA')
    s.box(60, 170, 250, 120, 'Candidate runs', ['each with X and J'], INK)
    s.box(400, 170, 260, 120, 'Gate C(z)', ['X \u2265 X_req', 'task closed or refused'], VERM)
    s.box(760, 140, 360, 100, 'Pass: rank by J*', ['least joules to correct completion'], GREEN)
    s.box(760, 280, 360, 80, 'Fail: not ranked', ['cheap failures earn nothing'], '#94a3b8')
    s.p('M310 230 L395 230', INK, 3, arrow=True); s.p('M660 210 L755 190', GREEN, 3, arrow=True); s.p('M660 250 L755 320', '#94a3b8', 3, arrow=True)
    # data panel
    s.t(60, 410, 'Measured, B = 2.0 J_g2, 20 seeds: integrated \u03b9 alone ranks the wrong agent first', 18, 800)
    arms = [('\u03c3-law', 28.40, 73345, BLUE, 'o'), ('Fixed cascade', 27.50, 70418, GREEN, 's'), ('Goal-blind', 18.25, 92724, VERM, '^')]
    for i, (n, closed, iota, col, sh) in enumerate(arms):
        y = 450 + i*52
        s.t(220, y+24, n, 17, 700, INK, 'end')
        s.r(240, y, 380*closed/30, 34, col, 'none', 4, op=.85); s.t(250+380*closed/30, y+24, f'{closed:.2f} of 30 closed', 15, 700)
        s.r(760, y, 380*iota/100000, 34, col, 'none', 4, op=.4); s.t(770+380*iota/100000 if iota < 80000 else 750+380*iota/100000, y+24, f'{iota:,}', 15, 700, INK, 'start' if iota < 80000 else 'end')
    s.t(240, 612, 'tasks closed (the gate)', 14, 600, MUTED); s.t(760, 612, 'run \u03b9, bits per reported joule', 14, 600, MUTED)
    s.save('agency', 'gate-then-rank', 'Diagram and data. Candidate runs pass through the gate C of z, X at least X required. Those that pass are ranked by J star, the least joules to correct completion; those that fail are not ranked. Below, Run 1 at budget 2.0: σ-law closed 28.40 of 30 tasks with run iota 73,345 bits per joule; fixed cascade 27.50 with 70,418; goal-blind 18.25 with 92,724. Integrated iota alone would rank the goal-blind agent first.')

def agency_carriers():
    s = S(1200, 520, 'Where coupled bits are written', 'Carriers ordered by the time each needs per written bit. Positions are qualitative.', 'QUALITATIVE')
    s.l(100, 330, 1100, 330, INK, 3, arrow=True)
    s.t(1100, 365, 'faster writing of bits, per second', 16, 700, INK, 'end')
    cs = [(220, 'Genome', 'selection, per generation', 'about 0.29 bits per generation (Kimura [341])', ORANGE, 'd'),
          (600, 'Brain', 'learning within a lifetime', 'written in seconds to years', GREEN, 's'),
          (980, 'Tools and records', 'culture across lifetimes', 'copied and reused at once', BLUE, 'o')]
    for x, n, a, b, col, sh in cs:
        s.mark(x, 330, sh, col, 16); s.t(x, 250, n, 24, 800, INK, 'middle'); s.t(x, 278, a, 16, 500, MUTED, 'middle'); s.t(x, 410, b, 15, 600, col, 'middle')
    s.t(100, 470, 'Bounds on selection: Kimura [341], Worden [342], Hled\u00edk, Barton and Tka\u010dik [343]. Every bound is per generation, so a generation that lengthens', 14, 400, MUTED)
    s.t(100, 492, 'slows the genome per second; agency moves to brains and tools when the world changes faster than generations turn over.', 14, 400, MUTED)
    s.save('agency', 'carriers', 'Qualitative diagram placing three carriers of coupled bits on an axis of writing speed per second: the genome, through selection per generation, at about 0.29 bits per generation by Kimura; the brain, through learning within a lifetime; and tools and records, through culture across lifetimes.')

def agency_tempo():
    s = S(1200, 640, 'Prediction 1: an optimal act time', 'J(\u03c4) = J\u2080 + a/\u03c4 + s\u03c4 and \u03b9(\u03c4) \u221d 1/J(\u03c4). Normalized units, not a measurement.', 'MODEL')
    x0, y0, w, h = 140, 140, 900, 380
    lo, hi = -1.5, 1.5
    X = lambda t: x0 + w*(math.log10(t)-lo)/(hi-lo)
    J0, a = 1.0, 1.0
    curves = [(1.0, BLUE, None, 's = 1'), (4.0, ORANGE, '10 6', 's = 4 (four times the standing cost)')]
    peak = max(1/(J0+2*math.sqrt(a*sv)) for sv, *_ in curves)
    Y = lambda v: y0 + h - h*v/(peak*1.12)
    for e in (-1, 0, 1): s.l(X(10**e), y0, X(10**e), y0+h, GRID, 1); s.t(X(10**e), y0+h+26, f'{10**e:g}', 14, 400, MUTED, 'middle')
    s.t(x0+w/2, y0+h+52, 'act time \u03c4 (normalized, log scale)', 15, 600, MUTED, 'middle')
    s.t(x0-20, y0+h/2, '\u03b9(\u03c4), relative', 15, 600, MUTED, 'middle', rot=-90)
    for sv, col, dash, lab in curves:
        pts = [10**(lo + (hi-lo)*i/200) for i in range(201)]
        s.p('M' + ' L'.join(f'{X(t):.1f} {Y(1/(J0+a/t+sv*t)):.1f}' for t in pts), col, 4, dash=dash)
        ts = math.sqrt(a/sv); s.l(X(ts), Y(1/(J0+2*math.sqrt(a*sv))), X(ts), y0+h, col, 2, '4 4')
        s.t(X(ts)+10, Y(1/(J0+2*math.sqrt(a*sv)))-12, f'\u03c4* = \u221a(a/s) = {ts:g}', 16, 700, col)
    legend(s, 160, 600, [(c[3], c[1], 'o' if i == 0 else 's') for i, c in enumerate(curves)], 380)
    s.t(1060, 600, 'Quadrupling s halves \u03c4*: slope \u22121/2', 15, 700, INK, 'end')
    s.save('agency', 'act-time', 'Model illustration of Prediction 1. Relative intelligence iota of tau is plotted against act time tau on a log axis for J of tau equal to J zero plus a over tau plus s tau. With s equal to 1 the peak is at tau star equal to 1; with s equal to 4 the peak moves to 0.5 and is lower, showing the slope of minus one half.')

def agency_runs():
    s = S(1200, 700, 'Tasks closed of 30, three preregistered runs', 'Mean \u00b1 one standard deviation over seeds, by arm and budget level B/J_g2 (Sections 8.11 to 8.11.2).', 'DATA')
    runs = [('Run 1, laptop, 20 seeds, reported_j', {'\u03c3-law': [(0.60, .50), (9.10, 1.86), (28.40, .60)], 'Fixed cascade': [(.70, .47), (6.45, 1.50), (27.50, .51)], 'Goal-blind': [(.25, .44), (3.85, 1.84), (18.25, 2.71)]}),
            ('Run 2, guarded, 40 seeds, reported_j', {'\u03c3-law': [(.62, .49), (2.90, 1.74), (22.73, 1.30)], 'Fixed cascade': [(.57, .50), (2.67, 1.25), (19.93, 1.42)], 'Goal-blind': [(.12, .33), (1.00, .93), (10.65, 2.27)]}),
            ('Second machine, part B, 40 seeds, est_j', {'\u03c3-law': [(1.10, .98), (8.75, 3.14), (28.60, .98)], 'Fixed cascade': [(1.15, .92), (9.22, 3.07), (27.77, 2.30)], 'Goal-blind': [(.20, .46), (3.73, 2.12), (15.65, 2.50)]})]
    cols = {'\u03c3-law': BLUE, 'Fixed cascade': GREEN, 'Goal-blind': VERM}
    pw, y0, h = 340, 150, 400
    Y = lambda v: y0 + h - h*v/30
    for r, (title, d) in enumerate(runs):
        x0 = 80 + r*(pw+45)
        s.t(x0, y0-16, title, 15, 800)
        for v in (0, 10, 20, 30): s.l(x0, Y(v), x0+pw, Y(v), GRID, 1); s.t(x0-6, Y(v)+5, str(v), 13, 400, MUTED, 'end')
        for b in range(3):
            gx = x0 + 20 + b*(pw-20)/3
            s.t(gx + 45, y0+h+24, ['0.5', '1.0', '2.0'][b], 15, 600, MUTED, 'middle')
            for k, arm in enumerate(cols):
                m, sd = d[arm][b]; bx = gx + k*30
                s.r(bx, Y(m), 26, Y(0)-Y(m), cols[arm], 'none', 2, op=.85)
                s.l(bx+13, Y(min(30, m+sd)), bx+13, Y(max(0, m-sd)), INK, 2)
    s.t(600, y0+h+52, 'budget level B/J_g2', 15, 600, MUTED, 'middle')
    legend(s, 300, 650, [(k, v, 's') for k, v in cols.items()], 230)
    s.save('agency', 'run-results', 'Three bar-chart panels of tasks closed of 30 by arm and budget level for Run 1, Run 2 and the second-machine part B. At the loose level 2.0 the σ-law selector closed 28.40, 22.73 and 28.60; the fixed cascade 27.50, 19.93 and 27.77; the goal-blind baseline 18.25, 10.65 and 15.65. Error bars show one standard deviation.')

# ---------------- Gates ----------------
def gates_plateau():
    s = S(1200, 620, 'Mixture of Limits: escalate to the floor, then stop', 'Verified progress against spend for one task. The plateau begins where value of information reaches zero.', 'DIAGRAM')
    x0, y0, w, h = 120, 140, 960, 360
    s.l(x0, y0+h, x0+w, y0+h, INK, 3, arrow=True); s.l(x0, y0+h, x0, y0, INK, 3, arrow=True)
    s.t(x0+w, y0+h+34, 'spend (joules, log scale)', 16, 700, INK, 'end'); s.t(x0-20, y0+h/2, 'verified progress', 16, 700, INK, 'middle', rot=-90)
    steps = [('Lookup', 0, 160, .35, BLUE), ('Formula', 160, 330, .62, GREEN), ('Solver', 330, 520, 1.0, ORANGE), ('Model', 520, 960, 1.0, VERM)]
    d = f'M{x0} {y0+h}'
    for n, a, b, v, col in steps:
        d += f' L{x0+a} {y0+h-h*.9*v} L{x0+b} {y0+h-h*.9*v}'
        s.r(x0+a, y0+h-14, b-a, 14, col, 'none', 0, op=.8); s.t(x0+(a+b)/2, y0+h-24, n, 16, 700, INK, 'middle')
    s.p(d, INK, 4)
    s.l(x0+520, y0+20, x0+520, y0+h, VERM, 3, '8 6'); s.t(x0+530, y0+40, 'floor: least spend that closes the task', 16, 700, VERM)
    s.t(x0+560, y0+h-h*.9-14, 'plateau: VoI zero past the floor; more tokens buy nothing verifiable', 15, 600, MUTED)
    s.t(120, 560, 'Shown for a task the Solver closes; a task Lookup closes stops at the first step. Refuse is a lawful stop when escalation is VoI negative.', 15, 400, MUTED, italic=True)
    s.save('gates', 'mol-plateau', 'Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.')

def gates_commit():
    s = S(1200, 420, 'The commit gate', 'A proposal becomes an act only through certify and commit; refuse is a lawful outcome. Both write a receipt.', 'DIAGRAM')
    s.box(50, 150, 220, 110, 'Propose', ['model, solver or rule'], INK)
    s.box(340, 150, 240, 110, 'Certify', ['predicate and certificate', 'checked on the plant'], ORANGE)
    s.box(660, 100, 220, 90, 'Commit', ['act on the world'], GREEN)
    s.box(660, 230, 220, 90, 'Refuse', ['no act; lawful stop'], VERM)
    s.box(960, 150, 200, 110, 'Receipt', ['hash, joules, reason'], BLUE)
    s.p('M270 205 L335 205', INK, 3, arrow=True); s.p('M580 185 L655 150', GREEN, 3, arrow=True); s.p('M580 230 L655 270', VERM, 3, arrow=True)
    s.p('M880 145 L955 190', INK, 3, arrow=True); s.p('M880 275 L955 225', INK, 3, arrow=True)
    s.t(600, 380, 'Natural language and tool calls are transport and proposal; they never commit on their own (Section I.5.2).', 15, 400, MUTED, 'middle', italic=True)
    s.save('gates', 'commit-gate', 'Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.')

# ---------------- Satiation ----------------
def satiation_curve():
    s = S(1200, 640, 'Task satiation is finite at every price', 'U(x) = \u2212(x \u2212 4)\u00b2 and surplus U(x) \u2212 p\u00b7x for three prices (Section 3.10). A constructed toy, not a fit.', 'MODEL')
    x0, y0, w, h = 130, 140, 620, 380
    X = lambda x: x0 + w*x/8; Y = lambda v: y0 + h*(-v)/40 + 10
    for v in (0, -10, -20, -30): s.l(x0, Y(v), x0+w, Y(v), GRID, 1); s.t(x0-10, Y(v)+5, str(v), 14, 400, MUTED, 'end')
    for x in range(0, 9): s.t(X(x), y0+h+26, str(x), 14, 400, MUTED, 'middle')
    s.t(x0+w/2, y0+h+52, 'x, model calls on one chore', 15, 600, MUTED, 'middle')
    for p, col, dash in [(0, BLUE, None), (2, ORANGE, '10 6'), (4, VERM, '3 5')]:
        pts = [i/25 for i in range(0, 201)]
        s.p('M' + ' L'.join(f'{X(x):.1f} {Y(-(x-4)**2 - p*x):.1f}' for x in pts if -(x-4)**2 - p*x > -40), col, 4, dash=dash)
        xm = 4 - p/2; s.c(X(xm), Y(-(xm-4)**2 - p*xm), 8, col)
        s.t(X(xm)+10, Y(-(xm-4)**2 - p*xm)-12, f'p = {p}: stop at x = {xm:g}', 15, 700, col)
    # right panel: aggregate
    s.t(800, 160, 'Aggregate demand is a separate claim', 18, 800)
    lines = ['A lower price p moves each maximizer,', 'and it can open new tasks (rebound).', 'Each new task still stops at its own', 'completeness predicate.', '', 'Task-level satiation holds by definition.', 'Aggregate satiation is not implied,', 'and this paper estimates no rebound.']
    for i, ln in enumerate(lines): s.t(800, 200 + i*28, ln, 16, 500 if ln else 400, INK if i < 4 else MUTED)
    for i in range(6):
        hh = 30 + i*18
        s.r(810 + i*55, 500 - hh, 40, hh, GREEN, 'none', 3, op=.35 + i*.1)
    s.t(800, 530, 'tasks opened as p falls (schematic)', 14, 600, MUTED)
    s.save('satiation', 'satiation-rebound', 'Left: model illustration of a bliss point. Value U(x) is the negative of (x minus 4) squared, plotted with the surplus U minus p times x at prices 0, 2 and 4; the maximizers are 4, 3 and 2 calls, finite at every price. Right: a schematic of aggregate rebound, where lower prices open more tasks, each of which still stops at its own predicate.')

# ---------------- Spell check ----------------
def spell_timeline():
    s = S(1200, 640, 'Spell check: a separate price, then bundled at zero', 'Dated prices as printed by the sources in Section 2.11; log scale. Bundled items have no separate price.', 'DATA')
    x0, y0, w, h = 120, 140, 980, 300
    X = lambda t: x0 + w*(t-1979)/(2001-1979); Y = lambda v: y0 + h - h*(math.log10(v)-1)/(3-1)
    for v in (10, 30, 100, 300, 1000): s.l(x0, Y(v), x0+w, Y(v), GRID, 1); s.t(x0-10, Y(v)+5, f'${v}', 14, 400, MUTED, 'end')
    for t in range(1980, 2001, 4): s.t(X(t), 560, str(t), 14, 400, MUTED, 'middle')
    pts = [(1981.0, 200, 'WordCheck, standalone ($200)', BLUE, 'o', 1), (1983.8, 495, 'WordPerfect 3.0 with a spell command ($495)', SKY, 's', -1), (1983.8, 395, 'Word 1.0, no checker ($395)', '#94a3b8', 's', 2),
           (1988.3, 89, 'Grammatik II ($89)', ORANGE, 'o', 3), (1989.9, 99, 'Grammatik III ($99)', ORANGE, 'o', 1)]
    for t, v, lab, col, sh, side in pts:
        s.mark(X(t), Y(v), sh, col, 10)
        if side == 3: s.t(X(t)-14, Y(v)+5, lab, 15, 600, INK, 'end')
        elif side == 2: s.t(X(t)+14, Y(v)+6, lab, 15, 600)
        else: s.t(X(t)+14, Y(v)+(-12 if side < 0 else 24), lab, 15, 600)
    # bundled band
    s.r(x0, 470, w, 54, '#f1f5f9', EDGE, 8)
    s.t(x0+12, 500, 'no separate price', 14, 700, MUTED)
    for t, lab in [(1985.5, 'Word 2.0 bundles a purchased checker'), (1992.9, 'WordPerfect 5.2 includes Grammatik 5'), (1998.5, 'Hunspell library (undated here), $0')]:
        s.mark(X(t), 497, 'd', GREEN, 10); s.t(X(t), 462, lab, 14, 700, GREEN, 'middle')
    s.t(120, 600, 'Word 2.0 is placed by Brodie\u2019s account (Section 2.11); its year is not printed on that tape. Hunspell is placed at the right edge, undated; its README publishes no prior retail schedule.', 14, 400, MUTED, italic=True)
    s.save('spellcheck', 'price-to-zero', 'Timeline on a log price axis. WordCheck sold as a standalone checker at 200 dollars in January 1981. WordPerfect 3.0 with a spell command was 495 dollars in October 1983, and Word 1.0 without a checker 395 dollars. Grammatik II was 89 dollars in 1988 and Grammatik III 99 dollars in 1989. Below, a band of items with no separate price: Word 2.0 bundling a purchased checker, WordPerfect 5.2 including Grammatik 5 in 1992, and the Hunspell library at a licence price of zero.')

# ---------------- Three-body ----------------
def _tri(s, cx, cy, R):
    return [(cx, cy-R), (cx+R*0.866, cy+R*0.5), (cx-R*0.866, cy+R*0.5)]

def tbp_bodies():
    s = S(1200, 860, 'Three bodies, three interfaces', 'Each body is coherent alone. Failures originate on the edges, where assumptions cross unwritten.', 'DIAGRAM')
    pts = _tri(s, 600, 500, 270)
    names = [('Theorists', 'state what it should do', BLUE), ('Makers', 'build it', ORANGE), ('Users', 'run it', GREEN)]
    edges = [(0, 1, ['specification, units,', 'operating envelope']), (1, 2, ['API, version,', 'voltage and timing limits']), (2, 0, ['actual use, failures,', 'intent never written'])]
    for a, b, lab in edges:
        (x1, y1), (x2, y2) = pts[a], pts[b]
        s.l(x1, y1, x2, y2, '#94a3b8', 26)
        mx, my = (x1+x2)/2, (y1+y2)/2
        s.l(x1+(x2-x1)*0.35, y1+(y2-y1)*0.35, x1+(x2-x1)*0.65, y1+(y2-y1)*0.65, VERM, 6, '12 9')
        ox, oy = mx-600, my-500; n = math.hypot(ox, oy); ox, oy = ox/n, oy/n
        tx, ty = mx+ox*95, my+oy*70
        for i, ln in enumerate(lab): s.t(tx, ty+i*22, ln, 16, 600 if i == 0 else 400, INK if i == 0 else MUTED, 'middle')
    for (x, y), (n, d, col) in zip(pts, names):
        s.c(x, y, 72, col, CARD, 4); s.t(x, y+2, n, 21, 800, CARD, 'middle'); s.t(x, y+24, d, 13, 500, CARD, 'middle')
    s.l(70, 820, 120, 820, VERM, 6, '12 9'); s.t(132, 826, 'unexamined assumption: relied on, never written down or checked', 16, 500)
    s.save('three-body', 'three-bodies', 'Diagram of three bodies, theorists, makers and users, drawn as circles at the corners of a triangle. Each edge between two bodies is an interface drawn as a band, labeled with the assumptions that cross it: theorist to maker carries the specification, its units and its operating envelope; maker to user carries the API, the version and the voltage and timing limits; user to theorist carries the actual use, the observed failures and the intent that was never written. Dashed portions of each band mark assumptions that no body writes down or checks.')

def tbp_stable():
    s = S(1200, 860, 'The stabilized configuration', 'Like the Lagrange triangle, stability is a property of the relations, held in a shared frame.', 'DIAGRAM')
    cx, cy = 600, 500
    s.c(cx, cy, 300, 'none', '#cbd5e1', 2)
    s.p(f'M{cx+300*math.cos(-0.5):.1f} {cy+300*math.sin(-0.5):.1f} A300 300 0 0 1 {cx+300*math.cos(0.2):.1f} {cy+300*math.sin(0.2):.1f}', MUTED, 3, arrow=True)
    s.t(cx+330, cy-60, 'rotating frame', 15, 500, MUTED)
    pts = _tri(s, cx, cy, 270)
    names = [('Theorists', BLUE), ('Makers', ORANGE), ('Users', GREEN)]
    labs = [['Form: intent written once'], ['gate at entry'], ['trace and receipt return']]
    for i, (a, b) in enumerate([(0, 1), (1, 2), (2, 0)]):
        (x1, y1), (x2, y2) = pts[a], pts[b]
        s.l(x1, y1, x2, y2, GREEN, 10)
        mx, my = (x1+x2)/2, (y1+y2)/2
        s.c(mx, my, 20, CARD, GREEN, 4); s.p(f'M{mx-9} {my} L{mx-2} {my+8} L{mx+10} {my-8}', GREEN, 4)
        ox, oy = mx-cx, my-cy; n = math.hypot(ox, oy); ox, oy = ox/n, oy/n
        s.t(mx+ox*175, my+oy*95+6, labs[i][0], 17, 700, INK, 'middle')
    for (x, y), (n, col) in zip(pts, names):
        s.c(x, y, 66, col, CARD, 4); s.t(x, y+7, n, 21, 800, CARD, 'middle')
    s.r(cx-150, cy-10, 300, 96, '#f8fafc', INK, 14, 2)
    s.t(cx, cy+22, 'shared frame', 18, 800, INK, 'middle'); s.t(cx, cy+46, 'one Form, one gate,', 15, 400, MUTED, 'middle'); s.t(cx, cy+68, 'joules as the ranking', 15, 400, MUTED, 'middle')
    s.save('three-body', 'stabilized', 'Diagram of the same three bodies, now arranged at the corners of an equilateral triangle inside a rotating frame, in the manner of the Lagrange configuration. Each interface band is solid and carries a check mark and a short label: the specification as a Form, the gate at entry, and the trace and receipt that return to the theorist. At the centre sits a shared frame labeled one Form, one gate, joules as the ranking.')

def tbp_stack():
    s = S(1200, 900, 'The stack with every interface checked', 'Each boundary states its assumption and the check that refuses a crossing when it fails (after RCE \u00a74.6).', 'DIAGRAM')
    layers = ['Intent', 'Form', 'Gate', 'Projections', 'Runtime', 'Hardware and energy']
    checks = [('intent to Form', 'state not declared cannot be written'), ('Form to gate', 'input satisfies its source contract'), ('gate to projections', 'every target computes the same \u03b4'), ('projections to runtime', 'Ok outputs satisfy the output schema'), ('runtime to hardware', 'instruction contract and envelope stated')]
    x, w, h = 70, 440, 82
    for i, n in enumerate(layers):
        y = 130 + i*125
        s.r(x, y, w, h, '#f8fafc', BLUE, 12, 3); s.t(x+24, y+50, n, 22, 800)
        if i < len(checks):
            gy = y + h + 21
            s.r(x+w/2-34, gy-12, 68, 24, CARD, GREEN, 12, 3); s.p(f'M{x+w/2-8} {gy} L{x+w/2-2} {gy+6} L{x+w/2+9} {gy-6}', GREEN, 3)
            s.t(x+w+40, gy-4, checks[i][0], 16, 700); s.t(x+w+40, gy+16, checks[i][1], 15, 400, MUTED)
    yr = 130 + 4*125
    s.c(x+w-40, yr+41, 18, GREEN); s.t(x+w-40, yr+49, '+', 26, 800, CARD, 'middle')
    for i in range(4):
        y0 = yr - i*125
        s.p(f'M{x+w-40} {y0+18} L{x+w-40} {y0-60}', GREEN, 4, arrow=True)
    for i, ln in enumerate(['a correction at the runtime', 'passes its own check, and', 'every level above inherits it', '(Proposition 3)']):
        s.t(870, yr-10+i*22, ln, 15, 700 if i == 0 else 400, GREEN)
    s.save('three-body', 'stack-checks', 'Diagram of a stack with six levels from intent at the top through Form, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.')

def ie_estimates():
    s = S(1200, 700, 'Primary estimates, by kind', 'Log scale, US dollars except where noted. Not additive: categories overlap, and a stock sits beside annual flows.', 'DATA')
    rows = [('Mars Surveyor 1998 project (orbiter and lander)', 327.6e6, 'accounted', '$327.6 M'),
            ('Cluster II recovery, ESA 1997', 214e6, 'accounted', '214 MECU'),
            ('NIST 2004: inadequate interoperability, capital facilities', 15.8e9, 'model', '$15.8 B / yr'),
            ('NIST 2002: inadequate software testing infrastructure', 59.5e9, 'model', '$59.5 B / yr'),
            ('Stripe 2018: developer time on bad code (survey)', 85e9, 'model', '~$85 B / yr'),
            ('CISQ 2022: accumulated technical debt (stock)', 1.52e12, 'model', '~$1.52 T'),
            ('CISQ 2022: cost of poor software quality, US', 2.41e12, 'model', '\u2265 $2.41 T / yr')]
    x0, w, lo, hi = 560, 520, 8, 13
    X = lambda v: x0 + (math.log10(v) - lo) / (hi - lo) * w
    for e in range(lo, hi + 1):
        s.l(X(10**e), 130, X(10**e), 590, GRID, 1)
        s.t(X(10**e), 612, {8: '$100 M', 9: '$1 B', 10: '$10 B', 11: '$100 B', 12: '$1 T', 13: '$10 T'}[e], 15, 500, MUTED, 'middle')
    for i, (lab, v, k, txt) in enumerate(rows):
        y = 150 + i * 62
        col = GREEN if k == 'accounted' else BLUE
        s.t(x0 - 14, y + 26, lab, 15, 500, INK, 'end')
        s.r(x0, y + 8, X(v) - x0, 30, col, 'none', 4)
        s.t(X(v) + 8, y + 29, txt, 15, 700)
    s.r(70, 640, 22, 16, GREEN, 'none', 3); s.t(100, 654, 'accounted cost (single failure)', 15, 500)
    s.r(420, 640, 22, 16, BLUE, 'none', 3); s.t(450, 654, 'model or survey estimate', 15, 500)
    s.save('interface-economics', 'estimates-by-kind', 'Bar chart on a logarithmic dollar axis of the primary estimates cited in this essay, colored by kind. Accounted costs: the Mars Surveyor 1998 project at 327.6 million dollars and the Cluster II recovery at 214 million ECU. Model estimates: NIST 2004 inadequate interoperability in US capital facilities at 15.8 billion dollars a year; NIST 2002 inadequate software testing infrastructure at 59.5 billion dollars a year; Stripe 2018 developer time on bad code at about 85 billion dollars a year; CISQ 2022 technical debt at about 1.52 trillion dollars accumulated; CISQ 2022 cost of poor software quality in the US at least 2.41 trillion dollars in 2022.')

if __name__ == '__main__':
    for f in [rce_design_space, rce_form_projections, rce_stack, rce_ecosystem, rce_ladder, essay_spend, essay_tokens, essay_energy, essay_price,
              agency_layers, agency_gate_rank, agency_carriers, agency_tempo, agency_runs, gates_plateau, gates_commit, satiation_curve, spell_timeline,
              tbp_bodies, tbp_stable, tbp_stack, ie_estimates]:
        f()
