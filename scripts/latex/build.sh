#!/bin/bash
# Build LaTeX sources and PDFs for each paper into public/pdfs/latex/.
set -e
cd "$(dirname "$0")/../.."
OUT=$(mktemp -d); DEST=public/pdfs/latex; mkdir -p $DEST
for slug in "${@:-agency gates rce ai-coding-market satiation spellcheck three-body interface-economics}"; do
  for p in $slug; do
    python3 scripts/latex/prep.py $p $OUT
    pandoc $OUT/$p.md -f markdown+tex_math_dollars+pipe_tables-implicit_figures+implicit_figures -s -o $OUT/$p.tex \
      --pdf-engine=xelatex -V documentclass=article -V geometry:margin=2.2cm -V fontsize=10pt \
      -V colorlinks=true -V linkcolor=blue -V urlcolor=blue --toc --toc-depth=2 -H scripts/latex/header.tex
    (cd $OUT && tectonic --chatter minimal $p.tex 2>&1 | grep -vE "^warning: .*(Underfull|Overfull)" | tail -20); cp $OUT/$p.pdf $DEST/$p.pdf && cp $OUT/$p.tex $DEST/$p.tex
    echo "ok $p"
  done
done
