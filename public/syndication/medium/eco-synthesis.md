# The Synthesis Stack (synthesis.openie.dev): 7-Axis AI Taxonomy, 29/32 BigCodeBench Slice Scope, and Pattern-lang BSL-1.1 Status

*Frames synthesis.openie.dev’s 7-axis taxonomy, qualifies 90.6% (29/32 BigCodeBench slice, 95% UB <= 10.9% on 0/32 broken commits, 970 MB AirMoL RAM in lut-adapt), and discloses Pattern-lang is BSL-1.1 source-restricted.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/eco-synthesis/](https://blog.openie.dev/posts/eco-synthesis/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)  
> **Canonical Artifact ID**: `blake3:tv:7aa479ced7a5cc1a84a07d286ab1d6143f62fe59ceaf75750190ae134730de3e` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `reported_j`

---

![Synthesis Stack — 7-axis AI taxonomy, 29/32 BigCodeBench slice with N=32 statistical bound, and Pattern-lang BSL-1.1 disclosure](https://research.openie.dev/media/tv/posters/eco-synthesis-poster.jpg)
*Periodic Stack of Digital Information Synthesis (`synthesis.openie.dev`), qualified `29/32` `BigCodeBench` slice & `970 MB` `AirMoL` numbers (`reported_j`), and `Pattern-lang` `BSL-1.1` disclosure. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Qualified `90.6%` (`29/32`), Finite-`N` Gate Bound, and `970 MB` RAM (`reported_j`)]** Grounding the earlier summary’s three headline metrics in `openIE-dev/lut-adapt-ai`: **`90.62%` is `29 / 32` tasks solved** on a `32`-task `BigCodeBench v0.1.3` evaluation slice; **`0 / 32` broken commits admitted** behind the unit-test gate carries a finite-sample **95% Clopper–Pearson upper bound of `<= 10.89%` on `N = 32`** (and gates catch only bugs covered by the task’s unit tests, never proving `0 observed` universal defect risk); and **`970 MB` peak RAM** comes from layer-streamed `AirMoL` SSD paging of `Qwen3.6-35B-A3B` (`34.66B` total / `3B` active sparse-MoE, trading higher NVMe I/O latency against DRAM capacity on memory-constrained hosts).
2. **[M/S · 7-Axis Synthesis Taxonomy (`Z1 / Z2 / Z3`)]** `synthesis.openie.dev` classifies "Digital Information Synthesis" (`AI ⊆ Software`) across 7 axes (`⟨Z, E, T, P, I, V, R⟩`) and three problem zones: **`Z1` bounded determinism** (arithmetic, parsing, exact lookup), **`Z2` calibrated verifier-backed hybrids** (code repair, formal math), and **`Z3` open-ended synthesis** (creative prose, underspecified design where generative models remain primary).
3. **[S · Honest `Pattern-lang` (`BSL-1.1`) Disclosure]** While the cascade benchmarks run on open-source `Apache-2.0` code (`openIE-dev/lut-adapt-ai` and `openIE-dev/mixture-of-limits`), companion **`Pattern-lang` (`openIE-dev/pattern-lang`) is licensed under `BSL-1.1` with source-restricted core compiler internals** and is not claimed as an externally replicated open-source artifact.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Empirical cascade runs (`lut-adapt-ai`): Apple M5 Max (`128 GB`, macOS `IOReport`/`ri_energy_nj` `reported_j`, `board_metered = false`) plus `AirMoL` memory-capped SSD streaming harness (`970 MB` RSS). `synthesis.openie.dev` 7-axis portal is conceptual (`unmetered`).
- **Workload & Suite**: `32`-task `BigCodeBench v0.1.3` slice (`29/32` solved), `48`-task coding bakeoff (`44/48 = 91.67%` in `LA-17`), `16`-task hard adversarial suite (`10/16 = 62.50%` in `LA-21`), and `Qwen3.6-35B-A3B` `AirMoL` layer-streaming memory test.
- **Baselines Compared**: Always-frontier dense/MoE invocation in full RAM (`~25.2 GB` `INT4` for `Qwen3.6-35B-A3B`) vs. Rung-0 `LUT6`/`.mol/` routing + `AirMoL` (`970 MB` RSS) behind a deterministic test gate.
- **Runs (`N`) & Uncertainty / Spread**: `N = 32` `BigCodeBench` slice (`29/32 = 90.62%`, Wilson 95% CI `75.8%–96.8%`; `0/32` gate false-admits -> 95% Clopper–Pearson UB `<= 10.89%`).
- **Cold vs. Warm Caching Scope**: Cold `BigCodeBench` tasks require neural generation (`35B` / `24B`) + unit-test gating; `.mol/` / `LUT6` sub-microjoule hits occur only on recurring canonicalized intents after first verified completion.
- **Artifact & License Status**: Cascade scripts public (`Apache-2.0`) at `https://github.com/openIE-dev/lut-adapt-ai` and `openIE-dev/mixture-of-limits`; **`Pattern-lang` (`openIE-dev/pattern-lang`) is `BSL-1.1` source-restricted**; portal text `CC0-1.0`.

## Three Problem Zones (`Z1, Z2, Z3`) & Prior Routing Literature

`synthesis.openie.dev` argues against routing `Z1` closed-form lookups and `Z2` verifier-checkable code tasks unconditionally through `700 W` datacenter GPUs `[M]`. This design sits directly atop established ML-systems work: **FrugalGPT (Chen, Zaharia & Zou, 2023)** and **RouteLLM (Ong et al., ICLR 2025)** route easy prompts to cheap models; **Speculative Decoding (Leviathan et al., ICML 2023; Medusa; EAGLE-2)** drafts tokens cheaply and verifies in parallel; **Outlines (Willard & Louf, 2023), Synchromesh (Poesia et al., 2022), PICARD (Scholak et al., 2021), and `llama.cpp` GBNF** constrain token grammars; **AirLLM (2023)** streams layers from SSD; and **BitNet b1.58 (Ma et al., 2024)** lowers ternary weights `[S]`.

## Statistical Honesty on `29/32`, `0` Broken Commits, and `970 MB` Streaming

- **Sample-size qualification (`N = 32` slice vs. full `1,140`-task `BigCodeBench`) `[E]`:** The `90.62%` (`29/32`) result comes from a `32`-task `BigCodeBench v0.1.3` subset (full `BigCodeBench` has `1,140` tasks; see `deterministic-null` Track-B for broader cold increments). Observing `0` broken commits across `32` gated tasks bounds per-task test-escape rate only to `<= 10.89%` (`95%` Clopper–Pearson) and remains subject to unit-test completeness `[E, M]`.

- **Latency trade-off of `970 MB` `AirMoL` paging `[E]`:** Streaming inactive sparse-MoE experts from NVMe flash allows a `34.66B` checkpoint to execute inside `970 MB` RAM on edge laptops, but pays SSD read latency whenever uncached experts activate `[E]`.

## Limitations & `Pattern-lang` Licensing Scope

- **`Z3` open-ended tasks have no binary gate:** Creative writing, open brainstorming, and subjective summarization live in `Z3`, where deterministic pass/fail gates (`C(z) = 1`) do not exist and learned preference routers (`RouteLLM`) apply instead `[M, S]`.

- **`Pattern-lang` is `BSL-1.1`:** Readers replicating empirical numbers should use `openIE-dev/lut-adapt-ai` (`Apache-2.0`), not the source-restricted `openIE-dev/pattern-lang` repository.

## Energy & Telemetry Scope

Empirical `BigCodeBench` and `AirMoL` runs use Apple M5 Max `reported_j` (`measured_j = null`); macro `945 TWh` datacenter figures on `synthesis.openie.dev` are cited from IEA projections `[S]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: 7-Axis Taxonomy + M5 Max Counter Slice
- **Telemetry Disclosure**: Conceptual 7-axis synthesis map + Apple M5 Max reported_j on 32-task BigCodeBench slice (29/32, 95% UB <= 10.89%) & 970 MB AirMoL; Pattern-lang BSL-1.1.
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.042 J (reported_j)`
- **Sensor / Formula Scope**: Apple M5 Max L3/L2 reported_j on 32-task BigCodeBench v0.1.3 slice & AirMoL streaming in lut-adapt-ai (measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Chen, Zaharia & Zou (FrugalGPT, 2023) & Ong et al. (RouteLLM, ICLR 2025):** Cost-aware LLM cascades and preference-trained routers `[S]`.
- **Leviathan, Kalman & Matias (Speculative Decoding, ICML 2023) & Cai et al. (Medusa, ICML 2024):** Lossless draft-and-verify decoding `[S]`.
- **Willard & Louf (Outlines, 2023), Poesia et al. (Synchromesh, ICLR 2022), Scholak et al. (PICARD, EMNLP 2021) & `llama.cpp`:** Constrained structured generation `[S]`.
- **AirLLM (2023), Ma et al. (BitNet b1.58, 2024) & Gulwani, Polozov & Singh (Program Synthesis, 2017):** Layer-streamed edge inference, ternary weights, and classical synthesis `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/eco-synthesis/](https://blog.openie.dev/posts/eco-synthesis/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/lut-adapt/](https://research.openie.dev/papers/lut-adapt/) ([PDF](https://research.openie.dev/pdfs/lut-adapt.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/eco-synthesis-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/eco-synthesis-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=eco-synthesis)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
