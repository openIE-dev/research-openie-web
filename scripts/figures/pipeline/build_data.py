"""Derive the small data files used by the latency-study figures from public downloads.
Inputs live in src/ (see SOURCES.md for URLs and licences); outputs go to data/."""
import csv,collections,statistics as st,math,datetime,json,re
def num(x):
    try: return float(x)
    except: return None
# ---- notable models: open vs closed
M=list(csv.DictReader(open('src/epoch_models.dat',encoding='utf-8',errors='ignore')))
rows=[]
for x in M:
    d=x['Publication date']; c=num(x['Training compute (FLOP)']); a=x['Model accessibility']
    if not d or not c or not a: continue
    cls='open' if a.startswith('Open weights') else 'closed'
    rows.append((d[:10],x['Model'],x['Organization'][:40],x['Country (of organization)'][:30],c,a,cls))
rows.sort()
with open('data/models_compute_access.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['date','model','organization','country','training_flop','accessibility','class']); w.writerows(rows)
print('models with compute+access',len(rows))
# thresholds: first date any model / first open-weights model crossing each compute level
out=[]
for e in range(22,27):
    th=10**e
    first_any=next((r for r in rows if r[4]>=th),None); first_open=next((r for r in rows if r[4]>=th and r[6]=='open'),None)
    out.append((f'1e{e}',first_any[0] if first_any else '',first_any[1] if first_any else '',first_open[0] if first_open else '',first_open[1] if first_open else ''))
with open('data/compute_threshold_firsts.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['threshold_flop','first_any_date','first_any_model','first_open_date','first_open_model']); w.writerows(out)
for o in out: print(o)
# ---- frontier data centres by country and cost per H100e
D=list(csv.DictReader(open('src/epoch_dc/data_centers.csv',encoding='utf-8')))
by=collections.defaultdict(lambda:[0,0,0.0,0.0])
for x in D:
    c=x['Country'] or 'unknown'; p=num(x['Current power (MW)']) or 0; h=num(x['Current H100 equivalents']) or 0; k=num(x['Current total capital cost (2025 USD billions)']) or 0
    by[c][0]+=1; by[c][1]+=p; by[c][2]+=h; by[c][3]+=k
with open('data/frontier_dc_by_country.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['country','n_sites','power_mw','h100_equivalents','capital_cost_usd_bn_2025']); 
    for c,v in sorted(by.items(),key=lambda a:-a[1][1]): w.writerow([c,v[0],round(v[1],1),round(v[2]),round(v[3],2)])
per=[]
for x in D:
    p=num(x['Current power (MW)']); h=num(x['Current H100 equivalents']); k=num(x['Current total capital cost (2025 USD billions)'])
    if p and h and k and h>0: per.append((x['Name'],x['Country'],round(p,1),round(h),round(k,3),round(k*1e9/h),round(p*1e6/h)))
per.sort(key=lambda r:r[5])
with open('data/frontier_dc_cost_per_h100e.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['name','country','power_mw','h100_equivalents','capital_cost_usd_bn_2025','usd_per_h100e','watts_per_h100e']); w.writerows(per)
cp=[r[5] for r in per]; wp=[r[6] for r in per]
print('DC n',len(per),'usd/H100e median',st.median(cp),'p10',sorted(cp)[len(cp)//10],'p90',sorted(cp)[9*len(cp)//10],'W/H100e median',st.median(wp))
tot=sum(v[1] for v in by.values()); print('total MW',round(tot),'US share',round(by['United States'][1]/tot,3))
# ---- hardware efficiency over time
H=list(csv.DictReader(open('src/epoch_hw_energy.csv',encoding='utf-8',errors='ignore')))
hw=[]
for x in H:
    m=re.match(r'([\d.]+) x 10\^(\d+)',x['Energy efficiency (tensor and FP16 if available)'].strip())
    if not m: continue
    v=float(m.group(1))*10**int(m.group(2)); hw.append((x['Release date'],x['Hardware'],x['Manufacturer'],v))
hw.sort()
with open('data/hardware_flops_per_watt.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['release_date','hardware','manufacturer','flops_per_watt']); w.writerows(hw)
# log-linear fit
xs=[(datetime.date.fromisoformat(r[0])-datetime.date(2016,1,1)).days/365.25 for r in hw]; ys=[math.log10(r[3]) for r in hw]
mx,my=sum(xs)/len(xs),sum(ys)/len(ys); b=sum((x-mx)*(y-my) for x,y in zip(xs,ys))/sum((x-mx)**2 for x in xs)
print('hw n',len(hw),'growth per year x',round(10**b,3),'first',hw[0],'last',hw[-1])
json.dump({'n':len(hw),'slope_log10_per_year':b,'intercept_log10_at_2016':my-b*mx,'growth_per_year':10**b},open('data/hardware_fit.json','w'))
# ---- foundry counts
A=list(csv.DictReader(open('src/epoch_hw_all.csv',encoding='utf-8',errors='ignore')))
fc=collections.Counter((x['Foundry'] or 'unknown').strip() for x in A)
print(fc.most_common(8))
json.dump(fc.most_common(),open('data/hardware_foundry_counts.json','w'))
