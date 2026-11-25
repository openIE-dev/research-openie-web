# Latency, Capital Amortization, and Inference Price Decomposition: Fixing the 280x Factor Arithmetic

*Decomposes accelerator-hour costs across 74 Epoch AI frontier sites (plug electricity 1.5%-11.8% vs capex 8x-70x larger), reconciles 280x / (2 x 2) = 70x (~74x) vs ~141x software price factors, and audits SEC capex/OCF ratios.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/latency/](https://blog.openie.dev/posts/latency/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/latency/](https://research.openie.dev/papers/latency/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)  
> **Canonical Artifact ID**: `blake3:tv:388791ddb736142eaa8a75aed41c6f6c61030a764040797bc8b9d36016833e40` · **Evidence Tags**: `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Latency & Inference Economics — 1.5%-11.8% electricity share and corrected 280x -> 70x / 141x factor decomposition](https://research.openie.dev/media/tv/posters/latency-poster.jpg)
*Accelerator capex vs. electricity cost share (74 Epoch AI sites), reconciled 280x -> 70x (~74x) / 141x price decomposition, and SEC capex/OCF audit (unmetered). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/S · Corrected `280x` Factor Arithmetic]** Stanford AI Index (`[18]`) reports GPT-3.5-equivalent API price fell **`> 280x`** over `1.9 years` (Nov 2022–Oct 2024), while hardware capex/FLOP improved `~30%/yr` (`1.98x ≈ 2.0x`) and hardware energy efficiency improved `~40%/yr` (`1.90x ≈ 2.0x`). **Arithmetic correction:** dividing `280x` multiplicatively by *both* `~2x` factors gives **`280 / (2 × 2) = 70x` (`~74x` using `1.98 × 1.90`)**, **not** `~140x`! In the primary paper’s cost equation, `~141x` (`280 / 1.98`) arises when dividing by the **single** `~2.0x` hardware-capex factor alone because plug electricity is only `1.5%–11.8%` of rental cost (so a `1.90x` watt-efficiency gain reduces total hourly cost by `< 6%`, not `2x`). Under either accounting, **`70x` to `141x`** of the price drop came from software serving, quantization, batching, distillation, and margin compression rather than transistor scaling.
2. **[M/S · Capital Dominates Plug Electricity `8x–70x`]** Across **`74` Epoch AI frontier datacenter sites** (median **`USD 33,300` capex** and **`880 W`** per H100-equivalent over `4–6 yr` depreciation, `40%–80%` utilization, `USD 0.04–0.12/kWh`), total accelerator cost is **`USD 0.83–2.50/hr`**, of which electricity is **`1.5%–11.8%`**—making idle/tail-latency GPU underutilization primarily a capital-destruction problem.
3. **[S · SEC Filing Cash-Flow & Circular-Financing Bounds]** Auditing FY2025/FY2026 `10-K`/`10-Q` filings shows NVIDIA’s disclosed ecosystem commitments (**`USD 42B`** = `USD 30B` OpenAI + up to `USD 10B` Anthropic + `USD 2B` CoreWeave) represent **`<= 19.5%`** of FY2026 revenue (**`USD 215.9B`**); Alphabet, Meta, Microsoft, and Amazon fund capex out of operating cash flow (**`0.56x–0.94x` OCF**), whereas **Oracle (`1.74x` OCF)** and **CoreWeave (`3.37x` OCF, `11.8x` obligations/revenue, Microsoft `67%` of 2025 revenue)** carry concentrated debt/lease leverage.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Hand-derived M/G/1 and batch-latency cost propositions (`Propositions 1–8`, `[M]`, not proof-assistant checked) paired with published Epoch AI facility datasets and SEC `10-K`/`10-Q` financial statements (`[S]`).
- **Workload & Suite**: `74` frontier AI cluster records (Epoch AI), Nov 2022–Oct 2024 `MMLU >= 60%` inference price series (Stanford AI Index), and FY2025/FY2026 filings for NVIDIA, Microsoft, Alphabet, Amazon, Meta, Oracle, and CoreWeave.
- **Baselines Compared**: Hardware-only cost/efficiency trend (`1.98x` capex/FLOP; `3.76x–4.0x` naive product with `1.90x` J/FLOP) vs. observed `> 280x` API price drop; hyperscaler OCF-funded capex vs. neocloud debt/lease-financed capex.
- **Runs (`N`) & Uncertainty / Spread**: Parameter sensitivity ranges explicitly propagated: `4–6 yr` GPU depreciation, `40%–80%` utilization, `USD 0.04–0.12/kWh` electricity -> `USD 0.83–2.50/hr` total cost and `1.5%–11.8%` electricity share.
- **Cold vs. Warm Caching Scope**: Analyzes KV-cache memory-capacity ceilings, continuous batching, prefix caching, and speculative decoding as the primary software multipliers behind the `70x–141x` non-hardware price decline.
- **Artifact & License Status**: Public-domain manuscript and filing ledger (`CC0-1.0`) at `research.openie.dev/papers/latency/`; self-checked, not externally peer-reviewed.

## Reconciling the 280x Inference Price Decomposition (`70x` vs. `~141x`)

An earlier blog summary wrote that GPT-3.5-level API prices fell `280x` while hardware cost and hardware energy efficiency each improved `~2x`, yet stated a residual of `~140x`—a clear arithmetic slip if both `2x` factors are divided out (`280 / (2 × 2) = 70x`). Checking `§12` of `src/content/papers/latency.md` resolves both numbers cleanly `[M, S]`:

- **Multiplicative two-factor bound (`70x` / `~74x`):** Using Epoch AI’s `~30%/yr` price-performance gain (`1.30^1.9 ≈ 1.65x–1.98x ≈ 2x`) and `~40%/yr` energy-efficiency gain (`1.40^1.9 ≈ 1.90x ≈ 2x`), dividing `280x` by *both* factors yields **`70x` (`280 / 4`, or `~74x` at `1.98 × 1.90 = 3.76x`)** `[M, S]`.

- **Why energy efficiency does not halve hourly GPU cost (`~141x` vs. capex alone):** In hourly cost `c_hr = a / U + P * p_elec`, plug power `P * p_elec` is only **`1.5%–11.8%`** of `c_hr` (`USD 0.035–0.106/hr` out of `USD 0.83–2.50/hr` across `74` Epoch AI sites). Cutting watts per FLOP by `1.90x` therefore lowers total hourly hardware cost by only `~1%–6%`, leaving `280 / 1.98 ≈ 141x` unexplained by cheaper hardware alone `[M, S]`.

Under either bound (**`70x` conservative multiplicative** or **`~141x` capex-weighted**), software algorithmic serving—continuous batching (`vLLM`), `FP8`/`INT4` quantization, FlashAttention, speculative decoding, and smaller distilled models—drove roughly **two orders of magnitude** more price deflation than silicon scaling `[S]`.

## Latency SLOs, Utilization & SEC Balance-Sheet Stratification

- **Interactive tail-latency tax (`Propositions 1–8`) `[M]`:** Tight interactive time-per-output-token (`TPOT`) and time-to-first-token (`TTFT`) SLOs cap batch size before compute units saturate, forcing operators to hold spare GPU headroom where amortized capital (`8x–70x` electricity) burns continuously even while idle `[M]`.

- **Filing-grounded financial risk `[S]`:** Hyperscalers (`Alphabet 0.57x`, `Meta 0.62x`, `Microsoft 0.65x`, `Amazon 0.94x` capex/OCF) self-finance cluster buildouts from legacy software/search/commerce cash flows, whereas **Oracle (`1.74x` capex/OCF, `USD 11.4B` customer prepayments inside `USD 23.1B` OCF)** and **CoreWeave (`3.37x` capex/OCF, lease/debt obligations `11.8x` revenue, `67%` single-customer concentration at Microsoft)** carry acute utilization and refinancing sensitivity `[S]`.

## Limitations & Scope

- **Hand-derived queuing models:** Propositions `1–8` are classical analytical derivations (`[M]`), **not** machine-checked Lean theorems.

- **Point-in-time filings:** Financial ratios reflect FY2025 / early-FY2026 SEC `10-K` and `10-Q` disclosures and do not observe private off-balance-sheet SPV terms or confidential enterprise API margin sheets `[S]`.

## Energy & Telemetry Scope

Strictly `unmetered` (`joules = null`, `board_metered = false`). Cluster wattages (`880 W`/H100e including PUE) and kWh tariffs come from published Epoch AI and utility datasets `[S]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Facility & SEC Filing Audit
- **Telemetry Disclosure**: Queuing/amortization derivations, 74 Epoch AI cluster records, and FY2025/2026 SEC 10-K/10-Q filings; joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered queuing/capex decomposition across 74 Epoch AI sites and SEC 10-K/10-Q filings (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Epoch AI (Frontier Data Centers & LLM Price Trends, 2024–2025) & Stanford AI Index (2025):** Primary facility capex/MW datasets and `> 280x` GPT-3.5-level price series `[S]`.
- **Kwon et al. (vLLM / PagedAttention, SOSP 2023), Dao et al. (FlashAttention, NeurIPS 2022) & Leviathan et al. (ICML 2023):** Serving-system advances driving the `70x–141x` non-hardware price reduction `[S]`.
- **Dean & Barroso (The Tail at Scale, CACM 2013) & Kingman (1961):** Queuing tail-latency amplification forcing capacity headroom `[S]`.
- **SEC Form 10-K / 10-Q Filings (2025–2026):** NVIDIA, Microsoft, Alphabet, Amazon, Meta, Oracle, and CoreWeave capital expenditure and cash-flow disclosures `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/latency/](https://blog.openie.dev/posts/latency/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/latency/](https://research.openie.dev/papers/latency/) ([PDF](https://research.openie.dev/pdfs/latency.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/latency-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/latency-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=latency)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
