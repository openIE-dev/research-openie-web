# The Reality Code Engine (RCE): Total State-Machine Specification, 49 mJ Single-Form Checks vs. 15.44 J Suite Scope, and Open Draft Theorems

*Specifies RCE Draft 0.9 at openIE-dev/rce (f87d6af2): reconciles 49.04 mJ single-Form check vs 15.44 J 62-Form suite and 2,221/2,236 conformance clauses, and discloses 12 unproved draft-0.9 theorems alongside 97 completed Lean files.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/rce/](https://blog.openie.dev/posts/rce/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/rce/](https://research.openie.dev/papers/rce/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)  
> **Canonical Artifact ID**: `blake3:tv:6d19f6f263097e58b92f17fb3d4a4745f98bc5a2496157ac1c25b7fa22c2cb24` · **Evidence Tags**: `[T]` · `[E]` · `[S]` · **Telemetry Class**: `reported_j`

---

![Reality Code Engine — 49.04 mJ single-Form check, 15.44 J 62-Form suite, 2,221/2,236 conformance passes, and 12 open draft theorems](https://research.openie.dev/media/tv/posters/rce-poster.jpg)
*RCE Draft 0.9 (`openIE-dev/rce` `f87d6af2`): reconciled single-Form vs. 62-Form `reported_j` scopes, 2,221/2,236 conformance checks, and honest Lean theorem status. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Reconciled `49.04 mJ` vs. `15.44 J` vs. `2,221` Checks (`reported_j`)]** Earlier summaries conflated three separate workloads from `rce-facts.json`: **`49.04 mJ` (`7.32 ms`, Apple M5 Max `L3` `reported_j`)** is the cost of **one single-Form `rce check` invocation**; **`15.44 J` (`2.32 s`, `~249 mJ/Form`)** is the cost of **checking, running, and multi-target emitting all `62` valid example Forms** (`60` top-level + `2` package Forms, alongside `13` syntax-reject and `73` type/admissibility-reject tests); and **`2,221 / 2,236` (`0` failures, `15` unsupported/reserved)** is the **normative conformance test count across `311` spec clauses** (not `2,221 × 49 mJ`). Moreover, `rce` CLI receipts themselves currently emit deterministic integer `C.6` fuel units rather than reading OS `host.Energy` counters natively (`§1`, `§6.3`).
2. **[T · Honest Lean 4.36.0 Proof Boundary]** Across `97` completed `.lean` files in `spec/lean/` (`f87d6af2`), **`0 sorry`, `0 opaque`, and `0 ofReduceBool`** appear across `1,264` source theorem/lemma declarations (`5,393` kernel theorem constants verified by all `6/6` independent checkers in `bwrap` at `22,354.77 J` Linux `RAPL` `reported_j`)—**alongside `12` unproved Draft-0.9 theorem statements in Appendix F.9 (`T42–T56` except `T48, T51, T53`), plus `T60` and parts of `T57, T59, T61`**, while Appendix C concurrency theorems (`T16–T31`) are proved on abstract models rather than the Rust evaluator.
3. **[T/E · Scoped Totality Guarantee]** Rather than claiming RCE "removes undefined crashes," its totality discipline **prevents stuck or non-terminating step evaluations within the modeled total Form core** (requiring every event either to step or record a state-preserving kept step `T8`), **excluding host OS failures, FFI boundaries, target-language compiler bugs, hardware faults, and open input-entry item `#15`**.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Apple M5 Max (`128 GB`, macOS `27.2.1`, Darwin `L3` `ri_energy_nj` `reported_j`) for `49.04 mJ` single-Form check and `15.44 J` `62`-Form suite; x86-64 Linux `RAPL` `package-0` (`22,354.77 J`, `319.80 s` `reported_j`) for 6-kernel `lake check --paranoid`. `measured_j = null` (`board_metered = false`).
- **Workload & Suite**: `62` valid Form blueprints (`60` top-level + `2` package), `13` syntax-reject and `73` type/admissibility-reject negative tests, `2,236` normative conformance checks (`311` clauses), `837` Rust unit tests (`159` files), `77` canonical JSON vectors, and `97` Lean `4.36.0` proof files.
- **Baselines Compared**: Byte-for-byte trace parity across `4` reference emitters (`Rust`, `Python`, `JavaScript`, `Scala`; plus CLI `verilog`/`wasm` targets); literature context from DéjàVu GitHub clone density (`70%`, Lopes et al. 2017) and TBar `Defects4J` repair protocols (`§7–§8`, planned empirically in `rce-jepa`).
- **Runs (`N`) & Uncertainty / Spread**: Conformance & Lean checks are deterministic (`2,221/2,236` pass, `0` fail; `6/6` Lean kernels pass). Apple M5 Max `49.04 mJ` (`7.32 ms`) and `15.44 J` (`2.32 s`): aggregate suite means recorded on `2026-11-22` in `rce-facts.json` (Spread: per-run SD/IQR not recorded in single-pass receipt summary).
- **Cold vs. Warm Caching Scope**: Language specification separates cold candidate search (`G1–G3`) from `G0` content-addressed shape lookup keyed by nameless structural Form hash (`T7`); `rce` paper itself measures checker/language invariants while `rce-jepa` benchmarks `G0–G2` repair streams.
- **Artifact & License Status**: `Apache-2.0` public repository at `https://github.com/openIE-dev/rce` (`commit f87d6af2`) + browser playground (`openie-dev.github.io/rce`); self-checked by OpenIE, open for independent replication.

## Reconciling Workload Scopes (`49.04 mJ`, `15.44 J`, and `2,221` Checks)

Inspecting `src/data/rce-facts.json` and `§1 / §6.3` of `src/content/papers/rce.md` separates three numbers that short video/blog summaries previously compressed together `[E]`:

1. **`49.04 mJ` (`7.32 ms` on Apple M5 Max `L3` `ri_energy_nj`, `reported_j`):** External OS counter cost of **one single-Form `rce check` run**.

2. **`15.44 J` (`2.32 s` on Apple M5 Max `L3` `reported_j`):** External OS counter cost of running the **complete `62`-Form example suite** (syntax/type/totality checking plus multi-target Rust, Python, JS, and Scala trace verification across `60` standalone and `2` package Forms, `~249 mJ/Form` end-to-end).

3. **`2,221 / 2,236` Conformance Checks (`0` failures, `15` unsupported/reserved Draft-0.9 clauses):** Normative clause assertions across `311` specification rules (`104` core grammar rules / `1,028` LR states with `0` shift/reduce conflicts). Furthermore, `§1` candidly discloses that `openIE-dev/rce` main does **not** yet implement `rce host calibrate` or native `host.Energy` OS-counter receipts inside the checker binary; internal receipts record deterministic integer `C.6` fuel units `[E]`.

## Theorem Audit (`5,393` Constants vs. `12` Unproved Draft-0.9 Statements)

Scientific precision requires reporting both proved and unproved parts of Draft 0.9 `[T]`:

- **Completed Lean `4.36.0` proofs (`f87d6af2`):** `97` `.lean` files containing `1,264` hand-written `theorem`/`lemma` declarations elaborate to **`5,393` kernel theorem constants** (`5,537` under Lean `4.12.0` due to elaborator splitter differences) with **`0 sorry`, `0` custom axioms, `0 opaque`, and `0 Lean.ofReduceBool`**, accepted by all **`6/6` independent checkers** (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker --paranoid`, and `Lean v4.36.0`) inside a networkless `bubblewrap` sandbox `[T]`.

- **Unproved Draft-0.9 statements & model gaps:** Appendix F.9 states theorems `T42–T56`, of which `T48`, `T51`, and `T53` are proved over models while **12 Draft-0.9 theorems remain unproved**; `T60` and full-alphabet/evaluator extensions of `T57`, `T59`, `T61`, and `T62` remain open in `spec/book/10-theorems.md`; and concurrency theorems `T16–T31` apply to abstract core models rather than mechanical extraction of the Rust reference checker `[T, E]`.

## Limitations: Identifiers, Comprehension, and Totality Boundaries

- **Modeled core totality vs. real-world host faults:** Theorem `T8` guarantees every transition within a valid Form terminates in a new state or a logged kept step—preventing stuck evaluations *inside the modeled language core*, **not** OS OOM kills, FFI wrapper bugs, target-compiler miscompilations, or cosmic-ray bit flips (and entry-contract check `#15` in `§10` remains open) `[T, E]`.

- **Nameless hashing vs. LLM/human readability (`§2.1`):** While positional hashing (`T7`) canonicalizes variable names out of the Form digest, `§2.1` cites empirical software-comprehension studies (`[139]`) showing frontier LLMs lose `11–29` points of summarization/prediction accuracy when identifiers are stripped—meaning human/model side-tables carrying identifier concepts remain essential `[S]`.

## Energy & Telemetry Scope

All reported joules (`49.04 mJ`, `15.44 J`, `22,354.77 J`) are `reported_j` chip counters (`measured_j = null`, `board_metered = false`). Relative to generating a multi-language repair via a local 35B LLM (`84.25 J` `reported_j` per candidate in `rce-jepa`), running `rce check` (`0.049 J`) costs **`1,718x` less on-chip `reported_j`** on workstations `[E]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: On-Chip Counter (reported_j)
- **Telemetry Disclosure**: External Apple M5 Max L3 ri_energy_nj (49.04 mJ single Form check; 15.44 J across 62-Form suite); measured_j = null.
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.04904 J (reported_j)`
- **Sensor / Formula Scope**: Apple M5 Max Darwin ri_energy_nj L3 external counter (49.04 mJ single-Form rce check; 15.44 J full 62-Form suite; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Gurevich (Abstract State Machines, 2000), Abrial (B-Method / Event-B, 1996/2010) & Dijkstra (1975):** Total deterministic state-machine refinement from formal specifications `[S]`.
- **Leroy (CompCert, CACM 2009) & Klein et al. (seL4, SOSP 2009):** Machine-checked compiler and OS-kernel verification setting the standard for mechanized proof disclosures `[S]`.
- **Lopes et al. (DéjàVu, OOPSLA 2017) & Hindle et al. (ICSE 2012):** Large-scale GitHub clone density (`70%`) and code naturalness motivating verified shape reuse `[S]`.
- **Moura & Ullrich (Lean 4, CADE 2021):** Proof assistant and independent kernel checkers (`lean4lean`, `nanoda`) `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/rce/](https://blog.openie.dev/posts/rce/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/rce/](https://research.openie.dev/papers/rce/) ([PDF](https://research.openie.dev/pdfs/rce.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/rce-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/rce-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=rce)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
