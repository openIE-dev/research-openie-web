# From Ephemeral Inference to Compiled Agency: A Position Paper on Verifiable, Energy-Accounted Computing

*Why compressing neural weights 52.72x backfires by 81.86x on physical DC shunts if unpacked to FP32 at runtime—and how packed integer kernels, 4-ISA `waiOS` lockstep, and a 4-stage lookup-first cascade cut Kria KV260 `INA260` energy 26.58x gross (24.49x net) and Jetson Thor `INA3221` energy 16.26x.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated multi-substrate hardware shunt, RAPL, and 4-ISA conformance scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Position Paper (`rel="canonical"`)**: [https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/](https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/)  
> **Interactive Multi-Substrate Observatory**: [https://research.openie.dev/living/compiled-agency/](https://research.openie.dev/living/compiled-agency/) · **Interactive Lab #13**: [https://research.openie.dev/tutorials/?lab=lab-13-compiled-agency](https://research.openie.dev/tutorials/?lab=lab-13-compiled-agency)  
> **1-Command Replication & Signed Receipts (`@ 813eb96`)**: [https://github.com/openIE-dev/openie-research-experiments/commit/813eb9698ff179fd34d6877c5247bb2b9125ca86](https://github.com/openIE-dev/openie-research-experiments/commit/813eb9698ff179fd34d6877c5247bb2b9125ca86)  
> **Canonical Artifact ID**: `blake3:shot6:09d009b20ef5c8a79118a7da52729d65c21d4f2201f631b5c74eb1ec93619fe7` · **Evidence Tags**: `[T]` · `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j` (`KV260 INA260` & `Thor INA3221`, kept strictly orthogonal to `reported_j` & `est_j`)

---

![From Ephemeral Inference to Compiled Agency — Multi-Substrate Physical DC Shunt Receipts (@ 813eb96)](https://research.openie.dev/media/tv/tiktok/from-ephemeral-inference-to-compiled-agency-tiktok.jpg)
*Multi-substrate hardware shunt (`measured_j`) and Linux RAPL (`reported_j`) synthesis across AMD Kria KV260 (`TI INA260`), NVIDIA Jetson AGX Thor (`TI INA3221` + `INA238`), Intel Core i9-13900H, and AMD Ryzen AI Max+ 395 (`openIE-dev/openie-research-experiments @ 813eb96`, Apache-2.0). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Sub-Bit Decompression Impedance Tax vs. Packed Integer Compute (`measured_j`)]** Compressing a `512×512` weight matrix `52.72×` (`262,144 B` dense `INT8` down to `4,972 B` at `0.1517 bits/weight`) and unpacking it to `FP32` at runtime cost **`63,335.56 µJ` gross (`3,813.32 µJ` net)** vs. **`773.74 µJ` gross (`53.03 µJ` net)** for dense `INT8` on **AMD Kria KV260** (`TI INA260` `SOM_5V_DC` shunt `measured_j`, `N = 8`, `0.11%` idle drift `Falsifier 6` PASS)—an **`81.86×` gross (`71.91×` net) decompression impedance penalty** (`19.08×` gross on **NVIDIA Jetson AGX Thor** `TI INA3221` `VDD_CPU_SOC_MSS`: `15,839.34` vs. `829.94 µJ`). Keeping execution inside **Packed Integer (`FWHT + XNOR + popcount + 4-bit LUT`)** at the same `0.1517 bpw` footprint reduced KV260 `measured_j` to **`187.49 µJ` gross (`10.30 µJ` net)** (**`4.13×` gross / `5.15×` net** below dense `INT8`, and **`337.80×` gross** below naive `FP32` unpack) and Thor `INA3221` `measured_j` to **`104.44 µJ` gross** (**`7.95×`** below dense `INT8`), while a `4 KiB` compiled quadrant LUT (`96.33%` accuracy, `1,156 / 1,200`) used **`1.49 µJ` gross (`0.11 µJ` net)** on KV260 and **`0.93 µJ` gross** on Thor.
2. **[E · 4-ISA `waiOS` Verifiable Integer Lockstep & Tamper Halt]** Across **5 execution lanes** (`python_scalar_i32`, `c_scalar_i32`, `c_packed_2bit_bitsliced`, `c_tmac_pair_lut`, and `c_hetero_mosaic_4worker_pthreads`) on **4 distinct hardware substrates** (`Cortex-A53`, `Neoverse-V3AE`, `Raptor Lake`, and `Zen 5`), a canonical `256×128` ternary matrix-vector stage produced the identical `BLAKE3` digest (`a541323b13653ed36515ff24ef08deb7dfa771e570a434712708fb72552f46f0`) with **`0 / 400` schedule disagreements** across randomized 4-worker sweeps (95% Clopper–Pearson upper bound `<= 0.00746`). Injecting a single-weight mutation at Row `77` (`w[77,0]: 0 → 1`) deterministically flipped the digest to `4ac7c4fbc2f2a031ac4f3c0e485867fb689d24d4872bdb1b0a6bc80cf88b69dc`, triggered immediate disagreement halt, and refused `Ed25519` receipt sealing (`receipt_sealed = false`).
3. **[E · 4-Stage Lookup-First Cascade (`measured_j ⊥ reported_j ⊥ est_j`)]** On a `1,000`-query bounded spellcheck stream (`1,000 / 1,000` correct completions), routing through **Stage 1 Exact LUT (`550`) → Stage 2 Bounded Edit-Distance `d_max = 2` (`250`) → Stage 3 `waiOS` Ternary Mosaic `τ = 4500` (`174`) → Stage 4 Residual Teacher (`26`)** reduced physical shunt energy per correct completion by **`26.58×` gross (`24.49×` net)** on **Kria KV260 `INA260`** (`18,221.99 → 685.43 µJ` gross, `991.71 → 40.49 µJ` net, `0.09%` idle drift `Falsifier 6` PASS) and **`16.26×` gross** on **Jetson AGX Thor `INA3221`** (`8,622.51 → 530.39 µJ`), while avoiding **`38.46×`** Stage-4 escalations (`26 / 1,000`, analytical remote `est_j` strictly isolated and never summed with `measured_j` or `reported_j`).

## Methods, Multi-Substrate Telemetry, Sample Sizes (`N`) & Fired Falsifier Disclosure

- **Physical DC Shunt Substrates (`measured_j`, `board_metered = true`)**:
  - **AMD Kria KV260 (`Cortex-A53`, aarch64)**: On-board `TI INA260` (`ina260_u14`, `SOM_5V_DC` `/sys/class/hwmon/hwmon2/power1_input`, `~230 Hz` sampling, `N = 8` interleaved trials per regime). Pre/post `A1`/`A2` idle rail drift measured **`0.11%`** (LittleBit) and **`0.09%`** (Cascade), well inside the `<= 5.0%` `Falsifier 6` threshold (`falsifier_6_idle_drift_flag = false`).
  - **NVIDIA Jetson AGX Thor (`Neoverse-V3AE`, aarch64)**: On-board `TI INA3221` (`VDD_CPU_SOC_MSS`, `/sys/class/hwmon/hwmon6/in2_input` + `curr2_input`, `~203 Hz`) and secondary `TI INA238` (`VIN_CARRIER`, `/sys/class/hwmon/hwmon5/power1_input`), `N = 8` trials. Because unquiesced host background activity shifted `A1`/`A2` idle draw by `39.78%` (LittleBit) and `5.76%` (Cascade), **`Falsifier 6` (`> 5%` drift) fired** and `A1`/`A2` net-above-idle subtraction on Thor is **explicitly withheld** (`null`), reporting gross rail `measured_j` and paired-round figures only.
- **On-Chip Counter Substrates (`reported_j`, `board_metered = false`, never mixed with `measured_j`)**:
  - **Intel Core i9-13900H** and **AMD Ryzen AI Max+ 395** via Linux `powercap` `intel-rapl` (`N = 20` trials): recorded `54.78×` (Core i9) and `46.49×` (Ryzen) naive `FP32` unpack penalties over `INT8`, and a `20.78×` Ryzen `reported_j` cascade reduction (`793.56 µJ` median).
- **75-Cell Cascade Grid Sweep**: Swept `Zipf s ∈ {0.0, 0.5, 0.85, 1.15, 1.4} × d_max ∈ {0, 1, 2} × τ ∈ {1500, 3000, 4500, 6500, 9000}` across all 4 substrates (`300` substrate-grid cells) with full raw JSON receipts committed at `813eb96`.

## Why Ephemeral Inference Wastes Joules at Repeated Interfaces

Contemporary agent stacks default to **ephemeral inference**: re-invoking dense floating-point models from scratch on recurring structural inputs, re-parsing verbose text envelopes, and compressing weights for storage only to decompress them back into `FP32` on every forward pass `[M]`. **Compiled agency** inverts that execution order:

- **Lookup and Exact Guards First**: Bounded, high-frequency structural cases resolve in nanoseconds to microseconds via content-addressed LUTs (`Stage 1`) and bounded integer edit-distance filters (`Stage 2`) before waking heavier neural stages `[E]`.
- **Format-Aligned Integer Compute**: When compact neural stages run (`Stage 3`), weights stay packed in integer registers (`FWHT + XNOR + popcount + 4-bit LUT` and `waiOS` 2-bit/ternary integer MACs), eliminating the `19.08×–81.86×` runtime `FP32` decompression tax `[E]`.
- **Halt-on-Disagreement Receipts**: Every Stage-3 `waiOS` commit checks deterministic integer `BLAKE3` digests before sealing an `Ed25519` receipt, halting immediately on single-weight corruption (`Row 77`) `[E]`.

## Scope Boundaries, Non-Claims & Open Falsifiers

- **Bounded Domain vs. Open-Ended Novelty**: The `26.58×` KV260 and `16.26×` Thor cascade reductions hold on skew-heavy (`Zipf`) bounded lookup/spellcheck streams where Stages 1–3 absorb `97.4%` (`974 / 1,000`) of queries; under uniform unseen open-ended synthesis (`s = 0` or cold repository patching), queries escalate to Stage 4 as characterized in *The Deterministic Null* `[E]`.
- **Strict Epistemic Non-Mixing (`measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered`)**: Physical DC shunt joules (`KV260 INA260`, `Thor INA3221`/`INA238`), CPU `RAPL` counters (`Core i9`, `Ryzen AI Max+ 395`), and analytical cloud call estimates (`1.5 est_J/call`) are reported in separate tables and never added or cross-ratioed.
- **Self-Checked Status**: All artifacts carry `Signed Provenance · Self-Checked` status (`0` external peer reviews to date) and invite independent third-party replication from commit `813eb96`.

## Replicate, Critique & Explore Interactively

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Position Paper**: [https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/](https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/)
- **Interactive Multi-Substrate Observatory (`/living/compiled-agency/`)**: [https://research.openie.dev/living/compiled-agency/](https://research.openie.dev/living/compiled-agency/)
- **Interactive Tutorial Lab #13**: [https://research.openie.dev/tutorials/?lab=lab-13-compiled-agency](https://research.openie.dev/tutorials/?lab=lab-13-compiled-agency)
- **Signed Receipts & Replication Kit (`@ 813eb96`)**: [https://github.com/openIE-dev/openie-research-experiments/commit/813eb9698ff179fd34d6877c5247bb2b9125ca86](https://github.com/openIE-dev/openie-research-experiments/commit/813eb9698ff179fd34d6877c5247bb2b9125ca86)
- **9:16 Vertical Snackable (`60fps`) & Companion TV**: [https://research.openie.dev/media/tv/tiktok/from-ephemeral-inference-to-compiled-agency-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/from-ephemeral-inference-to-compiled-agency-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=lut-adapt)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses, hardware receipts, and `WAI1` schemas are licensed under `Apache-2.0`.*
