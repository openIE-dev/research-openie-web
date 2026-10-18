import yaml,csv,io,tomllib,sys
print("PyYAML",yaml.__version__,"(YAML 1.1 resolver)")
for s in ["no","NO","yes","on","off","y","n","010","0o10","0x1F","1_000","1e3","1.0e3",".inf","~","null","2001-12-14","12:30:45","1:30","country: NO"]:
    try: print("Y",repr(s),"->",repr(yaml.safe_load(s)))
    except Exception as e: print("Y",repr(s),"ERR",type(e).__name__)
print("Y dup keys:", yaml.safe_load("a: 1\na: 2"))
# alias expansion
doc="a: &a [x,x,x,x,x,x,x,x,x]\nb: &b [*a,*a,*a,*a,*a,*a,*a,*a,*a]\nc: &c [*b,*b,*b,*b,*b,*b,*b,*b,*b]\nd: &d [*c,*c,*c,*c,*c,*c,*c,*c,*c]\ne: &e [*d,*d,*d,*d,*d,*d,*d,*d,*d]\n"
d=yaml.safe_load(doc)
def cnt(x): return 1 if not isinstance(x,list) else sum(cnt(i) for i in x)
print("Y alias bomb: input bytes",len(doc),"-> logical leaves",cnt(d['e']))
try:
    import ruamel.yaml as r; y=r.YAML(typ='safe'); 
    print("ruamel (YAML1.2) 'no':",y.load("no"),"'010':",y.load("010"),"'0o10':",y.load("0o10"))
except Exception as e: print("ruamel",e)
# CSV differentials
txt='a,b\n"x,y",2\n1,"multi\nline"\n'
print("C rows csv.reader:",list(csv.reader(io.StringIO(txt))))
print("C naive split lines:",[l.split(',') for l in txt.splitlines()])
print("C quote mid-field:",list(csv.reader(io.StringIO('a,b"c,d\n'))))
print("C strict:",end=' ')
try: print(list(csv.reader(io.StringIO('a,b"c,d\n'),strict=True)))
except Exception as e: print(type(e).__name__,e)
print("C formula injection cell '=cmd|...' is plain data to csv:",list(csv.reader(io.StringIO('=1+1,@SUM(A1)\n'))))
print("C empty line:",list(csv.reader(io.StringIO('a\n\nb\n'))))
# TOML
print("T datetime:",tomllib.loads('d=1979-05-27T07:32:00Z\nn=0xDEAD\nf=inf\ni=9223372036854775807'))
for bad in ['a=1\na=2','i=9223372036854775808','a=010']:
    try: print("T",repr(bad),tomllib.loads(bad))
    except Exception as e: print("T",repr(bad),"rejected:",e)
