import sys
L,S,state=sys.argv[1],sys.argv[2],(sys.argv[3] if len(sys.argv)>3 else 'full')
LS=['zh-Hans','es','fr','de','ja','pt','hi','ar']; p='scripts/i18n/CHECKLIST.md'
out=[]
for line in open(p).read().split('\n'):
    c=[x.strip() for x in line.strip().strip('|').split('|')]
    if c and c[0]==S and len(c)==9: c[LS.index(L)+1]=state; line='| '+' | '.join(c)+' |'
    out.append(line)
open(p,'w').write('\n'.join(out))
