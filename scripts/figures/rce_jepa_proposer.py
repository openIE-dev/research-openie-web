# Architecture figure for the RCE-JEPA proposer section. Run: python3 scripts/figures/rce_jepa_proposer.py
from xml.sax.saxutils import escape as E
import subprocess,os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','public','figures','rce-jepa')
F="Inter, 'DejaVu Sans', Helvetica, Arial, sans-serif"
INK,MUTED,EDGE='#0f172a','#475569','#cbd5e1'
def T(x,y,t,s=16,w=400,f=INK,a='start'):
    return f'<text x="{x}" y="{y}" font-family="{F}" font-size="{s}" font-weight="{w}" fill="{f}" text-anchor="{a}">{E(t)}</text>'
def box(x,y,w,h,c,title,lines):
    o=[f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{c}" fill-opacity="0.12" stroke="{c}" stroke-width="2"/>',T(x+w/2,y+28,title,17,800,INK,'middle')]
    for i,l in enumerate(lines): o.append(T(x+w/2,y+52+i*21,l,14,400,MUTED,'middle'))
    return o
def arrow(x1,y1,x2,y2,c='#334155'):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="2.5" marker-end="url(#a)"/>'
W,H=1500,760
b=['<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#334155"/></marker></defs>',
   T(40,56,'RCE-JEPA: the model steers, the engine renders',28,800),
   T(40,88,'Learned and untrusted inside the dashed region; public code or specified design outside it (see the RCE paper). Only the gate admits.',17,400,MUTED)]
b.append('<rect x="30" y="112" width="1010" height="560" rx="18" fill="none" stroke="#E69F00" stroke-width="2.5" stroke-dasharray="12 8"/>')
b.append(T(50,140,'LEARNED, UNTRUSTED (proposers)',14,800,'#B07500'))
L,Bl,G,Pk='#E69F00','#0072B2','#009E73','#CC79A7'
b+=box(60,160,300,120,L,'Intent encoder',['sigma(iota): required traces,','contracts, tests, text  ->  z_iota'])
b+=box(400,160,300,120,L,'Proposer (inverse model)',['(z_iota, z_f) -> typed Form edit','fill hole, add rule, change guard'])
b+=box(740,160,280,120,Bl,'Exact rollout delta',['reference checker, no model:','trace tau(f) on example events'])
b+=box(400,330,300,140,L,'Form encoder + energy',['(f, tau(f)) -> z_f','E = alpha V + beta d + gamma C','alpha, beta, gamma calibrated per run'])
b+=box(60,330,300,140,L,'Tree search',['beam or tree over edits,','exact delta at every node,','not CEM (space is discrete)'])
b+=box(740,330,280,140,Pk,'Decision head',['small decision model trained','on gate receipts: Choice per','hole, calibrated p_i; a proposer'])
b.append(T(535,515,'Every box in this region may be wrong. None of them can admit a program.',16,700,'#B07500','middle'))
b.append(T(535,540,'Security never depends on any model, hosted or local.',16,700,'#B07500','middle'))
b+=box(1090,160,370,200,G,'GATE (engine design)',['contract check, shadow replay,','schema, Kani certificate,','Z3 proof for rewrites','accept -> promote -> receipt (est_j)','reject -> named broken rule'])
b+=box(1090,400,370,170,G,'Checker and engine',['replay bit for bit (T3)','emitters: Rust, Python, JavaScript (T9-L);','Scala emitted, does not yet agree','design: promoted handler closes the shape'])
b+=[arrow(360,220,398,220),arrow(700,220,738,220),arrow(880,280,700,360),arrow(400,400,362,400),
    arrow(700,400,738,400),arrow(1020,400,1088,330),arrow(1275,360,1275,398)]
b.append('<path d="M 1090 345 C 1060 660, 260 660, 210 474" fill="none" stroke="#D55E00" stroke-width="2.5" stroke-dasharray="8 6" marker-end="url(#a)"/>')
b.append(T(640,615,'rejection: broken rule fed back, search re-ranks',14,600,'#D55E00','middle'))
b.append(T(40,H-48,'Abbreviations: delta, transition function; tau(f), trace of Form f; sigma(iota), specification of intent iota; V, checker violations; d, trace distance; C, predicted cost in joules;',13,400,MUTED))
b.append(T(40,H-26,'CEM, cross-entropy method; Kani, a Rust model checker; Z3, an SMT solver; est_j, estimated joules. A design diagram, not data.',13,400,MUTED))
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><title>RCE-JEPA architecture</title><rect x="1" y="1" width="{W-2}" height="{H-2}" rx="18" fill="#fff" stroke="{EDGE}" stroke-width="2"/>'+''.join(b)+'</svg>'
open(f'{OUT}/architecture.svg','w').write(svg)
subprocess.run(['rsvg-convert','-w',str(W),'-o',f'{OUT}/architecture.png',f'{OUT}/architecture.svg'],check=True)
print('ok')
