# RCE-JEPA: Latent Form Repair Proposers, Energy Scorers (FormEBM-v3), and 40/40 Bounded Residual Closure

*Evaluates deterministic rce repair (111/151 zero-call closes), FormJEPA-v1 (8.42M), FormEBM-v2/v3 (0.9437 unseen H5 AUROC, 0.5278 OOD H15), and bounded 5-turn H15-Iterative closure (40/40 on Opus/Sonnet 5.5, reported_j).*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/rce-jepa/](https://blog.openie.dev/posts/rce-jepa/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/rce-jepa/](https://research.openie.dev/papers/rce-jepa/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)  
> **Canonical Artifact ID**: `blake3:tv:019888e27dfd3fb4b49ea3e29a210c3c3de5f4565c4d71c3b42ed1e7f5114b8e` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `reported_j`

---

![RCE-JEPA — 111/151 deterministic repair, FormJEPA-v1 27/40, FormEBM-v3 0.9437 unseen / 0.5278 OOD AUROC, and 40/40 H15-Iterative](https://research.openie.dev/media/tv/posters/rce-jepa-poster.jpg)
*Measured 3-Gear repair cascade (`111/151` deterministic + `FormJEPA-v1` + `FormEBM-v3` + `H15-Iterative`), including `FormJEPA-v1` H5/H11 negatives and `0.5278` cross-module OOD boundary (`reported_j`). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · 3-Gear Cold Repair Cascade (`reported_j`)]** On `151` real git-history and defect tasks (`openIE-dev/rce@1762fb4b`), deterministic rungs `a..e` solved **`111/151` (`73.5%`, `0` model calls)**. On the **`40` open residual tasks (`H15`)**, `FormJEPA-v1` (`8.42M` trainable params trained on `1,106` strictly disjoint Form shapes; `58.65 mJ` at `k = 1`, `474.76 mJ` at `k = 16` Zen 5 `RAPL` core `reported_j`) solved **`22/40` (`k = 1`)** and **`27/40` (`k = 16`)**, matching local `Qwen 3.6 35B-A3B` (`27/40` at `84.25 J`/cand), while bounded `<= 5`-turn checker feedback + public `stdlib/lib` signature headers (`H15-Iterative`) closed **`40/40` (`100%`, `0` contradictions)** on `Claude Opus 5.5` (`USD 1.81`) and `Sonnet 5.5` (`USD 1.11`), and **`39/40`** on `Grok 4.20 Reasoning`.
2. **[E · Candid Latent-Energy Negatives & Progression]** Uncalibrated `FormJEPA-v1` L2 latent distance reached only **`0.618` AUROC on `H5`** (inconclusive, `< 0.85` target) and **`36.0%` strict 5-step monotonicity on `H11`**. Contrastive `FormEBM-v2` (`5.85M`) lifted unseen-shape `H5` to **`0.8922`** and `H11` to **`93.0%`** (`rho = 0.9931`) but **inverted to `0.2585` zero-shot cross-task AUROC** on large multi-line `H15` migrations; span-normalized two-head `FormEBM-v3` (`6.05M`) reached **`0.9437` `H5` AUROC**, **`94.0%`/`92.0%` `H11` monotonicity**, and resolved the OOD inversion to **`0.5278`** (`0.6018` on `>= 10`-token rewrites)—still plateauing near `0.53` across unseen multi-module cryptographic APIs (`mls`, `pq`, `pqxdh`) without cross-file signatures.
3. **[E · Cold vs. `Zipf(0.85)` Replay & Rung-`f` Refusal]** Crystallizing verified repairs into `DNULLMM1` (`0.325 us`, `1.77 uJ` M5 Max `L3` `reported_j`) replays `40/40` exact tasks at `0` calls and cuts Gear-2 frontier episodes **`16.67x` (`200` -> `12` episodes)** on a `200`-arrival `Zipf(0.85)` stream—strictly via **verified memoization**, not unseen generalization. Meanwhile, `rce repair criterion` (`3/119 = 2.5% > 2.0%` threshold) returned **`holds: false`**, keeping external-proposal rung `f` in `observe` mode rather than promoting it prematurely.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Apple M5 Max (`128 GB`, Darwin `L3` `ri_energy_nj` `reported_j`: `49.04 mJ` `rce check`, `1.771 uJ` `DNULLMM1` `mmap` probe) and AMD Ryzen AI Max+ 395 / Radeon 8060S (`Linux powercap` `RAPL` core `reported_j`: `58.65–474.76 mJ` `FormJEPA-v1`, `47.09 mJ` `FormEBM-v2`, `232.45 mJ` `FormEBM-v3`; net package `reported_j` withheld as `None` under `Falsifier 6` at `13.7%–37.7%` co-tenant drift). `measured_j = null`.
- **Workload & Suite**: Disjoint `1,387`-Form corpus (`1,106` train, `144` val, `137` unseen test shapes; `0` overlap with eval benchmarks via 4-layer nameless hash exclusion), `200` unseen `H5` candidate beams (`3,064` candidates), `100` unseen 5-step `H11` corruption chains, `151`-task `rce repair` git-history ladder, and `40` open residual tasks (`H15`).
- **Baselines Compared**: Deterministic `rce repair` rungs `a..e` (`111/151`), unreranked & Siamese-L2 beam selection (`22.5%` / `25.0%` top-1 vs. `83.44%` `FormEBM-v3`), local `Qwen 3.6 35B-A3B` (`27/40`), and cloud `Claude Opus 5.5`, `Sonnet 5.5`, and `Grok 4.20` (single-shot `34/40` vs. `<= 5`-turn `40/40`).
- **Runs (`N`) & Uncertainty / Spread**: `N = 200` unseen `H5` beams (`3,064` candidates), `N = 100` `H11` chains (median Spearman `rho = 1.0000`, IQR shaded in Fig. 10), `N = 50` unconstrained random walks (`38.0%` strict step inequality), `N = 151` ladder tasks, `N = 40` `H15` residual tasks, `N = 40,000` `mmap` probes, `M = 200` `Zipf(0.85)` arrivals.
- **Cold vs. Warm Caching Scope**: Strict 4-layer nameless-digest deduplication between training (`1,106` shapes) and cold evaluation (`137` unseen shapes, `151` ladder, `40` `H15`). Warm `DNULLMM1` (`40/40` exact recall, `7/9` alpha-renamed hits via `rce fmt nameless`) and `Zipf(0.85)` (`16.67x` fewer Gear-2 episodes) are reported separately from cold first-exposure accuracy.
- **Artifact & License Status**: Checker/ladder public at `https://github.com/openIE-dev/rce` (`Apache-2.0`); preregistered SHA-256 manifests (`B30–B36`) and interactive data at `research.openie.dev/living/rce-jepa/` (`CC0-1.0`); self-checked, not externally peer-reviewed.

## How Form-Space JEPA / EBM Differs from Pixel/Video JEPA

LeCun (2022) and Assran et al. (I-JEPA 2023, V-JEPA 2 2025) introduced Joint-Embedding Predictive Architectures to predict abstract target representations without pixel-level reconstruction `[S]`. `RCE-JEPA` tests that architecture on **discrete, quotient-normalized `RCE` Form ASTs** paired with an **exact external oracle (`rce check` + `W-MUT-1` mutation adequacy + `rce equiv`)** `[E]`. Unlike continuous vision tasks, a single unbound identifier invalidates an entire program—which is why `FormJEPA-v1` needed a latent-conditioned typed edit decoder and why uncalibrated Smooth-L1 latent distance (`0.618` AUROC) failed `H5` until replaced by contrastive/span-normalized `FormEBM-v2/v3` `[E]`.

## Cold Repair Results vs. Warm `Zipf(0.85)` Crystallization

- **Cold first-exposure hierarchy `[E]`:** Deterministic solver rungs `a..e` close `111/151` (`73.5%`) with zero neural weights. On the `40` remaining real git-history defects, `FormJEPA-v1` (`8.42M` params) closes `27/40` (`67.5%` at `k = 16`, `0.475 J` Zen 5 core `reported_j`), matching `35B` local `Qwen 3.6` (`27/40`, `84.25 J`/cand) on syntax/capability repairs while scoring **`0/9` on multi-module cryptographic stdlib migrations** (`hpke`, `mls`, `pq`, `pqxdh`) `[E]`. Supplying stripped `stdlib/lib` public headers and `<= 5` turns of verbatim checker diagnostics (`H15-Iterative`) closes **`40/40`** on `Opus 5.5` and `Sonnet 5.5` with `0` semantic contradictions `[E]`.

- **Warm `DNULLMM1` replay & invalidation scope `[E]`:** Storing those `40` verified repairs in `DNULLMM1` replays `40/40` exact repeats in `0.325 us` (`1.77 uJ` M5 Max `L3` `reported_j`) and `7/9` alpha-renamed variants via `rce fmt nameless`, cutting frontier episodes `16.67x` (`200` -> `12`) on a `200`-request `Zipf(0.85)` stream—while any change to imported `stdlib` signatures or spec invariants invalidates the stored entry and re-triggers cold checking `[E]`.

## Limitations, Open Hypotheses (`H3, H4, H6`) & Rung-`f` Hold

- **Cross-module OOD energy ceiling (`0.5278` AUROC):** Although `FormEBM-v3` fixed `FormEBM-v2`’s edit-length inversion (`0.2585 -> 0.5278`, and `0.9437` on unseen single-file synthetic beams), single-file syntactic encoding without imported module type signatures cannot calibrate cross-module API validity above `~0.53` pooled AUROC `[E]`.

- **Rung `f` NOT promoted (`holds: false`):** On the 151-task promotion audit, `3/119` (`2.5%`) exceeded the preregistered `2.0%` bound (`exit = 1`), so neural proposals remain quarantined in `observe` mode `[E]`.

- **Major hypotheses still open (`§Status`):** Full natural-language intent-to-Form synthesis (`H3`), end-to-end joule parity on 7 reference apps (`H4`, `H6`), and inline wall-meter `measured_j` are **not yet built or closed** `[E]`.

## Energy & Telemetry Scope

Local measurements use Apple M5 Max `L3` `ri_energy_nj` and AMD Ryzen AI Max+ 395 `RAPL` core `reported_j` (`measured_j = null`); whenever APU package idle power drifted (`13.7%–37.7%`), `Falsifier 6` recorded `derived_marginal_pkg_reported_j = None` rather than fabricating net package numbers `[E]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: On-Chip Counter (reported_j)
- **Telemetry Disclosure**: AMD Zen 5 Linux RAPL core & Apple M5 Max L3 ri_energy_nj counters (Falsifier 6 withheld drifted APU pkg net values); measured_j = null.
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.47476 J (reported_j)`
- **Sensor / Formula Scope**: AMD Ryzen AI Max+ 395 Linux RAPL core counter (474.76 mJ FormJEPA-v1 k=16; M5 Max L3 ri_energy_nj 49.04 mJ rce check; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **LeCun (OpenReview, 2022) & Assran et al. (I-JEPA, CVPR 2023; V-JEPA 2, 2025):** Joint-Embedding Predictive Architectures and VICReg anti-collapse training `[S]`.
- **Ellis et al. (DreamCoder, PLDI 2021) & Grand et al. (LILO, 2023):** Wake-sleep library learning and verified synthesis compression `[S]`.
- **Liu et al. (TBar, ISSTA 2019), Le Goues et al. (GenProg, TSE 2012) & Sun et al. (Clover, 2024):** Template-driven and closed-loop verifiable program repair `[S]`.
- **Mündler et al. (Type-Constrained Code Generation, 2025) & Hubert et al. (AlphaProof, Nature 2025):** Compiler/kernel-guided neural search `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/rce-jepa/](https://blog.openie.dev/posts/rce-jepa/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/rce-jepa/](https://research.openie.dev/papers/rce-jepa/) ([PDF](https://research.openie.dev/pdfs/rce-jepa.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/rce-jepa-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/rce-jepa-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=rce-jepa)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
