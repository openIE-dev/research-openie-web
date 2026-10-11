#!/bin/bash
# finish.sh <lang> <slug>: build, check anchors and KaTeX for the translated page, mark the checklist, deploy, commit.
set -e
cd "$(dirname "$0")/../.."
L=$1; S=$2
npm run build > /tmp/i18n-build.log 2>&1 || { tail -20 /tmp/i18n-build.log; exit 1; }
python3 - "$L" "$S" << 'PY'
import re,sys
L,S=sys.argv[1:3]
en=open(f'dist/papers/{S}/index.html').read(); tr=open(f'dist/{L}/papers/{S}/index.html').read()
ids=set(re.findall(r'id="([^"]+)"',tr))
miss=[a for a in set(re.findall(r'href="#([^"]+)"',tr)) if a not in ids]
enids=[i for i in re.findall(r'<h[2-4][^>]*id="([^"]+)"',en)]
lost=[i for i in enids if i not in ids]
assert not miss, ('broken in-page', miss[:5]); assert not lost, ('english ids lost', lost[:5])
assert 'katex-error' not in tr
print('checks ok', len(ids))
PY
python3 scripts/i18n/mark.py "$L" "$S" full
(cd ../site-ops/deploy && ./deploy.sh research 2>&1 | tail -1)
curl -s -o /dev/null -w "live %{http_code} https://research.openie.dev/$L/papers/$S/\n" https://research.openie.dev/$L/papers/$S/
git add src/content/translations/$L/$S.md scripts/i18n src/content/papers >/dev/null
git commit -q -m "Translation: $S ($L), full text" -- src/content/translations/$L/$S.md scripts/i18n src/content/papers && git log -1 --format=%h
