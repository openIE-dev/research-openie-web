# "AI" Reads Human: Serialization, Tokenization, and Per-Process Parse Energy Across 34 Workloads

*Measures parse time, token bloat across 5 tokenizers, and Apple M5 Max per-process ri_energy_nj (reported_j) on a 20,000-record synthetic corpus while reporting 109/170 shared-host IOReport drift rejections.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/ai-reads-human/](https://blog.openie.dev/posts/ai-reads-human/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/ai-reads-human/](https://research.openie.dev/papers/ai-reads-human/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)  
> **Canonical Artifact ID**: `blake3:tv:354d34ae4d1f4445cf393cc82d84c99ac2bac5585366b86e02521716baa3112c` · **Evidence Tags**: `[E]` · `[S]` · **Telemetry Class**: `reported_j`

---

![AI Reads Human — 280.4 nJ binary vs 2,212 nJ JSON and 27,679 nJ tiktoken per record (reported_j)](https://research.openie.dev/media/tv/posters/ai-reads-human-poster.jpg)
*Per-record parse and tokenization energy on Apple M5 Max L3 ri_energy_nj (reported_j) plus 109/170 whole-chip IOReport drift rejections. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · reported_j, Apple M5 Max `ri_energy_nj` L3]** On `20,000` seeded records (`seed = 20261016`, CPython `3.13`), `struct.iter_unpack` on a `23 B` fixed binary record (using a shared 24-word dictionary) consumed **280.4 nJ/record**, vs. **2,212.1 nJ (`7.89x`)** for `json.loads`, **69,922.1 nJ (`249.4x`)** for C `libyaml`, **575,799.3 nJ (`2,053.8x`)** for pure-Python `PyYAML`, and **27,679.2 nJ (`98.7x` binary / `12.5x` `json.loads`)** just to tokenize compact JSON with `tiktoken` (`cl100k_base`) before any GPU neural layer runs.
2. **[E · Negative Result 1: Base64/Hex Does Not Save LLM Tokens]** Dumping the `23 B` binary layout as text for an LLM yielded **`20.3` tokens/record in Base64 (`0.89x` CSV)** and **`22.7` tokens/record in Hex (`0.99x` CSV vs. `22.9` for CSV, `36.2` compact JSON, `51.4` YAML, `65.6` pretty JSON)**—showing that text-tokenized LLMs do not benefit from binary wire formats unless binary tool payloads bypass the text context window.
3. **[E · Negative Result 2: `109/170` Shared-Host Drift Rejections]** Whole-chip `IOReport` (`L2`) subtraction failed `Falsifier 6` (`> 5.0%` pre/post idle drift) on **109 of 170 measurement windows** on active laptops, motivating worker-subprocess `proc_pid_rusage` (`L3`) isolation and leaving inline hardware `measured_j` and GPU prefill/decode (`M4`) explicitly open.

> **Founding Companion Essay**: Read alongside the foundational problem statement, [The Hidden Energy Crisis at Every Interface](https://blog.openie.dev/posts/the-hidden-energy-crisis-at-every-interface/).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Timing baseline: 8-vCPU Linux Xeon (`Python 3.13.5`, minimum of `9` repeats; no `RAPL` exposed). Energy campaign: Apple M5 Max (`macOS` worker subprocess `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` `L3` `reported_j`, alongside audited whole-chip `IOReport` `L2` `reported_j`; `measured_j = null`, `board_metered = false`).
- **Workload & Suite**: `34` parse and tokenization workloads over a synthetic seeded `20,000`-record corpus (`id`, 3-word name, `float`, `bool`, 3 tags, 31-bit `int`), plus 5 open tokenizers (`cl100k_base`, `o200k_base`, `GPT-2`, `Mistral-7B-v0.1`, `Qwen2.5-0.5B`) and parser-differential hazard checks (`Node v20.19.2`, `jq 1.7`, `PyYAML 6.0.2`, `lxml 6.1.3`).
- **Baselines Compared**: `23 B` fixed binary (`struct.iter_unpack` with shared 24-word table), CSV (`RFC 4180`), compact/pretty JSON (`RFC 8259`), C `libyaml` & pure-Python YAML (`1.2.2`), XML (`lxml`), Markdown (`CommonMark 0.31.2`), and `CBOR` (`RFC 8949`). Compiled C/Rust zero-copy parsers (`simdjson`, `Cap’n Proto`, `FlatBuffers`): planned (`M8`), not yet benchmarked here.
- **Runs (`N`) & Uncertainty / Spread**: Xeon timing: `N = 9` repeats over `20,000` records (min reported: `116 ns` binary, `904 ns` JSON, `85,300 ns` `libyaml`). Apple M5 Max energy: `N = 5` windows × `34` workloads = `170` windows (`109/170` `L2` whole-chip windows flagged for `> 5%` idle drift; subprocess `L3` means reported in `parse_energy.tsv`).
- **Cold vs. Warm Caching Scope**: In-memory buffer parsing after warm-up import; shared 24-word dictionary for the `23 B` binary format must be pre-agreed by hash (explicitly noted in Figure 8 so binary byte size is not overstated).
- **Artifact & License Status**: Work-in-progress manuscript (`CC0-1.0`) and full scripts/logs (`MIT OR Apache-2.0`) in `openIE-dev/openie-research-experiments`; self-checked, open for external replication.

## Problem, Work-in-Progress Scope & Library Caveats

The primary paper explicitly labels itself a **work in progress** and highlights four methodological boundaries upfront `[E]`: (1) parsers perform unequal object-allocation work (`struct.iter_unpack` returns tuples whereas `json.loads` and `PyYAML` allocate typed dicts/lists); (2) measurements thus far run inside `CPython 3.13` rather than native C++/Rust SIMD parsers (`simdjson`, `serde`, `FlatBuffers`, planned as `M8`); (3) the `20,000`-record corpus is synthetic and identifier-light; and (4) GPU transformer prefill/decode joules (`M4`) and inline wall-meter `measured_j` remain unmeasured `[E]`.

## Parse Energy, Token Bloat & Parser-Differential Hazards

- **Subprocess `ri_energy_nj` (`L3 reported_j`) across formats `[E]`:** Isolating each of the `34` workloads in a fresh macOS worker process resolved a **2,053.8x** CPU energy span across the same `20,000` records: `280.4 nJ/rec` (`struct` binary) -> `2,212.1 nJ/rec` (`json.loads`, `7.89x`) -> `27,679.2 nJ/rec` (`tiktoken cl100k_base` on compact JSON, `98.7x` binary and `12.5x` `json.loads`) -> `69,922.1 nJ/rec` (`PyYAML + C libyaml`, `249.4x`) -> `575,799.3 nJ/rec` (pure-Python `PyYAML`, `2,053.8x`) `[E]`.

- **Five-tokenizer inflation `[E]`:** Relative to CSV (`22.9` `cl100k_base` tokens/rec), compact JSON uses `36.2` (`1.58x`), YAML `51.4` (`2.24x`), and indent-2 JSON `65.6` (`2.86x`; `2.22x` under `Qwen2.5` to `3.66x` under `GPT-2`) `[E]`.

- **Interoperability hazards in human-first formats `[E, S]`:** Differential tests confirmed `9007199254740993` (`2^53 + 1`) parses exactly in Python `json` while silently rounding to `...992` in Node `JSON.parse`, duplicate JSON keys behave unpredictably (`RFC 8259 §4`), and Python `json` accepts non-standard `NaN`/`Infinity` by default `[E, S]`.

## Limitations & Negative Results

- **Why `109/170` whole-chip windows were rejected:** Unisolated laptop `IOReport` (`L2`) drifted by `> 5.0%` on `109` of `170` runs (`64.1%`), proving that whole-package subtraction on active workstations cannot reliably resolve microjoule-per-record deltas `[E]`.

- **Binary-as-text fails for LLMs:** Encoding the `23 B` binary struct into Base64 (`20.3` tok/rec) or Hex (`22.7` tok/rec) saves almost nothing over CSV (`22.9` tok/rec) while destroying legibility—confirming that binary formats help machine-to-machine buses (`CBOR`, `Protobuf`), whereas LLM context savings require field projection or grammar-constrained structured decoding `[E]`.

## Energy & Telemetry Scope

All joule numbers in this study are macOS kernel `proc_pid_rusage` (`ri_energy_nj`, `L3 reported_j`) CPU-model estimates (`measured_j = null`, `board_metered = false`). Background LLM GPU inference figures cited in the paper (`3–4 J/output token` on 65B LLaMA in Samsi et al. 2023; `0.047 kWh/1,000` generations in Luccioni et al. FAccT 2024 V1.1) are external literature `[S]`, not measurements from this setup.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Subprocess On-Chip Counter (reported_j)
- **Telemetry Disclosure**: Apple M5 Max subprocess proc_pid_rusage ri_energy_nj L3 reported_j across 20,000 synthetic records (109/170 whole-chip L2 windows rejected for >5% drift).
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `2.804e-07 J (reported_j)`
- **Sensor / Formula Scope**: Apple M5 Max subprocess proc_pid_rusage ri_energy_nj L3 reported_j (280.4 nJ/rec fixed binary vs 2,212.1 nJ JSON & 27,679.2 nJ tiktoken; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **RFC 8949 (CBOR, Bormann & Hoffman 2020) & RFC 8785 (JCS, Rundgren et al. 2020):** Standard deterministic binary and canonical JSON wire encodings `[S]`.
- **Protocol Buffers, Apache Avro, Cap’n Proto & Langdale & Lemire (simdjson, VLDB J. 2019):** Schema-typed binary serialization and gigabyte-per-second SIMD JSON parsing `[S]`.
- **Willard & Louf (Outlines, 2023), Poesia et al. (Synchromesh, ICLR 2022) & Scholak et al. (PICARD, EMNLP 2021):** Finite-state and incremental-parsing constrained decoding for language models `[S]`.
- **Samsi et al. (IEEE HPEC 2023) & Luccioni, Jernite & Strubell (ACM FAccT 2024 V1.1):** Empirical GPU energy benchmarks of LLM text generation `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/ai-reads-human/](https://blog.openie.dev/posts/ai-reads-human/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/ai-reads-human/](https://research.openie.dev/papers/ai-reads-human/) ([PDF](https://research.openie.dev/pdfs/ai-reads-human.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/ai-reads-human-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/ai-reads-human-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=ai-reads-human)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
