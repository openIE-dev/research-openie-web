---
title: "Obscure frontiers — knowable but off-the-beaten-path knowledge to close RCE's gaps"
deck: "25 Nov 2026. 'Do you need to do any research to close gaps, uncover things that can be known but"
id: rce-obscure-frontiers
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Obscure frontiers — knowable but off-the-beaten-path knowledge to close RCE's gaps

*25 Nov 2026. "Do you need to do any research to close gaps, uncover things that can be known but
are obscure and off the beaten path and therefore not explored?" Yes. Four frontiers where the
knowledge exists, is public, and is under-used by the mainstream — each mapped to the RCE gap it
closes and a concrete ingestion step. Status: 169/169 tests; executor 1164/1280 (90.9%); 47 language
LUTs; 22 fabrics; Cleanroom det_frac 0.99995; worldmodel exact-physics planner built.
**All four frontiers now BUILT (25 Nov 2026):** `costdata.rs` (calibrated Horowitz/Agner cost prior),
`replay.rs` (rr/QEMU hash-chained record/replay + tamper detection), `structural.rs` (ast-grep/comby
structural rewrite), `library.rs` (DreamCoder/stitch library learning + compression). 5 new falsifiers.*

## 1. Per-instruction microarchitectural cost/energy (calibrate living optimization)

**Gap:** placement cost model is a modelled Horowitz prior (`E ≈ a·flops + b·bytes + c`), not
calibrated per-instruction/per-microarchitecture.
**Obscure knowable:** **uops.info** (>800k pages of measured latency/throughput/port-usage per x86
instruction per microarchitecture), **Agner Fog instruction_tables.pdf** (latency/throughput/µop
breakdown, Intel/AMD/VIA), **instlatx64**, and **Horowitz ISSCC 2014** (pJ per op, data-movement
dominance). These are public, precise, and rarely wired into compilers' cost models.
**Ingestion:** build a per-primitive, per-microarchitecture cost table from uops.info/Agner (latency
+ µops) combined with Horowitz energy coefficients; feed `placement::CostModel` as a calibrated
prior, keeping `reported_j`/`measured_j` provenance. Closes the modelled→calibrated gap for the
curse-of-flags / living-optimization claim.

## 2. Deterministic record/replay & deterministic distributed systems (the Cleanroom fab)

**Gap:** Cleanroom's deterministic fab and federation are asserted; the mature prior art on
*whole-system* determinism is under-cited.
**Obscure knowable:** **rr** (lightweight record/replay + reverse execution), **QEMU record/replay**
(whole-VM determinism incl. devices/clocks), **Simics**, **ReEmu** (parallel full-system deterministic
replay, SJTU), and deterministic distributed systems **Calvin / Fauna / Eve / Resin / Anna**
(deterministic execution without consensus). These show determinism at scale is solved engineering,
not speculation.
**Ingestion:** cite/adopt the record-replay log discipline (non-deterministic events logged, replay
exact) as the model for the Form's hash-chained log D; use deterministic-replay semantics to harden
federation (CALM) and the gate. Closes the "determinism is real at scale" evidence gap.

## 3. Structural-code / universal-AST tooling (lift & conform breadth)

**Gap:** lift/conform currently cover the arithmetic fragment; scaling to all languages needs
per-language parsers and structural rewrite.
**Obscure knowable:** **tree-sitter** grammars (already in `rce/tree-sitter/`), **ANTLR grammars-v4**
(hundreds of languages), **srcML** (XML AST for C/C++/Java), **Babelfish/UAST** (universal AST),
**Kythe / SCIP / LSIF / Glean** (code indexing graphs), **ast-grep / comby / Semgrep** (structural
search/rewrite). The mainstream uses these for lint/search, not as a lift substrate.
**Ingestion:** drive lift from tree-sitter/ANTLR grammars → canonical Form; use ast-grep/comby-style
structural rewrite for conform; index the corpus with SCIP/Kythe-style graphs for name-free lookup.
Closes the lift/conform breadth gap (the omni-language axis).

## 4. Library learning & equality saturation (novel intent→Form synthesis)

**Gap:** novel intent→Form synthesis is open; the deterministic ladder handles reuse, not invention.
**Obscure knowable:** **DreamCoder** (wake-sleep library learning — learns domain abstractions from a
corpus), **stitch** (corpus-guided top-down library synthesis), **babble** (e-graphs + anti-unification
for abstraction learning), **egg/equality saturation**, **version-space algebras / FlashFill DSL**,
**CEGIS/sketching**. These are the mature synthesis frontier the LLM crowd overlooks.
**Ingestion:** add library learning (DreamCoder/stitch) over the crystallized corpus to grow the
abstraction vocabulary; use equality saturation (egg) for equivalence-aware synthesis; CEGIS against
the gate for novel residuals. Closes the novel-synthesis gap and feeds RCE-JEPA's inverse.

## Priority

1 (cost calibration) and 3 (lift breadth) are the highest-leverage, most-knowable, and directly
strengthen the built constituents. 2 hardens the determinism claim; 4 is the research frontier for
the learned inverse. All are public and ingestable; none requires new science, only wiring.

## Sources
- https://uops.info/ ; https://www.agner.org/optimize/instruction_tables.pdf ; https://arxiv.org/html/1810.04610v3
- https://rr-project.org/ ; https://www.qemu.org/docs/master/system/replay.html ; https://ipads.sjtu.edu.cn/_media/publications/reemu-ppopp13-fix.pdf ; https://cacm.acm.org/practice/deterministic-record-and-replay/
- https://ast-grep.github.io/ ; https://github.com/bblfsh/documentation/blob/master/alternatives.md ; https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html ; https://docs.semgrep.dev/contributing/adding-a-language
- https://www.cs.cornell.edu/~ellisk/documents/dreamcoder_with_supplement.pdf ; https://mlb2251.github.io/stitch_jul11.pdf ; https://arxiv.org/pdf/2212.04596 ; https://iamleo.space/2021-02-05-python-sketchs/