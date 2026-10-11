#!/usr/bin/env python3
"""assemble.py <lang> <slug> <body.md>: wrap a translated body into src/content/translations/<lang>/<slug>.md.
Inserts the English anchor ids (anchor-alias divs) before each heading by order, carries over the English
alias divs, and appends the English reference list unchanged after the translated References heading."""
import sys, re, json, os
sys.path.insert(0, os.path.dirname(__file__)); from abstracts import A
lang, slug, bodyf = sys.argv[1:4]
en = open(f'src/content/papers/{slug}.md').read()
en = en[re.match(r'---\n.*?\n---\n', en, re.S).end():]
def slugify(t):  # github-slugger
    t = t.lower(); t = re.sub(r'[^\w\- ]', '', t); return t.replace(' ', '-')
en_heads = [(m.group(1), slugify(re.sub(r'[*`$\\]', '', m.group(2)).strip())) for m in re.finditer(r'^(#{2,4}) (.+)$', en, re.M)]
ref_i = next(i for i, (_, s) in enumerate(en_heads) if s == 'references')
refs = en[re.search(r'^## References\s*$', en, re.M).end():]
body = open(bodyf).read()
out, k = [], 0
for line in body.split('\n'):
    m = re.match(r'^(#{2,4}) ', line)
    if m:
        assert k < len(en_heads) and en_heads[k][0] == m.group(1), (k, line, en_heads[k] if k < len(en_heads) else None)
        out.append(f'<div id="{en_heads[k][1]}" class="anchor-alias" aria-hidden="true"></div>\n'); k += 1
    out.append(line)
assert k == ref_i + 1, f'headings {k} vs English {ref_i+1}'
t, d = A[slug][lang]
fm = f'---\ntitle: {json.dumps(t, ensure_ascii=False)}\ndeck: {json.dumps(d, ensure_ascii=False)}\nlang: "{lang}"\nsource: "{slug}"\ncomplete: true\n---\n\n'
txt = fm + '\n'.join(out).rstrip() + '\n' + refs
assert '—' not in txt and '–' not in txt, 'dash'
open(f'src/content/translations/{lang}/{slug}.md', 'w').write(txt)
print('ok', lang, slug, k, 'headings')
