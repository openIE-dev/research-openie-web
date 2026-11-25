# The Knowledge Claim Schema (knowledge.openie.dev): Seven Epistemic Axes, Bitemporal Lineage, and Corrected Six-Kernel Proof Counts

*Defines knowledge.openie.dev’s unmetered 7-axis claim schema (valid/transaction/reference time, granularity, scope, certainty, provenance) and corrects cross-repo Lean proof counts (132 6-kernel theorems + 5,393 RCE constants alongside 12 open RCE draft theorems).*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/eco-knowledge/](https://blog.openie.dev/posts/eco-knowledge/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/time-as-an-index/](https://research.openie.dev/papers/time-as-an-index/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)  
> **Canonical Artifact ID**: `blake3:tv:fc3012f98ba403ab92bbd58bd833bdb65b3b7bd8b104449efe5cdf4a805cee5a` · **Evidence Tags**: `[T]` · `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Knowledge Claim Schema — 7 epistemic axes (valid/transaction/reference time) and audited 6-kernel Lean proof counts](https://research.openie.dev/media/tv/posters/eco-knowledge-poster.jpg)
*Seven-axis claim schema (`knowledge.openie.dev`, `unmetered`) and reconciled 6-kernel `Lean 4.36.0` declaration counts vs. open `RCE` draft-0.9 statements. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/S · Unmetered 7-Axis Epistemic Schema]** `knowledge.openie.dev` specifies a factual claim as **`claim = ⟨V_t, T_t, R_t, G, S, C, P⟩`**—requiring three distinct timestamps (**Valid Time** when true in the world, **Transaction Time** when recorded in the ledger, and **Reference Time** when queried), two domain bounds (**Granularity** and **Scope**), and two epistemic anchors (**Calibrated Certainty** and **Cryptographic/Source Provenance**). Because `knowledge.openie.dev` runs no power-instrumented experiment of its own, its `energyClass` is corrected to **`unmetered` (`joules = null`)**.
2. **[T · Reconciled Fleet Lean `4.36.0` Counts & Open RCE Draft Theorems]** Earlier headlines wrote `"5,496 Six-Kernel Theorems · 0 Skipped Proofs"`, mixing elaborated RCE kernel constants (`5,393`, which include auxiliary equation/splitter constants from `1,264` source declarations) with source theorem counts from sibling repos while omitting open draft items. Exact `bwrap` 6-kernel (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker --paranoid`, `Lean v4.36.0`) counts are: **`1,264` source declarations (`5,393` kernel constants) in `rce` (`0 sorry` in completed files, alongside `12` unproved Draft-0.9 theorem statements in Appendix F.9)**, **`58` theorems in `lut-adapt`**, **`45` theorems (`53` decls) in `communication-avalanche`**, and **`31` theorems (`50` decls) in `time-as-an-index`**.
3. **[S · Direct Lineage in Bitemporal Databases & Provenance Standards]** Connects AI hallucination prevention directly to **Snodgrass & Ahn’s bitemporal relational model (SIGMOD 1985 / SQL:2011)**, **W3C PROV-DM (2013)**, and **Wikidata statement qualifiers (Vrandečić & Krötzsch, 2014)**.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: `knowledge.openie.dev` schema definition is `unmetered` (`joules = null`). Companion Linux `bubblewrap` 6-kernel `lake check --paranoid` audit over `openIE-dev/rce` recorded `22,354.77 J` (`319.80 s`) Linux `RAPL` `package-0` `reported_j`.
- **Workload & Suite**: Formal 7-axis epistemic schema specification on `knowledge.openie.dev` plus 4-repository `Lean 4.36.0` 6-kernel verification (`openie_fleet_six_kernel_paranoid_audit.csv`).
- **Baselines Compared**: Unqualified natural-language token strings (stripping valid/transaction timestamps and source provenance during static weight compression) vs. 7-axis provenance-preserving retrieval records.
- **Runs (`N`) & Uncertainty / Spread**: Deterministic proof-kernel verification (`6/6` independent checkers agree with `0 sorry`, `0 opaque`, `0 ofReduceBool` on all compiled `.lean` modules). **Empirical RAG benchmark (e.g., NaturalQuestions, HotpotQA, FreshQA): not run on `knowledge.openie.dev`.**
- **Cold vs. Warm Caching Scope**: Specifies exact cache-staleness rules via the temporal triad (`V_t, T_t, R_t`): immutable mathematical theorems (`[T]`) may be cached indefinitely, whereas time-varying empirical facts (`[E]`/`[S]`) expire when `R_t` exits `[V_t_start, V_t_end]`.
- **Artifact & License Status**: Portal text (`CC0-1.0`) at `knowledge.openie.dev`; `rce` and `lut-adapt-ai` Lean proofs (`Apache-2.0`); self-checked, not externally peer-reviewed.

## Why Static Weight Compression Strips Epistemic Coordinates

Training a language model on dated web snapshots compresses millions of time-bound, source-specific statements (`"the API rate limit in v2.1 on 2024-05-01 is 100 req/min"`) into shared floating-point weights where `Valid Time`, `Transaction Time`, `Scope`, and `Provenance` are lost `[M, S]`. Extending **Snodgrass & Ahn (1985)** from bitemporal (`V_t, T_t`) to tritemporal (`V_t, T_t, R_t`) plus granularity, scope, conformal calibration (`C`), and hash/citation provenance (`P`) separates invariants that belong in compiled logic/weights from transient facts that must be retrieved with axes intact `[M, S]`.

## Transparent Accounting of Six-Kernel Lean Proofs

Running six independent Lean `4.36.0` typecheckers (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker --paranoid`, and `Lean`) inside network-isolated `bubblewrap` guards against single-implementation kernel bugs (`0 sorry`, `0` custom axioms, `0 opaque`, `0 ofReduceBool`) `[T]`. However, two crucial caveats govern what that audit proves `[T, M]`:

- **Kernel constants vs. source theorems & unproved Draft-0.9 items:** `5,393` in `rce` counts kernel theorem constants generated from `1,264` source declarations, and `rce` Appendix F.9 still lists **12 unproved Draft-0.9 theorem statements** (`rce-facts.json`).

- **Formal axioms != empirical truth:** Six proof kernels certify that a theorem follows deductively from its stated Lean definitions; they do **not** validate physical sensor calibration or real-world market assumptions `[M]`.

## Limitations & Missing Retrieval Benchmarks

- **No end-to-end FreshQA / bitemporal RAG evaluation here:** `knowledge.openie.dev` defines the schema contract; quantitative calibration experiments (`5.37x` lower `RMS` calibration error on `32` `SuperGPQA/AIME/HMMT` items) live in `lut-adapt` (`LA-37`) `[E]`.

## Energy & Telemetry Scope

`knowledge.openie.dev` is `unmetered` (`joules = null`).

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Epistemic Claim Schema
- **Telemetry Disclosure**: Unmetered 7-axis tritemporal claim schema (knowledge.openie.dev) + audited 6-kernel Lean declaration counts; joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered 7-axis epistemic schema specification on knowledge.openie.dev (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Snodgrass & Ahn (ACM SIGMOD 1985; IEEE Computer 1986) & ISO/IEC 9075 SQL:2011:** Valid-time and transaction-time bitemporal database semantics `[S]`.
- **Moreau & Missier (W3C PROV-DM, 2013) & Vrandečić & Krötzsch (Wikidata, CACM 2014):** Standardized provenance graphs and qualified claim statements `[S]`.
- **Lewis et al. (Retrieval-Augmented Generation, NeurIPS 2020) & Vu et al. (FreshLLMs / FreshQA, ACL 2024):** Grounding language models on time-varying external evidence `[S]`.
- **Moura & Ullrich (Lean 4, CADE 2021) & Carneiro (`lean4lean`, 2024):** Mechanized proof checking and independent external kernel verifiers `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/eco-knowledge/](https://blog.openie.dev/posts/eco-knowledge/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/time-as-an-index/](https://research.openie.dev/papers/time-as-an-index/) ([PDF](https://research.openie.dev/pdfs/time-as-an-index.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/eco-knowledge-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/eco-knowledge-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=eco-knowledge)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
