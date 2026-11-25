# LUT-Adapt & Mixture-of-Limits: Separating Thor DC Shunt Readings from Workstation Chip Counters Across Coding & Wearable Cascades

*Separates Jetson AGX Thor TI INA3221/INA238 physical DC shunts (measured_j) from workstation chip counters (reported_j), Cortex-M55 DWT cycles, and FPGA VCD est_j, tying 91.67% (44/48) and 62.50% (10/16) to exact model/gate arms.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/lut-adapt/](https://blog.openie.dev/posts/lut-adapt/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)  
> **Canonical Artifact ID**: `blake3:tv:f5f2551c2e873bdc7af0ce1e380b0a888679c3ade804cbec637a62785734ec8d` · **Evidence Tags**: `[T]` · `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j`

---

![LUT-Adapt — Thor INA3221 measured_j shunt vs workstation reported_j coding cascades (91.67% 44/48 and 62.50% 10/16)](https://research.openie.dev/media/tv/posters/lut-adapt-poster.jpg)
*Stratified `lut-adapt-ai` (`dc45357`) results: Jetson AGX Thor DC shunt (`measured_j`), 4-vendor CubeCL GPU & coding cascades (`reported_j`), and FPGA VCD (`est_j`). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Resolved Telemetry Contradiction (`measured_j` vs. `reported_j` vs. `est_j`)]** Earlier summaries mixed `board_metered = true` with workstation counter prose. Grounded in `src/content/papers/lut-adapt.md`, **`measured_j` (`board_metered = true`) applies strictly to NVIDIA Jetson AGX Thor physical TI `INA3221` (`VDD_CPU_SOC_MSS` L2) and `INA238` (`VIN` L1) DC current shunts (`Claims LA-24, LA-28, LA-32, LA-33, LA-38`)**; **workstation LLM and 4-vendor `CubeCL` GPU runs (`Apple M5 Max`, `AMD Ryzen AI Max+ 395`, `Intel Core i9-13900H`, `RTX 4050`/`2060`) use on-chip `reported_j` (`board_metered = false`)**; **live `Alif Ensemble E3` (`OpenMV-AE3` Cortex-M55 @ `400 MHz`) reports hardware `DWT` cycles (`board_metered = false`)**; and **FPGA gateware power (`Kria KV260` `15.59 est_mW`, `Artix-7 XC7A200T` `0.86 est_W`) is `Verilator VCD` + datasheet `est_j` (`measured_j = null`)**.
2. **[E · Named Configurations Behind `91.67%` (`44/48`) and `62.50%` (`10/16`)]** On the `48`-task (`16` specs × `3` waves) coding bakeoff (`Claim LA-17`), **`91.67%` (`44/48`, `0` broken commits admitted)** was achieved by **`MoL` + Rung 3d `Qwen/Qwen3.6-35B-A3B` with bounded `1,536–2,200` `<think>` tokens and deterministic `unittest` gate** (vs. `87.50%` `Arm G` without `<think>` and `77.08%` standalone `Qwen3.6-35B-A3B`). On the **`16`-task (`8` specs × `2` waves) hard adversarial coding suite (`Claim LA-21`)**, **`62.50%` (`10/16`)** was achieved by the **`MoL` Apex cascade (`BenesLUT6` + `.mol/` + counterexample escalation across `Devstral-Small-2-24B-Instruct` and `nvidia/Nemotron-3-Super-120B-A12B`)** (vs. `43.75%` standalone `120B-A12B` and `31.25%` standalone `24B`).
3. **[E/T · `80` Six-Input (`6-Bit, 64-Entry`) `LUT6` Truth Tables & `58` Lean Proofs]** Rung 0 routes inputs through a `512 × 512` Beneš/Waksman permutation network into **80 six-input (6-bit, 64-entry) `LUT6` truth tables** (and `4 KB` `CompactLut6Page` + `672 B` antisymmetric `40`-entry zero-`MUL` `T-MAC` tail), achieving **`162.56–162.71 nJ/op` (`87.00x–87.25x` CpJ vs. `14,143.46 nJ/op` `INT8` Micro-MLP)** on Thor `INA3221` `measured_j`, alongside **`58` six-kernel-verified Lean `4.36.0` theorems** and mechanical `Charon + Aeneas` `#![no_std]` Rust-to-Lean extraction (`6` core functions).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: (1) `measured_j`: `NVIDIA Jetson AGX Thor` (`TI INA3221 ch2 VDD_CPU_SOC_MSS` + `INA238 VIN` @ `500 Hz` `2 ms` trapezoidal `ABBA` integration, `CUDA_VISIBLE_DEVICES=""`); (2) `reported_j`: `Apple M5 Max 128 GB` (`IOReport`/`ri_energy_nj`), `AMD Ryzen AI Max+ 395` + `Radeon 8060S` (`RAPL` + `PPT`), `Intel Core i9-13900H` (`RAPL`), `NVIDIA RTX 4050` / `RTX 2060` (`NVML`); (3) MCU cycles: live USB `OpenMV-AE3` (`Alif E3` Cortex-M55 @ `400 MHz` `DWT`); (4) `est_j`: `Verilator 5.054 VCD` + `AMD DS925`/`DS181` on `XCK26` & `XC7A200T`.
- **Workload & Suite**: `LA-17` (`48` coding tasks = `16` specs × `3` waves), `LA-21` (`16` hard adversarial coding tasks = `8` specs × `2` waves), `32`-task `BigCodeBench v0.1.3` slice (`29/32 = 90.62%`), `LA-24` 6-host downward-compilation matrix (`W1–W5`), `LA-25` 4-vendor `Burn 0.22.1 / CubeCL` GPU shader suite, `LA-36` `64`-query bimodal wearable stream (`48` daily + `16` PhD), and `LA-37` `32` open `SuperGPQA hard` + `MathArena AIME/HMMT 2025` calibration items.
- **Baselines Compared**: Standalone `Qwen3.6-35B-A3B` (`77.08%`), `Devstral-Small-2-24B` (`31.25%`), `Nemotron-3-Super-120B-A12B` (`43.75%`), `INT8`/`BF16` Micro-MLP (`64->32->16`), `LittleBit-2` MAC, dense `256`-expert MoE, and `UW/Meta Sensente/uLM-28M` (`28.84M` collaborative prefix masking).
- **Runs (`N`) & Uncertainty / Spread**: Thor `measured_j` (`LA-24`): `4/4` counterbalanced `ABBA` pairs (`< 0.06%` `VDD_GPU` drift, `0.19%` `VIN` drift). Coding suites: `N = 48` (`44/48`), `N = 16` (`10/16`), `N = 32` `BigCodeBench` (`29/32`), `N = 64` wearable queries, `N = 32` `SuperGPQA/AIME/HMMT` items (greedy/seeded deterministic evaluation; multi-seed LLM temperature variance not recorded).
- **Cold vs. Warm Caching Scope**: Explicitly separated: Wave 1 in `LA-17`/`LA-21` runs **cold** (escalating to `35B` or `24B/120B` behind the `unittest` gate), whereas Wave 2/3 hit crystallized `.mol/` / `LUT6` entries (`Delta T* = 0.1084 < 1` episode break-even on Thor when a compiled skill is reused, vs. net compile overhead if `N_reuse = 0`; `hle:3r2s` canary guard blocks benchmark crystallization).
- **Artifact & License Status**: `Apache-2.0` public repository at `https://github.com/openIE-dev/lut-adapt-ai` (`commit dc45357`) and `openIE-dev/openie-research-experiments`; self-checked by OpenIE, open for independent replication.

## Strict Telemetry Stratification (`Thor measured_j` vs. Workstation `reported_j` vs. FPGA `est_j`)

`lut-adapt` spans six CPU/GPU hosts, two bare-metal MCUs, and two FPGA targets. Keeping its four evidence tiers orthogonal (`measured_j ⊥ reported_j ⊥ cycles ⊥ est_j`) resolves the earlier summary’s `"no board shunt"` vs. `board_metered = true` contradiction `[E]`:

- **Physical DC Shunt (`measured_j`, `board_metered = true`):** Recorded **exclusively on `NVIDIA Jetson AGX Thor`** via `hwmon5` TI `INA3221` (`VDD_CPU_SOC_MSS` isolated CPU/SoC rail) and `hwmon6` TI `INA238` (`VIN` whole-board rail) at `500 Hz` across `ABBA` windows: `W2` `Sub1Bit-LUT6` saves `3.74x` CPU J (`7.76` vs. `28.98 J`), `W3` `Expert-AirMoL` saves `34.21x` (`0.98` vs. `33.36 J`), `lut6-core` vertical bit-slicing reaches **`162.56–162.71 nJ/op` (`87.00x–87.25x` CpJ vs. `14,143.46 nJ/op` `INT8` Micro-MLP)**, `Antisym-40` zero-`MUL` `T-MAC` reaches `8,594.93 nJ/op` (`1.65x` CpJ), and the `56`-bit `4`-token wearable epistemic gate uses **`2,803.25 nJ` vs. `623,920.52 nJ` (`222.57x`)** for `1/16`th of a `uLM-28M` layer `[E]`.

- **On-Chip Counters (`reported_j`, `board_metered = false`):** Used for all workstation LLM cascades (`Qwen3.6-35B-A3B`, `Nemotron-3-Super-120B-A12B`, Oct–Nov 2026 looped `Inkling-2-Mini` `4.29x` and `Dory1.0-4B` `3.86x` `LUT6` speculative burst cuts on M5 Max `L3`) and 4-vendor single-source Rust `CubeCL` GPU shaders (`Apple Metal`, `AMD Radeon 8060S Vulkan`, `NVIDIA RTX 4050 Vulkan`, `Intel Iris Xe Vulkan`, `max FP32 err <= 1.79 × 10^-7`) `[E]`.

- **MCU `DWT` Cycles & FPGA `est_j` (`board_metered = false`):** Live USB-attached `OpenMV-AE3` (`Alif E3` Cortex-M55 @ `400 MHz`) records cycle counts (`173.83x` scalar `LUT6`, `11.17x` `T-MAC` vs. `INT8` MLP), while `Kria KV260` (`15.59 est_mW`) and `Artix-7 XC7A200T` (`0.86 est_W`) are `Verilator VCD` + datasheet `est_j` `[E]`.

## Coding & Epistemic Cascade Results (Cold Wave 1 vs. Warm Wave 2/3)

- **`91.67%` (`44/48`, `Claim LA-17`):** Pairing `MoL` with `Qwen/Qwen3.6-35B-A3B` (`1,536–2,200` `<think>` tokens + `unittest` gate) solved `44/48` tasks across 3 waves (vs. `87.50%` without `<think>` and `77.08%` standalone `35B`). Wave 1 pays cold `35B` generation; Waves 2–3 amortize verified `.mol/` skills `[E]`.

- **`62.50%` (`10/16`, `Claim LA-21`):** On `16` hard adversarial coding tasks (`8` specs × `2` waves), escalating across `BenesLUT6` -> `.mol/` -> `Devstral-Small-2-24B` -> `Nemotron-3-Super-120B-A12B` (`58.1 GB` RSS) solved `10/16` (`62.50%`) vs. `7/16` (`43.75%`) standalone `120B` and `5/16` (`31.25%`) standalone `24B`—candidly leaving `6/16` (`37.5%`) unsolved `[E]`.

- **Wearable `SRAM` fit & frontier calibration (`LA-36, LA-37`):** `Wearable-MoL` fits Rung 0 in **`5,984 B` (`9.13%` of `64 KB` watch `SRAM`)** vs. `13.75 MB` (`214x` overflow) for `Sensente/uLM-28M`, suppresses **`15/16` (`93.75% -> 0 observed`)** wrong spoken prefixes on whiteboard PhD queries via `EpistemicHold`, and on `32` open `SuperGPQA hard` + `AIME/HMMT 2025` items cuts `RMS` calibration error **`5.37x` (`70.62% -> 13.14%`)** while scoring **`0/16` (`0%`, abstaining)** on Exact-Match Olympiad items where `24B`/`35B` models also scored `0/16` `[E]`.

## Limitations & Open Boundaries

- **Cold novel tasks still require large neural models:** `80`-`LUT6` / `4 KB` `CompactLut6Page` crystals compress **recurring bounded skills** (`H <= 1.25` bits in the 4-part Means Test); high-entropy open prose and unseen `AIME/HMMT` Olympiad proofs (`0/16` solved) are refused to higher rungs or abstained `[E]`.

- **Gated `cais/hle` respected without bypass:** `cais/hle` returned `HTTP 403` in automated runs and was **not** bypassed; `LA-37` evaluated `32` open `SuperGPQA hard` + `MathArena 2025` items under the HLE calibration protocol instead `[E]`.

- **Unprobed M.2 FPGA rails:** `Numato Aller A7` (`XC7A200T`, `openXC7` `320.62 MHz` `.bit`) awaits inline `+3.3 V` / `+5 V` Kelvin shunts to promote `0.86 est_W` to `measured_j` (`LA-F30`) `[E]`.

## Energy & Telemetry Scope

Every comparison stays strictly inside its own telemetry class: Thor `INA3221`/`INA238` (`measured_j`), per-host `RAPL`/`IOReport`/`NVML` (`reported_j`), Cortex-M55 `DWT` cycles, and `Verilator VCD` (`est_j`).

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Stratified Shunt ⊥ Counter ⊥ Cycles ⊥ VCD
- **Telemetry Disclosure**: Thor TI INA3221/INA238 shunts (measured_j) kept strictly separate from workstation reported_j, Cortex-M55 DWT cycles, and FPGA VCD est_j.
- **Evidence Class**: `measured_j` (`board_metered = true`)
- **Catalog Anchor Reading**: `1.6256e-07 J (measured_j)`
- **Sensor / Formula Scope**: NVIDIA Jetson AGX Thor TI INA3221 VDD_CPU_SOC_MSS DC shunt (162.56 nJ/op bit-sliced LUT6; workstation coding cascades are reported_j)

## Related Work & Primary Literature (`[S]`)

- **Umuroglu et al. (LogicNets, FPL 2020), Petersen et al. (DiffLogic, NeurIPS 2022) & Ye et al. (DiffLUT-Net, arXiv:2609.09254, 2026):** Differentiable and pruned LUT-network synthesis `[S]`.
- **Wei et al. (T-MAC, 2024), Mo et al. (LUT Tensor Core, ISCA 2025) & Sanyal et al. (EntroMCU, ISVLSI 2026):** Low-bit/ternary table-lookup arithmetic and base-3 MCU weight packing `[S]`.
- **FrugalGPT (Chen et al., 2023), RouteLLM (Ong et al., ICLR 2025) & Leviathan et al. (Speculative Decoding, ICML 2023):** Multi-tier routing and exact-parity speculative verification `[S]`.
- **Cheng et al. (`Sensente/uLM-28M`, EMNLP 2026), Phan et al. (`Humanity’s Last Exam`, Nature 2026) & Ho & Protzenko (`Aeneas`, ICFP 2022):** Wearable micro-LLM prefix masking, frontier calibration error, and `#![no_std]` Rust-to-Lean functional verification `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/lut-adapt/](https://blog.openie.dev/posts/lut-adapt/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/) ([PDF](https://research.openie.dev/pdfs/lut-adapt.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/lut-adapt-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/lut-adapt-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=lut-adapt)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
