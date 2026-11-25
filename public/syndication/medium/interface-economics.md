# Interface Economics: Analytical Cost Models of Ambiguity, Verification Boundaries, and Handoff Contracts

*An unmetered microeconomic and information-theoretic cost model comparing ambiguous natural-language handoffs against typed, deterministically verified interfaces.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/interface-economics/](https://blog.openie.dev/posts/interface-economics/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/interface-economics/](https://research.openie.dev/papers/interface-economics/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:6cee9f2f140f50dfe0d3b09bfab0b718b3f208c720a149f06e287da7d1412f55` · **Evidence Tags**: `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Interface Economics — analytical transaction-cost model of typed vs ambiguous handoffs (unmetered)](https://research.openie.dev/media/tv/posters/interface-economics-poster.jpg)
*Analytical transaction-cost and channel-coding model of interface boundaries (joules = null, unmetered). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M · Analytical Cost Model, unmetered]** Models handoff cost as the sum of upfront specification cost `C_spec`, serialization/channel work `C_chan`, boundary verification `C_gate`, and probability-weighted downstream failure remediation `p_err * L_downstream`—showing analytically that typed deterministic gates dominate when `C_spec + C_gate < Delta p_err * L_downstream`.
2. **[M · Regime Reversal When Exploration Dominates]** Explicitly identifies the counter-regime: on one-off exploratory prototypes (`N_reuse = 1`) with low failure severity (`L_downstream` small) and fluid requirements, heavy upfront formalization **loses** to lightweight natural-language iteration.
3. **[S · Classical Institutional Lineage]** Connects software API/gate design directly to Coasean transaction costs, Williamsonian incomplete contracts, and Marschak–Radner team theory without claiming empirical field-experiment validation in this paper.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Closed-form algebraic cost-accounting propositions and literature synthesis.
- **Workload & Suite**: No empirical software or organizational dataset collected in this study.
- **Baselines Compared**: Analytical comparison: unverified prose handoffs (`C_spec` low, `p_err` high) vs. schema-typed, gate-checked handoffs (`C_spec` paid once, amortized over `N` calls).
- **Runs (`N`) & Uncertainty / Spread**: Not applicable (`N = 0` empirical runs; hand-derived algebraic inequalities `[M]`, not proof-assistant formalized).
- **Cold vs. Warm Caching Scope**: Models amortization over `N` repeated interface crossings: upfront schema design behaves like compilation, requiring `N > N_crit` crossings before net savings turn positive.
- **Artifact & License Status**: Public-domain manuscript (`CC0-1.0`) at `research.openie.dev/papers/interface-economics/`; self-checked, not externally peer-reviewed.

## Problem, Scope & Theoretical Boundary

Why do software teams and multi-agent pipelines spend so much effort translating structured state into English prose and parsing it back out? `interface-economics` treats this question as an **unmetered analytical modeling essay (`[M]`, `[S]`)**, extending transaction-cost economics (Coase 1937; Williamson 1979) and team information theory (Marschak & Radner 1972) to human-machine and agent-to-agent APIs `[S]`. No live enterprise RCT or hardware joule meter is run in this paper.

## Analytical Trade-Off: Upfront Specification vs. Downstream Remediation

Across a chain of `k` sequential handoffs where each unverified step admits a subtle interpretation error with probability `q`, end-to-end survival decays exponentially as `(1 - q)^k` `[M]`:

- **Amortized production interfaces (`N >> 1`, high `L_downstream`):** Paying a fixed schema and verifier cost once collapses `q` on covered invariants and amortizes `C_spec / N` toward zero across repeated calls `[M]`.

- **Exploratory one-offs (`N = 1`, shifting goals):** When the human principal does not yet know which product feature to build, rigid formal interfaces lock in premature assumptions and cost more than conversational prototyping `[M]`.

## Limitations & Falsifiers

- **Hand-derived stylized parameters:** Propositions assume stationary error probabilities and separable specification costs; in real organizations, specification maintenance incurs ongoing versioning overhead whenever upstream requirements drift `[M, S]`.

- **No empirical parameter estimation here:** Empirical measurements of prose vs. binary handoff overhead (`75,374x` Thor `measured_j` in `CTA-E4` and `2,053.8x` parse `reported_j` in `ai-reads-human`) live in companion engineering studies, not in this economic framing note.

## Energy & Telemetry Scope

Strictly `unmetered` (`joules = null`, `board_metered = false`). References to compute waste in the prose represent abstract cost terms rather than instrumented watt-seconds.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Analytical Cost Model
- **Telemetry Disclosure**: Closed-form microeconomic handoff model and institutional literature synthesis; 0 field trials, joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered transaction-cost and interface-contract analytical model (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Coase (Economica, 1937) & Williamson (Journal of Legal and Economic Studies, 1979):** Transaction-cost theory of firm and contract boundaries `[S]`.
- **Marschak & Radner (1972) & Arrow (1974):** Economic theory of teams and organizational information channels `[S]`.
- **Parnas (CACM, 1972) & Meyer (IEEE Computer, 1992):** Information-hiding module boundaries and Design by Contract `[S]`.
- **Simon (1971):** Designing organizations for an information-rich world where attention and verification, not raw text generation, are the scarce bottleneck `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/interface-economics/](https://blog.openie.dev/posts/interface-economics/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/interface-economics/](https://research.openie.dev/papers/interface-economics/) ([PDF](https://research.openie.dev/pdfs/interface-economics.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/interface-economics-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/interface-economics-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=interface-economics)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
