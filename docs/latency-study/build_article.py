import re, json, collections
exec(open('ledger.py').read())
L={r[0]:r for r in R}
CLS={'P':'established by proof in the source','D':'demonstrated','O':'opinion'}
ALT=json.load(open('alts.json'))
src=open('ARTICLE_SRC.md').read()
# figure numbers by order of appearance
figs=re.findall(r"\{\{fig:([a-z0-9-]+)\|",src)
assert len(figs)==len(set(figs)) and all(f in ALT for f in figs), set(ALT)-set(figs)
FN={f:i+1 for i,f in enumerate(figs)}
order=[]
def num(k):
    assert k in L, k
    if k not in order: order.append(k)
    return order.index(k)+1
def cite(m):
    keys=[x.strip().lstrip('@') for x in m.group(1).split(';')]
    return '['+', '.join(str(num(k)) for k in keys)+']'
CITE=r"\[((?:@[a-z0-9_]+(?:; )?)+)\]"
def fig(m):
    name,cap=m.group(1),m.group(2)
    cap=re.sub(CITE,cite,cap)
    alt=ALT[name].replace('[','(').replace(']',')')
    return f"![{alt}](/figures/latency/{name}.png)\n\n*Figure {FN[name]}. {cap}*"
out=re.sub(r"\{\{fig:([a-z0-9-]+)\|(.*?)\}\}\n",lambda m:fig(m)+"\n",src,flags=re.S)
out=re.sub(r"\{\{figref:([a-z0-9-]+)\}\}",lambda m:f"Figure {FN[m.group(1)]}",out)
out=re.sub(CITE,cite,out)
out=re.sub(r"\{\{cls:([a-z0-9_]+)\}\}",lambda m:CLS[L[m.group(1)][4]],out)
unused=[k for k in L if k not in order]
refs=["## References","","Each entry ends with its evidence class (Section 1).",""]
for i,k in enumerate(order,1):
    r=L[k]; refs.append(f"{i}. {r[1]}. {r[2]}. <{r[3]}> ({CLS[r[4]]})")
out=out.rstrip()+"\n\n"+"\n".join(refs)+"\n"
open('latency.md','w').write(out)
print(len(order),'cited; unused:',unused); print(collections.Counter(CLS[L[k][4]] for k in order)); print('figures',len(figs))
