#!/usr/bin/env bash
# Generate study PDFs into public/pdfs/.
# Pandoc MathML does not draw KaTeX, so each PDF is the built paper
# article (dist/papers/<id>/index.html, or dist/products/<id>/ for the
# product white papers) plus the existing paper header.
# Run pnpm build first.
#
# Each PDF is stamped in public/pdfs/stamps.json with the SHA-256 of the page
# it printed. `generate-pdfs.sh --stale` (run at the end of `pnpm build`)
# prepares every page, regenerates only the PDFs whose page changed since
# their stamp, and copies them into dist/pdfs/, so a deployed PDF never
# lags its page. With no browser and no weasyprint it fails, naming them.
#
# Math layout: the built HTML is KaTeX markup from the katex copy that
# rehype-katex bundles. Its stylesheet must come from that same copy; a
# stylesheet from a different KaTeX version misplaces fractions, sub- and
# superscripts. Pages are printed with headless Google Chrome, which lays
# out KaTeX HTML (struts, vlists, inline-block alignment) correctly.
# WeasyPrint is the fallback when Chrome is not installed.
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
html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.katex-display { margin: 0.7rem 0; overflow: visible; page-break-inside: avoid; break-inside: avoid; }
.katex { font-size: 1.1em; }
table .katex { font-size: 1em; }
p, li, td, th, blockquote { overflow-wrap: break-word; }
code, a { overflow-wrap: anywhere; }
td, th { hyphens: auto; -webkit-hyphens: auto; }
code, pre, a, .katex { hyphens: manual; -webkit-hyphens: manual; }
table:has(th:nth-child(6)) { font-size: 0.8em; }
img, svg, video { max-width: 100%; height: auto; }
CSS

STALE_ONLY=0
[[ "${1:-}" == "--stale" ]] && STALE_ONLY=1
STAMPS="$OUT/stamps.json"
[[ -f "$STAMPS" ]] || echo '{}' > "$STAMPS"

# The browser: $CHROME, else Google Chrome on macOS, else a Chromium on PATH
# or the Playwright copy under /opt/pw-browsers.
if [[ -z "${CHROME:-}" ]]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$(command -v google-chrome 2>/dev/null || true)" \
           "$(command -v chromium 2>/dev/null || true)" \
           /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
    if [[ -n "$c" && -x "$c" ]]; then CHROME="$c"; break; fi
  done
fi
CHROME="${CHROME:-}"
WEASY="$(command -v weasyprint 2>/dev/null || echo /opt/homebrew/bin/weasyprint)"

# KaTeX stylesheet matching the katex version rehype-katex renders with.
KATEX_CSS="$(python3 - "$ROOT" << 'PY'
import os, sys
from pathlib import Path
root = Path(sys.argv[1])
cands = []
rk = root / "node_modules" / "rehype-katex"
if rk.exists():
    cands.append(Path(os.path.realpath(rk)).parent / "katex" / "dist" / "katex.min.css")
cands.append(root / "node_modules" / "katex" / "dist" / "katex.min.css")
for c in cands:
    if c.is_file():
        print(c)
        break
PY
)"
echo "KaTeX stylesheet: $KATEX_CSS"

gen_one() {
  local id="$1"
  local dir="${2:-papers}"
  local src="$ROOT/src/content/${dir}/${id}.md"
  local built="$ROOT/dist/${dir}/${id}/index.html"
  local html="$ROOT/.pdf-build/${id}.html"
  local pdf="$OUT/${id}.pdf"
  local katex_css="$KATEX_CSS"

  if [[ ! -f "$built" ]]; then
    echo "missing built page $built; run pnpm build first" >&2
    exit 1
  fi
  if [[ ! -f "$katex_css" ]]; then
    echo "missing $katex_css" >&2
    exit 1
  fi

  python3 - "$src" "$built" "$html" "$id" "$CSS" "$katex_css" "$dir" << 'PY'
import html as html_lib
import re
import sys
from pathlib import Path

src, built, out, id_, css, katex_css, dir_ = sys.argv[1:]
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
    return m.group(2).replace('\\"', '"')

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
# Root-relative images (figures) resolve against public/ for the print.
body = body.replace('src="/', 'src="file://' + str(Path(src).resolve().parents[3] / "public") + '/')
body = body.replace('srcset="/', 'srcset="file://' + str(Path(src).resolve().parents[3] / "public") + '/')

if id_ in ("spellcheck", "ai-coding-market", "interface-economics"):
    measure = ""
elif id_ == "ai-reads-human":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, not a journal final.\n"
        "Parse time, token counts, and Apple M5 Max dual-channel reported_j (L3 proc_pid_rusage and L2 IOReport across 34 workloads, 170 windows) were measured locally. No hardware power rail or wall meter was attached (measured_j = None, board_metered = false); model energy figures are other authors' measurements.\n"
        "</div>\n"
    )
elif id_ == "rce-jepa":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, open topic, not a journal final.\n"
        "H2, H15 (single-shot and bounded 5-turn H15-Iterative closing 40/40 residual tasks with 0 contradictions plus DNULLMM1 Gear-0 v2), FormJEPA-v1 (8.42M trainable parameters), FormEBM-v2 (5.85M parameters), and span-normalized FormEBM-v3 (6.05M parameters; H5 AUROC 0.9437, H11 94.0% strict 5-step monotonicity, OOD H15 inversion resolved 0.2585 -> 0.5278) on 1,387 disjoint Forms, plus the 151-task rce repair rung-f audit report Apple M5 Max and Linux x86-64 RAPL on-chip reported_j counters. No hardware rail or wall meter was attached (measured_j = None).\n"
        "</div>\n"
    )
elif id_ == "rce-vc":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, draft, not a journal final.\n"
        "Wall-clock times, admission-path shares, and Apple M5 Max L3 reported_j (317 to 365 microjoules per 100,000-unit admission at commit aba99fce) were measured on the reference build. Receipt costs also carry the stated est_uj table. No hardware rail or wall meter was attached (measured_j = None). No FPGA board result.\n"
        "</div>\n"
    )
elif id_ == "rce-compile":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, draft, not a journal final.\n"
        "Byte reproducibility (E1), 20-kernel x 15-tier Linux Zen 5 and Core i9-13900H RAPL core and package reported_j compilation vs execution energy payback horizons N* including pre-compiled librce_rt.rlib (20.07x lower compile energy, median N* = 1,079) and H4 Regime-B checks (E4-Energy / E4-Prelude), and 245-program / 500-mutant De Bruijn nameless cache soundness plus warm-cache avoided compilation reported_j (E5-Scale) are reported in Section 8. No hardware power rail or wall meter was attached (measured_j = None, board_metered = false).\n"
        "</div>\n"
    )
elif id_ == "rce":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, not a journal final.\n"
        "est_j, reported_j and measured_j are defined in Section 1; Lean 4.36.0 six-kernel bubblewrap-sandboxed lake check --paranoid receipts (5,393 RCE theorem constants from 1,264 source declarations; 68,090 / 68,092 declarations accepted across con-leche, con-ron, lean4lean, nanoda, leanchecker, and Lean v4.36.0; 22,354.77 J Linux RAPL reported_j at commit f87d6af2) are filed in openIE-dev/rce/spec/lean/audit/, and Apple M5 Max on-chip reported_j checker receipts (49.04 mJ per Form check at commit 1762fb4b) are filed in openie-research-experiments/rce/bench/reported-j/; measured_j is reserved for a wall or rail meter and is empty.\n"
        "No FPGA board result in this paper. No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "game-engines":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, draft, not a journal final.\n"
        "All nine falsifier suites (GE-H1 through GE-H9) were executed across physical macOS, Linux, and bare-metal Windows 11 hosts: 30-cell Q32.32 replay (GE-H1), 3-OS libm/FMA float drift (GE-H2), 8-endpoint DirectX 12 / Metal / Vulkan wgpu tolerance (GE-H3), 17-module Haunted Jaunt / Survival Shooter / Tanks Form SLOC comparison (GE-H4), 10,000-actor scaling on Linux RAPL L2 reported_j (GE-H5), 260-module static interface fault detection (GE-H6), 840-trajectory Lyapunov slope sweep (GE-H7), 3-OS one-hour 216,000-tick input-log replay (GE-H8), and 36-task Godot 4.7.2 headless parity (GE-H9). Chrono-Budget Arena mechanics are est_j. No hardware rail or wall meter was attached (measured_j = None, board_metered = false).\n"
        "</div>\n"
    )
elif id_ == "deterministic-null":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, not a journal final.\n"
        "Local Apple M5 Max energy readings are on-chip L2 IOReport and L3 proc_pid_rusage reported_j counters; closed-API runs report token, dollar, and wall-clock counts only. No hardware power rail or wall meter was attached (measured_j = None, board_metered = false). No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "satb-harness":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, not a journal final.\n"
        "Verified across five hardware and OS archetypes: physical Texas Instruments INA238 (VIN L1) and three-channel INA3221 (VDD_GPU, VDD_CPU_SOC_MSS, VIN_SYS_5V0 L2) shunt measured_j on NVIDIA Jetson AGX Thor (shared host; A2 net placement attribution withheld per Falsifier 6), plus on-chip reported_j on Apple M5 Max (IOReport/proc_pid_rusage), Framework AMD Ryzen AI Max+ 395 (0440 root:energy RAPL + Radeon 8060S PPT), Intel Core i9-13900H (psys L1 + package-0 L2 RAPL), and bare-metal Windows 11 Pro x86-64 (Intel Core i7-1165G7 + RTX 2060 rootless nvml.dll cumulative mJ L2 reported_j + Win32 Job Objects). Closed-API server joules remain not_available. No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "time-as-an-index":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, not a journal final.\n"
        "Formal claims in Section 7 are kernel-checked in Lean 4.36.0 (Horizon.lean and Paradox.lean, 31 theorems, zero sorry, zero opaque, zero ofReduceBool) and accepted inside Linux bubblewrap across all 6/6 independent kernels of lake check --paranoid (con-leche/con-ron 58,796 decls; lean4lean/nanoda/leanchecker/Lean 58,798 decls; 27,217.18 J Linux RAPL reported_j); M1 to M8 and F5 SHA-256 spectral runs are deterministic Python/SymPy evaluations; physical energy numbers (k_B T ln 2, Compton clocks) are analytical bounds (est_j). Established literature, mathematical models, and speculative proposals are explicitly separated. No hardware power meter was attached (measured_j = None, board_metered = false).\n"
        "</div>\n"
    )
elif id_ == "communication-avalanche":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, draft, not a journal final.\n"
        "Formal claims in Section 7 are kernel-checked in Lean 4.36.0 (QuorumRatchet.lean, OrchestrationFlow.lean, and EnzymaticSynthesis.lean, 45 theorems, zero sorry, zero opaque, zero ofReduceBool) and accepted inside Linux bubblewrap across all 6/6 independent kernels of lake check --paranoid (con-leche/con-ron 58,928 decls; lean4lean/nanoda/leanchecker/Lean 58,930 decls); CA-M1 to CA-M5 are pre-registered deterministic numerical evaluations; CTA-E4 through CTA-E7 record physical Texas Instruments INA238 (VIN L1) and three-channel INA3221 (VDD_CPU_SOC_MSS L2) shunt measured_j on NVIDIA Jetson AGX Thor (shared host; A2 net idle subtraction withheld per Falsifier 6) strictly separated from four-host RAPL, ri_energy_nj, and NVML reported_j (CTA-E1 to CTA-E7) and cloud API token/USD columns. All 16 audited extracellular-vesicle studies are preclinical animal or in vitro models; human clinical efficacy and N-mind neural bridging remain open ([S]). No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "agency":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, not a journal final.\n"
        "Theorems, experiments and positions are cited from their sources. Estimates are never measured_j.\n"
        "No board power is claimed. No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "gates":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, not a journal final.\n"
        "One board result: AMD Kria KV260 readings from the onboard INA260, board level, not core rail (Section I.3.7).\n"
        "All other energy figures are OpCounter analytical estimates, not board power. No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "lut-adapt":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research study, draft, not a journal final.\n"
        "No physical FPGA board or rail power was measured in this repository (measured_j = None, board_metered = false). Formal claims in Section 4.13 are kernel-checked in Lean 4.36.0 (LutAdapt.lean and Ratchet.lean, 27 theorems, zero sorry, zero opaque, zero ofReduceBool) and accepted inside Linux bubblewrap across all 6/6 independent kernels of lake check --paranoid (con-leche/con-ron 58,683 decls; lean4lean/nanoda/leanchecker/Lean 58,685 decls). Hardware utilization (41,185-67,366 xcup CLB LUTs, 81 RAMB36E2 blocks, 0 DSP48 slices), 1-cycle context switching (CPI = 1.0), and 4-phase VCD toggle-rate + AMD DS925 dynamic switching estimates (Section 4.16, est_j) are Yosys 0.71+ and Verilator 5.054 simulations. Darwin F_NOCACHE NVMe byte counts, active RAM, wall-clock times, and Apple M5 Max Metal INT4 MoE reported_j (6.773 J/tok) were measured locally. No fabricated citations.\n"
        "</div>\n"
    )
elif id_ == "three-body":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, not a journal final.\n"
        "Theory, propositions and protocols. No new energy figure is reported; RCE results are cited from the RCE paper.\n"
        "No hardware result is claimed. No fabricated citations.\n"
        "</div>\n"
    )
elif dir_ == "products":
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Product white paper, kept apart from the research catalog. Not a journal final.\n"
        "Includes the open jcp-satb-cad-spine (JCR-1 canonical det-CBOR + Ed25519 receipts) and MEI-JCP-Tag-v1 DRC-certified PCB, 3D STEP/STL enclosure, and CR2032 electro-thermal simulation reference; host build counters are reported_j and model schedules are est_j. Physical tag bench power has not been measured (board_metered = false, measured_j = None). No fabricated citations.\n"
        "</div>\n"
    )
else:
    measure = (
        '<div class="measurement">\n'
        "<strong>Measurement.</strong> Research paper, not a journal final.\n"
        "Energy figures from the software reference are OpCounter analytical estimates, not board power.\n"
        "We have not synthesized or metered an FPGA board. No fabricated citations.\n"
        "</div>\n"
    )

header = (
    "<h1>" + html_lib.escape(title) + "</h1>\n"
    '<div class="meta">\n<strong>' + html_lib.escape(author) + "</strong><br/>\n"
    + html_lib.escape(status) + " · OpenIE research.openie.dev<br/>\n"
    + "https://research.openie.dev/" + dir_ + "/" + html_lib.escape(id_) + "/ · PDF https://research.openie.dev/pdfs/" + html_lib.escape(id_) + ".pdf\n"
    + "</div>\n"
    + measure
    + "<blockquote>" + html_lib.escape(deck) + "</blockquote>\n"
)

doc = (
    "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\"/>\n<title>"
    + html_lib.escape(title)
    + "</title>\n<link rel=\"stylesheet\" href=\"" + katex_css + "\"/>\n"
    + "<link rel=\"stylesheet\" href=\"" + css + "\"/>\n</head>\n<body>\n"
    + header
    + body
    + "\n</body>\n</html>\n"
)
Path(out).write_text(doc)
# The stamp: the page as printed, with this checkout's absolute paths removed.
import hashlib
root = str(Path(src).resolve().parents[3])
digest = hashlib.sha256(doc.replace(root, "").replace(str(Path(katex_css).resolve().parent), "").encode()).hexdigest()
Path(out + ".sha256").write_text(digest)
PY

  local digest; digest="$(cat "$html.sha256")"
  local stamped; stamped="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get(sys.argv[2], ""))' "$STAMPS" "$id")"
  if [[ "$STALE_ONLY" == 1 && "$digest" == "$stamped" && -f "$pdf" ]]; then
    return 0
  fi
  echo "printing $id.pdf"
  if [[ -n "$CHROME" && -x "$CHROME" ]]; then
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer $( [[ $EUID == 0 ]] && echo --no-sandbox ) \
      --allow-file-access-from-files --run-all-compositor-stages-before-draw \
      --virtual-time-budget=15000 --print-to-pdf="$pdf" "file://$html" \
      2> "$ROOT/.pdf-build/${id}.chrome.log" || { cat "$ROOT/.pdf-build/${id}.chrome.log" >&2; exit 1; }
  else
    if [[ ! -x "$WEASY" ]]; then
      echo "$id.pdf is out of date with its page and neither Chrome nor weasyprint is installed" >&2
      exit 1
    fi
    echo "Chrome not found; falling back to weasyprint" >&2
    "$WEASY" "$html" "$pdf"
  fi
  python3 -c 'import json,sys; p=sys.argv[1]; d=json.load(open(p)); d[sys.argv[2]]=sys.argv[3]; json.dump(d,open(p,"w"),indent=1,sort_keys=True); open(p,"a").write("\n")' "$STAMPS" "$id" "$digest"
  if [[ -d "$ROOT/dist/pdfs" ]]; then cp "$pdf" "$ROOT/dist/pdfs/"; fi
  PRINTED="$PRINTED $id"
}


PRINTED=""
gen_one agency
gen_one gates
gen_one lut-adapt
gen_one deterministic-null
gen_one satb-harness
gen_one time-as-an-index
gen_one communication-avalanche
gen_one satiation
gen_one spellcheck
gen_one rce
gen_one rce-jepa
gen_one rce-compile
gen_one rce-vc
gen_one three-body
gen_one game-engines
gen_one latency
gen_one interface-economics
gen_one ai-coding-market
gen_one ai-reads-human
cp "$OUT/ai-coding-market.pdf" "$OUT/rce-economics.pdf"
gen_one mei products
gen_one jouleos products
# Earlier addresses: Notational Intelligence and Mixture of Limits are Parts I and II of gates.
cp "$OUT/gates.pdf" "$OUT/ni.pdf"
cp "$OUT/gates.pdf" "$OUT/mol.pdf"
if [[ -d "$ROOT/dist/pdfs" ]]; then
  cp "$OUT/rce-economics.pdf" "$OUT/ni.pdf" "$OUT/mol.pdf" "$ROOT/dist/pdfs/"
fi
echo "PDFs printed:${PRINTED:- none, every PDF matches its page}"
