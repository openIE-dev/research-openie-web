# RCE-VC: A Proposed Structural Version-Control Prototype, Rename Behavior, Key Collisions, and Git Comparison Scope

*Presents openIE-dev/rce-vc (v0.1.0, 49 offline tests) as a proposed structural VCS prototype (317-365 uJ/unit M5 Max reported_j), disclosing structural key collisions on identical bodies and zero external merge-benchmark runs vs git merge-ort.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/rce-vc/](https://blog.openie.dev/posts/rce-vc/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/rce-vc/](https://research.openie.dev/papers/rce-vc/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc)  
> **Canonical Artifact ID**: `blake3:tv:86d270c120708d4df299264a57fb54a861630fd2bcb2841abc701873d365b3b0` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `reported_j`

---

![RCE-VC — 317-365 uJ/unit structural trie admission prototype with explicit Git comparison and collision scope](https://research.openie.dev/media/tv/posters/rce-vc-poster.jpg)
*Proposed `rce-vc` `v0.1.0` prototype (`openIE-dev/rce-vc@aba99fce`): `100,000`-unit trie admission `reported_j`, rename handling, and structural collision caveats. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/E · Proposed Prototype Contract, Not a physical principle]** `rce-vc` (`v0.1.0`, `49` offline tests across 6 Rust crates at `aba99fce`) is a **proposed structural repository admission contract**, not a principle of nature—and **was not benchmarked head-to-head on conflict-resolution precision/recall against `git merge-ort`, GumTree, Spork, or Mergiraf (`Merge-Bench` / `CONGRA`) in this study** (`§9`).
2. **[E · Apple M5 Max `L3 reported_j` with Spread]** Admitting a single unit change into a `100,000`-unit persistent 16-way Merkle trie (`O(log_16 U)` path copy, re-checking only affected dependents) took **69.69 us (min–max `63.5–84.1 us`)** and **365.35 uJ (`346.4–395.7 uJ`, `N = 5` trials of `320` admissions)**, or **73.56 us (`69.3–75.7 us`)** and **317.21 uJ (`278.9–369.0 uJ`, `N = 3` sustained trials of `32,000` admissions)** in Darwin `L3` `ri_energy_nj` `reported_j`.
3. **[M/E · Renames vs. Name-Free Key Collisions]** Because `rcevc-keys` hashes normalized de Bruijn token bodies (`SHA-256` over `"rcevc/unit/v1"`, positional body, and dependency keys), renaming a function updates its parent slot binding (`name-only` equivalence) without changing `key(u)`—**however, two distinct functions with identical normalized structure and dependencies (such as `f(x, y) = x + y` and `g(a, b) = a + b` in untyped code) collide onto the exact same `key(u)`**, remaining separate in the parent directory trie only via named slot bindings while sharing conflict-reuse keys if edited identically.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Apple M5 Max (`128 GB`, macOS `27.2.1`, `proc_pid_rusage` `ri_energy_nj` `L3` `reported_j`; `board_metered = false`, `measured_j = null`). Internal `est_uj` cost-table placeholders (`424–439 mJ`) were `~1,200x` higher than measured `L3` `reported_j` and are kept strictly separate.
- **Workload & Suite**: `49` offline Rust unit/property tests (`rcevc-{types,keys,trie,merge,git,cli}`: RCE Form, Rust, Python, JSON splitters, merge commutativity, replay determinism) plus synthetic `100,000`-unit single-admission microbenchmarks.
- **Baselines Compared**: Whole-repository linear re-hashing/re-checking (`O(U)`) vs. 16-way Merkle path copy + reverse-dependency closure (`O(log_16 U + |affected|)`). **External baseline: not benchmarked head-to-head against `git merge-ort`, Mergiraf, or Spork on public conflict corpora in this study.**
- **Runs (`N`) & Uncertainty / Spread**: `N = 5` trials × `320` admissions (`mean 69.69 us` [`63.5–84.1 us`], `mean 365.35 uJ` [`346.4–395.7 uJ`]); `N = 3` sustained trials × `32,000` admissions (`mean 73.56 us` [`69.3–75.7 us`], `mean 317.21 uJ` [`278.9–369.0 uJ`]).
- **Cold vs. Warm Caching Scope**: Content-addressed CAS + conflict-resolution store keyed by canonical unordered conflict signature `(base_key, {side_keys})`: exact recurring conflict shapes reuse verified resolutions, whereas novel semantic conflicts require human/proposer resolution.
- **Artifact & License Status**: `Apache-2.0` public repository at `https://github.com/openIE-dev/rce-vc` (`commit aba99fce`); self-checked by OpenIE, open for external inspection and replication.

## How `rce-vc` Compares Conceptually to Git (`merge-ort`), AST Merge, and CRDTs

Git’s `merge-ort` engine performs fast 3-way line-diff merging with heuristic file-rename detection (`50%` similarity index) and **zero semantic gate checking**: two branches that rename or edit adjacent declarations can merge cleanly at the text level while breaking compilation or behavioral invariants `[S]`. Syntax-aware tools like **GumTree (Falleri et al., ASE 2014)**, **JDime / Spork (Larsén et al., 2022)**, and **Mergiraf** lift merging from lines to ASTs, while **CRDTs (Shapiro et al., 2011)** and **Darcs/Pijul patch algebras** guarantee algebraic convergence without type/test soundness `[S]`. `rce-vc` explores a complementary point: indexing top-level semantic units in a 16-way Merkle trie and requiring a declared admission gate (`G0` parse -> `G1` typecheck -> `G2` tests/trace) before advancing a ref `[E]`.

## Rename Handling vs. Structural Key Collisions (`f(x,y)=x+y` vs. `g(a,b)=a+b`)

Critique #12 asked how name-free de Bruijn unit keys handle renames and structurally identical functions. In `rce-vc` (`§3–§4`) `[E, M]`:

- **Pure renames:** Parent module nodes map `slot_name -> (key(u), content_digest(u))`. Renaming `calc_tax` to `compute_tax` moves the slot binding while `key(u)` stays invariant, enabling `rce-vc` to verify a `name-only` refactor by checking multiset equality of unit keys without re-running downstream unit tests `[E]`.

- **Structural collision hazard on identical bodies:** Because `key(u)` strips parameter and self names, two distinct functions in the same project with identical normalized token bodies and dependency keys—for example `def add_meters(x, y): return x + y` and `def add_seconds(a, b): return a + b` in untyped Python—**produce the exact same `key(u)`** `[M, E]`. While the parent module trie keeps both named slots (`add_meters` and `add_seconds`) distinct via `content_digest` (`H(body, dep_names)`), unit-key-indexed caches deduplicate them onto one node, and same-body helper functions without distinct return/unit types cannot be told apart by `key(u)` alone `[M]`.

## Limitations & Unbuilt Milestones (`§9`)

- **No external merge-conflict benchmark yet:** Replay evaluation against `git merge-ort`, `Spork`, and `Mergiraf` on real open-source merge histories (`Merge-Bench`, `CONGRA`) is an unexecuted milestone `[E]`.

- **Prototype scope gaps:** Cross-file Rust/Python dependency extraction currently resolves intra-file symbol tables only; TypeScript splitting, native Git packfile streaming (`gix` instead of loose objects), symlinks, executable mode bits, and submodules are not yet implemented in `v0.1.0` `[E]`.

## Energy & Telemetry Scope

The `317.21–365.35 uJ` single-unit admission figure is Apple M5 Max per-process `ri_energy_nj` (`L3 reported_j`, `measured_j = null`), measuring in-memory/CAS Merkle trie updates plus affected-unit checks—not full-project `cargo test` execution `[E]`.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: On-Chip Counter (reported_j)
- **Telemetry Disclosure**: Apple M5 Max subprocess ri_energy_nj L3 counter (317.2-365.4 uJ/unit admission at 100k units); measured_j = null.
- **Evidence Class**: `reported_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.00031721 J (reported_j)`
- **Sensor / Formula Scope**: Apple M5 Max Darwin proc_pid_rusage ri_energy_nj L3 per-unit trie admission counter (317.21-365.35 uJ; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Git `merge-ort` (Newren, 2021) & Khanna, Kunal & Pierce (2007):** Industrial 3-way line merge with rename heuristics and formal investigation of `diff3` `[S]`.
- **Falleri et al. (GumTree, ASE 2014), Larsén et al. (Spork, IEEE TSE 2022) & Mergiraf:** Fine-grained AST diffing and structured 3-way merge `[S]`.
- **Shapiro, Preguiça, Baquero & Zawirski (CRDTs, SSS 2011) & Mimram & Di Giusto (Pijul, 2013):** Commutative state/operation convergence and categorical patch theory `[S]`.
- **Unison Language (Chiusano & Bjarnason, 2019):** Content-addressed definitions keyed by nameless syntax hashes `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/rce-vc/](https://blog.openie.dev/posts/rce-vc/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/rce-vc/](https://research.openie.dev/papers/rce-vc/) ([PDF](https://research.openie.dev/pdfs/rce-vc.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/rce-vc-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/rce-vc-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=rce-vc)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
