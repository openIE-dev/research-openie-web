import sys,re,html,subprocess,urllib.request
UA='Open Interface Engineering research dcharlot65@gmail.com'
def fetch(key,url,ua=None):
    req=urllib.request.Request(url,headers={'User-Agent':ua or UA,'Accept':'*/*'})
    try: raw=urllib.request.urlopen(req,timeout=90).read()
    except Exception as e: print(key,'FAIL',e); return False
    open(f'src/{key}.raw','wb').write(raw)
    if raw[:5]==b'%PDF-': subprocess.run(['pdftotext','-layout',f'src/{key}.raw',f'src/{key}.txt'],stderr=subprocess.DEVNULL); t=open(f'src/{key}.txt',errors='ignore').read()
    else:
        t=raw.decode('utf-8','ignore'); t=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',t); t=html.unescape(re.sub(r'<[^>]+>','\n',t)); t=re.sub(r'[ \t\xa0]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t); open(f'src/{key}.txt','w').write(t)
    print(key,'OK',len(t.split()),'words'); return True
if __name__=='__main__':
    for a in sys.argv[1:]:
        k,u=a.split('=',1); fetch(k,u)
