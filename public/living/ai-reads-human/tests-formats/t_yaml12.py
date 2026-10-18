from ruamel.yaml import YAML
import ruamel.yaml, io
print("ruamel.yaml",ruamel.yaml.__version__)
y=YAML(typ='safe')  # YAML 1.2 by default
for s in ["no","NO","yes","on","off","y","010","0o10","0x1F","1_000","1e3","1.0e3",".inf","~","null","2001-12-14","12:30:45","1:30","country: NO","0.5","+1","1_0.5"]:
    try: print("Y12",repr(s),"->",repr(y.load(s)))
    except Exception as e: print("Y12",repr(s),"ERR",type(e).__name__)
for s in ["a: 1\na: 2"]:
    try: print("Y12 dup",repr(y.load(s)))
    except Exception as e: print("Y12 dup key ->",type(e).__name__, str(e).splitlines()[0][:70])
doc="a: &a [x,x,x,x,x,x,x,x,x]\nb: &b [*a,*a,*a,*a,*a,*a,*a,*a,*a]\nc: &c [*b,*b,*b,*b,*b,*b,*b,*b,*b]\nd: &d [*c,*c,*c,*c,*c,*c,*c,*c,*c]\ne: &e [*d,*d,*d,*d,*d,*d,*d,*d,*d]\n"
d=y.load(doc)
def cnt(x): return 1 if not isinstance(x,list) else sum(cnt(i) for i in x)
print("Y12 alias bomb leaves",cnt(d['e']),"input bytes",len(doc))
