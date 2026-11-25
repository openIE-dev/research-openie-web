# Specification, Proposer, and Gate: The "Three-Body" Software Design Metaphor for Verifiable Automation

*An unmetered architectural framing paper using "Three-Body" strictly as a structural metaphor for separating Specifications, Proposers, and Deterministic Gates—not celestial mechanics.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/three-body/](https://blog.openie.dev/posts/three-body/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/three-body/](https://research.openie.dev/papers/three-body/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:16e4e4b439081a0ed33c49753fe852f5ef4a4ac5f32d4bdf70826f08da0e7738` · **Evidence Tags**: `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Specification, Proposer, and Gate — structural software design metaphor (unmetered)](https://research.openie.dev/media/tv/posters/three-body-poster.jpg)
*Structural design metaphor separating Specification, Proposer, and Deterministic Gate roles (unmetered framing paper; not celestial mechanics). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M · Explicit Metaphor Disclosure]** "Three-Body" in this essay is a **naming metaphor** for three interacting software roles (`Specification`, `Candidate Proposer`, `Deterministic Gate`); it invokes **no equations or chaos proofs from Poincaré/Newtonian gravitational three-body mechanics**.
2. **[M/S · Architectural Separation]** Coupling specification intent and acceptance authority inside a single stochastic generator makes silent drift undetectable; isolating an executable gate (`tests`, `typechecker`, `SAT/SMT`, or `proof kernel`) turns stochastic generation into bounded trial-and-check.
3. **[S · Cross-Study Scope]** This paper performs **zero new empirical runs** (`joules = null`, `unmetered`); concrete falsifiers and failure modes of imperfect specifications (such as Goodharting weak test suites) are evaluated in companion studies (`gates`, `deterministic-null`, and `rce-jepa`).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Conceptual software-architecture and interface-contract synthesis.
- **Workload & Suite**: No empirical benchmark suite executed in this manuscript; analyzes role separation across specification-proposer-verifier pipelines.
- **Baselines Compared**: Qualitative comparison against two-party human-prompt-to-LLM commit loops and unverified multi-agent natural-language debate.
- **Runs (`N`) & Uncertainty / Spread**: Not applicable (`N = 0` empirical trials in this framing paper; quantitative claims reside in companion empirical papers).
- **Cold vs. Warm Caching Scope**: Conceptual discussion only: notes that gated outputs can be indexed for exact recall only while the specification hash remains unchanged.
- **Artifact & License Status**: Public-domain essay text (`CC0-1.0`) on `research.openie.dev` and `blog.openie.dev`; no proprietary code required.

## Problem, Scope & Metaphor Disclosure

Upfront scope note: the title phrase *"Three-Body"* is used strictly as a **structural software metaphor** for a triad of distinct engineering artifacts—**(1) Specification**, **(2) Proposer**, and **(3) Deterministic Gate**—not as an application of gravitational orbital mechanics or Lyapunov chaos theory `[M]`. Earlier short summaries leaned on physical analogies without stating immediately that this manuscript is an unmetered architectural synthesis (`joules = null`).

In two-party LLM coding workflows, a human prompt asks a generative model both to interpret an underspecified goal and to judge whether its own patch succeeded `[S]`. Whenever model weights approximate acceptance checks heuristically, syntax errors, subtle regressions, and hallucinated APIs pass silently into production `[S]`.

## Mechanism: Decoupling Proposal Entropy from Gate Soundness

The paper formalizes a classic computer-science separation of concerns in modern agentic pipelines `[M, S]`:

- **Specification (`sigma`):** Declares typed invariants, postconditions, resource caps, or reference test traces independent of how a candidate solution is found.

- **Proposer (`P`):** Any search mechanism—cached lookup, symbolic solver, small local model, or frontier LLM—free to explore high-entropy candidates without commit authority.

- **Deterministic Gate (`G`):** A reproducible checker (`C(z) in {0, 1}`) that either admits the candidate with a signed receipt or returns diagnostic counterexamples without mutating protected state `[M]`.

## Limitations, Specification Bottlenecks & Failure Modes

- **A gate is only as strong as its specification:** As documented in program-repair literature (Qi et al., ISSTA 2015; Wang, Pradel & Liu, ICSE 2026), proposers routinely pass weak or incomplete unit-test gates with overfitting patches that break unstated invariants `[S]`. Separating the gate prevents *gate-bypass* bugs, not *specification-omission* bugs `[M]`.

- **Formal specification authoring cost:** Writing complete formal postconditions or mutation-adequate test suites requires upfront human engineering effort (explicitly registered as falsifier `RJ-F2` in `rce-jepa`) `[M]`.

- **Zero standalone empirical data:** Readers seeking measured pass rates, counterexample loops, or hardware joules should consult `deterministic-null`, `gates`, and `rce-jepa` rather than treating this framing essay as an experimental proof.

## Energy & Telemetry Scope

This study is strictly `unmetered` (`joules = null`, `board_metered = false`). Energy trade-offs between cheap local verification gates and expensive neural proposers are stated analytically as cost-ratio conditions (`C_gate << E_proposer`) and measured empirically in companion papers.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Design Metaphor Essay
- **Telemetry Disclosure**: Conceptual software-architecture metaphor (Specification, Proposer, Deterministic Gate); 0 hardware runs, joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered architectural framing synthesis (joules = null; 'Three-Body' is strictly a software role metaphor)

## Related Work & Primary Literature (`[S]`)

- **Hoare (CACM 1969) & Dijkstra (CACM 1975):** Pre/postcondition axiomatic semantics and guarded-command program derivation `[S]`.
- **Blum & Kannan (JACM 1995) & Necula (POPL 1997):** Designing programs that check their work and Proof-Carrying Code decoupling untrusted producers from small trusted verifiers `[S]`.
- **Qi et al. (Kali, ISSTA 2015) & Wang, Pradel & Liu (ICSE 2026):** Empirical demonstrations of test-suite overfitting in automated patch generation and `SWE-bench` `[S]`.
- **Kambhampati et al. (LLM-Modulo Frameworks, ICML 2024) & Sun et al. (Clover, 2024):** Pairing stochastic LLM proposers with external sound verifiers `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/three-body/](https://blog.openie.dev/posts/three-body/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/three-body/](https://research.openie.dev/papers/three-body/) ([PDF](https://research.openie.dev/pdfs/three-body.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/three-body-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/three-body-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=three-body)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
