---
title: "The picture: from human to transistor — the bounded floor that makes coding a law"
deck: "25 Nov 2026. A journey walked with evidence, not abstraction. The lesson from flowg:"
id: rce-human-to-transistor
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The picture: from human to transistor — the bounded floor that makes coding a law

*25 Nov 2026. A journey walked with evidence, not abstraction. The lesson from flowg:
the compute fabric performs only a limited number of actual operations; there is a stack
from the human to the transistor; understanding that stack across all known and to-be-made
hardware is understanding the laws of coding and the bounded nature of languages,
compilation, assembly and execution. This doc records the trace and the picture, and what
completeness requires in light of it.*

## The trace (one computation, end to end, on real hardware)

Intent (human): *"multiply a and b, then add c."*

| Level | Artifact | What it shows |
|---|---|---|
| intent | "a*b + c" | high-entropy meaning |
| Form (RCE IR) | `(a * b) + c` | the canonical graph/term |
| projection (live LUT) | C: `((a * b) + c)` | `emit : Graph × Language → Text`, deterministic |
| ARM64 (this Mac), -O2 | `fmadd s0, s0, s1, s2` ; `ret` | **one** fused multiply-add primitive |
| x86-64 baseline, -O2 | `mulss` ; `addss` ; `retq` | two primitives (no FMA assumed) |
| x86-64 `-mfma`, -O2 | `vfmadd213ss` ; `retq` | **one** primitive — converges to ARM64 |
| micro-ops / units | FPU/ALU fuse or mul+add | a handful of execution units |
| transistor | Horowitz: `E ≈ a·flops + b·bytes + c`, `b ≫ a` | each primitive has a physical joule cost |

The same meaning lowers to the fabric's **closed, costed primitive set**. Where the fabric
offers FMA, the whole computation is one primitive; where it doesn't, two. The compiler /
placement pass picks the cheapest available primitive. Nothing below the Form is
language-specific — it is the universal machine floor.

## The picture

1. **The fabric's vocabulary is finite and convergent.** Across x86, ARM, RISC-V, GPU
   (SIMT + tensor), AMX/NPU/TPU, LoongArch/Sunway, and spatial/dataflow fabrics, the
   *executed* core is small: int/float add/sub/mul/div/fma, compare, bitwise, shift,
   load/store/move, branch/call/ret, convert, plus matmul/fma on accelerators. The ISA
   surface varies; the execution vocabulary converges.
2. **The stack is a chain of projections into that floor.** intent→spec→language→IR→asm→
   machine→micro-ops→units→transistor. Each step discards surface; the bottom is bounded.
   Text hides the graph, so a compiler re-derives it every build; storing the graph (flowg /
   RCE) makes that a one-time reusable fact.
3. **Boundedness is why the law holds.** Few destination shapes ⇒ one canonical Form carries
   all code. Closed, costed primitives ⇒ the joule ranking is physical and the energy floor
   real. Mappings into a finite costed set ⇒ compilation/execution are determinizable and
   optimizable (formula, not guess). A shared floor ⇒ `H_corpus` is portable; competence runs
   anywhere at its floor.
4. **The "to-be-made" clause.** Any future fabric still exposes a closed, costed primitive
   vocabulary; the stack and the argument transfer. What changes is the primitive set and its
   cost table, not the law. The graph IR is the durable substrate that lowers to whatever
   closed set the fabric provides.

## What completeness requires in light of the picture

To be complete (>90% per constituent, covering global programming), the substrate must span
the bounded floor, not just a surface fragment:

- **RCE / Form & executor** — the canonical IR and its executor must cover the primitive core
  (arith, logic, movement, control, and the tensor primitives) so any program lowers to it.
- **RCE-Compile / emission & lift** — projections must target the primitive set of each
  platform (CPU/GPU/NPU), and lift must recover the graph from any surface; the LUT is the
  mechanism, the primitive core is the shared denominator.
- **RCE-VC / energy** — the cost model must be per-primitive, per-silicon (Horowitz-form,
  measured-calibrated), so placement = argmin joules and receipts are physical.
- **RCE Stdlib** — the major components built from the primitive core, portable across fabrics.
- **RCE-JEPA** — the AI residual proposes graphs over the same closed core; the gate replays
   them at the floor.

The picture turns "completeness" from a vague breadth goal into a concrete one: **cover the
closed, costed primitive floor across platforms, and every layer above it is a projection.**

## Sources

- live trace: `clang -S -O2` (ARM64) and `--target=x86_64 [-mfma]` on `/tmp/stack.c`; RCE `/emit`.
- flowg-lang.dev /math (Horowitz ISSCC 2014; Böhm–Jacopini; linear types); local flow-g docs.
- law-of-coding-information-theory.md §9; rce-graph-nature.md; rce paper (machine floor).