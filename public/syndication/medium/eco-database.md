# The Data Systems Stack (data.openie.dev): 10-Axis Coordinate Taxonomy (1.26M Cells), DNULLMM1 mmap Scope, and Honest JouleDB BSL-1.1 Status

*Separates data.openie.dev’s unmetered 10-axis taxonomy (1,260,000 cells + illustrative canvas) from DNULLMM1’s 34-record mmap lookup (0.325 us / 1.77 uJ reported_j) and discloses that JouleDB is BSL-1.1 with private core source and zero DuckDB/ClickHouse benchmarks here.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/eco-database/](https://blog.openie.dev/posts/eco-database/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/rce/](https://research.openie.dev/papers/rce/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/deterministic-null](https://github.com/openIE-dev/deterministic-null)  
> **Canonical Artifact ID**: `blake3:tv:74a6c924643a078e785536a03514eee6983c488a2a00381e2186933fe3a7688e` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `reported_j`

---

![Data Systems Stack — 1.26M-cell 10-axis taxonomy, DNULLMM1 34-record mmap scope, and JouleDB BSL-1.1 disclosure](https://research.openie.dev/media/tv/posters/eco-database-poster.jpg)
*10-axis data-system coordinate map (`data.openie.dev`), exact 34-record `DNULLMM1` `mmap` scope (`1.77 uJ` `reported_j`), and candid `JouleDB` `BSL-1.1` / private-mirror disclosure. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M · `data.openie.dev` Is a `1,260,000`-Cell Design Taxonomy, Not a DBMS Benchmark]** `data.openie.dev` classifies storage and retrieval engines along **10 orthogonal axes** (`⟨W, S, T, C, D, Q, V, R, N, tau⟩` with cardinalities `5 × 12 × 4 × 7 × 5 × 7 × 5 × 4 × 6 × 5 = 1,260,000` discrete cells), and its interactive `/instrument` animation uses **illustrative unit weights (`0.4, 1.6, 9, 22`)**, not hardware joule readings.
2. **[E · Exact Scope of `0.325 us` & `1.77 uJ` (`reported_j`)]** The **`0.3246 us` (`324.6 ns`)** latency and **`1.771 uJ` (`1,771.3 nJ` Apple M5 Max `L3` `ri_energy_nj` `reported_j`)** figure comes from **`40,000` read-only POSIX `mmap` hash probes into a frozen `34`-record `DNULLMM1` binary lookup table** (`rce-jepa` `[B33]`)—demonstrating zero-copy exact-key lookup speed, **not** concurrent SQL joins, MVCC transactions, WAL fsync durability, or OLAP scans.
3. **[S/E · Candid `JouleDB` Licensing & Missing External DBMS Baselines]** Companion product **`JouleDB` (`openIE-dev/jouledb`) is licensed under `BSL-1.1`**, its **full core storage-engine source currently lives in a private internal mirror** (the `crates.io` crate is an installer stub rather than full engine source), and **no head-to-head TPC-H, ClickBench, or YCSB joule benchmark against `DuckDB`, `ClickHouse`, `RocksDB`, or `PostgreSQL` is reported here**.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: `DNULLMM1` `mmap` microbenchmark (`rce-jepa`): Apple M5 Max (`128 GB`, macOS `proc_pid_rusage` `ri_energy_nj` `L3` `reported_j`; `measured_j = null`). `data.openie.dev` taxonomy & browser canvas: `unmetered` (`joules = null`).
- **Workload & Suite**: `40,000` POSIX `mmap` exact-digest lookups over a frozen `34`-record `DNULLMM1` store (`sha256: d92a57b4...`), paired with the `10`-axis combinatoric impossibility pruning analysis on `data.openie.dev`.
- **Baselines Compared**: `DNULLMM1` `mmap` Gear-0 lookup (`1.771 uJ` `reported_j`) vs. cold neural repair generation (`84.25 J` local `35B` `reported_j` in `rce-jepa`). **External DBMS baselines (`DuckDB`, `ClickHouse`, `SQLite`, `RocksDB`): not benchmarked in this study.**
- **Runs (`N`) & Uncertainty / Spread**: `N = 40,000` sequential/seeded `mmap` probes (`mean 0.3246 us`, `9,516.5` instructions, `mean 1.771 uJ` `L3` `reported_j`; Spread: per-probe percentile/SD not itemized in aggregate log).
- **Cold vs. Warm Caching Scope**: Warm OS page-cached `mmap` over a tiny (`34`-record) immutable file; large out-of-RAM NVMe working sets (`io_uring` / page-fault misses) and write-ahead log `fsync` costs are not exercised.
- **Artifact & License Status**: Taxonomy text (`CC0-1.0`) on `data.openie.dev`; `DNULLMM1` binary reader (`Apache-2.0`) in `openIE-dev/deterministic-null`; **`JouleDB` (`openIE-dev/jouledb`) is `BSL-1.1` with private core mirror and `crates.io` installer stub — externally unreproduced**.

## Storage–Query Impedance & Classical Database Energy Literature

The central insight of `data.openie.dev`—that query cost is governed by **storage–workload impedance** (the structural distance between physical layout `S`, such as B-trees, PAX/columnar runs, CSR graphs, or HNSW vectors, and query zone `W`)—builds directly on **Idreos et al.’s *Periodic Table of Data Structures / Data Calculator* (SIGMOD 2018)** and **Stonebraker & Cetintemel’s *"One Size Fits All: An Idea Whose Time Has Come and Gone"* (ICDE 2005)** `[S]`.

Crucially, classical database energy research established important boundary findings that temper naive hardware claims `[S]`: **Harizopoulos, Shah, Meza & Ranganathan (CIDR 2009)** and **Tsirogiannis, Harizopoulos & Shah (SIGMOD 2010)** showed on enterprise servers that **the most time-efficient query plan (e.g., columnar projection or indexed probe over full table scan) is almost always the most energy-efficient database plan** because high server idle power makes runtime minimization dominant `[S]`.

## Separating `DNULLMM1` (`34` Records), `data.openie.dev`, and `JouleDB` (`BSL-1.1`)

To remove any impression that `0.325 us / 1.77 uJ` represents a general-purpose SQL engine beating modern analytical databases `[E]`:

- **`DNULLMM1` (`Apache-2.0` in `openIE-dev/deterministic-null`):** A compact, immutable `mmap` hash table used as Gear-0 exact-match cache (`34` records in the `1.771 uJ` M5 Max `L3` `reported_j` test) `[E]`.

- **`JouleDB` (`BSL-1.1` at `openIE-dev/jouledb`):** A commercial/source-restricted database project whose core engine currently resides in a private internal repository (with an installer stub on `crates.io`). Until public reproducible benchmarks against **DuckDB (Raasveldt & Mühleisen, SIGMOD 2019)**, **ClickHouse (Schulze et al., VLDB 2024)**, and **SQLite/RocksDB** are published with open harness scripts, `JouleDB` claims carry **zero externally reproduced empirical weight** on this blog.

## Limitations & Open Benchmarks

- **Tiny RAM-resident `mmap` table:** `34` records fit entirely inside Apple M5 Max L1/L2 CPU cache; cold NVMe random 4 KiB reads (`~50–100 us`), `fsync` durability barriers, and vectorized multi-million-row aggregations (`DuckDB` / `ClickHouse`) cost orders of magnitude more time and energy `[M, S]`.

## Energy & Telemetry Scope

Only the `34`-record `DNULLMM1` `mmap` probe (`1.771 uJ`) is `reported_j` (`Apple M5 Max L3`, `measured_j = null`); `data.openie.dev`’s `1,260,000`-cell map is `unmetered`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered 10-Axis Map + 34-Rec mmap Counter
- **Telemetry Disclosure**: Unmetered 1.26M-cell taxonomy + M5 Max L3 reported_j (1.771 uJ) on a static 34-record DNULLMM1 mmap table; JouleDB core is BSL-1.1/private.
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `1.771e-06 J (reported_j)`
- **Sensor / Formula Scope**: Apple M5 Max L3 ri_energy_nj reported_j (1.771 uJ) on 40,000 POSIX mmap probes over a 34-record DNULLMM1 store (not a general SQL DBMS; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Harizopoulos, Shah, Meza & Ranganathan (CIDR 2009) & Tsirogiannis, Harizopoulos & Shah (SIGMOD 2010):** Foundational empirical studies of energy efficiency and query-plan selection in database servers `[S]`.
- **Idreos, Zoumpatianos, Hentschel, Kester & Dayan (Data Calculator, SIGMOD 2018):** Periodic table of data-structure primitives and learned/cost-modeled storage synthesis `[S]`.
- **Raasveldt & Mühleisen (DuckDB, SIGMOD 2019) & Schulze et al. (ClickHouse, VLDB 2024):** State-of-the-art vectorized in-process and columnar OLAP engines `[S]`.
- **Codd (CACM, 1970) & Stonebraker & Cetintemel (ICDE 2005):** Relational data independence and specialized storage-engine architectures `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/eco-database/](https://blog.openie.dev/posts/eco-database/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/rce/](https://research.openie.dev/papers/rce/) ([PDF](https://research.openie.dev/pdfs/rce.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/deterministic-null](https://github.com/openIE-dev/deterministic-null)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/eco-database-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/eco-database-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=eco-database)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
