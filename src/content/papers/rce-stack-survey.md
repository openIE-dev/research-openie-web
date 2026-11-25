---
title: "The stack survey — compilers, assemblers, runtimes, OSes; and the curse of flags"
deck: "25 Nov 2026. 'Survey and ingest all known compilers, compiler languages, compiler"
id: rce-stack-survey
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The stack survey — compilers, assemblers, runtimes, OSes; and the curse of flags

*25 Nov 2026. "Survey and ingest all known compilers, compiler languages, compiler
ecosystems, all assemblers, all runtimes, all OSes. A true visual of the stack helps. The
biggest problem developers have is knowledge of the flags — the bolt-on / carve-out
optimizations that enable peak hardware performance. The curse of ignorance: letting
ignorance control whether an application runs at its peak is bad." And the resolution:
"RCE enables living software / living optimization because to know what hardware has is a
lookup / search query." Grounded in the Wikipedia List of compilers (ingested), global
searches (Eastern included), and a live capability query on this machine.*

## 1. The ingested landscape (global, not Western-first)

**Compiler infrastructures / IRs** — the shared backbones every surface lowers through:
LLVM, GCC (GIMPLE/RTL), MLIR (multi-level dialects), Open64 (HP/SGI/Intel/Nvidia/**Tsinghua**),
EDG front end, TenDRA/ANDF, Amsterdam Compiler Kit, lcc. ML compilers: XLA/StableHLO, TVM,
Glow, TorchInductor, Triton, IREE, MLX.

**Compilers by family** (representative): C/C++ — GCC, Clang, MSVC, Intel icx, AMD AOCC,
IBM XL, Oracle Studio, Arm armclang, CompCert (verified), tcc; JVM — javac, ECJ; .NET —
Roslyn, Mono, RyuJIT, IL2CPP; JS — V8/SpiderMonkey/JSC (JIT); functional — GHC, SBCL,
Chez, Racket, OCaml ocamlopt, F#; systems — rustc, gc/gccgo, swiftc, GNAT, Free Pascal;
scientific — gfortran, ifx, Flang, LFortran, NAG; legacy — GnuCOBOL, IBM COBOL, PL/I, ALGOL.

**Assemblers** — NASM, FASM (Poland), GNU as (multi-arch), MASM, TASM, LLVM-MC, JWasm, HLA.

**Runtimes / VMs** — JVM (HotSpot/GraalVM), CLR (RyuJIT/CoreRT), V8/SpiderMonkey/JSC, BEAM
(Erlang/Elixir), CPython/PyPy, Ruby YARV/TruffleRuby, Zend/HHVM, Wasm (wasmtime/V8), Forth.

**OSes** — Linux, Darwin/macOS/iOS, Windows/NT, BSDs, Android, RTOS (FreeRTOS, Zephyr),
**TRON/ITRON (Japan, Sakamura)**, seL4 (verified), QNX, VxWorks, embedded bare-metal;
non-Western silicon/OS: **LoongArch, Sunway/ShenWei (China)**, HarmonyOS, EulerOS.

**Eastern compilers/ecosystems** (credited): Huawei **BiSheng** (2020, LLVM-based,
host-device for Atlas) + **ArkCompiler** + **Cangjie**; **LoongArch** toolchain; Sunway;
Japan **8cc** (Rui Ueyama), **GnuCOBOL** (Keisuke Nishida), **TRON**; China **mocl**,
Open64/Tsinghua; Eastern-bloc **Odra ALGOL 68** (1976). The Wikipedia list is flagged
incomplete and Western-centric; MLIR/BEAM/GraalVM/ML compilers and most East-Asian projects
are under-listed — this survey adds them.

**The convergent observation:** despite the enormous surface (hundreds of compilers, dozens
of IRs/VMs/OSes), they all lower to the same small, costed primitive floor (the
human→transistor stack, `rce-human-to-transistor.md`). The diversity is surface; the floor
is shared. That is why one graph IR can serve them all.

## 2. The curse of ignorance: flags gate peak performance

Today, whether an app runs at the hardware's peak depends on the developer *knowing* the
bolt-on carve-outs: `-O3`, `-march=native`, `-mfma`, `-ffast-math`, `-flto`, PGO,
`-ftree-vectorize`, target-specific intrinsics. This is accidental knowledge controlling
performance — the impedance tax at the optimization layer. The tuning literature is literally
"compile with `-O3 -ffast-math -march=native`" (Performance Analysis & Tuning on Modern CPUs).

**Concrete proof (live):** the same meaning `(a*b)+c`:
- ARM64 (this M5 Max), `-O2`, *no flags*: `fmadd` — the fabric's FMA is used automatically.
- x86-64 baseline, `-O2`, *no flags*: `mulss`+`addss` — FMA **left on the table**.
- x86-64 *only if you know* `-mfma`/`-march=native`: `vfmadd213ss` — peak recovered.

So on x86, peak performance is gated by flag knowledge; on ARM it isn't. The difference is
not the math — it's whether the toolchain *knows* the target has FMA. Ignorance of the flag
= wasted hardware. That is the curse.

## 3. The resolution: capability is a lookup → living optimization

"What the hardware has" is **discoverable by a query**, not tribal knowledge:
- x86: `CPUID` feature bits; ARM: ID registers / `sysctl hw.optional.arm.FEAT_*`;
  OS: `/proc/cpuinfo`, `sysctl`, `GetNativeSystemInfo`.
- Live on this M5 Max: `FEAT_FHM:1`, `FEAT_DotProd:1`, `FEAT_FP16:1`, `neon_fp16:1`.

Because capability is a lookup (the cheapest gear, G0/search), RCE can make optimization
**living**: the graph + the target's capability table + the per-primitive cost table
(`E ≈ a·flops + b·bytes + c`) ⇒ `place(op) = argmin_backend Ê(op, backend)`, re-evaluated as
hardware changes. No human flags; the carve-outs are *derived* from "what does this fabric
have." The software re-places itself on new silicon — living software / living optimization.
This is flowg's placement pass generalized: the flags become a deterministic function of
(graph, capability, cost), removing the curse of ignorance.

## 4. The true visual of the stack

See the dossier's stack diagram: human intent → spec → language → **graph IR** →
{compiler / assembler / runtime / OS} → machine code → micro-ops → execution units →
transistor, with a **capability-lookup loop** feeding the placement pass (living
optimization). The compilers/VMs/OSes are interchangeable projections over the shared floor;
the capability query closes the loop so peak performance is automatic, not known.

## 5. The AI-compiler / accelerator frontier (converging peers)

- **Mojo / MAX (Modular, Lattner)** — MLIR-based; a Pythonic systems language with
  *progressive disclosure* of hardware control; MAX serves across NVIDIA/AMD/Apple with **no
  CUDA version to match**; bit-exact deterministic kernels; Mojo open-sourced (2026). It
  removes the separate-CUDA-kernel curse by letting one language reach the metal. **Delta vs
  RCE:** Mojo unifies the *language* over hardware; RCE unifies the *meaning* (the graph) over
  **all** languages and adds the gate + the joule-priced economy. Mojo is still a surface;
  RCE is the IR beneath every surface.
- **Tenstorrent** — TT-Forge / TT-MLIR (MLIR) + TT-Metalium (low-level SDK) over **RISC-V
  Tensix dataflow** cores; open hardware + compiler. The dataflow lineage (past-past) realized
  in silicon: graph → spatial fabric. Convergent with the graph-substrate thesis.
- **Nvidia** — CUDA/NVCC → PTX → SASS, TensorRT, cuDNN/CUTLASS, tensor cores. The incumbent
  whose tensor-core primitive set is part of the bounded floor; but the separate kernel
  language + manual carve-outs are exactly the curse of ignorance RCE removes.
- **Academic** — MLIR (Lattner), XLA/StableHLO, TVM/Ansor/AutoTVM (learned cost models +
  search), Halide (algorithm/schedule separation), Triton, **egg / equality saturation**
  (e-graphs), CompCert/Alive2 (verification), ProGraML / code-naturalness (shared
  language-agnostic structure). These bridge past-past → past-present and seed the
  future-present (learned placement, e-graph synthesis, verified lowering).

## 6. Past-past, past-present, future-present — all covered

- **Past-past (the foundations):** von Neumann / text-as-surface; dataflow (Dennis/Arvind,
  LabVIEW); interaction nets (Lafont, HVM/Bend); content-addressed code (Unison, Git, Nix);
  projectional editing (Cornell, Simonyi, MPS); refinement (Hoare/Wirth/Abrial); UNCOL (1958);
  Böhm–Jacopini; Horowitz's energy table. The pieces the field spent fifty years circling.
- **Past-present (the incumbents):** LLVM/GCC + the compiler/VM/OS survey above; CUDA/Nvidia;
  Mojo/Max; Tenstorrent; MLIR/XLA/TVM; the **flag-gated** optimization regime; rent-per-call
  LLM coding. Each peer ships one axis well; none unifies them under a law.
- **Future-present (the inversion — RCE's design target):** owned cheap competence at the
  energy floor; the graph IR as global meaning; **capability = lookup → living optimization**;
  the replay gate + joule-priced competence economy; `I = H_task − H_corpus → 0`; AI as the
  gated residual (JEPA). Built for 2028/29 now, each inversion paired with a falsifier
  (joules per competent act declining with lived experience).

**The convergence:** past-past supplied the pieces; past-present ships them partially;
future-present (RCE) unifies them under the graph + the gate + the law + living optimization.
Covering all three regimes is what makes the survey complete and the design future-present
rather than a re-description of today.

## Sources

- https://en.wikipedia.org/wiki/List_of_compilers
- https://baike.baidu.com/en/item/Bisheng%20Compiler/95321
- https://support.huaweicloud.com/intl/en-us/usermanual-hce/hce_02_0051.html
- https://www.hiascend.com/eng/cann/bisheng
- https://simplifycpp.org/articles/a0641/competitors-to-llvm-a-comprehensive-overview-of-compiler-design-tools/
- https://www.scribd.com/document/812432827/PerformanceAnalysisAndTuningOnModernCPUs-SecondEdition
- live: `clang -S -O2 [--target=x86_64 -mfma] /tmp/stack.c`; `sysctl hw.optional` (M5 Max)
- https://max.modular.com/
- https://github.com/modular/modular/blob/main/Mojo/docs/compiler/DesignOverview.md
- https://aiconference.com/plaud/keynote-summary-unlocking-the-next-generation-of-ai-software-chris-lattner/
- https://tenstorrent.com/en/software/tt-forge
- https://tenstorrent.com/en/software/tt-metalium
- https://docs.tenstorrent.com/getting-started/tt-software-stack.html