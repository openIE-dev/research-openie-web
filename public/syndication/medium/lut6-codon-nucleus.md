# The 4 KB LUT6 Page & 16 KB Nucleus: Counting-Parallel Motivation (2^6 = 4^3 = 64), Walsh-Hadamard Filtering, and M.2 Thermal Bounds

*States upfront that 2^6 = 64 (LUT6 bits) and 4^3 = 64 (RNA codons) is a naming counting parallel—not a biological isomorphism—and separates Thor INA3221 measured_j, Cortex-M55 DWT cycles, and Artix-7 XC7A200T est_W/est_C.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/lut6-codon-nucleus/](https://blog.openie.dev/posts/lut6-codon-nucleus/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)  
> **Canonical Artifact ID**: `blake3:tv:b3baf367788259314785478a6d1b13dc0ac325cd6b7eb7f66e336f8394cac0be` · **Evidence Tags**: `[T]` · `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j`

---

![4 KB LUT6 Nucleus — 64=64 naming parallel disclosure, Thor INA3221 measured_j, Cortex-M55 cycles, and XC7A200T M.2 est_C](https://research.openie.dev/media/tv/posters/lut6-codon-nucleus-poster.jpg)
*4 KB `CompactLut6Page` (`sys/lut6-core`): upfront `2^6 = 4^3 = 64` naming-motivation disclosure, Thor `measured_j`, Cortex-M55 `DWT` cycles, and `XC7A200T` `est_W`/`est_C`. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/T · Analogy Label: Counting Parallel, NOT Biological Isomorphism]** Upfront clarification (Critique #6): the numerical coincidence between **`2^6 = 64`** (entries in a 6-input Boolean `LUT6` truth table, packed in one `uint64` word or Xilinx `LUT6` primitive) and **`4^3 = 64`** (RNA nucleotide triplets) is a **combinatorial counting parallel used strictly as naming motivation** ("codon", "wobble", "operon", "nucleus")—**not a structural or biochemical isomorphism**. Biological genetic-code degeneracy is **not** shown to filter digital sensor noise; what `NucleusCodon.lean` proves `[T]` is a standard Boolean Walsh–Hadamard Fourier fact (Linial, Mansour & Nisan 1993): functions invariant across aligned 2-bit blocks (`0x0F << 4q`) have **exact `0` degree-`5` and degree-`6` Fourier coefficients** (vs. `28` high-degree AC energy on a brittle `1u64 << c` 1-hot mask).
2. **[E · Strictly Separated Silicon Measurements]** On **`NVIDIA Jetson AGX Thor` (`TI INA3221 VDD_CPU_SOC_MSS`, `measured_j`)**, `lut6-core` uses **`162.56 nJ/op` (`5.45 ns`, `87.00x` CpJ vs. `14,143.46 nJ` `INT8` Micro-MLP)** in vertical bit-sliced mode, **`1,935.05 nJ` (`65.2 ns`, `7.31x`)** scalar, and **`8,594.93 nJ` (`1.65x`)** on the in-page `672 B` `Antisym-40` zero-`MUL` `T-MAC` fallback; on a **live USB-attached `Alif Ensemble E3` (`OpenMV-AE3` Cortex-M55 @ `400 MHz`, `board_metered = false`)**, it runs in **`684.57` `DWT` cycles (`1.72 us`, `173.83x` faster than `INT8` MLP)** scalar and **`2.68` cycles/op (`6.97 ns`)** bit-sliced, while fitting `16,400 B` (`25.06%`) of `64 KB` `SRAM` on `nRF52832` Cortex-M4F and `RV32IMAC` (`0` float instructions).
3. **[M/E · M.2 `XC7A200T` Gateware & Thermal Failure Bound (`est_j`)]** Synthesizing (`Yosys 0.71+` + license-free `openXC7` `nextpnr-xilinx` closing post-PAR timing at **`320.62 MHz`** on `xc7a200tfbg484-2`) maps each `4,096 B` `CompactLut6Page` `1:1` into one `36 Kb` `RAMB36E1` with `(72, 64)` Hamming `SECDED` (`0 observed` silent corruption at `BER = 1%` in fault simulation vs. `54.56%` on `INT8` MLP). Analytical `DS181`/`UG475` modeling (`est_j`, **unprobed on physical M.2 rails**) projects **`0.86 est_W` and `55.2 est_C`** (`45 °C` ambient, passive heatsink) when external `DDR3` is held in reset—and **candidly flags thermal failure (`95.8 est_C > 85 °C` commercial limit)** if `DDR3 + PCIe x4` is enabled in a `0 LFM` bare slot without `>= 200 LFM` airflow (`63.2 est_C`).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: (1) `NVIDIA Jetson AGX Thor` (`TI INA3221 ch2 VDD_CPU_SOC_MSS` physical DC shunt, `measured_j`, `board_metered = true`); (2) `Apple M5 Max` (`L3` `reported_j`) & `AMD Ryzen AI Max+ 395` (`RAPL` pkg `reported_j`); (3) Live USB `OpenMV-AE3` (`Alif E3` Cortex-M55 @ `400 MHz` hardware `DWT` cycle counter, `board_metered = false`); (4) `Numato Aller A7` (`Artix-7 XC7A200T-2FBG484C`) `Verilator 5.054` `12,023`-cycle co-sim + `openXC7` post-PAR `.bit` + `673`-point `AMD DS181/UG475` coupled leakage model (`est_j` / `est_C`, `board_metered = false`).
- **Workload & Suite**: `4,096 B` `CompactLut6Page` (`256` `LUT6`s + `672 B` `EntroMCU` `1.602 b/w` `Antisym-40 T-MAC` tail), `64/64` Yosys `abc -lut 6` Boolean miter vectors, `40` noisy skill paraphrases + `8` OOD abstention probes, `BER = 1.0%` (`10^-2`) SEU bit-flip injection, and `10,500` cross-family (`XC7A200T` vs. `XCK26`) RTL equivalence vectors.
- **Baselines Compared**: 2-layer `INT8` (`64->32->16`) and `BF16` Micro-MLPs, unpruned `FiniteDiff DWN` (`64` gates vs. `23` `DiffLUT-Net` `-64.06%` and `16` wobble-pruned `-75.00%`), naive `80`-`LUT6` Shannon expansion vs. `22`-`LUT6` Lupanov (`-72.5%`), and `DDR3`-active vs. `DDR3`-tie-off M.2 gateware.
- **Runs (`N`) & Uncertainty / Spread**: Thor shunt: `9`-window counterbalanced `ABBA` harness (`bench_lut6_nucleus_shunt.rs`). `XC7A200T` vs. `KV260` co-sim: `12,023` cycles / `10,500` vectors (`0` bit mismatches). `Charon + Aeneas` + `Lean 4.36.0`: `50–58` six-kernel-verified `LutAdapt` theorems (`0 sorry`).
- **Cold vs. Warm Caching Scope**: Two immutable `ROM/MRAM` seed pages + two mutable `SRAM/DTCM` surgical overlay pages: 4-part Means Test refuses unamortized one-off tasks (`N = 1 < N_crit = 1.90`), unverified guesses (`delta < 1.0`), and high-entropy prose (`H = 4.85 > 1.25` bits), rolling drifted overlays (`rej = 3`) back to seed (`0x3C` rollback).
- **Artifact & License Status**: `Apache-2.0` public code in `openIE-dev/lut-adapt-ai` (`sys/lut6-core/`, `15.31 KB` `lut6_core.wasm`) and `openIE-dev/openie-research-experiments` (`aller-a7-xc7a200t/`, `lut6-core-nucleus/`); self-checked, open for external replication.

## Naming Motivation vs. Mathematical Content (`2^6 = 64` vs. `4^3 = 64`)

Why use biological terms (`codon`, `wobble`, `operon`, `apoptosis`) for a `#![no_std]` Rust and FPGA lookup-table format? **Solely as an intuitive naming mnemonic for a `4,096 B` binary page layout** `[M]`:

- **What is merely a counting coincidence:** A Xilinx 7-Series/UltraScale+ `LUT6` hardware primitive and a 64-bit CPU word (`uint64`) each hold `2^6 = 64` truth-table bits, matching the cardinality `4^3 = 64` of three-base nucleotide codons. That `64 = 64` equality is **not** a physical or evolutionary equivalence `[M]`.

- **What is proved mathematically (`[T]`):** In Boolean harmonic analysis (Linial, Mansour & Nisan, JACM 1993), masking or grouping noisy low-order ADC bits so a `LUT6` output is constant across 4-state subcubes forces all degree-`5` and degree-`6` Walsh–Hadamard coefficients to vanish (`NucleusCodon.wobble_quartet_high_harmonic_cancels`), preventing `1`-hot point memorization (`0 observed` noisy-paraphrase hit rate) and holding `95.00%` hit rate (`100.0%` `40/40` when paired with the in-page `672 B` zero-`MUL` `T-MAC` tail) `[T, E]`.

## Hardware Results Kept Strictly Separate by Substrate

- **`NVIDIA Jetson AGX Thor` (`measured_j`, physical TI `INA3221` shunt) `[E]`:** `162.56 nJ/op` (`87.00x` CpJ vs. `INT8` Micro-MLP) vertically bit-sliced; `1,935.05 nJ` (`7.31x`) scalar; `8,594.93 nJ` (`1.65x`) `Antisym-40 T-MAC` (`-49.38%` stack `SRAM` via `ISCA 2025` mirror involution `T(80 - c) = -T(c)`, which also flipped AMD `Zen 5` `RAPL` `reported_j` from `0.68x` to `1.12x` CpJ over `INT8` MLP) `[E]`.

- **Bare-Metal `MCU` Targets (`DWT` cycles & static `ELF` audit, `board_metered = false`) `[E]`:** Cross-compiles with `0` float instructions across `8` targets (including `15.31 KB` `wasm32` and `25.06%` of `64 KB` `SRAM` on `nRF52832` and `RV32IMAC`), executing in `684.57` cycles (`1.72 us`) scalar and `10,655.8` cycles (`11.17x` faster than `119,001.9`-cycle `INT8` MLP) on live USB-attached `Alif E3` Cortex-M55 `[E]`.

- **Artix-7 `XC7A200T` (`Numato Aller A7` M.2 2280, `est_j` / `est_C`) `[M, E]`:** Holds `365` `4 KB` pages on-die (`1.46 MB` `RAMB36E1`, `2.53x` `KV260` BRAM capacity) with `(72, 64)` `SECDED` (`100 observed` accuracy / `0 observed` silent corruption at `BER = 1%` simulated bit flips vs. `26.28%` accuracy / `37.0%` `NaN` on `BF16` MLP) and closes `openXC7` post-route timing at `320.62 MHz` `[E]`.

## Limitations & Pre-Bench Hardware Gaps

- **M.2 `XC7A200T` thermal & shunt gap (`LA-F30`):** All `XC7A200T` watt/Celsius figures (`0.86 est_W`, `55.2 est_C` with `DDR3` off; **`95.8 est_C` bare thermal failure** with `DDR3 + PCIe x4` at `0 LFM`) are analytical `est_j`/`est_C` calculations; physical M.2 `+3.3 V` Kelvin shunt (`INA228`) and `XADC`/thermocouple bench probing have **not yet been run** `[M]`.

- **6-input locality ceiling:** Functions requiring wide global arithmetic without tree/Lupanov decomposition exceed a single `4 KB` page and must escalate to `T-MAC` or neural rungs `[M]`.

## Energy & Telemetry Scope

Thor `INA3221` (`measured_j`), M5 Max / Zen 5 (`reported_j`), Cortex-M55 (`DWT` cycles), and `XC7A200T` (`est_j`) are reported in separate rows and never combined across classes.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Thor Shunt ⊥ MCU Cycles ⊥ XC7A200T est_j
- **Telemetry Disclosure**: 2^6 = 4^3 = 64 is a naming parallel only; separates Thor INA3221 measured_j (162.56 nJ/op), Cortex-M55 DWT cycles, and unprobed M.2 XC7A200T est_W/est_C.
- **Evidence Class**: `measured_j` (`board_metered = true`)
- **Catalog Anchor Reading**: `1.6256e-07 J (measured_j)`
- **Sensor / Formula Scope**: NVIDIA Jetson AGX Thor TI INA3221 VDD_CPU_SOC_MSS DC shunt (162.56 nJ/op bit-sliced LUT6, measured_j; XC7A200T 0.86 est_W / 55.2 est_C is unprobed est_j)

## Related Work & Primary Literature (`[S]`)

- **Linial, Mansour & Nisan (JACM, 1993) & Lupanov (1958):** Boolean Walsh–Hadamard Fourier concentration of bounded-depth circuits and asymptotic shared-cofactor LUT synthesis `[S]`.
- **Bacellar et al. (TMLR, July 2026), Khataei & Bazargan (TreeLUT, 2025) & Ye et al. (DiffLUT-Net, 2026):** Weightless/LUT-network SEU bit-flip resilience, GBDT-to-LUT compilation, and multilinear LUT pruning `[S]`.
- **Mo et al. (LUT Tensor Core, ISCA 2025), Wei et al. (T-MAC, 2024) & Sanyal et al. (EntroMCU, ISVLSI 2026):** Antisymmetric ternary table lookup and base-3 `5`-trits/byte microcontroller compression `[S]`.
- **Ho & Protzenko (Charon & Aeneas, ICFP 2022) & Project X-Ray / `openXC7` (`nextpnr-xilinx`):** Mechanical Rust-to-Lean functional translation and open-source Xilinx 7-Series bitstream generation `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/lut6-codon-nucleus/](https://blog.openie.dev/posts/lut6-codon-nucleus/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/) ([PDF](https://research.openie.dev/pdfs/lut-adapt.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/lut6-codon-nucleus-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/lut6-codon-nucleus-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=lut6-codon-nucleus)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
