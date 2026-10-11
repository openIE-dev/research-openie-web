#!/usr/bin/env python3
"""Turn a paper's Markdown into pandoc-ready Markdown for the LaTeX build."""
import re, sys, os, subprocess
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
slug, out = sys.argv[1], sys.argv[2]
s = open(f'{root}/src/content/papers/{slug}.md').read()
fm = re.match(r'---\n(.*?)\n---\n', s, re.S)
meta = dict(re.findall(r'^(\w+):\s*"?(.*?)"?\s*$', fm.group(1), re.M))
s = s[fm.end():]
s = re.sub(r'<!--\s*include:\s*([\w-]+)\s*-->', lambda m: open(f'{root}/src/includes/{m.group(1)}.md').read(), s)
s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
s = re.sub(r'<div id="[^"]*" class="anchor-alias"[^>]*></div>\n?', '', s)
s = re.sub(r'^# .*\n', '', s, count=1, flags=re.M)  # title goes to metadata
figdir = f'{out}/fig'; os.makedirs(figdir, exist_ok=True)
def img(m):
    alt, src = m.group(1), m.group(2)
    p = root + '/public' + src
    if src.endswith('.svg'):
        png = f'{figdir}/{os.path.basename(src)[:-4]}.png'
        subprocess.run(['rsvg-convert', '-z', '2', '-o', png, p], check=True)
    else:
        png = f'{figdir}/{os.path.basename(src)}'; subprocess.run(['cp', p, png], check=True)
    p = 'fig/' + os.path.basename(png)
    alt = alt.replace('"', "'")
    # caption comes from the italic 'Figure N.' line that follows; the alt text stays as fig-alt
    return f'![]({p}){{width=95% fig-alt="{alt}"}}'
s = re.sub(r'!\[([^\]]*)\]\((/[^)\s]+)\)', img, s)
s = re.sub(r'\]\((/[^)]*)\)', r'](https://research.openie.dev\1)', s)
s = re.sub(r'\]\(#', r'](https://research.openie.dev/papers/%s/#' % slug, s)
s = re.sub(r'(?<![\w/])doi:(10\.\S+?)([.,;]?)(\s|$)', r'[doi:\1](https://doi.org/\1)\2\3', s)
title = meta.get('title', slug).replace('\\"', '"')
head = (f'---\ntitle: "{title}"\nauthor: "{meta.get("author","David Charlot")}"\n'
        f'date: "Version 1.1, 11 October 2026. HTML: https://research.openie.dev/papers/{slug}/"\n---\n\n')
open(f'{out}/{slug}.md', 'w').write(head + s)
