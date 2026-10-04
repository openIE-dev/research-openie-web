#!/usr/bin/env bash
# Generate study PDFs into public/pdfs/ using weasyprint.
# Pandoc MathML does not draw KaTeX, so each PDF is the built paper
# article (dist/papers/<id>/index.html) plus the existing paper header.
# Run pnpm build first.
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
  local built="$ROOT/dist/papers/${id}/index.html"
  local html="$ROOT/.pdf-build/${id}.html"
  local pdf="$OUT/${id}.pdf"
  local katex_css="$ROOT/node_modules/katex/dist/katex.min.css"

  if [[ ! -f "$built" ]]; then
    echo "missing built page $built; run pnpm build first" >&2
    exit 1
  fi
  if [[ ! -f "$katex_css" ]]; then
    echo "missing $katex_css" >&2
    exit 1
  fi

  python3 - "$src" "$built" "$html" "$id" "$CSS" "$katex_css" << 'PY'
import html as html_lib
import re
import sys
from pathlib import Path

src, built, out, id_, css, katex_css = sys.argv[1:]
raw = Path(src).read_text()
fm = ""
if raw.startswith("---"):
    end = raw.find("\n---", 3)
    if end != -1:
        fm = raw[3:end]

def fm_get(key, default=""):
    pattern = "^" + re.escape(key) + r":\s*(\"?)(.*?)\1\s*$"
    m = re.search(pattern, fm, re.M)
    if not m:
        return default
    return m.group(2)

title = fm_get("title", id_)
deck = fm_get("deck", "")
author = fm_get("author", "David Charlot, Open Interface Engineering")
status = fm_get("status", "Research study, draft")

page = Path(built).read_text()
m = re.search(r'<div class="paper-prose[^"]*">', page)
if not m:
    raise SystemExit("paper-prose not found in " + built)
void = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
tag_re = re.compile(r"<!--.*?-->|<!\[CDATA\[.*?\]\]>|<[^>]+>", re.S)
depth = 1
end_at = None
for tm in tag_re.finditer(page, m.end()):
    t = tm.group()
    if t.startswith("<!--") or t.startswith("<!"):
        continue
    mm = re.match(r"</?\s*([a-zA-Z0-9]+)", t)
    if not mm:
        continue
    name = mm.group(1).lower()
    if t.startswith("</"):
        depth -= 1
        if depth == 0:
            end_at = tm.start()
            break
    elif not (t.endswith("/>") or name in void):
        depth += 1
if end_at is None:
    raise SystemExit("paper-prose did not close in " + built)
body = page[m.end():end_at]
body = re.sub(r"\s*<h1\b[^>]*>.*?</h1>", "", body, count=1, flags=re.S)

if id_ == "spellcheck":
    measure = ""
else:
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, not a journal final.\n"
        "Energy figures from the software reference are OpCounter analytical estimates, not board power.\n"
        "We have not synthesized or metered an FPGA board. No fabricated citations.\n"
        "</div>\n"
    )

header = (
    "<h1>" + html_lib.escape(title) + "</h1>\n"
    '<div class="meta">\n<strong>' + html_lib.escape(author) + "</strong><br/>\n"
    + html_lib.escape(status) + " · OpenIE research.openie.dev<br/>\n"
    + "https://research.openie.dev/papers/" + html_lib.escape(id_) + "/ · PDF https://research.openie.dev/pdfs/" + html_lib.escape(id_) + ".pdf\n"
    + "</div>\n"
    + measure
    + "<blockquote>" + html_lib.escape(deck) + "</blockquote>\n"
)

doc = (
    "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\"/>\n<title>"
    + html_lib.escape(title)
    + "</title>\n<link rel=\"stylesheet\" href=\"" + css + "\"/>\n"
    + "<link rel=\"stylesheet\" href=\"" + katex_css + "\"/>\n</head>\n<body>\n"
    + header
    + body
    + "\n</body>\n</html>\n"
)
Path(out).write_text(doc)
print("prepared " + out)
PY

  /opt/homebrew/bin/weasyprint "$html" "$pdf"
  ls -la "$pdf"
  file "$pdf"
}


gen_one ni
gen_one satiation
gen_one mol
gen_one mei
gen_one spellcheck
gen_one jouleos
echo 'PDF generation complete'
