# AI Coding Market Arithmetic: Token-vs-Word Accounting, Annual Agent Spend Assumptions, and Mixed RCT Evidence

*Audits enterprise AI coding TAM projections, reconciles API tokens (~0.75 words/token) and the 1,400-1,481 active-hour assumption behind ~USD 10k/yr spend, and contrasts +21%-55.8% speedups against METR -19% slowdowns.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/ai-coding-market/](https://blog.openie.dev/posts/ai-coding-market/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/ai-coding-market/](https://research.openie.dev/papers/ai-coding-market/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:69e7a2fe33716674a0c355af3726928fd2147ec38c6f5f2e34db059289735979` · **Evidence Tags**: `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![AI Coding Market — USD 2.25/query token arithmetic, Menlo USD 4B spend, and METR -19% RCT](https://research.openie.dev/media/tv/posters/ai-coding-market-poster.jpg)
*Exact API token-pricing arithmetic (100k in + 10k out tokens = USD 2.25/query), ARR/spend disclosures, and mixed productivity RCTs (unmetered). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[S/M · Exact Token-vs-Word & Annual Spend Arithmetic]** Earlier blog prose blurred **API tokens** with **English words** (`1 token ≈ 0.75 words`, so `100,000` input + `10,000` output tokens ≈ `75,000` + `7,500` words). Under Appenzeller & Li’s (a16z, Oct 2025) frontier pricing example (`100k` input tokens @ `USD 15/M = USD 1.50` + `10k` output tokens @ `USD 75/M = USD 0.75` = **`USD 2.25/query`**), reaching **`USD 9,450/developer/yr`** (`~USD 10,000/yr`) requires **`3 queries/hr × 7 active hr/day × 200 days/yr = 4,200 heavy queries/yr`** (`1,400–1,481` intensive active hours/yr, or multi-agent background loops burning `~1,000x` chat token volume per Bai, Huang & Wang 2026).
2. **[S · Realized Spend vs. Trillion-Dollar TAMs]** Contrasts top-down projections—**Appenzeller & Li (a16z, 2025)** (`30M developers × USD 100k = USD 3T`) and **McKinsey (2023)** (`USD 2.6T–4.4T` across 63 GenAI use cases)—against realized benchmarks: **Menlo Ventures (Dec 2025)** (`USD 4.0B` enterprise AI coding spend out of `USD 37B` GenAI), **Mordor Intelligence (2026)** (`USD 9.35B` rising toward `USD 29.96B`), **Cursor** (`> USD 1B` ARR, Nov 2025), **Anthropic** (`> USD 2.5B` Claude Code ARR within `USD 14B` total ARR, Feb 2026), and **Microsoft Form 10-Q** (`USD 4.1B` Q3 2025 pre-tax equity-method loss from OpenAI).
3. **[S · Mixed Productivity RCTs, Including Negative Results]** Controlled trials disagree sharply by task familiarity and codebase complexity: **Peng et al. (2023)** found `+55.8%` speed on one standalone HTTP server exercise; **Paradis et al. (2024)** found `~21%` faster task completion across `96` Google engineers; whereas **METR / Becker, Rush, Barnes & Rein (`arXiv:2507.09089`, 2025)** found `16` experienced open-source maintainers were **19% slower** across `246` real issues in their own mature repositories—even though participants *believed* AI had sped them up by `20%`.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Primary-source audit of SEC filings, vendor ARR announcements, VC enterprise surveys, API rate cards, and randomized controlled developer studies.
- **Workload & Suite**: Published coding-agent token consumption studies (`SWE-bench Verified` 8-model audit in Bai, Huang & Wang 2026) and three randomized developer productivity trials (`Peng et al. 2023`, `Paradis et al. 2024`, `Becker et al. 2025`).
- **Baselines Compared**: Unassisted human software engineering vs. chat/IDE autocomplete vs. autonomous multi-turn coding agents; list-price uncached API billing vs. prompt-cached and Epoch AI (`~13x/yr`, range `9x–900x/yr`) falling per-token prices.
- **Runs (`N`) & Uncertainty / Spread**: Literature RCT sample sizes & intervals: Peng et al. (`N = 95` developers, `+55.8%`), Paradis et al. (`N = 96` Google engineers, `~21%` speedup), METR / Becker et al. (`N = 16` maintainers, `246` real tasks, `-19%` slowdown); Bai et al. (`8` models, `~1,000x` token multiplier vs. chat, `30x` same-task token spread without accuracy gain).
- **Cold vs. Warm Caching Scope**: Explicitly notes that provider prompt-prefix caching (`50%–90%` input discount on repeated repository context) and falling per-million-token prices (`~13x/yr`, Epoch AI) pull per-query cost down, while autonomous retry/test loops push token volume up.
- **Artifact & License Status**: Public-domain market & literature audit (`CC0-1.0`) at `research.openie.dev/papers/ai-coding-market/`; self-checked, not externally peer-reviewed.

## Token-vs-Word Correction & Exact USD 10,000/Year Arithmetic

In subword BPE tokenizers (`cl100k_base` / `o200k_base`), `100,000` API tokens correspond to roughly `75,000` English words (or `~2,500–3,500` lines of source code), **not** `100,000` words `[S]`. Reproducing the exact arithmetic from **Appenzeller & Li (Andreessen Horowitz, October 2025)** makes every assumption transparent `[S, M]`:

- **Single heavy agent turn:** `100,000` input tokens at `USD 15.00 / 1M` (`USD 1.50`) plus `10,000` output tokens at `USD 75.00 / 1M` (`USD 0.75`) equals **`USD 2.25` per query** (before prompt-cache discounts) `[S]`.

- **Annualized intensive single-seat schedule:** `3 queries/hour × 7 active coding hours/day × 200 workdays/year = 4,200 queries/year` (`1,400` intensive active hours/year) × `USD 2.25` = **`USD 9,450/developer/year`** (reaching `USD 10,000/yr` at `~4,444` queries / `~1,481` hours, or at far fewer human hours when multi-agent background loops issue dozens of autonomous sub-calls per ticket) `[S, M]`.

## Enterprise Spend Disclosures vs. Agentic Token Inflation

- **Surveyed spend and vendor ARR `[S]`:** **Menlo Ventures (December 2025)** estimated enterprise AI coding spend at **`USD 4.0B`** (the largest vertical inside `USD 37B` enterprise GenAI spend), alongside **Mordor Intelligence (2026)** (`USD 9.35B` market size projected to `USD 29.96B`), **Cursor** (`> USD 1.0B` ARR, November 2025), and **Anthropic** (`> USD 2.5B` annualized Claude Code run-rate inside `USD 14B` total ARR, February 2026), while **Microsoft’s Q3 2025 Form 10-Q** disclosed a **`USD 4.1B`** pre-tax equity-method loss attributable to OpenAI `[S]`.

- **Price deflation vs. volume explosion `[S]`:** While **Epoch AI** documents `~13x/year` (`9x–900x/yr` across tiers) declines in constant-capability inference prices, **Bai, Huang & Wang (`arXiv:2604.22750`, 2026)** measured `8` coding models on `SWE-bench Verified` and found agentic loops burn **`~1,000x` more tokens** than single-turn chat, with up to **`30x` token variance on the exact same bug** without higher solve rates `[S]`.

## Mixed Developer Productivity RCTs (Including the METR -19% Slowdown)

Any honest economic assessment must report that randomized developer productivity trials do **not** show uniform speedups `[S]`:

- **Greenfield / bounded corporate tasks:** **Peng et al. (2023)** measured a `+55.8%` speedup (`N = 95`) on a self-contained JavaScript HTTP server task, and **Paradis et al. (2024)** measured `~21%` faster completion (`N = 96` Google engineers) on internal enterprise tasks `[S]`.

- **Experienced maintainers on mature codebases (`METR 2025`):** **Becker, Rush, Barnes & Rein (`arXiv:2507.09089`, 2025)** randomized `246` real issues across `16` seasoned open-source maintainers working in large repositories they already knew intimately: AI-allowed tasks took **19% longer** due to prompt iteration, reviewing plausible-looking errors, and context mismatch, despite developers *perceiving* a `20%` speedup `[S]`.

## Energy & Telemetry Scope

This market analysis is `unmetered` (`joules = null`, `board_metered = false`), tracking token counts, USD rate cards, SEC filings, and human wall-clock hours rather than hardware wattmeters.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Market & RCT Audit
- **Telemetry Disclosure**: API token-pricing arithmetic, SEC/ARR disclosures, and developer productivity RCT synthesis; joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered API rate-card arithmetic, enterprise spend survey, and developer RCT audit (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Appenzeller & Li (a16z, Oct 2025), Menlo Ventures (Dec 2025) & McKinsey Global Institute (2023):** Primary industry spend surveys, rate-card models, and TAM estimates audited in the paper `[S]`.
- **Becker, Rush, Barnes & Rein (METR, arXiv:2507.09089, 2025), Paradis et al. (2024) & Peng et al. (2023):** Randomized controlled trials of AI coding-assistant developer velocity `[S]`.
- **Bai, Huang & Wang (arXiv:2604.22750, 2026) & Epoch AI (2025):** Agentic token-burn multipliers (`~1,000x` vs. chat) and historical LLM inference price-decline trends `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/ai-coding-market/](https://blog.openie.dev/posts/ai-coding-market/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/ai-coding-market/](https://research.openie.dev/papers/ai-coding-market/) ([PDF](https://research.openie.dev/pdfs/ai-coding-market.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/ai-coding-market-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/ai-coding-market-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=ai-coding-market)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
