# Figure C1 for /about/rce-jepa: verified outside projects against the seven commitments.
# A dot means the project's own primary source states that commitment (ledger: CONVERGENCE-LEDGER.md).
import os
cols = ["1 Canonical form", "2 Log and replay", "3 Projection", "4 Stored intent", "5 Deterministic gate", "6 Promotion and reuse", "7 Energy or cost"]
rows = [
 ("Intentional Programming (1995)", [1,3,4]), ("Unison", [1]), ("Equality saturation, egg", [1]),
 ("Tacit (2026)", [1]), ("X07 (2026)", [1,2,5]), ("Codifide (2026)", [1,3,4,5,7]), ("NAIL", [1]),
 ("Event sourcing", [2]), ("Elm Architecture", [2]), ("Dedalus, CALM", [2]), ("Temporal, Restate", [2]),
 ("TigerBeetle DST", [2]), ("AILANG", [2]), ("agent-scroll", [2]),
 ("MLIR", [3]), ("Model Driven Architecture", [3,4]), ("Protocol Buffers, Lumos", [3]), ("Forge (2026)", [3,5]),
 ("Faber Romanus (2026)", [3]), ("Intent (2026)", [3,4,5]), ("NanoLang", [3]),
 ("Spec-driven development", [4]), ("Vericoding benchmark", [4,5]),
 ("CompCert, seL4", [5]), ("Sketching, CEGIS", [5]), ("AlphaProof, Clover, AutoVerus", [5]), ("Vera (2026)", [5]),
 ("Voyager, STOP, DGM", [6]), ("AlphaEvolve", [5,6]), ("Getafix, Sorald, TBar", [6]),
 ("FrugalGPT, cost-of-pass", [7]), ("Compiler world models", [7]),
]
W, left, top, rh, cw = 1400, 330, 120, 24, 150
H = top + rh*len(rows) + 50
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Inter, Helvetica, Arial, sans-serif">',
     f'<rect width="{W}" height="{H}" fill="#ffffff"/>',
     '<text x="20" y="34" font-size="22" font-weight="700" fill="#111">Convergence by commitment: verified outside projects</text>',
     '<text x="20" y="58" font-size="14" fill="#444">A dot marks a commitment the project\'s own primary source states. Observation, not a score. RCE is not drawn.</text>']
for j,c in enumerate(cols):
    x = left + j*cw + cw/2
    o.append(f'<text x="{x}" y="{top-14}" font-size="13" font-weight="600" fill="#222" text-anchor="middle">{c}</text>')
for i,(name,ks) in enumerate(rows):
    y = top + i*rh
    if i % 2 == 0: o.append(f'<rect x="10" y="{y}" width="{W-20}" height="{rh}" fill="#f3f4f6"/>')
    o.append(f'<text x="20" y="{y+16}" font-size="13" fill="#111">{name}</text>')
    for j in range(7):
        x = left + j*cw + cw/2
        if j+1 in ks: o.append(f'<circle cx="{x}" cy="{y+rh/2}" r="7" fill="#b45309"/>')
        else: o.append(f'<circle cx="{x}" cy="{y+rh/2}" r="2" fill="#bbb"/>')
o.append(f'<text x="20" y="{H-18}" font-size="12" fill="#555">Sources [C1] to [C57] on research.openie.dev/about/rce-jepa/. OpenIE items (same house) are excluded.</text>')
o.append('</svg>')
out = os.path.join(os.path.dirname(__file__), '../../public/figures/rce-jepa/convergence.svg')
open(out,'w').write('\n'.join(o)); print(W,H)
