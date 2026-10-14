#!/usr/bin/env python3
"""Insert numbered figures into the papers. Idempotent: skips a figure whose SVG path is already present."""
import re, sys
P = 'src/content/papers/'
def fig(paper, name, alt, n, cap):
    return (f'![{alt}](/figures/{paper}/{name}.svg)\n\n'
            f'*Figure {n}. {cap} A [PNG copy](/figures/{paper}/{name}.png) is provided.*\n\n')
def alt_of(paper, name):
    s = open(f'public/figures/{paper}/{name}.svg').read()
    return re.search(r'<desc id="d">(.*?)</desc>', s, re.S).group(1).replace('&amp;', 'and').replace('[', '(').replace(']', ')')
# (paper, anchor text, mode before|after_para, intro sentence, name, number, caption)
F = [
 ('rce', 'Approaches differ by degree on each axis', 'after', 'Figure 2 draws the five axes and places the main classes of approach on them.', 'design-space', 2,
  'The design space of autonomous coding. Qualitative diagram: each class of approach is placed by the paper\u2019s reading of Section 2 on ordinal levels, not by measurement. Model reliance is drawn as independence from models so that outward is better on every axis.'),
 ('rce', 'The one Python miss is counted as a miss', 'before', 'Figure 3 shows the same counts.', 'ecosystem-checks', 3,
  'The ecosystem at large N. Data figure: the five checks of the table above on 10,000 preregistered Forms, frozen engine at commit `a079967`, 0 model calls, with Wilson 95% intervals computed from the counts. Source: [`bench/ecosystem`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ecosystem/).'),
 ('rce', '**Proposition R3 (falling cost).**', 'before', 'Figure 4 draws the mechanism of Propositions R1 and R2 with the reference workload\u2019s totals.', 'stack-compounding', 4,
  'Corrections compound upward. Diagram of the stack, with a data inset: cumulative escalations over eight rounds of the engine demo\u2019s reference workload, 21 with no correction and 15 with one correction at the sinks (Proposition R2; [RCE engine demo](/demos/rce-engine/#compounding)).'),
 ('rce', '### 5.2 Rewrites proved in Z3', 'before', 'Figure 5 shows the five projections of one Form and the round trip of the two statechart targets.', 'form-projections', 5,
  'One Form, many projections. Diagram: deterministic projection to five targets ([§4.5](#45-the-form-compiler)); the XState and SCXML projections decode back to byte-identical bytes ([§2.3](#23-the-ecosystem-at-large-n)); all five targets print the reference trace byte for byte on the 529 events of `tests/form_targets.rs`.'),
 ('rce', 'L2 to L4 are measured on the Defects4J held-out set', 'before', 'Figure 6 plots the rows of the table with their intervals.', 'lift-ladder', 6,
  'The repair ladder on lifted code. Data figure: held-out test split, frozen engine, location given, token identity gate, 0 model calls; Wilson 95% intervals computed from the counts. Sources: PIT-style mutants [109], ManySStuBs4J 2.0 [107], TSSB-3M v1.0.0 [108]; per-task rows in [`bench/ladder`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).'),
 ('ai-coding-market', '### 2.4 Inference, tokens and unit economics', 'before', 'Figure 1 sets the dollar figures of Sections 2.1 to 2.3 and 2.6 on one axis, marked by the label each source carries.', 'spend-by-label', 1,
  'Dollar figures by label. Data figure, log scale. Sources: Appenzeller and Li [1], Menlo Ventures [2], Mordor Intelligence [3], Cursor [5], Anthropic [6], IEA [10], McKinsey [15], Gartner [24].'),
 ('ai-coding-market', '### 2.5 Price per token', 'before', 'Figure 2 plots the token series.', 'tokens', 2,
  'Tokens processed per month at Google. Data figure, company-reported, log scale. Source: Pichai [8]; the note on token use is from Bai, Huang and Wang [9].'),
 ('ai-coding-market', '### 2.6 Energy and capital', 'before', 'Figure 3 draws the two price series.', 'price-trend', 3,
  'Price of a fixed level of capability. Data figure, log scale: the a16z endpoints are as printed [20]; the Epoch AI line is the stated rate of about 13 times a year since 2023 [4], indexed to an arbitrary start to show slope only. The range by milestone is from Epoch AI [34].'),
 ('ai-coding-market', '### 2.7 Productivity evidence', 'before', 'Figure 4 places the projected grid electricity beside the measured joules of a task.', 'energy', 4,
  'Energy at the grid and at the task. Data figure. Panel a: IEA estimate and projection [10, 11]. Panel b, log scale: one median text prompt, 0.24 Wh measured by the operator [12]; RCE solved repair tasks, `est_j` and `reported_j` ([RCE §6.3](/papers/rce/#63-energy)). The two panels are different units and are not converted into each other.'),
 ('agency', '<div id="21-layer-1-the-law-eligibility"', 'before', 'Figure 1 shows how the three layers stack.', 'three-layers', 1,
  'Agency in three layers. Diagram of Sections 2.1 to 2.3: the definition and gate, the kinematic bounds, and intelligence as the calculus of agency.'),
 ('agency', '**Against the closest work.** A finite optimal cycle time', 'before', 'Figure 2 draws the curve of Prediction 1.', 'act-time', 2,
  'An optimal act time. Model illustration, not a measurement: $J(\\tau) = J_0 + a/\\tau + s\\,\\tau$ with $J_0 = a = 1$ and $s \\in \\{1, 4\\}$ in normalized units. Quadrupling the standing cost halves $\\tau^*$, the slope of $-1/2$ that the falsifier tests.'),
 ('agency', '**Information rates without joules.**', 'before', 'Figure 3 orders the three carriers.', 'carriers', 3,
  'Where coupled bits are written. Qualitative diagram; the one number is Kimura\u2019s estimate [341]. Bounds: Worden [342]; Hled\u00edk, Barton and Tka\u010dik [343].'),
 ('agency', '### 8.11.1 Second run: guarded acceptor, 40 seeds', 'before', 'Figure 4 sets the gate beside the measured ranking at the loose budget.', 'gate-then-rank', 4,
  'Gate first, then rank by joules. Diagram with Run 1 data at $B = 2.0\\,J_{g2}$, means over 20 seeds from the results table above; integrated $\\iota$ alone would rank the goal-blind agent first (R-F6). Source: `experiments/agency-run/results`.'),
 ('agency', '**What replicates, and what does not.**', 'before', 'Figure 5 sets the closed-task results of the three runs side by side.', 'run-results', 5,
  'Tasks closed of 30 in three preregistered runs. Data figure: mean \u00b1 one standard deviation over seeds, from the results tables of Sections 8.11, 8.11.1 and 8.11.2 (part B). Sources: `experiments/agency-run/results`, `results2` and `results_jetson_cyc`.'),
 ('gates', '### I. Companion papers', 'before', 'Figure 1 draws the commit gate.', 'commit-gate', 1,
  'The commit gate. Diagram of propose, certify, commit or refuse, and receipt, as defined in Section I.3.'),
 ('gates', '### II. Named floors', 'before', 'Figure 2 draws the floor and the plateau for one task.', 'mol-plateau', 2,
  'Mixture of Limits on one task. Diagram, not a measurement: verified progress rises in steps through the cascade until the floor, and spend past the floor buys no verified progress (Section II.8.7).'),
 ('satiation', '<div id="38-reason-codes-as-a-partition-not-a-welfare-function"', 'before', 'Figure 1 draws the toy and the separate aggregate claim.', 'satiation-rebound', 1,
  'Task satiation and aggregate rebound. Model illustration of the toy in this section, not a fit: the maximizer of $U(x) - p\\,x$ is $x = 4 - p/2$, finite at every price. The right panel is a schematic; this paper estimates no rebound.'),
 ('spellcheck', '## 3. Definitions and methods', 'before', 'Figure 1 places the dated prices of this section on one axis.', 'price-to-zero', 1,
  'Spell check from a separate price to bundled zero. Data figure, log scale: prices and dates as printed by the sources of this section (Compute!, January 1981; Mendelson, WPDOS; InfoWorld via Wikipedia; Chicago Tribune, 10 April 1988; START, November 1989; Brodie, 2015; the Hunspell README).'),
]
only = sys.argv[1:]
for paper, anchor, mode, intro, name, n, cap in F:
    if only and paper not in only: continue
    path = P + paper + '.md'; s = open(path).read()
    if f'/figures/{paper}/{name}.svg' in s: continue
    i = s.find(anchor); assert i >= 0, (paper, anchor)
    if mode == 'after':
        j = s.find('\n\n', i); i = j + 2
    block = intro + '\n\n' + fig(paper, name, alt_of(paper, name), n, cap)
    s = s[:i] + block + s[i:]
    open(path, 'w').write(s); print('inserted', paper, name)
