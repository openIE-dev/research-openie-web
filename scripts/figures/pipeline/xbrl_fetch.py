import json,urllib.request,sys
UA={'User-Agent':'Open Interface Engineering research dcharlot65@gmail.com'}
CIK={'MSFT':789019,'AMZN':1018724,'GOOGL':1652044,'META':1326801,'ORCL':1341439,'NVDA':1045810,'CRWV':1769628}
CONC=['PaymentsToAcquirePropertyPlantAndEquipment','NetCashProvidedByUsedInOperatingActivities','PaymentsToAcquireProductiveAssets','Revenues','RevenueFromContractWithCustomerExcludingAssessedTax']
def get(u):
    r=urllib.request.Request(u,headers=UA); return json.load(urllib.request.urlopen(r,timeout=60))
for t,c in CIK.items():
    for k in CONC:
        try: d=get(f'https://data.sec.gov/api/xbrl/companyconcept/CIK{c:010d}/us-gaap/{k}.json')
        except Exception as e: continue
        json.dump(d,open(f'xbrl/{t}_{k}.json','w'))
        print(t,k,len(d['units']['USD']))
