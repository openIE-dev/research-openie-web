# Satiation Benchmark (SATB) Harness: 5-Host Telemetry Audit, Kepler Splitting Errors, and Co-Tenant Falsifiers

*Cross-platform audit of the sequential Rust SATB harness (12/12 C1-C12 checks) across Jetson AGX Thor DC shunts and 4 counter hosts, exposing 32.6%-89.9% CPU-splitting errors and Windows tick aliasing.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/satb-harness/](https://blog.openie.dev/posts/satb-harness/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/satb-harness/](https://research.openie.dev/papers/satb-harness/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/openie-artifact-substrate](https://github.com/openIE-dev/openie-artifact-substrate)  
> **Canonical Artifact ID**: `blake3:tv:87f465518d6db67ded6205ef9c2b11b5ec15f9216f750aa4dd9caf236e1d3238` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `measured_j`

---

![SATB Harness — 5-host telemetry audit exposing 32.59%-89.88% proportional splitting errors](https://research.openie.dev/media/tv/posters/satb-harness-poster.jpg)
*Five-host SATB conformance and telemetry attribution audit (Thor INA238/INA3221 measured_j + 4 reported_j hosts; L0 wall analyzer unattached). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · 5-Host Deterministic Replay]** The sequential Rust `SATB` harness (`ContextRule_v0` 80% oldest-tool-output elision, `Truncate_v0` `8 + 8 KiB` cap) passed **`12/12` conformance checks (`C1–C12`)** and replayed `Shape D` (`15027705736`) and `C9` (`149,747 B`) with **0 byte diffs** across macOS `arm64`, Tegra Linux `aarch64`, two x86-64 Linux hosts, and bare-metal Windows 11 Pro.
2. **[E · Falsifiers 2 & 3: Attribution Errors]** Comparing ground-truth rail/counter deltas against cloud-native CPU-utilization proportional splitting (`Kepler` heuristic) revealed **32.59% to 89.88% energy attribution error** (`Falsifier 2`), while Windows `GetProcessTimes` `15.625 ms` scheduler-tick aliasing undercounted short subprocess bursts by **-89.88%** (`Falsifier 3`, resolved only via `QueryProcessCycleTime` + `TerminateJobObject` `2.458 ms` cleanup).
3. **[E · Falsifier 6: Shared-Host Honesty]** Whenever pre/post idle power drifted by `> 5.0%` due to co-tenant OS activity, `Falsifier 6` automatically withheld net marginal attribution (`A1 = null`) while preserving raw unattributed `measured_j` / `reported_j` logs.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: (1) NVIDIA Jetson AGX Thor (`TI INA238 VIN` L1 + 3-channel `INA3221 VDD_GPU / VDD_CPU_SOC_MSS / VIN_SYS_5V0` L2 DC shunts, `measured_j`); (2) Apple M5 Max (`IOReport` L2 + `ri_energy_nj` L3 `reported_j`); (3) AMD Ryzen AI Max+ 395 (`0440 root:energy` `RAPL` L2 + Radeon 8060S `PPT` `reported_j`); (4) Intel Core i9-13900H (`RAPL psys` L1 + `pkg-0` L2 `reported_j`); (5) Windows 11 Pro (`Core i7-1165G7` + `RTX 2060` `nvml.dll` L2 `reported_j`). External AC wall analyzer (`L0`): not attached.
- **Workload & Suite**: `12` harness conformance suites (`C1–C12`: truncation, context elision, timeout job-tree kill `C10`, canonical JSON/receipt replay `C9`) plus counterbalanced CPU, memory-bandwidth, and GPU-offload attribution stress workloads.
- **Baselines Compared**: Kepler-style CPU-time-ratio energy attribution (`Falsifier 2`), Win32 `GetProcessTimes` tick accounting (`Falsifier 3`), and naive single-baseline idle subtraction (`Falsifier 6`).
- **Runs (`N`) & Uncertainty / Spread**: `12/12` conformance pass across all `5` hosts (`0` byte diffs); attribution error range `32.59%–89.88%` across memory/GPU stress pairs; co-tenant drift threshold fixed at `5.0%` pre/post quiescent shift.
- **Cold vs. Warm Caching Scope**: Loopback proxy explicitly logs `Shape D` exact-replay hits separately from live `Shape M/H/I` model invocations so cached runs cannot masquerade as fresh inference.
- **Artifact & License Status**: Envelope/non-mixing linter public in `openIE-dev/openie-artifact-substrate` (`Apache-2.0`); full multi-host raw telemetry CSVs published on `research.openie.dev` (`CC0-1.0` text).

## Problem, Telemetry Taxonomy (`L0–L4 × A1–N`) & Scope

Software energy papers routinely treat container CPU-share heuristics, OS process counters, and physical DC shunts as interchangeable "joules." `SATB` defines a two-dimensional provenance lattice crossing **sensor boundary** (`L0` AC wall plug, `L1` whole-board DC input, `L2` SoC/package domain, `L3` kernel per-process counter, `L4` analytical proxy) with **attribution discipline** (`A1` isolated quiesced net delta, `A2` unisolated gross delta, `D` kernel-assigned, `N` withheld) `[M, E]`.

## Five-Host Audit Results & Exposed Attribution Failures

- **Physical shunt vs. proportional-CPU heuristics (`Falsifier 2`) `[E]`:** On Jetson AGX Thor (`INA238` + `INA3221` `measured_j`) and dual-counter workstations (`reported_j`), memory-bound and GPU-dispatched tasks consumed minimal CPU ticks while drawing substantial DRAM/GPU rail power, causing `Kepler`-style CPU-utilization splitting to misattribute **32.59% to 89.88%** of actual energy `[E]`.

- **Windows scheduler-tick aliasing (`Falsifier 3`) `[E]`:** On bare-metal Windows 11 Pro (`Core i7-1165G7` + `RTX 2060`), `GetProcessTimes` quantizes execution to `15.625 ms` (`64 Hz`) clock interrupts, undercounting short bursts by **-89.88%**; switching to hardware `QueryProcessCycleTime` plus `TerminateJobObject` (`2.458 ms` tree teardown in `C10`) closed the gap `[E]`.

- **PLATYPUS-safe rootless Linux `RAPL` `[E]`:** Following `CVE-2020-8694` (`PLATYPUS`), Linux `powercap` files default to `0400 root:root`; `SATB` documents dedicated `0440 root:energy` group provisioning on dedicated test benches rather than `sudo` benchmark execution `[E, S]`.

## Limitations, Unmetered `L0` Wall Boundary & Falsifier 6

- **No `L0` AC wall-plug power analyzer:** `L0` (`PSU` losses + AC power factor, e.g., Yokogawa WT310E) was **not attached** on any of the five hosts (`L0 = unmetered`) `[E]`.

- **Shared-host refusal (`Falsifier 6`):** Whenever background OS tasks shifted pre/post idle baselines by `> 5.0%`, `SATB` refused to emit net `A1` marginal joules—a conservative refusal that fired repeatedly on busy developer machines (e.g., `109/170` whole-chip windows in `ai-reads-human`) `[E]`.

## Energy & Telemetry Scope

Only Jetson AGX Thor `INA238`/`INA3221` channels carry `measured_j`; Apple M5 Max (`IOReport`/`ri_energy_nj`), AMD Strix Halo (`RAPL`/`PPT`), Intel Raptor Lake (`RAPL`), and Windows 11 (`NVML`) are strictly `reported_j`, never summed or directly ratioed against `measured_j` `[E]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: DC Shunt + 4-Host Counters (Non-Mixed)
- **Telemetry Disclosure**: Jetson AGX Thor TI INA238/INA3221 DC shunts (measured_j) kept strictly separate from 4 reported_j hosts; L0 AC wall meter unattached.
- **Evidence Class**: `measured_j` (`board_metered = true`)
- **Catalog Anchor Reading**: `0.00142 J (measured_j)`
- **Sensor / Formula Scope**: NVIDIA Jetson AGX Thor physical TI INA238 VIN L1 & 3-channel INA3221 L2 DC shunts (strictly separated from 4 reported_j hosts)

## Related Work & Primary Literature (`[S]`)

- **Amaral et al. (Kepler, IEEE CLOUD 2023):** Kubernetes eBPF/counter proportional container power estimation audited by `Falsifier 2` `[S]`.
- **Lipp et al. (PLATYPUS, IEEE S&P 2021):** Power side-channel attacks motivating root-restricted Linux `powercap` permissions (`CVE-2020-8694`) `[S]`.
- **Khan et al. (ACM TOMPECS 2018) & Yang et al. (NVML accuracy, 2024):** Validation and sampling-window limits of Intel `RAPL` and NVIDIA `NVML` counters `[S]`.
- **CodeCarbon & Scaphandre:** Open-source host energy trackers compared against `SATB` `L0–L4 × A1–N` provenance gating `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/satb-harness/](https://blog.openie.dev/posts/satb-harness/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/satb-harness/](https://research.openie.dev/papers/satb-harness/) ([PDF](https://research.openie.dev/pdfs/satb-harness.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/openie-artifact-substrate](https://github.com/openIE-dev/openie-artifact-substrate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/satb-harness-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/satb-harness-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=satb-harness)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
