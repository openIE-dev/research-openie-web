#!/usr/bin/env python3
"""Figures for the latency study (AI race, infrastructure, parity, geography).
Reads only the small data files in scripts/figures/latency_data/. Writes public/figures/latency/*.svg and .png.
Model outputs are drawn with the Model badge. Run from the repo root: python3 scripts/figures/latency_figures.py"""
import csv, json, math, os, datetime, collections, sys
sys.path.insert(0, os.path.dirname(__file__))
import make_figures as mf
from make_figures import S, BLUE, ORANGE, GREEN, PINK, SKY, VERM, YELLOW, INK, MUTED, GRID, EDGE, legend
D = os.path.join(os.path.dirname(__file__), 'latency_data')
def rd(n): return list(csv.DictReader(open(os.path.join(D, n), encoding='utf-8')))
def js(n): return json.load(open(os.path.join(D, n)))
PAPER = 'latency'
def yr(d): 
    y, m, dd = (list(map(int, d.split('-'))) + [1, 1])[:3]
    return y + (m - 1) / 12 + (dd - 1) / 365
def fmt(v, d=1): return f'{v:,.{d}f}'
def save(s, name, alt): s.save(PAPER, name, alt)

# ---------- 1 flow graph
def flow():
    s = S(1200, 800, 'Capital and compute commitments, dated',
          'Amounts as printed in filings and releases, USD. Arrow = direction of money or of the purchase commitment. Not netted.', 'DATA')
    W, H = 170, 60
    nodes = {'SoftBank': (20, 300, '#8c6d1f'), 'NVIDIA': (250, 150, BLUE), 'AMD': (250, 600, BLUE),
             'OpenAI': (500, 280, ORANGE), 'Anthropic': (500, 470, ORANGE),
             'CoreWeave': (830, 150, SKY), 'Amazon': (830, 250, GREEN), 'Microsoft': (830, 370, GREEN),
             'Meta': (1030, 150, PINK), 'Blue Owl funds': (1030, 300, '#8c6d1f')}
    for n, (x, y, c) in nodes.items():
        ww = 150 if x == 1030 else W
        s.r(x, y, ww, H, '#f8fafc', c, 14, 3); s.t(x + ww / 2, y + H / 2 + 7, n, 19 if x == 1030 else 20, 800, INK, 'middle')
    def edge(p, q, label, col, dash=None, f=0.5, dy=-8):
        s.l(p[0], p[1], q[0], q[1], col, 2, dash, True)
        mx = p[0] + (q[0] - p[0]) * f; my = p[1] + (q[1] - p[1]) * f + dy
        w = len(label) * 8.0 + 10
        s.r(mx - w / 2, my - 17, w, 24, '#ffffff', 'none', 4, 0); s.t(mx, my, label, 15, 700, col, 'middle')
    edge((190, 330), (500, 320), '$30B equity, Mar 2026', '#8c6d1f', None, .5, -10)
    edge((395, 210), (500, 300), '$30B, Mar 2026', BLUE, None, .35, -14)
    edge((300, 210), (520, 470), 'up to $10B', BLUE, None, .72, 0)
    edge((420, 630), (500, 335), 'warrant, 160M sh', BLUE, '8 6', .62, 0)
    edge((420, 165), (830, 165), '$2B equity, Jan 2026', BLUE, None, .5, -12)
    edge((830, 275), (670, 295), 'up to $50B', GREEN, None, .5, -10)
    edge((830, 390), (670, 330), '$13B, ~27%', GREEN, None, .5, 24)
    edge((830, 415), (670, 495), 'up to $5B', GREEN, None, .5, 26)
    edge((585, 280), (830, 190), 'up to $6.5B', ORANGE, '8 6', .6, -10)
    edge((1030, 180), (1000, 180), '', PINK, '8 6', .5, 0)
    s.t(960, 135, 'up to $14.2B', 14, 700, PINK, 'middle')
    edge((1105, 300), (1105, 210), '$7.0B cash, Oct 2025', '#8c6d1f', None, .5, 4)
    s.t(600, 700, 'Dashed = purchase commitment or warrant. Solid = capital supplied. Colors: chip makers blue, labs orange, clouds green, neocloud sky, finance brown.', 15, 600, INK, 'middle')
    s.t(600, 724, 'Purchase commitments not drawn: OpenAI to Microsoft Azure $250B (Oct 2025) and to AWS $38B (Nov 2025); Anthropic to Azure $30B (Nov 2025).', 15, 600, INK, 'middle')
    s.t(600, 748, 'NVIDIA also reports $27B of its own multi-year cloud service commitments and $3.5B of lease guarantees (Jan 2026). Sources: Table 3.', 15, 400, MUTED, 'middle')
    save(s, 'capital-compute-flow', 'Flow graph with ten named parties in columns: finance, chip makers, labs, clouds. Capital arrows run from NVIDIA, SoftBank, Amazon and Microsoft into OpenAI and from NVIDIA and Microsoft into Anthropic; NVIDIA puts 2 billion dollars into CoreWeave; Blue Owl funds put 7 billion dollars cash into a Meta venture. Dashed arrows show purchase commitments from OpenAI and Meta to CoreWeave and a warrant from AMD to OpenAI. Text lists the larger commitments of OpenAI to Microsoft and Amazon.')

# ---------- 2 capex vs OCF small multiples
def capex():
    R = rd('capex_ocf.csv'); tick = ['MSFT', 'AMZN', 'GOOGL', 'META', 'ORCL', 'CRWV']
    names = {'MSFT': 'Microsoft (FY ends June)', 'AMZN': 'Amazon', 'GOOGL': 'Alphabet', 'META': 'Meta', 'ORCL': 'Oracle (FY ends May)', 'CRWV': 'CoreWeave'}
    s = S(1200, 760, 'Cash capital spending against cash from operations, 2019 to 2026',
          'Annual, USD billions, from SEC XBRL filings. Ratio above 1 means spending exceeded operating cash flow that year.', 'DATA')
    for i, t in enumerate(tick):
        col, row = i % 3, i // 3; x0 = 50 + col * 385; y0 = 140 + row * 300; w, h = 330, 200
        rows = [r for r in R if r['ticker'] == t]; yrs = [int(r['fiscal_year_end'][:4]) for r in rows]
        mx = max(max(float(r['capex_usd_bn']), float(r['op_cash_flow_usd_bn'])) for r in rows) * 1.1
        s.t(x0, y0 - 14, names[t], 18, 800)
        s.l(x0, y0 + h, x0 + w, y0 + h, '#94a3b8', 2); s.l(x0, y0, x0, y0 + h, '#94a3b8', 2)
        for k in (0.5, 1.0):
            yy = y0 + h - h * k; s.l(x0, yy, x0 + w, yy, GRID, 1); s.t(x0 - 6, yy + 5, fmt(mx * k, 0), 12, 400, MUTED, 'end')
        bw = w / (len(rows) * 2.2)
        for j, r in enumerate(rows):
            cx = x0 + 10 + j * (w - 20) / len(rows); c1 = float(r['capex_usd_bn']); c2 = float(r['op_cash_flow_usd_bn'])
            s.r(cx, y0 + h - h * c2 / mx, bw, h * c2 / mx, SKY); s.r(cx + bw, y0 + h - h * c1 / mx, bw, h * c1 / mx, VERM)
            if j in (0, len(rows) - 1) or True: s.t(cx + bw, y0 + h + 16, str(yrs[j])[2:], 11, 400, MUTED, 'middle')
        last = rows[-1]; ratio = float(last['capex_usd_bn']) / float(last['op_cash_flow_usd_bn'])
        s.t(x0 + w, y0 - 14, f"latest ratio {ratio:.2f}", 16, 800, VERM if ratio > 1 else INK, 'end')
    s.r(60, 700, 18, 18, SKY); s.t(86, 715, 'Net cash from operating activities', 15); s.r(380, 700, 18, 18, VERM); s.t(406, 715, 'Payments to acquire property and equipment', 15)
    s.t(1140, 715, 'Excludes finance leases and off-balance-sheet leases.', 13, 400, MUTED, 'end')
    save(s, 'capex-vs-cash-flow', 'Six small bar charts of annual capital spending and operating cash flow for Microsoft, Amazon, Alphabet, Meta, Oracle and CoreWeave. Spending rises sharply in all six. Capital spending stays below operating cash flow for Microsoft, Alphabet and Meta, nearly equals it for Amazon in 2025, and exceeds it for Oracle in fiscal 2025 and 2026 and for CoreWeave in every year.')

# ---------- 3 closed-loop bounds
def closedloop():
    M = js('model_outputs.json')
    s = S(1200, 600, 'Closed-loop test: upper bounds from documented figures',
          'Share of a node\'s funding or revenue that could have been supplied by its own counterparties. Bounds, not observations.', 'MODEL')
    bars = [('OpenAI March 2026 round: NVIDIA only', M['openai_round']['nvidia_only'], BLUE, 'NVIDIA 30 of 122 bn'),
            ('OpenAI round: NVIDIA plus Amazon at its stated maximum', M['openai_round']['nvidia_plus_amazon_max'], ORANGE, '(30 + 50) of 122 bn; Microsoft share undisclosed'),
            ('NVIDIA FY2026: customer-directed capital over revenue', M['nvidia_bound']['share'], GREEN, '(30 + 10 + 2) of 215.9 bn, if all spent on its systems within a year')]
    x0, w = 420, 680
    for i, (lab, v, c, note) in enumerate(bars):
        y = 160 + i * 130
        s.t(x0 - 14, y + 26, lab, 17, 700, INK, 'end'); s.r(x0, y, w, 44, '#f1f5f9'); s.r(x0, y, w * v, 44, c)
        s.t(x0 + w * v + 10, y + 30, f'{v*100:.1f}%', 22, 800, c if c != YELLOW else INK); s.t(x0, y + 72, note, 14, 400, MUTED)
    for v in (0.25, 0.5, 0.75): s.l(x0 + w * v, 140, x0 + w * v, 520, '#94a3b8', 1, '4 4'); s.t(x0 + w * v, 536, f'{int(v*100)}%', 13, 400, MUTED, 'middle')
    s.t(40, 570, 'A high bound does not show that demand is circular. It shows how much of the loop the documents allow. Counter-evidence is in Figure 2 and Section 7.', 15, 500, INK)
    save(s, 'closed-loop-bounds', 'Three horizontal bars. NVIDIA alone supplied up to 24.6 percent of OpenAI March 2026 round. NVIDIA plus Amazon at its stated maximum is up to 65.6 percent. Documented NVIDIA capital to customers is at most 19.5 percent of its fiscal 2026 revenue.')

# ---------- 4 concentration
def conc():
    s = S(1200, 560, 'Customer concentration as disclosed', 'Share of revenue stated in annual reports. Customers are named only where the filing names them.', 'DATA')
    items = [('NVIDIA FY2026, direct customer A (unnamed)', 22, BLUE), ('NVIDIA FY2026, direct customer B (unnamed)', 14, BLUE),
             ('CoreWeave 2025, Microsoft', 67, SKY), ('CoreWeave 2024, top two customers', 77, SKY), ('CoreWeave 2023, top three customers', 73, SKY)]
    x0, w = 470, 640
    for i, (lab, v, c) in enumerate(items):
        y = 140 + i * 66; s.t(x0 - 14, y + 26, lab, 17, 600, INK, 'end'); s.r(x0, y, w, 38, '#f1f5f9'); s.r(x0, y, w * v / 100, 38, c)
        s.t(x0 + w * v / 100 + 10, y + 28, f'{v}%', 20, 800, INK)
    s.t(40, 506, 'Backlog diversification, CoreWeave: no single customer above 35% of backlog at end of 2025, against 85% at the start of the year (annual report letter).', 15, 500)
    s.t(40, 532, 'NVIDIA states that direct customers include system builders and distributors; indirect customers above 10% of revenue are estimated, not named.', 14, 400, MUTED)
    save(s, 'customer-concentration', 'Horizontal bars of disclosed customer shares: NVIDIA two direct customers at 22 and 14 percent; CoreWeave Microsoft 67 percent in 2025, top two 77 percent in 2024, top three 73 percent in 2023.')

# ---------- 5 commitments vs revenue
def commit():
    s = S(1200, 600, 'Contracted commitments against revenue earned', 'USD billions, log scale. Commitments are multi-year and conditional; revenue is one fiscal year.', 'DATA')
    items = [('OpenAI revenue 2025', 13.1, SKY, 'revenue'), ('OpenAI to Microsoft Azure, incremental', 250, ORANGE, 'commit'), ('OpenAI to AWS, 7 years', 38, ORANGE, 'commit'),
             ('CoreWeave revenue 2025', 5.131, SKY, 'revenue'), ('CoreWeave remaining performance obligations', 60.7, ORANGE, 'commit'),
             ('Oracle revenue FY2026', 67.357, SKY, 'revenue'), ('Oracle remaining performance obligations', 664, ORANGE, 'commit')]
    x0, w = 470, 640; lo, hi = math.log10(1), math.log10(1000)
    for k in (1, 10, 100, 1000): xx = x0 + w * (math.log10(k) - lo) / (hi - lo); s.l(xx, 130, xx, 520, GRID, 1); s.t(xx, 540, f'{k:,}', 14, 400, MUTED, 'middle')
    for i, (lab, v, c, kind) in enumerate(items):
        y = 140 + i * 54; s.t(x0 - 14, y + 24, lab, 16, 600, INK, 'end'); ww = w * (math.log10(v) - lo) / (hi - lo)
        s.r(x0, y, ww, 34, c); s.t(x0 + ww + 10, y + 25, f'{v:,.1f}'.rstrip('0').rstrip('.'), 18, 800)
    s.t(40, 576, 'Oracle expects about 13% of its obligations to be recognized within twelve months (quarterly report, Aug 2026). The OpenAI figure for Azure is a contracted purchase, not revenue to Microsoft in one year.', 13, 400, MUTED)
    save(s, 'commitments-vs-revenue', 'Log-scale bars. OpenAI 2025 revenue 13.1 billion dollars against contracted purchases of 250 billion dollars from Microsoft Azure and 38 billion dollars from AWS. CoreWeave revenue 5.1 billion against 60.7 billion obligations. Oracle revenue 67.4 billion against 664 billion obligations.')

# ---------- 6 depreciation lives
def deprec():
    s = S(1200, 520, 'Stated useful lives for servers and network equipment', 'Years, from annual reports. Longer lives spread cost over more years and raise reported earnings in the near term.', 'DATA')
    x0, w = 330, 760
    for k in range(3, 8): xx = x0 + w * (k - 3) / 4; s.l(xx, 130, xx, 420, GRID, 1); s.t(xx, 440, str(k), 14, 400, MUTED, 'middle')
    def X(v): return x0 + w * (v - 3) / 4
    rows = [('CoreWeave', 5, 6, 'Jan 2023: 5 to 6', SKY), ('Amazon (subset)', 6, 5, 'Jan 2025: 6 to 5', GREEN), ('Meta', None, 5.5, 'Jan 2025: set to 5.5', PINK),
            ('Alphabet', None, 6, 'servers and network: 6', ORANGE), ('Microsoft', None, None, 'range 2 to 6', BLUE), ('Oracle', None, None, 'computer and network: 1 to 6', '#8c6d1f')]
    for i, (n, a, b, note, c) in enumerate(rows):
        y = 160 + i * 44; s.t(x0 - 14, y + 6, n, 17, 700, INK, 'end')
        if a and b: s.l(X(a), y, X(b), y, c, 4, None, True); s.c(X(a), y, 8, 'white', c, 3)
        elif b: s.c(X(b), y, 9, c)
        else: s.l(X(2.5 if False else 3), y, X(6), y, c, 8, None); 
        s.t(X(7) + 20, y + 6, note, 14, 400, MUTED, 'start')
    s.t(40, 490, 'Hollow circle = prior estimate; arrow points to the new one. Microsoft and Oracle bars show the stated range (clipped at 3). CoreWeave lenders size loans on the depreciable cost of GPU servers.', 14, 400, MUTED)
    save(s, 'depreciation-lives', 'Dot and arrow chart of stated server lives in years. CoreWeave lengthened from 5 to 6 in 2023, Amazon shortened a subset from 6 to 5 in 2025, Meta set 5.5 in 2025, Alphabet uses 6, Microsoft states 2 to 6 and Oracle 1 to 6.')

# ---------- 7 Hyperion stack
def hyperion():
    s = S(1200, 520, 'One financing structure, as filed: the Hyperion campus venture', 'Meta press release and quarterly report, October 2025. USD billions as printed.', 'DATA')
    s.box(80, 150, 300, 130, 'Meta', ['20% of the venture', 'contributed 4.3 bn of assets', 'received 2.6 bn distribution'], PINK)
    s.box(80, 330, 300, 130, 'Blue Owl funds', ['80% of the venture', '7.0 bn cash at closing', 'about 27 bn total development cost'], '#8c6d1f')
    s.box(500, 230, 280, 130, 'Joint venture', ['owns and develops the campus', 'Meta manages construction', 'and operations services'], BLUE)
    s.box(900, 230, 240, 130, 'Campus', ['Richland Parish, Louisiana', 'buildings, power, cooling,', 'connectivity'], GREEN)
    s.l(380, 215, 500, 280, PINK, 3, None, True); s.l(380, 395, 500, 320, '#8c6d1f', 3, None, True); s.l(780, 295, 900, 295, BLUE, 3, None, True)
    s.t(40, 490, 'The press release gives the split and totals. Rental terms, debt raised at the venture level and guarantees are in other documents; they are not drawn here.', 14, 400, MUTED)
    save(s, 'hyperion-structure', 'Diagram: Meta holds 20 percent and Blue Owl funds 80 percent of a joint venture that owns a Louisiana data center campus. Blue Owl paid 7 billion dollars cash at closing; Meta contributed 4.3 billion dollars of assets and received a 2.6 billion dollar distribution.')

# ---------- 8 hardware efficiency
def hweff():
    H = rd('hardware_flops_per_watt.csv'); F = js('hardware_fit.json')
    s = S(1200, 640, 'Peak tensor FLOP/s per watt of leading accelerators', 'Epoch AI hardware dataset (vendor peak specifications). Log scale. Line = fit to these 12 points.', 'DATA')
    x0, y0, w, h = 130, 140, 960, 420; t0, t1 = 2016, 2025; lo, hi = 10.5, 12.8
    def X(t): return x0 + w * (t - t0) / (t1 - t0)
    def Y(v): return y0 + h - h * (math.log10(v) - lo) / (hi - lo)
    for e in (11, 12): s.l(x0, Y(10**e), x0 + w, Y(10**e), GRID, 1); s.t(x0 - 10, Y(10**e) + 5, f'1e{e}', 14, 400, MUTED, 'end')
    for t in range(2016, 2026): s.t(X(t), y0 + h + 24, str(t), 14, 400, MUTED, 'middle')
    for r in H:
        t = yr(r['release_date']); v = float(r['flops_per_watt']); s.c(X(t), Y(v), 8, BLUE); s.t(X(t), Y(v) - 14, r['hardware'].replace('NVIDIA ', '').replace(' (per GPU)', ''), 12, 500, INK, 'middle')
    a, b = F['intercept_log10_at_2016'], F['slope_log10_per_year']
    s.p(f'M{X(2016):.1f} {Y(10**a):.1f} L{X(2025):.1f} {Y(10**(a+b*9)):.1f}', VERM, 3, 'none', '8 6')
    s.t(x0 + 20, y0 + 30, f"Fit: about {F['growth_per_year']:.2f}x per year (n = {F['n']})", 18, 800, VERM)
    s.t(40, 610, 'Peak specifications are not delivered energy per task. Utilization, memory traffic and software decide the delivered figure.', 14, 400, MUTED)
    save(s, 'hardware-efficiency', 'Scatter on a log axis of peak tensor operations per watt for twelve NVIDIA accelerators from 2016 to 2024 with a dashed fit of about 1.4 times per year.')

# ---------- 9 accelerator-hour cost
def hourcost():
    M = js('model_outputs.json')['accel_hour']
    s = S(1200, 700, 'What one accelerator-hour costs, and how little of it is energy', 'Model output. Capital 33,311 USD per H100-equivalent and 880 W facility power per H100-equivalent (Epoch AI medians); electricity 0.08 USD/kWh.', 'MODEL')
    x0, w = 240, 800; mx = 3.4
    s.t(x0, 138, 'USD per utilized accelerator-hour', 16, 700, INK)
    for k in (0, 1, 2, 3): xx = x0 + w * k / mx; s.l(xx, 150, xx, 600, GRID, 1); s.t(xx, 620, str(k), 14, 400, MUTED, 'middle')
    rows = [(l, u) for l in (5, 6) for u in (0.4, 0.6, 0.8)]
    for i, (l, u) in enumerate(rows):
        r = [m for m in M if m['life'] == l and m['util'] == u and m['usd_kwh'] == 0.08][0]; y = 160 + i * 66
        s.t(x0 - 14, y + 26, f'life {l} y, utilization {int(u*100)}%', 17, 600, INK, 'end')
        s.r(x0, y, w * r['capital_per_hr'] / mx, 40, BLUE); s.r(x0 + w * r['capital_per_hr'] / mx, y, w * r['energy_per_hr'] / mx, 40, VERM)
        s.t(x0 + w * r['total'] / mx + 10, y + 28, f"{r['total']:.2f}  (energy {r['energy_share']*100:.1f}%)", 17, 800)
    s.r(40, 660, 18, 18, BLUE); s.t(66, 675, 'Capital, straight line', 15); s.r(260, 660, 18, 18, VERM); s.t(286, 675, 'Electricity', 15)
    s.t(1160, 675, 'Across lives 4 to 6, utilization 40 to 80%, 0.04 to 0.12 USD/kWh: energy is 1.5% to 11.8%.', 14, 400, MUTED, 'end')
    save(s, 'accelerator-hour-cost', 'Horizontal stacked bars of cost per utilized accelerator-hour for lives of 5 and 6 years and utilization of 40, 60 and 80 percent. Capital dominates; electricity is a thin slice. Cost ranges from about 0.96 to 2.2 dollars per hour.')

# ---------- 10 price decomposition
def decomp():
    M = js('model_outputs.json')['decomp']
    s = S(1200, 520, 'A 280-fold price fall, and how much hardware can explain', 'GPT-3.5-level inference, Nov 2022 to Oct 2024. Model output from cited annual rates.', 'MODEL')
    x0, w = 120, 960; lg = math.log10(280)
    def X(v): return x0 + w * math.log10(v) / lg
    s.r(x0, 200, w, 56, '#f1f5f9'); s.r(x0, 200, X(M['hardware_cost_fold']) - x0, 56, BLUE)
    s.t(x0 + 6, 190, f"Hardware cost decline (30% a year): about {M['hardware_cost_fold']:.1f}x", 17, 700, BLUE)
    s.r(x0, 330, w, 56, '#f1f5f9'); s.r(x0, 330, X(M['hardware_energy_fold']) - x0, 56, VERM)
    s.t(x0 + 6, 320, f"Hardware energy efficiency (40% a year): about {M['hardware_energy_fold']:.1f}x", 17, 700, VERM)
    s.r(x0, 450, w, 36, '#f1f5f9'); s.r(x0, 450, w, 36, GREEN)
    s.t(x0 + 6, 440, f"Observed price fall: 280x. Remainder after the hardware cost term: about {int(M['residual_fold'])}x", 17, 700, GREEN)
    s.t(x0, 510, 'Log scale from 1x to 280x. Price is not cost; the remainder mixes smaller models, algorithms, utilization and margins.', 14, 400, MUTED)
    save(s, 'price-decomposition', 'Three log-scale bars: hardware cost decline explains about 2 times, hardware energy efficiency about 1.9 times, against an observed 280 times price fall; the remaining factor is about 141 times.')

# ---------- 11 open compute lag
def openlag():
    T = rd('compute_threshold_firsts.csv')
    s = S(1200, 560, 'When did open-weight models reach each training-compute level?', 'Epoch AI notable-models data. First notable model at or above the level, any access type against open weights.', 'DATA')
    x0, y0, w = 220, 140, 900; t0, t1 = 2019, 2026
    def X(t): return x0 + w * (t - t0) / (t1 - t0)
    for t in range(t0, t1 + 1): s.l(X(t), y0, X(t), 470, GRID, 1); s.t(X(t), 490, str(t), 14, 400, MUTED, 'middle')
    for i, r in enumerate(T):
        y = y0 + 30 + i * 70; ta = yr(r['first_any_date']); s.t(x0 - 14, y + 6, f"{r['threshold_flop']} FLOP", 18, 800, INK, 'end')
        s.c(X(ta), y, 9, VERM)
        if r['first_open_date']:
            to = yr(r['first_open_date']); s.l(X(ta), y, X(to), y, '#94a3b8', 3); s.c(X(to), y, 9, BLUE, 'white', 2)
            s.t((X(ta) + X(to)) / 2, y - 12, f'{round((to-ta)*12)} months', 15, 800, INK, 'middle')
        else: s.t(X(ta) + 16, y + 6, 'no open-weight model at this level in the data', 14, 400, MUTED)
    s.c(260, 535, 8, VERM); s.t(276, 540, 'first notable model, any access', 14); s.c(560, 535, 8, BLUE); s.t(576, 540, 'first open-weight model', 14)
    s.t(1160, 540, 'Scale of training, not capability. Open models reach many benchmarks with less compute.', 13, 400, MUTED, 'end')
    save(s, 'open-compute-lag', 'Dumbbell chart for training-compute thresholds from 1e22 to 1e26 FLOP: the first notable model at any access type and the first open-weight model, with the gap in months shrinking from about 31 months at 1e23 to 15 months at 1e25 and no open-weight model yet at 1e26 in the data.')

# ---------- 12 research to product lag
def prodlag():
    P = [('FlashAttention to PyTorch 2.0 attention kernel', '2022-05', '2023-03-15'), ('Mamba to a production hybrid (Jamba)', '2023-12', '2024-03'), ('Speculative decoding to Google products', '2022-11-30', '2024-12')]
    s = S(1200, 460, 'Paper to product: three dated pairs', 'First public paper month and the date the same method is reported inside a shipped system. Months are rounded; sample of three.', 'DATA')
    x0, w = 440, 680; t0, t1 = 2022, 2025.2
    def X(t): return x0 + w * (t - t0) / (t1 - t0)
    for t in (2022, 2023, 2024, 2025): s.l(X(t), 130, X(t), 380, GRID, 1); s.t(X(t), 400, str(t), 14, 400, MUTED, 'middle')
    for i, (lab, a, b) in enumerate(P):
        y = 170 + i * 80; ta, tb = yr(a), yr(b); s.t(x0 - 14, y + 6, lab, 16, 600, INK, 'end'); s.l(X(ta), y, X(tb), y, '#94a3b8', 4)
        s.c(X(ta), y, 9, BLUE); s.c(X(tb), y, 9, VERM); s.t((X(ta) + X(tb)) / 2, y - 14, f'{round((tb-ta)*12)} months', 17, 800, INK, 'middle')
    s.c(500, 438, 8, BLUE); s.t(516, 443, 'public paper', 14); s.c(660, 438, 8, VERM); s.t(676, 443, 'shipped', 14)
    save(s, 'research-to-product-lag', 'Three dumbbells showing months between a method paper and a shipped system: FlashAttention to PyTorch 2.0 about 10 months, Mamba to Jamba about 3 months, speculative decoding to Google products about 25 months.')

# ---------- 13 alternative hardware ratios
def althw():
    s = S(1200, 640, 'Alternative designs against a baseline in the same paper', 'Ratio = baseline cost divided by alternative cost, as each paper reports it. Different tasks, so bars are not comparable across rows.', 'DATA')
    items = [('BitNet b1.58 2B on CPU, energy per token (estimated by an arithmetic model)', 6.6, 23.2, 'est'), ('BitNet b1.58 2B, memory (non-embedding vs full-model peers)', 3.5, 12.0, 'meas'),
             ('FlightLLM on FPGA vs V100S and A100, energy efficiency', 4.2, 6.0, 'meas'), ('FlightLLM on FPGA vs V100S and A100, cost efficiency', 1.4, 1.8, 'meas'),
             ('MatMul-free LLM on Loihi 2 vs edge GPU, energy (preliminary)', 2.0, 2.0, 'prelim')]
    x0, w = 560, 560; mx = 25
    for k in (1, 5, 10, 25): xx = x0 + w * k / mx; s.l(xx, 140, xx, 480, GRID, 1); s.t(xx, 500, f'{k}x', 14, 400, MUTED, 'middle')
    col = {'est': ORANGE, 'meas': BLUE, 'prelim': PINK}
    for i, (lab, lo, hi, k) in enumerate(items):
        y = 160 + i * 64; s.t(x0 - 14, y + 18, lab, 14, 600, INK, 'end')
        s.r(x0, y, w * lo / mx, 32, col[k]); 
        if hi > lo: s.r(x0 + w * lo / mx, y + 8, w * (hi - lo) / mx, 16, col[k], 'none', 0, 2, .45)
        s.t(x0 + w * hi / mx + 10, y + 24, (f'{lo:g} to {hi:g}x' if hi > lo else f'{lo:g}x'), 16, 800)
    s.r(60, 540, 18, 18, BLUE); s.t(86, 555, 'measured in the paper', 14); s.r(300, 540, 18, 18, ORANGE); s.t(326, 555, 'estimated, not metered', 14); s.r(560, 540, 18, 18, PINK); s.t(586, 555, 'preliminary', 14)
    s.t(40, 590, 'IBM analog in-memory chip: 12.4 TOPS/W chip-sustained on small networks, no matched baseline given. Photonic processor (Nature, 2025): near-electronic precision on ResNet and BERT, no joules in the text read.', 13, 400, MUTED)
    s.t(40, 612, 'Huawei CloudMatrix-Infer on Ascend NPUs: 4.45 tokens/s per TFLOPS in prefill, above published H100 and H800 results; power was not reported, so no joule ratio is drawn.', 13, 400, MUTED)
    save(s, 'alternative-hardware-ratios', 'Horizontal bars of ratios against a baseline: BitNet on CPU energy 6.6 to 22.7 times lower by estimate, memory 5 to 12 times lower, FlightLLM FPGA 4.2 to 6.0 times energy efficiency and 1.4 to 1.8 times cost efficiency versus two GPUs, Loihi 2 about 2 times less energy preliminary.')

# ---------- maps
GEO = None
def geo():
    global GEO
    if GEO is None: GEO = json.load(open(os.path.join(D, 'ne_110m_admin_0_countries.geojson'), encoding='utf-8'))
    return GEO
def proj(lon, lat, x0, y0, w):
    h = w * (80 + 58) / 360
    return x0 + (lon + 180) / 360 * w, y0 + (80 - lat) / (80 + 58) * h
def centroid(f):
    best = None
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for p in polys:
        ring = p[0]; a = 0; cx = cy = 0
        for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
            c = x1 * y2 - x2 * y1; a += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c
        if a == 0: continue
        a *= .5; cen = (cx / (6 * a), cy / (6 * a))
        if best is None or abs(a) > best[0]: best = (abs(a), cen)
    return best[1]
def draw_world(s, x0, y0, w, fills=None, default='#e2e8f0'):
    fills = fills or {}
    for f in geo()['features']:
        nm = f['properties'].get('NAME') or f['properties'].get('ADMIN'); adm = f['properties'].get('ADMIN')
        g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        d = ''
        for p in polys:
            for ring in p:
                pts = [proj(lo, la, x0, y0, w) for lo, la in ring if la > -58]
                if len(pts) > 2: d += 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ' Z '
        c = fills.get(adm, fills.get(nm, default))
        s.o.append(f'<path d="{d}" fill="{c}" stroke="#ffffff" stroke-width="0.7" fill-rule="evenodd"/>')
def cen(name):
    for f in geo()['features']:
        if f['properties'].get('ADMIN') == name or f['properties'].get('NAME') == name: return centroid(f)
    raise KeyError(name)
def mapdc():
    R = rd('frontier_dc_by_country.csv'); s = S(1200, 760, 'Where frontier AI data-center power sits', 'Epoch AI data-center dataset (94 sites, 14.1 GW). Circle area proportional to current power in MW.', 'DATA')
    draw_world(s, 40, 130, 1120)
    nm = {'United States': 'United States of America', 'China': 'China', 'Malaysia': 'Malaysia', 'Norway': 'Norway', 'United Kingdom': 'United Kingdom', 'Indonesia': 'Indonesia', 'Finland': 'Finland', 'Australia': 'Australia', 'Portugal': 'Portugal', 'Iceland': 'Iceland'}
    for r in R:
        if r['country'] not in nm: continue
        lon, lat = cen(nm[r['country']]); x, y = proj(lon, lat, 40, 130, 1120); p = float(r['power_mw']); rad = 3 + math.sqrt(p) * 0.33
        s.o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{VERM}" fill-opacity=".72" stroke="white" stroke-width="1.5"/>')
        if p > 500: s.t(x, y - rad - 6, f"{r['country']} {p/1000:.1f} GW", 16, 800, INK, 'middle')
        elif p > 60: s.t(x + rad + 4, y + 5, f"{r['country']} {p:.0f} MW", 12, 600, INK, 'start')
    s.t(40, 735, 'United States holds 84% of listed power. The dataset relies on public permits and imagery, so sites in China and elsewhere are likelier to be missed.', 14, 400, MUTED)
    save(s, 'map-frontier-datacenters', 'World map with red circles sized by frontier AI data-center power: United States about 11.9 gigawatts, Malaysia 1.1, China 0.7, and small sites in the United Kingdom, Finland, Indonesia, Norway, Australia, Portugal and Iceland.')
def mapmodels():
    data = {'United States of America': 59, 'China': 35, 'South Korea': 8, 'Canada': 1, 'France': 1, 'United Kingdom': 1, 'Singapore': 1}
    s = S(1200, 760, 'Where notable AI models came from in 2025', 'Stanford AI Index 2026, number of notable models by national affiliation of the developer. Hong Kong and Singapore (1 each) are too small to draw at this scale.', 'DATA')
    def shade(v): return '#0072B2' if v >= 30 else ('#56B4E9' if v >= 5 else '#b7dcf3')
    fills = {k: shade(v) for k, v in data.items()}
    draw_world(s, 40, 130, 1120, fills)
    for k, v in data.items():
        try: lon, lat = cen(k)
        except KeyError: continue
        x, y = proj(lon, lat, 40, 130, 1120)
        if k in ('United States of America', 'China', 'South Korea'): s.t(x, y + 6, str(v), 24, 800, 'white' if v >= 30 else INK, 'middle')
    s.t(40, 735, 'Counts: United States 59, China 35, South Korea 8, one each Canada, France, Hong Kong, Singapore, United Kingdom. Counts follow the Epoch AI database as used by the Index.', 14, 400, MUTED)
    save(s, 'map-notable-models', 'World map shading countries by notable AI models released in 2025: United States 59, China 35, South Korea 8, and one each for Canada, France, Singapore and the United Kingdom.')
def mapprog():
    s = S(1200, 880, 'National compute programs and their stated sizes', 'Official or primary statements, 2024 to 2026. Units differ by country, so no ranking is implied.', 'DATA')
    draw_world(s, 40, 130, 1120, default='#eef2f7')
    cards = [('United States', 'United States of America', 'Frontier sites: 11.9 GW listed (Epoch)', -430, -10, BLUE), ('Brazil', 'Brazil', 'PBIA 2024-2028: R$ 23.03 bn plan', -120, 0, GREEN),
             ('European Union', 'Germany', 'InvestAI: EUR 20 bn fund, 4 AI gigafactories', -200, -70, SKY), ('Saudi Arabia', 'Saudi Arabia', 'HUMAIN: up to 500 MW over 5 years', -40, 140, ORANGE),
             ('UAE', 'United Arab Emirates', 'Stargate UAE 1 GW inside a 5 GW campus', 40, 210, VERM), ('India', 'India', 'IndiaAI: 38,231 GPUs onboarded', -20, 150, PINK),
             ('China', 'China', 'Intelligent compute 1.59 million PFLOPS (FP16), end 2025', -60, -120, '#8c6d1f'), ('South Korea', 'South Korea', '260,000 NVIDIA GPUs secured (Oct 2025)', 10, -70, BLUE),
             ('Japan', 'Japan', 'AI and chips: at least JPY 10 tn public support to FY2030', 80, 10, GREEN)]
    for i, (lab, geo_n, txt, dx, dy, c) in enumerate(cards):
        lon, lat = cen(geo_n); x, y = proj(lon, lat, 40, 130, 1120)
        s.c(x, y, 13, c, 'white', 2); s.t(x, y + 5, str(i + 1), 13, 800, 'white', 'middle')
        cx = 40 + (i % 3) * 375; cy = 600 + (i // 3) * 66
        s.r(cx, cy, 360, 56, 'white', c, 8, 2.5); s.c(cx + 22, cy + 28, 13, c, 'white', 2); s.t(cx + 22, cy + 33, str(i + 1), 13, 800, 'white', 'middle')
        s.t(cx + 44, cy + 22, lab, 16, 800, INK); s.t(cx + 44, cy + 44, txt, 12, 400, MUTED)
    s.t(40, 850, 'Africa: Cassava Technologies is deploying an NVIDIA-based AI factory in South Africa, with plans for Nigeria, Kenya, Egypt and Morocco (company statement; no capacity figures read).', 13, 400, MUTED)
    save(s, 'map-national-programs', 'World map with callouts for national compute programs: Brazil R$ 23.03 billion plan, EU 20 billion euro gigafactory fund, Saudi Arabia up to 500 MW, UAE 1 GW Stargate, India 38,231 GPUs, China 1.59 million PFLOPS, South Korea 260,000 GPUs, Japan at least 10 trillion yen to FY2030, United States 11.9 GW of listed frontier sites.')

# ---------- 17 adoption
def adopt():
    rows = [('South Korea (firms, 2024)', 32.9), ('Germany (firms 10+, 2025)', 26), ('Spain (firms 10+, Q1 2025)', 21.1), ('EU (enterprises 10+, 2025)', 20.0), ('United States (firms, Nov 2025 to Jan 2026)', 18),
            ('Brazil (firms 10+, 2024)', 13), ('OECD area (2024)', 13.9), ('France (firms 10+, 2024)', 10)]
    rows.sort(key=lambda r: -r[1])
    s = S(1200, 560, 'Share of firms using AI, from official surveys', 'Percent of firms; years and definitions differ, so read each row on its own. Japan and China are measured on people, not firms.', 'DATA')
    x0, w = 460, 620
    for k in (0, 10, 20, 30, 40): xx = x0 + w * k / 40; s.l(xx, 130, xx, 470, GRID, 1); s.t(xx, 490, f'{k}%', 14, 400, MUTED, 'middle')
    for i, (lab, v) in enumerate(rows):
        y = 140 + i * 42; s.t(x0 - 14, y + 20, lab, 15, 600, INK, 'end'); s.r(x0, y, w * v / 40, 28, BLUE); s.t(x0 + w * v / 40 + 8, y + 22, f'{v:g}%', 16, 800)
    s.t(40, 530, 'Japan: 55.2% of surveyed workers used generative AI in some task (US 90.6%, Germany 90.3%, China 95.8%). China: 515 million users, 36.5% of the population.', 13, 400, MUTED)
    save(s, 'adoption-by-country', 'Horizontal bars of the share of firms using AI in official surveys: South Korea 32.9, Germany 26, Spain 21.1, EU 20.0, United States 18, OECD 13.9, Brazil 13, France 10 percent.')

# ---------- 18 timeline
def timeline():
    s = S(1200, 900, 'Capability releases against deployment and financing', 'Dated items from the sources in the References. Upper lane: public methods and models. Lower lane: product releases, contracts and filings.', 'DATA')
    x0, w = 70, 1060; t0, t1 = 2022, 2026.9
    def X(t): return x0 + w * (t - t0) / (t1 - t0)
    for t in range(2022, 2027): s.l(X(t), 120, X(t), 430, GRID, 1); s.t(X(t) + 4, 444, str(t), 16, 700, MUTED)
    s.l(x0, 300, x0 + w, 300, '#94a3b8', 2)
    up = [('2022-03', 'Chinchilla compute-optimal scaling'), ('2022-05', 'FlashAttention'), ('2022-11-30', 'Speculative decoding'), ('2023-12', 'Mamba state-space model'), ('2024-12', 'DeepSeek-V3: 2.788M GPU-hours'), ('2025-01', 'DeepSeek-R1'),
          ('2025-02', 'Native sparse attention'), ('2025-04', 'BitNet b1.58 2B4T (CPU)'), ('2025-06', 'CloudMatrix-Infer (Ascend)')]
    dn = [('2023-03-15', 'PyTorch 2.0 attention kernel'), ('2024-03', 'Jamba hybrid released'), ('2024-12', 'Google reports speculative decoding in products'), ('2025-09-22', 'NVIDIA-OpenAI letter of intent'),
          ('2025-10-05', 'AMD warrant to OpenAI'), ('2025-10-21', 'Meta-Blue Owl venture'), ('2025-10-28', 'Microsoft-OpenAI agreement'), ('2025-11-03', 'AWS-OpenAI $38B'),
          ('2025-11-18', 'Anthropic with Microsoft and NVIDIA'), ('2026-01-15', 'NVIDIA $2B into CoreWeave'), ('2026-03-31', 'OpenAI $122B round')]
    n = 0; last = {}
    for lane, items, col in ((1, up, BLUE), (-1, dn, VERM)):
        prev = -99; lvl = 0
        for d, lab in items:
            n += 1; x = X(yr(d))
            lvl = (lvl + 1) % 3 if x - prev < 34 else 0; prev = x
            y = 300 - lane * (40 + lvl * 34)
            s.l(x, y, x, 300, col, 2); s.c(x, y, 13, col, 'white', 2); s.t(x, y + 5, str(n), 13, 800, 'white', 'middle')
    n = 0
    for k, (items, col, x0l, ttl) in enumerate(((up, BLUE, 70, 'Methods and models'), (dn, VERM, 640, 'Deployment, contracts and filings'))):
        s.t(x0l, 470, ttl, 17, 800, col)
        for j, (d, lab) in enumerate(items):
            num = j + 1 + (len(up) if k else 0)
            yy = 504 + j * 30
            s.c(x0l + 12, yy - 5, 11, col, 'white', 2); s.t(x0l + 12, yy, str(num), 12, 800, 'white', 'middle'); s.t(x0l + 32, yy, f'{d[:7]}  {lab}', 15, 600, INK)
    save(s, 'timeline-capability-vs-deployment', 'Two-lane timeline from 2022 to 2026 with numbered markers and a legend. Upper lane lists method and model releases such as Chinchilla, FlashAttention, speculative decoding, Mamba, DeepSeek-V3 and R1, native sparse attention and BitNet. Lower lane lists deployments and financing events from PyTorch 2.0 in March 2023 to the OpenAI 122 billion dollar round in March 2026.')

# ---------- 19 cadence vs quarter
def cadence():
    s = S(1200, 520, 'Cadence against readiness: how a calendar adds wait', 'Model illustration. Quarterly decision dates with T = 0.25 year; readiness at a uniform random phase waits T/2 on average.', 'MODEL')
    x0, w = 80, 1040
    for q in range(0, 9):
        x = x0 + w * q / 8; s.l(x, 150, x, 380, '#94a3b8', 2); s.t(x, 404, f'Q{(q % 4) + 1}', 14, 700, MUTED, 'middle')
    for rho, c in ((0.55, BLUE), (1.2, GREEN), (1.95, VERM)):
        x = x0 + w * rho / 2; nxt = math.ceil(rho / 0.25) * 0.25; xn = x0 + w * nxt / 2; y = 200 + (rho > 1) * 60 + (rho > 1.5) * 50
        s.c(x, y, 9, c); s.l(x, y, xn, y, c, 5, None, True); s.t(x, y - 14, 'ready', 14, 700, c, 'middle'); s.t((x + xn) / 2, y + 26, f'wait {int(round((nxt-rho)*52))} weeks', 14, 700, c, 'middle')
    s.t(80, 450, 'Funding cycle for a venture-backed firm: 3 to 5 years between rounds, so the same logic gives 1.5 to 2.5 years on average (Proposition 1).', 16, 600)
    s.t(80, 478, 'The quarter is a property of the reporting calendar, not of the engineering. Readiness phase is modeled, not observed.', 14, 400, MUTED)
    save(s, 'cadence-vs-quarter', 'Timeline of quarterly decision dates with three example readiness times and the weeks each waits until the next date; text states the average wait is half the period.')

# ---------- 20 forcing threshold
def forcing():
    A, c0, s_, r = 10, 4, 2, 0.1; T = 0.25; phi, w_ = 1.0, 0.1
    g = lambda c: (c0 - c) * (A - c - s_)
    s = S(1200, 640, 'The forcing function: how a lower adoption cost removes the gate', 'Model illustration with the Section 7 parameters (A=10, c0=4, s=2, r=0.1, T=0.25). Gain g(c) against the two thresholds.', 'MODEL')
    x0, y0, W, H = 130, 150, 940, 400; cmin, cmax = 0.5, 4.0; gmax = 14
    X = lambda c: x0 + W * (cmax - c) / (cmax - cmin); Y = lambda v: y0 + H - H * v / gmax
    s.l(x0, y0 + H, x0 + W, y0 + H, '#94a3b8', 2); s.l(x0, y0, x0, y0 + H, '#94a3b8', 2)
    pts = [(c, g(c)) for c in [cmin + i * (cmax - cmin) / 100 for i in range(101)]]
    s.p('M' + ' L'.join(f'{X(c):.1f} {Y(v):.1f}' for c, v in pts), BLUE, 4)
    for K, col, lab in ((2.0, VERM, 'before: K = 2'), (0.1, GREEN, 'after: K = 0.1')):
        G = max(r * K, (phi * K - w_) / T); s.l(x0, Y(G), x0 + W, Y(G), col, 3, '8 6'); s.t(x0 + W - 6, Y(G) - 8, f'{lab}: gate level {G:.2f}', 16, 800, col, 'end')
    s.t(x0 + W / 2, y0 + H + 40, 'Outside cost c falls from 4 toward 0.5 (left to right)', 16, 600, INK, 'middle'); s.t(x0 + 6, y0 + 20, 'gain per period g(c)', 15, 600, INK)
    s.t(40, 600, 'Release happens where the curve crosses the dashed level. A tool that cuts K lowers the level to r K and the crossing moves earlier (4.85 months to 0).', 14, 500)
    save(s, 'forcing-function-threshold', 'A decreasing curve of gain against outside cost with two dashed horizontal levels: a high gate level before a tool and a low level after it. The curve crosses the low level earlier as cost falls.')

# ---------- 21 small multiples: capital vs energy intensity
def multiples():
    DC = rd('frontier_dc_cost_per_h100e.csv'); H = rd('hardware_flops_per_watt.csv')
    s = S(1200, 640, 'Four indicators, one panel', 'Capital and facility watts per H100-equivalent by site; accelerator efficiency; listed power by country.', 'DATA')
    def panel(x0, y0, w, h, title, vals, col, unit, lo, hi, log=False):
        s.t(x0, y0 - 10, title, 16, 800); s.l(x0, y0 + h, x0 + w, y0 + h, '#94a3b8', 2)
        n = len(vals); bw = w / n
        for i, v in enumerate(vals):
            hh = h * (v - lo) / (hi - lo); s.r(x0 + i * bw, y0 + h - hh, bw * .8, hh, col)
        s.t(x0, y0 + h + 18, f'min {min(vals):,.0f}', 12, 400, MUTED); s.t(x0 + w, y0 + h + 18, f'max {max(vals):,.0f} {unit}', 12, 400, MUTED, 'end')
    cp = sorted(float(r['usd_per_h100e']) for r in DC); wp = sorted(float(r['watts_per_h100e']) for r in DC)
    panel(60, 150, 520, 150, f'Capital per H100e, n={len(cp)}, median {cp[len(cp)//2]:,.0f} USD', cp, BLUE, 'USD', 0, max(cp))
    panel(660, 150, 480, 150, f'Facility W per H100e, median {wp[len(wp)//2]:,.0f}', wp, VERM, 'W', 0, max(wp))
    ef = [float(r['flops_per_watt']) / 1e9 for r in H]
    panel(60, 390, 520, 150, 'Peak tensor GFLOP/s per W, release order', ef, GREEN, 'GFLOP/s/W', 0, max(ef))
    R = rd('frontier_dc_by_country.csv')[:6]; pv = [float(r['power_mw']) for r in R]
    panel(660, 390, 480, 150, 'Listed power, top six countries (MW)', pv, PINK, 'MW', 0, max(pv))
    s.t(660, 575, ', '.join(r['country'] for r in R), 12, 400, MUTED)
    s.t(40, 610, 'Sites sorted by value within the top panels. Capital includes compute, construction and fit-out as estimated by the dataset. Peak specifications only.', 13, 400, MUTED)
    save(s, 'small-multiples', 'Four small bar panels: capital per H100-equivalent across 74 sites, facility watts per H100-equivalent, peak tensor efficiency of twelve accelerators in release order, and listed power in the six largest countries.')

if __name__ == '__main__':
    for f in (flow, capex, closedloop, conc, commit, deprec, hyperion, hweff, hourcost, decomp, openlag, prodlag, althw, mapdc, mapmodels, mapprog, adopt, timeline, cadence, forcing, multiples): f()
