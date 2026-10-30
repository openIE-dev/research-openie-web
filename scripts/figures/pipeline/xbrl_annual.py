import json,datetime,glob,os,csv
def ann(t,k):
    p=f'xbrl/{t}_{k}.json'
    if not os.path.exists(p): return {}
    d=json.load(open(p))['units']['USD']; out={}
    for x in d:
        if x.get('form') not in('10-K','10-K/A'): continue
        if 'start' not in x: continue
        s=datetime.date.fromisoformat(x['start']); e=datetime.date.fromisoformat(x['end'])
        if 350<=(e-s).days<=380: out[x['end']]=(x['val'],x['accn'])
    return out
rows=[]
for t in ['MSFT','AMZN','GOOGL','META','ORCL','NVDA','CRWV']:
    cap=ann(t,'PaymentsToAcquireProductiveAssets') if t in('AMZN','NVDA') else ann(t,'PaymentsToAcquirePropertyPlantAndEquipment'); ocf=ann(t,'NetCashProvidedByUsedInOperatingActivities')
    for e in sorted(cap):
        if e>='2019-01-01' and e in ocf: rows.append([t,e,cap[e][0]/1e9,ocf[e][0]/1e9,cap[e][1]])
w=csv.writer(open('capex_ocf.csv','w')); w.writerow(['ticker','fiscal_year_end','capex_usd_bn','op_cash_flow_usd_bn','accession']); [w.writerow([r[0],r[1],round(r[2],3),round(r[3],3),r[4]]) for r in rows]
for r in rows: print(r[0],r[1],round(r[2],1),round(r[3],1),round(r[2]/r[3],2))
