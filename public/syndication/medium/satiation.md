# Task Satiation vs. Aggregate Jevons Rebound: Bounded UnitSpecs Meet Elastic Fleet Demand

*Separates per-task verification satiation (where extra compute after C(z)=1 adds zero utility) from macro-scale Jevons rebound, where cheaper per-task AI historically expands total electricity demand.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/satiation/](https://blog.openie.dev/posts/satiation/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/satiation/](https://research.openie.dev/papers/satiation/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:3ea9cd43444f33d5bae2a87a6c253bc8b45889597003b30a4b10f956c078b304` · **Evidence Tags**: `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Task Satiation vs Aggregate Rebound — per-task satiation under C(z)=1 vs macro Jevons elasticity](https://research.openie.dev/media/tv/posters/satiation-poster.jpg)
*Analytical separation between single-task specification satiation and fleet-wide Jevons rebound (joules = null, unmetered). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M · Micro-Level Task Satiation]** On any task governed by a sound binary completeness check `C(z) = 1` (such as an exact compile+test repair or proved theorem), marginal utility of extra tokens after the first verified hit is zero—contrasting with open-ended creative or adversarial loops that lack a stopping criterion.
2. **[M/S · Macro-Level Rebound Caveat]** Micro-efficiency **does not guarantee lower grid electricity**: under the standard elasticity identity `d ln E_total / d ln eta = epsilon_d - 1`, cutting joules per task expands the set of economically viable automated workflows and **raises total fleet power** whenever demand price elasticity `epsilon_d > 1` (backfire / Jevons paradox).
3. **[S · Empirical Macro Context]** Synthesizes Nordhaus (1996) lighting lumen-price history (`> 1,000x` efficiency gain paired with rising total lighting electricity share) and IEA (2024/2026) global datacenter electricity projections (`~415 TWh` toward `~945 TWh` by 2030).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Analytical microeconomic stopping-time models paired with published macro-energy elasticity literature.
- **Workload & Suite**: No primary hardware benchmark run in this study; synthesizes historical efficiency/rebound series and IEA datacenter electricity reports.
- **Baselines Compared**: Closed-specification gated tasks (`C(z) in {0,1}` finite stopping rule) vs. unbounded best-of-N / open-ended quality tournaments.
- **Runs (`N`) & Uncertainty / Spread**: Not applicable (`N = 0` primary lab trials; cites published IEA scenario ranges and Sorrell 2009 econometric elasticity intervals).
- **Cold vs. Warm Caching Scope**: Notes that exact-match caching lowers marginal cost on recurring queries toward zero, further steepening the micro price drop that drives new extensive-margin adoption.
- **Artifact & License Status**: Public-domain manuscript (`CC0-1.0`) at `research.openie.dev/papers/satiation/`; self-checked, not externally peer-reviewed.

## Problem: Why Micro-Efficiency Claims Overshoot Macro Grid Reality

Engineering blogs routinely extrapolate a `10x` or `100x` kernel energy reduction into an equivalent cut in global datacenter power. `satiation` was written specifically to **reject that naive extrapolation** `[M, S]`. By separating the **intensive margin** (joules spent to close one fixed task) from the **extensive margin** (how many tasks society chooses to run once each task costs millicents instead of dollars), the paper reconciles bounded per-task verification with rising aggregate AI power draw `[M, S]`.

## Two Regimes: Bounded UnitSpecs vs. Elastic Extensive Margins

- **Bounded per-task satiation `[M]`:** When a caller needs a specific file parsed, a deterministic state step run, or a bug patched against a sound specification, stopping immediately upon `C(z) = 1` removes wasted post-solution sampling (such as `30x` same-task agent token variance documented by Bai, Huang & Wang 2026) `[M, S]`.

- **Extensive-margin Jevons rebound `[S, M]`:** Jevons (1865), Khazzoom (1980), Brookes (1990), Saunders (1992), and Nordhaus (1996) demonstrate that drastic reductions in the cost of an intermediate input (coal per horsepower-hour, watts per lumen, or joules per verified inference) induce substitution and new application categories `[S]`. Even if every individual coding check drops `100x` in energy, running continuous background verification across millions of repositories can increase aggregate kWh `[M]`.

## Limitations & Unresolved Elasticity Parameters

- **Demand elasticity for AI tasks is unmeasured:** Whether long-run price elasticity `epsilon_d` for verified software/automation tasks sits below `1` (partial rebound, net energy savings) or above `1` (Jevons backfire) is an open empirical macro-econometric question not measured here `[M, S]`.

- **Positional / adversarial arms races do not satiate:** Tasks with relative payoffs (high-frequency trading, ad-auction bidding, cyber offense/defense) lack a finite `C(z) = 1` satiation point regardless of gate design `[M]`.

## Energy & Telemetry Scope

This study is `unmetered` (`joules = null`, `board_metered = false`); datacenter terawatt-hour figures (`~415 TWh` to `~945 TWh`) are cited directly from International Energy Agency (IEA) reports `[S]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Economic Synthesis
- **Telemetry Disclosure**: Analytical micro-satiation vs macro Jevons rebound model citing IEA TWh series; joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered economic stopping-time and Jevons elasticity synthesis (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Jevons (1865), Khazzoom (Energy J., 1980) & Saunders (Energy J., 1992):** Foundational theory of resource rebound and growth-inducing efficiency gains `[S]`.
- **Sorrell (UKERC Review, 2009) & Gillingham, Rapson & Wagner (Rev. Environ. Econ. Policy, 2016):** Empirical bounds on direct, indirect, and economy-wide rebound effects `[S]`.
- **Nordhaus (NBER, 1996):** Two-century price-per-lumen and lighting demand series `[S]`.
- **International Energy Agency (IEA Energy and AI, 2024–2026):** Global datacenter electricity baselines and 2030 scenario projections `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/satiation/](https://blog.openie.dev/posts/satiation/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/satiation/](https://research.openie.dev/papers/satiation/) ([PDF](https://research.openie.dev/pdfs/satiation.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/satiation-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/satiation-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=satiation)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
