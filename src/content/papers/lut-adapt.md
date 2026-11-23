---
title: "Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and Frontier Sparse-MoE NVMe Streaming"
deck: "A Mixture of Limits cascade with 27 six-kernel-verified Lean 4.36.0 theorems (con-leche and con-ron --verified, zero sorry, Common Vulnerabilities and Exposures (CVE)-2026-72844-hardened) that tries zero-floating-point-operation (FLOP) paged 6-input look-up table (LUT6) circuits first (0.154 milliseconds in single-binary Rust mol-agent-rs), escalates across 4-bit Non-Volatile Memory Express (NVMe) hybrid and sparse Mixture-of-Experts (MoE) late-2026 models up to 120B parameters (12B active) only on misses, gates commits via deterministic verifiers across 4 upstream Verified software-engineering repositories, and compiles certified wakes downward into clock-enable-gated Beneš-routed 36-Kbit Block RAM (RAMB36E2) and canonical skill pages. Wall-clock times, unbuffered Darwin F_NOCACHE (unbuffered file read) byte counts, active random-access memory (RAM down to 970.0 megabytes on 34.66B and 58.08 gigabytes resident Unified Memory at 22.17 tokens per second on 120B-A12B), dual-channel Apple M5 Max on-chip energy counters (reported_j), analytical energy estimates (est_j), and Yosys/Verilator xck26 register-transfer-level (RTL) simulations (4-stage 13-level 250-megahertz pipelined core with 4.10x clock-gated idle power reduction) are reported from openIE-dev/lut-adapt-ai at commit 86d0ab5; no isolated board rail power was measured (measured_j unset)."
id: lut-adapt
status: "Research study · draft"
author: "David Charlot, Open Interface Engineering"
figures: "/living/lut-adapt/"
pdf: "/pdfs/lut-adapt.pdf"
board_metered: false
---

# Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and Frontier Sparse-MoE NVMe Streaming

*{{revision}}. Reference implementation and artifacts: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) at [`86d0ab5299c03a537639762ea2f430d7da358f26`](https://github.com/openIE-dev/lut-adapt-ai/tree/86d0ab5299c03a537639762ea2f430d7da358f26). Data summary: [/data/#lut-adapt](/data/#lut-adapt). LaTeX PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

## 0. Overview

This study examines how a computing system can compile repeated neural-model work downward into fast Boolean table lookups and certified canonical skills without losing exact output parity or promoting unverified guesses into trusted rules. It reports software and unbuffered input/output measurements, register-transfer-level synthesis and cycle simulations, dual-channel operating-system / on-chip energy counter readings (`reported_j` on Apple M5 Max and Linux Running Average Power Limit counters), and labeled analytical energy estimates (`est_j`). No wall or rail joule monitor was attached in this repository (`measured_j` is unset; `board_metered` is false).

**In plain words**

1. Most inputs a deployed system sees repeat patterns it has already solved, so running a full floating-point neural network on every step wastes compute and memory bandwidth.
2. The reference places a reconfigurable 6-input truth-table (`LUT6`) lookup tier ahead of streaming state-space and foundation models, and compiles answers downward into lookup memory pages only after an explicit check certifies them.
3. When late-2026 hybrid and sparse mixture-of-experts language models up to `120B` parameters (`12B` active) run locally on Apple Silicon through custom fused Apple Metal, portable Rust `Burn 0.22.1 / CubeCL` shaders, and single-binary Rust `mol-agent-rs` (`0.154` milliseconds per skill lookup), router-sparse expert reads paired with that zero-FLOP `LUT6` drafter cut disk reads by up to `12.30×` on `Qwen/Qwen3.6-35B-A3B` (`970.0` megabytes active weight memory) and sustain `22.17` tokens per second on `nvidia/Nemotron-3-Super-120B-A12B` inside `58.08` gigabytes of Unified Memory; gating code and repository commits behind deterministic `unittest` and `pytest` checks reaches **`91.67%` verified pass rate (`93.75%` across Wave 2 and Wave 3)** on the `48`-task algorithmic bakeoff, **`90.62%` (`93.75%` on Wave 2 human paraphrases)** on official `BigCodeBench v0.1.3`, **`50.00%`** on single-repository `SymPy` git worktrees, **`20.83%` (`2.50×` standalone `24B` and `35B` models)** across `4` upstream `princeton-nlp` Verified repositories (`django`, `pytest`, `requests`, and `sympy`), and **`62.50%`** on the `120B` hard frontier suite with **`0.00%` broken commits admitted**.

## 1. Terms, acronyms, and measurement labels

<ul id="terms">
<li>MoL: Mixture of Limits, the cascade rule from Metered Commit Gates Part II [same house]</li>
<li>LA: claim and falsifier prefix (LA-1 to LA-23, LA-F1 to LA-F23) used in this study</li>
<li>LUT, LUT6, INIT: look-up table, 6-input Xilinx UltraScale+ Boolean primitive, and its 64-bit truth-table initialization mask</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, the 36-Kbit dual-port UltraScale+ Block RAM primitive (144 on xck26), and UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: configurable logic block, flip-flop, digital signal processing slice, and AMD Kria KV260 board (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, and Field-Programmable Logic conference</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3: Advanced eXtensible Interface, AXI4-Stream wrapper prefix, Zynq processing system, programmable logic, system-on-module, onboard power monitor IC, supply rail, Intel Running Average Power Limit, NVIDIA Management Library, macOS power management unit, Apple System Management Controller, level-2 subsystem energy counter (Apple IOReport GPU Energy), and level-3 per-process CPU energy counter (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, and context-free grammar</li>
<li>HC, SOINN, WNN, DWN: hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, and Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, and Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M and LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B), and HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: singular value decomposition, Iterative Quantization Procrustes hypercube rotation, sign-value-independent decomposition, quantization-aware training, post-training quantization, perplexity, and signal-to-noise ratio</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB: Non-Volatile Memory Express storage, Darwin F_NOCACHE unbuffered file flag, Portable Operating System Interface, random-access memory, dynamic RAM, static RAM, resident set size in physical Unified Memory, GPT-Generated Unified Format quantized model file, input/output, kilobyte, megabyte, gigabyte, and gibibyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM: floating-point operation(s), million FLOPs, multiply-accumulate operation(s), single-instruction multiple-data, automatic differentiation, finite difference, bits per byte, brain float 16, 16/32-bit IEEE floating point, 4-bit integer, unit in the last place, Apple Metal Shading Language, PyTorch Metal Performance Shaders, NVIDIA Compute Unified Device Architecture, AMD ROCm runtime, Standard Portable Intermediate Representation (Vulkan SPIR-V), Parallel Thread Execution, Heterogeneous-Compute Interface for Portability, and Low Level Virtual Machine compiler backend</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP: Reality Code Engine [same house], Wise Computer Automation [same house], verified completion, BigCodeBench v0.1.3 benchmark, software-engineering benchmark prefix, optimal string alignment, and dynamic programming</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: command-line interface, Hypertext Transfer Protocol and its GET/POST request methods, Server-Sent Events, application programming interface, Model Context Protocol, remote procedure call (JSON-RPC 2.0), integrated development environment, software development kit, Cross-Origin Resource Sharing, Uniform Resource Locator, object-relational mapper, Internationalized Domain Names in Applications, Conference on Automated Deduction, Lecture Notes in Computer Science, NVIDIA Corporation, academic computer-science/engineering venues, operating system, central/graphics processing unit, software, and thermal design power</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: virtual local-area network (IEEE 802.1Q), Transport Layer Security, deep packet inspection, abstract syntax tree, JavaScript Object Notation, comma-separated values, Secure Hash Algorithm, cyclic redundancy check, Asynchronous Transfer Mode (CRC-8/ATM), Request for Comments, Structured Query Language, DWARF signed little-endian base-128 encoding, content-addressable memory, exclusive-OR, exclusive-NOR, JSON Web Token, hash-based message authentication code, directed acyclic graph, Classless Inter-Domain Routing, least-recently-used cache, time-to-live expiration, write-ahead log, and extract-transform-load pipeline</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD: Joint Test Action Group debug port, Xilinx Software Command-Line Tool debugger, Debug Access Port, Universal Serial Bus, Future Technology Devices International and its FT2232C dual UART/FIFO bridge IC, universal asynchronous receiver-transmitter, first-in first-out buffer, integrated circuit, electronic design automation, out-of-context synthesis mode, Advanced Microcontroller Bus Architecture, AXI4-Lite/AXI4-Stream interconnect, input/output block, input/output buffers, synchronous-reset/set D flip-flops, 1-to-5-input UltraScale+ look-up tables, 7/8-input UltraScale+ multiplexers, 4/8-bit fast carry chains, UltraScale+ DSP slice, 288-Kbit UltraRAM, internal core supply rail (0.72 V on -2LV), AMD Zynq UltraScale+ DC and AC Switching Characteristics datasheet DS925, Value Change Dump waveform trace, simple dual-port Block RAM mode, synchronous clock enable, RAMB36E2 port-A read/clock-enable pin, Xilinx Power Estimator, subsystem register magic identifier ("CLAI"), and Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI: Common Vulnerabilities and Exposures, Common Weakness Enumeration, Lean Focused Research Organization, GNU Multiple Precision Arithmetic Library, Retrieval-Augmented Generation, weak head normal form, Zermelo-Fraenkel set theory with Choice, Calculus of Inductive Constructions, and foreign function interface</li>
</ul>

Four evidence classes stay separate across every table below:

| Evidence label | Meaning in this study |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Exact byte counts read or written via `os.pread` under Darwin `F_NOCACHE`, resident memory allocations, wall-clock seconds, whole-machine macOS `PMU` (`AppleSmartBattery.PowerTelemetryData`) cumulative energy deltas on Apple M5 Max, and exact bit/token agreement. `measured_j` is unset (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Unprivileged operating-system and on-chip telemetry counters: on Apple M5 Max (`joule_meter.py`), dual-channel `libIOReport.dylib` `"Energy Model"` `'GPU Energy'` (`L2` nanosecond-resolution `nJ`) plus `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` per-process CPU `nJ`); on `x86-64` Linux (in the `xck26` EDA synthesis audit below), `RAPL` `package-0` joules. Never merged with `measured_j` (`None`). |
| **`Simulated (RTL)`** | Structural netlist counts from Yosys `0.71+` (`synth_xilinx -family xcup` targeting Kria KV260 `xck26`) and cycle counts (`CPI = 1`) from Verilator `5.054`. Not Vivado timing closure and not board power (`board_metered = false`). |
| **`Estimated (est_j)`** | Analytical joules computed from operation counts, thermal-design-power time stand-ins (`joule_meter.py`), or Verilator VCD toggle-rate switching activity paired with AMD `DS925` `xck26-2LV` (`0.72 V`) logic and `RAMB36E2` capacitance bounds (§4.22, §4.25). Comparable only across arms inside the same formula; never silicon watts. |

### 1.1 Architectural background and contributions

In [Metered Commit Gates](/papers/gates/) `[same house]`, Part II defines **Mixture of Limits**: try gears in decreasing order of pass probability per joule $p_i / c_i$ (Simon and Kadane, 1975), stop as soon as the task completion predicate $C(z) = 1$ holds, and forbid strengthening `ModelGenerated` output into `Deterministic`. A static Lookup tier, however, covers only the entries written into it before deployment. Conversely, existing lookup-table neural networks — LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022), and Differentiable Weightless Neural Networks (Bacellar et al., 2024) — fix wire connectivity inside static FPGA routing, requiring vendor place-and-route whenever the input distribution shifts.

The `lut-adapt-ai` reference closes the loop between the top and bottom of the cascade via **online downward `LUT6` compilation**:

- **Rung 0 (Lookup — Paged Beneš + `LUT6`)**: Evaluates 64-bit truth-table masks routed through a non-blocking $512 \times 512$ **Beneš–Copy–Beneš** multicast switch and cached across $81 \times \texttt{RAMB36E2}$ dual-port block memories (`0` floating-point operations, single-cycle page switching in Verilator simulation).
- **Rung 1 (Stream — `Mamba-3` Complex MIMO State Space Duality)**: Handles misses that depend on sequence history using a constant-size $O(1)$ recurrent state (`48 KB` pinned memory in the `14.3M`-parameter reference), avoiding $O(L)$ key-value cache growth.
- **Rung 2 (Topology — `HC-SOINN`)**: Maintains online prototype topology over latent embeddings, isolating regime boundaries and tripping a circuit breaker (`Refuse` / escalate) when unlabeled distribution shift arrives.
- **Rung 3 (Model last — `JEPA-EBRM`, `AirMoL`, and Metal-Fused `Expert-AirMoL` 4-Bit NVMe Streaming)**: Invokes latent energy-based verification or streams pretrained late-2026 hybrid and sparse-MoE foundation models (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B`, and `Qwen/Qwen3.6-35B-A3B`, alongside `LiquidAI/LFM2.5-350M` and `Qwen/Qwen3.5-0.8B-Base`) through custom Apple Metal `MSL` compute shaders only when cheaper rungs abstain or require exact target verification.
- **Downward `SleepCrystallizer`**: Extracts recurring wake traces using Walsh–Hadamard spectral warm-starts, joint-mode minterm truth tables, canonical AST skills, and Waksman switch schedules, flipping shadow block-memory banks without halting inference or running FPGA place-and-route.

### 1.2 Contributions

1. **Amortized downward compilation condition**: Extends the Simon–Kadane $p_i/c_i$ ordering with an explicit compilation cost $E_{\text{compile}}$ over stationary horizon $\Delta T$.
2. **Non-blocking $512 \times 512$ Beneš–Copy–Beneš, `81`-`RAMB36E2` page cache, and `4`-stage `250 MHz`-pipelined `P4-AXIS` RTL subsystem**: Eliminates both the `102.0%` Kria KV260 logic overflow of flat crossbars (`119,478` LUTs) and the `926,619`-LUT explosion of flip-flop page multiplexers (`41,186` UltraScale+ CLB LUTs = `35.2%` of `xck26`, `81` `RAMB36E2` blocks = `56.2%`, `0` `DSP48` slices in `1`-cycle OOC), while a `4`-stage pipelined IOB-safe `AXI4-Stream` wrapper (`clai_benes_axi_stream_250mhz_top`) reduces single-cycle synchronous logic depth **`4.00×`** from `52` to **`13` levels**, fits **`170 <= 189` `xck26` `IOB`s** (`41,459` LUTs = `35.40%`), and passes **`256 / 256` zero-bubble `CPI = 1.00`** Verilator streaming parity.
3. **Universal $\le 64$-bit joint-mode minterm synthesis**: Shows joint-mode minterm lookup dominates marginal bit-plane DiffLogic rounding on correlated branches and packs $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ subword tokens into one `uint64` word (`16b × 4 = 64b` for `|V| = 65,536`; `17b × 3 = 51b` for `|V| = 128,000`; `18b × 3 = 54b` for `|V| = 248,320`).
4. **Oracle-free Split-Conformal + Online ACI crystallization gate**: Pairs a radially regularized latent `JEPA-EBRM` nonconformity score with Split Conformal calibration and Adaptive Conformal Inference (Gibbs and Candès, 2021), recording `0.00%` false crystallization risk and `1.0000` OOD AUROC on shifted traffic where softmax and MC-Dropout baselines record `17.62%–24.28%` false risk.
5. **Custom Apple Metal & Cross-Platform Rust `CubeCL` `INT4` Sparse-MoE / `GatedDeltaNet` shaders + `AirMoL` / `Expert-AirMoL` up to `34.66B`**: Combines Darwin `F_NOCACHE` `os.pread` 4-bit sharding, custom `MSL` (`43.45×` MoE, `20.66×` `GatedDeltaNet`) and portable Rust `Burn 0.22.1 / CubeCL` (`35.09×` Metal / `2.67×` `LLVM` `CPU` MoE, `69.20×` Metal / `14.87×` `LLVM` `CPU` `GatedDeltaNet`) compute shaders, Queue-Depth-`8` parallel `pread`, and `BenesLUT6` burst speculation across October 2026 `LiquidAI/LFM3-1.7B` (`2.74×` NVMe reduction in `3.79%` FP32 RAM), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` RAM, `3.493 J/tok` `reported_j`), and `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe reduction**, **`970.0 MB` RAM = `1.47%` of FP16**, **`6.773 J/tok` `reported_j`**, **`15.7 tok/s`** Unified-Memory `Q4`) at `100.0%` exact token parity.
6. **Zero-MAC `Sub1Bit-LUT6` vs. `LittleBit`, `91.67%` `Rung 3d` `<think>` ceiling, official `BigCodeBench v0.1.3` + upstream `SWE-bench Verified` via `MCP`, and OpenAI / `MCP` `mol-agent`**: Replaces the `1.98M` runtime binary MACs of `LittleBit-1 / LittleBit-2` (`0.576` bits per weight; Lee et al., 2025; Lee and Kim, 2026) with zero-MAC `6`-input `LUT6` partial-sum lookup (`< 4 × 10⁻⁶` error, `100.0%` parity under `MoL` target verification in `0` QAT epochs), lifts the `48`-task late-2026 coding bakeoff from `87.50%` to **`91.67%` (`44 / 48`; `93.75%` in Wave 2 and Wave 3)** with bounded open-weights `Rung 3d` `<think>`, reaches **`90.62%` (`29 / 32`, `93.75%` Wave 2)** on official `BigCodeBench v0.1.3` (vs. `78.12%` on standalone `35B`) and **`50.00%` (`8 / 16`)** on upstream `SWE-bench Verified` `sympy/sympy` git worktrees (vs. `25.00%` on `35B`) with **`0.00%` broken commits admitted**, and serves persistent `.mol/` skills over OpenAI `/v1/chat/completions` and `MCP` (`JSON-RPC 2.0`).
7. **Six-kernel paranoid Lean `4.36.0` formalization (`CVE-2026-72844`-hardened), `4`-repository `SWE-bench Verified` call-graph localization, measured `120B` Hybrid MoE apex, `CE`-gated `VCD` power, and single-binary Rust `mol-agent-rs` (`Claims LA-19` to `LA-23`)**: Checks all `27` theorems of Section 2 across **six independent proof checkers** (`con-leche --verified` [`58,683` decls], `con-ron --verified` [`58,683` decls], `lean4lean` [`58,685` decls], `nanoda`, `leanchecker --paranoid`, and Lean `4.36.0`; `0` `sorry`, `0` custom axioms, `0` `Lean.ofReduceBool`; Moura and Ullrich, 2021), expands zero-leakage `SWE-bench Verified` evaluation across **`4` upstream repositories (`django`, `pytest`, `requests`, `sympy`, `24` evals)** at **`20.83%` overall / `25.00%` Wave 2 (`2.50×` standalone `24B` and `35B`)** with `0.00%` broken patches, measures **`120B`-scale `nvidia/Nemotron-3-Super-120B-A12B`** (`58,075.4 MB` `RSS`, **`22.17 tok/s`**, **`62.50%` verified pass** vs. `43.75%` standalone `120B-A12B` and `31.25%` `Devstral-Small-2-24B`), reduces `P4-AXIS` `250 MHz` idle dynamic power **`4.10×`** (`63.99` to **`15.59 est_mW`**) via `ENARDEN` + valid-bubble `CE` gating, and delivers a zero-Python single-binary Rust `mol-agent-rs` (`0.1540 ms/req` `MCP`, **`17.21×` faster** than Python `mol-agent`, `35 / 35` `pytest` tests passing).

### 1.3 Same-house disclosure and provenance boundaries

Prior Open Interface Engineering studies — [Metered Commit Gates](/papers/gates/), [Task Satiation vs. Aggregate Rebound](/papers/satiation/), [The Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/), and [RCE Compile](/papers/rce-compile/) — are `[same house]` works cited for disclosure and architectural continuity, never as external confirmation. Two invariants bind throughout:

- **Provenance non-strengthening (`ModelGenerated ↛ Deterministic`)**: Tables compiled from a deterministic `RCE` specification check are `Check-safe` on verified holdout sets (guarded online by an `HC-SOINN` / `RCE` circuit breaker). Tables crystallized under the oracle-free `JEPA-EBRM` conformal gate carry a finite-sample statistical bound (`Conformal-bounded`, $1-\alpha$) and are never promoted to `Deterministic`.
- **Proposer vs. authority (`The drafter proposes; the target decides`)**: In speculative decoding, `PagedBenesLUT6` acts strictly as a zero-FLOP proposer; every emitted byte or token is verified against greedy target decoding (`100.0%` lossless parity).

---

## 2. Mathematical formulations and four results

### 2.1 Result 1: Cascade ordering with amortized downward compilation

Consider gears $i \in \{0, 1, 2, 3\}$ tried sequentially on an input $x$. Gear $i$ closes $C(z) = 1$ with probability $p_i$ at expected analytical energy $c_i > 0$. By Simon and Kadane (1975), expected spend

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

is minimized if and only if gears run in non-increasing order of $p_{\sigma(k)} / c_{\sigma(k)}$. Suppose a stationary regime $\mathcal{D}_r$ persists for $\Delta T$ remaining queries where the wake path closes with $p_{\text{wake}} = 1$ at cost $c_{\text{wake}}$. Expending one-time compilation energy $E_{\text{compile}}$ after $N_{\text{wake}}$ certified wakes produces a Rung 0 `LUT6` page with certified hit rate $p_0' \in (0, 1]$ and lookup cost $c_0 \ll c_{\text{wake}}$.

**Proposition 1 (Net energy condition for downward crystallization).** *Downward compilation reduces expected cumulative analytical spend over horizon $\Delta T$ if and only if*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*Proof.* Without crystallization, $\Delta T$ queries cost $\Delta T \cdot c_{\text{wake}}$. With crystallization at cost $E_{\text{compile}}$, Rung 0 precedes the wake path whenever $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$, and each query costs $c_0 + (1 - p_0') c_{\text{wake}}$, saving $p_0' c_{\text{wake}} - c_0 > 0$ per step. Summing over $\Delta T$ steps yields net savings $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$. Under rapid churn ($\Delta T \le \Delta T^*$), compilation loses energy, motivating `SleepCrystallizer`'s minimum wake buffer $N_{\text{wake}}$ and holdout gate $\tau_{\text{agree}} = 0.985$. $\blacksquare$

### 2.2 Result 2: Non-blocking $512 \times 512$ Beneš–Copy–Beneš multicast routing

A Rung 0 bank of $G = 80$ dynamic `LUT6` cells requires $M = 6G = 480$ input pins selected from an $N = 512$-bit bus with arbitrary fan-out. A bijective Beneš permutation network cannot replicate high-fan-out wires, whereas flat $512:1$ multiplexer crossbars overflow the KV260 (`119,478` CLB LUTs already at `384` ports).

**Theorem 2 (Contention-free multicast via Beneš–Copy–Beneš).** *For $N = 2^n$ ($n=9, N=512$) and $M \le N$ ($M=480$), any many-to-one multicast map $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ routes without contention through $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ in*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*of $N/2 = 256$ SRAM-configured $2 \times 2$ switches ($11,008$ configuration bits), computed in $O(N \log N)$ time with zero FPGA place-and-route.*

*Proof.* Let $U = \{s_1, \dots, s_r\}$ be the distinct active inputs with fan-outs $\sum_{j=1}^r m_j = M \le N$ and partial sums $S_0 = 0, S_j = \sum_{i=1}^j m_i$. Concentration $\mathcal{B}_1$ ($17$ stages) maps $\pi_1(s_j) = S_{j-1}$ via Waksman bipartite 2-coloring (Beneš, 1965; Waksman, 1968). Copy network $\mathcal{C}$ ($9$ butterfly stages) replicates each $S_{j-1}$ across disjoint monotonic interval $[S_{j-1}, S_j - 1]$ without link contention by Thompson's monotonic copy construction (Thompson, 1978; Lee, 1988). Output Beneš network $\mathcal{B}_2$ ($17$ stages) permutes $[S_{j-1}, S_j - 1]$ bijectively onto $\phi^{-1}(s_j)$. $\blacksquare$

### 2.3 Result 3: Joint-mode minterm synthesis vs. marginal coordinate argmax

Independent bit-plane DiffLogic layers predict multi-bit bursts $\mathbf{Y} = (Y_1, \dots, Y_B)$ via coordinatewise rounding $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$, which blends correlated branches into invalid **chimera** tokens.

**Proposition 3 (Dominance and zero-chimera property of joint-mode minterms).** *For discrete context $\psi(X) = c$ and $B \le 64$-bit burst space $\mathcal{Y}$, the joint-mode table $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ satisfies $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$, stays inside $\operatorname{supp}(\mathbf{Y} \mid c)$, and avoids marginal chimeras (where mass $0.40, 0.35, 0.25$ on $(1,1,0), (1,0,1), (0,1,1)$ rounds marginally to invalid $(1,1,1)$ with `0%` exact match vs. `40%` for $T^*$). For vocabulary $|V|$ with $b_V = \lceil \log_2 |V| \rceil$, one `uint64` word packs $K = \lfloor 64 / b_V \rfloor$ BPE tokens (`16b × 4 = 64b` on `LFM2.5-350M`; `18b × 3 = 54b` on `Qwen3.5-0.8B-Base`).* $\blacksquare$

### 2.4 Result 4: Oracle-free latent `JEPA-EBRM` Split-Conformal + Online ACI gate

To prevent hallucinated self-distillation when no deterministic `RCE` check is available, the reference scores candidate pairs using a radially regularized latent energy:

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

Held-out Split Conformal calibration sets $\hat{Q}_{1-\alpha}$, and online Adaptive Conformal Inference updates $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ (Gibbs and Candès, 2021), admitting $(x, \hat{y})$ into `SleepCrystallizer` only when $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`). By Vovk et al. (2005) and Gibbs and Candès (2021), exchangeable marginal coverage is at least $1-\alpha$, long-run shifted miscoverage converges to $\alpha$, and every off-manifold ray exceeding radius $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ yields $\mathcal{C}_t(x) = \emptyset$ (`Refuse` / abstain).

---

## 3. Reference architecture, polyglot suite, and KV260 RTL

Figure 1 shows the four-rung cascade and downward `SleepCrystallizer` loop in `src/clai/`.

![Figure 1. Downward compilation across a four-rung Mixture of Limits cascade.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figure 1. Downward compilation across a four-rung Mixture of Limits cascade. Design diagram, not a board power measurement. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Interactive explorer](/living/lut-adapt/#la-diag-01).*

Five systems implementations in `openIE-dev/lut-adapt-ai` cross-check the cascade: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`), and Julia `1.13.4` Enzyme (`sys/julia/`).

Figure 2 illustrates the Kria KV260 (`xck26`) RTL datapath in `hw/kv260/rtl/clai_benes_hotswap_core.sv`, mapping `512` resident `LUT6` pages (`5,120` `INIT` bits + `48`-bit context tag + valid bit) across `81` parallel `RAMB36E2` dual-port memories for single-cycle (`4.0 ns` at `250 MHz` nominal, `CPI = 1.0`) context switching.

![Figure 2. Beneš–Copy–Beneš multicast fabric and single-cycle BRAM LUT6 page cache.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figure 2. `512×512` Beneš–Copy–Beneš multicast fabric and `81 × RAMB36E2` single-cycle `LUT6` page cache targeting AMD Kria KV260 (`xck26`) in Yosys `0.71+` and Verilator `5.054` simulation (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Interactive explorer](/living/lut-adapt/#la-diag-02).*

Figure 3 shows `AirMoL` (`src/clai/frontier/air_mol_streamer.py` and `hf_air_mol_pretrained.py`), which streams 4-bit group-quantized shards via Darwin `F_NOCACHE` `os.pread`, verifies `[last_tok, d_1..d_K]` in a single sweep, and snapshots compact hybrid states (`Short-Conv/SSM` or `Gated DeltaNet` + sparse `6`-layer `GQA` KV crop) in RAM so partial draft rejections require **zero extra NVMe sweeps**.

![Figure 3. AirMoL 4-bit NVMe layer streaming with universal 64-bit token LUT6 speculation.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figure 3. `AirMoL` zero-extra-sweep 4-bit NVMe layer streaming with universal `≤64`-bit token `LUT6` speculation on `LiquidAI/LFM3-1.7B`, `LiquidAI/LFM2.5-350M`, and `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Interactive explorer](/living/lut-adapt/#la-run-01).*

Figure 4 shows `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) and `VerifiedCodeCascade` (`verified_code_cascade.py`). Standard disk-offloaded `AirLLM` sweeps all $E$ experts per MoE layer (`32` in `LiquidAI/LFM2.5-8B-A1B`, `256` in `Qwen/Qwen3.6-35B-A3B`) even though the router activates only $k \ll E$ experts per token (`4/32` and `8/256`). `Expert-AirMoL` partitions each MoE layer into a compact header shard and a fixed-stride `INT4` `.experts.pack4` NVMe file, issuing `F_NOCACHE` `os.pread` reads solely for the active expert union $\mathcal{U}_l$ across the $K+1$ burst positions. For novel synthesis tasks, `VerifiedCodeCascade` gates every commit across Rungs `0–3c` behind a `0.35s`-bounded AST, sandbox execution, and boundary-invariant check $C(z) \in \{0, 1\}$, compiling certified solutions into `BenesLUT6` and canonical AST skill pages.

![Figure 4. Expert-AirMoL router-sparse 4-bit NVMe streaming and Verifier-Gated VerifiedCodeCascade.](/figures/lut-adapt/moe-expert-cascade.svg)

*Figure 4. `Expert-AirMoL` router-sparse 4-bit expert-indexed NVMe streaming (`12.30×` I/O reduction on `Qwen/Qwen3.6-35B-A3B`) and `C(z)`-gated `VerifiedCodeCascade`. [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [Interactive explorer](/living/lut-adapt/#la-run-01).*

Figure 5 situates downward compilation across the nine-rung capability ratchet of computer intelligence (companion study: [The Communication Tool Avalanche](/papers/communication-avalanche/) `[same house]`). Rungs 1 through 5 — **(1) Search** (`RAG`), **(2) Generation**, **(3) Reasoning** (`<think>`), **(4) Communication** (`MCP` delegation), and **(5) Tool Use** — stall under ephemeral cold-start `MAC` inference where the stationary horizon remains at $\Delta T \approx 1 \le \Delta T^*$ and standalone `1`-shot models admit `56.25%–95.83%` broken patches (`Claims LA-20` and `LA-21`). Crossing Proposition 1's **Compilation Threshold** ($\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$ under $C(z) = 1$, `0.00%` broken commits admitted) unlocks **(6) Immersion** (persistent local state stretches $\Delta T \gg \Delta T^*$), **(7) Competence** ($p_0' \to 1$ at `62.4 pJ/cycle` `est_j` in `CE`-gated `xck26` `LUT6` RTL and `272 µJ/req` `reported_j` in Rust `mol-agent-rs` `MCP`), **(8) Ecology** (edge-native Rust agent populations), and **(9) Economy** (division of labor ordered by Simon–Kadane $p_i / c_i$ and tier-typed Joule receipts).

![Figure 5. The Nine-Rung Computer Intelligence Avalanche Ratchet and the Compilation Threshold.](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*Figure 5. The nine-rung capability ratchet and Proposition 1's Compilation Threshold ($\Delta T > \Delta T^*$), separating `reported_j` (Apple M5 Max) and `est_j` (`AMD DS925` `VCD`) across twelve orders of magnitude (`measured_j = None`, `board_metered = false`). [PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [Interactive explorer](/living/lut-adapt/#la-diag-03).*

---

## 4. Claims and results

### 4.1 Claim LA-1: Analytical `est_j/VC` reduction on synthetic tasks and real `.pcap` traffic

| Workload & Window | Rung 0 Share | Pass Rate | Analytical `est_j / VC` | Verilator Parity | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Synthetic ep. `1–512` (cold wake) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | — | SW + `est_j` |
| Synthetic ep. `3,073–3,584` (crystallized) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| `.pcap` pkts `1–512` (cold IPv4) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` pkts `1,537–2,048` (crystallized) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` pkts `2,049–2,560` (VLAN `0x8100` shift) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | Breaker + `est_j` |
| **`.pcap` pkts `2,561–3,072` (re-crystallized)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

### 4.2 Claim LA-2: Five-language polyglot parity and zero-allocation dataplanes

| Implementation | Target / Backend | Key Result | Evidence Class |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + `CubeCL` Metal GPU | `2,331.42 → 0.19 est_j/VC`, `95.31%` Rung 0 share, emits KV260 `.v` | Measured SW + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | `0` heap bytes in hot loop; `87 ns/pkt` (`11.49M pkts/s`) | Measured SW (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | Worker pool + `OnesCount64` | `0 B/op`, `0 allocs/op`; `31.86 ns/op` (`31.39M evals/s`) | Measured (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | `Enzyme.jl` reverse-mode AD | Max gradient discrepancy vs. central FD: `6.11 × 10⁻¹⁰` | Measured numerical check |

### 4.3 Claim LA-3: KV260 (`xck26`) Beneš–Copy–Beneš and `RAMB36E2` paged synthesis

| RTL Architecture | Pages | Switch Latency | `xcup` CLB LUTs (`% xck26`) | `RAMB36E2` | `DSP48` | Post-Drift Acc. | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` Flat `512:1` Crossbar (`64` LUT6) | `1` | `82 cyc` | `119,478` (**`102.0%` overflow**) | `0` | `0` | `98.44%` | Simulated (Yosys) |
| `2B` Compact Crossbar (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | Simulated (Yosys) |
| `2C` Fixed-Wire DiffLogic / WNN | `1` | Vivado re-PAR | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | Simulated (Yosys) |
| `2D` Single-Page Beneš–Copy–Beneš | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | Simulated (Yosys + Verilator) |
| `P2` Distributed FF + `512:1` Mux | `512` | `1 cyc` | `926,619` (**`791.2%` overflow**) | `0` | `0` | `98.44%` | Simulated |
| **`P3` Beneš + `81` `RAMB36E2` (Reference)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **Simulated (Yosys + Verilator)** |

### 4.4 Claim LA-4: Oracle-free latent `JEPA-EBRM` Split-Conformal + Online ACI gate

| Crystallization Gate | Passes | False Crystallization Risk | OOD AUROC | Safe ID Coverage | Clean `LUT6` Acc. | Caught Shift? | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | Measured SW |
| `3B` Temp-Scaled Margin | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | Measured SW |
| `3C` Helmholtz Logit Energy | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | Measured SW |
| `3D` MC-Dropout (`5` passes) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | Measured SW |
| **`3E` Latent `JEPA-EBRM` + Conformal ACI** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **Measured SW** |

### 4.5 Claim LA-5: Lossless byte-level speculative decoding on `520 KB` polyglot source code

| Architecture | Exact Parity | Bytes / Pass | Passes (`64 B`) | Draft FLOPs | MFLOPs / Byte | `est_mJ / Byte` | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Causal Transformer (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | Measured SW + `est_j` |
| `B` `Mamba-3` Complex MIMO (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | Measured SW + `est_j` |
| `C` `PLD` In-Prompt Lookup | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | Measured SW + `est_j` |
| `D` `REST` Corpus Suffix-Trie | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | Measured SW + `est_j` |
| `E` `Medusa` Parallel MLP Heads | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | Measured SW + `est_j` |
| `F` `EAGLE-2` Neural Draft Tree | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | Measured SW + `est_j` |
| **`G` `MoL` Paged Beneš `LUT6` (Reference)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **Measured SW + `est_j`** |

### 4.6 Claim LA-6: Controlled `AirMoL` 4-bit NVMe streaming (`14.3M` matched pair)

| Offloaded Streaming Architecture | Parity | Bytes / Sweep | Sweeps | NVMe Read | NVMe Write | Peak RAM | `ms / Byte` | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + KV Spill | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | Measured (`F_NOCACHE`) |
| `2` `AirLLM` Transformer 4-Bit + KV Spill | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | Measured (`F_NOCACHE`) |
| `3` `AirMamba-3` 4-Bit + Swapped `EAGLE-2` | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | Measured (`F_NOCACHE`) |
| `4` `AirMamba-3` 4-Bit + Pinned $O(1)$ (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | Measured (`F_NOCACHE`) |
| **`5` `AirMoL` 4-Bit + Cold `LUT6` (Reference)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **Measured (`F_NOCACHE`)** |
| **`6` `AirMoL` 4-Bit + Post-Wake (Reference)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **Measured (`F_NOCACHE`)** |

### 4.7 Claim LA-7: Pretrained 2026 dense & tri-hybrid models under `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M`, & `Qwen3.5-0.8B-Base`)

| 2026 Checkpoint & Arm | Parity | Tok / Sweep | Chars / Sweep | Sweeps | NVMe Read | Peak Active RAM (`% FP32`) | `tok/s` | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Measured (`F_NOCACHE`) |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Measured (`F_NOCACHE`) |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Measured (`F_NOCACHE`)** |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Measured (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Measured (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Measured (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Post-Wake** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Measured (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Measured (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Measured (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Measured (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Measured (`F_NOCACHE`)** |

On October 2026 `LiquidAI/LFM3-1.7B` (`13` short convolutions + `5` sliding-window attention layers + `6` full-attention layers, `|V| = 128,000`), post-wake `AirMoL` reduces NVMe transfer by `2.74×` (`25.045 GB` to `9.131 GB`) and increases decoding speed `2.49×` (`0.53` to `1.32 tok/s`) in `250.0 MB` active weight RAM (`3.79%` of FP32) at `100.0%` lossless parity. Note the preserved trade-off on CPU-bound `Qwen3.5-0.8B-Base` cold unseen prompts: `AirMoL` reduces NVMe disk reads (`12.674 GB` to `8.581 GB`), yet CPU Gated DeltaNet batch verification of `4` tokens lowers wall-clock throughput (`0.32` vs. `0.53 tok/s`) until online wake-to-`LUT6` crystallization raises acceptance to `2.74 tok/sweep` (`1.11 tok/s`).

### 4.8 Claim LA-8: Live CLI and HTTP/SSE streaming server (`mol_code_cli.py`)

`scripts/mol_code_cli.py` serves `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` and `--air-nvme` over CLI and SSE endpoints (`/v1/health`, `/v1/complete`, `/v1/crystallize`), advancing `RAMB36E2` slot residency from `438/512` to `460/512` live with `26/26` passing tests in `tests/`.

### 4.9 Claim LA-9: Frontier Sparse-MoE `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` & `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| Sparse-MoE Checkpoint & Arm | Parity | Active Experts | Tok / Sweep | NVMe Read / Tok | I/O Reduction | Peak RAM (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` Dense 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Post-Wake** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` Dense 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Post-Wake** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

On `Qwen/Qwen3.6-35B-A3B` (`34.66B` parameters, `66.11 GB` FP16 sharded to `18.60 GB` 4-bit `.experts.pack4` files; whole-system macOS `PMU` delta `20,070.18 J`), post-wake `Expert-AirMoL` reduces unbuffered NVMe transfer by **`12.30×`** (`18.159` to `1.477 GB/tok`) and accelerates decoding **`6.50×`** (`0.06` to `0.39 tok/s`) in **`2,530.7 MB` active RAM (`3.83%` of FP16)** at `100.0%` lossless token parity.

### 4.10 Claim LA-10: Sub-1-bit latent factorization (`LittleBit-1 / LittleBit-2`) vs. zero-MAC `Sub1Bit-LUT6`

| Factorization Method (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | Bits / Weight | Weight SNR | Cosine Sim | `16K` Top-1 Match | Binary MACs / Tok | QAT Epochs | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Unrotated `SVD` SVID (`LittleBit-1` PTQ style) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` in paper) | Measured SW |
| `B` Procrustes `ITQ` SVID (`LittleBit-2` PTQ style) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` in paper) | Measured SW |
| **`C` `Sub1Bit-LUT6` Table Lookup (`0` MACs, Draft)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **Measured (`< 4e-6` vs. `B`)** |
| `D` `Expert-AirMoL` `INT4` Block-64 Target | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | Measured SW |
| **`E` `MoL`: `Sub1Bit-LUT6` Draft + Target Verify** | **`0.576` draft** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` draft MACs** | **`0`** | **Measured lossless parity** |

### 4.11 Claim LA-11: `48`-task (`16` specifications × `3` waves) late-2026 frontier coding bakeoff

| Late-2026 System Arm (`48` Tasks = `16` Specs × `3` Waves) | W1 Cold | W2 Adapt | W3 Warm | Overall Pass | Broken Commits | W3 `Rung 0/1` Share | `35B` Calls | Mean W1 / W3 (`ms`) | `reported_j` / Solve (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Shot) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Reference)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` solved)** | **`3,655.51*` (`0.0424 J` in W3)** |

Across the `48`-task protocol and algorithm benchmark (RFC 1982 serial arithmetic, weighted interval sweep-lines, cycle-safe lexicographic topological sort, nanosecond token buckets, CRC-8/ATM and mutated `0xFF` CRC-8, RFC 6901 JSON Pointer `~01` unescaping, hop-bounded Bellman–Ford, `>2⁵³` exact window medians, unrestricted Damerau–Levenshtein, `4×4` Beneš routing, SQL literal parameterization, monotonic-deque subsequence sum, DWARF SLEB128, SHA-256 consistent hashing, and conformal quantiles; whole-system macOS `PMU` delta `117,166.40 J` over `6,646` ticks), `VerifiedCodeCascade` reaches **`87.50%` (`42 / 48`)** across all three waves — exceeding standalone `Qwen3.6-35B-A3B` (`77.08%`) while calling `35B` on only **`22.92%` (`11 / 48`)** of tasks (`LFM3-1.7B` solves `7` Wave-1 specs directly; `Gemma-4-E2B-it` + structured counterexample repair solves `3`; `Metal-Qwen3.6-35B-A3B` solves `4` plus mutated `W2_01`). It admits **`0.00%` broken commits** (vs. `22.92%–100.00%`), catches both Wave-2 adversarial specification mutations via $C(z)$ (`16` certified skills in `artifacts/.mol_verified_skills`), and reduces mean Wave-3 replay across the **`14` crystallized solves (`87.50%`)** to **`2.89 ms`** and **`0.0424 J` `reported_j`** (`15,401×` faster and `25,227×` lower `reported_j` than standalone `35B`). *(Footnote `*`: One `W2_10` `Gemma-4` invocation experienced an unprivileged macOS `IOReport` `'GPU Energy'` hardware-accumulator rollover spike of `+59.2 kJ`, preserved unedited in `frontier_ai_head_to_head_bakeoff.csv` and filtered by `joule_meter.py`'s `> 450 W` rollover guard in subsequent runs.)*

### 4.12 Claim LA-12: Native Apple Metal (`MSL`) fused `INT4` Sparse-MoE & `GatedDeltaNet` shaders + dual-channel `reported_j`

`src/clai/frontier/metal_moe_kernels.py` and `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) compile three custom `MSL` kernels via `torch.mps.compile_shader`: (i) `gated_delta_recurrent_k128`, exploiting exact column independence across $v \in \{0, \dots, V_{\text{dim}}-1\}$ of recurrent state $\mathbf{S}[b, h_v, :, v]$ to keep `128` `FP32` state elements in GPU registers across all $T$ tokens (**`20.66×` faster**: `34.523` to `1.671 ms`, **`46.2×` lower `reported_j`**: `1.4989` to `0.0325 J`, `1.19 × 10⁻⁷` max state error); and (ii) `q4_moe_gate_up_silu` + `q4_moe_down_weighted`, dequantizing `4.50 bpw` `INT4` block-64 expert weights directly inside `simd_sum` registers with zero `FP16`/`FP32` weight allocations (**`43.45×` faster**: `22.408` to `0.516 ms` on `28` active experts, **`29.8×` lower `reported_j`**: `0.3959` to `0.0133 J`, `7.2 × 10⁻⁷` max `FP32` error, `<= 1 ULP` `BF16`), paired with Queue-Depth-`8` parallel `pread` and `BenesLUT6` sign-sketch router lookahead:

| Sparse-MoE Checkpoint & Cold-NVMe Engine Variant | Parity | Tok / Sweep | NVMe Read / Tok | Peak Active RAM | `tok/s` (`× PyTorch`) | On-Chip `reported_j / tok` (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-Fused + `BenesLUT6` (Reference)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-Fused + `BenesLUT6` (Reference)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

Eliminating `FP16`/`FP32` expert unpacking cuts cold-NVMe Peak Active Weight RAM on `Qwen/Qwen3.6-35B-A3B` by **`2.51×`** down to **`970.0 MB` (`1.47%` of `66.11 GB` FP16)** and reduces dual-channel `reported_j / tok` **`3.07×`** (`20.765` to **`6.773 J/tok`**) at `100.0%` exact token parity (reaching **`15.7 tok/s`** when `16.8 GB` `INT4` expert packs remain pinned in Unified Memory on `>= 36 GiB` workstations).

### 4.13 Claim LA-13: `16`-task (`8` multi-file git repositories × `2` waves) `SWE-Mini` `pytest` patching benchmark

`src/clai/frontier/repo_patch_cascade.py` and `scripts/run_repo_patch_benchmark.py` (`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`) evaluate cross-module repository bug-fixing across `8` isolated git repositories (`billing`, `scheduler` DAG, `auth` JWT/HMAC, `wal` CRC32, `http_client` CIDR, `semver`, `ttlcache` LRU/TTL, and `etl` CSV) × `2` waves (`16` evaluations, including a Wave-2 security mutation on `R03_jwt_clock_skew` adding future-`iat` rejection), where $C(z)$ enforces byte-identical `tests/` and runs subprocess `pytest -q`:

| Multi-File Git-Repository Arm (`16` Tasks = `8` Repos × `2` Waves) | W1 Cold | W2 Warm | Overall Pass | Broken Patches | W2 `.mol/` Hit Share | Mean W1 / W2 (`ms`) | `reported_j` / Fix (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot Repo Patch) | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J` (`637.68 est_j`) |
| `B` `google/gemma-4-E2B-it` (`1`-Shot Repo Patch) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J` (`469.79 est_j`) |
| `C` `LiquidAI/LFM2.5-8B-A1B` (`1`-Shot Repo Patch) | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J` (`54,052 est_j`) |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J` (`3,098.71 est_j`) |
| **`E` `MoL` `RepoPatchCascade` (Reference)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663` (`594 ms` `.mol/`)** | **`692.38 J` (`1.10 J` `.mol/`)** |

`RepoPatchCascade` solves **`87.50%` (`14 / 16`)** of multi-file repository bugs (`+25.0` percentage points above standalone `35B` and `Gemma 4`), commits **`0.00%` broken patches**, catches the Wave-2 `R03` specification mutation via subprocess `pytest` $C(z)$ and re-crystallizes `Patch#8` (`2,905 ms`), and replays the `6` recurring Wave-2 `.mol/` patches in **`594.0 ms` (`1.10 J` `reported_j`, including `git init` + `pytest`)** vs. `38,937.5 ms` (`590.38 J` `reported_j`) in Wave 1 (**`65.6×` faster, `537×` lower `reported_j`**).

### 4.14 Claim LA-14: Drop-in OpenAI (`/v1/chat/completions`) and `MCP` (`JSON-RPC 2.0`) local coding agent (`mol-agent`)

`src/clai/service/openai_mcp_agent.py` and `scripts/mol_agent_server.py` (`mol-agent` CLI entrypoint) expose the cascade to `IDE` and terminal coding tools (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, OpenAI `SDK`) with zero third-party web dependencies: (i) OpenAI-compatible `GET /v1/models` and `POST /v1/chat/completions` (`stream: true/false` `SSE`, CORS headers, optional `x_mol_contract` deterministic verifier, and `x_mol_receipt` reporting rung, `skill_id`, `est_j`, `reported_j`, `measured_j: null`); and (ii) Model Context Protocol (`MCP` `JSON-RPC 2.0` over `--mcp-stdio` and `POST /mcp`) exposing `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill`, and `mol_energy_telemetry` backed by persistent `.mol/skills_v1.json` + `.mol/benes_lut6_router.npz` (`30 / 30` `pytest` tests passing).

### 4.15 Claim LA-15: Official `BigCodeBench v0.1.3` (`32` evaluations) and upstream `SWE-bench Verified` `SymPy` git-worktree (`16` evaluations) benchmarks via `MCP` `JSON-RPC 2.0`

`src/clai/frontier/external_public_benchmarks.py` and `scripts/run_external_public_benchmarks.py` (`artifacts/external_public_bcb_swebench.csv`, `artifacts/external_public_bcb_swebench_traces.json`) evaluate `MoL` `MCP` Agent (`handle_mcp_jsonrpc` + `.mol/` crystallization) head-to-head against standalone `LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, and Metal-accelerated `Qwen/Qwen3.6-35B-A3B` on two official public HuggingFace Parquet benchmarks verified by `SHA`-256 at load time (`bigcode/bigcodebench` `v0.1.3`: `ed5a3a39...`, `16` tasks × `2` human-authored prompt waves [`complete_prompt` in Wave 1 + `instruct_prompt` in Wave 2] = `32` `unittest` evaluations; and `princeton-nlp/SWE-bench_Verified`: `a45b1fe4...`, `8` real `sympy/sympy` `1.11–1.12` git-worktree checkouts × `2` waves = `16` `pytest` evaluations across `FAIL_TO_PASS + PASS_TO_PASS`) under strict zero gold-solution leakage (macOS `PMU` delta `59,250.43 J`):

| Official Public Benchmark & Arm | W1 Cold | W2 Paraphrase / Backport | Overall Verified Pass | Broken Admitted | W2 `.mol/` Fast-Path | `35B` Calls | Mean W1 / W2 (`ms`) | `reported_j` / Solve (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` `MoL` `MCP` Agent (Reference)** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` `MoL` `MCP` Agent (Reference)** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33–0.44 J` W2 `.mol/`)** |

On `BigCodeBench v0.1.3` (Zhuo et al., 2024), `MoL` `MCP` Agent exceeds standalone `Qwen3.6-35B-A3B` by **`+12.50` percentage points (`90.62%` vs. `78.12%`, reaching `93.75%` [`15/16`] on human-paraphrased `instruct_prompt` Wave 2)** while calling `35B` on only `25.00%` of tasks, cutting Wave-2 mean latency **`7.89×`** (`47,321` to `6,001 ms`; `63–146 ms` and `0.09–0.13 J` `reported_j` on `12` of `13` `.mol/` hits), and spending **less `reported_j` per verified solve (`263.54 J` vs. `277.45 J`)** with `0.00%` broken outputs admitted. On upstream `SWE-bench Verified` (Jimenez et al., 2024), zero-leakage `AST` and stack-frame localization identifies all `8 / 8` target files in `sympy/sympy` without reading `patch`, and `MoL` doubles verified solve rate (**`50.00%` [`4/8`: `sympy-23534`, `23950`, `24066`, `24213`] vs. `25.00%` [`2/8`] on `35B` and `0.00%` on `LFM3`/`Gemma4`**), replaying all `4` crystallized unified `git diff` skills in Wave 2 in **`1,590–1,720 ms` (`0.33–0.44 J` `reported_j`, including fresh `git worktree` checkout + `pytest`)** while abstaining safely (`VERIFIER_ABSTAIN_SAFE`) on the `4` unsolved multi-hunk algebra issues (`0.00%` broken patches admitted).

### 4.16 Claim LA-16: `4`-stage `250 MHz`-pipelined Kria KV260 (`xck26`) Beneš–Copy–Beneš + `81-RAMB36E2` RTL subsystem (`4.00×` logic-depth reduction)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` and `scripts/verify_pipelined_250mhz_rtl.py` (`artifacts/kv260_pipelined_250mhz_rtl.csv`, `artifacts/kv260_pipelined_250mhz_meta.json`) address both physical design constraints identified in the unpipelined audit (§4.24–§4.25) by inserting three synchronous pipeline register walls across `Beneš-1` (`9` stages), `Copy + Beneš-2[0..3]` + parallel `RAMB36E2` tag/page read, `Beneš-2[4..8]`, and `80 × LUT6` + `16`-bit folded popcount voter, wrapped inside an `IOB`-safe `64`-bit `AXI4-Stream` shell (`clai_benes_axi_stream_250mhz_top`):

| KV260 (`xck26-sfvc784-2LV-c`) RTL Variant | Stages (`CPI`) | Sync Reg-to-Reg Depth | Top `IOB`s (`<= 189`) | `xcup` CLB LUTs (`%`) | `xcup` FFs (`%`) | `RAMB36E2` (`%`) | `DSP48E2` | Verilator Stream Parity |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core` (`1`-cyc `OOC`) | `1` (`1.00`) | `52` levels | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top` (Unpipelined `AXI4` Rung-0) | `1` (`1.00`) | `60` levels | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz` (`OOC`)** | **`4` (`1.00`)** | **`13` levels (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top` (Reference)** | **`5` (`1.00`)** | **`13` levels (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

Graph traversal across flattened `synth_xilinx -family xcup` synchronous boundaries (`FDRE`/`RAMB36E2`/`IBUF` to `FDRE`/`RAMB36E2`/`OBUF`, excluding multi-cycle `CARRY4` telemetry counter chains that Yosys `ltp -noff` walks across blackbox `FDRE` clock pins) establishes that single-cycle combinational depth drops **`4.00×`** from `52` levels (`60` in `U2`) down to **`13` levels** at a cost of only `+253` CLB LUTs (`+0.21%` of `xck26`), fits the `xck26-sfvc784-2LV-c` pin budget (**`170 <= 189` `IOB`s**), and passes **`256 / 256` zero-bubble back-to-back beats (`CPI = 1.00`, `0` errors)** in Verilator `5.054`.

### 4.17 Claim LA-17: Bounded open-weights `Rung 3d` native `<think>` ceiling (`91.67%` overall, `93.75%` Wave 2 and Wave 3, `0.00%` broken commits)

`scripts/run_rung3d_thinking_ceiling.py` (`artifacts/frontier_ai_rung3d_ceiling.csv`, `artifacts/frontier_ai_rung3d_ceiling_traces.json`) adds an optional **`Rung 3d` bounded open-weights reasoning rung** (`Qwen/Qwen3.6-35B-A3B` with native `enable_thinking=True`, `1,536–2,200` `<think>` token budget, `100%` Apache-2.0 local weights, zero proprietary cloud APIs) invoked strictly on the residual tasks where `Rungs 0–3c` abstain across the `48`-task (`16` specs × `3` waves) engineering bakeoff:
- **`Arm H` (`MoL + Rung 3d Qwen3.6-35B-A3B <think>`)** raises verified pass rate from `87.50%` (`Arm G`) to **`87.50%` W1 Cold, `93.75%` (`15 / 16`) W2 Adapt, `93.75%` (`15 / 16`) W3 Warm, and `91.67%` (`44 / 48`) Overall** (**`+14.59` percentage points** above standalone `Qwen3.6-35B-A3B`'s `77.08%`), while calling `35B` on `20.83%` of tasks (`Rung 3d` `<think>` wakes on **`5 / 48 = 10.42%`** of tasks).
- Specifically, `Rung 3d` derives a verified `6`-switch Waksman `4×4` permutation solver on `W2_11_F11_benes4_route` in `2,185` `<think>` tokens and compiles it into `Skill#17`, replaying `W3_11` in `< 3.8 ms` (`0.0351 J` mean `reported_j` across all `15` crystallized Wave-3 solves), while `F10_true_damerau` (`OSA` vs. unrestricted Lowrance–Wagner alphabet-`DP` prior conflict) triggers `VERIFIER_ABSTAIN_SAFE` (`0.00%` broken commits admitted).

### 4.18 Claim LA-18: Zero-Python cross-platform Rust `Burn 0.22.1 / CubeCL` fused `INT4` Sparse-MoE & `GatedDeltaNet` kernels

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` and `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` (`artifacts/cubecl_cross_platform_moe_deltanet.csv`, `artifacts/cubecl_cross_platform_moe_deltanet_meta.json`) port the fused `INT4` Block-64 Sparse-MoE (`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`, `u32` 8-nibble register unpacking with zero `FP16`/`FP32` expert weight buffers) and `GatedDeltaNet` (`gated_delta_recurrent_k128_cube_kernel`) shaders into pure Rust **`Burn 0.22.1 / CubeCL` `#[cube]` kernels** targeting `Metal`, `Vulkan` (`SPIR`-V), `CUDA` (`PTX`), `ROC`m (`HIP`), and `LLVM` `SIMD` `CPU` from one codebase:

| Portable Rust `Burn 0.22.1 / CubeCL` Kernel & Shape | Backend Target | Mean Latency (`ms`) | Speedup vs. Host `FP32` | Max Abs `FP32` Error | Portable Shader Targets |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

### 4.19 Claim LA-19: Six-kernel paranoid formal proof verification of Section 2 (`27` theorems, `6/6` independent kernels, `CVE-2026-72844`-hardened)

In July–November 2026, soundness and `.olean`-replay disclosures in Lean 4 — `CVE-2026-72844` (`leanprover/lean4#14576`, phantom parameters on nested inductive types paired with `.proj` structure-projection confusion `CWE-843` in `<= v4.31.0`, publicized via an artificial-intelligence-assisted Collatz disproof repository and patched by the Lean `FRO` in `v4.32.2`), `CVE-2026-72711` (`leanprover/lean4#14484`, missing local-variable check in `add_opaque`), `Kernel.Environment.replay` forged `.inductInfo` skipping (`#16688`), `.olean.server` sidecar/replay mismatches (`#16674`, `#16675`), and reinforcement-learning `native_decide` (`Lean.ofReduceBool` `FFI`, `#16693`) bypasses — showed that formal assurance should not rest on a single C++ checker or unsandboxed `.olean` replay. `proofs/` (`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance}.lean`) and `scripts/verify_lean_proofs.py` (`artifacts/lean4_formal_proofs_summary.csv`, `artifacts/lean4_six_kernel_paranoid_audit.csv`, `artifacts/lean4_formal_proofs_meta.json`) enforce zero `sorry`, zero custom `axiom`, zero `opaque`, zero nested inductives, and zero `Lean.ofReduceBool`, build cleanly in **Lean `4.36.0`** (`1,041.55 ms`, `0.3236 J` Darwin `reported_j`), and pass **`lake check --paranoid`** both on Apple Silicon (`175,798.92 ms`, `77.7477 J` Darwin `reported_j`) and inside an unprivileged Linux `bubblewrap 0.11.1` (`bwrap`) read-only, network-isolated namespace (`237,823.64 ms`, `1,461.62 J` core / `22,371.48 J` package `RAPL` `reported_j`, archived in `openie-research-experiments/lut-adapt-bwrap-paranoid/` at commit `1f50db59`) across **all six independent kernels** (Figure 6):

| Lean `4.36.0` Module (`proofs/LutAdapt/`) | Checked Theorems | Section 2 Coverage | `sorry` / Custom / `ofReduceBool` | Axiom Footprint (`#print axioms`) |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Simon–Kadane adjacent & prefix swaps (`p₁/c₁ > p₂/c₂`), Proposition 1 net savings & $\Delta T^*$ horizon, zero-hit churn refusal | `0` / `0` / `0` | `3` choice-free (`propext`, `Quot.sound`); `4` standard `ZFC` |
| **`BenesCopy.lean`** | `7` | Theorem 2 `512×512` Beneš–Copy–Beneš (`43` stages, `11,008` switch bits), `4`-stage `<= 13`-stage partition, disjoint copy intervals, Lee modulo non-contention | `0` / `0` / `0` | **`2` purely constructive (`0` axioms)**; `5` choice-free |
| **`JointMinterm.lean`** | `7` | Proposition 3 dominance, in-support guarantee, `(40,35,25)` marginal chimera witness, `uint64` `BPE` burst bijection (`K=4` `LFM2`, `K=3` `LFM3`/`Qwen3.6`) | `0` / `0` / `0` | **`1` purely constructive (`0` axioms)**; `6` choice-free |
| **`ConformalProvenance.lean`** | `6` | Result 4 off-manifold ray abstention, finite-sample conformal bound, `ACI` equilibrium, provenance lattice (`ModelGenerated ↛ Deterministic`), greedy speculative parity | `0` / `0` / `0` | **`2` purely constructive (`0` axioms)**; `4` choice-free |
| **Total (`LutAdapt.lean`, Reference)** | **`27`** | **All `4` Section 2 Results + Hardware / Provenance Corollaries** | **`0` / `0` / `0`** | **`5` zero-axiom; `23/27` choice-free; `6/6` kernels accept** |

| Independent Proof Checker (`lake check --paranoid`) | Implementation & Soundness Basis | Verified Decls | Verdict | Mitigated Vulnerability Classes |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | Minimal reference kernel (Breitner) formally proved consistent in `ZFC` set theory (cannot accept `False`) | `58,683` | **`Accepts`** | `CVE-2026-72844` (nested inductive `.proj`), `CVE-2026-72711` (`add_opaque`), `WHNF` cache bugs |
| **`con-ron --verified`** | *Aeneas*-verified Rust refinement of `con-leche` | `58,683` | **`Accepts`** | `CVE-2026-72844`, `CVE-2026-72711`, C++ memory & `GMP` bignum bugs (`#14833`) |
| **`lean4lean`** | Independent Lean-in-Lean `CIC` typechecker (Carneiro) | `58,685` | **`Accepts`** | C++ kernel implementation divergence & projection typing |
| **`nanoda`** | Standalone zero-Lean-runtime Rust export verifier (`sorryAx` blocked) | `58,685` | **`Accepts`** | `.olean` serialization tampering & unpermitted `sorryAx` |
| **`leanchecker --paranoid`** | Fresh-environment C++ kernel replay with zero tactic trust | `58,685` | **`Accepts`** | Metaprogramming environment mutation & `debug.skipKernelTC` |
| **`Lean v4.36.0` (default)** | Post-`CVE` November 2026 C++ kernel (`#print axioms` enforced) | `58,685` | **`Accepts`** | All Summer/Autumn 2026 `CVE`s patched; `0` `Lean.ofReduceBool` |

![Figure 6. Six-Kernel Formal Proof Assurance and Three-Layer Compiled Stack.](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*Figure 6. Six-kernel paranoid formal proof audit (`Claim LA-19`, left) and the three-layer compiled stack spanning `CE`-gated `LUT6` RTL, `MoL` downward compilation, and single-binary Rust `MCP` dispatch (`Claim LA-23`, right). [PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [Interactive explorer](/living/lut-adapt/#la-tab-01).*

### 4.20 Claim LA-20: Multi-repository upstream `SWE-bench Verified` (`4` repositories, `24` git-worktree evaluations) with multi-window `AST` call-graph localization

`src/clai/frontier/multirepo_swebench.py` and `scripts/run_multirepo_swebench_benchmark.py` (`artifacts/multirepo_swebench_verified.csv`, `artifacts/multirepo_swebench_verified_traces.json`) extend zero-gold-leakage `princeton-nlp/SWE-bench_Verified` (`SHA`-256 `a45b1fe4...`) evaluation across **`4` distinct upstream Python repositories** (`django/django` [`4`], `pytest-dev/pytest` [`3`], `psf/requests` [`2`], and `sympy/sympy` [`3`] × `2` waves = **`24` isolated `git worktree` evaluations**), adding a **Multi-Window `AST` Call-Graph Localizer** that walks intra-file `ast.Call` edges (`helper(...)` / `self._helper(...)`) to extract `2` non-overlapping `AST` windows (`91.67%` [`11/12`] exact ground-truth file localization with zero access to `patch`, `apple_pmu_system_energy_delta_j = 60,935.10 J`):

| Multi-Repo `SWE-bench Verified` Arm (`4` Repos, `24` Evals) | W1 Cold | W2 Backport | Overall Verified | `django` / `pytest` / `requests` / `sympy` | Broken Patches | W2 `.mol/` Fast-Path | Mean W1 / W2 (`ms`) | `reported_j` / Verified Fix |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` `MoL` Multi-Repo `MCP` Agent (Reference)** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (`100%` of W1)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12–5.50 J` W2 hits)** |

Across `django`, `pytest`, `requests`, and `sympy`, every standalone `1`-shot model (`LFM3-1.7B`, `Gemma-4-E2B`, `Qwen3.6-35B-A3B`, and `Devstral-Small-2-24B`) caps at `4.17%–8.33%` verified pass and admits **`91.67%–95.83%` broken patches** (`ORM` aggregation, `pytest` fixture internals, `IDNA` proxy `URL` handling). `MoL` Multi-Repo `MCP` Agent reaches **`20.83%` overall (`25.00%` in Wave 2, `2.50×` standalone `24B` and `35B`)** across **`3` of `4` repositories** (`django__django-17029` via `Gemma-4-E2B` replayed in **`2,028.24 ms` / `5.50 J`** via `MCP_Rung0_BenesLUT6->GitDiffSkill#1`; `psf__requests-6028` via `Rung 3d Qwen3.6-35B <think> CxRepair` replayed in **`592.87 ms` / `1.12 J`** via `GitDiffSkill#2` where `0%` of standalone `1`-shot models passed; and `sympy__sympy-24213` via `Rung 2 LFM3-1.7B`), admitting **`0.00%` broken patches**.

### 4.21 Claim LA-21: Measured `120B`-scale open-weights Hybrid Mamba-Attention Sparse-MoE (`nvidia/Nemotron-3-Super-120B-A12B`) & `Devstral-Small-2-24B` apex cascade

`src/clai/frontier/frontier_120b_hybrid_moe.py` and `scripts/run_120b_hybrid_moe_benchmark.py` (`artifacts/frontier_120b_hybrid_moe_apex.csv`, `artifacts/frontier_120b_hybrid_moe_apex_traces.json`) replace Section 6's `70B+` projection caveat with direct local execution of **`nvidia/Nemotron-3-Super-120B-A12B`** (`120B` total / `12B` active Hybrid Mamba-Attention Sparse-MoE, `56.9 GiB` 2-shard `Q3_K_S` `GGUF`) and **`Devstral-Small-2-24B-Instruct`** (`24B` dense `SWE` specialist, `Q4_K_M` `GGUF`) on Apple M5 Max (`128 GiB` Unified Memory) via Metal `llama-server`, recording child `ri_resident_size` (`RSS`), `ri_phys_footprint`, child `L3` `ri_energy_nj` (`buf[42]`), and `L2` `IOReport` `GPU Energy` across the `8` hardest adversarial specs × `2` waves (`16` evaluations, including `BigCodeBench/6`, `BigCodeBench/8`, `F10_true_damerau`, and `F11_benes4_route`):

| Measured `24B` / `120B` Frontier Arm (`16` Hard Evals) | Params (Active) | Peak Resident `RSS` | Mean `tok/s` | W1 Hard-`8` | W2 Warm | Overall Pass | Broken Commits | W2 `.mol/` Fast-Path | Mean W1 / W2 (`ms`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` `MoL` Apex `24B+120B` Cascade (Reference)** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (`100%` of W1)** | **`53,493` / `19,642` (`5.5–70 ms` `.mol/`)** |

Because `Nemotron-3-Super-120B-A12B` activates `12B` Mamba-Attention MoE parameters per token (`50%` fewer active weights than dense `24B`), it sustains **`22.17 tok/s`** inside `58.08 GB` resident Unified Memory (`9.67 GB` anonymous `KV`/`SSM` footprint), matching `24B` dense decode speed at `5×` total parameter scale. Pairing `BenesLUT6` + `.mol/` + $C(z)$ counterexample escalation across `Devstral-2-24B` and `Nemotron-3-120B-A12B` raises verified pass to **`62.50%` (`+18.75` percentage points over standalone `120B-A12B`, `2.00×` standalone `24B`)**, closes `BigCodeBench/8` (`W1_09_BigCodeBench_8_complete`), and replays all `5` crystallized Wave-2 skills in **`5.49–69.76 ms` (`0.0118–0.0272 J` `reported_j`)** vs. `10,092–40,905 ms` on standalone `120B` (`0.00%` broken commits; one `42.7 s` `W3_10` window experienced an `OS` `IOReport` accumulator rollover prior to tightening `joule_meter.py`'s `TDP` rollover guard from `450 W` to `175 W`, preserved unedited in the `CSV`).

### 4.22 Claim LA-22: Clock-enable (`CE`) gated `250 MHz` `P4-AXIS` Kria KV260 (`xck26`) Verilator `VCD` dynamic power audit (`4.10×` idle & `2.69×` packet-shift reduction)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` (`ENABLE_CE_GATING = 1`) and `scripts/verify_ce_gated_vcd_power.py` (`artifacts/kv260_ce_gated_vcd_power.csv`, `artifacts/kv260_ce_gated_vcd_power_meta.json`) implement the `ENARDEN` clock-gating optimization identified in §4.25 directly inside the `4`-stage `250 MHz` `P4-AXIS` design (`clai_uram_lut6_page_cache_ce` + valid-bubble `S1..S4` `FDRE` gating), evaluated via `Verilator 5.054 --trace` `VCD` toggle extraction + `AMD DS925` (`xck26`, `VCCINT = 0.72 V`, `250 MHz`, `est_j` class):

| `xck26` `P4-AXIS` Variant (`13` Levels, `170` `IOB`s, `81` `RAMB36E2`) | Workload (`Cycles`, Lookup Duty) | `VCD` Signal Transitions / Cyc | Est. `pJ / cyc` | Est. Dynamic `mW` @ `250 MHz` (`[Low, High]`) | Power Reduction vs. Ungated | Verilator Parity (`320` Beats) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Reference)** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Reference)** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (`2.73×` fewer)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Reference)** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (`2.73×` fewer)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

Adding `ENARDEN` + valid-bubble `CE` gating adds `+9` CLB LUTs (`41,456` to `41,465`, `0` extra FFs, retaining **`13` synchronous logic levels** and **`170 <= 189` `IOB`s**), preserves **`320 / 320` (`100.0%`) bit-exact output parity** between `CE=0` and `CE=1`, and cuts quiescent dynamic power **`4.10×`** (`63.99` to **`15.59 est_mW`**) and `64`-bit `AXI4-Stream` packet-ingest (`1`-of-`8` lookup duty) power **`2.69×`** (`69.62` to **`25.84 est_mW`**).

### 4.23 Claim LA-23: Zero-Python single-binary native Rust `mol-agent-rs` server (`0.154 ms/req` `MCP`, `17.21×` faster than Python `mol-agent`)

`sys/rust/src/bin/mol_agent.rs` (`artifacts/rust_mol_agent_server_bench.csv`, `artifacts/rust_mol_agent_server_meta.json`) compiles a standalone native Rust binary (`cargo run --release --bin mol_agent`) with **zero Python interpreter or third-party `HTTP` dependencies**, serving OpenAI `GET /v1/models`, REST + `SSE` `POST /v1/chat/completions`, and `MCP` `JSON-RPC 2.0` (`POST /mcp` + `--mcp-stdio`) directly over `.mol/skills_v1.json` (`17` crystallized skills) + `Burn 0.22.1 / CubeCL` `CubeCL_Metal_GPU` verification + Darwin `proc_pid_rusage(RUSAGE_INFO_V6)` `ri_energy_nj` (`words[42]`) telemetry:

| Local Loopback Agent Endpoint | Runtime Stack | Mean Latency (`ms/req`) | Speedup vs. Python `MCP` | Darwin `L3` `reported_j / req` | Zero Python Deps |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill` (Reference)** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions` (Reference)** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify` (Reference)** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | — | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

### 4.24 `xck26-sfvc784-2LV-c` Full-Subsystem Primitive Breakdown, Topological Depth, and `Vivado 2026.1` Hardware Probe

To audit both the standalone `512`-page speculative core (`clai_benes_paged_hotswap_core` in `hw/kv260/rtl/clai_benes_hotswap_core.sv`) and the complete Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 subsystem (`clai_kv260_axi_top` in `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv`, and `artifacts/clai_rung0_kv260.v` at commit `a5e9bc1de280`, unchanged in `91a2213`) against the exact AMD Kria KV260 part (`xck26-sfvc784-2LV-c`: `117,120` CLB LUTs, `234,240` CLB flip-flops, `144` `RAMB36E2` blocks, `64` 288-Kbit UltraRAM (`URAM288`) blocks, `1,248` UltraScale+ digital signal processing (`DSP48E2`) slices, and `189` user input/output blocks (`IOB`s)), three hardware and electronic design automation (`EDA`) checks were executed on an `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) workstation:

1. **Read-only Joint Test Action Group (`JTAG`) & Universal Serial Bus (`USB`) probe (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: Although `lsusb` reported an attached Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` dual universal asynchronous receiver-transmitter (`UART`) / first-in first-out (`FIFO`) integrated circuit (`IC`)) bridge, inspecting Linux `sysfs` USB vendor/product strings (`idVendor = 0403`, `idProduct = 6010`) identified the device as `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` rather than a Kria KV260 carrier. Querying `hw_server v2026.1` (Build May 29, 2026) via `xsdb` (`connect; jtag targets; targets`) returned **`0` Xilinx `JTAG` devices and `0` Debug Access Port (`DAP`) targets** (`board_metered = false`, `measured_j = None`).
2. **`Vivado 2026.1` batch synthesis and licensing gate (`SW Build 6511674`)**: A reproducible low-footprint non-project batch script (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, targeting `xck26-sfvc784-2LV-c` at `250.0 MHz` / `4.000 ns` in out-of-context (`OOC`) mode) was staged against `/tools/Xilinx/2026.1/Vivado/bin/vivado`. Launching `vivado v2026.1` in batch mode exited prior to `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), because AMD `Vivado 2025.1+` / `2026.1` requires an explicit user-generated Standard/Enterprise `.lic` file (`~/.Xilinx/Xilinx.lic` or `XILINXD_LICENSE_FILE`) even for Standard-tier `xck26` parts and zero `.lic` files were installed on the workstation. Per strict measurement rules, post-route `WNS`, placed-and-routed maximum clock frequency, and vectorless `report_power` (`est_j`) remain recorded as `not_available` until a Standard `.lic` file is provisioned.
3. **Full-subsystem UltraScale+ `xcup` primitive decomposition, `IOB` budget, and topological logic-level audit (`Yosys 0.71+`)**: Synthesizing both `clai_benes_paged_hotswap_core` and `clai_kv260_axi_top` via `synth_xilinx -family xcup` and `ltp -noff` (while recording host `RAPL package-0` `reported_j` strictly as `x86-64` `EDA` compilation cost $E_{\text{compile}}$, never as FPGA silicon power) established exact cell counts and critical-path combinational depths:

| `xck26-sfvc784-2LV-c` Target Module | CLB LUTs (`% xck26`) | Dominant LUT Primitives | CLB Registers (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Top Ports (`IBUF`+`OBUF`) | Combinational Depth (`ltp`) | Host Synth `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` pages) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / internal bus) | **`81` levels** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 subsys) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS–PL`) | **`73` levels** | `10,089.4 J` (`214.8 s`) |

Two concrete physical design constraints emerge from the `xcup` primitive and `ltp` audit:
- **Pin-budget confinement (`OOC` vs. `PS–PL` `AXI` wrapper)**: Because `clai_benes_paged_hotswap_core` exposes the raw `512`-bit `CodeBitBus` and wide shadow-configuration vectors (`1,379` input buffers (`IBUF`) + `220` output buffers (`OBUF`) = `1,599` ports vs. `189` package `IOB`s on `xck26-sfvc784-2LV-c`), standalone vendor implementation must run with `synth_design -mode out_of_context` or inside an `AXI4-Stream` / `zynq_ultra_ps_e` wrapper such as `clai_kv260_axi_top` (`126` ports, `57.52%` LUT utilization).
- **Unpipelined combinational depth (`81` and `73` levels) vs. `250 MHz` (`4.000 ns`) `-2LV` closure**: While Verilator `5.054` verifies cycle-accurate `CPI = 1.0` (`1` lookup per clock cycle), traversing `17` `Beneš-1` stages + `9` prefix-copy stages + `17` `Beneš-2` stages + dynamic `LUT6` truth-table multiplexing + `5`-voter majority reduction in a single combinational cycle spans **`81` primitive levels** (`73` levels per hierarchical module in `clai_kv260_axi_top`'s combinational `64`-input popcount and `8`-class margin comparator). Closing `250 MHz` (`4.000 ns`) post-place-and-route on low-voltage (`0.72 V`) `-2LV` silicon therefore favors inserting pipeline register stages across $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ and compressing the `64`-wire popcount reduction (implemented in `Claim LA-16` above and quantified analytically in §4.25).

### 4.25 Gate-Level `xcup` Primitive & `Verilator` `VCD` Switching-Activity Datasheet Audit (`est_j`)

Because AMD `Vivado 2026.1` was blocked by a missing `.lic` file and `0` physical `xck26` boards were attached (§4.24), a pre-registered `Verilator 5.054` `--trace` waveform and `Yosys 0.71+` flattened `synth_xilinx -family xcup` audit (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) extracted exact per-cycle signal transitions from `openIE-dev/lut-adapt-ai` (`af152ba`, unchanged in `91a2213`) across four operational phases (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst`, and `shadow_page_stream_write`, `0` co-simulation errors across `3,072` paged lookups and all `AXI4-Lite`/`AXI4-Stream` packet bursts). Every power and energy number in this subsection is strictly an analytical dynamic switching estimate (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**), excluding static silicon leakage and never substituting for placed-and-routed `Vivado report_power` or KV260 `INA260` rail readings.

Flattened `xcup` synthesis maps `clai_benes_paged_hotswap_core` (`512` pages) to **`41,623` CLB LUTs** (`35.54%` of `xck26`, vs. `41,185` hierarchical in §4.24; `19,982 LUT3`, `7,853 LUT6`, `7,738 LUT5`, `3,380 LUT4`, `2,670 LUT2`, `36 MUXF7`, `18 MUXF8`), `36,464` `FDRE` (`15.57%`), and `81` `RAMB36E2` (`56.25%`) across `27,157` unique `VCD` nets (`90,124` internal bits: `64,218` combinational, `20,767` sequential), and maps `clai_kv260_axi_top` to **`66,881` CLB LUTs** (`57.10%` of `xck26`, vs. `67,366` hierarchical in §4.24; `25,402 LUT6`, `25,313 LUT5`, `7,909 LUT3`, `5,303 LUT4`, `2,879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), `16,619` `FDRE`/`FDSE` (`7.09%`), and `4` `RAMB36E2` (`2.78%`) across `3,825` unique `VCD` nets (`128,486` internal bits: `108,582` combinational, `19,901` sequential). Dynamic switching energy at `VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`, `250.0 MHz`, `AMD DS925` / `XPE` 16 nm FinFET bounds `[low, nom, high]`) models switched logic + local interconnect nodes at $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, weighted by `2.02` `xcup` primitives per `VCD` combinational bit in the Beneš core), `FDRE`/`FDSE` clock-leaf pins at `[1.5, 2.2, 3.0] fF` (`2` edges/cycle = `1.141 fJ/FF/cycle` nominal) plus `[3.5, 5.5, 8.0] fF` per `Q` transition, and `RAMB36E2` (`SDP` `64b`/`72b`) at `[2.90, 3.80, 4.80] pJ` per varying-address read, `[1.90, 2.47, 3.12] pJ` per constant-address enabled cycle (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3.30, 4.30, 5.40] pJ` per write, and `[0.04, 0.08, 0.14] pJ/cycle` when disabled (`EN = 0`):

| Target Module & `VCD` Workload (`250 MHz`, `0.72 V`) | Cycles | Comb Transitions / Cyc ($\alpha_{\text{comb}}$) | Seq Transitions / Cyc ($\alpha_{\text{seq}}$) | `RAMB36E2` Duty (`Rd` / `Wr`) | Dynamic `est_pJ / cycle` | Dynamic `est_mW` (`[low, high]`) |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `100.0%` const-addr / `0%` | **`241.66`** (`53.74` CE-gated) | **`60.41`** (`[47.25, 76.21]`; `13.43` CE-gated) |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21` (`0.0780`) | `90.97` (`0.0044`) | `100.0%` active / `0%` | **`361.68`** | **`90.42`** (`[69.29, 116.04]`) |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84` (`0.1932`) | `269.46` (`0.0130`) | `100.0%` active / `0%` | **`380.07`** | **`95.02`** (`[72.58, 122.60]`) |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31` (`0.0310`) | `74.47` (`0.0036`) | `100.0%` rd / `1.23%` wr (`1/81`) | **`358.86`** | **`89.72`** (`[68.82, 114.89]`) |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `0.0%` (`EN = 0`) / `0%` | **`19.55`** | **`4.89`** (`[3.26, 6.66]`) |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31` (`0.0011`) | `15.27` (`0.0008`) | `3.12%` rd / `0%` | **`20.40`** | **`5.10`** (`[5.04, 5.18]`) |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21` (`0.0030`) | `25.56` (`0.0013`) | `11.13%` rd / `0%` | **`22.07`** | **`5.52`** (`[5.34, 5.75]`) |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95` (`0.0003`) | `71.92` (`0.0036`) | `0.0%` rd / `8.20%` wr | **`21.80`** | **`5.45`** (`[5.30, 5.64]`) |

Three hardware-design findings follow directly from the `VCD` activity decomposition and `DS925` delay model:

1. **Unconditional `RAMB36E2` `ENARDEN` idle precharge (`82.8%` of quiescent core power) and `4.50×` `CE`-gating reduction**: Although `clai_benes_paged_hotswap_core` exhibits `0.00` data transitions/cycle when idle, `clai_uram_lut6_page_cache` ties `ENARDEN = 1'b1` continuously across all `81` `RAMB36E2` blocks, burning `200.07 est_pJ/cycle` (`50.02 est_mW`) in bitline precharge alongside `41.59 est_pJ/cycle` (`10.40 est_mW`) in `FDRE` clock leaves (**`60.41 est_mW`** quiescent). By contrast, `clai_engram_streamer` inside `clai_kv260_axi_top` gates its `4` `RAMB36E2` blocks with `accept_byte && s_axis_tlast`, idling at **`4.89 est_mW`** (`19.55 est_pJ/cycle`) and running steady `31`-byte `AXI4-Stream` packet inference (`core_bus_reg` latched once per packet, $\alpha_{\text{comb}} = 0.0011$) at **`5.10 est_mW`**. Gating `clai_uram_lut6_page_cache`'s `ENARDEN` with `bus_valid` reduces quiescent paged-core dynamic power **`4.50×` to `13.43 est_mW` (`53.74 est_pJ/cycle`)** at zero latency penalty.
2. **Beneš combinational toggle amplification (`2.48×`) vs. `RAMB36E2`-dominated active power (`+5.1%`)**: Switching `page_id` across all `512` slots on consecutive clock cycles (`single_cycle_page_switch_512_burst`) drives `81 × 64 = 5,184` `LUT6` `INIT` bitlines into the selector trees simultaneously, raising combinational transitions `2.48×` (`5,010.2` to `12,406.8` transitions/cycle, `11.80` to `29.22 est_pJ/cycle`), yet total paged-core dynamic power rises by only `+4.60 est_mW` (`90.42` to `95.02 est_mW`, `+5.1%`) because `81 × RAMB36E2` sense-amplifier reads (`307.80 est_pJ/cycle`) account for `85.1%`–`80.9%` of active dynamic energy (`358.86 est_pJ/cycle` / `89.72 est_mW` during concurrent `shadow_page_stream_write`).
3. **Flattened critical-path audit (`81` and `162` `ltp` levels) and `DS925` `-2LV` analytical stage-delay budget**: Applying `AMD DS925` (`xck26-2LV`, `0.72 V`) primitive delays (`T_ILO = 0.068 ns`, `T_CKO = 0.148 ns`, unpipelined `RAMB36E2` `T_RCKO_DO = 1.390 ns` vs. `DOA_REG = 1` `0.610 ns`, plus `[0.140, 0.220] ns/level` interconnect budget) places the unpipelined `81`-level `clai_benes_paged_hotswap_core` path at **`18.76–24.83 est_ns`** (`40.3–53.3 MHz` analytical `est_Fmax`). Flattening `clai_kv260_axi_top` across module boundaries (`ltp -noff` after `-flatten`, vs. `73` levels per hierarchical module in §4.24) exposes a **`162`-level** path (**`34.77–46.92 est_ns`**, `21.3–28.8 MHz`) spanning `core_bus_reg` through `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) and its unrolled `64`-step serial `pop_acc` adder chain. Enabling `RAMB36E2` `DOA_REG = 1`, inserting `4`–`5` pipeline register cuts (`<= 18` logic levels/stage, realized at `13` synchronous levels in `Claim LA-16`), and replacing the serial `64`-input popcount loop with a `6`-level `LUT6`/Wallace compressor brings per-stage analytical delay below **`3.7 est_ns` (`<= 4.000 ns` at `250 MHz`)** at `CPI = 1.0` (`not` Vivado post-PAR timing closure).

---

## 5. Related work and convergence observations

| System | ID / Venue | What it establishes | Cost as reported | Difference in this reference |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Sparse quantized neural layers compiled into FPGA LUTs. | FPGA LUT and Fmax synthesis. | Static wires need Vivado re-PAR on shift vs. `1`-cycle Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Differentiable Boolean gate and weightless LUT networks. | Gate counts and accuracy. | Static routing drops to `52.34%` on VLAN shift and suffers marginal bit-plane chimeras. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Ternary / low-bit matrix products via table lookup on CPU/FPGA. | Latency and FPGA power. | Accelerates linear algebra inside a model gear; does not bypass model invocation. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Sub-1-bit (`0.1–0.58` bits/weight) binary latent factorization via `SVD` / `ITQ` + `5`-epoch QAT. | Compression (`11.6×–31×`), PPL, and QAT accuracy. | Unpacks bitpacks to dense runtime binary MACs and drops to `0.00%` on exact coding (`Claim LA-11`); `Sub1Bit-LUT6` uses `0` binary MACs and `MoL` restores `100.0%` parity in `0` QAT epochs. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Weak-to-strong LLM cascades and preference routers. | API dollar price vs. quality. | Lacks a deterministic $C(z)$ gate (`68.75%` broken commits in `Claim LA-11`) and has no `LUT6` downward compiler. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Multi-LLM bandit routing and frequency-scaled serving. | Authors' GPU Wh (`Zeus` / `pyNVML`). | Optimizes GPU serving; this reference compiles wakes into `0`-FLOP `LUT6` and canonical skill pages (`reported_j` / `est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Neural MLP, draft-tree, and cascade speculative drafters. | Wall-clock speedup. | Require draft FLOPs and weight reads vs. `0`-FLOP `uint64` `LUT6` pages. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Zero-FLOP prompt n-gram and datastore suffix-trie drafters. | Latency speedup (`0` FLOPs). | `PLD` misses off-prompt tokens; `REST` uses variable tries vs. `RAMB36E2` pages. |
| **AirLLM** (lyogavin, 2023) | Open-source SSD streamer | Layer-by-layer SSD weight streaming in small RAM. | Active RAM footprint. | Pure `T=1` (`1.0 tok/sweep`) + KV spill vs. `AirMoL` `2.74×–12.30×` I/O reduction and `970 MB` Metal `INT4` RAM. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit gates (`11,428 pJ` KV260 `INA260` SOM reading), MoL $p_i/c_i$, and `RCE-JEPA`. | KV260 SOM `measured_j` + `reported_j` / `est_j`. | Same-house foundation; extended here with Beneš `LUT6` downward compilation, Metal `Expert-AirMoL`, and `mol-agent`. |

---

## 6. Limits, threats to validity, not claimed, and falsifiers

**Internal and construct validity.** Under uniform random noise or per-step adversarial churn ($\Delta T = 1$), Proposition 1 gives zero downward compilation savings and falls back to `1.00 tok/sweep`. Lossless parity (`100.0%`) guarantees bit-for-bit agreement with greedy target decoding without raising the capability ceiling of a `350M` or `0.8B` base checkpoint.

**Measurement validity and not claimed.** Analytical joule and switching-power numbers (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, and the `Verilator` `VCD` + `AMD DS925` `0.72 V` `est_pJ/cycle` and `est_mW` bounds in §4.22 and §4.25), operating-system / on-chip counter readings (`reported_j` from Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`, plus a narrow-register rollover filter tightened from `450 W` to `175 W`), and whole-machine macOS `PMU` cumulative deltas are kept strictly separate from physical rail measurements (`measured_j = None`). Yosys `0.71+` and Verilator `5.054` establish structural `xck26` netlist synthesis (`41,465` LUTs, `13` single-cycle logic levels, and `170 <= 189` `IOB`s in `CE`-gated `P4-AXIS`), `320/320` `CE` parity, `256/256` zero-bubble `CPI = 1.00` cycle simulation, and `VCD` toggle-rate dynamic switching `est_mW` (`15.59 est_mW` idle, excluding static leakage), not commercial Vivado post-PAR `250 MHz` timing closure and not physical KV260 rail watts (`board_metered = false`). Silicon energy leadership, promotion of `ModelGenerated` outputs to `Deterministic`, and full `500`-task `SWE-bench Verified` container evaluation beyond the `40` real upstream git-worktree evaluations across `django/django`, `pytest-dev/pytest`, `psf/requests`, and `sympy/sympy` (`Claims LA-15, LA-20`), `48`-task contract benchmark (`Claims LA-11, LA-17`), and `16`-task `SWE-Mini` benchmark (`Claim LA-13`) are not claimed (while real `120B-A12B` execution is directly measured in `Claim LA-21`, and only the synthetic cold-NVMe `70B` row in `air_mol_nvme_baselines.csv` remains an analytical projection).

| ID | Claim | Exact Disproof / Falsifier Condition |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` fails `100.0%` Verilator parity across `5,120` packets or misses the packet-`2,500` VLAN shift. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig allocates `> 0` hot-loop heap bytes, Go reports `> 0 allocs/op`, or Julia Enzyme exceeds `1e-7` FD error. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` exceeds `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, or `1` cycle per page switch. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` exceeds target false risk $\alpha = 0.02$ on shifted traffic or stamps `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` yields `< 100.0%` exact byte parity vs. greedy `Mamba3CodeLM` on `48` unseen prompts. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` under `F_NOCACHE` fails `100%` parity or reads more NVMe bytes than `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py`, or `scripts/run_hf_qwen35_air_mol.py` diverges by $\ge 1$ BPE token from greedy target. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` fails any of the `35` tests in `tests/`. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverges from `100%` token parity or reads more NVMe bytes than `AirLLM` or `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` exceeds `1e-3` max error vs. dense `ITQ` binary matmul or fails `100%` verified parity. |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` admits `> 0%` broken commits or admits a stale Wave-1 skill under Wave-2 spec mutation. |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` exceeds `1e-4` `FP32` shader error or diverges from `100%` greedy token parity on `8.5B` or `35B`. |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` admits `> 0%` broken patches, alters `tests/`, or misses the Wave-2 `R03` spec mutation. |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` fails OpenAI REST/SSE, `MCP` `JSON-RPC 2.0`, `.mol/` reload, or stamps `measured_j`. |
| **`LA-F15`** | `Claim LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` fails Parquet `SHA`-256 verification, exposes gold solutions/patches, or admits `> 0%` broken outputs. |
| **`LA-F16`** | `Claim LA-16` (`250 MHz` `xck26` RTL) | `scripts/verify_pipelined_250mhz_rtl.py` exceeds `20` single-cycle logic levels, exceeds `189` `IOB`s on `P4-AXIS`, uses `> 0` `DSP48`s, or fails `256/256` `CPI = 1.00` Verilator parity. |
| **`LA-F17`** | `Claim LA-17` (`Rung 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` admits `> 0%` broken commits, calls cloud APIs, or fails to raise verified pass rate above `87.50%`. |
| **`LA-F18`** | `Claim LA-18` (Rust `CubeCL` MoE) | `cargo run --release --bin bench_cubecl_moe_deltanet` exceeds `1e-4` `FP32` error on `LLVM` `CPU` or `Metal` `GPU`, or achieves `< 25×` Metal speedup. |
| **`LA-F19`** | `Claim LA-19` (`6`-Kernel `Lean 4.36.0` proofs) | `scripts/verify_lean_proofs.py` or `lake check --paranoid` fails any of the `6` independent kernels (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker`, `lean`), contains `>= 1` `sorry` / `opaque` / `ofReduceBool`, or adds `>= 1` custom axiom. |
| **`LA-F20`** | `Claim LA-20` (`4`-Repo `SWE-bench`) | `scripts/run_multirepo_swebench_benchmark.py` exposes `patch`, evaluates `< 4` repositories, admits `> 0%` broken patches, or fails to exceed standalone `24B`/`35B`. |
| **`LA-F21`** | `Claim LA-21` (`120B` Hybrid MoE) | `scripts/run_120b_hybrid_moe_benchmark.py` fails local `120B-A12B` execution, admits `> 0%` broken commits, or records `0%` Wave-2 `.mol/` fast-path hits. |
| **`LA-F22`** | `Claim LA-22` (`CE`-Gated `VCD` Power) | `scripts/verify_ce_gated_vcd_power.py` fails `320/320` `CE` parity, exceeds `189` `IOB`s, or achieves `< 3.5×` idle dynamic power reduction. |
| **`LA-F23`** | `Claim LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` requires Python for `/v1` or `/mcp`, fails `--mcp-stdio`, or achieves `< 10×` speedup vs. Python `MCP`. |

---

## 7. References

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90–106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>Google Gemma Team (2026). <code>google/gemma-4-E2B-it</code> On-Device Hybrid Instruction Model Card (2026). <a href="https://huggingface.co/google/gemma-4-E2B-it">huggingface.co/google/gemma-4-E2B-it</a>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR 2024</em>, <em>arXiv:2310.06770</em>.</li>
<li>Lee, H., Kim, M., Baek, S., Kim, J., Hwang, S., Shin, J., Lee, J., and Kim, E. (2025). LittleBit: Ultra Low-Bit Quantization via Latent Matrix Factorization. <em>NeurIPS 2025</em>, <em>arXiv:2506.13771</em>.</li>
<li>Lee, H., and Kim, E. (2026). LittleBit-2: Pushing the Frontier of Extreme LLMs Quantization into 0.1-Bit (<code>SamsungLabs/LittleBit</code>). <em>ICML 2026</em>, <em>arXiv:2603.00042</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455–1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094–1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026a). <code>LiquidAI/LFM2.5-350M</code> and <code>LiquidAI/LFM2.5-8B-A1B</code> Hybrid and Sparse-MoE Open-Weights Model Cards. <a href="https://huggingface.co/LiquidAI/LFM2.5-8B-A1B">huggingface.co/LiquidAI/LFM2.5-8B-A1B</a>.</li>
<li>Liquid AI (2026b). <code>LiquidAI/LFM3-1.7B</code> Tri-Hybrid Open-Weights Model Card (October 23, 2026). <a href="https://huggingface.co/LiquidAI/LFM3-1.7B">huggingface.co/LiquidAI/LFM3-1.7B</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026a). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Qwen Team (2026b). <code>Qwen/Qwen3.6-35B-A3B</code> Sparse-MoE Hybrid Gated DeltaNet + Attention Model Card (2026). <a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B">huggingface.co/Qwen/Qwen3.6-35B-A3B</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235–247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119–1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159–163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2024). BigCodeBench: Benchmarking Code Generation with Diverse Function Calls and Complex Instructions. <em>ICLR 2025</em>, <em>arXiv:2406.15877</em>.</li>
<li>Moura, L. de, and Ullrich, S. (2021). The Lean 4 Theorem Prover and Programming Language. <em>CADE 28</em>, <em>LNCS</em> 12699:625–635.</li>
<li>NVIDIA (2026). <code>nvidia/Nemotron-3-Super-120B-A12B</code> Hybrid Mamba-Attention Sparse-MoE Open-Weights Model Card. <a href="https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16">huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16</a>.</li>
<li>Mistral AI (2025). <code>mistralai/Devstral-Small-2-24B-Instruct-2512</code> Open-Weights Software Engineering Model Card. <a href="https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512">huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512</a>.</li>
</ol>

---

## Appendix A. Reproducibility

From a checkout of [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 86d0ab5`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd proofs && lake build) && PYTHONPATH=src .venv/bin/python scripts/verify_lean_proofs.py
PYTHONPATH=src .venv/bin/python scripts/run_multirepo_swebench_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_120b_hybrid_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/verify_ce_gated_vcd_power.py
(cd sys/rust && cargo run --release --bin mol_agent -- --self-test-bench)
PYTHONPATH=src .venv/bin/python scripts/run_external_public_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_pipelined_250mhz_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_rung3d_thinking_ceiling.py
(cd sys/rust && cargo test --release && cargo run --release --bin bench_cubecl_moe_deltanet)
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_lfm3_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_moe_8b_35b_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_sub1bit_lut_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
