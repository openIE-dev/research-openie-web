---
title: "Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and Frontier Sparse-MoE NVMe Streaming"
deck: "A Mixture of Limits cascade that tries zero-floating-point-operation (FLOP) paged 6-input look-up table (LUT6) circuits first, streams 4-bit Non-Volatile Memory Express (NVMe) hybrid and sparse Mixture-of-Experts (MoE) late-2026 models up to 34.66B parameters via custom Apple Metal Shading Language (MSL) shaders only on misses, gates commits via deterministic verifiers, and compiles certified wakes downward into Beneš-routed 36-Kbit Block RAM (RAMB36E2) and canonical skill pages. Wall-clock times, unbuffered Darwin F_NOCACHE (unbuffered file read) byte counts, active random-access memory (RAM down to 970.0 megabytes = 1.47% of 16-bit floating-point weights on 34.66B), dual-channel Apple M5 Max on-chip energy counters (reported_j), analytical energy estimates (est_j), and Yosys/Verilator xck26 register-transfer-level (RTL) simulations are reported from openIE-dev/lut-adapt-ai at commit af152ba; no isolated board rail power was measured (measured_j unset)."
id: lut-adapt
status: "Research study · draft"
author: "David Charlot, Open Interface Engineering"
figures: "/living/lut-adapt/"
pdf: "/pdfs/lut-adapt.pdf"
board_metered: false
---

# Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and Frontier Sparse-MoE NVMe Streaming

*{{revision}}. Reference implementation and artifacts: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) at [`af152ba2e63b5c55bcfad9b2fa41e675e8e3946c`](https://github.com/openIE-dev/lut-adapt-ai/tree/af152ba2e63b5c55bcfad9b2fa41e675e8e3946c). Data summary: [/data/#lut-adapt](/data/#lut-adapt). LaTeX PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

## 0. Overview

This study examines how a computing system can compile repeated neural-model work downward into fast Boolean table lookups and certified canonical skills without losing exact output parity or promoting unverified guesses into trusted rules. It reports software and unbuffered input/output measurements, register-transfer-level synthesis and cycle simulations, dual-channel operating-system / on-chip energy counter readings (`reported_j` on Apple M5 Max and Linux Running Average Power Limit counters), and labeled analytical energy estimates (`est_j`). No wall or rail joule monitor was attached in this repository (`measured_j` is unset; `board_metered` is false).

**In plain words**

1. Most inputs a deployed system sees repeat patterns it has already solved, so running a full floating-point neural network on every step wastes compute and memory bandwidth.
2. The reference places a reconfigurable 6-input truth-table (`LUT6`) lookup tier ahead of streaming state-space and foundation models, and compiles answers downward into lookup memory pages only after an explicit check certifies them.
3. When late-2026 hybrid and sparse mixture-of-experts language models up to `34.66B` parameters stream 4-bit weights from solid-state storage through custom fused Apple Metal shaders, router-sparse expert reads paired with that zero-FLOP `LUT6` drafter cut disk reads by up to `12.30×` and hold `Qwen/Qwen3.6-35B-A3B` in `970.0` megabytes of active weight memory (`1.47%` of its `66.11`-gigabyte 16-bit floating-point footprint) at `6.773 J/tok` on-chip `reported_j` with zero change to the output tokens; gating code and multi-file git-repository commits behind deterministic `pytest` checks reaches **`87.50%` verified pass rate** across both a `48`-task (`16` specs × `3` waves) frontier coding bakeoff and a `16`-task (`8` git repos × `2` waves) repository patching benchmark with **`0.00%` broken commits admitted**, accelerating crystallized Wave-3 solves by **`15,401×`** (`2.89 ms`, `0.0424 J` `reported_j`).

## 1. Terms, acronyms, and measurement labels

<ul id="terms">
<li>MoL: Mixture of Limits, the cascade rule from Metered Commit Gates Part II [same house]</li>
<li>LA: claim and falsifier prefix (LA-1 to LA-14, LA-F1 to LA-F14) used in this study</li>
<li>LUT, LUT6, INIT: look-up table, 6-input Xilinx UltraScale+ Boolean primitive, and its 64-bit truth-table initialization mask</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, the 36-Kbit dual-port UltraScale+ Block RAM primitive (144 on xck26), and UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: configurable logic block, flip-flop, digital signal processing slice, and AMD Kria KV260 board (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, and Field-Programmable Logic conference</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3: Advanced eXtensible Interface, Zynq processing system, programmable logic, system-on-module, onboard power monitor IC, supply rail, Intel Running Average Power Limit, NVIDIA Management Library, macOS power management unit, Apple System Management Controller, level-2 subsystem energy counter (Apple IOReport GPU Energy), and level-3 per-process CPU energy counter (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, and context-free grammar</li>
<li>HC, SOINN, WNN, DWN: hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, and Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, and Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M and LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B), and HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: singular value decomposition, Iterative Quantization Procrustes hypercube rotation, sign-value-independent decomposition, quantization-aware training, post-training quantization, perplexity, and signal-to-noise ratio</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB, GiB: Non-Volatile Memory Express storage, Darwin F_NOCACHE unbuffered file flag, Portable Operating System Interface, random-access memory, dynamic RAM, static RAM, input/output, kilobyte, megabyte, gigabyte, and gibibyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS: floating-point operation(s), million FLOPs, multiply-accumulate operation(s), single-instruction multiple-data, automatic differentiation, finite difference, bits per byte, brain float 16, 16/32-bit IEEE floating point, 4-bit integer, unit in the last place, Apple Metal Shading Language, and PyTorch Metal Performance Shaders</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], verified completion, and software-engineering benchmark prefix</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: command-line interface, Hypertext Transfer Protocol and its GET/POST request methods, Server-Sent Events, application programming interface, Model Context Protocol, remote procedure call (JSON-RPC 2.0), integrated development environment, software development kit, Cross-Origin Resource Sharing, academic computer-science/engineering venues, operating system, central/graphics processing unit, software, and thermal design power</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: virtual local-area network (IEEE 802.1Q), Transport Layer Security, deep packet inspection, abstract syntax tree, JavaScript Object Notation, comma-separated values, Secure Hash Algorithm, cyclic redundancy check, Asynchronous Transfer Mode (CRC-8/ATM), Request for Comments, Structured Query Language, DWARF signed little-endian base-128 encoding, content-addressable memory, exclusive-NOR, JSON Web Token, hash-based message authentication code, directed acyclic graph, Classless Inter-Domain Routing, least-recently-used cache, time-to-live expiration, write-ahead log, and extract-transform-load pipeline</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD: Joint Test Action Group debug port, Xilinx Software Command-Line Tool debugger, Debug Access Port, Universal Serial Bus, Future Technology Devices International and its FT2232C dual UART/FIFO bridge IC, universal asynchronous receiver-transmitter, first-in first-out buffer, integrated circuit, electronic design automation, out-of-context synthesis mode, Advanced Microcontroller Bus Architecture, AXI4-Lite/AXI4-Stream interconnect, input/output block, input/output buffers, synchronous-reset/set D flip-flops, 1-to-5-input UltraScale+ look-up tables, 7/8-input UltraScale+ multiplexers, 4-bit fast carry chain, UltraScale+ DSP slice, 288-Kbit UltraRAM, and Advanced Micro Devices</li>
</ul>

Four evidence classes stay separate across every table below:

| Evidence label | Meaning in this study |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Exact byte counts read or written via `os.pread` under Darwin `F_NOCACHE`, resident memory allocations, wall-clock seconds, whole-machine macOS `PMU` (`AppleSmartBattery.PowerTelemetryData`) cumulative energy deltas on Apple M5 Max, and exact bit/token agreement. `measured_j` is unset (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Unprivileged operating-system and on-chip telemetry counters: on Apple M5 Max (`joule_meter.py`), dual-channel `libIOReport.dylib` `"Energy Model"` `'GPU Energy'` (`L2` nanosecond-resolution `nJ`) plus `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` per-process CPU `nJ`); on `x86-64` Linux (in the `xck26` EDA synthesis audit below), `RAPL` `package-0` joules. Never merged with `measured_j` (`None`). |
| **`Simulated (RTL)`** | Structural netlist counts from Yosys `0.71+` (`synth_xilinx -family xcup` targeting Kria KV260 `xck26`) and cycle counts (`CPI = 1`) from Verilator `5.054`. Not Vivado timing closure and not board power (`board_metered = false`). |
| **`Estimated (est_j)`** | Analytical joules computed from operation counts or thermal-design-power time stand-ins (`joule_meter.py`). Comparable only across arms inside the same formula; never silicon watts. |

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
2. **Non-blocking $512 \times 512$ Beneš–Copy–Beneš and `81`-`RAMB36E2` RTL architecture**: Eliminates both the `102.0%` Kria KV260 logic overflow of flat crossbars (`119,478` LUTs) and the `926,619`-LUT explosion of flip-flop page multiplexers, synthesizing to `41,186` UltraScale+ CLB LUTs (`35.2%` of `xck26`), `81` `RAMB36E2` blocks (`56.2%`), and `0` `DSP48` slices with `1`-cycle (`4.0 ns` at `250 MHz` nominal) page switching in simulation.
3. **Universal $\le 64$-bit joint-mode minterm synthesis**: Shows joint-mode minterm lookup dominates marginal bit-plane DiffLogic rounding on correlated branches and packs $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ subword tokens into one `uint64` word (`16b × 4 = 64b` for `|V| = 65,536`; `17b × 3 = 51b` for `|V| = 128,000`; `18b × 3 = 54b` for `|V| = 248,320`).
4. **Oracle-free Split-Conformal + Online ACI crystallization gate**: Pairs a radially regularized latent `JEPA-EBRM` nonconformity score with Split Conformal calibration and Adaptive Conformal Inference (Gibbs and Candès, 2021), recording `0.00%` false crystallization risk and `1.0000` OOD AUROC on shifted traffic where softmax and MC-Dropout baselines record `17.62%–24.28%` false risk.
5. **Custom Apple Metal `INT4` Sparse-MoE & `GatedDeltaNet` shaders + `AirMoL` / `Expert-AirMoL` up to `34.66B`**: Combines Darwin `F_NOCACHE` `os.pread` 4-bit sharding, custom `MSL` `q4_moe_*` (`43.45×` faster) and `gated_delta_recurrent_k128` (`20.66×` faster) compute shaders, Queue-Depth-`8` parallel `pread`, and `BenesLUT6` burst speculation across October 2026 `LiquidAI/LFM3-1.7B` (`2.74×` NVMe reduction in `3.79%` FP32 RAM), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` RAM, `3.493 J/tok` `reported_j`), and `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe reduction**, **`970.0 MB` RAM = `1.47%` of FP16**, **`6.773 J/tok` `reported_j`**, **`15.7 tok/s`** Unified-Memory `Q4`) at `100.0%` exact token parity.
6. **Zero-MAC `Sub1Bit-LUT6` vs. `LittleBit`, `87.50%` verifier-gated frontier coding & `SWE-Mini` git-repo cascades, and OpenAI / `MCP` `mol-agent`**: Replaces the `1.98M` runtime binary MACs of `LittleBit-1 / LittleBit-2` (`0.576` bits per weight; Lee et al., 2025; Lee and Kim, 2026) with zero-MAC `6`-input `LUT6` partial-sum lookup (`< 4 × 10⁻⁶` error, `100.0%` parity under `MoL` target verification in `0` QAT epochs), achieves **`87.50%` (`42 / 48`) verified pass** (`0.00%` broken commits, `22.92%` `35B` calls, `2.89 ms` / `0.0424 J` `reported_j` Wave-3 crystallized replay = `15,401×` faster than `35B`) on a `48`-task late-2026 coding bakeoff and **`87.50%` (`14 / 16`)** (`0.00%` broken patches) on a `16`-task (`8` multi-file git repos × `2` waves) `SWE-Mini` `pytest` benchmark, and exposes a drop-in OpenAI `/v1/chat/completions` + `MCP` (`JSON-RPC 2.0`) `mol-agent` server (`26 / 26` `pytest` tests passing).

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

`src/clai/service/openai_mcp_agent.py` and `scripts/mol_agent_server.py` (`mol-agent` CLI entrypoint) expose the cascade to `IDE` and terminal coding tools (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, OpenAI `SDK`) with zero third-party web dependencies: (i) OpenAI-compatible `GET /v1/models` and `POST /v1/chat/completions` (`stream: true/false` `SSE`, CORS headers, optional `x_mol_contract` deterministic verifier, and `x_mol_receipt` reporting rung, `skill_id`, `est_j`, `reported_j`, `measured_j: null`); and (ii) Model Context Protocol (`MCP` `JSON-RPC 2.0` over `--mcp-stdio` and `POST /mcp`) exposing `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill`, and `mol_energy_telemetry` backed by persistent `.mol/skills_v1.json` + `.mol/benes_lut6_router.npz` (`26 / 26` `pytest` tests passing).

### 4.15 `xck26-sfvc784-2LV-c` Full-Subsystem Primitive Breakdown, Topological Depth, and `Vivado 2026.1` Hardware Probe

To audit both the standalone `512`-page speculative core (`clai_benes_paged_hotswap_core` in `hw/kv260/rtl/clai_benes_hotswap_core.sv`) and the complete Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 subsystem (`clai_kv260_axi_top` in `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv`, and `artifacts/clai_rung0_kv260.v` at commit `a5e9bc1de280`, unchanged in `af152ba`) against the exact AMD Kria KV260 part (`xck26-sfvc784-2LV-c`: `117,120` CLB LUTs, `234,240` CLB flip-flops, `144` `RAMB36E2` blocks, `64` 288-Kbit UltraRAM (`URAM288`) blocks, `1,248` UltraScale+ digital signal processing (`DSP48E2`) slices, and `189` user input/output blocks (`IOB`s)), three hardware and electronic design automation (`EDA`) checks were executed on an `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) workstation:

1. **Read-only Joint Test Action Group (`JTAG`) & Universal Serial Bus (`USB`) probe (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: Although `lsusb` reported an attached Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` dual universal asynchronous receiver-transmitter (`UART`) / first-in first-out (`FIFO`) integrated circuit (`IC`)) bridge, inspecting Linux `sysfs` USB vendor/product strings (`idVendor = 0403`, `idProduct = 6010`) identified the device as `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` rather than a Kria KV260 carrier. Querying `hw_server v2026.1` (Build May 29, 2026) via `xsdb` (`connect; jtag targets; targets`) returned **`0` Xilinx `JTAG` devices and `0` Debug Access Port (`DAP`) targets** (`board_metered = false`, `measured_j = None`).
2. **`Vivado 2026.1` batch synthesis and licensing gate (`SW Build 6511674`)**: A reproducible low-footprint non-project batch script (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, targeting `xck26-sfvc784-2LV-c` at `250.0 MHz` / `4.000 ns` in out-of-context (`OOC`) mode) was staged against `/tools/Xilinx/2026.1/Vivado/bin/vivado`. Launching `vivado v2026.1` in batch mode exited prior to `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), because AMD `Vivado 2025.1+` / `2026.1` requires an explicit user-generated Standard/Enterprise `.lic` file (`~/.Xilinx/Xilinx.lic` or `XILINXD_LICENSE_FILE`) even for Standard-tier `xck26` parts and zero `.lic` files were installed on the workstation. Per strict measurement rules, post-route `WNS`, placed-and-routed maximum clock frequency, and vectorless `report_power` (`est_j`) remain recorded as `not_available` until a Standard `.lic` file is provisioned.
3. **Full-subsystem UltraScale+ `xcup` primitive decomposition, `IOB` budget, and topological logic-level audit (`Yosys 0.71+`)**: Synthesizing both `clai_benes_paged_hotswap_core` and `clai_kv260_axi_top` via `synth_xilinx -family xcup` and `ltp -noff` (while recording host `RAPL package-0` `reported_j` strictly as `x86-64` `EDA` compilation cost $E_{\text{compile}}$, never as FPGA silicon power) established exact cell counts and critical-path combinational depths:

| `xck26-sfvc784-2LV-c` Target Module | CLB LUTs (`% xck26`) | Dominant LUT Primitives | CLB Registers (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Top Ports (`IBUF`+`OBUF`) | Combinational Depth (`ltp`) | Host Synth `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` pages) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / internal bus) | **`81` levels** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 subsys) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS–PL`) | **`73` levels** | `10,089.4 J` (`214.8 s`) |

Two concrete physical design constraints emerge from the `xcup` primitive and `ltp` audit:
- **Pin-budget confinement (`OOC` vs. `PS–PL` `AXI` wrapper)**: Because `clai_benes_paged_hotswap_core` exposes the raw `512`-bit `CodeBitBus` and wide shadow-configuration vectors (`1,379` input buffers (`IBUF`) + `220` output buffers (`OBUF`) = `1,599` ports vs. `189` package `IOB`s on `xck26-sfvc784-2LV-c`), standalone vendor implementation must run with `synth_design -mode out_of_context` or inside an `AXI4-Stream` / `zynq_ultra_ps_e` wrapper such as `clai_kv260_axi_top` (`126` ports, `57.52%` LUT utilization).
- **Unpipelined combinational depth (`81` and `73` levels) vs. `250 MHz` (`4.000 ns`) `-2LV` closure**: While Verilator `5.054` verifies cycle-accurate `CPI = 1.0` (`1` lookup per clock cycle), traversing `17` `Beneš-1` stages + `9` prefix-copy stages + `17` `Beneš-2` stages + dynamic `LUT6` truth-table multiplexing + `5`-voter majority reduction in a single combinational cycle spans **`81` primitive levels** (`73` levels in `clai_kv260_axi_top`'s combinational `64`-input popcount and `8`-class margin comparator). Closing `250 MHz` (`4.000 ns`) post-place-and-route on low-voltage (`0.72 V`) `-2LV` silicon therefore favors inserting `2` to `3` pipeline register stages across $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ (and `1` register stage between the `64`-wire popcount tree and top-`2` comparator), preserving `CPI = 1.0` throughput (`1` context per clock) at `3`–`4` cycles of pipeline latency.

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

**Measurement validity and not claimed.** Analytical joule numbers (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`), operating-system / on-chip counter readings (`reported_j` from Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`, plus a `> 450 W` narrow-register rollover filter documented in `Claim LA-11`), and whole-machine macOS `PMU` cumulative deltas are kept strictly separate from physical rail measurements (`measured_j = None`). Yosys `0.71+` and Verilator `5.054` establish structural `xck26` netlist synthesis and `CPI = 1` cycle simulation, not Vivado post-PAR `250 MHz` timing closure and not physical KV260 rail watts (`board_metered = false`). Silicon energy leadership, promotion of `ModelGenerated` outputs to `Deterministic`, full `500`-task `SWE-bench Verified` container evaluation beyond the `48`-task contract benchmark (`Claim LA-11`) and `16`-task multi-file git-repository `SWE-Mini` `pytest` benchmark (`Claim LA-13`), and measured `70B` runs (`air_mol_nvme_baselines.csv` reports analytical `70B` projections beyond the measured `34.66B` `Qwen3.6-35B-A3B` runs) are not claimed.

| ID | Claim | Exact Disproof / Falsifier Condition |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` fails `100.0%` Verilator parity across `5,120` packets or misses the packet-`2,500` VLAN shift. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig allocates `> 0` hot-loop heap bytes, Go reports `> 0 allocs/op`, or Julia Enzyme exceeds `1e-7` FD error. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` exceeds `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, or `1` cycle per page switch. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` exceeds target false risk $\alpha = 0.02$ on shifted traffic or stamps `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` yields `< 100.0%` exact byte parity vs. greedy `Mamba3CodeLM` on `48` unseen prompts. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` under `F_NOCACHE` fails `100%` parity or reads more NVMe bytes than `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py`, or `scripts/run_hf_qwen35_air_mol.py` diverges by $\ge 1$ BPE token from greedy target. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` fails any of the `26` tests in `tests/`. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverges from `100%` token parity or reads more NVMe bytes than `AirLLM` or `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` exceeds `1e-3` max error vs. dense `ITQ` binary matmul or fails `100%` verified parity. |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` admits `> 0%` broken commits or admits a stale Wave-1 skill under Wave-2 spec mutation. |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` exceeds `1e-4` `FP32` shader error or diverges from `100%` greedy token parity on `8.5B` or `35B`. |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` admits `> 0%` broken patches, alters `tests/`, or misses the Wave-2 `R03` spec mutation. |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` fails OpenAI REST/SSE, `MCP` `JSON-RPC 2.0`, `.mol/` reload, or stamps `measured_j`. |

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
</ol>

---

## Appendix A. Reproducibility

From a checkout of [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit af152ba`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
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
