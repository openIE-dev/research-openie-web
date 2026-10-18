"""Model outputs for the infrastructure cost and closed-loop sections. Parameters are stated; every input
that is a documented fact carries its source key in a comment. Output: data/model_outputs.json"""
import json
out={}
# --- cost of one accelerator-hour (per H100-equivalent), capital + energy (model output)
K=33311.0      # USD per H100e, median of 74 frontier sites, Epoch AI data centers dataset (capital cost / H100e)
W=879.5        # facility watts per H100e, median, same dataset
rows=[]
for life in (4,5,6):                 # useful lives in filings: 5 (Amazon), 5.5 (Meta), 6 (Alphabet, CoreWeave)
    for u in (0.4,0.6,0.8):
        for price in (0.04,0.08,0.12):  # USD per kWh, stated assumption
            cap=K/(life*8760*u); en=W/1000*price/ u if False else W/1000*price
            rows.append(dict(life=life,util=u,usd_kwh=price,capital_per_hr=round(cap,3),energy_per_hr=round(en,3),total=round(cap+en,3),energy_share=round(en/(cap+en),3)))
out['accel_hour']=rows
base=[r for r in rows if r['life']==6 and r['util']==0.6 and r['usd_kwh']==0.08][0]; print('base',base)
lo=min(r['energy_share'] for r in rows); hi=max(r['energy_share'] for r in rows); print('energy share range',lo,hi)
# --- price decline decomposition, Nov 2022 to Oct 2024 (AI Index 2025)
yrs=23/12
hw_cost=0.70**yrs; hw_eff=1.40**yrs
out['decomp']=dict(years=round(yrs,3),price_fold=280,hardware_cost_fold=round(1/hw_cost,2),hardware_energy_fold=round(hw_eff,2),residual_fold=round(280*hw_cost,0))
print(out['decomp'])
# --- closed-loop bounds
nv_rev=215.938   # NVIDIA FY2026 revenue, USD bn (10-K)
nv_cust=dict(OpenAI=30.0,Anthropic=10.0,CoreWeave=2.0)  # equity or up-to amounts
F=sum(nv_cust.values()); out['nvidia_bound']=dict(F=F,revenue=nv_rev,share=round(F/nv_rev,4))
print('NVIDIA upper bound',F,F/nv_rev)
oa_round=122.0; sup=dict(NVIDIA=30.0,Amazon=50.0)       # CNBC 2026-03-31
out['openai_round']=dict(total=oa_round,nvidia_only=round(30/oa_round,3),nvidia_plus_amazon_max=round(80/oa_round,3))
print(out['openai_round'])
# breakeven induced share for a round trip, gross margin 71.1% (NVIDIA 10-K FY2026)
gm=0.711; be=[]
for v in (0.0,0.25,0.5,0.75,1.0):
    be.append(dict(recovery=v,theta_star=round(max(0.0,(1-v)/gm),3)))
out['breakeven']=be; print(be)
# concentration
out['hhi_min']=dict(nvidia=round(0.22**2+0.14**2,4),coreweave=round(0.67**2,4))
out['backlog_cover']=dict(coreweave_rpo_over_rev=round(60.7/5.131,1))
json.dump(out,open('data/model_outputs.json','w'),indent=1)
