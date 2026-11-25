# Goal-Holding Agents Under Budget Guards: Pre- and Post-Fix Overspend Audit and Replication Limits

*Pre-fix (36/5,400 overspends) and post-fix (0/10,800 overspends) budget-guard experiments across 30 Sudoku tasks, fired falsifiers (R-F1..R-F6), non-replicating tight-budget gains, and on-chip reported_j limits.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/agency/](https://blog.openie.dev/posts/agency/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/agency/](https://research.openie.dev/papers/agency/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)  
> **Canonical Artifact ID**: `blake3:tv:7da82d901b877b47d94327d99418d995f9ba998d898a17a75f32efebd8f3708f` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `reported_j`

---

![Goal-Holding Agents Under Budget Guards — pre-fix 36/5,400 vs post-fix 0/10,800 overspends and fired falsifiers](https://research.openie.dev/media/tv/posters/agency-poster.jpg)
*Primary-paper summary: pre-fix (36/5,400) vs. post-fix (0/10,800) budget-guard audit, fired falsifiers R-F1..R-F6, and non-replicating tight-budget gains (reported_j). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · reported_j, Darwin ri_energy_nj & Linux RAPL]** Before fixing the guard boundary, **36 of 5,400 episodes** overspent their declared budget in exploratory Run 1 (firing falsifier `R-F2`); moving goal comparison and receipt logging inside the guard reduced overspends to **0 of 10,800 episodes** (`0/5,400` per half) in preregistered Run 2 and Machine 2 Part B cycle accounting, whereas Machine 2 Part A raw Linux `RAPL` per-act checks recorded **320–327 overspends per condition** because `0.04 ms` acts fell below `~1 ms` `RAPL` counter update granularity.
2. **[E · Negative Result & Fired Falsifiers]** Exploratory Run 1 showed `+2.65` extra closed Sudoku tasks at tight budget `B = 1.0`, but **that tight-budget gain did not replicate** in preregistered Run 2 or on Machine 2 (shared-task joules were statistically indistinguishable, and only loose-budget `B = 2.0` closure `+2.8` / `+0.825` tasks replicated); falsifiers `R-F1` (guard overhead), `R-F4` (cross-machine ranking reversal `Kendall tau-b = -0.037`), `R-F5` (`CV > 0.25` on unquiesced hosts), and `R-F6` (integrated derivative mismatch) also fired.
3. **[M · Unit Positivity, Not Tight Hardware Floor]** Comparing macro-CPU episode joules (`3.6 × 10^14` to `5.0 × 10^15` times `k_B T ln 2`) against Landauer bit-erasure checks bookkeeping sign positivity (`R-F7`), **not** tight operational proximity to physical thermodynamic limits on out-of-order processors.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Machine 1: Apple Silicon macOS (`proc_pid_rusage` `ri_energy_nj` L3 `reported_j`). Machine 2: x86-64 Linux (`powercap` `intel-rapl` package counter L2 `reported_j` in Part A; calibrated cycle counter in Part B). Unquiesced hosts (`quiet_window = no`); no external DC shunt or AC wall meter (`measured_j = null`).
- **Workload & Suite**: 30 bounded constraint-propagation and backtracking Sudoku episodes evaluated across 3 budget levels (`B = 0.5, 1.0, 2.0` normalized units).
- **Baselines Compared**: Three internal controller arms: adaptive tempo/cascade (`sigma-selector`), fixed heuristic cascade, and goal-blind unguarded loop. External LLM/solver baselines: not benchmarked in this study.
- **Runs (`N`) & Uncertainty / Spread**: Run 1: `N = 5,400` episodes (`20` seeds × `3` arms × `3` budgets × `30` tasks). Preregistered Run 2: `N = 10,800` episodes (`40` seeds, split into two `5,400`-episode halves). Machine 2: `N = 10,800` episodes per part. Episode energy `CV > 0.25` at binding budgets (`R-F5` fired).
- **Cold vs. Warm Caching Scope**: Stateless per-episode solver resets (`0` cross-episode solution memoization); OS page cache warm across sequential seeds.
- **Artifact & License Status**: Primary manuscript and falsifier tables public (`CC0-1.0`); experiment summaries in `openIE-dev/openie-research-experiments` (`Apache-2.0`, self-checked, externally unreproduced).

## Problem, Scope & Framing Qualifiers

The primary paper defines an engineered goal-holding agent operationally as a control loop maintaining a target predicate under an explicit energy budget `[M]`. Earlier blog summaries compressed a heavily qualified, self-critical manuscript into sweeping thermodynamic slogans. In reality, modern out-of-order CPUs operate `14` to `15` orders of magnitude above `k_B T ln 2` (`3.6 × 10^14` to `5.0 × 10^15` times the `300 K` Landauer floor in these runs) `[E]`. Referencing Landauer in the formal model serves strictly to enforce positive physical units (`e_act > 0`, falsifier `R-F7`), not to claim that high-level software schedulers approach physical bit-erasure limits `[M]`.

## Mechanism, Experimental Results & Guard Fix

The experimental harness compares three internal control arms (`sigma-selector` adaptive routing, fixed cascade, and goal-blind baseline) across `30` Sudoku constraint tasks at three budget caps (`B = 0.5, 1.0, 2.0`) `[E]`. A central engineering lesson came from an accounting bug caught between Run 1 and Run 2:

- **Exploratory Run 1 (Pre-Fix, `N = 5,400` episodes):** Goal-comparison and receipt-emission costs executed *after* the pre-act budget check. As a result, **36 of 5,400 episodes** overspent their cap (`9` `sigma-selector` and `7` fixed-cascade episodes at `B = 1.0`, plus `20` goal-blind episodes at `B = 0.5`), firing falsifier `R-F2` `[E]`.

- **Preregistered Run 2 (Post-Fix, `N = 10,800` episodes across two `5,400`-episode halves):** Reserving worst-case comparison plus receipt cost inside the guard before committing an act reduced overspends to **0 of 10,800 episodes** (`0/5,400` in each half; 95% Clopper–Pearson upper bound `<= 3.42 × 10^-4` per episode under the tested workload) on Darwin `ri_energy_nj` and Machine 2 Part B cycle accounting `[E]`.

- **Sub-Millisecond Counter Aliasing (Machine 2 Part A):** When the guard instead polled raw Linux `RAPL` package counters directly on `~0.04 ms` solver acts, `RAPL` updated only every `~1 ms` (`[S]`, Khan et al., 2018), letting dozens of unbilled micro-acts slip past stale readings and causing **320 to 327 overspends per condition** `[E]`.

## Limitations, Negative Results & Fired Falsifiers

Unlike promotional summaries, the primary manuscript documents six fired falsifiers and a failed replication that narrow what this study supports `[E]`:

- **Tight-budget gain did not replicate:** Run 1 suggested `+2.65` additional solved tasks for `sigma-selector` at `B = 1.0`, but preregistered Run 2 and Machine 2 Part B showed **no tight-budget advantage**, and energy per solved task on mutually completed instances was equal (`R-F3` fired in Run 1). Only the loose-budget (`B = 2.0`) closure gain (`+2.8` tasks on Machine 1; `+0.825` on Machine 2 Part B) replicated `[E]`.

- **Cross-host ranking instability & host noise:** Cross-substrate progress-per-joule rank correlation reversed on Machine 2 (`Kendall tau-b = -0.037`, firing `R-F4`), binding-budget coefficient of variation exceeded `0.25` (`R-F5`) because background OS daemons were not quiesced (`quiet_window = no`), guard bookkeeping overhead fired `R-F1` on tiny steps, and integrated `iota` rankings diverged from mean `J*` (`R-F6`) `[E]`.

## Energy & Telemetry Scope

All energy readings in this study are operating-system or on-chip `reported_j` estimates (`macOS proc_pid_rusage ri_energy_nj` L3 and `Linux powercap RAPL` L2; `measured_j = null`, `board_metered = false`) `[E]`. Relative comparisons are valid only within the same host and counter channel on coarse multi-millisecond windows; fine-grained act accounting requires deterministic cycle/instruction budgets calibrated against external DC shunts rather than sub-millisecond `RAPL` polling `[E]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: On-Chip Counter (reported_j)
- **Telemetry Disclosure**: macOS Darwin ri_energy_nj L3 & Linux RAPL L2 on-chip counters; measured_j = null (no wall meter).
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.085 J (reported_j)`
- **Sensor / Formula Scope**: Darwin ri_energy_nj L3 & calibrated Linux cycle/RAPL counters across Sudoku budget-guard episodes (measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Landauer (1961) & Bennett (1973):** *IBM J. Res. Dev.* 5(3) and 17(6) — physical bit-erasure lower bounds (`k_B T ln 2`), cited strictly for unit positivity rather than macro-CPU operational floors `[S]`.
- **Horowitz (ISSCC 2014) & Khan et al. (ACM TOMPECS 2018):** Empirical silicon instruction/DRAM energy scales (`pJ–nJ`) and Linux `RAPL` `~1 ms` update-interval and thermal-drift characterization `[S]`.
- **Zeng et al. (ECOSystem, ASPLOS 2002) & Roy et al. (Cinder, EuroSys 2011):** Operating-system currentcy/reserve/tap abstractions that precede per-episode agent budget guards `[S]`.
- **Simon & Kadane (1975) & Russell & Wefald (1991):** Satisficing search and bounded metareasoning under explicit computational cost constraints `[S]`.
- **FrugalGPT (Chen, Zaharia & Zou, 2023) & RouteLLM (Ong et al., ICLR 2025):** Cost-bounded multi-model routing cascades in modern language-model serving `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/agency/](https://blog.openie.dev/posts/agency/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/agency/](https://research.openie.dev/papers/agency/) ([PDF](https://research.openie.dev/pdfs/agency.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/agency-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/agency-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=agency)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
