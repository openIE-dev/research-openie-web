#!/usr/bin/env bash
# Generate study PDFs into public/pdfs/ using pandoc + weasyprint.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/pdfs"
mkdir -p "$OUT" "$ROOT/.pdf-build"

CSS="$ROOT/.pdf-build/paper.css"
cat > "$CSS" << 'CSS'
@page { size: Letter; margin: 0.85in 0.9in; }
html { font-size: 10.5pt; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  color: #111;
  line-height: 1.45;
  max-width: 100%;
}
h1 { font-size: 1.7rem; margin: 0 0 0.6rem; line-height: 1.2; }
h2 { font-size: 1.25rem; margin: 1.4rem 0 0.5rem; border-top: 1px solid #ddd; padding-top: 0.6rem; page-break-after: avoid; }
h3 { font-size: 1.05rem; margin: 1.1rem 0 0.4rem; page-break-after: avoid; }
h4 { font-size: 1rem; margin: 0.9rem 0 0.35rem; }
p, li { orphans: 3; widows: 3; }
a { color: #0b5fff; text-decoration: none; }
code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.88em; }
pre { background: #f6f8fa; border: 1px solid #e5e7eb; padding: 0.65rem 0.75rem; overflow-x: auto; white-space: pre-wrap; }
table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.88em; }
th, td { border: 1px solid #d1d5db; padding: 0.35rem 0.45rem; vertical-align: top; text-align: left; }
th { background: #f3f4f6; }
blockquote { border-left: 3px solid #f59e0b; margin: 0.75rem 0; padding: 0.15rem 0 0.15rem 0.85rem; color: #333; }
.meta { font-size: 0.9rem; color: #444; margin-bottom: 1rem; }
.measurement {
  background: #fffbeb; border: 1px solid #fcd34d; padding: 0.65rem 0.8rem;
  margin: 0.75rem 0 1.25rem; font-size: 0.88rem;
}
hr { border: 0; border-top: 1px solid #e5e7eb; margin: 1.2rem 0; }
CSS

gen_one() {
  local id="$1"
  local src="$ROOT/src/content/papers/${id}.md"
  local tmp="$ROOT/.pdf-build/${id}.md"
  local html="$ROOT/.pdf-build/${id}.html"
  local pdf="$OUT/${id}.pdf"

  python3 - "$src" "$tmp" "$id" << 'PY'
import sys, re
src, tmp, id_ = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(src).read()
# strip Astro YAML frontmatter
if raw.startswith('---'):
    end = raw.find('\n---', 3)
    if end != -1:
        fm = raw[3:end]
        body = raw[end+4:].lstrip('\n')
    else:
        fm, body = '', raw
else:
    fm, body = '', raw

def fm_get(key, default=''):
    m = re.search(rf'^{re.escape(key)}:\s*("?)(.*?)\1\s*$', fm, re.M)
    if not m:
        return default
    return m.group(2)

title = fm_get('title', id_)
deck = fm_get('deck', '')
author = fm_get('author', 'David Charlot · Open Interface Engineering')
status = fm_get('status', 'Research study · draft')

header = f'''# {title}

<div class="meta">
<strong>{author}</strong><br/>
{status} · OpenIE research.openie.dev<br/>
https://research.openie.dev/papers/{id_}/ · PDF https://research.openie.dev/pdfs/{id_}.pdf
</div>

<div class="measurement">
<strong>Measurement.</strong> Research study, not a journal final.
Energy figures from the software reference are OpCounter analytical estimates, not board power.
We have not synthesized or metered an FPGA board. No fabricated citations.
</div>

> {deck}

'''
# Drop the study's own H1 if it duplicates title
body2 = body
lines = body2.splitlines()
if lines and lines[0].startswith('# '):
    body2 = '\n'.join(lines[1:]).lstrip('\n')

open(tmp, 'w').write(header + body2)
print(f'prepared {tmp}')
PY

  /opt/homebrew/bin/pandoc "$tmp" \
    -o "$html" \
    --standalone \
    --from markdown+pipe_tables+gfm_auto_identifiers \
    --metadata title="$id" \
    --css="$CSS" \
    -V lang=en

  # Inline CSS for weasyprint reliability: pandoc --css links; weasyprint needs file path
  /opt/homebrew/bin/pandoc "$tmp" \
    -o "$pdf" \
    --pdf-engine=weasyprint \
    --from markdown+pipe_tables \
    --css="$CSS" \
    --metadata title="$id" \
    2>"$ROOT/.pdf-build/${id}.weasy.log" || {
      echo "weasyprint via pandoc failed for $id; trying HTML→weasyprint"
      /opt/homebrew/bin/weasyprint "$html" "$pdf" 2>>"$ROOT/.pdf-build/${id}.weasy.log"
    }

  ls -la "$pdf"
  file "$pdf"
}

gen_one ni
gen_one satiation
echo 'PDF generation complete'
