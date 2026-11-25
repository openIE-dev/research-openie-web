---
title: "The four open edges — built seeds, and the scaling frontier that remains"
deck: "25 Nov 2026. 'full intent→Form synthesis, full-language lift, production JIT, wall-metered energy."
id: rce-open-edges
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The four open edges — built seeds, and the scaling frontier that remains

*25 Nov 2026. "full intent→Form synthesis, full-language lift, production JIT, wall-metered energy.
lets do it. we have a number of computers in our fleet that all have the ability to track bare metal
activity." All four now have built, falsified seeds (173/173 tests). The *full* versions are a
scaling frontier, documented honestly, not faked.*

## 1. Full-language lift — `lift_broad.rs`

Beyond the arithmetic core: comparisons (`== != < > <= >=`), logic (`&& || and or not`),
conditionals (`if c then t else e`), floats, booleans, and prefix (Lisp) applicative forms, lifted
into the rich Form IR (`If/Not/Bin/Float/Bool`). Falsified: each construct lifts to the right node.
**Frontier:** per-language tree-sitter grammars (in `rce/tree-sitter/`) scale this to every surface;
the grammar-table seed is built, the full grammar coverage is data-entry.

## 2. Full intent→Form synthesis — `fullsynth.rs`

Orchestrates library learning (DreamCoder/stitch) + exact-physics edit search (worldmodel) + the gate
(CEGIS: a goal mismatch is the counterexample driving the next edit). Falsified: reaches a 1-edit
goal with a learned library. **Frontier:** arbitrary natural-language intent→Form is the learned
(JEPA/EBM) inverse; the deterministic synthesis core is built.

## 3. Production JIT — `jit.rs`

Baseline JIT: emit Form→C (LUT), compile once at -O2 to a native executable, cache by name-free
content key, run native. Recurring competence compiles once, executes native at the floor.
Falsified: `2*3+4`→`10`, compiles=1, second run is a cache hit. **Frontier:** a tracing/optimizing
JIT (inline caches, tiering, deopt) is the open production engineering; the compile-cache/AOT-JIT
hybrid is built.

## 4. Wall-metered energy — `fleet.rs`

The fleet's bare-metal meters (macOS IOReport package rails, Linux RAPL) turn `Modelled` into
`Measured`: each node measures the energy delta of an execution window, tags the source, and the
fleet aggregates to total/mean µJ-per-act. Falsified on this node: 500k acts, positive bare-metal
delta, source tagged. **Frontier:** collecting readings across the whole fleet (the protocol is
built; the remote nodes' readings are aggregated when supplied). A node that cannot measure errors —
never a fabricated 0.

## What remains (the scaling frontier, not faked)

- Full grammar coverage per language (lift) and full construct coverage (emit).
- Trained FormJEPA/FormEBM at scale; arbitrary intent→Form synthesis.
- A tracing/optimizing JIT.
- Fleet-wide wall-metered aggregation (remote nodes) and a production energy receipt pipeline.

These are engineering/data scale, not new science; the mechanisms are built and falsified.

## Sources / grounding
- live: competence-catalog {lift_broad,fullsynth,jit,fleet}.rs, 173/173 tests; energy.rs (IOReport/RAPL).
- rce-obscure-frontiers.md (the four ingestions these build on).