import csv, sys, statistics, bisect
obsf, pf, ds = sys.argv[1:4]
P=[(float(r['sol']),float(r['ls'])) for r in csv.DictReader(open(pf)) if r['dataset']==ds and r['ls']]
P.sort(); xs=[x for x,_ in P]
def dl(a,b): return (a-b+180)%360-180
def il(s):
    i=bisect.bisect_left(xs,s)
    if i in (0,len(xs)): return None
    (x0,l0),(x1,l1)=P[i-1],P[i]
    if s-x0>0.5 or x1-s>0.5: return None
    return l0+dl(l1,l0)*(s-x0)/(x1-x0)
O=[(float(r['sol']),float(r['ls'])) for r in csv.DictReader(open(obsf))]
for sh in (-1,0,1):
    d=[dl(l,il(s+sh)) for s,l in O if il(s+sh) is not None]
    print(ds, 'shift',sh,'n',len(d),'mean %+.3f median|d| %.3f'%(statistics.fmean(d),statistics.median(abs(x) for x in d)))
# trend vs sol
d=[(s,dl(l,il(s))) for s,l in O if il(s) is not None]
for a in range(0,2300,300):
    q=[x for s,x in d if a<=s<a+300]
    if q: print('  sols',a,a+299,'n',len(q),'mean %+.3f'%statistics.fmean(q))
