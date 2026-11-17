#!/usr/bin/env python3
"""Figures for /papers/planet/ (no third-party packages).

  python3 scripts/figures/planet_figures.py

writes public/figures/planet/query.svg and public/figures/planet/precision.svg.
The precision chart is computed, not drawn by hand: each curve is the gap
between adjacent representable values (one unit in the last place) at a given
distance from the origin.
"""
import math
import os
import struct

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "public", "figures", "planet")


def ulp32(x: float) -> float:
    b = struct.unpack("<I", struct.pack("<f", x))[0]
    return struct.unpack("<f", struct.pack("<I", b + 1))[0] - struct.unpack("<f", struct.pack("<I", b))[0]


def ulp64(x: float) -> float:
    return math.ulp(x)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


HALO = 'stroke="#ffffff" stroke-width="4" paint-order="stroke"'


def precision_svg() -> str:
    W, H = 1000, 600
    L, R, T, B = 110, 960, 70, 500  # plot box
    xmin, xmax = 0, 13  # log10 metres from origin: 1 m .. 10^13 m
    ymin, ymax = -16, 6  # log10 metres of spacing

    def px(lx):
        return L + (lx - xmin) / (xmax - xmin) * (R - L)

    def py(ly):
        return B - (ly - ymin) / (ymax - ymin) * (B - T)

    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica,Arial,sans-serif">',
         f'<rect width="{W}" height="{H}" fill="#ffffff"/>',
         f'<text x="{W/2}" y="34" font-size="21" text-anchor="middle" font-weight="bold">How finely a coordinate can say where you are, by distance from the origin</text>']
    # grid
    for lx in range(xmin, xmax + 1):
        o.append(f'<line x1="{px(lx):.1f}" y1="{T}" x2="{px(lx):.1f}" y2="{B}" stroke="#eee"/>')
        o.append(f'<text x="{px(lx):.1f}" y="{B+20}" font-size="12" text-anchor="middle">10<tspan dy="-6" font-size="9">{lx}</tspan></text>')
    for ly in range(ymin, ymax + 1, 2):
        o.append(f'<line x1="{L}" y1="{py(ly):.1f}" x2="{R}" y2="{py(ly):.1f}" stroke="#eee"/>')
        o.append(f'<text x="{L-8}" y="{py(ly)+4:.1f}" font-size="12" text-anchor="end">10<tspan dy="-6" font-size="9">{ly}</tspan></text>')
    o.append(f'<rect x="{L}" y="{T}" width="{R-L}" height="{B-T}" fill="none" stroke="#333"/>')
    o.append(f'<text x="{(L+R)/2}" y="{B+45}" font-size="14" text-anchor="middle">distance from the coordinate origin (metres, log scale)</text>')
    o.append(f'<text x="30" y="{(T+B)/2}" font-size="14" text-anchor="middle" transform="rotate(-90 30 {(T+B)/2})">smallest step between positions (metres)</text>')

    # tolerance bands
    for ly, label in ((-3, "1 mm: hand-scale contact"), (-2, "1 cm")):
        o.append(f'<line x1="{L}" y1="{py(ly):.1f}" x2="{R}" y2="{py(ly):.1f}" stroke="#b06000" stroke-dasharray="6,4"/>')
        o.append(f'<text x="{R-6}" y="{py(ly)-5:.1f}" font-size="12" fill="#b06000" text-anchor="end" {HALO}>{label}</text>')

    def curve(fn, color, name, lab_x, lab_y):
        pts = []
        n = 400
        for i in range(n + 1):
            lx = xmin + (xmax - xmin) * i / n
            v = fn(10 ** lx)
            pts.append(f"{px(lx):.1f},{py(math.log10(v)):.1f}")
        o.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{color}" stroke-width="2.4"/>')
        o.append(f'<text x="{px(lab_x):.1f}" y="{py(lab_y):.1f}" font-size="13" fill="{color}" font-weight="bold" {HALO}>{esc(name)}</text>')

    curve(ulp32, "#c5221f", "32-bit float (GPU default)", 0.2, -1.0)
    curve(ulp64, "#1a56db", "64-bit float", 4.2, -14.0)
    # fixed point int64 at 1 micrometre: constant step, ends at 2^63 um
    lim = math.log10(2 ** 63 * 1e-6)
    o.append(f'<line x1="{px(xmin):.1f}" y1="{py(-6):.1f}" x2="{px(lim):.1f}" y2="{py(-6):.1f}" stroke="#137333" stroke-width="2.4"/>')
    o.append(f'<line x1="{px(lim):.1f}" y1="{py(-6)-8:.1f}" x2="{px(lim):.1f}" y2="{py(-6)+8:.1f}" stroke="#137333" stroke-width="2.4"/>')
    o.append(f'<text x="{px(0.2):.1f}" y="{py(-6)+20:.1f}" font-size="13" fill="#137333" font-weight="bold" {HALO}>64-bit integer, 1 µm units (ends at 9.2 × 10¹² m, about 62 AU)</text>')

    # landmarks
    marks = [(1e3, "1 km"), (6.371e6, "Earth radius"), (3.844e8, "Moon"), (1.496e11, "1 AU"), (4.5e12, "Neptune")]
    for d, name in marks:
        x = px(math.log10(d))
        o.append(f'<line x1="{x:.1f}" y1="{T}" x2="{x:.1f}" y2="{B}" stroke="#5f6368" stroke-dasharray="2,3"/>')
        anchor = "end" if d > 1e12 else "start"
        o.append(f'<text x="{x+(-4 if anchor == "end" else 4):.1f}" y="{T+14}" font-size="11" fill="#5f6368" text-anchor="{anchor}" {HALO}>{name}</text>')
    x = px(math.log10(6.371e6))
    y = py(math.log10(ulp32(6.371e6)))
    o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#c5221f"/>')
    o.append(f'<text x="{x-8:.1f}" y="{y-10:.1f}" font-size="12" text-anchor="end" fill="#c5221f" {HALO}>0.5 m at the surface</text>')
    o.append(f'<text x="{W/2}" y="{H-22}" font-size="12" text-anchor="middle" fill="#555">Curves computed from IEEE 754 spacing (one unit in the last place). Below the dashed lines, a position can hold hand-scale detail.</text>')
    o.append("</svg>")
    return "\n".join(o)


def query_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640" font-family="Helvetica,Arial,sans-serif">
<rect width="1000" height="640" fill="#ffffff"/>
<defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L9,3 L0,6 z" fill="#333"/></marker></defs>
<text x="500" y="34" font-size="21" text-anchor="middle" font-weight="bold">A planet stored as a function and a log, read one query at a time</text>
<g font-size="14" text-anchor="middle">
<rect x="40" y="70" width="250" height="110" rx="10" fill="#e6f4ea" stroke="#137333" stroke-width="2"/>
<text x="165" y="98" font-weight="bold">Seed + generator G</text><text x="165" y="122">pure function of (seed, cell)</text><text x="165" y="144">integer or fixed-point math</text><text x="165" y="166" font-size="12" fill="#555">a few hundred kilobytes of code</text>
<rect x="40" y="210" width="250" height="110" rx="10" fill="#e6f4ea" stroke="#137333" stroke-width="2"/>
<text x="165" y="238" font-weight="bold">Edit log D</text><text x="165" y="262">append-only: dig, build, move</text><text x="165" y="284">keyed by cell, ordered by tick</text><text x="165" y="306" font-size="12" fill="#555">grows with play, not with planet size</text>
<rect x="370" y="130" width="260" height="130" rx="10" fill="#e8f0fe" stroke="#1a56db" stroke-width="2"/>
<text x="500" y="160" font-weight="bold">Query  W(x, t)</text><text x="500" y="184">= last edit at x before t,</text><text x="500" y="204">else G(seed, x)</text><text x="500" y="232" font-size="13">returns a material id at position x</text>
<rect x="710" y="70" width="250" height="110" rx="10" fill="#e8f0fe" stroke="#1a56db" stroke-width="2"/>
<text x="835" y="98" font-weight="bold">Composition table</text><text x="835" y="122">material id → mass fraction</text><text x="835" y="144">of each chemical element</text><text x="835" y="166" font-size="12" fill="#555">one row per mineral, not per cell</text>
<rect x="710" y="210" width="250" height="110" rx="10" fill="#e6f4ea" stroke="#137333" stroke-width="2"/>
<text x="835" y="238" font-weight="bold">Active region</text><text x="835" y="262">cells near players tick each step</text><text x="835" y="284">results append to D</text><text x="835" y="306" font-size="12" fill="#555">the rest of the planet waits</text>
</g>
<g stroke="#333" stroke-width="1.6" fill="none" marker-end="url(#a)">
<path d="M290 125 L368 170"/><path d="M290 265 L368 225"/><path d="M630 170 L708 125"/><path d="M630 225 L708 262"/><path d="M710 300 C 600 340, 420 340, 292 300"/>
</g>
<line x1="40" y1="372" x2="960" y2="372" stroke="#c5221f" stroke-width="3" stroke-dasharray="10,6"/>
<text x="500" y="362" font-size="13" text-anchor="middle" fill="#137333" font-weight="bold">EXACT ZONE above: same seed, same log, same answer on every machine (state hash per tick)</text>
<text x="500" y="394" font-size="13" text-anchor="middle" fill="#c5221f" font-weight="bold">TOLERANCE ZONE below: pictures only, nothing flows back up</text>
<g font-size="14" text-anchor="middle">
<rect x="40" y="420" width="290" height="120" rx="10" fill="#fef7e0" stroke="#b06000" stroke-width="2"/>
<text x="185" y="448" font-weight="bold">Level of detail</text><text x="185" y="472">cube-sphere quadtree</text><text x="185" y="494">about 24 levels: face to 1 m</text><text x="185" y="516" font-size="12" fill="#555">seams stitched between levels</text>
<rect x="355" y="420" width="290" height="120" rx="10" fill="#fce8e6" stroke="#c5221f" stroke-width="2"/>
<text x="500" y="448" font-weight="bold">Camera-relative rendering</text><text x="500" y="472">positions sent to the GPU as</text><text x="500" y="494">small 32-bit offsets from the eye</text><text x="500" y="516" font-size="12" fill="#555">reversed or logarithmic depth</text>
<rect x="670" y="420" width="290" height="120" rx="10" fill="#fce8e6" stroke="#c5221f" stroke-width="2"/>
<text x="815" y="448" font-weight="bold">Cosmetic detail</text><text x="815" y="472">grass, clouds, atmosphere,</text><text x="815" y="494">particles: free to differ</text><text x="815" y="516" font-size="12" fill="#555">never read by gameplay</text>
</g>
<text x="500" y="580" font-size="13" text-anchor="middle" fill="#555">Exploring "everything" means any position can be queried. It does not mean every position is stored or simulated.</text>
<text x="500" y="602" font-size="12" text-anchor="middle" fill="#555">Green: exact state. Blue: lookups over exact state. Amber and red: views of it.</text>
</svg>"""


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, svg in (("precision.svg", precision_svg()), ("query.svg", query_svg())):
        with open(os.path.join(OUT, name), "w") as f:
            f.write(svg + "\n")
        print("wrote", os.path.join("public/figures/planet", name))


if __name__ == "__main__":
    main()
