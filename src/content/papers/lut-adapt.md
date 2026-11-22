---
title: "Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and 4-Bit NVMe Layer Streaming"
deck: "A four-rung Mixture of Limits cascade that tries zero-floating-point-operation (FLOP) paged 6-input look-up table (LUT6) circuits first, wakes Mamba-3 and 4-bit Non-Volatile Memory Express (NVMe) streamed 2026 hybrid models only on misses, and compiles certified wakes downward into Beneš-routed 36-Kbit Block RAM (RAMB36E2) pages. Wall-clock times, unbuffered Darwin F_NOCACHE (unbuffered file read) byte counts, active random-access memory (RAM), and Yosys/Verilator xck26 register-transfer-level (RTL) simulations are reported from openIE-dev/lut-adapt-ai at commit 9dbf745. Energy figures are analytical est_j estimates; no board power was measured."
id: lut-adapt
status: "Research study · draft"
author: "David Charlot, Open Interface Engineering"
figures: "/living/lut-adapt/"
pdf: "/pdfs/lut-adapt.pdf"
board_metered: false
---

# Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and 4-Bit NVMe Layer Streaming

*{{revision}}. Reference implementation and artifacts: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) at [`9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0`](https://github.com/openIE-dev/lut-adapt-ai/tree/9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0). Data summary: [/data/#lut-adapt](/data/#lut-adapt). LaTeX PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

## 0. Overview

This study examines how a computing system can compile repeated neural-model work downward into fast Boolean table lookups without losing exact output parity or promoting unverified guesses into trusted rules. It reports software measurements, register-transfer-level synthesis and cycle simulations, and labeled analytical energy estimates (`est_j`). No wall or rail joule monitor was attached in this repository (`measured_j` is unset; `board_metered` is false).

**In plain words**

1. Most inputs a deployed system sees repeat patterns it has already solved, so running a full floating-point neural network on every step wastes compute and memory bandwidth.
2. The reference places a reconfigurable 6-input truth-table (`LUT6`) lookup tier ahead of streaming state-space and foundation models, and compiles answers downward into lookup memory pages only after an explicit check certifies them.
3. When a 2026 hybrid language model streams its weights layer-by-layer from a solid-state drive, that zero-FLOP `LUT6` drafter proposes multi-token bursts that the target model verifies in one disk sweep, cutting disk reads by nearly `3×` with zero change to the output tokens.

## 1. Terms, acronyms, and measurement labels

<ul id="terms">
<li>MoL: Mixture of Limits, the cascade rule from Metered Commit Gates Part II [same house]</li>
<li>LA: claim and falsifier prefix (LA-1 to LA-8, LA-F1 to LA-F8) used in this study</li>
<li>LUT, LUT6, INIT: look-up table, 6-input Xilinx UltraScale+ Boolean primitive, and its 64-bit truth-table initialization mask</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, the 36-Kbit dual-port UltraScale+ Block RAM primitive (144 on xck26), and UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: configurable logic block, flip-flop, digital signal processing slice, and AMD Kria KV260 board (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, and Field-Programmable Logic conference</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, Zynq processing system, programmable logic, system-on-module, onboard power monitor IC, supply rail, Intel Running Average Power Limit, and NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, and context-free grammar</li>
<li>HC, SOINN, WNN, DWN: hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, and Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, and Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M), and HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: Non-Volatile Memory Express storage, Darwin F_NOCACHE unbuffered file flag, Portable Operating System Interface, random-access memory, dynamic RAM, static RAM, input/output, kilobyte, megabyte, and gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: floating-point operation(s), million FLOPs, multiply-accumulate, single-instruction multiple-data, automatic differentiation, finite difference, bits per byte, 16/32-bit floating point, and 4-bit integer</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], verified completion, and software-engineering benchmark prefix</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: command-line interface, Hypertext Transfer Protocol, Server-Sent Events, application programming interface, Association for Computational Linguistics, operating system, central/graphics processing unit, and software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: virtual local-area network (IEEE 802.1Q), Transport Layer Security, deep packet inspection, abstract syntax tree, JavaScript Object Notation, comma-separated values, Secure Hash Algorithm, content-addressable memory, and exclusive-NOR</li>
</ul>

Three evidence classes stay separate across every table below:

| Evidence label | Meaning in this study |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Exact byte counts read or written via `os.pread` under Darwin `F_NOCACHE`, resident memory allocations, wall-clock seconds on Apple M5 Max, and exact bit/token agreement. `measured_j` is unset (`None`). |
| **`Simulated (RTL)`** | Structural netlist counts from Yosys `0.71+` (`synth_xilinx -family xcup` targeting Kria KV260 `xck26`) and cycle counts (`CPI = 1`) from Verilator `5.054`. Not Vivado timing closure and not board power (`board_metered = false`). |
| **`Estimated (est_j)`** | Analytical joules computed from operation counts or thermal-design-power time stand-ins (`joule_meter.py` fallback when `RAPL`/`NVML` hardware counters are absent on macOS). Comparable only across arms inside the same formula; never silicon watts. |

### 1.1 Architectural background and contributions

In [Metered Commit Gates](/papers/gates/) `[same house]`, Part II defines **Mixture of Limits**: try gears in decreasing order of pass probability per joule $p_i / c_i$ (Simon and Kadane, 1975), stop as soon as the task completion predicate $C(z) = 1$ holds, and forbid strengthening `ModelGenerated` output into `Deterministic`. A static Lookup tier, however, covers only the entries written into it before deployment. Conversely, existing lookup-table neural networks — LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022), and Differentiable Weightless Neural Networks (Bacellar et al., 2024) — fix wire connectivity inside static FPGA routing, requiring vendor place-and-route whenever the input distribution shifts.

The `lut-adapt-ai` reference closes the loop between the top and bottom of the cascade via **online downward `LUT6` compilation**:

- **Rung 0 (Lookup — Paged Beneš + `LUT6`)**: Evaluates 64-bit truth-table masks routed through a non-blocking $512 \times 512$ **Beneš–Copy–Beneš** multicast switch and cached across $81 \times \texttt{RAMB36E2}$ dual-port block memories (`0` floating-point operations, single-cycle page switching in Verilator simulation).
- **Rung 1 (Stream — `Mamba-3` Complex MIMO State Space Duality)**: Handles misses that depend on sequence history using a constant-size $O(1)$ recurrent state (`48 KB` pinned memory in the `14.3M`-parameter reference), avoiding $O(L)$ key-value cache growth.
- **Rung 2 (Topology — `HC-SOINN`)**: Maintains online prototype topology over latent embeddings, isolating regime boundaries and tripping a circuit breaker (`Refuse` / escalate) when unlabeled distribution shift arrives.
- **Rung 3 (Model last — `JEPA-EBRM` and `AirMoL` 4-Bit NVMe Streaming)**: Invokes latent energy-based verification or layer-streamed pretrained 2026 foundation models (`LiquidAI/LFM2.5-350M` and `Qwen/Qwen3.5-0.8B-Base`) only when cheaper rungs abstain or require exact target verification.
- **Downward `SleepCrystallizer`**: Extracts recurring wake traces using Walsh–Hadamard spectral warm-starts, joint-mode minterm truth tables, and Waksman switch schedules, flipping shadow block-memory banks without halting inference or running FPGA place-and-route.

### 1.2 Contributions

1. **Amortized downward compilation condition**: Extends the Simon–Kadane $p_i/c_i$ ordering with an explicit compilation cost $E_{\text{compile}}$ over stationary horizon $\Delta T$.
2. **Non-blocking $512 \times 512$ Beneš–Copy–Beneš and `81`-`RAMB36E2` RTL architecture**: Eliminates both the `102.0%` Kria KV260 logic overflow of flat crossbars (`119,478` LUTs) and the `926,619`-LUT explosion of flip-flop page multiplexers, synthesizing to `41,186` UltraScale+ CLB LUTs (`35.2%` of `xck26`), `81` `RAMB36E2` blocks (`56.2%`), and `0` `DSP48` slices with `1`-cycle (`4.0 ns` at `250 MHz` nominal) page switching in simulation.
3. **Universal $\le 64$-bit joint-mode minterm synthesis**: Shows joint-mode minterm lookup dominates marginal bit-plane DiffLogic rounding on correlated branches and packs $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ subword tokens into one `uint64` word (`16b × 4 = 64b` for `|V| = 65,536`; `18b × 3 = 54b` for `|V| = 248,320`).
4. **Oracle-free Split-Conformal + Online ACI crystallization gate**: Pairs a radially regularized latent `JEPA-EBRM` nonconformity score with Split Conformal calibration and Adaptive Conformal Inference (Gibbs and Candès, 2021), recording `0.00%` false crystallization risk and `1.0000` OOD AUROC on shifted traffic where softmax and MC-Dropout baselines record `17.62%–24.28%` false risk.
5. **`AirMoL` zero-extra-sweep 4-bit NVMe streaming on 2026 hybrid models**: Combines Darwin `F_NOCACHE` `os.pread` 4-bit group-quantized layer streaming with in-RAM hybrid state rollback and online token-`LUT6` burst speculation on `LiquidAI/LFM2.5-350M` (March 2026) and `Qwen/Qwen3.5-0.8B-Base` (February 2026), cutting NVMe disk reads by `2.86×` and `2.74×` at `100.0%` exact token parity while keeping active weight RAM at `8.45%–9.47%` of FP32 model size.
6. **Polyglot systems suite and live HTTP/SSE server**: Cross-checks the cascade across Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme, and `mol_code_cli.py`.

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

*Figure 3. `AirMoL` zero-extra-sweep 4-bit NVMe layer streaming with universal `≤64`-bit token `LUT6` speculation on `LiquidAI/LFM2.5-350M` and `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Interactive explorer](/living/lut-adapt/#la-run-01).*

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

### 4.7 Claim LA-7: Pretrained 2026 hybrid models under `AirMoL` (`LFM2.5-350M` & `Qwen3.5-0.8B-Base`)

| 2026 Checkpoint & Arm | Parity | Tok / Sweep | Chars / Sweep | Sweeps | NVMe Read | Peak Active RAM (`% FP32`) | `tok/s` | Evidence Class |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Measured (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Measured (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Post-Wake** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Measured (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Measured (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Measured (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Measured (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Measured (`F_NOCACHE`)** |

Note the preserved trade-off on `Qwen3.5-0.8B-Base` cold unseen prompts: `AirMoL` reduces NVMe disk reads from `12.674 GB` to `8.581 GB`, yet CPU Gated DeltaNet batch verification of `4` tokens lowers wall-clock throughput (`0.32` vs. `0.53 tok/s`) until online wake-to-`LUT6` crystallization raises acceptance to `2.74 tok/sweep` (`4.621 GB` read, `1.11 tok/s`).

### 4.8 Claim LA-8: Live CLI and HTTP/SSE streaming server (`mol_code_cli.py`)

`scripts/mol_code_cli.py` serves `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` and `--air-nvme` over CLI and SSE endpoints (`/v1/health`, `/v1/complete`, `/v1/crystallize`), advancing `RAMB36E2` slot residency from `438/512` to `460/512` live with `18/18` passing `pytest` suites.

---

## 5. Related work and convergence observations

| System | ID / Venue | What it establishes | Cost as reported | Difference in this reference |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Sparse quantized neural layers compiled into FPGA LUTs. | FPGA LUT and Fmax synthesis. | Static wires need Vivado re-PAR on shift vs. `1`-cycle Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Differentiable Boolean gate and weightless LUT networks. | Gate counts and accuracy. | Static routing drops to `52.34%` on VLAN shift and suffers marginal bit-plane chimeras. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Ternary / low-bit matrix products via table lookup on CPU/FPGA. | Latency and FPGA power. | Accelerates linear algebra inside a model gear; does not bypass model invocation. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Weak-to-strong LLM cascades and preference routers. | API dollar price vs. quality. | Model-to-model routing only; no `LUT6` lookup floor or downward compilation. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Multi-LLM bandit routing and frequency-scaled serving. | Authors' GPU Wh (`Zeus` / `pyNVML`). | Optimizes GPU serving; this reference compiles wakes into `0`-FLOP `LUT6` pages (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Neural MLP, draft-tree, and cascade speculative drafters. | Wall-clock speedup. | Require draft FLOPs and weight reads vs. `0`-FLOP `uint64` `LUT6` pages. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Zero-FLOP prompt n-gram and datastore suffix-trie drafters. | Latency speedup (`0` FLOPs). | `PLD` misses off-prompt tokens; `REST` uses variable tries vs. `RAMB36E2` pages. |
| **AirLLM** (lyogavin, 2023) | Open-source SSD streamer | Layer-by-layer SSD weight streaming in small RAM. | Active RAM footprint. | Pure `T=1` (`1.0 tok/sweep`) + KV spill vs. `AirMoL` `2.74×–2.86×` sweep reduction. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit gates (`11,428 pJ` KV260 `INA260` SOM reading), MoL $p_i/c_i$, and `RCE-JEPA`. | KV260 SOM `measured_j` + `est_j`. | Same-house foundation; extended here with Beneš `LUT6` downward compilation and `AirMoL`. |

---

## 6. Limits, threats to validity, not claimed, and falsifiers

**Internal and construct validity.** Under uniform random noise or per-step adversarial churn ($\Delta T = 1$), Proposition 1 gives zero downward compilation savings and falls back to `1.00 tok/sweep`. Lossless parity (`100.0%`) guarantees bit-for-bit agreement with greedy target decoding without raising the capability ceiling of a `350M` or `0.8B` base checkpoint.

**Measurement validity and not claimed.** Every joule number in this study is an analytical `est_j` figure (`measured_j = None`). Yosys `0.71+` and Verilator `5.054` establish structural `xck26` netlist synthesis and `CPI = 1` cycle simulation, not Vivado post-PAR `250 MHz` timing closure and not physical KV260 rail watts (`board_metered = false`). Silicon energy leadership, promotion of `ModelGenerated` outputs to `Deterministic`, and measured `70B` runs (`air_mol_nvme_baselines.csv` reports analytical `70B` projections only) are not claimed.

| ID | Claim | Exact Disproof / Falsifier Condition |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` fails `100.0%` Verilator parity across `5,120` packets or misses the packet-`2,500` VLAN shift. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig allocates `> 0` hot-loop heap bytes, Go reports `> 0 allocs/op`, or Julia Enzyme exceeds `1e-7` FD error. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` exceeds `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, or `1` cycle per page switch. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` exceeds target false risk $\alpha = 0.02$ on shifted traffic or stamps `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` yields `< 100.0%` exact byte parity vs. greedy `Mamba3CodeLM` on `48` unseen prompts. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` under `F_NOCACHE` fails `100%` parity or reads more NVMe bytes than `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_air_mol_pretrained.py` or `scripts/run_hf_qwen35_air_mol.py` diverges by $\ge 1$ BPE token from greedy target. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` fails any of the `18` test suites in `tests/`. |

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
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455–1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094–1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
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

From a checkout of [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 9dbf745`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
