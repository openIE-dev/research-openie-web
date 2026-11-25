# JouleOS: An Unmetered Operating-System Design Proposal, Provenance-Lattice Checks (78,400 Pairs), and Prior Energy-OS Lineage

*Explicitly scopes JouleOS as an unmetered architectural proposal (core OS repo private; ~10^5x README figure unverified), clarifies 78,400 = 280 x 280 provenance-lattice monotonicity checks, and cites ECOSystem, Cinder, Linux EAS, and RAPL.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/jouleos/](https://blog.openie.dev/posts/jouleos/)  
> **Primary Research Paper**: [https://research.openie.dev/products/jouleos/](https://research.openie.dev/products/jouleos/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:7dc57a2972460389e4fabd076f069c237545d6154f816d489335f8b3eed65e07` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![JouleOS Design Proposal — unmetered architecture review, 280x280=78,400 lattice checks, and ECOSystem/Cinder lineage](https://research.openie.dev/media/tv/posters/jouleos-poster.jpg)
*Unmetered OS design proposal: `280 × 280 = 78,400` provenance-lattice pair checks, candid private-repo disclosure, and prior OS energy-accounting lineage. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/E · Unmetered Design Proposal Disclosure]** `JouleOS` is an **unmetered architectural specification and design review (`energyClass = unmetered`, `joules = null`, `board_metered = false`)**—not a benchmarked production kernel beating Linux or macOS on hardware wattmeters. As disclosed in `src/content/products/jouleos.md`, the core JouleOS source tree is currently private, and an internal README’s `~10^5x` efficiency phrase is explicitly flagged as an **unverified project aspiration**, not an empirical measurement.
2. **[E · Reconciling the `78,400` Count]** Earlier summaries gave two conflicting descriptions of `78,400`. In the audited `jcp-satb-cad-spine` Rust workspace (`310` passing tests across 7 crates), **`78,400` is `280 × 280` ordered pairs of `(SATB sensor boundary L0..L4 × attribution discipline A1..N × mechanism)` states** exhaustively tested for meet-semilattice monotonicity (`0` silent provenance upgrades when combining heterogeneous energy channels)—it is **not** `78,400` kernel boot runs or hardware power traces.
3. **[S · Explicit Prior OS Energy Lineage]** JouleOS’s two-phase `hold`/`settle` capability budgets directly descend from **ECOSystem’s `currentcy` abstraction (Zeng et al., ASPLOS 2002)** and **Cinder’s hierarchical `reserves` and `taps` (Roy et al., EuroSys 2011)**, layered atop modern **Linux Energy Aware Scheduling (`EAS`), `cpufreq`/`schedutil`, and Intel/AMD `powercap` `RAPL` counters**.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Static architectural review plus deterministic Rust unit/property execution over provenance-lattice types (`jcp-satb-cad-spine`).
- **Workload & Suite**: `310` Rust unit/property tests across `7` specification crates, including exhaustive `280 × 280 = 78,400` lattice-join monotonicity checks and two-phase `hold`/`settle` ledger conservation checks.
- **Baselines Compared**: Qualitative architectural comparison against POSIX time-slice scheduling, Linux `EAS` / `schedutil`, `powercap` `RAPL`, `ECOSystem` (2002), and `Cinder` (2011). **Empirical OS scheduler benchmark vs. Linux/seL4: not run in this study.**
- **Runs (`N`) & Uncertainty / Spread**: Deterministic finite-lattice exhaustion (`N = 78,400` state pairs, `0` monotonicity violations; `310/310` unit tests passing; zero stochastic variance).
- **Cold vs. Warm Caching Scope**: Specifies kernel-level memoization of deterministic pure receipts (`JCR-1`) invalidated whenever capability/binary hashes change; not benchmarked on live syscall workloads here.
- **Artifact & License Status**: Design review (`CC0-1.0`) public at `research.openie.dev/products/jouleos/`; core JouleOS tree is **private / externally unreproduced** (shared envelope primitives in `openIE-dev/openie-artifact-substrate`, `Apache-2.0`).

## Scope Honesty: Design Specification vs. Shipped Kernel

Operating-system research has a thirty-year history of energy-first resource management—from **Odyssey (Flinn & Satyanarayanan, SOSP 1999)**, **ECOSystem (Zeng et al., ASPLOS 2002)**, and **Cinder (Roy et al., EuroSys 2011)** to shipping **Linux Energy Aware Scheduling (`EAS`)**, **`cpufreq`/`schedutil`**, and **`powercap` `RAPL`** `[S]`. Presenting JouleOS candidly requires stating upfront what exists today and what does not `[E]`:

- **What is verified today `[E]`:** A `7`-crate Rust specification spine (`310` tests) enforcing two-phase `hold`/`settle` joule-reserve accounting (preventing concurrent child tasks from double-spending a shared battery reserve) and checking **`280 × 280 = 78,400` pairs** of provenance tags so an analytical `est_j` (`L4`) or modeled `RAPL` (`L2`, see Schöne et al. 2021 on AMD Zen 2) reading can never silently promote to physical shunt `measured_j` (`L1`).

- **What is NOT measured or public `[E]`:** Bare-metal interrupt latency, page-table/IPC overhead against Linux or `seL4`, hardware wall-meter joules (`joules = null`), and the private core JouleOS repository (whose internal `~10^5x` README claim is explicitly withdrawn from evidentiary status in the primary review).

## How `JouleOS` Builds on `ECOSystem`, `Cinder`, and Linux `EAS`

Where **ECOSystem** unified device power under `currentcy` epoch allocations and **Cinder** introduced capability-delegated `reserves` and rate-limiting `taps` on HiStar `[S]`, JouleOS proposes two specific extensions for agentic workloads `[M]`: (1) **provenance-typed energy accounts** (`measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered`) so kernel scheduling policies know whether a rail reading came from a physical TI `INA3221` shunt or a modeled counter, and (2) **two-phase `hold`/`settle` commit receipts (`JCR-1`)** tied to task admission gates `[M]`.

## Limitations & Falsifiers

- **Accounting overhead risk:** If per-syscall `hold`/`settle` bookkeeping and `Ed25519` receipt batching consume more energy than dynamic voltage/frequency scaling or task refusal saves, net system energy worsens (analogous to `R-F1` in `agency`) `[M]`.

- **Private core tree:** External researchers cannot audit or build the private JouleOS kernel repository until source release.

## Energy & Telemetry Scope

Strictly `unmetered` (`joules = null`, `board_metered = false`).

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered OS Design Specification
- **Telemetry Disclosure**: Unmetered operating-system design specification (joules = null; core OS repo private; 78,400 = 280x280 Rust provenance-lattice pair checks).
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered operating-system architectural design proposal and 280x280 Rust provenance-lattice property suite (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Zeng, Ellis, Lebeck & Vahdat (ECOSystem, ASPLOS 2002) & Roy, Rumble, Stutsman, Levis, Mazières & Zeldovich (Cinder, EuroSys 2011):** Foundational operating-system `currentcy`, `reserve`, and `tap` energy-accounting kernels `[S]`.
- **Flinn & Satyanarayanan (Odyssey, SOSP 1999) & Sampson et al. (EnerJ, PLDI 2011):** Application-aware OS energy adaptation and type-isolated approximate/energy-aware execution `[S]`.
- **Linux Kernel `EAS` (Energy Aware Scheduling), `cpufreq`/`schedutil` & `powercap` `RAPL` (plus Schöne et al., 2021):** Mainline OS scheduler/DVFS integration and Zen/Intel counter telemetry limits `[S]`.
- **Klein et al. (seL4, SOSP 2009):** Capability-based microkernel architecture `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/jouleos/](https://blog.openie.dev/posts/jouleos/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/products/jouleos/](https://research.openie.dev/products/jouleos/) ([PDF](https://research.openie.dev/pdfs/jouleos.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/jouleos-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/jouleos-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=jouleos)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
