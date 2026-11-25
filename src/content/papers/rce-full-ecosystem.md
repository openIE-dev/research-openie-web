---
title: "The full RCE ecosystem — constituents, the adaptable kernel, and the path to 100%"
deck: "25 Nov 2026. Consolidates the complete constituent set and the latest insights: the kernel is"
id: rce-full-ecosystem
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The full RCE ecosystem — constituents, the adaptable kernel, and the path to 100%

*25 Nov 2026. Consolidates the complete constituent set and the latest insights: the kernel is
**adaptable** (hold nothing fixed but the physical floor and the gate); **RCE-BENCH** is the true,
non-moving universal standard; the **RCE Compiler** obviates all others; **RCE-Conform/Convert**
is the legacy-upkeep wedge. Built seeds: `bench.rs`, `compiler.rs`, `conform.rs`, `placement.rs`
(174/174 tests; live /coverage sweep 1164/1280 = 90.9%). Extends rce-100-percent-deployable-plan.md.*

## 0. The adaptable kernel (correction to flowg's closed-22 bet)

flowg pinned a closed 22-primitive kernel as an *ergonomic-completeness bet*. RCE need not hold
any count fixed: **the hardware floor is bounded (physical), but the language's opkind/pattern
vocabulary is adaptable** — the Form allows expansion to whatever the actual count of operations,
opkinds and patterns is. We hold nothing fixed except (a) the physical primitive floor and
(b) the gate. RCE already embodies this: the defunctionalized `Op`/kind registry and the 1280-op
basis are open, not a closed 22. Completeness = cover the *actual* operation/pattern set,
expanding as the corpus and the task space demand.

## 1. The constituents (complete set)

| Constituent | Role | Built seed | 100% denominator |
|---|---|---|---|
| RCE | global IR / Form | spec/checker, Lean | full adaptable kernel + conformance 2236/2236 |
| RCE Stdlib | any program, anywhere | stdlib/lib | P0–P3 survey, portable |
| RCE-SPEC | intent→form ("coding") | spec_bridge.rs | task-distribution coverage |
| RCE-Engine | makes + runs the form | engine/runtime | executor 1280/1280 + living placement |
| RCE-VC | version control | rce-vc | VC1–5 + Git projection |
| RCE-JEPA | AI methodology (<0.1% energy) | jepa.rs | trained proposer + measured target |
| RCE Compiler | own compiler, obviates others | compiler.rs | native lowering to floor, all arches |
| RCE-BENCH | universal non-moving standard | bench.rs | the fixed gate + joules + I |
| RCE-Conform/Convert | legacy upkeep → modernity | conform.rs | lift→conform→emit, verified |
| RCE-Agent / Cleanroom | AI/human out of the loop; intent→structure airlock | cleanroom.rs | det_frac→99.9%, joules/act decay |
| World Model Coding | exact-physics planner + learned inverse (JEPA) | worldmodel.rs, jepa.rs | plan verified; trained proposer open |
| Obscure frontiers (4) | calibrated cost / record-replay / structural rewrite / library learning | costdata, replay, structural, library | all built + falsified |
| Open edges (4) seeds | full-language lift / full synthesis / native JIT / wall-metered fleet energy | lift_broad, fullsynth, jit, fleet | built + falsified; scale frontier open |
| Planetary unsiloing | one Form → every language origin + fabric; user benefit at center | unsilo.rs | 47 surfaces, 22 fabrics |

## 2. RCE-BENCH — the true standard (not goalpost-moving)

Survey (global): code-gen — HumanEval/MBPP (saturated >95% by 2023), EvalPlus (hardened),
SWE-bench (repo-level), LiveCodeBench (contamination-free, fresh LeetCode/AtCoder/CodeForces),
BigCodeBench, CRUXEval, APPS, CodeContests; logic/abstract-to-code — ARC-AGI-1→2→3, miniF2F
(proof), GPQA/MMLU/AIME/HLE, program synthesis. The pathology: the metric is **accuracy on a
shifting test set** — it saturates, contaminates, and the goalpost moves (harder set / new version).

RCE-BENCH fixes the **method**, not the target:
- a task is a content-addressed **spec** (intent + acceptance behaviour);
- correctness is the **gate** (replay reproduces the spec; spectests measure completeness);
- ranking is **joules to correct completion** + **information residual I** (reused vs synthesized);
- every language lowers to the same bounded floor ⇒ the same spec filters every language;
- the suite is published/replayable; new tasks add content keys without invalidating old ones.
The standard cannot move goalposts because it is the gate + the joule, not a saturating score.
`bench.rs`: `filter` (gate + price + reuse), `suite`, `summary` (pass rate, total joules).

## 3. The RCE Compiler — obviates all others

Because the destination is the bounded costed floor, the Form lowers **directly** to machine
primitives (ARM64/x86) with no LLVM/GCC/clang in the loop; placement derives the fused primitive
iff the capability lookup says the fabric has it (`madd` on ARM64+FMA, `imul+add` otherwise).
`compiler.rs` is the seed (arithmetic fragment, two arches); breadth (full kernel, more arches,
register allocation) is open. The compiler + RCE-BENCH together replace the incumbent stack:
own lowering + a fixed physical standard.

## 4. RCE-Conform/Convert — the upkeep wedge

The largest practical AI-coding demand is maintaining/converting legacy code. RCE does it
deterministically: **lift** old source → **conform/repair** to the modern spec → **re-emit** to any
modern language; the gate verifies behaviour preservation. `conform.rs`: `convert(old, lang,
accept)` → verified Conversion with a language-independent key. A port is checked, not hoped.

## 5. Path to 100% + deployable (threshold-ordered)

T0 trust+measure (done) → T1 egg Form+gate → T2 executor/emission/stdlib → T3 living placement +
VC + **Compiler** → T4 SPEC/JEPA + **Conform** → T5 **BENCH** as the public admission standard +
dev-env/deploy → T6 100% evidence (reuse curve, joules/act decline, conformance, <0.1% energy).
Deployable = install/Docker + tree-sitter/LSP/MCP/IDE + wasm playground + intent→form UI with
gate+receipt + living optimization surfaced + AAIF/MCP interop + docs + hosted federated catalog.

## Sources
- benchmark survey: evidentlyai.com/blog/llm-coding-benchmarks; codesota.com/lineage/coding;
  LiveCodeBench (ICLR 2025); arcprize.org; arxiv 2503.05860.
- live: competence-catalog {bench,compiler,conform,placement,fabric}.rs, 174/174 tests;
  catalog-server /coverage (1164/1280=90.9%), /bench, /conform, /fabrics (22), /languages (47).