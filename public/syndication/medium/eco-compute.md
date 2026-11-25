# The Compute Stack (compute.openie.dev): 258-Primitive Taxonomy, KV260 Whole-SOM INA260 Scope (11.43 nJ), and Toolchain Status

*Maps 258 computational primitives across 33 families on compute.openie.dev, qualifying the 11.43 nJ KV260 whole-SOM INA260 reading (and inconclusive 98 pJ seed delta) from gates.md and separating Thor shunt vs Zen 5 RAPL figures.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/eco-compute/](https://blog.openie.dev/posts/eco-compute/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/gates/](https://research.openie.dev/papers/gates/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)  
> **Canonical Artifact ID**: `blake3:tv:ad930ba0ee7548a998e3394cd5510ac8de44a6b78cc7e5dabdfa264ddfc4cd8f` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j`

---

![Compute Stack — 258-primitive taxonomy and qualified 11.43 nJ KV260 whole-SOM INA260 shunt reading](https://research.openie.dev/media/tv/posters/eco-compute-poster.jpg)
*Periodic Stack of Computation (`compute.openie.dev`, `258` primitives) with strictly separated `KV260` `INA260` (`measured_j`), `Thor` `INA3221` (`measured_j`), and `Zen 5` `RAPL` (`reported_j`) anchors. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Whole-SOM KV260 `INA260` Qualification (`measured_j`)]** Per Critique #5, the **`11,428 pJ` (`11.43 nJ`, `SE = 129 pJ`)** figure referenced across the compute stack is **not** an isolated single-gate transistor reading: it is a **whole-SOM module (`VCC_SOM` `5.04 V`: Cortex-A53 PS + UltraScale+ PL + DDR4 + regulators) TI `INA260` halt-vs-run power-slope average (`+0.2857 W`, `SE = 0.0032 W`)** across **`N = 4` interleaved `25 s` `A/B/A` windows (`~4 Hz` sampling, `~6.25 × 10^8` 8-lane gate cycles/window at `25 MHz`, `~1.43 nJ/lane`)** on AMD Kria KV260—and its companion **`98.0 pJ` (`SE = 30.8 pJ`, `~1.96 mA`)** seed-fabric delta sits near the `INA260` **`1.25 mA` current LSB** and is **inconclusive**.
2. **[E · Non-Mixing Separation of Companion Anchors]** Earlier `eco-compute` headlines juxtaposed `927 uJ` (`measured_j` on Jetson AGX Thor `INA3221 VDD_CPU_SOC_MSS` over `50.13 us` for `1 KiB` `BLAKE3+Ed25519` verify in `CTA-E4`) with `20x` (`20.07x` Linux `RAPL` core `reported_j` `librce_rt.rlib` compile cut on AMD Zen 5 in `rce-compile`). Both are now explicitly labeled by host and telemetry class and never combined.
3. **[M/S · Taxonomy & `JLandauer` Availability Scope]** `compute.openie.dev` organizes **`258` computational primitives across `33` families** (boolean/wire permutations, fixed-point ALU, associative search, systolic MACs) using published silicon literature (Horowitz 2014) and analytical cost bands; `257` of those `258` portal cells are analytical/literature placements rather than in-house board-shunt measurements, and the `jlandauer` CLI shown on the portal product page is an internal toolchain prototype, not a public `Apache-2.0` package.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Hardware anchors from companion papers: AMD Kria KV260 TI `INA260` `VCC_SOM` (`measured_j`, `gates.md`) and NVIDIA Jetson AGX Thor TI `INA3221` `VDD_CPU_SOC_MSS` (`measured_j`, `lut-adapt.md` & `communication-avalanche.md`); `AMD Ryzen AI Max+ 395` `RAPL` (`reported_j`, `rce-compile.md`). Portal `258`-primitive table (`compute.openie.dev/src/data/stack.json`) is analytical/literature (`[M]`/`[S]`).
- **Workload & Suite**: `258`-primitive / `33`-family taxonomy on `compute.openie.dev`; KV260 `25 MHz` 8-lane commit gate (`~6.25 × 10^8` cycles/window); Thor `lut6-core` bit-sliced/scalar evaluation and `1 KiB` `BLAKE3+Ed25519` verify.
- **Baselines Compared**: KV260 halted vs. `25 MHz` clocked SOM (`A/B/A`); Thor `lut6-core` (`162.56 nJ/op`) vs. `INT8` Micro-MLP (`14,143.46 nJ/op` = `87.00x` CpJ).
- **Runs (`N`) & Uncertainty / Spread**: KV260 `INA260`: `N = 4` interleaved `25 s` `A/B/A` passes (`11,428 pJ/cycle`, `SE = 129 pJ`; `98.0 pJ`, `SE = 30.8 pJ` inconclusive). Thor `INA3221`: `4/4` counterbalanced `ABBA` windows (`< 0.06%` GPU rail drift).
- **Cold vs. Warm Caching Scope**: Stateless hardware datapaths (`0` dynamic cache in KV260 LUT fabric; deterministic `SRAM`/`BRAM` pages in `lut6-core`).
- **Artifact & License Status**: Web taxonomy public (`compute.openie.dev`, prose `CC0-1.0`); `lut6-core` and `XC7A200T` RTL public (`Apache-2.0` in `openIE-dev/lut-adapt-ai` & `openIE-dev/openie-research-experiments`); `jlandauer` CLI source private.

## Taxonomy vs. Physical Rail Metering on `compute.openie.dev`

`compute.openie.dev` maps `258` hardware and algorithmic primitives across `33` families—from zero-gate wire permutations (Beneš 1965; Waksman 1968) up to dense floating-point matrix units `[M, S]`. An outside reader must know clearly which numbers come from physical shunts vs. analytical coordinate placement `[E]`:

- **Physical `measured_j` anchors:** (a) **AMD Kria KV260 (`gates.md`):** `11,428 pJ/cycle` (`11.43 nJ`, `SE = 129 pJ`) whole-SOM `VCC_SOM` `INA260` slope across `N = 4` `25 s` passes at `25 MHz`, with `98.0 pJ` (`SE = 30.8 pJ`) seed delta inconclusive near the `1.25 mA` `INA260` LSB; (b) **NVIDIA Jetson AGX Thor (`lut-adapt.md`, `communication-avalanche.md`):** `162.56 nJ/op` bit-sliced `LUT6` (`87.00x` vs. `INT8` MLP) and `927.30 uJ` (`50.13 us`) `1 KiB` `BLAKE3+Ed25519` verify on `INA3221 VDD_CPU_SOC_MSS` `[E]`.

- **Workstation `reported_j` anchors (`rce-compile.md`):** `20.07x` (`Zen 5`) and `15.44x` (`Core i9-13900H`) Linux `RAPL` core compile reductions from factoring `librce_rt.rlib` `[E]`.

## Limitations, Sensor Resolution Floors & Toolchain Status

- **Board-level vs. isolated-transistor telemetry:** Neither `VCC_SOM` on KV260 nor `VDD_CPU_SOC_MSS` on Thor isolates single combinational gates from clock trees, L2/MSS interconnects, and regulator quiescent draw; isolating sub-milliamperes on FPGA rails requires inline Kelvin shunts (`INA228`) on `VCCINT` `[E]`.

- **Unpublished `jlandauer` CLI:** The `jlandauer` synthesis/simulation commands illustrated on `compute.openie.dev/products/jlandauer` represent an internal prototype; open-source hardware reproduction today uses the `Yosys + openXC7 + Verilator` scripts in `openIE-dev/lut-adapt-ai` and `openIE-dev/openie-research-experiments` `[E]`.

## Energy & Telemetry Scope

KV260 `INA260` (`11.43 nJ`) and Thor `INA3221` (`162.56 nJ`, `927.30 uJ`) are `measured_j`; Zen 5 / Core i9 `RAPL` (`20.07x`, `15.44x`) are `reported_j`; the `258`-primitive catalog entries are analytical/literature classifications (`[M]`/`[S]`).

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: 258-Primitive Map + KV260 Shunt Anchor
- **Telemetry Disclosure**: 258-primitive analytical taxonomy anchored by KV260 whole-SOM INA260 shunt (11.43 nJ/cycle measured_j; 98 pJ seed delta inconclusive); jlandauer CLI private.
- **Evidence Class**: `measured_j` (`board_metered = true`)
- **Catalog Anchor Reading**: `1.1428e-08 J (measured_j)`
- **Sensor / Formula Scope**: AMD Kria KV260 whole-SOM VCC_SOM TI INA260 shunt anchor (11,428 pJ/cycle, SE = 129 pJ, measured_j; 257/258 portal cells are analytical/literature [M]/[S])

## Related Work & Primary Literature (`[S]`)

- **Horowitz (IEEE ISSCC, 2014):** Canonical `45 nm` CMOS gate, integer-add (`0.1 pJ`), FP-FMA (`4.6 pJ`), SRAM (`5 pJ`), and DRAM (`1.3–2.6 nJ`) energy hierarchy `[S]`.
- **Landauer (1961) & Bérut et al. (Nature, 2012):** Physical `k_B T ln 2` irreversible bit-erasure bound `[S]`.
- **Lattner et al. (MLIR, CGO 2021), Ragan-Kelley et al. (Halide, PLDI 2013), Chen et al. (TVM, OSDI 2018) & XLA:** Multi-level hardware lowering and schedule-cost separation `[S]`.
- **Beneš (1965), Waksman (JACM, 1968) & Umuroglu et al. (LogicNets, FPL 2020):** Rearrangeably nonblocking wire networks and LUT-fabric datapaths `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/eco-compute/](https://blog.openie.dev/posts/eco-compute/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/gates/](https://research.openie.dev/papers/gates/) ([PDF](https://research.openie.dev/pdfs/rce-compile.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/eco-compute-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/eco-compute-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=eco-compute)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
