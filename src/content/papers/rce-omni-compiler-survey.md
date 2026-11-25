---
title: "Who is making the omni compiler — a global survey, and RCE's delta"
deck: "25 Nov 2026. 'Do a global search to see who has made / is making the omni compiler.' The omni"
id: rce-omni-compiler-survey
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Who is making the omni compiler — a global survey, and RCE's delta

*25 Nov 2026. "Do a global search to see who has made / is making the omni compiler." The omni
compiler has two axes: **omni-language** (any source language) and **omni-hardware** (any compute
fabric). The survey finds everyone building one axis; RCE is heterogeneous by design and spans
both, plus the gate and the joule economy. Built: `fabric.rs` (22 fabrics, placement argmin),
`compiler.rs` (native CPU lowering), 158/158 tests.*

## The two axes

- **Omni-language:** one representation every source language lifts into / projects from.
- **Omni-hardware:** one representation that lowers to every compute fabric at its floor.

A true omni compiler needs both, plus a correctness gate and a cost model. Most efforts ship one.

## Who has made / is making it (global)

| Effort | Origin | Axis | What it actually is | Limit |
|---|---|---|---|---|
| **Omni Compiler** (omni-compiler.org) | RIKEN R-CCS + Univ. Tsukuba, **Japan** | partial both | C/Fortran source-to-source, XcodeML (XML) IR, XcalableMP/OpenACC → parallel/accelerator code | only C/Fortran; directive-based, not universal |
| **MLIR** | Google/LLVM | omni-hardware | multi-level dialect infrastructure; lowers to CPU/GPU/TPU | infrastructure, not omni-source |
| **LLVM / GCC** | global | omni-hardware-ish | many backends, several frontends | not universal source; no energy/gate |
| **UNCOL (1958) / ANDF / TenDRA** | US/UK | omni-IR (historical) | the original universal-IR attempts | stalled; never verified/economic |
| **GraalVM / Truffle** | Oracle | omni-language | polyglot guest languages on one VM, self-optimizing JIT | JIT to host, not omni-hardware native lowering |
| **Mojo / MAX** | Modular (Lattner) | omni-hardware | "One Systems Language for All Hardware" (SPLASH'26), MLIR | one language, not omni-source |
| **WebAssembly** | W3C | omni-hardware target | universal portable target | a target, not a source unifier |
| **flowg** | OpenIE (user) | omni-language | graph-native, every language a projection | precursor; no gate/economy |
| **RCE** | OpenIE | **both** | Form lifts/emits all languages AND lowers to all fabrics; gate + joule economy + living placement | seed today; breadth open |

**Non-Western credit:** the literal "Omni Compiler" is Japanese (RIKEN/Tsukuba); Huawei Ascend
(DaVinci) and Cambricon are tensor fabrics in RCE's table; MoonBit/CertiMoon (IDEA Shenzhen) leads
verified compilation. No single effort combines omni-language + omni-hardware + gate + economy.

## RCE's delta: heterogeneous by design

`fabric.rs` carries a global fabric table — CPU (x86/ARM64/RISC-V), GPU (NVIDIA PTX, AMD CDNA,
Apple Metal, WebGPU), tensor (Apple ANE, Intel AMX, Google TPU, Ascend DaVinci, Cambricon),
dataflow/spatial (Tenstorrent Tensix, Groq LPU, Cerebras WSE, Graphcore IPU, CGRA), WASM, and ML IRs
(MLIR/StableHLO/Triton/ONNX). Each is a capability+cost+template row; `lower_muladd` is a
deterministic lookup (fused iff capable); `place` = argmin joules across the whole set. One Form,
many silicons, cheapest correct wins — and re-placeable as hardware changes (living).

The omni-compiler claim is therefore not "a better LLVM" but: **the universal meaning (omni-language)
+ the universal floor (omni-hardware) + the gate + the joule economy**, which no surveyed effort
combines. Honest scope: the lowering is a seed (arithmetic fragment, template-based); full-kernel,
full-fabric codegen and register allocation are the open work.

## Sources
- https://omni-compiler.org/
- https://mlir.llvm.org/
- https://en.wikipedia.org/wiki/MLIR_(software)
- https://www.graalvm.org/latest/graalvm-as-a-platform/language-implementation-framework/
- https://arxiv.org/pdf/2112.14716
- https://www.youtube.com/watch?v=9-97SB5XJh4 (Mojo: Towards One Systems Language for All Hardware, SPLASH'26)
- https://cloud.google.com/tpu
- https://www.siliconcodesign.com/p/a-comprehensive-overview-of-the-ai
- https://aimultiple.com/ai-chip-makers