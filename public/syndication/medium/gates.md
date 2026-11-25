# Metered Commit Gates: KV260 Whole-SOM Shunt Measurements, Statistical Safety Bounds, and Cascade Scope

*Whole-SOM TI INA260 shunt power-slope readings on AMD Kria KV260 (11.43 nJ/cycle, N = 4 A/B/A passes), inconclusive 98 pJ seed delta near sensor floor, and Clopper-Pearson bounds over 209,261 simulated checks.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/gates/](https://blog.openie.dev/posts/gates/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/gates/](https://research.openie.dev/papers/gates/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits)  
> **Canonical Artifact ID**: `blake3:tv:b6075421aa4a225d509d07481bc5a850f9e1dc14424cd92bd9abe3ebe93260a3` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j`

---

![Metered Commit Gates — 11.43 nJ/cycle whole-SOM KV260 INA260 reading and 209,261-trial Clopper-Pearson bound](https://research.openie.dev/media/tv/posters/gates-poster.jpg)
*KV260 whole-SOM INA260 power-slope reading (11,428 pJ/cycle, SE = 129 pJ, measured_j), inconclusive 98 pJ seed delta, and 209,261-trial simulated gate audit. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · measured_j, KV260 TI INA260 Whole-SOM Shunt]** Stepping an 8-lane gate fabric at `25 MHz` (`2.4999 × 10^7` gate cycles/s, `~6.25 × 10^8` cycles per `25 s` window) raised whole-module `VCC_SOM` power by `+0.2857 W` (`SE = 0.0032 W` across `N = 4` interleaved A/B/A passes at `~4 Hz`), yielding **11,428 pJ/cycle (`11.43 nJ`, `SE = 129 pJ`, or `~1.43 nJ` per lane decision)** across PS + PL + DDR + regulators combined—whereas a **98.0 pJ (`SE = 30.8 pJ`, `+0.0098 W` ≈ `1.96 mA` at `5 V`)** seed-fabric delta sits near the `INA260` `1.25 mA` current step and is **explicitly inconclusive**.
2. **[E/M · Simulated Safety Gate Bound]** Across `209,261` simulated inverted-pendulum states (`21^3 = 9,261` grid + `200,000` near-threshold Monte Carlo samples against `Vdot <= epsilon`), the gate recorded **0 observed false allows in 209,261 simulated trials (95% Clopper–Pearson upper bound <= 1.43 × 10^-5, ~1.4 per 100,000, under the tested state generator, with 79/209,261 = 0.038% conservative false refusals; grid/Monte Carlo simulation cannot prove universal absence of bugs)**.
3. **[M · Cold vs. Assumed Zipf Caching]** The reported `16.7x` frontier-call reduction in the Mixture-of-Limits (`MoL`) cascade comes from an **assumed stationary `Zipf(s = 1.1)` repeat-arrival stream** where verified answers memoize into exact lookup; on **all-novel cold arrivals, cache reuse is `1.0x` (zero call savings)**, and cached entries must be invalidated whenever specifications change.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Hardware rung: AMD Kria KV260 (`XCK26` UltraScale+ SOM) instrumented via onboard TI `INA260` I2C shunt across whole-module `VCC_SOM` (`5.04 V` rail; `1.25 mA` current LSB, `5 mA` max offset, `0.15%` gain error; `measured_j`). Software simulations (`NI-1..NI-4`, `MoL` Zipf curves): analytical op-counters and Python/Rust simulation (`est_j` / `[M]`).
- **Workload & Suite**: KV260: `25 MHz` 8-lane pipelined LUT/comparator commit-gate fabric (`~6.25 × 10^8` cycles per `25 s` window). Software: `209,261` discrete pendulum Lyapunov (`Vdot`) and Control Barrier Function (`CBF`) checks (`NI-1..NI-4`) plus synthetic `Zipf(s = 1.1)` cascade streams.
- **Baselines Compared**: KV260: halted-clock vs. free-running `25 MHz` gate fabric on the same SOM (`A/B/A` difference). Software: unguarded actuator pass-through and always-frontier single-tier invocation.
- **Runs (`N`) & Uncertainty / Spread**: KV260 `INA260`: `N = 4` interleaved `A/B/A` passes (`15 s` thermal settle + `25 s` sampling at `~4 Hz` ≈ `100` readings/window), mean `11,428 pJ/cycle`, `SE = 129 pJ` (`+0.2857 W`, `SE = 0.0032 W`); seed-fabric delta `98.0 pJ`, `SE = 30.8 pJ` (inconclusive near `1.25 mA` LSB). Pendulum simulation: `N = 209,261` deterministic states (`95%` Clopper–Pearson UB `<= 1.43 × 10^-5`).
- **Cold vs. Warm Caching Scope**: Hardware gate is stateless combinational/pipelined (`0` cache). Software `MoL` cascade separates cold first-exposure misses (`0%` hit rate) from warm `Zipf(s = 1.1)` memoized hits (`16.7x` call reduction only under stationary task repetition; requires hash invalidation on spec edits).
- **Artifact & License Status**: Manuscript and CSV logs (`CC0-1.0`); `openIE-dev/mixture-of-limits` (`Apache-2.0`); KV260 bitstream/bench scripts self-checked by OpenIE, not externally replicated.

## Problem, Scope & Sensor Boundary

A commit gate interposes a fast, deterministic admissibility check between an untrusted proposer and an irreversible state change `[M]`. Earlier blog headlines presented `11.43 nJ` and `zero bad commits` without naming the whole-module rail boundary, sensor quantization step, or finite-sample statistical bound. Grounding directly in `src/content/papers/gates.md` restores all three engineering qualifiers `[E]`.

## KV260 Whole-SOM Shunt Measurement & Pendulum Simulation

- **Whole-SOM `INA260` power-slope protocol `[E, measured_j]`:** On AMD Kria KV260, the onboard TI `INA260` sits on `VCC_SOM` (`~5.04 V`), metering the entire System-on-Module (ARM Cortex-A53 PS, UltraScale+ PL fabric, DDR4 memory, and DC-DC regulators) rather than an isolated core LUT rail. Across `N = 4` interleaved `A/B/A` halt-vs-run passes (`15 s` settle, `25 s` capture at `~4 Hz` while stepping `2.4999 × 10^7` 8-lane cycles/s = `~6.25 × 10^8` cycles/window), active clocking added `+0.2857 W` (`SE = 0.0032 W`), giving **11,428 pJ/cycle (`11.43 nJ`, `SE = 129 pJ`, or `~1.43 nJ/lane`)** `[E]`.

- **Inconclusive sub-LSB seed delta `[E]`:** Comparing two internal LUT seed configurations shifted `VCC_SOM` power by only `+0.0098 W` (`98.0 pJ/cycle`, `SE = 30.8 pJ`), or `~1.96 mA` at `5 V`—barely `1.5x` the `INA260` `1.25 mA` ADC step (`5 mA` max offset). The primary paper therefore classifies the `98 pJ` isolated-logic estimate as **inconclusive** without a dedicated low-ohm core-rail shunt `[E]`.

- **Simulated Lyapunov/CBF gate (`209,261` states) `[E, M]`:** Evaluating quantized integer gate checks over `9,261` uniform grid points (`21^3`) plus `200,000` boundary-concentrated Monte Carlo draws produced **0 observed false allows in 209,261 simulated trials (95% Clopper–Pearson upper bound <= 1.43 × 10^-5, ~1.4 per 100,000, under the tested fault generator; fuzzing/simulation cannot prove absence of bugs)** and `79` (`0.038%`) conservative boundary refusals caused by fixed-point guard margins `[E]`.

## Limitations, Predicate Disagreement (`NI-4`) & Caching Scope

- **Different safety predicates admit different actions (`NI-4`) `[E]`:** In experiment `NI-4`, comparing a port-Hamiltonian passivity gate (`lut_and_safe_ph`: `0` `Vdot` violations, `4` barrier `h < 0` excursions) against a Control Barrier Function set-invariance gate (`cbf_energy_set`: `0` `h < 0` excursions, `3` `Vdot` spikes) showed explicit disagreement—proving that a gate enforces only the exact mathematical predicate encoded, not generic physical safety `[E]`.

- **Zipfian memoization vs. cold generalization `[M]`:** The `MoL` software simulation (`16.7x` fewer frontier model invocations) models an idealized `Zipf(s = 1.1)` workload where identical canonicalized tasks recur frequently. On strictly unique cold inputs, the lookup rung misses `100%` of the time and adds gate-check overhead `[M]`.

## Energy & Telemetry Scope

Only the KV260 `VCC_SOM` `INA260` reading (`11.43 nJ/cycle`) carries `measured_j` status; software `OpCounter` constants in the paper (such as placeholder `1 pJ` LUT weights) are `est_j` analytical weights explicitly excluded from hardware claims `[E, M]`. Relative to a `~50–100 J` workstation LLM call (`reported_j` in companion studies), a microsecond-scale deterministic gate check is orders of magnitude smaller, though cross-tier (`measured_j` vs `reported_j`) numbers are never ratioed directly (`measured_j ⊥ reported_j`).

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Whole-SOM DC Shunt (measured_j)
- **Telemetry Disclosure**: AMD Kria KV260 whole-SOM VCC_SOM TI INA260 shunt (11.43 nJ/cycle, N=4 passes); 98 pJ seed delta inconclusive near 1.25 mA LSB.
- **Evidence Class**: `measured_j` (`board_metered = true`)
- **Catalog Anchor Reading**: `1.1428e-08 J (measured_j)`
- **Sensor / Formula Scope**: AMD Kria KV260 whole-SOM VCC_SOM TI INA260 halt-vs-run power-slope shunt (11,428 pJ/cycle, SE = 129 pJ, N = 4 passes at 25 MHz)

## Related Work & Primary Literature (`[S]`)

- **Ames et al. (IEEE TAC, 2017) & Ortega et al. (Automatica, 2002):** Control Barrier Functions (CBFs) and port-Hamiltonian passivity for safety-critical control `[S]`.
- **Simplex Architecture (Sha, IEEE Software 2001):** Runtime assurance switching between high-performance untrusted controllers and verified safety envelopes `[S]`.
- **FrugalGPT (Chen et al., 2023) & RouteLLM (Ong et al., ICLR 2025):** Multi-tier LLM cascades trading cheap routing steps against frontier model calls `[S]`.
- **Umuroglu et al. (LogicNets, FPL 2020):** Quantized LUT-fabric inference on Xilinx FPGAs `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/gates/](https://blog.openie.dev/posts/gates/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/gates/](https://research.openie.dev/papers/gates/) ([PDF](https://research.openie.dev/pdfs/gates.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/gates-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/gates-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=gates)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
