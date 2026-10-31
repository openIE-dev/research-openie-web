from xml.sax.saxutils import escape as E
import subprocess,os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','public','figures','rce-jepa')
F="Inter, 'DejaVu Sans', Helvetica, Arial, sans-serif"
INK,MUTED,EDGE='#0f172a','#475569','#cbd5e1'
def T(x,y,t,s=16,w=400,f=INK,a='start'):
    return f'<text x="{x}" y="{y}" font-family="{F}" font-size="{s}" font-weight="{w}" fill="{f}" text-anchor="{a}">{E(t)}</text>'
def wrap(t,n):
    out,cur=[], ''
    for w in t.split():
        if len(cur)+len(w)+1>n: out.append(cur); cur=w
        else: cur=(cur+' '+w).strip()
    out.append(cur); return out
def save(name,w,h,body,title):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>{E(title)}</title><rect x="1" y="1" width="{w-2}" height="{h-2}" rx="18" fill="#fff" stroke="{EDGE}" stroke-width="2"/>'+''.join(body)+'</svg>'
    open(f'{OUT}/{name}.svg','w').write(svg)
    subprocess.run(['rsvg-convert','-w',str(w),'-o',f'{OUT}/{name}.png',f'{OUT}/{name}.svg'],check=True)

# eras
eras=[('1940s to 1950s',['Memory "usually too small"; FORTRAN on IBM 704: 47 statements in 6 min to ~1000 instructions'],['Shannon 1948: information in bits'],['First optimizing compiler (FORTRAN, 1957)']),
('1960s',['IBM System/360 (1964): memory x16, performance x50 across one instruction set'],['Landauer 1961: erasure costs heat; Kolmogorov, Solomonoff, Chaitin: shortest description'],['Hoare 1969: axiomatic proof of programs']),
('1970s to 1980s',['Alto 1973: 4,096 x 32-bit control store; VAX 1977: 5,120 x 96-bit; density doubling every 2 years'],['Bennett 1973: reversible computing; Bennett and Landauer 1985'],['Lehman 1980; Brooks 1986; Hoare et al. 1987: ~100 algebraic laws']),
('1990s to 2000s',['~50% yearly performance growth 1986 to ~2002 from parallel instructions'],['Lloyd 2000: energy limits speed'],['McKee 1995; CompCert and seL4 machine-checked']),
('2010s to today',['Dennard scaling gone by 2012; cache access ~200x a 32-bit add; ~3 to 4 J per language-model token'],['Wolpert 2019; prediction = compression; Carette et al. 2022'],['Learned proposers + exact checkers'])]
W,H=1500,640; b=[T(40,56,'Five eras on the road toward "Laws of Computation"',28,800),T(40,88,'Each era did what its hardware, information theory and applied computer science allowed',17,400,MUTED)]
lanes=[('Hardware','#0072B2'),('Information|theory','#009E73'),('Applied computer|science','#E69F00')]
x0,cw,y0,lh=230,214,140,144
for i,(n,c) in enumerate(lanes):
    y=y0+i*lh
    for k,part in enumerate(n.split('|')): b.append(T(30,y+62+k*20,part,16,700,c))
for j,e in enumerate(eras):
    x=x0+j*cw; b.append(T(x+cw/2-6,y0-14,e[0],16,800,INK,'middle'))
    for i,(n,c) in enumerate(lanes):
        y=y0+i*lh
        b.append(f'<rect x="{x}" y="{y}" width="{cw-12}" height="{lh-14}" rx="10" fill="{c}" fill-opacity="0.10" stroke="{c}" stroke-width="1.5"/>')
        for k,ln in enumerate(wrap(' '.join(e[i+1]),25)[:7]): b.append(T(x+10,y+24+k*19,ln,13.5,400))
xq=x0+5*cw; b.append(f'<rect x="{xq}" y="{y0}" width="{W-xq-30}" height="{3*lh-14}" rx="12" fill="#CC79A7" fill-opacity="0.12" stroke="#CC79A7" stroke-width="2" stroke-dasharray="6 5"/>')
for k,ln in enumerate(['Open question','','a unified','"Laws of','Computation"','','not yet','formalized']): b.append(T(xq+(W-xq-30)/2,y0+60+k*26,ln,16,700 if k in(0,3,4) else 400,'#9c3d7a','middle'))
b.append(T(40,H-24,'Sources: Dijkstra EWD 340; Backus et al. 1957; Hennessy and Patterson 2019; Samsi et al. 2023; others as cited in the table. A historical diagram, not data.',13,400,MUTED))
save('eras',W,H,b,'Five eras toward "Laws of Computation"')

# chain
C,Mc,P,N='#0072B2','#009E73','#E69F00','#cbd5e1'
TAG={'H1':'PL, Coding','H2':'PL','H3':'Coding','H4':'Computation','H5':'Coding','H6':'PL','H7':'PL','H8':'PL, Computation','H9':'Computation','H10':'Coding','H11':'Coding','H12':'Coding, Computation','H13':'Coding','H14':'Coding'}
rows=[('H1','Form smaller than source','C','MP','N'),('H2','Checker cheap','C','P','P'),('H3','Latent acceptance','C','P','N'),('H4','Energy per accepted falls','C','P','CP'),('H5','Energy ranking','C','P','N'),('H6','Apps encodable','C','P','P'),('H7','Model-independent security','C','MP','C'),('H8','Determinism','C','MP','CP'),('H9','Cost before execution','C','P','CP'),('H10','Learning on the quotient','C','P','P'),('H11','Energy monotone in edit distance','C','P','N'),('H12','Decision head calibrated','C','P','P'),('H13','Discrete versus continuous latent','C','P','N'),('H14','Deterministic ladder share','C','P','N')]
col={'C':C,'M':Mc,'P':P,'N':N}; lab={'C':'cited','M':'measured','P':'planned','N':'n/a'}
W,H=1200,856; b=[T(40,56,'The provable chain for "Laws of Coding"',28,800),T(40,88,'Hypothesis x layer of law x implementation layer x evidence',17,400,MUTED)]
cx=[420,680,940]; cw=240
for k,n in enumerate(['Algorithm','Software environment','Hardware']): b.append(T(cx[k]+cw/2,132,n,17,700,INK,'middle'))
for r,(h,d,*cells) in enumerate(rows):
    y=148+r*44; b.append(T(40,y+27,h,16,800)); b.append(T(100,y+20,d,15)); b.append(T(100,y+38,'tests: '+TAG[h],12,400,MUTED))
    for k,cl in enumerate(cells):
        parts=list(cl); pw=(cw-8)/len(parts)
        for q,pc in enumerate(parts):
            b.append(f'<rect x="{cx[k]+q*pw}" y="{y+4}" width="{pw-4}" height="34" rx="7" fill="{col[pc]}" fill-opacity="{0.25 if pc!="N" else 0.5}" stroke="{col[pc]}" stroke-width="1.5"/>')
            b.append(T(cx[k]+q*pw+(pw-4)/2,y+26,lab[pc],13.5,600,INK,'middle'))
y=148+len(rows)*44+26
b.append(T(40,H-14,'Layer tags: PL = "Laws of Programming Languages"; Coding = "Laws of Coding"; Computation = "Laws of Computation".',13,400,MUTED))
for q,(k,n) in enumerate([('C','cited literature'),('M','measured data'),('P','planned experiment'),('N','not applicable')]):
    b.append(f'<rect x="{40+q*270}" y="{y}" width="22" height="22" rx="5" fill="{col[k]}" fill-opacity="0.4" stroke="{col[k]}"/>'); b.append(T(70+q*270,y+17,n,15))
save('chain',W,H,b,'The provable chain for "Laws of Coding"')
print('ok')

# layers spectrum
L=[('"Laws of Computation"','THEORY','What can be computed, at what information and energy cost?','Shannon, Landauer, Bennett, Turing, Rice, Lloyd',0.75,'#0072B2'),
('"Laws of Programming','SCIENCE','What does a program mean?','Hoare 1969, Milner, Harel, Lamport, CompCert',0.7,'#009E73'),
('"Laws of Programming"','SCIENCE','How are correct programs built and transformed?','Hoare et al. 1987, Dijkstra, Bird',0.5,'#E69F00'),
('"Laws of Coding"','ART','How is working code produced in practice?','Brooks, Lehman, Hindle et al., benchmarks; AI coding today',0.15,'#D55E00')]
W,H=1500,560; b=[T(40,56,'Four layers of law, from theory to art',28,800),T(40,88,'Distinct layers, never interchangeable; RCE-JEPA bridges them without merging them',17,400,MUTED)]
for i,(n,k,q,who,f,c) in enumerate(L):
    x=40+i*360; y=130
    b.append(f'<rect x="{x}" y="{y}" width="340" height="270" rx="14" fill="{c}" fill-opacity="0.10" stroke="{c}" stroke-width="2"/>')
    b.append(T(x+20,y+32,k,14,800,c))
    nm=[n] if i!=1 else ['"Laws of Programming','Languages"']
    for j,ln in enumerate(nm): b.append(T(x+20,y+62+j*24,ln,19,800))
    yy=y+62+len(nm)*24+10
    for j,ln in enumerate(wrap(q,34)): b.append(T(x+20,yy+j*20,ln,15,600)); 
    yy+=len(wrap(q,34))*20+12
    for j,ln in enumerate(wrap(who,38)): b.append(T(x+20,yy+j*19,ln,13.5,400,MUTED))
    b.append(T(x+20,y+238,'Formalized today',13,600)); b.append(f'<rect x="{x+150}" y="{y+226}" width="170" height="14" rx="7" fill="#e2e8f0"/><rect x="{x+150}" y="{y+226}" width="{170*f}" height="14" rx="7" fill="{c}"/>')
b.append(f'<path d="M 120 470 Q 750 400 1380 470" fill="none" stroke="#CC79A7" stroke-width="4" stroke-dasharray="10 6"/>')
for x in (220,580,940,1300): b.append(f'<line x1="{x}" y1="400" x2="{x}" y2="{458 if x in(220,1300) else 440}" stroke="#CC79A7" stroke-width="2"/>')
b.append(T(750,500,'RCE-JEPA: a bridge carrying evidence between layers, not a merger',17,700,'#9c3d7a','middle'))
b.append(T(40,H-20,'Bars are a qualitative judgement explained in the accompanying table, not a measurement.',13,400,MUTED))
save('layers',W,H,b,'Four layers of law, from theory to art')
